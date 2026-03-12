"use client"

import Header from "@/components/header"
import Hero from "@/components/hero"
import Services from "@/components/services"
import HowWeWork from "@/components/how-we-work"
import MarketInsights from "@/components/market-insights"
import LinkedInFeed from "@/components/linkedin-feed"
import CTA from "@/components/cta"
import Footer from "@/components/footer"
import LeadMagnetSection from "@/components/lead-magnet-section"
import Disclaimer from "@/components/disclaimer"
import CorporateFXHero from "@/components/CorporateFXHero"
import LetsTalkSection from "@/components/LetsTalkSection"
import BusinessLendingHero from "@/components/BusinessLendingHero"


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
