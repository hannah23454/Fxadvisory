"use client"

import { TrendingUp, Zap, CreditCard, Users, ArrowRight, CheckCircle2, Sparkles } from "lucide-react"
import { useI18n } from "@/components/i18n/i18n"

export default function Services() {
  const { t } = useI18n()
  
  const services = [
    {
      icon: TrendingUp,
      title: t('services_forward'),
      description: t('services_forward_desc'),
      highlight: t('services_popular')
    },
    {
      icon: Zap,
      title: t('services_options'),
      description: t('services_options_desc'),
      highlight: t('services_flexible')
    },
    {
      icon: CreditCard,
      title: t('services_payments'),
      description: t('services_payments_desc'),
      highlight: t('services_fast_secure')
    },
    {
      icon: Users,
      title: t('services_advisory'),
      description: t('services_advisory_desc'),
      highlight: t('services_expert_led')
    },
  ]

  const benefits = [
    t('services_benefit_1'),
    t('services_benefit_2'),
    t('services_benefit_3')
  ]

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-linear-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-[#BD6908]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-[#12261F]/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header with Image */}
        <div className="grid lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center mb-12 md:mb-16">
          {/* Left - Image */}
          <div className="relative order-2 lg:order-1 group">
            <img 
              src="https://zilmoney.com/wp-content/uploads/2023/11/MicrosoftTeams-image-200.png" 
              alt={t('services_alt')}
              className="relative w-full h-auto transition-all duration-500 group-hover:scale-105"
            />
            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 bg-white rounded-xl md:rounded-2xl shadow-xl p-3 md:p-4 border border-gray-100">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-linear-to-br from-[#BD6908] to-[#d97b0a] rounded-lg md:rounded-xl flex items-center justify-center">
                  <Sparkles className="text-white" size={20} />
                </div>
                <div>
                  <div className="text-xl md:text-2xl font-bold text-[#12261F]">50+</div>
                  <div className="text-xs text-[#4A5A55]">{t('services_currencies')}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Header Content */}
          <div className="order-1 lg:order-2 space-y-3 md:space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-[#BD6908]/10 to-[#BD6908]/5 border border-[#BD6908]/20 backdrop-blur-sm">
              <div className="w-2 h-2 bg-[#BD6908] rounded-full animate-pulse"></div>
              <span className="text-xs md:text-sm font-bold text-[#12261F] tracking-wide">{t('services_badge')}</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#12261F] leading-tight">
              {t('services_title_1')}
              <span className="block text-transparent bg-clip-text bg-linear-to-r from-[#BD6908] to-[#d97b0a]">
                {t('services_title_2')}
              </span>
            </h2>
            
            <p className="text-base md:text-lg text-[#4A5A55] leading-relaxed">
              {t('services_desc')}
            </p>

            {/* Benefits list */}
            <div className="space-y-2.5 md:space-y-3 pt-2 md:pt-4">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-2.5 md:gap-3">
                  <CheckCircle2 className="text-green-500 shrink-0" size={18} />
                  <span className="text-[#12261F] font-medium text-sm md:text-base">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}