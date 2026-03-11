"use client"

import { useState, useMemo } from "react"
import { ArrowUpRight, ArrowDownLeft, Minus, Search, ChevronRight, Lock, UserPlus, LogIn } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useSession } from "next-auth/react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import NewsletterSignup from "@/components/newsletter-signup"
import SwitchyardTake from "@/components/switchyard-take"
import TopicPersonalization from "@/components/topic-personalization"
import PartnerTiles from "@/components/partner-tiles"
import { useI18n } from "@/components/i18n/i18n"

/* ────────────────────────────────── Data ─────────────────────────────────── */

const insights = [
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
    category: "Strategy",
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
    category: "CNY",
    date: "Feb 26, 2026",
    trend: "down",
    image: "https://images.unsplash.com/photo-1559526324-593bc073d938?w=600&h=400&fit=crop",
  },
  {
    id: "7",
    title: "RBA Holds Rates: AUD Reaction",
    summary: "The Reserve Bank of Australia holds the cash rate steady. Markets reprice rate cut expectations for mid-2026.",
    category: "AUD",
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
  {
    id: "9",
    title: "Oil Price Surge: Impact on CAD Pairs",
    summary: "Brent crude pushes above $90/bbl, lifting CAD across the board. Cross-currency hedgers take note.",
    category: "CAD",
    date: "Feb 23, 2026",
    trend: "up",
    image: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=600&h=400&fit=crop",
  },
]

const CATEGORIES = ["All", "AUD/USD", "EUR/AUD", "GBP/AUD", "NZD/AUD", "USD", "AUD", "CNY", "CAD", "Strategy"]

/* ────────────────────────────── Components ───────────────────────────────── */

function TrendBadge({ trend }: { trend: string }) {
  if (trend === "up")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
        <ArrowUpRight size={14} /> Bullish
      </span>
    )
  if (trend === "down")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
        <ArrowDownLeft size={14} /> Bearish
      </span>
    )
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
      <Minus size={14} /> Neutral
    </span>
  )
}

function FeaturedCard({ insight, isLoggedIn }: { insight: (typeof insights)[0]; isLoggedIn: boolean }) {
  const href = isLoggedIn ? `/dashboard/market?article=${insight.id}` : "/login?redirect=/market-insights"
  return (
    <Link href={href}>
      <article className="group relative grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden bg-white border border-[#DCE5E1] shadow-sm hover:shadow-xl transition-all duration-300">
        <div className="relative aspect-[16/10] md:aspect-auto overflow-hidden">
          <Image
            src={insight.image}
            alt={insight.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#12261F] text-[#A8C5BA] tracking-wide uppercase">
              Featured
            </span>
          </div>
        </div>
        <div className="p-8 md:p-10 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#E8EEEB] text-[#2D6A4F]">
              {insight.category}
            </span>
            <TrendBadge trend={insight.trend} />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#12261F] mb-4 leading-tight group-hover:text-[#2D6A4F] transition-colors">
            {insight.title}
          </h2>
          <p className="text-[#4A5A55] text-base leading-relaxed mb-6">
            {insight.summary}
          </p>
          <div className="flex items-center justify-between">
            <time className="text-sm text-[#52796F] font-medium">{insight.date}</time>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2D6A4F] group-hover:gap-3 transition-all">
              Read More <ChevronRight size={16} />
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}

function InsightCard({ insight, isLoggedIn }: { insight: (typeof insights)[0]; isLoggedIn: boolean }) {
  const href = isLoggedIn ? `/dashboard/market?article=${insight.id}` : "/login?redirect=/market-insights"
  return (
    <Link href={href}>
      <article className="group flex flex-col rounded-2xl overflow-hidden bg-white border border-[#DCE5E1] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
        <div className="relative aspect-[16/10] overflow-hidden">
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
          {!isLoggedIn && (
            <div className="absolute top-3 right-3">
              <span className="p-1.5 rounded-full bg-white/90 backdrop-blur-sm block">
                <Lock size={14} className="text-[#52796F]" />
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col flex-1 p-6">
          <div className="flex items-center gap-2 mb-3">
            <TrendBadge trend={insight.trend} />
          </div>
          <h3 className="text-lg font-bold text-[#12261F] mb-2 leading-snug group-hover:text-[#2D6A4F] transition-colors">
            {insight.title}
          </h3>
          <p className="text-[#4A5A55] text-sm leading-relaxed mb-5 flex-1">
            {insight.summary}
          </p>
          <div className="flex items-center justify-between pt-4 border-t border-[#E8EEEB]">
            <time className="text-xs text-[#52796F] font-medium">{insight.date}</time>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#2D6A4F] group-hover:gap-2 transition-all">
              {isLoggedIn ? "Read More" : "Login to Read"} <ChevronRight size={14} />
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}

/* ─── Login Gate Overlay ─── */
function LoginGateOverlay() {
  return (
    <div className="absolute inset-0 z-20 flex items-end pointer-events-none">
      {/* Graduated frosted overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, transparent 30%, rgba(250,251,250,0.5) 50%, rgba(250,251,250,0.85) 70%, #FAFBFA 90%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backdropFilter: "blur(0px)",
          WebkitBackdropFilter: "blur(0px)",
          maskImage: "linear-gradient(to bottom, transparent 30%, black 70%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 30%, black 70%)",
        }}
      />
      {/* CTA Box */}
      <div className="relative w-full pointer-events-auto pb-8 pt-12 px-4">
        <div className="max-w-xl mx-auto text-center">
          <div className="bg-white rounded-2xl border border-[#DCE5E1] shadow-xl p-8">
            <div className="w-14 h-14 bg-[#E8EEEB] rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock size={24} className="text-[#2D6A4F]" />
            </div>
            <h3 className="text-2xl font-bold text-[#12261F] mb-2">
              Full Insights Require an Account
            </h3>
            <p className="text-[#4A5A55] mb-6 leading-relaxed">
              Create a free account or log in to access all market insights, personalise your topics, and get expert FX commentary.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#2D6A4F] text-white font-semibold text-sm hover:bg-[#1B4332] transition-all"
              >
                <UserPlus size={16} />
                Create Free Account
              </Link>
              <Link
                href="/login?redirect=/market-insights"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 border-[#2D6A4F] text-[#2D6A4F] font-semibold text-sm hover:bg-[#2D6A4F] hover:text-white transition-all"
              >
                <LogIn size={16} />
                Log In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────── Page ────────────────────────────────────── */

export default function MarketInsightsPage() {
  const { t } = useI18n()
  const { data: session } = useSession()
  const isLoggedIn = !!session?.user
  const [activeCategory, setActiveCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [showAll, setShowAll] = useState(false)

  const featured = insights.find((i) => i.featured) || insights[0]
  const restInsights = insights.filter((i) => i !== featured)

  const filteredInsights = useMemo(() => {
    let filtered = restInsights
    if (activeCategory !== "All") {
      filtered = filtered.filter((i) => i.category === activeCategory)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.summary.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q)
      )
    }
    return filtered
  }, [restInsights, activeCategory, searchQuery])

  const visibleInsights = showAll ? filteredInsights : filteredInsights.slice(0, 6)

  return (
    <main className="min-h-screen bg-[#FAFBFA]">
      <Header />

      {/* ─── Hero ─── */}
      <section className="relative bg-[#12261f] text-white pb-24 sm:pb-28">
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <div className="max-w-3xl">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#2D6A4F] text-[#A8C5BA] mb-6 tracking-wider uppercase">
                Insights & Analysis
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-[1.1] tracking-tight">
                {t('market_insights')}
              </h1>
              <p className="text-lg sm:text-xl text-[#A8C5BA] leading-relaxed max-w-2xl">
                {t('market_insights_hero_desc')}
              </p>
            </div>
            {/* Topic Personalization Box — top right */}
            <div className="lg:mt-2 shrink-0">
              <TopicPersonalization isLoggedIn={isLoggedIn} />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Featured Article ─── */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 mb-12 sm:mb-16">
        <FeaturedCard insight={featured} isLoggedIn={isLoggedIn} />
      </section>

      {/* ─── Trending Bar ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
          <span className="text-sm font-bold text-[#12261F] shrink-0 uppercase tracking-wider">Trending</span>
          <div className="h-5 w-px bg-[#DCE5E1] shrink-0" />
          {restInsights.slice(0, 4).map((insight, idx) => (
            <div key={idx} className="flex items-center gap-2 shrink-0 group cursor-pointer">
              <span className="w-6 h-6 rounded-full bg-[#E8EEEB] text-[#2D6A4F] text-xs font-bold flex items-center justify-center">
                {idx + 1}
              </span>
              <span className="text-sm text-[#4A5A55] group-hover:text-[#2D6A4F] transition-colors font-medium whitespace-nowrap">
                {insight.title}
              </span>
              {idx < 3 && <div className="h-4 w-px bg-[#DCE5E1] ml-2" />}
            </div>
          ))}
        </div>
      </section>

      {/* ─── Filters + Search ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setShowAll(false) }}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  activeCategory === cat
                    ? "bg-[#12261F] text-white shadow-sm"
                    : "bg-white text-[#4A5A55] border border-[#DCE5E1] hover:border-[#2D6A4F] hover:text-[#2D6A4F]"
                }`}
              >
                {cat === "All" ? "All Articles" : cat}
              </button>
            ))}
          </div>
          <div className="relative shrink-0 w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52796F]" size={18} />
            <input
              type="text"
              placeholder="Search insights..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[#DCE5E1] bg-white text-sm text-[#12261F] placeholder-[#52796F] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent transition-all"
            />
          </div>
        </div>
      </section>

      {/* ─── Articles Grid (with login gate for non-authenticated) ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <p className="text-sm text-[#52796F] mb-6 font-medium">
          Showing {visibleInsights.length} of {filteredInsights.length} articles
        </p>

        {filteredInsights.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#52796F] text-lg">No articles match your search or filter.</p>
            <button
              onClick={() => { setActiveCategory("All"); setSearchQuery("") }}
              className="mt-4 text-[#2D6A4F] font-semibold text-sm hover:underline cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="relative">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleInsights.map((insight, idx) => (
                <InsightCard key={idx} insight={insight} isLoggedIn={isLoggedIn} />
              ))}
            </div>

            {/* Frosted overlay for non-logged-in users */}
            {!isLoggedIn && filteredInsights.length > 3 && <LoginGateOverlay />}
          </div>
        )}

        {/* Show More — only if logged in */}
        {isLoggedIn && filteredInsights.length > 6 && !showAll && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => setShowAll(true)}
              className="px-8 py-3 rounded-full border-2 border-[#2D6A4F] text-[#2D6A4F] font-semibold text-sm hover:bg-[#2D6A4F] hover:text-white transition-all duration-200 cursor-pointer"
            >
              Show More Articles
            </button>
          </div>
        )}
      </section>

      {/* ─── SwitchYard's Take ─── */}
      <SwitchyardTake />

      {/* ─── Partner Tiles ─── */}
      <PartnerTiles />

      {/* ─── Newsletter CTA ─── */}
      <section className="bg-[#12261f] text-white py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#2D6A4F] text-[#A8C5BA] mb-5 tracking-wider uppercase">
            Stay Informed
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">{t('newsletter_cta_title')}</h2>
          <p className="text-[#A8C5BA] mb-8 text-lg leading-relaxed">{t('newsletter_cta_desc')}</p>
          <NewsletterSignup />
        </div>
      </section>

      <Footer />
    </main>
  )
}
