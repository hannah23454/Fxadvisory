"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { CheckCircle2, RotateCcw, TrendingUp, X } from "lucide-react"
import FxChart, { type Pair } from "@/components/features/fx-chart"

const COUNTRY_MAP: Record<string, string> = {
  USD: "us", EUR: "eu", GBP: "gb", JPY: "jp", NZD: "nz",
  AUD: "au", CAD: "ca", CNY: "cn", SGD: "sg", HKD: "hk", INR: "in", MXN: "mx",
}

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


const PAIR_FORECASTS: Record<Pair, { direction: string; outlook: string }> = {
  "AUD/USD": {
    direction: "Bias remains moderately constructive while US data underperforms, but event-risk can quickly reverse the move.",
    outlook: "Watch payrolls and Fed speakers closely for directional cues. A hold above 0.6500 supports near-term upside continuation; a stronger USD data surprise would likely retrace recent gains. Market positioning remains extended, with options traders pricing in elevated volatility ahead of key economic releases. The RBA's messaging on rate paths will also feature prominently in the coming sessions. Technical resistance sits at 0.6550, with support established around 0.6480. Geopolitical developments and energy prices remain background risks that could amplify moves during low-liquidity sessions. For hedging programs, standing orders remain a prudent discipline ahead of employment data. A break above 0.6550 could attract fresh bullish interest from institutional flows. Conversely, a close below 0.6480 would suggest a test of 0.6450 support. Monitor real-time commentary from central bankers for unexpected policy signals.",
  },
  "AUD/EUR": {
    direction: "Near-term direction remains higher as Eurozone growth uncertainty contrasts with steadier Australian demand indicators.",
    outlook: "ECB tone and regional PMIs are key catalysts for this pair's next directional move. Further dovish signals in Europe would support AUD/EUR strength over the coming sessions and weeks. Eurozone economic resilience has disappointed, creating headwinds for the euro across major crosses. Australian data surprises to the upside have bolstered the commodity-linked Australian dollar narrative. Technical analysis shows resistance around 0.6850 with support established at 0.6720 levels. Carry traders remain interested in this pair given the interest rate differential. Watch for ECB speakers this week—any dovish messaging could push EUR lower. The next major data point will be Eurozone PMI releases which could reset market expectations. Risk remains that stronger-than-expected Eurozone data could reverse recent weakness. A break above 0.6850 would likely attract additional bullish positioning from asset managers.",
  },
  "AUD/GBP": {
    direction: "Directional conviction is mixed, with UK inflation expectations and BoE path uncertainty driving two-way price action.",
    outlook: "Expect range-bound behavior unless UK inflation materially surprises on the next reading. A softer inflation print would likely favor AUD outperformance versus sterling. UK wage growth data remains elevated, supporting the case for sustained BoE restrictions. However, softer services PMI suggests cooling in the broader UK economy. Australian wage price index remains supportive of the RBA's hawkish stance relative to BoE expectations. Technical support is positioned around 0.4120 with resistance at 0.4210 clearly established. Geopolitical risks surrounding UK policy could introduce additional volatility to this cross. The next major catalyst will be UK inflation data, which could reset market expectations significantly. Traders should monitor UK retail sales and consumer confidence indicators closely for clues. A break of 0.4210 resistance could see AUD/GBP rally toward 0.4280 in a risk-on environment.",
  },
  "AUD/JPY": {
    direction: "Risk sentiment and Japan rate expectations continue to dominate this cross, keeping intraday swings elevated.",
    outlook: "Any signal of tighter BoJ policy or risk-off sentiment can pressure AUD/JPY quickly, while carry support remains in place in calmer conditions. Japanese rate expectations have shifted higher following recent central bank commentary suggesting gradual normalization. The Australian dollar's yield advantage remains highly attractive for carry traders during risk-on environments. Market positioning suggests traders remain cautiously positioned ahead of BoJ policy meetings. Volatility around Asian market open times remains consistently elevated for this cross. Support for AUD/JPY is found around 98.50 with resistance forming near 99.80 levels. A break above 99.80 could attract fresh carry trade interest from institutional players. Conversely, a close below 98.50 would suggest weakness in risk sentiment and carry unwinding. Monitor global equity markets closely—weakness typically pressures this cross sharply. The next BoJ meeting announcement will be a critical catalyst for directional confirmation.",
  },
  "AUD/NZD": {
    direction: "Near-term direction is neutral-to-firm with relative growth data and commodity trends setting the tone.",
    outlook: "Expect incremental moves unless one central bank shifts guidance unexpectedly in either direction. Commodity softness would be the main downside risk for AUD/NZD given New Zealand's dairy export exposure. The Reserve Bank of Australia maintains a hawkish stance while RBNZ signals caution on future tightening. Australian economic data has been slightly stronger than New Zealand's recent performance indicators. Support is established around 1.0750 with resistance at 1.0850 clearly defined technically. A break of 1.0850 could see further AUD strength if RBA maintains its hawkish tone relative to RBNZ. Commodity prices, particularly dairy and agricultural products, influence the NZD component directly. Monitor relative central bank expectations closely—they drive longer-term positioning in this cross. The next economic data points from both countries will be important catalysts for direction. A technical break above 1.0850 could see AUD/NZD rally toward 1.0950 support.",
  },
}

const CURRENCY_FEED: Record<Pair, string> = {
  "AUD/USD": "The Australian dollar has shown resilience against ongoing US rate cut expectations. Recent softer US inflation data has supported AUD/USD, with the pair holding above the 0.6500 level. Market participants are closely monitoring upcoming payroll figures and Federal Reserve communications for directional cues. Australian employment data remains robust, providing support to the currency. Event risk around US economic releases could trigger sharp moves in either direction. Options positioning suggests elevated volatility is expected in the coming sessions. The Reserve Bank of Australia's hawkish bias continues to underpin AUD strength. Technical support lies at 0.6480 with resistance forming around 0.6550. A break above 0.6550 could attract fresh bullish positioning.",
  "AUD/EUR": "The AUD/EUR cross has benefited from Eurozone growth concerns contrasting with Australian economic resilience. European Central Bank dovish messaging has supported the Australian dollar against the euro. Recent PMI data from the Eurozone has disappointed, reinforcing expectations for further rate cuts. Australian retail sales and consumer confidence have remained relatively steady. The cross is trading within a well-defined range with technical levels guiding intraday moves. Geopolitical risks in Europe could introduce additional volatility to this pairing. Watch for ECB speakers and regional economic data for directional confirmation. Resistance remains around 0.6850 with support at 0.6720. A break of these levels could signal a trend acceleration.",
  "AUD/GBP": "Sterling's weakness against the Australian dollar has been driven by mixed UK economic signals and uncertainty around Bank of England policy direction. UK inflation expectations remain elevated, but wage growth is moderating. The Australian dollar's commodity-linked nature provides strength against a softer sterling. Technical indicators suggest range-bound trading with no clear directional bias. UK inflation releases will be crucial for determining the next directional move. Australian wage price index data is also closely watched for RBA rate expectations. Support for AUD/GBP is positioned around 0.4120 with resistance at 0.4210. A softer UK inflation print could push the pair higher. Market positioning suggests traders are cautiously positioned in this cross.",
  "AUD/JPY": "The AUD/JPY cross remains influenced by carry trade dynamics and risk sentiment shifts. Japanese rate expectations have shifted higher following recent central bank commentary. Risk-off sentiment typically pressures this cross as traders unwind carry trades. The Australian dollar's yield advantage remains attractive for carry traders in risk-on environments. Upcoming BoJ policy signals will be critical for directional guidance. Australian interest rate expectations support the carry appeal of this pair. Volatility around Asian market open times remains elevated for this cross. Support is found around 98.50 with resistance near 99.80. A break above 99.80 could attract further bullish interest from carry traders.",
  "AUD/NZD": "The AUD/NZD cross reflects relative economic performance and central bank policy divergence between Australia and New Zealand. Australian economic data has been slightly stronger than New Zealand's recent performance. The Reserve Bank of Australia maintains a hawkish stance while RBNZ signals caution. Commodity prices, particularly dairy exports, influence the New Zealand dollar directly. AUD/NZD trades with moderate volatility and clear technical levels. Support is established around 1.0750 with resistance at 1.0850. A break of 1.0850 could see further AUD strength if RBA maintains its hawkish tone. Monitor commodity price movements for directional clues on this pair.",
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
  const [isOutlookModalOpen, setIsOutlookModalOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  
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
    <main
      className="min-h-screen flex flex-col relative"
      style={{ backgroundColor: "#113526" }}
    >
      {/* Muted pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url('/pattern-05.svg')",
          backgroundRepeat: "repeat",
          backgroundSize: "280px 280px",
          opacity: 0.45,
          zIndex: 1,
        }}
      />

      <div style={{ position: "relative", zIndex: 10 }}>
        <Header />
      </div>      

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-xl z-10" style={{ height: "auto", minHeight: "200px", fontFamily: "'DM Sans', sans-serif" }}>

  {/* Dark green base */}
  <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #071C14 0%, #0d2e1e 40%, #0a2218 100%)" }} />

  {/* SVG chart background */}
  <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 900 320" preserveAspectRatio="none">
    <defs>
      <linearGradient id="gfill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#2ecc71" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#2ecc71" stopOpacity="0" />
      </linearGradient>
    </defs>
    <polygon points="0,260 60,240 120,255 180,210 240,220 300,180 360,195 420,150 480,165 540,130 600,145 660,110 720,125 780,90 840,105 900,75 900,320 0,320" fill="url(#gfill)" />
    <polyline points="0,260 60,240 120,255 180,210 240,220 300,180 360,195 420,150 480,165 540,130 600,145 660,110 720,125 780,90 840,105 900,75" fill="none" stroke="#2ecc71" strokeWidth="2.5" />
  </svg>

  {/* Left-to-right gradient overlay */}
  <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(7,28,20,0.92) 0%, rgba(7,28,20,0.6) 55%, rgba(7,28,20,0.15) 100%)" }} />

  {/* Main content */}
  <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col justify-center gap-2">

    {/* Logo row */}
    <div className="flex items-center gap-3 sm:gap-4">
      <Image src="/logo.png" alt="SwitchYardFX Logo" width={72} height={72} style={{ borderRadius: 8 }} className="sm:w-[96px] sm:h-[96px]" />
      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px, 5vw, 40px)", color: "#fff", letterSpacing: 0.5 }}>
        SwitchYard<span style={{ color: "#2ecc71" }}> Capital</span>
      </span>
    </div>

  </div>

  {/* Live ticker bar - animated */}
<div
  className="absolute bottom-0 left-0 right-0 overflow-hidden py-2"
  style={{ background: "rgba(0,0,0,0.35)", borderTop: "1px solid rgba(46,204,113,0.25)" }}
>
  <style>{`
    @keyframes ticker-scroll {
      0%   { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .ticker-track {
      display: flex;
      width: max-content;
      animation: ticker-scroll 30s linear infinite;
    }
    .ticker-track:hover {
      animation-play-state: paused;
    }
  `}</style>

  <div className="ticker-track">
    {/* Render the list TWICE so the scroll loops seamlessly */}
    {[...Array(2)].map((_, dupIdx) => (
      <div key={dupIdx} className="flex items-center">
        {[
          ["EUR/USD", "1.0842", "+0.12%", true],
          ["GBP/USD", "1.2718", "−0.08%", false],
          ["USD/JPY", "154.32", "+0.21%", true],
          ["AUD/USD", "0.6531", "−0.05%", false],
          ["XAU/USD", "2,318.40", "+0.33%", true],
          ["USD/CHF", "0.9012", "+0.09%", true],
          ["NZD/USD", "0.5981", "−0.11%", false],
          ["USD/CAD", "1.3652", "+0.06%", true],
        ].map(([pair, price, chg, up], i) => (
          <div
            key={`${dupIdx}-${i}`}
            className="flex items-center gap-2 whitespace-nowrap px-6"
            style={{
              fontSize: 12,
              fontWeight: 500,
              borderRight: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <span style={{ color: "#fff" }}>{pair}</span>
            <span style={{ color: up ? "#2ecc71" : "#e74c3c" }}>
              {price}
            </span>
            <span style={{ color: up ? "#2ecc71" : "#e74c3c" }}>
              {up ? "▲" : "▼"} {chg}
            </span>
          </div>
        ))}
      </div>
    ))}
  </div>

  </div>
</section>


     {/* ── SWITCH PAIR SECTION (ABOVE CHART) ─────────────────────────────── */}


     {/* ── 2nd CONNECTED MARKET SECTION ─────────────────────────────────────── */}
<section className="relative overflow-hidden border-b border-[#1B4332]/60 z-10">
  <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-5">
    <div
      className="rounded-3xl border border-[#2D6A4F]/30 p-6 sm:p-8 shadow-xl shadow-[#12261F]/10"
      style={{ background: "#F5F0EC" }}
    >
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-start gap-4 mb-6">
        <CompassIcon />
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-[#52796F] uppercase tracking-[0.14em] mb-2">
            General Market News
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-[#12261F] mb-3">
            Market Commentary
          </h2>

          {/* Preview - always visible */}
          <div className="text-[#4A5A55] leading-relaxed space-y-2 text-justify hyphens-auto">
            <p>
              This week markets were largely driven by shifting{" "}
              <strong className="text-[#12261F]">interest-rate expectations</strong>, with{" "}
              <strong className="text-[#12261F]">softer US data</strong> easing some of the recent USD
              strength. Treasury yields edged lower as markets repriced the pace of Fed tightening,
              weighing on the dollar across the board.
            </p>
            <p>
              Improving <strong className="text-[#12261F]">risk sentiment</strong> provided additional
              support, while steady <strong className="text-[#12261F]">commodity prices</strong> helped
              underpin the Australian dollar against major peers. Equity markets stabilised through
              the week, reducing safe-haven demand for the USD and JPY.
            </p>
            <p>
              Central bank commentary remains the key near-term driver — particularly any shift in{" "}
              <strong className="text-[#12261F]">RBA guidance</strong> given recent labour market
              resilience. Businesses with ongoing FX exposure should review hedge levels ahead of
              next week's key data releases.
            </p>
          </div>

          {/* Expandable content */}
          <div
            className={`grid transition-all duration-500 ease-in-out ${
              isExpanded ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <p className="text-[#4A5A55] leading-relaxed">
                At the same time, improving{" "}
                <strong className="text-[#12261F]">risk sentiment</strong> and steady{" "}
                <strong className="text-[#12261F]">commodity prices</strong> provided support for the Australian dollar.
              </p>
              <p className="text-[#4A5A55] leading-relaxed mt-3">
                Looking ahead, upcoming{" "}
                <strong className="text-[#12261F]">economic data releases</strong> and ongoing{" "}
                <strong className="text-[#12261F]">central bank expectations</strong> are likely to remain key drivers of currency movements across the pairs most relevant to businesses. The RBA's tone at its next meeting will be closely watched, particularly given recent labour market resilience.
              </p>
              <p className="text-[#4A5A55] leading-relaxed mt-3">
                In Europe, ECB commentary around the pace of rate cuts continues to influence EUR pairs. Meanwhile, geopolitical developments and energy price swings remain background risks that can amplify volatility — especially during lower-liquidity overnight sessions. For businesses with regular FX exposure, maintaining standing orders and reviewing hedge ratios ahead of key data releases remains a prudent discipline.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#2D6A4F] hover:text-[#12261F] transition-colors"
            aria-expanded={isExpanded}
          >
            {isExpanded ? (
              <>
                Read less
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 7.5L6 3.5L10 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </>
            ) : (
              <>
                Read more
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 4.5L6 8.5L10 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Divider ────────────────────────────────────────── */}
      <hr className="border-[#2D6A4F]/15 mb-6" />

      {/*
        ── FX Chart (includes Currency Feed + Historical Rate + Key Rates)
        The [&>*] and nested selectors strip all inner borders/shadows/rounded
        so FxChart renders flush inside this parent card with no nested boxes.
      */}
      <div
        className="mb-6 [&_*]:!border-0 [&_*]:!shadow-none [&_*]:!rounded-none"
        style={{ background: "transparent" }}
      >
        <FxChart onPairChange={setSelectedDigestPair} />
      </div>

      {/* ── Divider ────────────────────────────────────────── */}
      <hr className="border-[#2D6A4F]/15 mb-6" />

      {/* ── Near-term Direction / Outlook ──────────────────── */}
      <div>
        <p className="text-[10px] font-bold text-[#52796F] uppercase tracking-[0.14em] mb-2">
          Near-term Direction
        </p>
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-3">
          <h5 className="text-xl sm:text-2xl font-black text-[#12261F]">
             Outlook
          </h5>
          <button
            type="button"
            onClick={() => setIsOutlookModalOpen(true)}
            className="text-xs font-bold text-[#2D6A4F] hover:text-[#12261F] transition-colors underline-offset-2 hover:underline"
          >
            (Click to View full analysis)
          </button>
        </div>

        <p
          className="text-[#4A5A55] leading-relaxed"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {PAIR_FORECASTS[selectedDigestPair].direction}{" "}
          {PAIR_FORECASTS[selectedDigestPair].outlook}
        </p>

        <button
          type="button"
          onClick={() => setIsOutlookModalOpen(true)}
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#2D6A4F] hover:text-[#12261F] transition-colors"
        >
          Click to View full analysis
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</section>

{/* ── WEEKLY KEY DATA SPOTLIGHT ────────────────────────────────────── */}
<section className="relative overflow-hidden border-b border-[#1B4332]/60 z-10">
  <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-5">
    <div className="p-6 rounded-2xl bg-[#DCE5E1] border border-[#2D6A4F]/30 shadow-2xl shadow-black/40">
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

          {/* ── Data Event Rows ─────────────────────────────────── */}
          {(() => {
            const [base, quote] = selectedDigestPair.split("/")
            const dataRows = [
              { Icon: RotateCcw,  iconBg: "bg-[#2D6A4F]",  date: "May 15, 2026", label: "Previous",   value: "+32.2K" },
              { Icon: TrendingUp, iconBg: "bg-[#1B5E8A]",   date: "May 15, 2026", label: "Forecasted", value: "+25.0K" },
            ]
            return (
              <div className="mb-6 bg-white/55 rounded-xl border border-[#2D6A4F]/15 overflow-hidden">
                <div className="grid grid-cols-2 divide-x divide-[#2D6A4F]/15">
                  {dataRows.map((row, i) => (
                    <div
                      key={i}
                      className="group flex flex-col gap-2 px-4 py-3 hover:bg-white/60 transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-lg ${row.iconBg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200`}>
                          <row.Icon className="text-white w-3.5 h-3.5" strokeWidth={2.5} />
                        </div>
                        <span className="text-xs text-[#52796F] font-semibold">{row.label}</span>
                      </div>
                      <div className="flex gap-1 flex-wrap">
                        {[base, quote].map((code) => (
                          <span
                            key={code}
                            className="inline-flex items-center gap-1 bg-[#2D6A4F] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded"
                          >
                            <span className="text-[13px] leading-none">
                              {code.toUpperCase().split("").map((c) => String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65)).join("")}
                            </span>
                            {code}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-end justify-between">
                        <span className="text-[10px] text-[#52796F]">{row.date}</span>
                        <span className="text-base font-black text-[#12261F]">{row.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })()}

          {/* ── Main Content Grid ──────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
            {/* LEFT COLUMN - IMAGE + SLIDERS */}
            <div className="space-y-4 flex flex-col justify-center">
              {/* Image / Icon Placeholder */}
              <div className="w-full aspect-[4/3] rounded-2xl relative overflow-hidden">
                <Image
                  src="https://eu-images.contentstack.com/v3/assets/bltaec35894448c7261/blt56a3ce4b1877f28f/687de1a69501c76750db3352/Expert_advisor_in_forex_trading.jpeg"
                  alt="FX trading dashboard"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Rate slider */}
              {/* <div className="bg-white/60 rounded-lg border border-[#2D6A4F]/25 p-5">
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <label className="block text-xs font-bold text-[#12261F] mb-0.5">
                      Rate Exposure
                    </label>
                    <p className="text-[10px] text-[#52796F]">Business FX sensitivity</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black text-[#2D6A4F] leading-none">{formData.rate}%</div>
                    <p className="text-[9px] text-[#52796F] mt-0.5">{getRateLabel(formData.rate)}</p>
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
                <div className="flex justify-between text-[9px] text-[#52796F] mt-2">
                  <span>Minimal</span>
                  <span>Critical</span>
                </div>
              </div>

              
              <div className="bg-white/60 rounded-lg border border-[#2D6A4F]/25 p-5">
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <label className="block text-xs font-bold text-[#12261F] mb-0.5">
                      Transaction Volume
                    </label>
                    <p className="text-[10px] text-[#52796F]">Monthly FX volume</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-[#2D6A4F] leading-tight">{getVolumeLabel(formData.volume)}</div>
                    <p className="text-[9px] text-[#52796F] mt-0.5">{formData.volume}% of scale</p>
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
                <div className="flex justify-between text-[9px] text-[#52796F] mt-2">
                  <span>&lt; $100K</span>
                  <span>&gt; $10M</span>
                </div>
              </div>*/}
            </div> 

            {/* RIGHT COLUMN - TEXT INPUT + MEANING CARDS */}
            <div className="space-y-4 flex flex-col justify-center">
              {/* Text input */}
              

              {/* What could this mean? */}
              <div>
                <h3 className="text-lg font-black text-[#12261F] mb-2.5">
                  What could this mean?
                </h3>
                <div className="space-y-2">
                  {[
                    "A strong beat could push RBA rate-cut expectations out further, supporting AUD in the near term.",
                    "A miss versus forecast may accelerate easing bets, weighing on AUD — especially against USD and JPY.",
                    "Even an in-line print can move markets if participation rate or full-time / part-time mix surprises.",
                  ].map((text, i) => (
                    <div
                      key={i}
                      className="bg-white/70 rounded-xl border border-[#2D6A4F]/12 px-3.5 py-3 text-xs text-[#2a3f37] leading-relaxed shadow-sm"
                    >
                      {text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-[#52796F] mb-5">
            General market information only. Not a recommendation or offer.
          </p>

          <a
            href="#custom-quote"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2D6A4F] hover:bg-[#235a41] text-white text-sm font-bold transition-colors"
          >
            Ideas to manage this data release →
          </a>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* ── THOUGHT LEADERSHIP ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-[#1B4332]/60 z-10">
  <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-5">
    <div className="p-6 rounded-2xl border border-[#2D6A4F]/25" style={{ background: "#EBFEDA" }}>

      {/* ── Top Bar: Header + News Highlights + Filters ──────── */}
      
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-start gap-4">
          <CompassIcon />
          <div>
            <p className="text-[10px] font-bold text-[#52796F] uppercase tracking-[0.14em] mb-1">
              Thought Leadership
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-[#12261F]">
              Thought provoking talking points
            </h2>
          </div>
        </div>

        {/* Latest News Highlights + Sync Filters */}
        <div className="hidden md:flex items-center gap-3 shrink-0 mt-1">
          <span className="text-xs font-semibold text-[#52796F]">Latest News highlights</span>
          <div className="flex items-center gap-1.5">
            {["AUD", "USD", "EUR", "GBP"].map((ccy) => (
              <button
                key={ccy}
                className="px-2 py-1 rounded text-[9px] font-bold bg-[#2D6A4F] text-white hover:bg-[#1B4332] transition-colors"
              >
                {ccy}
              </button>
            ))}
          </div>
          <button className="text-[10px] text-[#52796F] border border-[#2D6A4F]/30 rounded-lg px-2.5 py-1 hover:bg-white/50 transition-colors">
            Synced with your dashboard
          </button>
        </div>
      </div>

      {/* ── Main Grid: Topics Left | Talking Points + News Right ── */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-6">

        {/* LEFT: Enrolled Topic Icons (scattered layout) */}

        <div className="relative">
          
          <div className="grid grid-cols-3 gap-3 auto-rows-min">
            {[
              {
                label: "Interest Rates",
                offset: "",
                grad: "from-[#2D6A4F] to-[#1B4332]",
                glow: "rgba(45,106,79,0.55)",
                icon: (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <polyline points="2,15 7,8 11,11 17,3" stroke="white" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="17" cy="3" r="2.3" fill="white" fillOpacity="0.25" stroke="white" strokeWidth="1.4"/>
                    <line x1="2" y1="17" x2="18" y2="17" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.35"/>
                  </svg>
                ),
              },
              {
                label: "Central Banks",
                offset: "",
                grad: "from-[#1B5E8A] to-[#134472]",
                glow: "rgba(27,94,138,0.55)",
                icon: (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M3 17V9h2.5v8M8.75 17V6h2.5v11M14.5 17V9H17v8" stroke="white" strokeWidth="1.7" strokeLinecap="round"/>
                    <path d="M1.5 8l8.5-5.5L18.5 8" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="1" y1="17.5" x2="19" y2="17.5" stroke="white" strokeWidth="1.7" strokeLinecap="round"/>
                  </svg>
                ),
              },
              {
                label: "Commodities",
                offset: "",
                grad: "from-[#7B5E2A] to-[#5C4220]",
                glow: "rgba(123,94,42,0.55)",
                icon: (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 2L3.5 5.8v7.4L10 17l6.5-3.8V5.8L10 2z" stroke="white" strokeWidth="1.7" strokeLinejoin="round"/>
                    <path d="M10 10v7M10 10L3.5 5.8M10 10l6.5-4.2" stroke="white" strokeWidth="1" strokeOpacity="0.45"/>
                    <circle cx="10" cy="10" r="1.8" fill="white" fillOpacity="0.55"/>
                  </svg>
                ),
              },
              {
                label: "Trade Policy",
                offset: "mt-2",
                grad: "from-[#5B2D8A] to-[#3D1D5E]",
                glow: "rgba(91,45,138,0.55)",
                icon: (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M2 10h4.5l2.5-4 3 8 2.5-5H20" stroke="white" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="10" cy="8.5" r="1.6" fill="white" fillOpacity="0.3"/>
                  </svg>
                ),
              },
              {
                label: "Geopolitics",
                offset: "mt-4",
                grad: "from-[#2A6A7B] to-[#1C4D5C]",
                glow: "rgba(42,106,123,0.55)",
                icon: (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="7.5" stroke="white" strokeWidth="1.7"/>
                    <ellipse cx="10" cy="10" rx="3.5" ry="7.5" stroke="white" strokeWidth="1.1" strokeOpacity="0.55"/>
                    <line x1="2.5" y1="10" x2="17.5" y2="10" stroke="white" strokeWidth="1.1" strokeOpacity="0.55"/>
                    <line x1="4" y1="6.5" x2="16" y2="6.5" stroke="white" strokeWidth="0.9" strokeOpacity="0.3"/>
                    <line x1="4" y1="13.5" x2="16" y2="13.5" stroke="white" strokeWidth="0.9" strokeOpacity="0.3"/>
                  </svg>
                ),
              },
              {
                label: "Inflation Data",
                offset: "mt-1",
                grad: "from-[#8A2D2D] to-[#5E1C1C]",
                glow: "rgba(138,45,45,0.55)",
                icon: (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <rect x="2.5" y="9" width="3.5" height="8" rx="1" fill="white" fillOpacity="0.5"/>
                    <rect x="8.25" y="5" width="3.5" height="12" rx="1" fill="white" fillOpacity="0.85"/>
                    <rect x="14" y="7" width="3.5" height="10" rx="1" fill="white" fillOpacity="0.65"/>
                    <path d="M3 6l5.5-2 4 1.5L18 3" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeDasharray="1.5 1.5" strokeOpacity="0.65"/>
                  </svg>
                ),
              },
              {
                label: "Risk Sentiment",
                offset: "mt-3",
                grad: "from-[#8A6B2D] to-[#5E4820]",
                glow: "rgba(138,107,45,0.55)",
                icon: (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 2.5L2 17h16L10 2.5z" stroke="white" strokeWidth="1.8" strokeLinejoin="round" fill="white" fillOpacity="0.1"/>
                    <line x1="10" y1="8" x2="10" y2="12.5" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
                    <circle cx="10" cy="14.8" r="1.1" fill="white"/>
                  </svg>
                ),
              },
              {
                label: "Economic Growth",
                offset: "mt-2",
                grad: "from-[#1B7A5E] to-[#0F5240]",
                glow: "rgba(27,122,94,0.55)",
                icon: (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M2 16 C5 16 6 10 9 10 C12 10 12 13 15 11 C17 9.5 17.5 7 18 5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    <path d="M15 5h3v3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="2" y1="17.5" x2="18" y2="17.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.4"/>
                  </svg>
                ),
              },
              {
                label: "Currency Flows",
                offset: "mt-4",
                grad: "from-[#2D4A8A] to-[#1C305E]",
                glow: "rgba(45,74,138,0.55)",
                icon: (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M3 7h14M3 13h14" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.45"/>
                    <path d="M6 4l-3 3 3 3" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 10l3 3-3 3" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="10" cy="7" r="1.5" fill="white" fillOpacity="0.6"/>
                    <circle cx="10" cy="13" r="1.5" fill="white" fillOpacity="0.6"/>
                  </svg>
                ),
              },
            ].map((topic, i) => (
              <div
                key={i}
                className={`group relative flex flex-col items-center justify-center p-3 rounded-xl bg-gradient-to-b from-[#2D6A4F]/10 to-[#2D6A4F]/4 border border-[#2D6A4F]/20 hover:from-[#2D6A4F]/18 hover:to-[#2D6A4F]/8 hover:border-[#2D6A4F]/40 cursor-pointer transition-all duration-200 hover:scale-[1.06] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(45,106,79,0.13)] ${topic.offset || ""}`}
              >
                <div
                  className={`relative w-11 h-11 rounded-xl bg-gradient-to-br ${topic.grad} flex items-center justify-center mb-2 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-200`}
                  style={{ boxShadow: `0 4px 14px ${topic.glow}` }}
                >
                  <div className="group-hover:scale-110 transition-transform duration-150">
                    {topic.icon}
                  </div>
                  <div className="absolute inset-0 rounded-xl bg-white/0 group-hover:bg-white/10 transition-colors duration-200" />
                </div>
                <span className="text-[10px] font-bold text-[#12261F] group-hover:text-[#2D6A4F] text-center leading-tight transition-colors duration-200">
                  {topic.label}
                </span>
              </div>
            ))}
          </div>

          
        </div>

        {/* RIGHT: Talking Points + News Articles */}
        <div className="space-y-5">
          

          {/* Talking Points */}
          <div className="space-y-3">
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
          <div className="bg-white/60 rounded-lg border border-[#2D6A4F]/25 p-5">
                <label className="block text-[10px] font-bold text-[#52796F] uppercase tracking-[0.08em] mb-2">
                  Type to enter text
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. We have $1.2M AUD payables due in June…"
                  className="w-full border border-[#2D6A4F]/20 rounded-lg px-3 py-2 text-xs text-[#12261F] bg-white resize-y outline-none"
                />
              </div>
<a
            href="/market-insights"
            className="inline-flex items-center gap-2 px-6 py-2.5 mt-5 rounded-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white text-sm font-bold tracking-wide transition-colors"
          >
            Submit
          </a>

        </div>
      </div>
    </div>
  </div>
</section>

      {/* ── POLLS SECTION ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-[#1B4332]/60 z-10">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-5">
          <div className="grid md:grid-cols-2 gap-8">
            {/* ── ACTIVE POLL ────────────────────────────────────────────── */}
            <div className="p-6 rounded-2xl border border-[#2D6A4F]/25" style={{ background: "#EBFEDA" }}>
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
                        <div className="h-2 rounded-full bg-white/60 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#2D6A4F] transition-all duration-700"
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
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedOption === opt.id
                          ? "border-[#2D6A4F] bg-[#2D6A4F]/15"
                          : "border-[#2D6A4F]/30 bg-white/40 hover:border-[#2D6A4F]/60"
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
            <div className="p-6 rounded-2xl border border-[#2D6A4F]/25" style={{ background: "#DCFAEA" }}>
              <p className="text-[10px] font-bold text-[#52796F] uppercase tracking-[0.14em] mb-2">Last Week</p>
              <h3 className="text-lg sm:text-xl font-black text-[#12261F] mb-6">Last Week's Poll Result</h3>

              <div className="space-y-4 mb-6">
                {[
                  { label: "Volatility & timing", pct: 42 },
                  { label: "Budget rate uncertainty", pct: 27 },
                  { label: "Cashflow predictability", pct: 18 },
                  { label: "Hedge accounting impact", pct: 13 },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-sm font-medium text-[#12261F] mb-1.5">
                      {item.label} <span className="font-black text-[#2D6A4F]">({item.pct}%)</span>
                    </p>
                    <div className="h-2.5 rounded-full bg-white/60 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#2D6A4F]"
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-sm font-bold text-[#12261F] mb-4">What is your biggest FX concern right now?</p>

              <button className="w-full px-7 py-2.5 rounded-full bg-[#12261F] hover:bg-[#1B4332] text-white text-sm font-bold tracking-wide transition-colors">
                LAST WEEK RESULTS
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CUSTOM QUOTE FORM ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-[#1B4332]/60 z-10" id="custom-quote">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-5">
          <div className="p-6 rounded-2xl border border-[#2D6A4F]/25" style={{ background: "#DCE5E1" }}>
            {/* Section header */}
            <div className="mb-8">
              <p className="text-[10px] font-bold text-[#52796F] uppercase tracking-[0.14em] mb-2">Custom Quote</p>
              <h2 className="text-2xl sm:text-3xl font-black text-[#12261F] mb-2">
                Get Your Customised FX Solution
              </h2>
              <p className="text-[#4A5A55] text-sm leading-relaxed">
                Tell us your requirements and we'll craft the perfect hedging strategy for your business.
              </p>
            </div>

          {submitted ? (
            /* ── success state ── */
            <div className="text-center py-16 max-w-md mx-auto">
              <div className="w-16 h-16 bg-[#2D6A4F]/20 rounded-full flex items-center justify-center mx-auto mb-6">
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
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
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
                  className="w-full px-4 py-3 rounded-xl border border-[#2D6A4F]/30 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] bg-white/70 text-[#12261F] placeholder-[#52796F] text-sm"
                />
                <input
                  type="text"
                  name="company"
                  placeholder="Company Name"
                  value={formData.company}
                  onChange={handleInput}
                  className="w-full px-4 py-3 rounded-xl border border-[#2D6A4F]/30 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] bg-white/70 text-[#12261F] placeholder-[#52796F] text-sm"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Work Email *"
                  value={formData.email}
                  onChange={handleInput}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#2D6A4F]/30 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] bg-white/70 text-[#12261F] placeholder-[#52796F] text-sm"
                />
                <textarea
                  name="notes"
                  placeholder="Notes / requirements — any specific hedging goals, currencies, or timeframes..."
                  value={formData.notes}
                  onChange={handleInput}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-[#2D6A4F]/30 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] bg-white/70 text-[#12261F] placeholder-[#52796F] text-sm resize-none"
                />
              </div>

              {error && (
                <div className="p-4 bg-red-100 border border-red-400/50 rounded-xl">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold py-3 px-6 rounded-xl text-base transition-all"
              >
                {loading ? "Submitting…" : "Get My Custom Quote →"}
              </Button>

              <p className="text-xs text-[#52796F] text-center">
                We respect your privacy. No spam, ever. General market information only — not a recommendation or offer.
              </p>
            </form>
          )}
          </div>
        </div>
      </section>

      {/* ── FAQ SECTION ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-[#1B4332]/60 z-10">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-5">
          <div className="p-6 rounded-2xl bg-[#10251E] border border-[#2D6A4F]/35">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
                Got questions? We've got answers.
              </h2>
              <p className="text-[#C7DED5] text-sm">
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
                  className="bg-[#0a1f17] rounded-2xl border border-[#2D6A4F]/35 p-5"
                >
                  <p className="text-sm font-bold text-white mb-2">→ {item.q}</p>
                  <p className="text-xs text-[#A8C5BA] leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <a
                href="#custom-quote"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white text-sm font-bold tracking-wide transition-colors border border-[#2D6A4F]/60"
              >
                Get in touch
              </a>
            </div>
          </div>
        </div>
      </section>

      {isOutlookModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          onClick={() => setIsOutlookModalOpen(false)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl border border-[#2D6A4F]/30 p-6 sm:p-8 shadow-2xl"
            style={{ background: "#F5F0EC" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <p className="text-[10px] font-bold text-[#52796F] uppercase tracking-[0.14em] mb-2">Near-term Direction</p>
                <h5 className="text-base sm:text-lg font-black text-[#12261F]">{selectedDigestPair} Outlook</h5>
              </div>
              <button
                type="button"
                onClick={() => setIsOutlookModalOpen(false)}
                className="rounded-full border border-[#2D6A4F]/40 px-3 py-1.5 text-xs font-bold text-[#52796F] hover:bg-[#2D6A4F]/10 transition-colors"
              >
                Close
              </button>
            </div>
            <p className="text-[#12261F] font-semibold leading-relaxed mb-4">{PAIR_FORECASTS[selectedDigestPair].direction}</p>
            <p className="text-[#4A5A55] leading-relaxed">{PAIR_FORECASTS[selectedDigestPair].outlook}</p>
          </div>F
        </div>
      )}
<div className="relative z-10">
      <Footer />
</div>
    </main>
  )
}
