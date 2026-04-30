"use client"

import { useState, useMemo } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { ArrowUpRight, ArrowDownRight, ShieldCheck } from "lucide-react"

const CURRENCIES = ["EUR", "GBP", "USD", "AUD"] as const
type Currency = (typeof CURRENCIES)[number]

const CURRENCY_DATA: Record<
  Currency,
  { symbol: string; cashflow: string; trend: number; hedgeRatio: number; monthlyData: { month: string; exposure: number; hedges: number }[] }
> = {
  EUR: {
    symbol: "€", cashflow: "1.24M", trend: +3.2, hedgeRatio: 98,
    monthlyData: [
      { month: "Feb", exposure: 1240, hedges: 1215 },
      { month: "Mar", exposure: 1100, hedges: 1078 },
      { month: "Apr", exposure: 1350, hedges: 1323 },
      { month: "May", exposure: 950,  hedges: 931  },
      { month: "Jun", exposure: 1150, hedges: 1127 },
      { month: "Jul", exposure: 1400, hedges: 1372 },
      { month: "Aug", exposure: 1280, hedges: 1254 },
      { month: "Sep", exposure: 1100, hedges: 1078 },
      { month: "Oct", exposure: 1300, hedges: 1274 },
      { month: "Nov", exposure: 1050, hedges: 1029 },
      { month: "Dec", exposure: 1450, hedges: 1421 },
      { month: "Jan", exposure: 1200, hedges: 1176 },
    ],
  },
  GBP: {
    symbol: "£", cashflow: "820K", trend: -1.4, hedgeRatio: 82,
    monthlyData: [
      { month: "Feb", exposure: 820,  hedges: 673  },
      { month: "Mar", exposure: 750,  hedges: 615  },
      { month: "Apr", exposure: 900,  hedges: 738  },
      { month: "May", exposure: 680,  hedges: 558  },
      { month: "Jun", exposure: 840,  hedges: 689  },
      { month: "Jul", exposure: 920,  hedges: 754  },
      { month: "Aug", exposure: 790,  hedges: 648  },
      { month: "Sep", exposure: 860,  hedges: 705  },
      { month: "Oct", exposure: 710,  hedges: 582  },
      { month: "Nov", exposure: 950,  hedges: 779  },
      { month: "Dec", exposure: 880,  hedges: 722  },
      { month: "Jan", exposure: 800,  hedges: 656  },
    ],
  },
  USD: {
    symbol: "$", cashflow: "2.10M", trend: +5.8, hedgeRatio: 75,
    monthlyData: [
      { month: "Feb", exposure: 2100, hedges: 1575 },
      { month: "Mar", exposure: 1900, hedges: 1425 },
      { month: "Apr", exposure: 2400, hedges: 1800 },
      { month: "May", exposure: 1700, hedges: 1275 },
      { month: "Jun", exposure: 2200, hedges: 1650 },
      { month: "Jul", exposure: 2500, hedges: 1875 },
      { month: "Aug", exposure: 2050, hedges: 1538 },
      { month: "Sep", exposure: 1800, hedges: 1350 },
      { month: "Oct", exposure: 2300, hedges: 1725 },
      { month: "Nov", exposure: 2000, hedges: 1500 },
      { month: "Dec", exposure: 2600, hedges: 1950 },
      { month: "Jan", exposure: 1950, hedges: 1463 },
    ],
  },
  AUD: {
    symbol: "A$", cashflow: "3.40M", trend: +1.1, hedgeRatio: 91,
    monthlyData: [
      { month: "Feb", exposure: 3400, hedges: 3094 },
      { month: "Mar", exposure: 3100, hedges: 2821 },
      { month: "Apr", exposure: 3700, hedges: 3367 },
      { month: "May", exposure: 2900, hedges: 2639 },
      { month: "Jun", exposure: 3300, hedges: 3003 },
      { month: "Jul", exposure: 3800, hedges: 3458 },
      { month: "Aug", exposure: 3200, hedges: 2912 },
      { month: "Sep", exposure: 2950, hedges: 2685 },
      { month: "Oct", exposure: 3500, hedges: 3185 },
      { month: "Nov", exposure: 3050, hedges: 2776 },
      { month: "Dec", exposure: 4000, hedges: 3640 },
      { month: "Jan", exposure: 3150, hedges: 2867 },
    ],
  },
}

const HORIZON_OPTIONS = [3, 6, 9, 12] as const

function formatVal(value: number) {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}M`
  return `${value}K`
}

function HedgeGauge({ ratio }: { ratio: number }) {
  const r = 30, cx = 38, cy = 38
  const circumference = 2 * Math.PI * r
  const filled = (ratio / 100) * circumference
  return (
    <svg width="76" height="76" viewBox="0 0 76 76">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#DCE5E1" strokeWidth="7" />
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke="#2D6A4F"
        strokeWidth="7"
        strokeDasharray={`${filled} ${circumference - filled}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: "stroke-dasharray 0.6s cubic-bezier(.4,0,.2,1)" }}
      />
      <text x={cx} y={cy + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill="#12261F">
        {ratio}%
      </text>
    </svg>
  )
}

const CustomTooltip = ({
  active, payload, label,
}: {
  active?: boolean
  payload?: { name: string; value: number; color: string }[]
  label?: string
}) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#12261F] text-white text-xs rounded-xl px-3 py-2.5 shadow-2xl space-y-1.5 min-w-[148px]">
      <p className="text-[10px] font-semibold text-white/50 uppercase tracking-wide">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center justify-between gap-5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: entry.color }} />
            <span className="text-white/75">{entry.name}</span>
          </div>
          <span className="font-bold">{formatVal(entry.value)}</span>
        </div>
      ))}
    </div>
  )
}

export default function HedgeReportChart() {
  const [activeCurrency, setActiveCurrency] = useState<Currency>("EUR")
  const [horizon, setHorizon] = useState<3 | 6 | 9 | 12>(6)

  const data = CURRENCY_DATA[activeCurrency]
  const chartData = useMemo(() => data.monthlyData.slice(0, horizon), [data, horizon])
  const covered = Math.round((data.hedgeRatio / 100) * horizon)

  return (
    <div className="bg-white rounded-2xl border border-[#DCE5E1] shadow-sm overflow-hidden">

      {/* ── Currency Tabs ── */}
      <div className="flex border-b border-[#DCE5E1]">
        {CURRENCIES.map((c) => {
          const isActive = c === activeCurrency
          return (
            <button
              key={c}
              onClick={() => setActiveCurrency(c)}
              className={`relative flex-1 flex flex-col items-center gap-1 py-3 text-xs font-semibold transition-colors ${
                isActive ? "text-[#12261F]" : "text-[#52796F] hover:text-[#12261F] hover:bg-[#F5F7F6]"
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold transition-colors ${
                isActive ? "bg-[#2D6A4F] text-white" : "bg-[#E8EEEB] text-[#52796F]"
              }`}>
                {CURRENCY_DATA[c].symbol}
              </span>
              {c}
              {isActive && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-[#2D6A4F]" />
              )}
            </button>
          )
        })}
      </div>

      <div className="p-5 space-y-5">

        {/* ── Stats Row ── */}
        <div className="flex items-center gap-4">
          <div className="flex-1 rounded-xl p-3.5 bg-[#E8EEEB] border border-[#DCE5E1]">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#52796F] mb-1">
              Avg Monthly Cashflow
            </p>
            <div className="flex items-end gap-2">
              <p className="text-xl font-bold text-[#12261F]">
                {data.symbol}{data.cashflow}
              </p>
              <span className={`flex items-center gap-0.5 text-[11px] font-semibold mb-0.5 ${
                data.trend >= 0 ? "text-[#2D6A4F]" : "text-red-500"
              }`}>
                {data.trend >= 0
                  ? <ArrowUpRight className="w-3 h-3" />
                  : <ArrowDownRight className="w-3 h-3" />}
                {Math.abs(data.trend)}%
              </span>
            </div>
            <p className="text-[10px] text-[#52796F] mt-0.5">vs last period</p>
          </div>

          <div className="flex flex-col items-center gap-0.5">
            <HedgeGauge ratio={data.hedgeRatio} />
            <p className="text-[10px] text-[#52796F] font-medium">Hedge ratio</p>
          </div>
        </div>

        {/* ── Hedging Horizon ── */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#52796F]">
              Hedging Horizon
            </p>
            <span className="text-[10px] text-[#52796F]">
              {covered} of {horizon} months covered
            </span>
          </div>
          <div className="flex gap-2">
            {HORIZON_OPTIONS.map((m) => (
              <button
                key={m}
                onClick={() => setHorizon(m)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  horizon === m
                    ? "bg-[#2D6A4F] text-white border-[#2D6A4F]"
                    : "bg-white text-[#52796F] border-[#DCE5E1] hover:border-[#2D6A4F] hover:text-[#2D6A4F]"
                }`}
              >
                {m}M
              </button>
            ))}
          </div>
        </div>

        {/* ── Legend ── */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#A8C5BA] inline-block" />
            <span className="text-[11px] text-[#52796F]">Expected exposure</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#2D6A4F] inline-block" />
            <span className="text-[11px] text-[#52796F]">Hedges booked</span>
          </div>
        </div>

        {/* ── Bar Chart ── */}
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barGap={2} barCategoryGap="30%">
              <CartesianGrid vertical={false} stroke="#E8EEEB" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 10, fill: "#52796F" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={formatVal}
                tick={{ fontSize: 10, fill: "#52796F" }}
                axisLine={false}
                tickLine={false}
                width={38}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F5F7F6" }} />
              <Bar dataKey="exposure" name="Expected exposure" fill="#A8C5BA" radius={[4, 4, 0, 0]} />
              <Bar dataKey="hedges"   name="Hedges booked"    fill="#2D6A4F" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 bg-[#E8EEEB] border border-[#DCE5E1] text-xs font-medium text-[#2D6A4F]">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          <span>{covered} of {horizon} months hedged &mdash; portfolio actively protected</span>
        </div>

      </div>
    </div>
  )
}
