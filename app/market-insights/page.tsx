"use client"

import { useState } from "react"
import { ArrowUpRight, ArrowDownLeft, Minus, Plus } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import NewsletterSignup from "@/components/newsletter-signup"
import SwitchyardTake from "@/components/switchyard-take"
import { useI18n } from "@/components/i18n/i18n"

const insights = [
  {
    title: "AUD Weakness Extends Against USD",
    summary: "Latest commentary on Australian dollar movements and key support/resistance levels to watch heading into quarter end.",
    category: "AUD/USD",
    date: "Mar 3, 2026",
    trend: "down",
  },
  {
    title: "EUR/AUD Recovery Signals Opportunity",
    summary: "Technical analysis and strategic positioning recommendations for cross-pairs as Euro sentiment shifts.",
    category: "EUR/AUD",
    date: "Mar 2, 2026",
    trend: "up",
  },
  {
    title: "Market Volatility & Hedging Strategy",
    summary: "How to navigate Q1 volatility with proactive hedging and risk positioning ahead of US Fed commentary.",
    category: "Strategy",
    date: "Mar 1, 2026",
    trend: "neutral",
  },
  {
    title: "USD Strength on Strong NFP Data",
    summary: "Non-farm payrolls beat expectations, pushing the USD to a 3-month high. Implications for AUD exporters.",
    category: "USD",
    date: "Feb 28, 2026",
    trend: "up",
  },
  {
    title: "GBP/AUD: Post-Budget Pressure",
    summary: "Sterling faces renewed pressure as UK fiscal concerns weigh on sentiment. Opportunities for AUD importers.",
    category: "GBP/AUD",
    date: "Feb 27, 2026",
    trend: "down",
  },
  {
    title: "CNY Depreciation Risk for Exporters",
    summary: "The People's Bank of China signals looser monetary policy. Australian commodity exporters should reassess exposure.",
    category: "CNY",
    date: "Feb 26, 2026",
    trend: "down",
  },
  {
    title: "RBA Holds Rates: AUD Reaction",
    summary: "The Reserve Bank of Australia holds the cash rate steady. Markets reprice rate cut expectations for mid-2026.",
    category: "AUD",
    date: "Feb 25, 2026",
    trend: "neutral",
  },
  {
    title: "NZD/AUD Approaching Key Resistance",
    summary: "The NZD/AUD cross has rallied 2.4% in three weeks. Technical resistance at 0.9180 will be the line to watch.",
    category: "NZD/AUD",
    date: "Feb 24, 2026",
    trend: "up",
  },
  {
    title: "Oil Price Surge: Impact on CAD Pairs",
    summary: "Brent crude pushes above $90/bbl, lifting CAD across the board. Cross-currency hedgers take note.",
    category: "CAD",
    date: "Feb 23, 2026",
    trend: "up",
  },
]

function TrendIcon({ trend }: { trend: string }) {
  if (trend === "up") return <ArrowUpRight className="text-emerald-500" size={20} />
  if (trend === "down") return <ArrowDownLeft className="text-red-500" size={20} />
  return <Minus className="text-gray-400" size={20} />
}

function InsightCard({ insight }: { insight: (typeof insights)[0] }) {
  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-[#F5F7F6] border border-[#DCE5E1] hover:border-[#2D6A4F] hover:shadow-lg transition-all duration-200 group cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#12261F] text-[#A8C5BA]">
          {insight.category}
        </span>
        <TrendIcon trend={insight.trend} />
      </div>
      <h3 className="text-base sm:text-lg font-bold text-[#12261F] mb-3 group-hover:text-[#2D6A4F] transition-colors leading-snug">
        {insight.title}
      </h3>
      <p className="text-[#4A5A55] text-sm leading-relaxed mb-6">{insight.summary}</p>
      <p className="text-xs text-[#4A5A55] font-medium">{insight.date}</p>
    </div>
  )
}

export default function MarketInsightsPage() {
  const { t } = useI18n()
  const [expanded, setExpanded] = useState(false)

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* ─── Hero ─── */}
      <section className="bg-[#12261f] text-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 text-balance">{t('market_insights')}</h1>
          <p className="text-xl text-[#dce5e1]">{t('market_insights_hero_desc')}</p>
        </div>
      </section>

      {/* ─── Latest Insights – Prime Position ─── */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#12261F] text-[#A8C5BA] mb-3">
                Live Updates
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold text-[#12261F] text-balance leading-tight">
                Latest Insights
              </h1>
              <p className="text-[#4A5A55] mt-3 text-lg">
                Real-time analysis and strategic commentary from our FX experts.
              </p>
            </div>
            <div className="shrink-0">
              <span className="text-sm text-[#4A5A55]">
                {insights.length} articles
              </span>
            </div>
          </div>

          {/* Cards container with fade overlay */}
          <div className="relative">
            <div
              className="overflow-hidden transition-all duration-500 ease-in-out"
              style={{ maxHeight: expanded ? "9999px" : "520px" }}
            >
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {insights.map((insight, idx) => (
                  <InsightCard key={idx} insight={insight} />
                ))}
              </div>
            </div>

            {/* Gradient fade overlay — hidden when expanded */}
            <div
              className="pointer-events-none absolute bottom-0 left-0 right-0 h-52 transition-opacity duration-500"
              style={{
                opacity: expanded ? 0 : 1,
                background:
                  "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.55) 35%, rgba(255,255,255,0.92) 65%, #ffffff 100%)",
              }}
            />
          </div>

          {/* Toggle button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setExpanded((prev) => !prev)}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full border-2 border-[#2D6A4F] text-[#2D6A4F] font-semibold text-sm hover:bg-[#2D6A4F] hover:text-white transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F]"
            >
              {expanded ? (
                <>
                  <Minus size={16} />
                  Show Less
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Show All
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* ─── SwitchYard's Take ─── */}
      <SwitchyardTake />

      {/* ─── Newsletter CTA ─── */}
      <section className="bg-[#12261f] text-white py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">{t('newsletter_cta_title')}</h2>
          <p className="text-[#dce5e1] mb-8">{t('newsletter_cta_desc')}</p>
          <NewsletterSignup />
        </div>
      </section>

      <Footer />
    </main>
  )
}
