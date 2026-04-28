"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
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
      style={{
        backgroundColor: "#0A1F18",
        backgroundImage: "url('/pattern-05.svg')",
        backgroundRepeat: "repeat",
        backgroundSize: "280px 280px",
      }}
    >
      {/* Pattern overlay for enhanced texture effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(10, 31, 24, 0.4) 0%, rgba(10, 31, 24, 0.6) 100%)",
          zIndex: 1,
        }}
      />

      <div style={{ position: "relative", zIndex: 10 }}>
        <Header />
      </div>      

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-xl z-10" style={{ height: "auto", minHeight: "280px", fontFamily: "'DM Sans', sans-serif" }}>

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
  <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 flex flex-col justify-center gap-3 sm:gap-4">

    {/* Logo row */}
    <div className="flex items-center gap-2 sm:gap-3">
      <Image src="/logo.png" alt="SwitchYardFX Logo" width={50} height={50} style={{ borderRadius: 6 }} className="sm:w-[70px] sm:h-[70px]" />
      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(16px, 4vw, 22px)", color: "#fff", letterSpacing: 0.5 }}>
        SwitchYard<span style={{ color: "#2ecc71" }}>FX</span>
      </span>
    </div>

    <p style={{ fontSize: "clamp(10px, 2vw, 12px)", color: "rgba(255,255,255,0.5)", letterSpacing: "1.5px", textTransform: "uppercase" }}>
      Professional Forex Trading
    </p>

    <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(20px, 5vw, 28px)", color: "#fff", lineHeight: 1.3, maxWidth: "100%", marginTop: 0 }}>
      Trade smarter with{" "}
      <span style={{ color: "#2ecc71" }}>real-time</span> market intelligence
    </h1>

    {/* Stats */}
    <div className="flex flex-wrap items-center gap-3 sm:gap-6 mt-1 sm:mt-2">
      {[["180+", "Currency pairs"], ["0.1 pip", "Avg spread"], ["24/5", "Live support"]].map(([val, lbl], i) => (
        <div key={i} className="flex items-center gap-2 sm:gap-3">
          {i > 0 && <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.15)" }} />}
          <div className="flex flex-col gap-0.5">
            <span style={{ fontSize: "clamp(14px, 3vw, 18px)", fontWeight: 500, color: "#fff" }}>{val}</span>
            <span style={{ fontSize: "clamp(9px, 1.5vw, 11px)", color: "rgba(255,255,255,0.45)", letterSpacing: "0.5px", textTransform: "uppercase" }}>{lbl}</span>
          </div>
        </div>
      ))}
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


      {/* ── 2nd CONNECTED MARKET SECTION ─────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-[#1B4332]/60 z-10">
  <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
    <div className="rounded-3xl border border-[#2D6A4F]/50 bg-[#0a1f17] p-6 sm:p-8 shadow-2xl shadow-black/40">
      <div className="mb-8">
        <div className="flex items-start gap-4">
          <CompassIcon light />
          <div className="flex-1">
            <p className="text-[10px] font-bold text-[#A8C5BA] uppercase tracking-[0.14em] mb-2">General Market News</p>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">Market Commentary</h2>
            <div
              className="overflow-hidden transition-all duration-500 ease-in-out"
              style={{ maxHeight: isExpanded ? "600px" : "72px" }}
            >
              <p className="text-[#C7DED5] leading-relaxed">
                This week markets were largely driven by shifting interest-rate expectations, with softer US data easing some of the recent USD strength. At the same time, improving risk sentiment and steady commodity prices provided support for the Australian dollar.
              </p>
              <p className="text-[#C7DED5] leading-relaxed mt-3">
                Looking ahead, upcoming economic data releases and ongoing central bank expectations are likely to remain key drivers of currency movements across the pairs most relevant to businesses. The RBA's tone at its next meeting will be closely watched, particularly given recent labour market resilience. In Europe, ECB commentary around the pace of rate cuts continues to influence EUR pairs. Meanwhile, geopolitical developments and energy price swings remain background risks that can amplify volatility — especially during lower-liquidity overnight sessions. For businesses with regular FX exposure, maintaining standing orders and reviewing hedge ratios ahead of key data releases remains a prudent discipline.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#74B49B] hover:text-white transition-colors"
            >
              {isExpanded ? "Read less ▲" : "Read more ▼"}
            </button>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <FxChart onPairChange={setSelectedDigestPair} />
      </div>

      <div className="rounded-2xl border border-[#2D6A4F]/45 p-5 sm:p-6">
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

{/* ── WEEKLY KEY DATA SPOTLIGHT ────────────────────────────────────── */}
<section className="relative overflow-hidden border-b border-[#1B4332]/60 z-10">
  <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
    <div className="p-6 rounded-2xl bg-[#0a1f17] border border-[#2D6A4F]/50 shadow-2xl shadow-black/40">
      <div className="flex items-start gap-5">
        <CompassIcon light />
        <div className="flex-1">
          <p className="text-[10px] font-bold text-[#A8C5BA] uppercase tracking-[0.14em] mb-2">
            Weekly Key Data Spotlight
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">
            Australian Employment Data{" "}
            <span className="text-[#74B49B]">(AUD Catalyst)</span>
          </h2>
          <p className="text-[#C7DED5] leading-relaxed mb-6">
            Employment figures are a direct input to RBA rate expectations — markets can reprice the rate outlook quickly, and AUD tends to move first, often in thin overnight conditions. Having a plan{" "}
            <strong className="text-white">before</strong> the release avoids forced decisions in volatile post-data moves.
          </p>

          {/* ── Rate and Volume Sliders ──────────────────────────────────── */}
          {/* Two Column Layout: Sliders (Left) + Strategy Items (Right) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
            {/* LEFT COLUMN - SLIDERS */}
            <div className="space-y-4 flex flex-col justify-center">
              {/* Rate slider - Compact */}
              <div className="bg-[#10251E]/90 rounded-lg border border-[#2D6A4F]/35 p-5">
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <label className="block text-xs font-bold text-white mb-0.5">
                      Rate Exposure
                    </label>
                    <p className="text-[10px] text-[#A8C5BA]">Business FX sensitivity</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black text-[#74B49B] leading-none">{formData.rate}%</div>
                    <p className="text-[9px] text-[#A8C5BA] mt-0.5">{getRateLabel(formData.rate)}</p>
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
                <div className="flex justify-between text-[9px] text-[#6A9A8F] mt-2">
                  <span>Minimal</span>
                  <span>Critical</span>
                </div>
              </div>

              {/* Volume slider - Compact */}
              <div className="bg-[#10251E]/90 rounded-lg border border-[#2D6A4F]/35 p-5">
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <label className="block text-xs font-bold text-white mb-0.5">
                      Transaction Volume
                    </label>
                    <p className="text-[10px] text-[#A8C5BA]">Monthly FX volume</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-[#74B49B] leading-tight">{getVolumeLabel(formData.volume)}</div>
                    <p className="text-[9px] text-[#A8C5BA] mt-0.5">{formData.volume}% of scale</p>
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
                <div className="flex justify-between text-[9px] text-[#6A9A8F] mt-2">
                  <span>&lt; $100K</span>
                  <span>&gt; $10M</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - STRATEGY ITEMS */}
            <div className="space-y-4 flex flex-col justify-center">
            {[
              { label: "Limit / target orders", desc: "Capture favourable spikes overnight automatically" },
              { label: "Layered forwards", desc: "Lock a portion of budget rates ahead of the event" },
              { label: "Options (e.g., collars)", desc: "Protect downside while keeping upside participation" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-3 p-4 rounded-xl bg-[#0f2a1f] border border-[#2D6A4F]/40"
              >
                <span className="text-[#74B49B] text-xs font-bold mt-0.5">◆</span>
                <div>
                  <p className="text-sm font-bold text-white">{item.label}</p>
                  <p className="text-xs text-[#A8C5BA] mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
            </div>
          </div>

          <p className="text-xs text-[#6A9A8F] mb-5">
            General market information only. Not a recommendation or offer.
          </p>

          <a
            href="#custom-quote"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#74B49B] hover:bg-[#5C9A82] text-[#0a1f17] text-sm font-bold transition-colors"
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
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <div className="p-6 rounded-2xl bg-[#10251E] border border-[#2D6A4F]/35">
            <div className="flex items-start gap-5">
              <CompassIcon light />
              <div>
                <p className="text-[10px] font-bold text-[#A8C5BA] uppercase tracking-[0.14em] mb-2">
                  Thought Leadership
                </p>
                <h2 className="text-2xl sm:text-3xl font-black text-white mb-6">
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
                      <span className="text-[#74B49B] font-bold mt-0.5 shrink-0">♦</span>
                      <p className="text-[#C7DED5] text-sm leading-relaxed">{point}</p>
                    </div>
                  ))}
                </div>

                <a
                  href="/market-insights"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white text-sm font-bold tracking-wide transition-colors border border-[#2D6A4F]/60"
                >
                  LEARN MORE
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── POLLS SECTION ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-[#1B4332]/60 z-10">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <div className="grid md:grid-cols-2 gap-8">
            {/* ── ACTIVE POLL ────────────────────────────────────────────── */}
            <div className="p-6 rounded-2xl bg-[#0a1f17] border border-[#2D6A4F]/35">
              <p className="text-[10px] font-bold text-[#A8C5BA] uppercase tracking-[0.14em] mb-2">Active Poll</p>
              <h3 className="text-lg sm:text-xl font-black text-white mb-2">Margin Pressure Poll</h3>
              <p className="text-[#C7DED5] text-sm mb-6">What is currently eroding your margins the most?</p>

              {hasVoted && poll ? (
                /* voted — show results inline */
                <div className="space-y-3 mb-6">
                  {poll.options.map((opt) => {
                    const pct = poll.total > 0 ? Math.round((opt.votes / poll.total) * 100) : 0
                    const isChosen = localStorage.getItem("insights-poll-vote") === opt.id
                    return (
                      <div key={opt.id}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className={`font-medium ${isChosen ? "text-white font-bold" : "text-[#C7DED5]"}`}>
                            {opt.label}{isChosen && " ✓"}
                          </span>
                          <span className="font-bold text-[#74B49B]">{pct}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-[#1B4332] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#2D6A4F] to-[#74B49B] transition-all duration-700"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                  <p className="text-xs text-[#6A9A8F] pt-2">{poll.total} votes cast — thanks for voting!</p>
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
                          ? "border-[#2D6A4F] bg-[#1B4332]/60"
                          : "border-[#2D6A4F]/30 bg-[#1B4332]/30 hover:border-[#2D6A4F]/60"
                      }`}
                    >
                      <input
                        type="radio"
                        name="poll"
                        value={opt.id}
                        checked={selectedOption === opt.id}
                        onChange={() => setSelectedOption(opt.id)}
                        className="accent-[#74B49B] w-4 h-4 shrink-0"
                      />
                      <span className="text-sm text-[#D7E8E1]">{opt.label}</span>
                    </label>
                  ))}
                </div>
              )}

              {!hasVoted && (
                <button
                  onClick={handlePollSubmit}
                  disabled={!selectedOption || pollSubmitting}
                  className="w-full px-7 py-2.5 rounded-full bg-[#2D6A4F] hover:bg-[#1B4332] disabled:opacity-40 text-white text-sm font-bold tracking-wide transition-colors border border-[#2D6A4F]/60"
                >
                  {pollSubmitting ? "Submitting…" : "SUBMIT"}
                </button>
              )}
            </div>

            {/* ── LAST WEEK'S POLL ────────────────────────────────────────── */}
            <div className="p-6 rounded-2xl bg-[#0a1f17] border border-[#2D6A4F]/35">
              <p className="text-[10px] font-bold text-[#A8C5BA] uppercase tracking-[0.14em] mb-2">Last Week</p>
              <h3 className="text-lg sm:text-xl font-black text-white mb-2">Last Week's Poll Result</h3>
              <p className="text-[#C7DED5] text-sm mb-6">What is your biggest FX concern right now?</p>

              <div className="space-y-4 mb-6">
                {[
                  { label: "Volatility & timing", pct: 42 },
                  { label: "Budget rate uncertainty", pct: 27 },
                  { label: "Cashflow predictability", pct: 18 },
                  { label: "Hedge accounting impact", pct: 13 },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-[#C7DED5]">{item.label}</span>
                      <span className="font-black text-white">{item.pct}%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-[#1B4332] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#113526] to-[#2D6A4F]"
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full px-7 py-2.5 rounded-full bg-[#1B4332] hover:bg-[#2D6A4F]/40 text-[#a9c5bb] text-sm font-bold tracking-wide transition-colors border border-[#2D6A4F]/40">
                LAST WEEK RESULTS
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CUSTOM QUOTE FORM ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-[#1B4332]/60 z-10" id="custom-quote">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <div className="p-6 rounded-2xl bg-[#10251E] border border-[#2D6A4F]/35">
            {/* Section header */}
            <div className="mb-8">
              <p className="text-[10px] font-bold text-[#A8C5BA] uppercase tracking-[0.14em] mb-2">Custom Quote</p>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
                Get Your Customised FX Solution
              </h2>
              <p className="text-[#C7DED5] text-sm leading-relaxed">
                Tell us your requirements and we'll craft the perfect hedging strategy for your business.
              </p>
            </div>

          {submitted ? (
            /* ── success state ── */
            <div className="text-center py-16 max-w-md mx-auto">
              <div className="w-16 h-16 bg-[#1B4332]/60 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={32} className="text-[#74B49B]" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3">Request Received</h3>
              <p className="text-[#C7DED5] leading-relaxed mb-8">
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
                <h3 className="text-sm font-bold text-white">Your Details</h3>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name *"
                  value={formData.name}
                  onChange={handleInput}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#2D6A4F]/40 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] bg-[#0F2E22] text-white placeholder-[#6A9A8F] text-sm"
                />
                <input
                  type="text"
                  name="company"
                  placeholder="Company Name"
                  value={formData.company}
                  onChange={handleInput}
                  className="w-full px-4 py-3 rounded-xl border border-[#2D6A4F]/40 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] bg-[#0F2E22] text-white placeholder-[#6A9A8F] text-sm"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Work Email *"
                  value={formData.email}
                  onChange={handleInput}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#2D6A4F]/40 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] bg-[#0F2E22] text-white placeholder-[#6A9A8F] text-sm"
                />
                <textarea
                  name="notes"
                  placeholder="Notes / requirements — any specific hedging goals, currencies, or timeframes..."
                  value={formData.notes}
                  onChange={handleInput}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-[#2D6A4F]/40 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] bg-[#0F2E22] text-white placeholder-[#6A9A8F] text-sm resize-none"
                />
              </div>

              {error && (
                <div className="p-4 bg-red-900/30 border border-red-700/50 rounded-xl">
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold py-3 px-6 rounded-xl text-base transition-all border border-[#2D6A4F]/60"
              >
                {loading ? "Submitting…" : "Get My Custom Quote →"}
              </Button>

              <p className="text-xs text-[#6A9A8F] text-center">
                We respect your privacy. No spam, ever. General market information only — not a recommendation or offer.
              </p>
            </form>
          )}
          </div>
        </div>
      </section>

      {/* ── FAQ SECTION ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-[#1B4332]/60 z-10">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
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
<div className="relative z-10">
      <Footer />
</div>
    </main>
  )
}
