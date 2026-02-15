"use client"

import { ArrowUpRight, ArrowDownLeft } from "lucide-react"
import Link from "next/link"

export default function MarketInsights() {
  const insights = [
    {
      title: "AUD Weakness Extends Against USD",
      summary: "Latest commentary on Australian dollar movements and trading opportunities.",
      category: "AUD/USD",
      date: "Nov 22, 2024",
      trend: "down",
    },
    {
      title: "EUR/AUD Recovery Signals Opportunity",
      summary: "Technical analysis and strategic positioning recommendations for cross-pairs.",
      category: "EUR/AUD",
      date: "Nov 21, 2024",
      trend: "up",
    },
    {
      title: "Market Volatility & Hedging Strategy",
      summary: "How to navigate Q4 volatility with proactive hedging and risk positioning.",
      category: "Strategy",
      date: "Nov 20, 2024",
      trend: "neutral",
    },
  ]

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#12261F] mb-4 text-balance">Market Commentary</h2>
            <p className="text-lg text-[#4A5A55]">Latest insights and analysis from our FX experts</p>
          </div>
          <Link
            href="/market-commentary"
            className="hidden sm:block px-6 py-2 text-[#2D6A4F] font-semibold border border-[#2D6A4F] rounded-full hover:bg-[#2D6A4F] hover:text-white transition"
          >
            View All
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {insights.map((insight, idx) => (
            <div
              key={idx}
              className="p-8 rounded-xl bg-[#F5F7F6] border border-[#DCE5E1] hover:border-[#2D6A4F] hover:shadow-lg transition group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#12261F] text-[#A8C5BA]">
                  {insight.category}
                </span>
                {insight.trend === "up" && <ArrowUpRight className="text-green-600" size={20} />}
                {insight.trend === "down" && <ArrowDownLeft className="text-red-600" size={20} />}
              </div>
              <h3 className="text-lg font-bold text-[#12261F] mb-3 group-hover:text-[#2D6A4F] transition">
                {insight.title}
              </h3>
              <p className="text-[#4A5A55] text-sm leading-relaxed mb-6">{insight.summary}</p>
              <p className="text-xs text-[#4A5A55] font-medium">{insight.date}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center sm:hidden">
          <Link
            href="/market-commentary"
            className="px-6 py-2 text-[#2D6A4F] font-semibold border border-[#2D6A4F] rounded-full hover:bg-[#2D6A4F] hover:text-white transition inline-block"
          >
            View All
          </Link>
        </div>
      </div>
    </section>
  )
}
