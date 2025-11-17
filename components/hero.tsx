"use client"

import { TrendingUp, Shield, Clock } from "lucide-react"
import { useI18n } from "@/components/i18n/i18n"

export default function Hero() {
  const { t } = useI18n()

  return (
    <section className="bg-[#12261F] text-white py-12 md:py-16 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-72 h-72 bg-[#BD6908] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#BD6908] rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-5">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#BD6908] bg-opacity-15 text-white text-sm font-semibold border border-[#BD6908] border-opacity-30">
                <Shield className="w-4 h-4" />
                {t('hero_badge')}
              </span>
              
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                {t('hero_title_1')}
                <br />
                <span className="text-[#BD6908]">{t('hero_title_2')}</span>
              </h1>
              
              <p className="text-lg text-gray-300 leading-relaxed">
                {t('hero_desc')}
              </p>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-5 text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#BD6908]" />
                <span className="text-gray-300">{t('hero_expert_analysis')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#BD6908]" />
                <span className="text-gray-300">{t('hero_risk_protection')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#BD6908]" />
                <span className="text-gray-300">{t('hero_15min_setup')}</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button className="group px-6 py-3 rounded-full bg-[#BD6908] hover:bg-[#d67709] text-white font-semibold transition-all duration-300 shadow-lg shadow-[#BD6908]/20 hover:shadow-xl hover:shadow-[#BD6908]/30 hover:scale-105">
                {t('hero_book_consult')}
                <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </button>
              <button className="px-6 py-3 rounded-full border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 font-semibold transition-all duration-300 backdrop-blur-sm">
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
                <p className="text-sm font-semibold text-gray-300">{t('hero_live_fx')}</p>
                <span className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  {t('hero_updated_live')}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-colors">
                  <p className="text-xs text-gray-400 mb-1 font-medium">AUD/USD</p>
                  <p className="text-2xl font-bold text-white">0.6842</p>
                  <p className="text-xs text-green-400 mt-1">+0.12%</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-colors">
                  <p className="text-xs text-gray-400 mb-1 font-medium">AUD/EUR</p>
                  <p className="text-2xl font-bold text-white">0.6290</p>
                  <p className="text-xs text-red-400 mt-1">-0.08%</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-colors">
                  <p className="text-xs text-gray-400 mb-1 font-medium">AUD/GBP</p>
                  <p className="text-2xl font-bold text-white">0.5412</p>
                  <p className="text-xs text-green-400 mt-1">+0.05%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="hidden md:flex items-center justify-center relative -mt-23 ">
            <div className="relative">
              {/* Image container */}
              <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 shadow-2xl">
                <img 
                  src="https://pushonline.com/wp-content/uploads/2025/01/choose-us.png" 
                  alt={t('hero_alt')}
                  className="w-full h-auto max-w-md drop-shadow-2xl"
                />
              </div>
              
              {/* Floating badge */}
              <div className="absolute -top-3 -right-3 bg-[#BD6908] text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg animate-bounce">
                {t('hero_trusted')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}