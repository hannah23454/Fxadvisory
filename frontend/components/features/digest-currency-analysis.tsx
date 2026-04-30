"use client"

import { useState, useEffect, useCallback } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const PAIRS = ["AUD/USD", "AUD/EUR", "AUD/GBP", "AUD/JPY", "AUD/NZD"] as const
type Pair = (typeof PAIRS)[number]

interface ChartPoint {
  date: string
  rate: number
}

const MARKET_NEWS: Record<Pair, string> = {
  "AUD/USD": "The AUD strengthened on softer US data and Fed rate-cut expectations. Watch for upcoming US jobs data and FOMC commentary.",
  "AUD/EUR": "Diverging economic momentum keeps this pair biased higher. Eurozone growth concerns and ECB dovish signals dominate.",
  "AUD/GBP": "Mixed signals with UK inflation data upcoming. Monitor BoE policy shifts affecting GBP volatility.",
  "AUD/JPY": "Japanese rate expectations remain a key driver. Risk sentiment influences this high-yield carry pair.",
  "AUD/NZD": "Trade-linked pair showing correlation with commodity price movements and regional policy divergence.",
}

function CurrencyBubble({
  pair,
  isSelected,
  onClick,
}: {
  pair: Pair
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-full font-bold text-sm text-white transition-all shadow-md ${
        isSelected ? "bg-[#1B4332] border-2 border-[#2D6A4F] scale-110" : "bg-[#2D6A4F] hover:scale-105"
      }`}
    >
      {pair}
    </button>
  )
}

function StatBox({
  label,
  value,
  loading,
}: {
  label: string
  value: string
  loading: boolean
}) {
  return (
    <div className="bg-white rounded-lg border border-[#DCE5E1] p-3">
      <p className="text-[10px] text-[#52796F] uppercase tracking-[0.1em] mb-1 font-medium">{label}</p>
      {loading ? (
        <div className="h-4 w-12 bg-[#DCE5E1] rounded animate-pulse" />
      ) : (
        <p className="text-sm font-bold text-[#12261F] leading-none">{value}</p>
      )}
    </div>
  )
}

function MiniLineChart({
  data,
  loading,
}: {
  data: ChartPoint[]
  loading: boolean
}) {
  if (loading) {
    return (
      <div className="h-[140px] bg-gradient-to-br from-[#F5F7F6] to-[#E8EEEB] rounded-lg animate-pulse" />
    )
  }

  if (!data.length) {
    return (
      <div className="h-[140px] rounded-lg border border-[#DCE5E1] bg-[#FAFBFA] flex items-center justify-center">
        <p className="text-xs text-[#52796F]">No data</p>
      </div>
    )
  }

  return (
    <div className="h-[140px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="#DCE5E1" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 9, fill: "#52796F" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 9, fill: "#52796F" }} axisLine={false} tickLine={false} width={40} />
          <Line
            type="monotone"
            dataKey="rate"
            stroke="#2D6A4F"
            strokeWidth={2}
            dot={false}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default function DigestCurrencyAnalysis() {
  const [selectedPair, setSelectedPair] = useState<Pair>("AUD/USD")
  const [data, setData] = useState<ChartPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch(
        `/api/fx/historical?pair=${encodeURIComponent(selectedPair)}&months=3`
      )
      const json = await res.json()
      if (!res.ok || json.error) {
        setError(json.error ?? "Failed to load chart data")
        return
      }
      const isJpy = selectedPair.includes("JPY")
      setData(
        (json.dates as string[]).map((raw: string, i: number) => ({
          date: formatDate(raw),
          rate: parseFloat((json.rates[i] as number).toFixed(isJpy ? 3 : 4)),
        }))
      )
    } catch {
      setError("Unable to load chart data")
    } finally {
      setLoading(false)
    }
  }, [selectedPair])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // ── Derived stats ──
  const rates = data.map((d) => d.rate)
  const current = rates.at(-1) ?? 0
  const high = rates.length ? Math.max(...rates) : 0
  const low = rates.length ? Math.min(...rates) : 0
  const isJpy = selectedPair.includes("JPY")
  const dp = isJpy ? 3 : 4

  // Calculate support/resistance as simple percentage bands around current
  const range = high - low
  const supportLevel = low + range * 0.2 // 20% from low
  const resistanceLevel = high - range * 0.2 // 20% from high
  const average = (high + low) / 2

  return (
    <div>
      {/* ── Currency Bubble Selector ── */}
      <div className="mb-8 flex flex-wrap gap-4 items-center">
        {PAIRS.map((pair) => (
          <CurrencyBubble
            key={pair}
            pair={pair}
            isSelected={selectedPair === pair}
            onClick={() => setSelectedPair(pair)}
          />
        ))}
      </div>

      {/* ── 4-Box Grid ── */}
      {error ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {/* Box 1: Average Rate */}
            <div className="rounded-lg border border-[#DCE5E1] bg-white p-4 shadow-xs">
              <p className="text-[10px] font-bold text-[#52796F] uppercase tracking-[0.1em] mb-3">Average Rate (3M)</p>
              <MiniLineChart data={data} loading={loading} />
              <StatBox label="Avg" value={average.toFixed(dp)} loading={loading} />
            </div>

            {/* Box 2: High */}
            <div className="rounded-lg border border-[#DCE5E1] bg-white p-4 shadow-xs">
              <p className="text-[10px] font-bold text-[#52796F] uppercase tracking-[0.1em] mb-3">High (3M)</p>
              <MiniLineChart data={data} loading={loading} />
              <StatBox label="High" value={high.toFixed(dp)} loading={loading} />
            </div>

            {/* Box 3: Low */}
            <div className="rounded-lg border border-[#DCE5E1] bg-white p-4 shadow-xs">
              <p className="text-[10px] font-bold text-[#52796F] uppercase tracking-[0.1em] mb-3">Low (3M)</p>
              <MiniLineChart data={data} loading={loading} />
              <StatBox label="Low" value={low.toFixed(dp)} loading={loading} />
            </div>

            {/* Box 4: Current Rate */}
            <div className="rounded-lg border border-[#DCE5E1] bg-white p-4 shadow-xs">
              <p className="text-[10px] font-bold text-[#52796F] uppercase tracking-[0.1em] mb-3">Current Rate</p>
              <MiniLineChart data={data} loading={loading} />
              <StatBox label="Current" value={current.toFixed(dp)} loading={loading} />
            </div>
          </div>

          {/* ── Support/Resistance Stats ── */}
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <div className="rounded-lg border border-[#DCE5E1] bg-[#F5F7F6] p-4">
              <p className="text-[10px] font-bold text-[#52796F] uppercase tracking-[0.1em] mb-1">Support Level</p>
              <p className="text-lg font-bold text-[#12261F]">{supportLevel.toFixed(dp)}</p>
            </div>
            <div className="rounded-lg border border-[#DCE5E1] bg-[#F5F7F6] p-4">
              <p className="text-[10px] font-bold text-[#52796F] uppercase tracking-[0.1em] mb-1">Resistance Level</p>
              <p className="text-lg font-bold text-[#12261F]">{resistanceLevel.toFixed(dp)}</p>
            </div>
          </div>

          {/* ── Market News Section ── */}
          <div className="mt-8 p-6 bg-[#F5F7F6] rounded-lg border border-[#DCE5E1]">
            <p className="text-[10px] font-bold text-[#52796F] uppercase tracking-[0.14em] mb-2">Market Insight</p>
            <p className="text-[#12261F] font-bold text-sm mb-3">{selectedPair} Commentary</p>
            <p className="text-[#4A5A55] text-sm leading-relaxed">
              {MARKET_NEWS[selectedPair]}
            </p>
          </div>
        </>
      )}
    </div>
  )
}

function formatDate(raw: string): string {
  const d = new Date(raw)
  return d.toLocaleDateString("en-AU", { day: "numeric", month: "short" })
}
