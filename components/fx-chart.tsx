"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import {
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
  Line,
} from "recharts"
import { UploadCloud, X, CheckCircle2 } from "lucide-react"

const PAIRS = ["AUD/USD", "AUD/EUR", "AUD/GBP", "AUD/JPY", "AUD/NZD"] as const
export type Pair = (typeof PAIRS)[number]
const ALL_PAIRS: Pair[] = [...PAIRS]

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
  subValue,
  positive,
  loading,
}: {
  label: string
  value: string
  subValue?: string
  positive?: boolean
  loading: boolean
}) {
  return (
    <div className="h-full min-h-[66px] rounded-xl border border-[#DCE5E1] bg-[#F7F8F7] px-2.5 py-2 shadow-[0_6px_14px_rgba(18,38,31,0.08)] sm:px-3 sm:py-2.5">
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="h-2 w-2 rounded-full bg-[#74B49B] shrink-0" />
        <p className="text-[7px] sm:text-[8px] font-semibold uppercase tracking-[0.11em] text-[#52796F] leading-none">
          {label}
        </p>
      </div>
      {loading ? (
        <div className="space-y-1">
          <div className="h-4 w-16 rounded bg-[#E3EAE6] animate-pulse" />
          <div className="h-2.5 w-12 rounded bg-[#E3EAE6] animate-pulse" />
        </div>
      ) : (
        <div className="flex flex-col items-start justify-end gap-0.5 min-h-[30px]">
          <p
            className={`text-[12px] sm:text-[14px] font-black leading-none tracking-tight tabular-nums whitespace-nowrap ${
              positive === true
                ? "text-emerald-600"
                : positive === false
                ? "text-rose-500"
                : "text-[#12261F]"
            }`}
          >
            {value}
          </p>
          {subValue && (
            <p className="text-[10px] font-semibold leading-none tabular-nums text-[#52796F]">
              {subValue}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default function FxChart({ onPairChange }: FxChartProps) {
  const { status } = useSession()
  const [pair, setPair] = useState<Pair>("AUD/USD")
  const [months, setMonths] = useState(3)
  const [data, setData] = useState<ChartPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [preferredPairs, setPreferredPairs] = useState<Pair[]>([])
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [focusedOverlay, setFocusedOverlay] = useState<"high" | "low" | "average" | "personal">("high")
  const [showHigh, setShowHigh] = useState(true)
  const [showLow, setShowLow] = useState(false)
  const [showAverage, setShowAverage] = useState(false)
  const [showPersonalHedge, setShowPersonalHedge] = useState(false)

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

  useEffect(() => {
    const syncFeedFromPreferences = async () => {
      if (status !== "authenticated") {
        setPreferredPairs([])
        setShowLoginPrompt(false)
        return
      }

      try {
        const res = await fetch("/api/user/preferences")
        if (!res.ok) {
          setPreferredPairs([])
          return
        }

        const prefs = await res.json()
        const selectedCurrencies = Array.isArray(prefs?.currencies)
          ? (prefs.currencies as string[])
          : []

        const mappedPairs = ALL_PAIRS.filter((p) => selectedCurrencies.includes(p.split("/")[1]))

        setPreferredPairs(mappedPairs)
        if (mappedPairs.length && !mappedPairs.includes(pair)) {
          setPair(mappedPairs[0])
        }
      } catch {
        setPreferredPairs([])
      }
    }

    syncFeedFromPreferences()
  }, [status])

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
  const changePctLabel = `${isPositive ? "+" : ""}${changePct.toFixed(2)}%`
  const changeAbsLabel = `(${isPositive ? "+" : ""}${changeAbs.toFixed(dp)})`

  const padding = (high - low) * 0.15 || high * 0.001
  const yMin = low - padding
  const yMax = high + padding

  const overlayColor = (line: "high" | "low" | "average" | "personal") => {
    switch (line) {
      case "high":
        return focusedOverlay === "high" ? "#22c55e" : "#86efac"
      case "low":
        return focusedOverlay === "low" ? "#ef4444" : "#fca5a5"
      case "average":
        return focusedOverlay === "average" ? "#eab308" : "#facc15"
      case "personal":
        return focusedOverlay === "personal" ? "#e0e7ff" : "#c7d2fe"
      default:
        return "#52796F"
    }
  }

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
          <p className="text-[11px] text-[#A8C5BA]">
            {status === "authenticated"
              ? "Synced with your dashboard currency selections."
              : "Showing all pairs. Login to personalize your feed."}
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 mb-4">
          {PAIRS.map((p) => {
            const preferred = status === "authenticated" && preferredPairs.includes(p)
            const active = status === "authenticated" && pair === p
            return (
              <button
                key={`pair-toggle-${p}`}
                onClick={() => {
                  if (status !== "authenticated") {
                    setShowLoginPrompt(true)
                    return
                  }
                  setPair(p)
                  setShowLoginPrompt(false)
                }}
                className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-black tracking-wide transition-all ${
                  active
                    ? "bg-[#A8C5BA] text-[#113526] border-[#A8C5BA] shadow-[0_0_0_2px_rgba(168,197,186,0.18)]"
                    : preferred
                    ? "bg-[#2D6A4F] text-white border-[#74B49B] shadow-[0_0_0_2px_rgba(116,180,155,0.25)]"
                    : "bg-[#1B4332]/30 text-[#A8C5BA] border-[#2D6A4F]/40 hover:bg-[#1B4332]/50"
                }`}
                aria-pressed={active}
              >
                <span>{p.replace("AUD/", "")}</span>
              </button>
            )
          })}
        </div>

        {showLoginPrompt && status !== "authenticated" && (
          <div className="mb-4 rounded-lg border border-[#2D6A4F]/45 bg-[#0D1F19]/70 p-3 text-xs text-[#C7DED5]">
            <span className="font-semibold text-white">Login required:</span> sign in to personalize this feed from your dashboard selections.
            <Link href="/login?callbackUrl=/market-insights/digest" className="ml-2 font-bold text-[#A8C5BA] underline hover:text-white">
              Go to login
            </Link>
          </div>
        )}

      </div>

      <div className="bg-[#0D1F19]/65 rounded-2xl border border-[#2D6A4F]/40 p-3 sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between mb-4">
          <p className="text-xs sm:text-sm font-bold text-white tracking-wide">{pair} - Historical Rate</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-4">
          {/* ════════════════════════════════════════════════════════════ */}
          {/* LEFT COLUMN - STACKED: AGGREGATE RATE → UPLOAD → KEY RATES   */}
          {/* ════════════════════════════════════════════════════════════ */}
          <div className="space-y-3 flex flex-col">
            {/* AGGREGATE RATE BOX */}
            <div className="rounded-xl border border-[#DCE5E1] bg-white p-5 shadow-[0_6px_14px_rgba(18,38,31,0.08)]">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.11em] text-[#52796F]">Your Current Aggregate Rate</p>
              <p className="text-4xl font-black text-[#12261F] leading-tight mb-2">
                {portfolioConnected && personalHedgeRate ? personalHedgeRate.toFixed(dp) : "—"}
              </p>
              {!portfolioConnected && (
                <p className="text-[11px] text-[#A8C5BA]">Connect your portfolio to see your blended rate</p>
              )}
            </div>

            {/* UPLOAD SECTION - COMPACT, INLINE - MOVED BETWEEN AGGREGATE & KEY RATES */}
            {!portfolioConnected && (
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
                className={`rounded-lg border p-3 transition-all flex items-center gap-2 ${
                  isDragging ? "bg-[#1B4332] border-[#74B49B]" : "bg-[#12261F] border-[#2D6A4F]/40"
                }`}
              >
                <label className="inline-flex items-center gap-1.5 rounded-full bg-[#2D6A4F] px-3 py-1.5 text-[11px] font-bold text-white hover:bg-[#1B4332] cursor-pointer shrink-0">
                  Upload
                  <input
                    type="file"
                    className="sr-only"
                    accept=".csv,.txt,.json,.pdf"
                    onChange={(e) => handlePortfolioFile(e.target.files?.[0])}
                  />
                </label>
                <p className="text-[11px] text-[#A8C5BA] leading-tight">Drop trade confirmations to connect</p>
              </div>
            )}

            {/* KEY RATES - 2x2 GRID */}
            <div className="rounded-xl border border-[#2D6A4F]/35 bg-[#12261F]/80 p-3">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#A8C5BA]">Key Rates</p>
              <div className="grid grid-cols-2 gap-2">
                <StatCard label="Current" value={current.toFixed(dp)} loading={loading} />
                <StatCard label={`${months}M High`} value={high.toFixed(dp)} loading={loading} />
                <StatCard label={`${months}M Low`} value={low.toFixed(dp)} loading={loading} />
                <StatCard
                  label={`${months}M Change`}
                  value={loading ? "-" : changePctLabel}
                  subValue={loading ? undefined : changeAbsLabel}
                  positive={!loading ? isPositive : undefined}
                  loading={loading}
                />
              </div>
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════ */}
          {/* RIGHT COLUMN - CHART + TOGGLE BUTTONS BELOW                  */}
          {/* ════════════════════════════════════════════════════════════ */}
          <div className="space-y-3 flex flex-col">
            {portfolioConnected && (
              <div className="rounded-2xl border border-[#2D6A4F]/45 bg-[#12261F] p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
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
                  <ComposedChart data={data.map(d => ({ ...d, high, low, average }))} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
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

                    {showHigh && <Line type="monotone" dataKey="high" stroke="#22c55e" strokeWidth={3} dot={false} isAnimationActive={false} />}
                    {showLow && <Line type="monotone" dataKey="low" stroke="#ef4444" strokeWidth={3} dot={false} isAnimationActive={false} />}
                    {showAverage && <Line type="monotone" dataKey="average" stroke="#eab308" strokeWidth={3} dot={false} isAnimationActive={false} />}

                    {showHigh && (
                      <>
                        <ReferenceArea y1={high} y2={yMax} fill="#22c55e" fillOpacity={0.12} />
                      </>
                    )}

                    {showLow && (
                      <>
                        <ReferenceArea y1={yMin} y2={low} fill="#ef4444" fillOpacity={0.12} />
                      </>
                    )}

                    {showAverage && (
                      <>
                        <ReferenceArea y1={average - padding * 0.08} y2={average + padding * 0.08} fill="#eab308" fillOpacity={0.12} />
                      </>
                    )}

                    {portfolioConnected && personalHedgeRate !== null && showPersonalHedge && (
                      <ReferenceLine
                        y={personalHedgeRate}
                        stroke="#e0e7ff"
                        strokeWidth={3}
                        strokeDasharray="6 3"
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
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            )}

            <p className="text-[10px] text-[#A8C5BA]">Source: Twelve Data · Indicative rates only · Not a recommendation or offer</p>

            {/* TOGGLE BUTTONS - SINGLE ROW, COMPACT */}
            <div className="grid grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setShowHigh((v) => !v)
                  setFocusedOverlay("high")
                }}
                className={`flex items-center justify-between rounded-lg border px-2 py-1.5 text-left transition-all cursor-pointer ${
                  showHigh ? "bg-[#1B4332] border-[#22c55e]" : "bg-[#12261F] border-[#2D6A4F]/40"
                }`}
                title="Show/hide high reference line"
              >
                <span className="text-[9px] font-semibold text-[#A8C5BA] leading-tight">High</span>
                <span className={`h-2.5 w-2.5 rounded-full border-2 transition-all ${showHigh ? "bg-[#22c55e] border-[#22c55e]" : "border-[#52796F]"}`} />
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLow((v) => !v)
                  setFocusedOverlay("low")
                }}
                className={`flex items-center justify-between rounded-lg border px-2 py-1.5 text-left transition-all cursor-pointer ${
                  showLow ? "bg-[#1B4332] border-[#ef4444]" : "bg-[#12261F] border-[#2D6A4F]/40"
                }`}
                title="Show/hide low reference line"
              >
                <span className="text-[9px] font-semibold text-[#A8C5BA] leading-tight">Low</span>
                <span className={`h-2.5 w-2.5 rounded-full border-2 transition-all ${showLow ? "bg-[#ef4444] border-[#ef4444]" : "border-[#52796F]"}`} />
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAverage((v) => !v)
                  setFocusedOverlay("average")
                }}
                className={`flex items-center justify-between rounded-lg border px-2 py-1.5 text-left transition-all cursor-pointer ${
                  showAverage ? "bg-[#1B4332] border-[#eab308]" : "bg-[#12261F] border-[#2D6A4F]/40"
                }`}
                title="Show/hide average reference line"
              >
                <span className="text-[9px] font-semibold text-[#A8C5BA] leading-tight">Average</span>
                <span className={`h-2.5 w-2.5 rounded-full border-2 transition-all ${showAverage ? "bg-[#eab308] border-[#eab308]" : "border-[#52796F]"}`} />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!portfolioConnected) return
                  setShowPersonalHedge((v) => !v)
                  setFocusedOverlay("personal")
                }}
                className={`flex items-center justify-between rounded-lg border px-2 py-1.5 text-left transition-all ${
                  showPersonalHedge && portfolioConnected ? "bg-[#1B4332] border-[#e0e7ff] cursor-pointer" : "bg-[#12261F] border-[#2D6A4F]/40"
                } ${!portfolioConnected ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                title={portfolioConnected ? "Show/hide personal hedge rate line" : "Connect portfolio to enable"}
              >
                <span className="text-[9px] font-semibold text-[#A8C5BA] leading-tight">Personal</span>
                <span className={`h-2.5 w-2.5 rounded-full border-2 transition-all ${showPersonalHedge && portfolioConnected ? "bg-[#e0e7ff] border-[#e0e7ff]" : "border-[#52796F]"}`} />
              </button>
            </div>
          </div>
        </div>
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
