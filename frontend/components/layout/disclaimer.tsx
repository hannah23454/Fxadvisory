"use client"

import { useI18n } from "@/components/context/i18n/i18n"
import { useSiteSettings } from "@/components/context/site-settings/site-settings"

export default function Disclaimer() {
  const { t } = useI18n()
  const { settings } = useSiteSettings()

  const s = (key: string) => settings[key] || t(key)

  return (
    <section className="bg-[#F5F7F6] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border border-[#DCE5E1] rounded p-6 space-y-3">
          <p className="text-xs text-[#4A5A55] leading-relaxed text-center">
            <strong>{s('disclaimer_title')}</strong>
          </p>
          <p className="text-xs text-[#4A5A55] leading-relaxed">
            {s('disclaimer_text_1')}
          </p>
          <p className="text-xs text-[#4A5A55] leading-relaxed">
            {s('disclaimer_text_2')}
          </p>
          <p className="text-xs text-[#4A5A55] leading-relaxed">
            {s('disclaimer_programme_prefix')}{" "}
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
