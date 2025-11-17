"use client"

import { MessageCircle } from "lucide-react"
import Link from "next/link"
import { useI18n } from "@/components/i18n/i18n"

export default function CTA() {
  const { t } = useI18n()

  return (
    <section className="py-8 md:py-12 bg-[#12261F] text-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 text-balance">
          {t('cta_title')}
        </h2>
        <p className="text-sm md:text-base text-gray-300 mb-6 md:mb-8 leading-relaxed">
          {t('cta_desc')}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-5 md:mb-6">
          <Link
            href="/contact"
            className="px-5 md:px-6 py-2.5 md:py-3 rounded-full bg-[#BD6908] hover:bg-opacity-90 text-white font-medium transition inline-block text-sm"
          >
            {t('cta_book')}
          </Link>
          <button className="px-5 md:px-6 py-2.5 md:py-3 rounded-full border border-white text-white hover:bg-white hover:bg-opacity-10 font-medium transition flex items-center justify-center gap-2 text-sm">
            <MessageCircle size={16} />
            {t('cta_whatsapp')}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center text-xs">
          <div>
            <p className="text-gray-400">📞 +61 2 XXXX XXXX</p>
          </div>
          <div className="hidden sm:block h-5 w-px bg-gray-600"></div>
          <div>
            <p className="text-gray-400">📧 hello@switchyardfx.com</p>
          </div>
        </div>
      </div>
    </section>
  )
}