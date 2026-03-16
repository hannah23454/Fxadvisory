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
} from "recharts"

const PAIRS = ["AUD/USD", "AUD/EUR", "AUD/GBP", "AUD/JPY", "AUD/NZD"] as const
type Pair = (typeof PAIRS)[number]

const PERIODS = [
  { label: "3M", months: 3 },
  { label: "6M", months: 6 },
  { label: "12M", months: 12 },
]

interface ChartPoint {
  date: string
  rate: number
}

// ─── Custom Tooltip ──────────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }: {
  active?: boolean
  payload?: { value: number }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#12261F] border border-[#2D6A4F]/60 rounded-xl px-4 py-2.5 shadow-2xl">
      <p className="text-[10px] text-[#a9c5bb] uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-white font-black text-lg leading-none">
        {payload[0].value.toFixed(4)}
      </p>
    </div>
  )
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function ChartSkeleton() {
  return (
    <div className="h-[300px] sm:h-[340px] bg-gradient-to-br from-[#F5F7F6] to-[#E8EEEB] rounded-2xl border border-[#DCE5E1] animate-pulse">
      <div className="h-full flex flex-col justify-end px-6 pb-6 gap-1">
        {[40, 55, 45, 62, 50, 70, 48, 60, 44, 58].map((h, i) => (
          <div
            key={i}
            className="w-full bg-[#DCE5E1] rounded"
            style={{ height: `${h}%`, opacity: 0.3 + i * 0.07 }}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

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

// ─── Main Component ───────────────────────────────────────────────────────────

export default function FxChart() {
  const [pair, setPair] = useState<Pair>("AUD/USD")
  const [months, setMonths] = useState(3)
  const [data, setData] = useState<ChartPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

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

  // ── derived stats ──
  const rates = data.map((d) => d.rate)
  const current = rates.at(-1) ?? 0
  const first = rates[0] ?? 0
  const high = rates.length ? Math.max(...rates) : 0
  const low = rates.length ? Math.min(...rates) : 0
  const changePct = first > 0 ? ((current - first) / first) * 100 : 0
  const changeAbs = current - first
  const isPositive = changePct >= 0
  const isJpy = pair.includes("JPY")
  const dp = isJpy ? 3 : 4

  // Y-axis domain — tight band around data
  const padding = (high - low) * 0.15 || high * 0.001
  const yMin = low - padding
  const yMax = high + padding

  return (
    <div>
      {/* ── Pair pills ── */}
      <div className="flex flex-wrap gap-2 mb-6">
        {PAIRS.map((p) => (
          <button
            key={p}
            onClick={() => setPair(p)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              pair === p
                ? "bg-[#12261F] text-white shadow-sm"
                : "bg-white text-[#52796F] border border-[#DCE5E1] hover:border-[#2D6A4F] hover:text-[#2D6A4F]"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <StatCard label="Current Rate" value={current.toFixed(dp)} loading={loading} />
        <StatCard
          label={`${months}M High`}
          value={high.toFixed(dp)}
          loading={loading}
        />
        <StatCard
          label={`${months}M Low`}
          value={low.toFixed(dp)}
          loading={loading}
        />
        <StatCard
          label={`${months}M Change`}
          value={
            loading
              ? "—"
              : `${isPositive ? "+" : ""}${changePct.toFixed(2)}%  (${isPositive ? "+" : ""}${changeAbs.toFixed(dp)})`
          }
          positive={!loading ? isPositive : undefined}
          loading={false}
        />
      </div>

      {/* ── Period selector + chart ── */}
      <div className="bg-[#FAFBFA] rounded-2xl border border-[#DCE5E1] p-4 sm:p-6">
        {/* Period tabs */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm font-bold text-[#12261F]">{pair} — Historical Rate</p>
          <div className="flex gap-1.5">
            {PERIODS.map(({ label, months: m }) => (
              <button
                key={label}
                onClick={() => setMonths(m)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  months === m
                    ? "bg-[#2D6A4F] text-white shadow-sm"
                    : "bg-white text-[#52796F] border border-[#DCE5E1] hover:border-[#2D6A4F]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Chart area */}
        {loading ? (
          <ChartSkeleton />
        ) : error ? (
          <div className="h-[300px] sm:h-[340px] rounded-2xl border border-[#DCE5E1] bg-[#F5F7F6] flex flex-col items-center justify-center gap-3">
            <p className="text-sm text-[#52796F]">{error}</p>
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
                    <stop offset="0%" stopColor="#2D6A4F" stopOpacity={0.22} />
                    <stop offset="85%" stopColor="#2D6A4F" stopOpacity={0.02} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="4 4"
                  stroke="#DCE5E1"
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
                  tick={{ fontSize: 10, fill: "#52796F", fontFamily: "inherit" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => v.toFixed(isJpy ? 2 : 4)}
                  width={54}
                />

                <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#2D6A4F", strokeWidth: 1, strokeDasharray: "4 4" }} />

                <Area
                  type="monotone"
                  dataKey="rate"
                  stroke="#2D6A4F"
                  strokeWidth={2}
                  fill="url(#rateGradient)"
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: "#2D6A4F",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        <p className="text-[10px] text-[#52796F] mt-3">
          Source: Twelve Data · Indicative rates only · Not a recommendation or offer
        </p>
      </div>
    </div>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(raw: string, months: number): string {
  const d = new Date(raw)
  if (months <= 3) {
    return d.toLocaleDateString("en-AU", { day: "numeric", month: "short" })
  }
  if (months <= 6) {
    return d.toLocaleDateString("en-AU", { day: "numeric", month: "short" })
  }
  return d.toLocaleDateString("en-AU", { month: "short", year: "2-digit" })
}
