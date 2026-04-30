"use client"

import Header from "@/components/layout/header"
import Hero from "@/components/features/hero"
import Services from "@/components/features/services"
import HowWeWork from "@/components/features/how-we-work"
import MarketInsights from "@/components/features/market-insights"
import LinkedInFeed from "@/components/features/linkedin-feed"
import CTA from "@/components/features/cta"
import Footer from "@/components/layout/footer"
import LeadMagnetSection from "@/components/forms/lead-magnet-section"
import Disclaimer from "@/components/layout/disclaimer"
import CorporateFXHero from "@/components/features/CorporateFXHero"
import LetsTalkSection from "@/components/features/LetsTalkSection"
import BusinessLendingHero from "@/components/features/BusinessLendingHero"


export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Services />
      <CorporateFXHero />
      <LetsTalkSection />
      <BusinessLendingHero />
      <HowWeWork />
      <LeadMagnetSection />
      <MarketInsights />
      <LinkedInFeed />
      <CTA />
      <Disclaimer />
      <Footer />
    </main>
  )
}
