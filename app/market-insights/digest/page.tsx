"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ArrowUpRight, ArrowDownLeft, Minus, ChevronRight, BarChart2, CheckCircle2 } from "lucide-react"
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
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
        <ArrowUpRight size={13} /> Bullish
      </span>
    )
  if (trend === "down")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 bg-red-50 px-2.5 py-1 rounded-full">
        <ArrowDownLeft size={13} /> Bearish
      </span>
    )
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
      <Minus size={13} /> Neutral
    </span>
  )
}

function InsightCard({ insight }: { insight: Insight }) {
  return (
    <article className="bg-white rounded-2xl border border-[#DCE5E1] p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-2 mb-3">
        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#E8EEEB] text-[#2D6A4F] uppercase tracking-wide">
          {insight.category}
        </span>
        <TrendBadge trend={insight.trend} />
      </div>
      <h3 className="text-base font-bold text-[#12261F] mb-2 leading-snug">{insight.title}</h3>
      <p className="text-sm text-[#4A5A55] leading-relaxed mb-4">{insight.summary}</p>
      <div className="flex items-center justify-between pt-3 border-t border-[#F0F4F2]">
        <time className="text-xs text-[#52796F] font-medium">{insight.date}</time>
        <Link
          href={`/market-insights/${insight.id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#2D6A4F] hover:gap-2 transition-all"
        >
          Read More <ChevronRight size={13} />
        </Link>
      </div>
    </article>
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
    // Load stored vote from localStorage
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
      // Optimistic update
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
    <section className="bg-white rounded-2xl border border-[#DCE5E1] p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#E8EEEB] rounded-xl flex items-center justify-center flex-shrink-0">
          <BarChart2 size={20} className="text-[#2D6A4F]" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#12261F]">Weekly Poll</h3>
          <p className="text-sm text-[#52796F]">What's your biggest FX concern right now?</p>
        </div>
      </div>

      <div className="space-y-3">
        {options.map((option) => {
          const pct = total > 0 ? Math.round((option.votes / total) * 100) : 0
          const isSelected = voted === option.id
          const isWinner = voted && option.votes === maxVotes && option.votes > 0

          return (
            <button
              key={option.id}
              onClick={() => handleVote(option.id)}
              disabled={!!voted || loading}
              className={`w-full text-left relative rounded-xl border-2 overflow-hidden transition-all duration-200
                ${voted ? "cursor-default" : "cursor-pointer hover:border-[#2D6A4F]"}
                ${isSelected ? "border-[#2D6A4F]" : "border-[#DCE5E1]"}`}
            >
              {/* Progress bar background */}
              {voted && (
                <div
                  className={`absolute inset-0 transition-all duration-700 ${
                    isSelected ? "bg-[#E8EEEB]" : "bg-[#F7FAF8]"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              )}

              <div className="relative flex items-center gap-3 px-4 py-3">
                {/* Selector circle */}
                {!voted && (
                  <span className="w-5 h-5 rounded-full border-2 border-[#DCE5E1] flex-shrink-0" />
                )}
                {isSelected && (
                  <CheckCircle2 size={20} className="text-[#2D6A4F] flex-shrink-0" />
                )}
                {voted && !isSelected && (
                  <span className="w-5 h-5 rounded-full border-2 border-[#DCE5E1] flex-shrink-0" />
                )}

                <span
                  className={`text-sm font-medium flex-1 ${
                    isSelected ? "text-[#12261F] font-semibold" : "text-[#4A5A55]"
                  }`}
                >
                  {option.label}
                </span>

                {voted && (
                  <span className={`text-sm font-bold ml-2 ${isWinner ? "text-[#2D6A4F]" : "text-[#52796F]"}`}>
                    {pct}%
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {voted ? (
        <p className="mt-4 text-xs text-[#52796F] text-center">
          {total} vote{total !== 1 ? "s" : ""} cast · Thanks for your input!
        </p>
      ) : (
        <p className="mt-4 text-xs text-[#52796F] text-center">Click an option to vote</p>
      )}
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
    <main className="min-h-screen bg-[#FAFBFA]">
      <Header />

      {/* ─── Hero ─── */}
      <section className="relative bg-[#12261f] text-white pb-20 sm:pb-24">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 text-center">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#2D6A4F] text-[#A8C5BA] mb-6 tracking-wider uppercase">
            Weekly Digest — {new Date().toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold mb-5 leading-[1.1] tracking-tight">
            Your FX Market Insights
          </h1>
          <p className="text-lg text-[#A8C5BA] leading-relaxed max-w-2xl mx-auto mb-8">
            This week's key FX movements, strategic commentary, and positioning ideas from
            the SwitchYard FX team.
          </p>
          <Link
            href="/market-insights"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2D6A4F] text-white font-semibold text-sm hover:bg-[#1B4332] transition-all"
          >
            Take Me to My Full Insights <ChevronRight size={16} />
          </Link>
        </div>
      </section>

      {/* ─── Main content ─── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 pb-20">
        <div className="grid lg:grid-cols-3 gap-6">

          {/* ─── Insights feed ─── */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-sm font-bold text-[#12261F] uppercase tracking-wider mb-4 px-1">
              This Week's Insights
            </h2>
            {loading
              ? [1, 2, 3, 4, 5].map((n) => (
                  <div key={n} className="h-40 rounded-2xl bg-[#F0F4F2] border border-[#DCE5E1] animate-pulse" />
                ))
              : insights.map((insight) => <InsightCard key={insight.id} insight={insight} />)}

            {/* Full insights CTA card */}
            <div className="bg-[#12261F] rounded-2xl p-6 sm:p-8 text-center mt-6">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#2D6A4F] text-[#A8C5BA] mb-4 tracking-wider uppercase">
                Full Access
              </span>
              <h3 className="text-xl font-bold text-white mb-2">Want the complete picture?</h3>
              <p className="text-[#A8C5BA] text-sm leading-relaxed mb-6">
                Filter by currency pair, read full analysis, search historical insights, and
                get personalised recommendations based on your FX profile.
              </p>
              <Link
                href="/market-insights"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2D6A4F] text-white font-semibold text-sm hover:bg-[#1B4332] transition-all"
              >
                Take Me to My Full Insights <ChevronRight size={16} />
              </Link>
            </div>
          </div>

          {/* ─── Sidebar ─── */}
          <div className="space-y-6">
            {/* Poll */}
            <PollSection />

            {/* Request access */}
            <div className="bg-white rounded-2xl border border-[#DCE5E1] p-6">
              <h3 className="text-base font-bold text-[#12261F] mb-1">Get More from SwitchYard</h3>
              <p className="text-sm text-[#52796F] mb-5 leading-relaxed">
                Request dashboard access, a hedge piece, or subscribe to weekly insights.
              </p>
              <AccessRequestForm compact defaultRequestType="Market Insights" />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
