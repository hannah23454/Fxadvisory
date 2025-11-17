"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import Disclaimer from "@/components/disclaimer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useI18n } from "@/components/i18n/i18n"

export default function About() {
  const { t } = useI18n()

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-[#12261f] text-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 text-balance">{t('about_title')}</h1>
          <p className="text-xl text-[#dce5e1]">{t('about_subtitle')}</p>
        </div>
      </section>

      {/* Mission & Partnership */}
      <section className="py-16 px-6 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-[#12261f] mb-4">{t('about_mission_title')}</h2>
            <p className="text-lg text-[#4a5a55] leading-relaxed mb-4">{t('about_mission_p1')}</p>
            <p className="text-lg text-[#4a5a55] leading-relaxed">{t('about_mission_p2')}</p>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-[#12261f] mb-4">{t('about_partnership_title')}</h2>
            <p className="text-lg text-[#4a5a55] leading-relaxed mb-4">{t('about_partnership_p1')}</p>
            <p className="text-lg text-[#4a5a55] leading-relaxed">{t('about_partnership_p2')}</p>
          </div>
        </div>
      </section>

      {/* How We Work Process */}
      <section className="bg-[#f5f7f6] py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-[#12261f] mb-12 text-center">{t('about_process_title')}</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '01', title: t('step_1_title'), desc: t('about_process_assess') },
              { step: '02', title: t('step_2_title'), desc: t('about_process_hedge') },
              { step: '03', title: t('step_3_title'), desc: t('about_process_track') },
              { step: '04', title: t('step_4_title'), desc: t('about_process_report') },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="bg-[#bd6908] text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="font-bold text-lg text-[#12261f] mb-2">{item.title}</h3>
                <p className="text-sm text-[#4a5a55] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-[#12261f] mb-6">{t('about_cta_title')}</h2>
        <p className="text-lg text-[#4a5a55] mb-8 max-w-2xl mx-auto">{t('about_cta_desc')}</p>
        <Link href="/contact" className="inline-block">
          <Button className="bg-[#bd6908] hover:bg-[#a35a07] text-white font-bold px-8 py-4">{t('cta_book')}</Button>
        </Link>
      </section>

      <Disclaimer />
      <Footer />
    </main>
  )
}
