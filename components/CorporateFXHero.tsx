"use client"

import { CheckCircle2 } from "lucide-react"
import { useI18n } from "@/components/i18n/i18n"

export default function CorporateFXHero() {
  const { t } = useI18n()
  
  const features = [
    t('corp_fx_feature_1'),
    t('corp_fx_feature_2'),
    t('corp_fx_feature_3')
  ]

  return (
    <section className="py-6 sm:py-8 md:py-10 lg:py-12 bg-[#DCE5E1] relative overflow-hidden flex items-center">
      {/* Decorative background elements */}
      <div className="hidden md:block absolute top-20 right-16 w-24 h-24 lg:w-28 lg:h-28 border-4 border-[#BD6908]/10 rounded-full"></div>
      <div className="hidden md:block absolute bottom-32 left-8 w-20 h-20 lg:w-24 lg:h-24 bg-[#12261F]/5 rounded-full blur-xl"></div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center">
          {/* Left - Content */}
          <div className="space-y-4 sm:space-y-5">
            <div className="space-y-2 sm:space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold text-[#12261F] leading-tight">
                {t('corp_fx_title')}{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-[#BD6908] to-[#BD6908]">
                  {t('corp_fx_title_highlight')}
                </span>{" "}
                {t('corp_fx_title_end')}
              </h1>
            </div>

            {/* Features List */}
            <div className="space-y-3 sm:space-y-4">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2.5 sm:gap-3 group">
                  <div className="shrink-0 mt-1">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#BD6908] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                      <CheckCircle2 className="text-white" size={14} strokeWidth={2.5} />
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm sm:text-base md:text-base leading-relaxed pt-0.5">
                    {feature}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-2 sm:pt-3">
              <button className="w-full sm:w-auto group px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-[#BD6908] hover:bg-[#a05807] text-white font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                {t('corp_fx_cta')}
              </button>
            </div>
          </div>

          {/* Right - Image */}
          <div className="relative mt-6 lg:mt-0">
            {/* Floating currency symbols */}
            <div className="absolute -top-4 sm:-top-5 left-8 sm:left-12 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-base sm:text-lg font-bold text-[#BD6908] animate-bounce z-20" style={{ animationDuration: '3s' }}>
              £
            </div>
            <div className="absolute top-6 sm:top-8 -right-3 sm:-right-4 w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-full shadow-xl flex items-center justify-center text-sm sm:text-base font-bold text-[#BD6908] animate-bounce z-20" style={{ animationDuration: '4s', animationDelay: '0.5s' }}>
              ¥
            </div>
            <div className="absolute top-24 sm:top-28 -left-3 sm:-left-4 w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full shadow-xl flex items-center justify-center text-lg sm:text-xl font-bold text-[#BD6908] animate-bounce z-20" style={{ animationDuration: '3.5s', animationDelay: '1s' }}>
              €
            </div>
            
            {/* Main Image */}
            <div className="relative z-10">
              <img 
                src="https://zilmoney.com/wp-content/uploads/2022/11/Print-Payroll-Checks-Save-your-Time-and-Money-ZM.png" 
                alt={t('corp_fx_alt')}
                className="w-full h-auto max-w-full drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}