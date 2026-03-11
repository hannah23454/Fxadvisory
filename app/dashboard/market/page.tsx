"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState, useMemo } from "react"
import {
  Loader2, TrendingUp, Eye, ArrowUpRight, ArrowDownLeft,
  Minus, ChevronRight, Settings2, SkipForward,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import TopicPersonalization from "@/components/topic-personalization"

/* ─── Static insight data (mirrors public page) ─── */
const ALL_INSIGHTS = [
  {
    id: "1",
    title: "AUD Weakness Extends Against USD",
    summary: "Latest commentary on Australian dollar movements and key support/resistance levels to watch heading into quarter end.",
    category: "AUD/USD",
    date: "Mar 3, 2026",
    trend: "down",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop",
    featured: true,
  },
  {
    id: "2",
    title: "EUR/AUD Recovery Signals Opportunity",
    summary: "Technical analysis and strategic positioning recommendations for cross-pairs as Euro sentiment shifts.",
    category: "EUR/AUD",
    date: "Mar 2, 2026",
    trend: "up",
    image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&h=400&fit=crop",
  },
  {
    id: "3",
    title: "Market Volatility & Hedging Strategy",
    summary: "How to navigate Q1 volatility with proactive hedging and risk positioning ahead of US Fed commentary.",
    category: "Hedging Strategy",
    date: "Mar 1, 2026",
    trend: "neutral",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
  },
  {
    id: "4",
    title: "USD Strength on Strong NFP Data",
    summary: "Non-farm payrolls beat expectations, pushing the USD to a 3-month high. Implications for AUD exporters.",
    category: "USD",
    date: "Feb 28, 2026",
    trend: "up",
    image: "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=600&h=400&fit=crop",
  },
  {
    id: "5",
    title: "GBP/AUD: Post-Budget Pressure",
    summary: "Sterling faces renewed pressure as UK fiscal concerns weigh on sentiment. Opportunities for AUD importers.",
    category: "GBP/AUD",
    date: "Feb 27, 2026",
    trend: "down",
    image: "https://images.unsplash.com/photo-1504711434969-e33886168d6c?w=600&h=400&fit=crop",
  },
  {
    id: "6",
    title: "CNY Depreciation Risk for Exporters",
    summary: "The People's Bank of China signals looser monetary policy. Australian commodity exporters should reassess exposure.",
    category: "AUD/CNY",
    date: "Feb 26, 2026",
    trend: "down",
    image: "https://images.unsplash.com/photo-1559526324-593bc073d938?w=600&h=400&fit=crop",
  },
  {
    id: "7",
    title: "RBA Holds Rates: AUD Reaction",
    summary: "The Reserve Bank of Australia holds the cash rate steady. Markets reprice rate cut expectations for mid-2026.",
    category: "RBA Commentary",
    date: "Feb 25, 2026",
    trend: "neutral",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
  },
  {
    id: "8",
    title: "NZD/AUD Approaching Key Resistance",
    summary: "The NZD/AUD cross has rallied 2.4% in three weeks. Technical resistance at 0.9180 will be the line to watch.",
    category: "NZD/AUD",
    date: "Feb 24, 2026",
    trend: "up",
    image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&h=400&fit=crop",
  },
]

const DEFAULT_TOPICS = ["AUD/USD", "EUR/AUD", "Hedging Strategy", "RBA Commentary"]

/* ─── Sub-components ─── */
function TrendBadge({ trend }: { trend: string }) {
  if (trend === "up")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
        <ArrowUpRight size={13} /> Bullish
      </span>
    )
  if (trend === "down")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
        <ArrowDownLeft size={13} /> Bearish
      </span>
    )
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
      <Minus size={13} /> Neutral
    </span>
  )
}

function InsightCard({ insight, onView }: { insight: (typeof ALL_INSIGHTS)[0]; onView: (id: string) => void }) {
  return (
    <article
      onClick={() => onView(insight.id)}
      className="group flex flex-col rounded-2xl overflow-hidden bg-white border border-[#DCE5E1] shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
    >
      <div className="relative aspect-[16/9] overflow-hidden shrink-0">
        <Image
          src={insight.image}
          alt={insight.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#E8EEEB]/90 text-[#2D6A4F] backdrop-blur-sm">
            {insight.category}
          </span>
        </div>
      </div>
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-2 mb-2">
          <TrendBadge trend={insight.trend} />
        </div>
        <h3 className="text-base font-bold text-[#12261F] mb-1.5 leading-snug group-hover:text-[#2D6A4F] transition-colors">
          {insight.title}
        </h3>
        <p className="text-sm text-[#4A5A55] leading-relaxed mb-4 flex-1 line-clamp-2">
          {insight.summary}
        </p>
        <div className="flex items-center justify-between pt-3 border-t border-[#E8EEEB]">
          <time className="text-xs text-[#52796F] font-medium">{insight.date}</time>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#2D6A4F] group-hover:gap-2 transition-all">
            Read <ChevronRight size={13} />
          </span>
        </div>
      </div>
    </article>
  )
}

/* ─── Page ─── */
export default function MarketPage() {
  const [loading, setLoading] = useState(false)
  const [selectedTopics, setSelectedTopics] = useState<string[]>(DEFAULT_TOPICS)
  const [showPersonalization, setShowPersonalization] = useState(false)
  const [topicsSkipped, setTopicsSkipped] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(true)

  /* Filter insights by selected topics, or show all if skipped */
  const filteredInsights = useMemo(() => {
    if (topicsSkipped || selectedTopics.length === 0) return ALL_INSIGHTS
    return ALL_INSIGHTS.filter((i) => selectedTopics.includes(i.category))
  }, [selectedTopics, topicsSkipped])

  const featured = filteredInsights.find((i) => i.featured) ?? filteredInsights[0]
  const rest = filteredInsights.filter((i) => i !== featured)

  const trackView = async (articleId: string) => {
    try {
      await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: "view",
          resourceType: "article",
          resourceId: articleId,
          metadata: {},
        }),
      })
    } catch {
      /* non-critical */
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#2D6A4F]" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-[#12261f] mb-1">Market Insights</h1>
          <p className="text-[#4a5a55]">Professional FX market analysis and commentary</p>
        </div>
        <button
          onClick={() => setShowPersonalization(!showPersonalization)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-[#2D6A4F] text-[#2D6A4F] text-sm font-semibold hover:bg-[#2D6A4F] hover:text-white transition-all cursor-pointer"
        >
          <Settings2 size={16} />
          {showPersonalization ? "Hide Topics" : "Personalise Feed"}
        </button>
      </div>

      {/* ── Onboarding prompt (first time) ── */}
      {showOnboarding && !topicsSkipped && (
        <div className="rounded-2xl bg-[#E8EEEB] border border-[#DCE5E1] p-5 flex items-start gap-4">
          <TrendingUp size={22} className="text-[#2D6A4F] mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[#12261F] mb-0.5">Personalise your insights</p>
            <p className="text-sm text-[#4A5A55]">
              Select the FX topics that matter most to your business and we&apos;ll filter the feed for you.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => { setShowPersonalization(true); setShowOnboarding(false) }}
              className="px-4 py-2 rounded-full bg-[#2D6A4F] text-white text-sm font-semibold hover:bg-[#1B4332] transition-all cursor-pointer"
            >
              Select Topics
            </button>
            <button
              onClick={() => { setTopicsSkipped(true); setShowOnboarding(false) }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm text-[#52796F] hover:text-[#12261F] font-medium cursor-pointer"
            >
              <SkipForward size={14} /> Skip
            </button>
          </div>
        </div>
      )}

      {/* ── Topic Personalization panel ── */}
      {showPersonalization && (
        <TopicPersonalization
          isLoggedIn={true}
          variant="full"
          selectedTopics={selectedTopics}
          onTopicsChange={setSelectedTopics}
        />
      )}

      {/* ── Active topic pills ── */}
      {!topicsSkipped && !showPersonalization && selectedTopics.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-[#52796F] uppercase tracking-wide">Filtered by:</span>
          {selectedTopics.map((t) => (
            <span key={t} className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#2D6A4F] text-white">
              {t}
            </span>
          ))}
          <button
            onClick={() => setTopicsSkipped(true)}
            className="text-xs text-[#52796F] hover:text-[#12261F] underline underline-offset-2 cursor-pointer"
          >
            Show all
          </button>
        </div>
      )}

      {/* ── Featured Article ── */}
      {featured && (
        <article
          onClick={() => trackView(featured.id)}
          className="group grid md:grid-cols-2 rounded-2xl overflow-hidden bg-white border-2 border-[#2D6A4F] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
        >
          <div className="relative aspect-[16/10] md:aspect-auto overflow-hidden">
            <Image
              src={featured.image}
              alt={featured.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#12261F] text-[#A8C5BA] tracking-wide uppercase">
                Featured
              </span>
            </div>
          </div>
          <div className="p-7 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#E8EEEB] text-[#2D6A4F]">
                {featured.category}
              </span>
              <TrendBadge trend={featured.trend} />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-[#12261F] mb-3 leading-snug group-hover:text-[#2D6A4F] transition-colors">
              {featured.title}
            </h2>
            <p className="text-[#4A5A55] text-sm leading-relaxed mb-5">{featured.summary}</p>
            <div className="flex items-center justify-between">
              <time className="text-sm text-[#52796F] font-medium">{featured.date}</time>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2D6A4F] group-hover:gap-3 transition-all">
                <Eye size={15} /> Read Article
              </span>
            </div>
          </div>
        </article>
      )}

      {/* ── Articles Grid ── */}
      {rest.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-[#12261f] mb-4">
            {topicsSkipped ? "All Insights" : "Your Personalised Feed"}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rest.map((insight) => (
              <InsightCard key={insight.id} insight={insight} onView={trackView} />
            ))}
          </div>
        </div>
      )}

      {filteredInsights.length === 0 && (
        <div className="rounded-2xl border border-[#DCE5E1] p-12 text-center">
          <TrendingUp className="w-10 h-10 text-[#4a5a55] mx-auto mb-3 opacity-40" />
          <p className="text-[#4a5a55] font-medium mb-3">No insights match your selected topics.</p>
          <button
            onClick={() => setShowPersonalization(true)}
            className="text-sm text-[#2D6A4F] font-semibold hover:underline cursor-pointer"
          >
            Adjust Topics
          </button>
        </div>
      )}

      {/* ── Notification CTA ── */}
      <div className="rounded-2xl bg-gradient-to-br from-[#2D6A4F] to-[#1B4332] text-white p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">Get Market Updates</h3>
          <p className="text-white/75 text-sm">Stay ahead with weekly FX insights delivered to your inbox.</p>
        </div>
        <Link
          href="/dashboard/settings"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#2D6A4F] font-semibold text-sm hover:bg-[#E8EEEB] transition-all shrink-0"
        >
          <Settings2 size={15} /> Manage Notifications
        </Link>
      </div>
    </div>
  )
}
