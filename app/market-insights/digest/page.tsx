"use client"

import { useState, useEffect } from "react"
import React from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import FxChart, { type Pair } from "@/components/fx-chart"

// ─── helpers ────────────────────────────────────────────────────────────────

function CompassIcon({ light = false, size = 36 }: { light?: boolean; size?: number }) {
  const stroke = light ? "#a9c5bb" : "#2D6A4F"
  const fill = light ? "#a9c5bb" : "#2D6A4F"
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <circle cx="18" cy="18" r="15" stroke={stroke} strokeWidth="2" />
      <circle cx="18" cy="18" r="4.5" fill={fill} />
      <path d="M18 9V13.5M18 22.5V27M9 18H13.5M22.5 18H27" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <path d="M22.5 13.5L19.5 16.5M16.5 19.5L13.5 22.5" stroke={light ? "#74B49B" : "#a9c5bb"} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

const TICKER_ITEMS = [
  "AUD/USD ▲ 0.6512",
  "AUD/EUR ▼ 0.3891",
  "AUD/GBP ▲ 0.3245",
  "AUD/JPY ▲ 98.42",
  "AUD/NZD ▼ 1.0821",
  "USD/JPY ▲ 151.23",
  "EUR/USD ▼ 1.0534",
  "GBP/USD ▲ 1.2688",
  "USD/CAD ▼ 1.3512",
]

const GENERAL_MARKET_NEWS =
  "Rate-cut repricing and softer US inflation have shifted USD sentiment this week, while commodity resilience is supporting AUD crosses. Liquidity around upcoming US jobs and central bank commentary remains the key volatility trigger."

const PAIR_FORECASTS: Record<Pair, { direction: string; outlook: string }> = {
  "AUD/USD": {
    direction: "Bias remains moderately constructive while US data underperforms, but event-risk can quickly reverse the move.",
    outlook: "Watch payrolls and Fed speakers. A hold above 0.6500 supports near-term upside continuation; a stronger USD data surprise would likely retrace recent gains.",
  },
  "AUD/EUR": {
    direction: "Near-term direction remains higher as Eurozone growth uncertainty contrasts with steadier Australian demand indicators.",
    outlook: "ECB tone and regional PMIs are key. Further dovish signals in Europe would support AUD/EUR strength over the coming sessions.",
  },
  "AUD/GBP": {
    direction: "Directional conviction is mixed, with UK inflation expectations and BoE path uncertainty driving two-way price action.",
    outlook: "Expect range-bound behavior unless UK inflation materially surprises. A softer inflation print would likely favor AUD outperformance.",
  },
  "AUD/JPY": {
    direction: "Risk sentiment and Japan rate expectations continue to dominate this cross, keeping intraday swings elevated.",
    outlook: "Any signal of tighter BoJ policy or risk-off sentiment can pressure AUD/JPY quickly, while carry support remains in place in calmer conditions.",
  },
  "AUD/NZD": {
    direction: "Near-term direction is neutral-to-firm with relative growth data and commodity trends setting the tone.",
    outlook: "Expect incremental moves unless one central bank shifts guidance unexpectedly. Commodity softness would be the main downside risk for AUD/NZD.",
  },
}

function getRateLabel(v: number) {
  if (v < 20) return "Minimal"
  if (v < 40) return "Low"
  if (v < 60) return "Moderate"
  if (v < 80) return "High"
  return "Critical"
}

function getVolumeLabel(v: number) {
  if (v < 20) return "< $100K / mo"
  if (v < 40) return "$100K – $500K / mo"
  if (v < 60) return "$500K – $2M / mo"
  if (v < 80) return "$2M – $10M / mo"
  return "> $10M / mo"
}

// ─── page ───────────────────────────────────────────────────────────────────

export default function InsightsDigestPage() {
  const [formData, setFormData] = useState({
    rate: 50,
    volume: 50,
    name: "",
    company: "",
    email: "",
    notes: "",
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [selectedDigestPair, setSelectedDigestPair] = useState<Pair>("AUD/USD")
  const [isHeroExpanded, setIsHeroExpanded] = useState(false)
  const [isOutlookModalOpen, setIsOutlookModalOpen] = useState(false)

  // ── Poll state ──────────────────────────────────────────────────────────
  type PollOption = { id: string; label: string; votes: number }
  const [poll, setPoll] = useState<{ options: PollOption[]; total: number } | null>(null)
  const [selectedOption, setSelectedOption] = useState("")
  const [hasVoted, setHasVoted] = useState(false)
  const [pollSubmitting, setPollSubmitting] = useState(false)

  useEffect(() => {
    const voted = localStorage.getItem("insights-poll-vote")
    if (voted) setHasVoted(true)
    fetch("/api/insights/poll")
      .then((r) => r.json())
      .then((data) => setPoll(data))
      .catch(() => {})
  }, [])

  const handlePollSubmit = async () => {
    if (!selectedOption || hasVoted || pollSubmitting) return
    setPollSubmitting(true)
    try {
      const res = await fetch("/api/insights/poll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId: selectedOption }),
      })
      const data = await res.json()
      if (res.ok) {
        setPoll(data)
        setHasVoted(true)
        localStorage.setItem("insights-poll-vote", selectedOption)
      }
    } catch {}
    finally { setPollSubmitting(false) }
  }

  const handleSlider = (field: "rate" | "volume", value: number[]) =>
    setFormData((p) => ({ ...p, [field]: value[0] }))

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((p) => ({ ...p, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/airtable/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          notes: formData.notes,
          rate: String(formData.rate),
          volume: String(formData.volume),
          source: "Digest Form",
          requestType: "Custom Quote",
        }),
      })
      const data = await res.json()
      if (!res.ok && data.error && !data.warning) {
        setError(data.error || "Something went wrong. Please try again.")
        return
      }
      setSubmitted(true)
    } catch {
      setError("Unable to submit. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F0EB] flex flex-col">
      <Header />

      {/* ── TICKER STRIP ─────────────────────────────────────────────────── */}
      <div className="bg-[#113526] overflow-hidden">
        <div
          className="flex gap-0 py-3.5 whitespace-nowrap"
          style={{ animation: "ticker 28s linear infinite" }}
        >
          {[...Array(3)].map((_, i) => (
            <React.Fragment key={i}>
              {TICKER_ITEMS.map((item, j) => (
                <span key={`${i}-${j}`} className="text-sm font-semibold font-mono text-[#a9c5bb] tracking-widest px-8">
                  {item}
                  <span className="text-[#2D6A4F] ml-6">|</span>
                </span>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-[#0D1F19] via-[#113526] to-[#0F2E22] text-white py-10 sm:py-14 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "36px 36px",
          }}
        />
        <div className="absolute -top-16 -left-16 w-80 h-80 bg-[#2D6A4F] rounded-full blur-[120px] opacity-20 pointer-events-none" />
        <div className="absolute -bottom-16 right-0 w-72 h-72 bg-[#1B4332] rounded-full blur-[100px] opacity-30 pointer-events-none" />
        <div className="absolute right-6 top-5 hidden sm:block opacity-85">
          <CompassIcon light size={44} />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#2D6A4F]/60 bg-[#2D6A4F]/20 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-[#74B49B] animate-pulse" />
            <span className="text-[11px] font-bold text-[#A8C5BA] uppercase tracking-[0.18em]">
              Weekly Dispatch — {new Date().toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 leading-[1.05] tracking-tight">
            Your Market<br />
            <span className="text-[#a9c5bb]">Commentary .</span>
          </h1>

          <div className="mt-2 max-w-[580px] text-left">
            <div
              className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${
                isHeroExpanded ? "max-h-[20rem]" : "max-h-[5.25rem]"
              }`}
            >
              <p className="text-[#8AAFA5] text-base sm:text-[1.0625rem] leading-7">
                Shifting interest-rate expectations, softer US inflation prints, and mixed global risk sentiment are shaping FX markets this week. Australian dollar crosses are reacting to commodity resilience, while liquidity remains sensitive around central bank commentary and US labor data. The key setup for treasury teams is balancing protection against downside volatility with flexibility to capture favorable moves as policy expectations evolve. In this digest, we break down where momentum is building, where pricing looks stretched, and which currency pairs deserve closer attention over the next few sessions.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsHeroExpanded((prev) => !prev)}
              aria-expanded={isHeroExpanded}
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#2D6A4F]/70 bg-[#2D6A4F]/15 px-4 py-2 text-xs sm:text-sm font-bold text-[#C7DED5] hover:bg-[#2D6A4F]/25 transition-colors"
            >
              {isHeroExpanded ? "Read Less" : "Read More"}
            </button>
          </div>
        </div>
      </section>

      {/* ── CONNECTED MARKET SECTION ─────────────────────────────────────── */}
      <section
        className="bg-[#0C3A31] border-b border-[#1B4332] relative overflow-hidden"
        style={{
          backgroundImage: "url('/pattern-05.svg')",
          backgroundRepeat: "repeat",
          backgroundSize: "220px 220px",
        }}
      >
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="rounded-3xl border border-[#2D6A4F]/45 bg-[#10251E] p-6 sm:p-8">
            <div className="mb-8">
              <div className="flex items-start gap-4">
                <CompassIcon light />
                <div>
                  <p className="text-[10px] font-bold text-[#A8C5BA] uppercase tracking-[0.14em] mb-2">General Market News</p>
                  <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">Market Commentary and Currency Pair Analysis</h2>
                  <p className="text-[#C7DED5] leading-relaxed">{GENERAL_MARKET_NEWS}</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <FxChart onPairChange={setSelectedDigestPair} />
            </div>

            <div className="rounded-2xl border border-[#2D6A4F]/45 bg-[#113526] p-5 sm:p-6">
              <p className="text-[10px] font-bold text-[#A8C5BA] uppercase tracking-[0.14em] mb-2">Near-term Direction</p>
              <button
                type="button"
                onClick={() => setIsOutlookModalOpen(true)}
                className="group inline-flex items-center gap-2 text-left"
              >
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {selectedDigestPair} Outlook
                </h3>
                <span className="text-[#A8C5BA] text-xs sm:text-sm font-bold group-hover:text-white transition-colors">
                  (Click to view)
                </span>
              </button>
              <p className="text-[#D7E8E1] leading-relaxed mt-3">
                Click to open the full outlook in a popup.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[#113526] text-white border-b border-[#1B4332]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex items-start gap-5 p-6 rounded-2xl bg-[#1B4332]/50 border border-[#2D6A4F]/30">
            <CompassIcon light />
            <div>
              <p className="text-[10px] font-bold text-[#a9c5bb] uppercase tracking-[0.14em] mb-2">Strategy</p>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">
                Could this work for your business?
              </h2>
              <p className="text-[#8AAFA5] leading-relaxed mb-3">
                SwitchYard clients overlay strategies alongside existing forwards — helping balance a company's competitive market position while the broader hedging program maintains compliance and budget-rate certainty.
              </p>
              <p className="text-[#8AAFA5] leading-relaxed mb-6">
                This approach is particularly effective for importers and exporters with consistent monthly flows above $500K. The strategy adapts to your existing forward book and treasury policy.
              </p>
              <p className="text-sm font-bold text-[#a9c5bb]">
                Check out if this could suit your current objectives ↓
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── WEEKLY KEY DATA SPOTLIGHT ────────────────────────────────────── */}
      <section className="bg-white border-b border-[#DCE5E1]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="p-6 rounded-2xl bg-[#F5F7F6] border border-[#DCE5E1]">
            <div className="flex items-start gap-5">
              <CompassIcon />
              <div className="flex-1">
                <p className="text-[10px] font-bold text-[#52796F] uppercase tracking-[0.14em] mb-2">
                  Weekly Key Data Spotlight
                </p>
                <h2 className="text-2xl sm:text-3xl font-black text-[#12261F] mb-4">
                  Australian Employment Data{" "}
                  <span className="text-[#2D6A4F]">(AUD Catalyst)</span>
                </h2>
                <p className="text-[#4A5A55] leading-relaxed mb-6">
                  Employment figures are a direct input to RBA rate expectations — markets can reprice the rate outlook quickly, and AUD tends to move first, often in thin overnight conditions. Having a plan{" "}
                  <strong className="text-[#12261F]">before</strong> the release avoids forced decisions in volatile post-data moves.
                </p>

                <div className="space-y-3 mb-6">
                  {[
                    {
                      label: "Limit / target orders",
                      desc: "Capture favourable spikes overnight automatically",
                    },
                    {
                      label: "Layered forwards",
                      desc: "Lock a portion of budget rates ahead of the event",
                    },
                    {
                      label: "Options (e.g., collars)",
                      desc: "Protect downside while keeping upside participation",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-start gap-3 p-4 rounded-xl bg-white border border-[#DCE5E1]"
                    >
                      <span className="text-[#2D6A4F] text-xs font-bold mt-0.5">◆</span>
                      <div>
                        <p className="text-sm font-bold text-[#12261F]">{item.label}</p>
                        <p className="text-xs text-[#52796F] mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-[#52796F] mb-5">
                  General market information only. Not a recommendation or offer.
                </p>

                <a
                  href="#custom-quote"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#a9c5bb] hover:bg-[#8AAFA5] text-[#12261F] text-sm font-bold transition-colors"
                >
                  Ideas to manage this data release →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── THOUGHT LEADERSHIP ───────────────────────────────────────────── */}
      <section className="bg-white border-b border-[#DCE5E1]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="p-6 rounded-2xl bg-white border border-[#DCE5E1]">
            <div className="flex items-start gap-5">
              <CompassIcon />
              <div>
                <p className="text-[10px] font-bold text-[#52796F] uppercase tracking-[0.14em] mb-2">
                  Thought Leadership
                </p>
                <h2 className="text-2xl sm:text-3xl font-black text-[#12261F] mb-6">
                  Thought provoking talking points
                </h2>

                <div className="space-y-4 mb-8">
                  {[
                    "What % of your EBITDA is exposed to FX volatility over the next 12 months?",
                    "Fully hedged? Partially hedged? Intentionally unhedged?",
                    "Are you using data and technology to drive measurable FX outcomes for your business?",
                    "How does your current hedging program compare against peers in your industry?",
                  ].map((point, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-[#2D6A4F] font-bold mt-0.5 shrink-0">♦</span>
                      <p className="text-[#4A5A55] text-sm leading-relaxed">{point}</p>
                    </div>
                  ))}
                </div>

                <a
                  href="/market-insights"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#12261F] hover:bg-[#1B4332] text-white text-sm font-bold tracking-wide transition-colors"
                >
                  LEARN MORE
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── POLLS SECTION ────────────────────────────────────────────────── */}
      <section className="bg-[#F5F7F6] border-b border-[#DCE5E1]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid md:grid-cols-2 gap-8">
            {/* ── ACTIVE POLL ────────────────────────────────────────────── */}
            <div className="p-6 rounded-2xl bg-[#FAFBFA] border border-[#DCE5E1]">
              <p className="text-[10px] font-bold text-[#52796F] uppercase tracking-[0.14em] mb-2">Active Poll</p>
              <h3 className="text-lg sm:text-xl font-black text-[#12261F] mb-2">Margin Pressure Poll</h3>
              <p className="text-[#4A5A55] text-sm mb-6">What is currently eroding your margins the most?</p>

              {hasVoted && poll ? (
                /* voted — show results inline */
                <div className="space-y-3 mb-6">
                  {poll.options.map((opt) => {
                    const pct = poll.total > 0 ? Math.round((opt.votes / poll.total) * 100) : 0
                    const isChosen = localStorage.getItem("insights-poll-vote") === opt.id
                    return (
                      <div key={opt.id}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className={`font-medium ${isChosen ? "text-[#12261F] font-bold" : "text-[#4A5A55]"}`}>
                            {opt.label}{isChosen && " ✓"}
                          </span>
                          <span className="font-bold text-[#2D6A4F]">{pct}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-[#E8EEEB] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#2D6A4F] to-[#74B49B] transition-all duration-700"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                  <p className="text-xs text-[#52796F] pt-2">{poll.total} votes cast — thanks for voting!</p>
                </div>
              ) : (
                /* not voted — show radio options */
                <div className="space-y-3 mb-6">
                  {(poll?.options ?? [
                    { id: "input-costs", label: "Input costs (imports, commodities)" },
                    { id: "wage-growth", label: "Wage growth" },
                    { id: "financing-costs", label: "Financing costs" },
                    { id: "pricing-resistance", label: "Pricing resistance from customers" },
                  ]).map((opt) => (
                    <label
                      key={opt.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedOption === opt.id
                          ? "border-[#2D6A4F] bg-[#E8EEEB]"
                          : "border-[#DCE5E1] bg-white hover:border-[#a9c5bb]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="poll"
                        value={opt.id}
                        checked={selectedOption === opt.id}
                        onChange={() => setSelectedOption(opt.id)}
                        className="accent-[#2D6A4F] w-4 h-4 shrink-0"
                      />
                      <span className="text-sm text-[#12261F]">{opt.label}</span>
                    </label>
                  ))}
                </div>
              )}

              {!hasVoted && (
                <button
                  onClick={handlePollSubmit}
                  disabled={!selectedOption || pollSubmitting}
                  className="w-full px-7 py-2.5 rounded-full bg-[#12261F] hover:bg-[#1B4332] disabled:opacity-40 text-white text-sm font-bold tracking-wide transition-colors"
                >
                  {pollSubmitting ? "Submitting…" : "SUBMIT"}
                </button>
              )}
            </div>

            {/* ── LAST WEEK'S POLL ────────────────────────────────────────── */}
            <div className="p-6 rounded-2xl bg-[#FAFBFA] border border-[#DCE5E1]">
              <p className="text-[10px] font-bold text-[#52796F] uppercase tracking-[0.14em] mb-2">Last Week</p>
              <h3 className="text-lg sm:text-xl font-black text-[#12261F] mb-2">Last Week's Poll Result</h3>
              <p className="text-[#4A5A55] text-sm mb-6">What is your biggest FX concern right now?</p>

              <div className="space-y-4 mb-6">
                {[
                  { label: "Volatility & timing", pct: 42 },
                  { label: "Budget rate uncertainty", pct: 27 },
                  { label: "Cashflow predictability", pct: 18 },
                  { label: "Hedge accounting impact", pct: 13 },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-[#4A5A55]">{item.label}</span>
                      <span className="font-black text-[#12261F]">{item.pct}%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-[#DCE5E1] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#113526] to-[#2D6A4F]"
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full px-7 py-2.5 rounded-full bg-[#a9c5bb] hover:bg-[#8AAFA5] text-[#12261F] text-sm font-bold tracking-wide transition-colors">
                LAST WEEK RESULTS
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CUSTOM QUOTE FORM ────────────────────────────────────────────── */}
      <section className="bg-white border-b border-[#DCE5E1]" id="custom-quote">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          {/* Section header */}
          <div className="flex items-start gap-5 mb-10 p-6 rounded-2xl bg-[#F5F7F6] border border-[#DCE5E1]">
            <CompassIcon />
            <div>
              <p className="text-[10px] font-bold text-[#52796F] uppercase tracking-[0.14em] mb-2">Custom Quote</p>
              <h2 className="text-2xl sm:text-3xl font-black text-[#12261F] mb-2">
                Get Your Customised FX Solution
              </h2>
              <p className="text-[#4A5A55] text-sm leading-relaxed max-w-xl">
                Tell us your requirements and we'll craft the perfect hedging strategy for your business.
                Adjust the sliders and fill in your details — we'll review and get back to you shortly.
              </p>
            </div>
          </div>

          {submitted ? (
            /* ── success state ── */
            <div className="text-center py-16 max-w-md mx-auto">
              <div className="w-16 h-16 bg-[#E8EEEB] rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={32} className="text-[#2D6A4F]" />
              </div>
              <h3 className="text-2xl font-black text-[#12261F] mb-3">Request Received</h3>
              <p className="text-[#4A5A55] leading-relaxed mb-8">
                Thank you! We'll review your requirements and get back to you shortly with a customised offer.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false)
                  setFormData({ rate: 50, volume: 50, name: "", company: "", email: "", notes: "" })
                }}
                className="px-6 py-3 rounded-xl bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-semibold transition-colors"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            /* ── form ── */
            <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
              {/* Rate slider */}
              <div className="bg-[#F5F7F6] rounded-2xl border border-[#DCE5E1] p-6">
                <div className="flex items-end justify-between mb-5">
                  <div>
                    <label className="block text-sm font-bold text-[#12261F] mb-1">
                      Exchange Rate Exposure
                    </label>
                    <p className="text-xs text-[#52796F]">How sensitive is your business to FX movements?</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-[#2D6A4F] leading-none">{formData.rate}%</div>
                    <p className="text-xs text-[#52796F] mt-1">{getRateLabel(formData.rate)}</p>
                  </div>
                </div>
                <Slider
                  value={[formData.rate]}
                  onValueChange={(v) => handleSlider("rate", v)}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-[#52796F] mt-2">
                  <span>Minimal</span>
                  <span>Critical</span>
                </div>
              </div>

              {/* Volume slider */}
              <div className="bg-[#F5F7F6] rounded-2xl border border-[#DCE5E1] p-6">
                <div className="flex items-end justify-between mb-5">
                  <div>
                    <label className="block text-sm font-bold text-[#12261F] mb-1">
                      Monthly Transaction Volume
                    </label>
                    <p className="text-xs text-[#52796F]">What's your typical monthly FX volume?</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-[#2D6A4F] leading-tight">{getVolumeLabel(formData.volume)}</div>
                    <p className="text-xs text-[#52796F] mt-1">{formData.volume}% of scale</p>
                  </div>
                </div>
                <Slider
                  value={[formData.volume]}
                  onValueChange={(v) => handleSlider("volume", v)}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-[#52796F] mt-2">
                  <span>&lt; $100K</span>
                  <span>&gt; $10M</span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-[#DCE5E1]" />

              {/* Contact fields */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#12261F]">Your Details</h3>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name *"
                  value={formData.name}
                  onChange={handleInput}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#DCE5E1] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] bg-white text-[#12261F] placeholder-[#52796F] text-sm"
                />
                <input
                  type="text"
                  name="company"
                  placeholder="Company Name"
                  value={formData.company}
                  onChange={handleInput}
                  className="w-full px-4 py-3 rounded-xl border border-[#DCE5E1] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] bg-white text-[#12261F] placeholder-[#52796F] text-sm"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Work Email *"
                  value={formData.email}
                  onChange={handleInput}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#DCE5E1] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] bg-white text-[#12261F] placeholder-[#52796F] text-sm"
                />
                <textarea
                  name="notes"
                  placeholder="Notes / requirements — any specific hedging goals, currencies, or timeframes..."
                  value={formData.notes}
                  onChange={handleInput}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-[#DCE5E1] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] bg-white text-[#12261F] placeholder-[#52796F] text-sm resize-none"
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold py-4 rounded-xl text-base transition-all"
              >
                {loading ? "Submitting…" : "Get My Custom Quote →"}
              </Button>

              <p className="text-xs text-[#52796F] text-center">
                We respect your privacy. No spam, ever. General market information only — not a recommendation or offer.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ── FAQ SECTION ──────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-[#DCE5E1]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-[#12261F] mb-2">
              Got questions? We've got answers.
            </h2>
            <p className="text-[#4A5A55] text-sm">
              No calls. No pressure. Just smart insights tailored to you.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[
              {
                q: "What's included in basic coverage?",
                a: "Weekly FX commentary, currency pair analysis, and data event alerts tailored to your exposure.",
              },
              {
                q: "Will switching cancel my current insights?",
                a: "Not at all. Your current access stays active while we onboard you to a customised solution.",
              },
              {
                q: "How can I secure multiple rate objectives?",
                a: "We layer forwards, options and target orders to address multiple budget rates simultaneously.",
              },
            ].map((item) => (
              <div
                key={item.q}
                className="bg-[#F5F7F6] rounded-2xl border border-[#DCE5E1] p-5 shadow-xs"
              >
                <p className="text-sm font-bold text-[#12261F] mb-2">→ {item.q}</p>
                <p className="text-xs text-[#4A5A55] leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <a
              href="#custom-quote"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#12261F] hover:bg-[#1B4332] text-white text-sm font-bold tracking-wide transition-colors"
            >
              Get in touch
            </a>
          </div>
        </div>
      </section>

      {isOutlookModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          onClick={() => setIsOutlookModalOpen(false)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl border border-[#2D6A4F]/50 bg-[#10251E] p-6 sm:p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <p className="text-[10px] font-bold text-[#A8C5BA] uppercase tracking-[0.14em] mb-2">Near-term Direction</p>
                <h3 className="text-2xl sm:text-3xl font-black text-white">{selectedDigestPair} Outlook</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOutlookModalOpen(false)}
                className="rounded-full border border-[#2D6A4F]/60 px-3 py-1.5 text-xs font-bold text-[#C7DED5] hover:bg-[#2D6A4F]/25 transition-colors"
              >
                Close
              </button>
            </div>
            <p className="text-[#D7E8E1] leading-relaxed mb-4">{PAIR_FORECASTS[selectedDigestPair].direction}</p>
            <p className="text-[#BBD4CA] leading-relaxed">{PAIR_FORECASTS[selectedDigestPair].outlook}</p>
          </div>
        </div>
      )}

      <Footer />
    </main>
  )
}
