"use client"

import { useI18n } from "@/components/i18n/i18n"

export default function LetsTalkSection() {
  const { t } = useI18n()

  return (
    <section className="py-18 sm:py-22 md:py-26 lg:py-35 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 md:gap-16 lg:gap-20 items-center">
          {/* Left - Image */}
          <div className="relative order-2 lg:order-1">
            <img 
              src="https://img.freepik.com/free-vector/happy-freelancer-with-computer-home-young-man-sitting-armchair-using-laptop-chatting-online-smiling-vector-illustration-distance-work-online-learning-freelance_74855-8401.jpg" 
              alt={t('lets_talk_alt')}
              className="w-full h-auto max-w-sm mx-auto lg:max-w-md"
            />
          </div>

          {/* Right - Content */}
          <div className="space-y-4 sm:space-y-5 order-1 lg:order-2">
            <div className="space-y-3">
              <p className="text-xs sm:text-sm font-semibold text-[#12261F] tracking-wide uppercase">
                {t('lets_talk_badge')}
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#12261F] leading-tight">
                {t('lets_talk_title')}{" "}
                <span className="text-[#BD6908]">{t('lets_talk_title_highlight')}</span>
              </h2>
            </div>

            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              {t('lets_talk_desc')}
            </p>

            {/* CTA Button */}
            <div className="pt-1">
              <a 
                href="https://calendly.com/your-calendly-link" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-[#BD6908] hover:bg-[#a05807] text-white font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-center"
              >
                {t('lets_talk_cta')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}