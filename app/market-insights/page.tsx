"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import MarketInsights from "@/components/market-insights"
import NewsletterSignup from "@/components/newsletter-signup"
import { useI18n } from "@/components/i18n/i18n"

export default function MarketInsightsPage() {
  const { t } = useI18n()
  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="bg-[#12261f] text-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 text-balance">{t('market_insights')}</h1>
          <p className="text-xl text-[#dce5e1]">{t('market_insights_hero_desc')}</p>
        </div>
      </section>

      {/* Insights Grid (re-uses the component used on home) */}
      <MarketInsights />

      {/* Newsletter CTA */}
      <section className="bg-[#12261f] text-white py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">{t('newsletter_cta_title')}</h2>
          <p className="text-[#dce5e1] mb-8">{t('newsletter_cta_desc')}</p>
          <NewsletterSignup />
        </div>
      </section>

      <Footer />
    </main>
  )
}
