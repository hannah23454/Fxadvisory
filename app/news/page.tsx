"use client"

import { useEffect, useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Disclaimer from "@/components/disclaimer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface NewsItem {
  id: string
  title: string
  summary: string
  category: string
  date: string
}

const fallbackNews: NewsItem[] = [
  {
    id: "1",
    title: "SwitchYard Launches Treasury Dashboard for Mid-Market CFOs",
    summary: "Real-time hedge monitoring and compliance reporting now available to all clients.",
    date: "2025-01-16",
    category: "Product",
  },
  {
    id: "2",
    title: "RBA Rate Decision: What It Means for Your FX Strategy",
    summary: "Latest policy shift and our recommendations for corporate hedging adjustments.",
    date: "2025-01-14",
    category: "Policy",
  },
  {
    id: "3",
    title: "New Zero-Cost Collar Strategies Now Available",
    summary: "Protect downside while maintaining upside participation in volatile markets.",
    date: "2025-01-12",
    category: "Product",
  },
]

export default function News() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>(fallbackNews)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/airtable/insights?limit=20")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setNewsItems(
            data.map((item: any) => ({
              id: item.id,
              title: item.title,
              summary: item.summary,
              date: item.date,
              category: item.category,
            }))
          )
        }
      })
      .catch(() => {/* use fallback */})
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <section className="bg-[#12261f] text-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 text-balance">Latest News &amp; Updates</h1>
          <p className="text-xl text-[#dce5e1]">
            Stay informed on market developments, regulatory changes, and SwitchYard updates.
          </p>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="space-y-6">
              {[1,2,3].map(n => (
                <div key={n} className="h-40 rounded-lg bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {newsItems.map((item) => (
                <Card key={item.id} className="bg-white border-[#dce5e1] hover:shadow-lg transition p-6">
                  <div className="flex items-start justify-between mb-4">
                    <span className="px-3 py-1 bg-[#dce5e1] text-[#12261f] text-xs font-bold rounded">
                      {item.category}
                    </span>
                    <span className="text-sm text-[#4a5a55]">{item.date}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#12261f] mb-3">{item.title}</h3>
                  <p className="text-[#4a5a55] mb-4 leading-relaxed">{item.summary}</p>
                  <Link href="/market-insights">
                    <Button variant="link" className="text-[#2D6A4F] p-0 h-auto font-bold cursor-pointer">
                      Read More →
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Disclaimer />
      <Footer />
    </main>
  )
}
