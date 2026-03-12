"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownLeft,
  Minus,
  Lock,
  UserPlus,
  LogIn,
  Calendar,
  Tag,
  Users,
  BookOpen,
} from "lucide-react"

interface InsightDetail {
  id: string
  title: string
  summary: string
  body: string
  category: string
  date: string
  trend: "up" | "down" | "neutral"
  image: string
  sources: string
  audience: string
  pairs: string[]
}

function TrendBadge({ trend }: { trend: string }) {
  if (trend === "up")
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
        <ArrowUpRight size={13} /> Bullish
      </span>
    )
  if (trend === "down")
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full">
        <ArrowDownLeft size={13} /> Bearish
      </span>
    )
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-full">
      <Minus size={13} /> Neutral
    </span>
  )
}

function AuthGate() {
  return (
    <div className="relative">
      {/* Blurred content preview */}
      <div
        className="select-none pointer-events-none"
        style={{ WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 60%)", maskImage: "linear-gradient(to bottom, black 0%, transparent 60%)" }}
      >
        <p className="text-[#4A5A55] leading-relaxed text-base mb-4">
          This insight contains detailed FX market analysis including key support and resistance levels,
          positioning recommendations, and strategic commentary for corporate treasury teams…
        </p>
        <p className="text-[#4A5A55] leading-relaxed text-base opacity-60">
          Currency pair analysis, hedging opportunities, and forward rate expectations are discussed
          in detail with actionable guidance for your FX exposure management…
        </p>
      </div>

      {/* Gate overlay */}
      <div className="mt-6 bg-white rounded-2xl border border-[#DCE5E1] shadow-xl p-8 text-center">
        <div className="w-14 h-14 bg-[#E8EEEB] rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock size={24} className="text-[#2D6A4F]" />
        </div>
        <h3 className="text-2xl font-bold text-[#12261F] mb-2">
          Full Article Requires an Account
        </h3>
        <p className="text-[#4A5A55] mb-6 leading-relaxed max-w-md mx-auto">
          Create a free account or log in to read full FX insights, access expert commentary,
          and personalise your market topics.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#2D6A4F] text-white font-semibold text-sm hover:bg-[#1B4332] transition-all"
          >
            <UserPlus size={16} />
            Create Free Account
          </Link>
          <Link
            href={`/login?redirect=/market-insights`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 border-[#2D6A4F] text-[#2D6A4F] font-semibold text-sm hover:bg-[#2D6A4F] hover:text-white transition-all"
          >
            <LogIn size={16} />
            Log In
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function InsightDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session } = useSession()
  const isLoggedIn = !!session?.user

  const [insight, setInsight] = useState<InsightDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [id, setId] = useState<string | null>(null)

  useEffect(() => {
    params.then((p) => setId(p.id))
  }, [params])

  useEffect(() => {
    if (!id) return
    fetch(`/api/airtable/insights/${id}`)
      .then((r) => {
        if (r.status === 404) { setNotFound(true); return null }
        return r.json()
      })
      .then((data) => {
        if (data && !data.error) setInsight(data)
        else if (data?.error) setNotFound(true)
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  return (
    <main className="min-h-screen bg-[#FAFBFA]">
      <Header />

      {/* ─── Hero / Header ─── */}
      <section className="relative bg-[#12261f] text-white pb-32">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28">
          <Link
            href="/market-insights"
            className="inline-flex items-center gap-2 text-[#A8C5BA] hover:text-white text-sm font-medium mb-8 transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Market Insights
          </Link>

          {loading ? (
            <div className="space-y-4">
              <div className="h-4 w-24 bg-white/10 rounded-full animate-pulse" />
              <div className="h-10 w-3/4 bg-white/10 rounded-xl animate-pulse" />
              <div className="h-6 w-full bg-white/10 rounded-xl animate-pulse" />
            </div>
          ) : insight ? (
            <>
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#2D6A4F] text-[#A8C5BA] uppercase tracking-wider">
                  {insight.category}
                </span>
                <TrendBadge trend={insight.trend} />
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.15] tracking-tight mb-5">
                {insight.title}
              </h1>
              <p className="text-lg text-[#A8C5BA] leading-relaxed max-w-3xl">
                {insight.summary}
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-[#A8C5BA]">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  {insight.date}
                </span>
                {insight.pairs.length > 0 && (
                  <span className="flex items-center gap-1.5">
                    <Tag size={14} />
                    {insight.pairs.join(", ")}
                  </span>
                )}
                {insight.audience && (
                  <span className="flex items-center gap-1.5">
                    <Users size={14} />
                    {insight.audience}
                  </span>
                )}
              </div>
            </>
          ) : null}
        </div>
      </section>

      {/* ─── Content ─── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 pb-20">
        {/* Hero image */}
        {insight && (
          <div className="relative aspect-[21/9] rounded-2xl overflow-hidden mb-8 shadow-xl border border-[#DCE5E1]">
            <Image
              src={insight.image}
              alt={insight.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {loading && (
          <div className="bg-white rounded-2xl border border-[#DCE5E1] p-8 space-y-4">
            {[100, 90, 95, 80, 85].map((w, i) => (
              <div key={i} className={`h-4 bg-[#F0F4F2] rounded animate-pulse`} style={{ width: `${w}%` }} />
            ))}
          </div>
        )}

        {notFound && (
          <div className="bg-white rounded-2xl border border-[#DCE5E1] p-12 text-center">
            <BookOpen size={40} className="text-[#DCE5E1] mx-auto mb-4" />
            <h2 className="text-xl font-bold text-[#12261F] mb-2">Insight Not Found</h2>
            <p className="text-[#4A5A55] mb-6">This insight may have been removed or the link is incorrect.</p>
            <Link
              href="/market-insights"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2D6A4F] text-white font-semibold text-sm hover:bg-[#1B4332] transition-all"
            >
              Browse All Insights
            </Link>
          </div>
        )}

        {insight && !loading && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Article body */}
            <article className="lg:col-span-2 bg-white rounded-2xl border border-[#DCE5E1] p-8 sm:p-10">
              {isLoggedIn ? (
                <div className="prose prose-lg max-w-none">
                  {insight.body.split("\n").filter(Boolean).map((para, i) => (
                    <p key={i} className="text-[#12261F] leading-relaxed text-base mb-5 last:mb-0">
                      {para}
                    </p>
                  ))}

                  {insight.sources && (
                    <div className="mt-8 pt-6 border-t border-[#DCE5E1]">
                      <p className="text-xs text-[#52796F] font-semibold uppercase tracking-wider mb-1">Sources</p>
                      <p className="text-sm text-[#4A5A55]">{insight.sources}</p>
                    </div>
                  )}
                </div>
              ) : (
                /* Non-authenticated: show summary + auth gate */
                <div>
                  <p className="text-[#12261F] leading-relaxed text-base mb-6">
                    {insight.summary}
                  </p>
                  <AuthGate />
                </div>
              )}
            </article>

            {/* Sidebar */}
            <aside className="space-y-5">
              {/* Meta */}
              <div className="bg-white rounded-2xl border border-[#DCE5E1] p-5">
                <h4 className="text-xs font-bold text-[#12261F] uppercase tracking-wider mb-4">About This Insight</h4>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-xs text-[#52796F] font-semibold mb-0.5">Published</dt>
                    <dd className="text-sm text-[#12261F] font-medium">{insight.date}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#52796F] font-semibold mb-0.5">Category</dt>
                    <dd className="text-sm text-[#12261F] font-medium">{insight.category}</dd>
                  </div>
                  {insight.pairs.length > 0 && (
                    <div>
                      <dt className="text-xs text-[#52796F] font-semibold mb-1">FX Pairs</dt>
                      <dd className="flex flex-wrap gap-1">
                        {insight.pairs.map((p) => (
                          <span key={p} className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#E8EEEB] text-[#2D6A4F]">
                            {p}
                          </span>
                        ))}
                      </dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-xs text-[#52796F] font-semibold mb-0.5">Sentiment</dt>
                    <dd><TrendBadge trend={insight.trend} /></dd>
                  </div>
                  {insight.audience && (
                    <div>
                      <dt className="text-xs text-[#52796F] font-semibold mb-0.5">Audience</dt>
                      <dd className="text-sm text-[#12261F]">{insight.audience}</dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Related CTA */}
              <div className="bg-[#12261F] rounded-2xl p-5 text-center">
                <h4 className="text-base font-bold text-white mb-2">Explore All Insights</h4>
                <p className="text-[#A8C5BA] text-xs leading-relaxed mb-4">
                  Browse our full library of FX market commentary and strategic analysis.
                </p>
                <Link
                  href="/market-insights"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#2D6A4F] text-white font-semibold text-sm hover:bg-[#1B4332] transition-all"
                >
                  View All Articles
                </Link>
              </div>
            </aside>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
