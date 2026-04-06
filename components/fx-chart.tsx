"use client"

import { useState, useEffect, useCallback } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
} from "recharts"
import { UploadCloud, X, CheckCircle2 } from "lucide-react"

const PAIRS = ["AUD/USD", "AUD/EUR", "AUD/GBP", "AUD/JPY", "AUD/NZD"] as const
export type Pair = (typeof PAIRS)[number]

const PERIODS = [
  { label: "3M", months: 3 },
  { label: "6M", months: 6 },
  { label: "12M", months: 12 },
]

interface ChartPoint {
  date: string
  rate: number
}

interface FxChartProps {
  onPairChange?: (pair: Pair) => void
}

function ChartTooltip({ active, payload, label }: {
  active?: boolean
  payload?: { value: number }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#12261F] border border-[#2D6A4F]/60 rounded-xl px-4 py-2.5 shadow-2xl">
      <p className="text-[10px] text-[#a9c5bb] uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-white font-black text-lg leading-none">{payload[0].value.toFixed(4)}</p>
    </div>
  )
}

function ChartSkeleton() {
  return (
    <div className="h-[300px] sm:h-[340px] bg-gradient-to-br from-[#F5F7F6] to-[#E8EEEB] rounded-2xl border border-[#DCE5E1] animate-pulse" />
  )
}

function StatCard({
  label,
  value,
  positive,
  loading,
}: {
  label: string
  value: string
  positive?: boolean
  loading: boolean
}) {
  return (
    <div className="bg-[#F5F7F6] rounded-xl border border-[#DCE5E1] p-3 sm:p-4">
      <p className="text-[10px] text-[#52796F] uppercase tracking-[0.1em] mb-1 font-medium">{label}</p>
      {loading ? (
        <div className="h-5 w-16 bg-[#DCE5E1] rounded animate-pulse" />
      ) : (
        <p
          className={`text-sm sm:text-base font-black leading-none ${
            positive === true
              ? "text-emerald-600"
              : positive === false
              ? "text-rose-500"
              : "text-[#12261F]"
          }`}
        >
          {value}
        </p>
      )}
    </div>
  )
}

export default function FxChart({ onPairChange }: FxChartProps) {
  const [pair, setPair] = useState<Pair>("AUD/USD")
  const [months, setMonths] = useState(3)
  const [data, setData] = useState<ChartPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [feedPairs, setFeedPairs] = useState<Pair[]>(["AUD/USD", "AUD/EUR", "AUD/JPY"])
  const [focusedOverlay, setFocusedOverlay] = useState<"high" | "low" | "average" | "personal">("average")
  const [showHigh, setShowHigh] = useState(true)
  const [showLow, setShowLow] = useState(true)
  const [showAverage, setShowAverage] = useState(true)
  const [showPersonalHedge, setShowPersonalHedge] = useState(true)

  const [isDragging, setIsDragging] = useState(false)
  const [portfolioConnected, setPortfolioConnected] = useState(false)
  const [personalHedgeRate, setPersonalHedgeRate] = useState<number | null>(null)
  const [portfolioMessage, setPortfolioMessage] = useState("Drop trade confirmations and we will map your blended hedge rate automatically.")

  useEffect(() => {
    const storedRate = typeof window !== "undefined" ? localStorage.getItem("digest-personal-hedge-rate") : null
    if (storedRate) {
      const parsed = Number(storedRate)
      if (!Number.isNaN(parsed) && parsed > 0) {
        setPersonalHedgeRate(parsed)
        setPortfolioConnected(true)
      }
    }
  }, [])

  useEffect(() => {
    onPairChange?.(pair)
  }, [pair, onPairChange])

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/fx/historical?pair=${encodeURIComponent(pair)}&months=${months}`)
      const json = await res.json()
      if (!res.ok || json.error) {
        setError(json.error ?? "Failed to load chart data")
        return
      }
      const isJpy = pair.includes("JPY")
      setData(
        (json.dates as string[]).map((raw: string, i: number) => ({
          date: formatDate(raw, months),
          rate: parseFloat((json.rates[i] as number).toFixed(isJpy ? 3 : 4)),
        }))
      )
    } catch {
      setError("Unable to load chart data. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [pair, months])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const rates = data.map((d) => d.rate)
  const current = rates.at(-1) ?? 0
  const first = rates[0] ?? 0
  const high = rates.length ? Math.max(...rates) : 0
  const low = rates.length ? Math.min(...rates) : 0
  const average = rates.length ? (high + low) / 2 : 0
  const changePct = first > 0 ? ((current - first) / first) * 100 : 0
  const changeAbs = current - first
  const isPositive = changePct >= 0
  const isJpy = pair.includes("JPY")
  const dp = isJpy ? 3 : 4

  const padding = (high - low) * 0.15 || high * 0.001
  const yMin = low - padding
  const yMax = high + padding

  const toggleFeedPair = (selected: Pair) => {
    setFeedPairs((prev) => {
      if (prev.includes(selected)) {
        if (prev.length === 1) return prev
        const next = prev.filter((p) => p !== selected)
        if (pair === selected) setPair(next[0])
        return next
      }
      return [...prev, selected]
    })
  }

  const overlayColor = (line: "high" | "low" | "average" | "personal") =>
    focusedOverlay === line ? "#113526" : "#52796F"

  const handlePortfolioFile = async (file?: File) => {
    if (!file) return
    try {
      const text = await file.text()
      const matches = text.match(/\b\d{1,3}(?:\.\d{1,6})?\b/g) ?? []
      const values = matches
        .map((value) => Number(value))
        .filter((value) => !Number.isNaN(value) && value > 0)

      if (!values.length) {
        setPortfolioMessage("We could not detect rates in that file. Try another confirmation and we will parse it instantly.")
        return
      }

      const blended = values.reduce((sum, value) => sum + value, 0) / values.length
      setPersonalHedgeRate(blended)
      setPortfolioConnected(true)
      setShowPersonalHedge(true)
      setFocusedOverlay("personal")
      localStorage.setItem("digest-personal-hedge-rate", blended.toString())
      setPortfolioMessage(`Portfolio synced from ${file.name}. We detected ${values.length} rates and calculated your blended hedge rate.`)
    } catch {
      setPortfolioMessage("Upload failed. Drop the file again and we will retry automatically.")
    }
  }

  const clearPortfolio = () => {
    setPortfolioConnected(false)
    setPersonalHedgeRate(null)
    localStorage.removeItem("digest-personal-hedge-rate")
    setPortfolioMessage("Portfolio disconnected. Drop confirmations to reconnect.")
  }

  return (
    <div>
      <div className="mb-6 rounded-2xl border border-[#2D6A4F]/35 bg-[#12261F]/60 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#A8C5BA]">Your Currency Feed</p>
          <p className="text-[11px] text-[#A8C5BA]">Toggle bubbles to add or remove currency pairs.</p>
        </div>

        <div className="flex flex-wrap gap-3 mb-4">
          {PAIRS.map((p) => {
            const enabled = feedPairs.includes(p)
            return (
              <button
                key={`bubble-${p}`}
                onClick={() => toggleFeedPair(p)}
                className={`relative h-14 w-14 sm:h-16 sm:w-16 rounded-full text-[10px] font-black tracking-wide transition-all ${
                  enabled
                    ? "bg-[#2D6A4F] text-white border-2 border-[#74B49B] shadow-[0_0_0_2px_rgba(116,180,155,0.25)]"
                    : "bg-[#1B4332]/30 text-[#A8C5BA] border border-[#2D6A4F]/40 hover:bg-[#1B4332]/50"
                }`}
                aria-pressed={enabled}
              >
                <span className="block leading-tight">{p.replace("AUD/", "")}</span>
                <span className="absolute -right-1.5 -top-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#0D1F19] border border-[#2D6A4F]/60 text-[10px]">
                  {enabled ? "-" : "+"}
                </span>
              </button>
            )
          })}
        </div>

        <div className="flex flex-wrap gap-2">
          {feedPairs.map((p) => (
            <button
              key={p}
              onClick={() => setPair(p)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                pair === p
                  ? "bg-[#A8C5BA] text-[#113526]"
                  : "bg-[#0D1F19] text-[#A8C5BA] border border-[#2D6A4F]/45 hover:border-[#74B49B]"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <StatCard label="Current Rate" value={current.toFixed(dp)} loading={loading} />
        <StatCard label={`${months}M High`} value={high.toFixed(dp)} loading={loading} />
        <StatCard label={`${months}M Low`} value={low.toFixed(dp)} loading={loading} />
        <StatCard
          label={`${months}M Change`}
          value={
            loading
              ? "-"
              : `${isPositive ? "+" : ""}${changePct.toFixed(2)}%  (${isPositive ? "+" : ""}${changeAbs.toFixed(dp)})`
          }
          positive={!loading ? isPositive : undefined}
          loading={false}
        />
      </div>

      <div className="bg-[#0D1F19]/65 rounded-2xl border border-[#2D6A4F]/40 p-4 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-5">
          <p className="text-sm font-bold text-white">{pair} - Historical Rate</p>
          <div className="flex gap-1.5">
            {PERIODS.map(({ label, months: m }) => (
              <button
                key={label}
                onClick={() => setMonths(m)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  months === m
                    ? "bg-[#2D6A4F] text-white shadow-sm"
                    : "bg-[#12261F] text-[#A8C5BA] border border-[#2D6A4F]/40 hover:border-[#74B49B]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          <button
            onClick={() => {
              setShowHigh((v) => !v)
              setFocusedOverlay("high")
            }}
            className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-left transition-all ${
              showHigh ? "bg-[#1B4332] border-[#74B49B]" : "bg-[#12261F] border-[#2D6A4F]/40"
            }`}
          >
            <span className="text-xs font-semibold text-[#A8C5BA]">High Line</span>
            <span className={`h-4 w-4 rounded-full border ${showHigh ? "bg-[#74B49B] border-[#74B49B]" : "border-[#52796F]"}`} />
          </button>
          <button
            onClick={() => {
              setShowLow((v) => !v)
              setFocusedOverlay("low")
            }}
            className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-left transition-all ${
              showLow ? "bg-[#1B4332] border-[#74B49B]" : "bg-[#12261F] border-[#2D6A4F]/40"
            }`}
          >
            <span className="text-xs font-semibold text-[#A8C5BA]">Low Line</span>
            <span className={`h-4 w-4 rounded-full border ${showLow ? "bg-[#74B49B] border-[#74B49B]" : "border-[#52796F]"}`} />
          </button>
          <button
            onClick={() => {
              setShowAverage((v) => !v)
              setFocusedOverlay("average")
            }}
            className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-left transition-all ${
              showAverage ? "bg-[#1B4332] border-[#74B49B]" : "bg-[#12261F] border-[#2D6A4F]/40"
            }`}
          >
            <span className="text-xs font-semibold text-[#A8C5BA]">Average Line</span>
            <span className={`h-4 w-4 rounded-full border ${showAverage ? "bg-[#74B49B] border-[#74B49B]" : "border-[#52796F]"}`} />
          </button>
          <button
            onClick={() => {
              if (!portfolioConnected) return
              setShowPersonalHedge((v) => !v)
              setFocusedOverlay("personal")
            }}
            className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-left transition-all ${
              showPersonalHedge && portfolioConnected ? "bg-[#1B4332] border-[#74B49B]" : "bg-[#12261F] border-[#2D6A4F]/40"
            } ${!portfolioConnected ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            <span className="text-xs font-semibold text-[#A8C5BA]">Personal Hedge Rate</span>
            <span className={`h-4 w-4 rounded-full border ${showPersonalHedge && portfolioConnected ? "bg-[#74B49B] border-[#74B49B]" : "border-[#52796F]"}`} />
          </button>
        </div>

        {!portfolioConnected ? (
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault()
              setIsDragging(false)
              handlePortfolioFile(e.dataTransfer.files?.[0])
            }}
            className={`mb-5 rounded-2xl border p-4 sm:p-5 transition-all ${
              isDragging ? "bg-[#1B4332] border-[#74B49B]" : "bg-[#12261F] border-[#2D6A4F]/40"
            }`}
          >
            <div className="flex items-start gap-3">
              <UploadCloud className="h-5 w-5 text-[#A8C5BA] shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-bold text-white mb-1">No portfolio connected yet</p>
                <p className="text-xs text-[#A8C5BA] leading-relaxed mb-3">
                  Drag and drop trade confirmations and we do the work for you. We parse and reflect your blended hedge rate automatically.
                </p>
                <label className="inline-flex items-center gap-2 rounded-full bg-[#2D6A4F] px-4 py-2 text-xs font-bold text-white hover:bg-[#1B4332] cursor-pointer">
                  Upload confirmations
                  <input
                    type="file"
                    className="sr-only"
                    accept=".csv,.txt,.json,.pdf"
                    onChange={(e) => handlePortfolioFile(e.target.files?.[0])}
                  />
                </label>
              </div>
            </div>
            <p className="mt-3 text-[11px] text-[#A8C5BA]">{portfolioMessage}</p>
          </div>
        ) : (
          <div className="mb-5 rounded-2xl border border-[#2D6A4F]/45 bg-[#12261F] p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-[#74B49B]" />
              <div>
                <p className="text-sm font-bold text-white">Portfolio connected</p>
                <p className="text-xs text-[#A8C5BA]">Aggregate hedge rate: {personalHedgeRate?.toFixed(dp)}</p>
              </div>
            </div>
            <button
              onClick={clearPortfolio}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#2D6A4F]/60 px-3 py-1.5 text-xs font-bold text-[#A8C5BA] hover:bg-[#1B4332]"
            >
              <X className="h-3.5 w-3.5" />
              Disconnect
            </button>
          </div>
        )}

        {loading ? (
          <ChartSkeleton />
        ) : error ? (
          <div className="h-[300px] sm:h-[340px] rounded-2xl border border-[#2D6A4F]/40 bg-[#12261F] flex flex-col items-center justify-center gap-3">
            <p className="text-sm text-[#A8C5BA]">{error}</p>
            <button
              onClick={fetchData}
              className="px-4 py-2 rounded-lg bg-[#2D6A4F] text-white text-xs font-bold hover:bg-[#1B4332] transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="h-[300px] sm:h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="rateGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#74B49B" stopOpacity={0.28} />
                    <stop offset="85%" stopColor="#74B49B" stopOpacity={0.04} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="4 4" stroke="#2D6A4F" strokeOpacity={0.35} vertical={false} />

                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: "#A8C5BA", fontFamily: "inherit" }}
                  axisLine={false}
                  tickLine={false}
                  interval="preserveStartEnd"
                  minTickGap={40}
                />

                <YAxis
                  domain={[yMin, yMax]}
                  tick={{ fontSize: 10, fill: "#A8C5BA", fontFamily: "inherit" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => v.toFixed(isJpy ? 2 : 4)}
                  width={54}
                />

                <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#74B49B", strokeWidth: 1, strokeDasharray: "4 4" }} />

                {showHigh && (
                  <>
                    <ReferenceArea y1={high} y2={yMax} fill="#74B49B" fillOpacity={0.08} />
                    <ReferenceLine y={high} stroke={overlayColor("high")} strokeWidth={focusedOverlay === "high" ? 2.5 : 1.6} strokeDasharray="4 4" />
                  </>
                )}

                {showLow && (
                  <>
                    <ReferenceArea y1={yMin} y2={low} fill="#74B49B" fillOpacity={0.08} />
                    <ReferenceLine y={low} stroke={overlayColor("low")} strokeWidth={focusedOverlay === "low" ? 2.5 : 1.6} strokeDasharray="4 4" />
                  </>
                )}

                {showAverage && (
                  <>
                    <ReferenceArea y1={average - padding * 0.08} y2={average + padding * 0.08} fill="#74B49B" fillOpacity={0.1} />
                    <ReferenceLine y={average} stroke={overlayColor("average")} strokeWidth={focusedOverlay === "average" ? 2.5 : 1.6} />
                  </>
                )}

                {portfolioConnected && personalHedgeRate !== null && showPersonalHedge && (
                  <ReferenceLine
                    y={personalHedgeRate}
                    stroke={overlayColor("personal")}
                    strokeWidth={focusedOverlay === "personal" ? 2.6 : 1.8}
                    strokeDasharray="6 3"
                    label={{ value: "Personal Hedge", fill: "#A8C5BA", fontSize: 10 }}
                  />
                )}

                <Area
                  type="monotone"
                  dataKey="rate"
                  stroke="#74B49B"
                  strokeWidth={2}
                  fill="url(#rateGradient)"
                  dot={false}
                  activeDot={{ r: 5, fill: "#74B49B", stroke: "#fff", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        <p className="text-[10px] text-[#A8C5BA] mt-3">Source: Twelve Data · Indicative rates only · Not a recommendation or offer</p>
      </div>
    </div>
  )
}

function formatDate(raw: string, months: number): string {
  const d = new Date(raw)
  if (months <= 6) {
    return d.toLocaleDateString("en-AU", { day: "numeric", month: "short" })
  }
  return d.toLocaleDateString("en-AU", { month: "short", year: "2-digit" })
}
