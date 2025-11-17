"use client"

import LeadMagnetForm from "./lead-magnet-form"
import { useI18n } from "@/components/i18n/i18n"

export default function LeadMagnetSection() {
  const { t } = useI18n()
  
  const benefits = [
    t('lead_benefit_1'),
    t('lead_benefit_2'),
    t('lead_benefit_3')
  ]

  return (
    <section className="py-20 md:py-28 bg-[#F5F7F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <span className="inline-block px-4 py-1 rounded-full bg-[#BD6908] bg-opacity-20 text-white text-xs font-semibold mb-4">
              {t('lead_free_resource')}
            </span>
            <h2 className="text-4xl font-bold text-[#12261F] mb-6">{t('lead_title')}</h2>
            <p className="text-lg text-[#4A5A55] mb-4 leading-relaxed">
              {t('lead_desc')}
            </p>
            <ul className="space-y-3 mb-8">
              {benefits.map((item, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="text-[#BD6908] font-bold mt-1">✓</span>
                  <span className="text-[#4A5A55]">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Form */}
          <div>
            <LeadMagnetForm />
          </div>
        </div>
      </div>
    </section>
  )
}
