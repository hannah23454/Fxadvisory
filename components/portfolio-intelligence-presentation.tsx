"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Slide {
  number: number
  title: string
  subtitle?: string
  content: React.ReactNode
  bgColor: string
  textColor: string
  cta?: string
}

const slides: Slide[] = [
  {
    number: 1,
    title: "See Your Portfolio",
    subtitle: "Live",
    content: (
      <div className="text-center">
        <p className="text-2xl text-white mb-8">From fragmented bank views to unified FX intelligence</p>
        <div className="inline-block bg-white bg-opacity-20 border-2 border-white rounded-lg p-12">
          <div className="text-6xl font-bold text-white">📊</div>
        </div>
      </div>
    ),
    bgColor: "bg-[#12261F]",
    textColor: "text-white",
    cta: "See Your Portfolio — Live",
  },
  {
    number: 2,
    title: "Institutional Credibility",
    subtitle: "Powered by Ebury",
    content: (
      <div className="max-w-2xl">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white bg-opacity-10 rounded-lg p-6 border border-white border-opacity-20">
            <h4 className="text-xl font-bold mb-3">14+ Years</h4>
            <p>Leading multi-bank FX aggregation and fintech innovation</p>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-6 border border-white border-opacity-20">
            <h4 className="text-xl font-bold mb-3">AFSL Licensed</h4>
            <p>Ebury Partners Australia | AFSL 520548 | Full regulatory compliance</p>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-6 border border-white border-opacity-20">
            <h4 className="text-xl font-bold mb-3">$100M+ Daily Volume</h4>
            <p>Trusted by mid-market and enterprise treasury teams</p>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-6 border border-white border-opacity-20">
            <h4 className="text-xl font-bold mb-3">SwitchYard Partnership</h4>
            <p>Strategic programme manager for institutional solutions</p>
          </div>
        </div>
      </div>
    ),
    bgColor: "bg-[#0F5CA1]",
    textColor: "text-white",
  },
  {
    number: 3,
    title: "Technology-Driven Visibility",
    subtitle: "Real-Time Dashboard",
    content: (
      <div className="max-w-3xl">
        <div className="bg-white bg-opacity-10 rounded-lg p-8 border border-white border-opacity-20">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-5xl mb-3">🌍</div>
              <h4 className="font-bold mb-2">Global Coverage</h4>
              <p className="text-sm">28+ currency pairs, real-time rates</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-3">⚡</div>
              <h4 className="font-bold mb-2">Live Updates</h4>
              <p className="text-sm">1-second refresh on all positions</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-3">📈</div>
              <h4 className="font-bold mb-2">Smart Analytics</h4>
              <p className="text-sm">Trend detection & alerts</p>
            </div>
          </div>
        </div>
      </div>
    ),
    bgColor: "bg-[#12261F]",
    textColor: "text-white",
  },
  {
    number: 4,
    title: "Multi-Bank Consolidation",
    subtitle: "One Dashboard, All Banks",
    content: (
      <div className="max-w-3xl">
        <p className="text-xl mb-8">Stop switching between 4+ banking portals</p>
        <div className="bg-white bg-opacity-10 rounded-lg p-8 border border-white border-opacity-20">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h4 className="font-bold mb-4 flex items-center gap-2">
                <span className="text-2xl">❌</span> Without SwitchYard
              </h4>
              <ul className="space-y-2 text-sm">
                <li>• Manual data aggregation</li>
                <li>• Outdated FX rates</li>
                <li>• Fragmented reporting</li>
                <li>• Delayed decision-making</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 flex items-center gap-2">
                <span className="text-2xl">✓</span> With SwitchYard
              </h4>
              <ul className="space-y-2 text-sm">
                <li>• Unified position view</li>
                <li>• Real-time FX prices</li>
                <li>• Automated board reports</li>
                <li>• Instant insights</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    ),
    bgColor: "bg-[#0F5CA1]",
    textColor: "text-white",
  },
  {
    number: 5,
    title: "Structured Product Support",
    subtitle: "Beyond Forwards",
    content: (
      <div className="max-w-3xl">
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { icon: "📍", title: "Forwards", desc: "Classic hedging at locked rates" },
            { icon: "📊", title: "Options", desc: "Downside protection with upside" },
            { icon: "🎯", title: "Collars", desc: "Cost-effective range strategies" },
            { icon: "💱", title: "Swaps", desc: "Multi-leg structured hedges" },
            { icon: "📈", title: "Seagull Strategies", desc: "Leveraged FX plays" },
            { icon: "🔄", title: "Participating Forwards", desc: "Partial upside capture" },
          ].map((product, i) => (
            <div key={i} className="bg-white bg-opacity-10 rounded-lg p-6 border border-white border-opacity-20">
              <div className="text-4xl mb-3">{product.icon}</div>
              <h4 className="font-bold mb-2">{product.title}</h4>
              <p className="text-sm">{product.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
    bgColor: "bg-[#12261F]",
    textColor: "text-white",
  },
  {
    number: 6,
    title: "Automated MTM Analytics",
    subtitle: "Mark-to-Market at a Glance",
    content: (
      <div className="max-w-3xl">
        <div className="bg-white bg-opacity-10 rounded-lg p-8 border border-white border-opacity-20">
          <p className="mb-6 text-lg">Automatic daily P&L calculations across your entire book</p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-5xl mb-3">📉</div>
              <h4 className="font-bold">Current MTM</h4>
              <p className="text-3xl font-bold text-[#BD6908] mt-2">-A$245k</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-3">📊</div>
              <h4 className="font-bold">P&L Trend</h4>
              <p className="text-sm mt-2">↑ 12% favourable vs. Q3</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-3">⏰</div>
              <h4 className="font-bold">Refresh Rate</h4>
              <p className="text-sm mt-2">1-second real-time</p>
            </div>
          </div>
        </div>
      </div>
    ),
    bgColor: "bg-[#0F5CA1]",
    textColor: "text-white",
  },
  {
    number: 7,
    title: "Governance Alignment",
    subtitle: "Board-Ready Reporting",
    content: (
      <div className="max-w-3xl">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white bg-opacity-10 rounded-lg p-6 border border-white border-opacity-20">
            <h4 className="font-bold mb-4">Compliance Dashboard</h4>
            <ul className="space-y-2 text-sm">
              <li>✓ Policy adherence tracking</li>
              <li>✓ Notional exposure by pair</li>
              <li>✓ Counterparty limits</li>
              <li>✓ Audit trail logging</li>
            </ul>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-6 border border-white border-opacity-20">
            <h4 className="font-bold mb-4">Automated Board Reports</h4>
            <ul className="space-y-2 text-sm">
              <li>✓ Monthly P&L summaries</li>
              <li>✓ FX exposure heatmaps</li>
              <li>✓ Benchmarking vs. peers</li>
              <li>✓ One-click export to PDF/Excel</li>
            </ul>
          </div>
        </div>
      </div>
    ),
    bgColor: "bg-[#12261F]",
    textColor: "text-white",
  },
  {
    number: 8,
    title: "From Data to Strategy",
    subtitle: "Our Strategic Process",
    content: (
      <div className="max-w-3xl">
        <div className="space-y-4">
          {[
            { num: "1", title: "Data Integration", desc: "Connect all bank accounts & swap confirmations" },
            { num: "2", title: "Portfolio Assessment", desc: "Identify FX risks and optimization opportunities" },
            { num: "3", title: "Strategy Design", desc: "Tailor hedging approach to your risk appetite" },
            { num: "4", title: "Execution & Reporting", desc: "Execute trades and monitor via live dashboard" },
            { num: "5", title: "Continuous Optimization", desc: "Quarterly strategy review and rebalancing" },
          ].map((step, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full bg-[#BD6908] flex items-center justify-center font-bold shrink-0">
                {step.num}
              </div>
              <div>
                <h4 className="font-bold">{step.title}</h4>
                <p className="text-sm text-opacity-80">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    bgColor: "bg-[#0F5CA1]",
    textColor: "text-white",
  },
  {
    number: 9,
    title: "Risk Management",
    subtitle: "Protect Your Bottom Line",
    content: (
      <div className="max-w-3xl">
        <div className="bg-white bg-opacity-10 rounded-lg p-8 border border-white border-opacity-20">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4">Counterparty Risk</h4>
              <p className="mb-4">Monitor exposure across all banking relationships</p>
              <div className="w-full bg-white bg-opacity-20 rounded h-3 overflow-hidden">
                <div className="bg-[#BD6908] h-full w-2/3"></div>
              </div>
              <p className="text-sm mt-2">65% of A$50m limit used</p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Notional Exposure</h4>
              <p className="mb-4">Track net FX position across all currencies</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>AUD/USD</span>
                  <span className="font-bold">A$12.5m</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>EUR/AUD</span>
                  <span className="font-bold">A$8.2m</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>GBP/AUD</span>
                  <span className="font-bold">A$5.1m</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    bgColor: "bg-[#12261F]",
    textColor: "text-white",
  },
  {
    number: 10,
    title: "See Your Portfolio",
    subtitle: "Live Dashboard Ready",
    content: (
      <div className="text-center">
        <div className="mb-8">
          <p className="text-2xl font-bold mb-4">Your FX strategy starts with visibility</p>
          <p className="text-xl text-opacity-80">Join CFOs who have transformed their FX operations with SwitchYard</p>
        </div>
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white bg-opacity-10 rounded p-4 border border-white border-opacity-20">
            <div className="text-3xl font-bold text-[#BD6908]">45+</div>
            <p className="text-sm">CFOs & Treasurers</p>
          </div>
          <div className="bg-white bg-opacity-10 rounded p-4 border border-white border-opacity-20">
            <div className="text-3xl font-bold text-[#BD6908]">A$2.8B</div>
            <p className="text-sm">Notional Under Management</p>
          </div>
          <div className="bg-white bg-opacity-10 rounded p-4 border border-white border-opacity-20">
            <div className="text-3xl font-bold text-[#BD6908]">98%</div>
            <p className="text-sm">Execution Efficiency</p>
          </div>
        </div>
      </div>
    ),
    bgColor: "bg-[#0F5CA1]",
    textColor: "text-white",
    cta: "See Your Portfolio — Live",
  },
]

export default function PortfolioIntelligencePresentation() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const slide = slides[currentSlide]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <div className={`min-h-screen ${slide.bgColor} ${slide.textColor} flex flex-col justify-between p-6 md:p-12`}>
      {/* Header */}
      <div>
        <div className="flex justify-between items-start mb-12">
          <div>
            <div className="text-sm font-semibold opacity-70 mb-2">
              Slide {slide.number} of {slides.length}
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-2">{slide.title}</h1>
            {slide.subtitle && <p className="text-2xl opacity-80">{slide.subtitle}</p>}
          </div>
          <div className="text-right">
            <div className="inline-block px-3 py-1 rounded bg-[#BD6908] text-white text-sm font-semibold">
              SwitchYard FX
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mb-12">{slide.content}</div>
      </div>

      {/* Footer Navigation */}
      <div className="flex justify-between items-center mt-12">
        <Button
          onClick={prevSlide}
          variant="outline"
          className="bg-white bg-opacity-10 border-white text-white hover:bg-white hover:bg-opacity-20"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Previous
        </Button>

        {/* Slide Indicators */}
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-2 h-2 rounded-full transition ${
                i === currentSlide ? "bg-[#BD6908] w-8" : "bg-white bg-opacity-50"
              }`}
            />
          ))}
        </div>

        <div className="flex gap-3">
          {slide.cta && <Button className="bg-[#BD6908] hover:bg-[#a35a07] text-white">{slide.cta}</Button>}
          <Button onClick={nextSlide} className="bg-white text-[#12261F] hover:bg-opacity-90">
            Next
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
