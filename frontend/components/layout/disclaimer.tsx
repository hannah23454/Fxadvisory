"use client"

import { useI18n } from "@/components/context/i18n/i18n"

export default function Disclaimer() {
  const { t } = useI18n()

  return (
    <section className="bg-[#F5F7F6] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border border-[#DCE5E1] rounded p-6 space-y-3">
          <p className="text-xs text-[#4A5A55] leading-relaxed text-center">
            <strong>{t('disclaimer_title')}</strong>
          </p>
          <p className="text-xs text-[#4A5A55] leading-relaxed">
            {t('disclaimer_text_1')}
          </p>
          <p className="text-xs text-[#4A5A55] leading-relaxed">
            {t('disclaimer_text_2')}
          </p>
          <p className="text-xs text-[#4A5A55] leading-relaxed">
            {t('disclaimer_programme_prefix')}{" "}
            <a
              href="https://www.ebury.au/legal/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[#2D6A4F]"
            >
              ebury.au/legal
            </a>{" "}
            {t('disclaimer_programme_conjunction')}{" "}
            <a
              href="https://ebury.com/en-au/compliance-legal/legal"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[#2D6A4F]"
            >
              ebury.com/en-au/compliance-legal/legal
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  )
}
