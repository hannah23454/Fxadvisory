"use client"

import { useState } from "react"
import { TrendingUp, Shield, Clock } from "lucide-react"
import { useI18n } from "@/components/i18n/i18n"
import Link from "next/link"
import { useCurrency } from "@/components/currency-context"
import HedgePolicyModal from "@/components/hedge-policy-modal"

interface CurrencyRates {
  EUR?: number;
  GBP?: number;
  AUD?: number;
}

export default function Hero() {
  const { t } = useI18n()
  const [hedgePolicyOpen, setHedgePolicyOpen] = useState(false)
  const { rates, loading: currencyLoading, error: currencyError } = useCurrency() || { rates: {}, loading: false, error: null };
  const typedRates = rates as CurrencyRates;
  // Calculate AUD/USD, AUD/EUR, AUD/GBP from USD pairs
  const audUsd = typedRates && typedRates.AUD ? 1 / typedRates.AUD : null;
  const audEur = typedRates && typedRates.AUD && typedRates.EUR ? (1 / typedRates.AUD) * typedRates.EUR : null;
  const audGbp = typedRates && typedRates.AUD && typedRates.GBP ? (1 / typedRates.AUD) * typedRates.GBP : null;

  return (
    <>
    <section className="bg-[#12261F] text-white py-12 md:py-16 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-72 h-72 bg-[#2D6A4F] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#52796F] rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-5">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#DCE5E1] bg-opacity-15 text-[#12261F] text-sm font-semibold border border-[#DCE5E1] border-opacity-30">
                <Shield className="w-4 h-4" />
                {t('hero_badge')}
              </span>
              
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                {t('hero_title_1')}
                <br />
                <span className="text-[#A8C5BA]">{t('hero_title_2')}</span>
              </h1>
              
              <p className="text-lg text-gray-300 leading-relaxed">
                {t('hero_desc')}
              </p>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-5 text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#A8C5BA]" />
                <span className="text-gray-300">{t('hero_expert_analysis')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#A8C5BA]" />
                <span className="text-gray-300">{t('hero_risk_protection')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#A8C5BA]" />
                <span className="text-gray-300">{t('hero_15min_setup')}</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Link href="/contact" className="group px-6 py-3 rounded-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-semibold transition-all duration-300 shadow-lg shadow-[#2D6A4F]/20 hover:shadow-xl hover:shadow-[#2D6A4F]/30 hover:scale-105 inline-block text-center">
                {t('hero_book_consult')}
                <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <button
                onClick={() => setHedgePolicyOpen(true)}
                className="px-6 py-3 rounded-full border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 font-semibold transition-all duration-300 backdrop-blur-sm inline-block text-center cursor-pointer"
              >
                {t('hero_download_policy')}
              </button>
            </div>

            {/* Disclaimer */}
            <div className="pt-3">
              <p className="text-xs text-gray-400">
                {t('hero_disclaimer')}
              </p>
            </div>

            {/* Live FX Ticker */}
            <div className="pt-5 mt-5 border-t border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-gray-300">Live FX Rates</p>
                <span className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Updated live
                </span>
              </div>
              {currencyLoading && <div className="text-xs text-gray-400">Loading FX rates...</div>}
              {currencyError && <div className="text-xs text-red-400">Error loading FX rates</div>}
              {!currencyLoading && !currencyError && (
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-colors">
                    <p className="text-xs text-gray-400 mb-1 font-medium">AUD/USD</p>
                    <p className="text-2xl font-bold text-white">{audUsd ? audUsd.toFixed(4) : '--'}</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-colors">
                    <p className="text-xs text-gray-400 mb-1 font-medium">AUD/EUR</p>
                    <p className="text-2xl font-bold text-white">{audEur ? audEur.toFixed(4) : '--'}</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-colors">
                    <p className="text-xs text-gray-400 mb-1 font-medium">AUD/GBP</p>
                    <p className="text-2xl font-bold text-white">{audGbp ? audGbp.toFixed(4) : '--'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Illustration — FX Dashboard */}
          <div className="hidden md:flex items-center justify-center relative -mt-23">
            <div className="relative w-full max-w-md">
              <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 shadow-2xl text-white space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#A8C5BA] uppercase tracking-wider">FX Dashboard</span>
                  <span className="flex items-center gap-1.5 text-xs text-green-400 font-medium">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                    Live
                  </span>
                </div>

                {/* Chart */}
                <div className="bg-[#1B4332]/60 rounded-xl p-4">
                  <div className="text-[10px] text-gray-400 mb-0.5">AUD/USD Performance</div>
                  <div className="text-2xl font-bold mb-0.5">0.6423</div>
                  <div className="text-xs text-green-400 mb-3">▲ +1.24% This Week</div>
                  <svg viewBox="0 0 280 56" className="w-full" aria-hidden="true">
                    <defs>
                      <linearGradient id="heroGreenGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4ade80" stopOpacity="0.4"/>
                        <stop offset="100%" stopColor="#4ade80" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    <path d="M0,48 L25,44 L55,38 L80,34 L105,28 L130,31 L155,24 L180,20 L210,16 L240,12 L265,9 L280,6"
                      stroke="#4ade80" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M0,48 L25,44 L55,38 L80,34 L105,28 L130,31 L155,24 L180,20 L210,16 L240,12 L265,9 L280,6 L280,56 L0,56Z"
                      fill="url(#heroGreenGrad)"/>
                  </svg>
                </div>

                {/* Currency pairs */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { pair: "EUR/AUD", rate: "1.6901", change: "+0.42%", up: true },
                    { pair: "GBP/AUD", rate: "1.9723", change: "-0.18%", up: false },
                    { pair: "USD/AUD", rate: "1.5567", change: "+0.31%", up: true },
                  ].map(item => (
                    <div key={item.pair} className="bg-white/5 rounded-lg p-2.5 border border-white/10">
                      <div className="text-[10px] text-gray-400 mb-0.5">{item.pair}</div>
                      <div className="text-sm font-bold">{item.rate}</div>
                      <div className={`text-[10px] font-semibold ${item.up ? 'text-green-400' : 'text-red-400'}`}>
                        {item.change}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Hedge status */}
                <div className="flex items-center gap-3 bg-[#2D6A4F]/30 rounded-lg p-3 border border-[#2D6A4F]/40">
                  <div className="w-8 h-8 rounded-full bg-[#2D6A4F] flex items-center justify-center shrink-0">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-white">Hedge Coverage Active</div>
                    <div className="text-[10px] text-[#A8C5BA]">Portfolio protection running</div>
                  </div>
                  <div className="text-xs font-bold text-green-400 shrink-0">100%</div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-3 -right-3 bg-[#2D6A4F] text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg animate-bounce">
                {t('hero_trusted')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <HedgePolicyModal open={hedgePolicyOpen} onOpenChange={setHedgePolicyOpen} />
    </>
  )
}