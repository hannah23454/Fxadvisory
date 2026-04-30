"use client"

import { ArrowUpRight } from "lucide-react"

const partners = [
  {
    name: "Ebury",
    description: "Global FX and trade finance solutions for businesses with international payments.",
    color: "#0B2B5B",
    initials: "EB",
    href: "https://www.ebury.com",
  },
  {
    name: "Bracket",
    description: "Smart hedging technology for corporates and SMEs managing currency risk.",
    color: "#6C47FF",
    initials: "BR",
    href: "https://www.bracket.com",
  },
  {
    name: "Macquarie",
    description: "Institutional-grade FX execution and risk management for mid-market and enterprise.",
    color: "#000000",
    initials: "MQ",
    href: "https://www.macquarie.com",
  },
  {
    name: "CAFX",
    description: "Australian FX advisory offering tailored hedging solutions and market access.",
    color: "#1A5632",
    initials: "CA",
    href: "https://www.cafx.com.au",
  },
]

export default function PartnerTiles() {
  return (
    <section className="bg-[#F0F4F2] py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#2D6A4F]/10 text-[#2D6A4F] mb-4 tracking-wider uppercase">
            Our Network
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#12261F] mb-3 tracking-tight">
            Trusted Partners
          </h2>
          <p className="text-[#4A5A55] text-lg max-w-2xl mx-auto leading-relaxed">
            We work with leading FX providers to deliver the best outcomes for our clients.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {partners.map((partner) => (
            <a
              key={partner.name}
              href={partner.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col rounded-2xl bg-white border border-[#DCE5E1] p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              {/* Logo placeholder */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm mb-4"
                style={{ backgroundColor: partner.color }}
              >
                {partner.initials}
              </div>

              <h3 className="text-lg font-bold text-[#12261F] mb-2 group-hover:text-[#2D6A4F] transition-colors">
                {partner.name}
              </h3>
              <p className="text-sm text-[#4A5A55] leading-relaxed flex-1 mb-4">
                {partner.description}
              </p>

              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2D6A4F] opacity-0 group-hover:opacity-100 transition-opacity">
                Learn More <ArrowUpRight size={14} />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
