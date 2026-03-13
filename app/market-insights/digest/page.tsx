"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import {
  ArrowUpRight,
  ArrowDownLeft,
  Minus,
  ChevronRight,
  BarChart2,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Calendar,
  Lock,
} from "lucide-react"
import AccessRequestForm from "@/components/access-request-form"

/* ─── Types ─── */
interface Insight {
  id: string
  title: string
  summary: string
  category: string
  date: string
  trend: "up" | "down" | "neutral"
}

interface PollOption {
  id: string
  label: string
  votes: number
}

/* ─── Static fallback ─── */
const FALLBACK_INSIGHTS: Insight[] = [
  {
    id: "1",
    title: "AUD Weakness Extends Against USD",
    summary:
      "Latest commentary on Australian dollar movements and key support/resistance levels to watch heading into quarter end.",
    category: "AUD/USD",
    date: "Mar 3, 2026",
    trend: "down",
  },
  {
    id: "2",
    title: "EUR/AUD Recovery Signals Opportunity",
    summary:
      "Technical analysis and strategic positioning recommendations for cross-pairs as Euro sentiment shifts.",
    category: "EUR/AUD",
    date: "Mar 2, 2026",
    trend: "up",
  },
  {
    id: "3",
    title: "Market Volatility & Hedging Strategy",
    summary:
      "How to navigate Q1 volatility with proactive hedging and risk positioning ahead of US Fed commentary.",
    category: "Strategy",
    date: "Mar 1, 2026",
    trend: "neutral",
  },
  {
    id: "4",
    title: "USD Strength on Strong NFP Data",
    summary:
      "Non-farm payrolls beat expectations, pushing the USD to a 3-month high. Implications for AUD exporters.",
    category: "USD",
    date: "Feb 28, 2026",
    trend: "up",
  },
  {
    id: "5",
    title: "GBP/AUD: Post-Budget Pressure",
    summary:
      "Sterling faces renewed pressure as UK fiscal concerns weigh on sentiment. Opportunities for AUD importers.",
    category: "GBP/AUD",
    date: "Feb 27, 2026",
    trend: "down",
  },
]

/* ─── Sub-components ─── */
function TrendBadge({ trend }: { trend: string }) {
  if (trend === "up")
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full uppercase tracking-wide">
        <ArrowUpRight size={11} /> Bullish
      </span>
    )
  if (trend === "down")
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full uppercase tracking-wide">
        <ArrowDownLeft size={11} /> Bearish
      </span>
    )
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full uppercase tracking-wide">
      <Minus size={11} /> Neutral
    </span>
  )
}

const trendAccent: Record<string, string> = {
  up: "border-l-emerald-400",
  down: "border-l-red-400",
  neutral: "border-l-amber-400",
}

function InsightCard({ insight, index }: { insight: Insight; index: number }) {
  return (
    <Link href={`/market-insights/${insight.id}`} className="group block">
      <article
        className={`relative bg-white rounded-xl border border-[#DCE5E1] border-l-4 ${trendAccent[insight.trend]} p-5 group-hover:border-r-[#2D6A4F] group-hover:border-t-[#2D6A4F] group-hover:border-b-[#2D6A4F] group-hover:shadow-lg group-hover:-translate-y-0.5 transition-all duration-300`}
      >
        {/* Index number */}
        <span className="absolute top-4 right-5 text-2xl font-black text-[#F0F4F2] select-none leading-none">
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Tags row */}
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#F0F4F2] text-[#2D6A4F] uppercase tracking-wider border border-[#DCE5E1]">
            {insight.category}
          </span>
          <TrendBadge trend={insight.trend} />
        </div>

        {/* Title */}
        <h3 className="text-[15px] font-bold text-[#12261F] mb-2 leading-snug pr-8 group-hover:text-[#1B4332] transition-colors">
          {insight.title}
        </h3>

        {/* Summary */}
        <p className="text-sm text-[#4A5A55] leading-relaxed line-clamp-2 mb-4">{insight.summary}</p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[#F0F4F2]">
          <div className="flex items-center gap-1.5 text-xs text-[#52796F]">
            <Calendar size={11} />
            <time>{insight.date}</time>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#2D6A4F] group-hover:gap-1.5 transition-all">
            Read insight <ChevronRight size={13} />
          </span>
        </div>
      </article>
    </Link>
  )
}

function PollSection() {
  const [options, setOptions] = useState<PollOption[]>([
    { id: "aud-usd", label: "AUD weakness against USD", votes: 0 },
    { id: "import-costs", label: "Rising import/export costs", votes: 0 },
    { id: "hedging-strategy", label: "Hedging strategy uncertainty", votes: 0 },
    { id: "interest-rates", label: "Interest rate movements", votes: 0 },
  ])
  const [total, setTotal] = useState(0)
  const [voted, setVoted] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("insights-poll-vote") : null
    if (stored) setVoted(stored)

    fetch("/api/insights/poll")
      .then((r) => r.json())
      .then((data) => {
        if (data.options) {
          setOptions(data.options)
          setTotal(data.total ?? 0)
        }
      })
      .catch(() => {/* keep defaults */})
  }, [])

  const handleVote = async (optionId: string) => {
    if (voted || loading) return
    setLoading(true)
    try {
      const res = await fetch("/api/insights/poll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId }),
      })
      const data = await res.json()
      if (data.options) {
        setOptions(data.options)
        setTotal(data.total ?? 0)
      }
      setVoted(optionId)
      localStorage.setItem("insights-poll-vote", optionId)
    } catch {
      setOptions((prev) =>
        prev.map((o) => (o.id === optionId ? { ...o, votes: o.votes + 1 } : o))
      )
      setTotal((t) => t + 1)
      setVoted(optionId)
      localStorage.setItem("insights-poll-vote", optionId)
    } finally {
      setLoading(false)
    }
  }

  const maxVotes = Math.max(...options.map((o) => o.votes), 1)

  return (
    <section className="bg-white rounded-xl border border-[#DCE5E1] overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#F0F4F2] flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-[#2D6A4F] to-[#1B4332] rounded-lg flex items-center justify-center flex-shrink-0">
          <BarChart2 size={15} className="text-white" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#12261F] leading-none">Weekly Poll</h3>
          <p className="text-[11px] text-[#52796F] mt-0.5">What's your biggest concern?</p>
        </div>
      </div>

      {/* Options */}
      <div className="p-4 space-y-2">
        {options.map((option) => {
          const pct = total > 0 ? Math.round((option.votes / total) * 100) : 0
          const isSelected = voted === option.id
          const isWinner = !!voted && option.votes === maxVotes && option.votes > 0

          return (
            <button
              key={option.id}
              onClick={() => handleVote(option.id)}
              disabled={!!voted || loading}
              className={`w-full text-left rounded-lg border transition-all duration-200 group overflow-hidden
                ${voted ? "cursor-default" : "cursor-pointer hover:border-[#2D6A4F] hover:bg-[#FAFBFA]"}
                ${isSelected ? "border-[#2D6A4F] bg-[#F5FAF7]" : "border-[#E4ECE8]"}`}
            >
              <div className="px-3 py-2.5">
                <div className="flex items-center gap-2 mb-1.5">
                  {/* Icon */}
                  {!voted && (
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-[#C8D8D2] flex-shrink-0 group-hover:border-[#2D6A4F] transition-colors" />
                  )}
                  {isSelected && <CheckCircle2 size={14} className="text-[#2D6A4F] flex-shrink-0" />}
                  {voted && !isSelected && (
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-[#DCE5E1] flex-shrink-0" />
                  )}

                  <span className={`text-xs font-medium flex-1 leading-tight transition-colors
                    ${isSelected ? "text-[#12261F] font-semibold" : "text-[#4A5A55]"}`}>
                    {option.label}
                  </span>

                  {voted && (
                    <span className={`text-xs font-bold flex-shrink-0 tabular-nums ${isWinner ? "text-[#2D6A4F]" : "text-[#8AA8A0]"}`}>
                      {pct}%
                    </span>
                  )}
                </div>

                {/* Progress bar track */}
                {voted && (
                  <div className="h-1 rounded-full bg-[#EDF2EF] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${isSelected || isWinner ? "bg-[#2D6A4F]" : "bg-[#C8D8D2]"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Footer */}
      <div className="px-5 pb-4">
        {voted ? (
          <p className="text-[11px] text-[#52796F] text-center font-medium">
            {total} vote{total !== 1 ? "s" : ""} cast · Thank you for participating!
          </p>
        ) : (
          <p className="text-[11px] text-[#8AA8A0] text-center">Cast your vote to see results</p>
        )}
      </div>
    </section>
  )
}

/* ─── Page ─── */
export default function InsightsDigestPage() {
  const [insights, setInsights] = useState<Insight[]>(FALLBACK_INSIGHTS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/airtable/insights")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setInsights(data.slice(0, 5))
        }
      })
      .catch(() => {/* keep fallback */})
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="min-h-screen bg-[#F5F7F6]">
      <Header />

      {/* ─── Hero ─── */}
      <section className="relative bg-gradient-to-br from-[#0D1F19] via-[#12261F] to-[#0F2E22] text-white py-16 sm:py-20 lg:py-24 overflow-hidden">
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
        {/* Glow orbs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#2D6A4F] rounded-full blur-[120px] opacity-20 pointer-events-none" />
        <div className="absolute -bottom-32 -right-16 w-80 h-80 bg-[#1B4332] rounded-full blur-[100px] opacity-30 pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/8 border border-white/15 backdrop-blur-sm mb-6">
            <Sparkles size={13} className="text-[#74B49B]" />
            <span className="text-[11px] font-bold text-[#A8C5BA] uppercase tracking-[0.15em]">
              Weekly Digest
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[52px] font-black mb-4 leading-[1.1] tracking-tight">
            Your FX Market{" "}
            <span className="bg-gradient-to-r from-[#74B49B] to-[#A8C5BA] bg-clip-text text-transparent">
              Insights
            </span>
          </h1>
          <p className="text-sm sm:text-base text-[#8AAFA5] leading-relaxed max-w-xl mx-auto mb-8">
            This week's FX movements, strategic insights, and positioning ideas — curated by the SwitchYard team.
          </p>

          {/* CTA row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/market-insights"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#2D6A4F] hover:bg-[#256043] text-white font-semibold text-sm transition-all hover:shadow-lg hover:-translate-y-0.5 border border-[#3D7A5F]"
            >
              Explore Full Insights <ChevronRight size={15} />
            </Link>
            <div className="flex items-center gap-1.5 text-xs text-[#607D77]">
              <Calendar size={12} />
              <span>Updated {new Date().toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}</span>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-[#F5F7F6] to-transparent" />
      </section>

      {/* ─── Main content ─── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">

          {/* ─── Insights feed ─── */}
          <div className="lg:col-span-2">
            {/* Section header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center gap-2">
                <TrendingUp size={14} className="text-[#2D6A4F]" />
                <h2 className="text-xs font-black text-[#12261F] uppercase tracking-[0.2em]">This Week</h2>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-[#DCE5E1] to-transparent" />
              {!loading && (
                <span className="text-[11px] font-semibold text-[#52796F] bg-[#E8EEEB] px-2.5 py-1 rounded-full border border-[#DCE5E1]">
                  {insights.length} insight{insights.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            <div className="space-y-3">
              {loading
                ? [1, 2, 3].map((n) => (
                    <div key={n} className="h-[120px] rounded-xl bg-white border border-[#DCE5E1] animate-pulse" />
                  ))
                : insights.map((insight, i) => (
                    <InsightCard key={insight.id} insight={insight} index={i} />
                  ))}
            </div>

            {/* CTA card */}
            <div className="mt-5 relative bg-gradient-to-br from-[#0D1F19] to-[#1B4332] rounded-xl p-6 sm:p-8 overflow-hidden border border-white/5 shadow-xl">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#2D6A4F] rounded-full blur-[60px] opacity-30 pointer-events-none" />
              <div className="relative">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 mb-4">
                  <Lock size={11} className="text-[#74B49B]" />
                  <span className="text-[11px] font-bold text-[#74B49B] uppercase tracking-wider">Premium Access</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white mb-2 leading-tight">
                  Want the complete analysis?
                </h3>
                <p className="text-[#8AAFA5] text-sm leading-relaxed mb-5 max-w-md">
                  Full insights library, currency pair filters, historical trends, and personalised recommendations.
                </p>
                <Link
                  href="/market-insights"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#2D6A4F] hover:bg-[#256043] text-white font-semibold text-sm transition-all hover:shadow-lg hover:-translate-y-0.5 border border-[#3D7A5F]"
                >
                  View Full Insights <ChevronRight size={15} />
                </Link>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ─── */}
          <div className="space-y-5">
            <PollSection />

            {/* Access card */}
            <div className="bg-white rounded-xl border border-[#DCE5E1] overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-[#F0F4F2] flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2D6A4F] to-[#1B4332] flex items-center justify-center flex-shrink-0">
                  <Sparkles size={15} className="text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#12261F] leading-none">Get More Access</h3>
                  <p className="text-[11px] text-[#52796F] mt-0.5">Unlock premium features</p>
                </div>
              </div>
              <div className="p-5">
                <p className="text-xs text-[#4A5A55] mb-4 leading-relaxed">
                  Request dashboard access, templates, or subscribe to weekly insights.
                </p>
                <AccessRequestForm compact defaultRequestType="Market Insights" />
              </div>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  )
}
