"use client"

import { useState, useEffect, useCallback, useRef } from "react"
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
import { X, CheckCircle2, AlertCircle } from "lucide-react"

const PAIRS = ["AUD/USD", "AUD/EUR", "AUD/GBP", "AUD/JPY", "AUD/NZD"] as const
export type Pair = (typeof PAIRS)[number]
const ALL_PAIRS: Pair[] = [...PAIRS]

const PERIODS = [
  { label: "3M", months: 3 },
  { label: "6M", months: 6 },
  { label: "12M", months: 12 },
]

const COUNTRY_MAP: Record<string, string> = {
  USD: "us",
  EUR: "eu",
  GBP: "gb",
  JPY: "jp",
  NZD: "nz",
  AUD: "au",
  CAD: "ca",
  CNY: "cn",
  SGD: "sg",
  HKD: "hk",
  INR: "in",
  MXN: "mx",
}

const flagFor = (currency: string) =>
  COUNTRY_MAP[currency] || currency.toLowerCase().slice(0, 2)

interface ChartPoint {
  date: string
  rate: number
}

interface FxChartProps {
  onPairChange?: (pair: Pair) => void
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { value: number }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-[#DCE5E1] rounded-xl px-4 py-2.5 shadow-[0_8px_24px_rgba(18,38,31,0.12)]">
      <p className="text-[10px] text-[#52796F] uppercase tracking-wide mb-0.5 font-semibold">
        {label}
      </p>
      <p className="text-[#12261F] font-black text-lg leading-none tabular-nums">
        {payload[0].value.toFixed(4)}
      </p>
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

  // preferredPairs is the SINGLE source of truth for the pill list.
  // Initialized from localStorage for unauthenticated users, synced from API for authenticated ones.
  const [preferredPairs, setPreferredPairs] = useState<Pair[]>([...PAIRS])
  const [focusedOverlay, setFocusedOverlay] = useState<"high" | "low" | "average" | "personal">("high")
  const [showHigh, setShowHigh] = useState(true)
  const [showLow, setShowLow] = useState(false)
  const [showAverage, setShowAverage] = useState(false)
  const [showPersonalHedge, setShowPersonalHedge] = useState(false)

  const [isDragging, setIsDragging] = useState(false)
  const [portfolioConnected, setPortfolioConnected] = useState(false)
  const [personalHedgeRate, setPersonalHedgeRate] = useState<number | null>(null)
  const [portfolioMessage, setPortfolioMessage] = useState(
    "Drop trade confirmations and we will map your blended hedge rate automatically."
  )

  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false)
  const currencyDropdownRef = useRef<HTMLDivElement>(null)

  // Hydrate personal hedge rate + local pair preferences from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return

    const storedRate = localStorage.getItem("digest-personal-hedge-rate")
    if (storedRate) {
      const parsed = Number(storedRate)
      if (!Number.isNaN(parsed) && parsed > 0) {
        setPersonalHedgeRate(parsed)
        setPortfolioConnected(true)
      }
    }

    const storedPairs = localStorage.getItem("digest-preferred-pairs")
    if (storedPairs) {
      try {
        const parsed = JSON.parse(storedPairs) as string[]
        const valid = parsed.filter((p): p is Pair =>
          (ALL_PAIRS as string[]).includes(p)
        )
        if (valid.length) setPreferredPairs(valid)
      } catch {
        // ignore malformed JSON
      }
    }
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        currencyDropdownRef.current &&
        !currencyDropdownRef.current.contains(event.target as Node)
      ) {
        setShowCurrencyDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    onPairChange?.(pair)
  }, [pair, onPairChange])

  // Sync preferredPairs from server when authenticated
  useEffect(() => {
    const syncFromServer = async () => {
      if (status !== "authenticated") return

      try {
        const res = await fetch("/api/user/preferences")
        if (!res.ok) return

        const prefs = await res.json()
        const selectedCurrencies = Array.isArray(prefs?.currencies)
          ? (prefs.currencies as string[])
          : []

        const mapped = ALL_PAIRS.filter((p) =>
          selectedCurrencies.includes(p.split("/")[1])
        )
        if (mapped.length) {
          setPreferredPairs(mapped)
          if (!mapped.includes(pair)) setPair(mapped[0])
        }
      } catch {
        // keep local state on failure
      }
    }
    syncFromServer()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch(
        `/api/fx/historical?pair=${encodeURIComponent(pair)}&months=${months}`
      )
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

  const handlePortfolioFile = async (file?: File) => {
    if (!file) return
    try {
      const text = await file.text()
      const matches = text.match(/\b\d{1,3}(?:\.\d{1,6})?\b/g) ?? []
      const values = matches
        .map((value) => Number(value))
        .filter((value) => !Number.isNaN(value) && value > 0)

      if (!values.length) {
        setPortfolioMessage(
          "We could not detect rates in that file. Try another confirmation and we will parse it instantly."
        )
        return
      }

      const blended = values.reduce((sum, value) => sum + value, 0) / values.length
      setPersonalHedgeRate(blended)
      setPortfolioConnected(true)
      setShowPersonalHedge(true)
      setFocusedOverlay("personal")
      localStorage.setItem("digest-personal-hedge-rate", blended.toString())
      setPortfolioMessage(
        `Portfolio synced from ${file.name}. We detected ${values.length} rates and calculated your blended hedge rate.`
      )
    } catch {
      setPortfolioMessage(
        "Upload failed. Drop the file again and we will retry automatically."
      )
    }
  }

  const clearPortfolio = () => {
    setPortfolioConnected(false)
    setPersonalHedgeRate(null)
    localStorage.removeItem("digest-personal-hedge-rate")
    setPortfolioMessage(
      "Portfolio disconnected. Drop confirmations to reconnect."
    )
  }

  // Single source of truth: operates on preferredPairs directly.
  // Persists to localStorage always, and to the server when authenticated.
  const toggleCurrencyInFeed = async (p: Pair) => {
    const previous = preferredPairs
    const isInFeed = previous.includes(p)
    const next = isInFeed
      ? previous.filter((pp) => pp !== p)
      : ALL_PAIRS.filter((ap) => previous.includes(ap) || ap === p)

    setPreferredPairs(next)
    if (next.length && !next.includes(pair)) setPair(next[0])

    // Local persistence (works for everyone)
    try {
      localStorage.setItem("digest-preferred-pairs", JSON.stringify(next))
    } catch {
      // ignore quota errors
    }

    // Server persistence for authenticated users
    if (status === "authenticated") {
      try {
        const quotes = next.map((pp) => pp.split("/")[1])
        const res = await fetch("/api/user/preferences", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currencies: ["AUD", ...quotes] }),
        })
        if (!res.ok) throw new Error("save failed")
      } catch {
        setPreferredPairs(previous) // rollback on server failure
      }
    }
  }

  const switchPairs = preferredPairs
  const setSwitchPairs = setPreferredPairs
  const ALL_CURRENCIES: Pair[] = [...ALL_PAIRS]

  return (
    <div>
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 1. CURRENCY FEED HEADER                                             */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="mb-3 rounded-2xl border border-[#2D6A4F]/30 px-5 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#52796F] mb-1">
              Your Currency Feed
            </p>
            <h3 className="text-[#12261F] font-black text-xl sm:text-2xl leading-tight tracking-tight">
              {pair}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#2D6A4F] opacity-60 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2D6A4F]" />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#52796F]">
              Live
            </span>
          </div>
        </div>
      </div>

      <div className="my-2 h-px bg-[#B8C6C0]" />

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 2. CHART AREA                                                       */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="rounded-2xl border border-[#2D6A4F]/25 p-4 sm:p-5">
        <div className="flex flex-row items-center justify-between mb-4">
          <h1 className="text-sm sm:text-base font-bold text-[#52796F] tracking-wide">
            Historical Rate
          </h1>
          <div className="flex gap-1.5">
            {PERIODS.map(({ label, months: m }) => (
              <button
                key={label}
                onClick={() => setMonths(m)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  months === m
                    ? "bg-[#2D6A4F] text-white shadow-sm"
                    : "bg-white text-[#52796F] border border-[#DCE5E1] hover:border-[#74B49B] hover:text-[#2D6A4F]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <hr className="border-[#2D6A4F]/15 mb-4" />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-4">
          {/* LEFT COLUMN */}
          <div className="space-y-3 flex flex-col">
            <div
              className={`rounded-xl border p-5 transition-all ${
                portfolioConnected
                  ? "border-[#74B49B]/60 bg-white shadow-[0_4px_12px_rgba(18,38,31,0.08)]"
                  : "border-[#DCE5E1] bg-white shadow-[0_4px_12px_rgba(18,38,31,0.06)]"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.11em] text-[#52796F]">
                  Your Current Aggregate Rate
                </p>
                {!portfolioConnected && (
                  <span
                    className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-rose-500 text-white shrink-0"
                    title="Connect your portfolio to see your blended rate"
                  >
                    <AlertCircle className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </span>
                )}
              </div>

              {portfolioConnected && personalHedgeRate ? (
                <>
                  <p className="text-5xl font-black text-[#12261F] leading-none tracking-tight tabular-nums">
                    {personalHedgeRate.toFixed(dp)}
                  </p>
                  <p className="mt-2 text-[11px] font-semibold text-[#2D6A4F]">
                    Blended rate from your portfolio
                  </p>
                </>
              ) : (
                <>
                  <p className="text-5xl font-black text-[#C7CDC9] leading-none tracking-tight tabular-nums">
                    —
                  </p>
                  <p className="mt-2 text-[11px] text-rose-600 font-semibold leading-snug">
                    Not connected — upload trades to activate
                  </p>
                </>
              )}
            </div>

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
                className={`rounded-xl border p-3 transition-all flex items-center gap-2.5 ${
                  isDragging
                    ? "bg-[#74B49B]/15 border-[#74B49B]"
                    : "bg-white/70 border-[#DCE5E1] border-dashed"
                }`}
              >
                <label className="inline-flex items-center gap-1.5 rounded-full bg-[#2D6A4F] px-3.5 py-1.5 text-[11px] font-bold text-white hover:bg-[#1B4332] cursor-pointer shrink-0 transition-colors">
                  Upload
                  <input
                    type="file"
                    className="sr-only"
                    accept=".csv,.txt,.json,.pdf"
                    onChange={(e) => handlePortfolioFile(e.target.files?.[0])}
                  />
                </label>
                <p className="text-[11px] text-[#52796F] leading-tight">
                  {portfolioMessage}
                </p>
              </div>
            )}

            <div className="rounded-xl border border-[#DCE5E1] bg-white/70 p-3 shadow-[0_2px_8px_rgba(18,38,31,0.04)]">
              <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#52796F]">
                Key Rates
              </p>
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

          {/* RIGHT COLUMN */}
          <div className="space-y-3 flex flex-col">
            <div className="relative rounded-xl border border-[#DCE5E1] bg-[#FAFBFA] px-3 py-2.5">
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#52796F] mb-2">
                Switch pair
              </p>
              <div className="flex flex-wrap items-center gap-1.5">
                {switchPairs.map((curr) => (
                  <div
                    key={curr}
                    className={`inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full text-[11px] font-medium border transition-all cursor-pointer ${
                      curr === pair
                        ? "bg-[#2D6A4F] text-white border-[#2D6A4F] shadow-sm"
                        : "bg-white text-[#12261F] border-[#DCE5E1] hover:border-[#74B49B] hover:text-[#2D6A4F] hover:shadow-sm"
                    }`}
                    onClick={() => setPair(curr)}
                  >
                    {curr}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        const remaining = switchPairs.filter((c) => c !== curr)
                        setSwitchPairs(remaining)
                        if (curr === pair && remaining.length > 0) setPair(remaining[0])
                      }}
                      className={`rounded-full p-0.5 transition-all ${
                        curr === pair ? "hover:bg-white/20" : "hover:bg-[#E8EEEB]"
                      }`}
                    >
                      <X size={10} className={curr === pair ? "text-white" : "text-[#52796F]"} />
                    </button>
                  </div>
                ))}
                <div className="relative" ref={currencyDropdownRef}>
                  <button
                    onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border border-dashed bg-white text-[#52796F] border-[#C5CCC9] hover:border-[#9CA3A3] hover:text-[#12261F] transition-all"
                  >
                    + Add
                  </button>
                  {showCurrencyDropdown && (
                    <div className="absolute top-full left-0 mt-1.5 bg-white border border-[#DCE5E1] rounded-lg shadow-lg z-50 min-w-[130px]">
                      <div className="max-h-48 overflow-y-auto p-1.5">
                        {ALL_CURRENCIES.filter((c) => !switchPairs.includes(c)).length === 0 ? (
                          <p className="text-[11px] text-[#52796F] text-center py-2">All added</p>
                        ) : (
                          ALL_CURRENCIES.filter((c) => !switchPairs.includes(c)).map((curr) => (
                            <button
                              key={curr}
                              onClick={() => {
                                setSwitchPairs([...switchPairs, curr])
                                if (ALL_CURRENCIES.filter((c) => !switchPairs.includes(c)).length === 1) {
                                  setShowCurrencyDropdown(false)
                                }
                              }}
                              className="w-full text-left px-2.5 py-2 rounded text-[12px] font-medium text-[#4A5A55] hover:bg-[#F5F7F6] hover:text-[#2D6A4F] transition-all"
                            >
                              {curr}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {portfolioConnected && (
              <div className="rounded-xl border border-[#74B49B]/40 bg-[#74B49B]/10 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-[#2D6A4F]" />
                  <div>
                    <p className="text-sm font-bold text-[#12261F]">Portfolio connected</p>
                    <p className="text-xs text-[#52796F]">
                      Aggregate hedge rate: {personalHedgeRate?.toFixed(dp)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={clearPortfolio}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#2D6A4F]/40 px-3 py-1.5 text-xs font-bold text-[#52796F] hover:bg-white/60 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                  Disconnect
                </button>
              </div>
            )}

            {loading ? (
              <ChartSkeleton />
            ) : error ? (
              <div className="h-[300px] sm:h-[340px] rounded-xl border border-[#DCE5E1] bg-white/70 flex flex-col items-center justify-center gap-3">
                <p className="text-sm text-[#52796F]">{error}</p>
                <button
                  onClick={fetchData}
                  className="px-4 py-2 rounded-lg bg-[#2D6A4F] text-white text-xs font-bold hover:bg-[#1B4332] transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="h-[300px] sm:h-[340px] rounded-xl bg-white/40 p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={data.map((d) => ({ ...d, high, low, average }))}
                    margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
                  >
                    <defs>
                      <linearGradient id="rateGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2D6A4F" stopOpacity={0.22} />
                        <stop offset="85%" stopColor="#2D6A4F" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      strokeDasharray="4 4"
                      stroke="#2D6A4F"
                      strokeOpacity={0.12}
                      vertical={false}
                    />

                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10, fill: "#52796F", fontFamily: "inherit" }}
                      axisLine={false}
                      tickLine={false}
                      interval="preserveStartEnd"
                      minTickGap={40}
                    />

                    <YAxis
                      domain={[yMin, yMax]}
                      tickCount={8}
                      tick={{ fontSize: 10, fill: "#52796F", fontFamily: "inherit" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v: number) => v.toFixed(isJpy ? 2 : 4)}
                      width={54}
                    />

                    <Tooltip
                      content={<ChartTooltip />}
                      cursor={{ stroke: "#2D6A4F", strokeWidth: 1, strokeDasharray: "4 4" }}
                    />

                    {showHigh && (
                      <Line
                        type="monotone"
                        dataKey="high"
                        stroke="#16a34a"
                        strokeWidth={1.5}
                        strokeOpacity={0.6}
                        strokeDasharray="5 4"
                        dot={false}
                        isAnimationActive={false}
                      />
                    )}
                    {showLow && (
                      <Line
                        type="monotone"
                        dataKey="low"
                        stroke="#dc2626"
                        strokeWidth={1.5}
                        strokeOpacity={0.6}
                        strokeDasharray="5 4"
                        dot={false}
                        isAnimationActive={false}
                      />
                    )}
                    {showAverage && (
                      <Line
                        type="monotone"
                        dataKey="average"
                        stroke="#ca8a04"
                        strokeWidth={1.5}
                        strokeOpacity={0.6}
                        strokeDasharray="5 4"
                        dot={false}
                        isAnimationActive={false}
                      />
                    )}

                    {showHigh && (
                      <ReferenceArea y1={high} y2={yMax} fill="#16a34a" fillOpacity={0.05} />
                    )}
                    {showLow && (
                      <ReferenceArea y1={yMin} y2={low} fill="#dc2626" fillOpacity={0.05} />
                    )}
                    {showAverage && (
                      <ReferenceArea
                        y1={average - padding * 0.08}
                        y2={average + padding * 0.08}
                        fill="#ca8a04"
                        fillOpacity={0.05}
                      />
                    )}

                    {portfolioConnected && personalHedgeRate !== null && showPersonalHedge && (
                      <ReferenceLine
                        y={personalHedgeRate}
                        stroke="#6366f1"
                        strokeWidth={1.5}
                        strokeOpacity={0.7}
                        strokeDasharray="6 3"
                      />
                    )}

                    <Area
                      type="monotone"
                      dataKey="rate"
                      stroke="#2D6A4F"
                      strokeWidth={2}
                      fill="url(#rateGradient)"
                      dot={false}
                      activeDot={{ r: 5, fill: "#2D6A4F", stroke: "#fff", strokeWidth: 2 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            )}

            <p className="text-[10px] text-[#52796F]">
              Source: Twelve Data · Indicative rates only · Not a recommendation or offer
            </p>

            <div className="grid grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setShowHigh((v) => !v)
                  setFocusedOverlay("high")
                }}
                className={`flex items-center justify-between rounded-lg border px-2.5 py-1.5 text-left transition-all cursor-pointer ${
                  showHigh
                    ? "bg-[#16a34a]/10 border-[#16a34a]/50"
                    : "bg-white/60 border-[#DCE5E1] hover:border-[#74B49B]"
                }`}
                title="Show/hide high reference line"
              >
                <span
                  className={`text-[10px] font-semibold leading-tight ${
                    showHigh ? "text-[#16a34a]" : "text-[#52796F]"
                  }`}
                >
                  High
                </span>
                <span
                  className={`h-1.5 w-1.5 rounded-full transition-all ${
                    showHigh ? "bg-[#16a34a]" : "bg-[#C7CDC9]"
                  }`}
                />
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLow((v) => !v)
                  setFocusedOverlay("low")
                }}
                className={`flex items-center justify-between rounded-lg border px-2.5 py-1.5 text-left transition-all cursor-pointer ${
                  showLow
                    ? "bg-[#dc2626]/10 border-[#dc2626]/50"
                    : "bg-white/60 border-[#DCE5E1] hover:border-[#74B49B]"
                }`}
                title="Show/hide low reference line"
              >
                <span
                  className={`text-[10px] font-semibold leading-tight ${
                    showLow ? "text-[#dc2626]" : "text-[#52796F]"
                  }`}
                >
                  Low
                </span>
                <span
                  className={`h-1.5 w-1.5 rounded-full transition-all ${
                    showLow ? "bg-[#dc2626]" : "bg-[#C7CDC9]"
                  }`}
                />
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAverage((v) => !v)
                  setFocusedOverlay("average")
                }}
                className={`flex items-center justify-between rounded-lg border px-2.5 py-1.5 text-left transition-all cursor-pointer ${
                  showAverage
                    ? "bg-[#ca8a04]/10 border-[#ca8a04]/50"
                    : "bg-white/60 border-[#DCE5E1] hover:border-[#74B49B]"
                }`}
                title="Show/hide average reference line"
              >
                <span
                  className={`text-[10px] font-semibold leading-tight ${
                    showAverage ? "text-[#ca8a04]" : "text-[#52796F]"
                  }`}
                >
                  Average
                </span>
                <span
                  className={`h-1.5 w-1.5 rounded-full transition-all ${
                    showAverage ? "bg-[#ca8a04]" : "bg-[#C7CDC9]"
                  }`}
                />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!portfolioConnected) return
                  setShowPersonalHedge((v) => !v)
                  setFocusedOverlay("personal")
                }}
                className={`flex items-center justify-between rounded-lg border px-2.5 py-1.5 text-left transition-all ${
                  showPersonalHedge && portfolioConnected
                    ? "bg-[#6366f1]/10 border-[#6366f1]/50 cursor-pointer"
                    : "bg-white/60 border-[#DCE5E1]"
                } ${
                  !portfolioConnected
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer hover:border-[#74B49B]"
                }`}
                title={
                  portfolioConnected
                    ? "Show/hide personal hedge rate line"
                    : "Connect portfolio to enable"
                }
              >
                <span
                  className={`text-[10px] font-semibold leading-tight ${
                    showPersonalHedge && portfolioConnected
                      ? "text-[#6366f1]"
                      : "text-[#52796F]"
                  }`}
                >
                  Personal
                </span>
                <span
                  className={`h-1.5 w-1.5 rounded-full transition-all ${
                    showPersonalHedge && portfolioConnected ? "bg-[#6366f1]" : "bg-[#C7CDC9]"
                  }`}
                />
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