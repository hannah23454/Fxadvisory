"use client"

import { useI18n } from "@/components/i18n/i18n"

export default function Disclaimer() {
  const { t } = useI18n()

  return (
    <section className="bg-[#F5F7F6] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border border-[#DCE5E1] rounded p-6">
          <p className="text-xs text-[#4A5A55] leading-relaxed text-center">
            <strong>{t('disclaimer_title')}</strong> {t('disclaimer_text')}
          </p>
        </div>
      </div>
    </section>
  )
}
