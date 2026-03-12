"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import {
  User, Building2, ShieldCheck, Save, Loader2, ChevronDown, ChevronUp,
  CheckCircle2, BarChart2, TrendingUp, Star, Sliders, Zap,
  AlertCircle, RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"

/* ─────────────────────── Constants ─────────────────────── */

const EXPERIENCE_LEVELS = [
  { value: "beginner", label: "Beginner — Learning the basics of FX" },
  { value: "intermediate", label: "Intermediate — Some experience with FX products" },
  { value: "advanced", label: "Advanced — Regular FX hedging activity" },
  { value: "professional", label: "Professional — Full treasury / finance background" },
]

const INTEREST_FLAGS = [
  "FX Hedging", "Forward Contracts", "FX Options", "Macro Economics",
  "Rates & Central Banks", "Commodities", "Emerging Markets", "Trade Finance",
  "Risk Management", "Cash Flow Forecasting",
]

const INDUSTRIES = [
  "Agriculture & Farming", "Construction & Property", "Education",
  "Energy & Resources", "Financial Services", "Healthcare",
  "Hospitality & Tourism", "Manufacturing", "Mining", "Retail & E-Commerce",
  "Technology", "Transport & Logistics", "Other",
]

type RiskBand = "Very Conservative" | "Conservative" | "Balanced" | "Growth" | "Aggressive"

const BAND_META: Record<RiskBand, { color: string; bg: string; border: string; icon: React.ReactNode; desc: string }> = {
  "Very Conservative": {
    color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200",
    icon: <ShieldCheck size={18} />,
    desc: "Maximum capital protection. Suited to businesses with tight margins or limited capacity for rate volatility.",
  },
  Conservative: {
    color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200",
    icon: <ShieldCheck size={18} />,
    desc: "Strong preference for certainty with some flexibility to capture modest upside on FX movements.",
  },
  Balanced: {
    color: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-200",
    icon: <BarChart2 size={18} />,
    desc: "Equal weight on protection and cost optimisation. Accepts moderate rate variability for improved outcomes.",
  },
  Growth: {
    color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200",
    icon: <TrendingUp size={18} />,
    desc: "Willing to accept greater FX variability in pursuit of better-than-market rates and structured savings.",
  },
  Aggressive: {
    color: "text-red-700", bg: "bg-red-50", border: "border-red-200",
    icon: <Zap size={18} />,
    desc: "Comfortable with significant FX exposure. Seeks to maximise savings through advanced strategies.",
  },
}

interface Product {
  title: string
  description: string
  details: string
  band: RiskBand[]
}

const PRODUCTS: Product[] = [
  {
    title: "Forward Exchange Contract (FEC)",
    description: "Lock in today's exchange rate for a future transaction date.",
    details: "A standard Forward Exchange Contract lets you fix an exchange rate for a specific amount and settlement date up to 24 months ahead. Provides complete certainty of cost, eliminating FX risk entirely.",
    band: ["Very Conservative", "Conservative"],
  },
  {
    title: "Zero-Cost Collar",
    description: "Set a worst-case rate floor while retaining upside to a cap.",
    details: "Simultaneously buy a protective option and sell an upside option to fund it at zero premium. You're protected below the floor, participate in upside to the cap, and pay nothing upfront.",
    band: ["Conservative", "Balanced"],
  },
  {
    title: "Participating Forward",
    description: "Guaranteed worst-case rate with partial upside participation.",
    details: "Similar to a Collar but you retain a fixed % (typically 50%) of any favourable market movement beyond your protected level. Zero premium. Great for businesses wanting certainty with optionality.",
    band: ["Conservative", "Balanced"],
  },
  {
    title: "Flexible / Window Forward",
    description: "Fixed rate available across a settlement window, not a single date.",
    details: "Like a standard FEC but you can draw down the contract at any point within a specified window. Ideal for businesses with uncertain payment timing who still want rate certainty.",
    band: ["Balanced", "Growth"],
  },
  {
    title: "Enhanced Forward",
    description: "Potentially better-than-market rate with defined downside protection.",
    details: "An Enhanced Forward offers an improved rate over the market forward, funded by accepting a knock-in or worst-case rate if the market moves significantly against you. Suits confident hedgers.",
    band: ["Balanced", "Growth"],
  },
  {
    title: "European Knock-In Forward",
    description: "Market rate unless a trigger level is breached at expiry.",
    details: "You receive the spot rate at expiry unless the market closes below a specified knock-in level, at which point you buy at a pre-agreed protected rate. Higher upside, defined worst case.",
    band: ["Growth", "Aggressive"],
  },
  {
    title: "Vanilla FX Option",
    description: "Right (not obligation) to exchange at a set rate on a future date.",
    details: "A vanilla put or call option gives you the right to exchange at a strike rate. If rates move in your favour you let it expire and transact at the better market rate. Premium payable upfront.",
    band: ["Growth", "Aggressive"],
  },
  {
    title: "Structured FX Strategy",
    description: "Tailored multi-leg strategy optimised for your specific risk profile.",
    details: "Combines multiple option and forward legs to create a bespoke payoff profile aligned to your business cycle, budget rate, and risk appetite. Suitable for larger FX programmes.",
    band: ["Aggressive"],
  },
]

const CAPACITY_QUESTIONS = [
  {
    q: "What is your business's annual FX transaction volume?",
    options: ["< $1M", "$1M – $5M", "$5M – $20M", "$20M – $80M", "$80M+"],
  },
  {
    q: "What % of your revenue is exposed to FX movements?",
    options: ["< 10%", "10 – 25%", "25 – 50%", "50 – 75%", "> 75%"],
  },
  {
    q: "How long can your business sustain a 10% adverse FX move?",
    options: ["< 3 months", "3 – 6 months", "6 – 12 months", "1 – 2 years", "> 2 years"],
  },
  {
    q: "What is your current hedging coverage?",
    options: ["Unhedged", "< 25% hedged", "25 – 50% hedged", "50 – 75% hedged", "> 75% hedged"],
  },
]

const WILLINGNESS_QUESTIONS = [
  {
    q: "How comfortable are you with short-term FX rate fluctuations?",
    options: ["Very uncomfortable", "Uncomfortable", "Neutral", "Comfortable", "Very comfortable"],
  },
  {
    q: "Would you prefer rate certainty over potential upside?",
    options: ["Strong certainty", "Prefer certainty", "Balanced", "Prefer upside", "Strong upside"],
  },
  {
    q: "How do you react to unexpected FX losses?",
    options: ["Stop all exposure", "Significantly reduce", "Reassess strategy", "Hold position", "View as opportunity"],
  },
  {
    q: "What is your primary FX risk management objective?",
    options: ["Protect budget rate", "Mostly protect", "Balance protection & cost", "Optimise cost", "Maximise savings"],
  },
]

const MATRIX_CELL_BG = (band: number) => {
  if (band <= 1) return "bg-blue-100 text-blue-800"
  if (band <= 2) return "bg-emerald-100 text-emerald-800"
  if (band <= 3) return "bg-yellow-100 text-yellow-800"
  if (band <= 4) return "bg-orange-100 text-orange-800"
  return "bg-red-100 text-red-800"
}

function cellBand(x: number, y: number): number {
  return Math.round((x + y) / 2)
}

function bandFromScore(score: number): RiskBand {
  if (score < 1.8) return "Very Conservative"
  if (score < 2.6) return "Conservative"
  if (score < 3.4) return "Balanced"
  if (score < 4.2) return "Growth"
  return "Aggressive"
}

/* ─────────────────────── Sub-components ─────────────────────── */

function SectionTitle({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="flex items-start gap-4 mb-8">
      <div className="w-12 h-12 rounded-2xl bg-[#E8EEEB] flex items-center justify-center flex-shrink-0 text-[#2D6A4F]">
        {icon}
      </div>
      <div>
        <h2 className="text-xl font-bold text-[#12261F]">{title}</h2>
        {subtitle && <p className="text-sm text-[#52796F] mt-0.5">{subtitle}</p>}
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#4A5A55] uppercase tracking-wider mb-1.5">
        {label}
      </label>
      {children}
    </div>
  )
}

function Input({ value, onChange, placeholder, type = "text", readOnly = false }: {
  value: string; onChange?: (v: string) => void; placeholder?: string; type?: string; readOnly?: boolean
}) {
  return (
    <input
      type={type}
      value={value}
      readOnly={readOnly}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-4 py-2.5 rounded-xl border border-[#DCE5E1] text-[#12261F] text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] ${readOnly ? "bg-[#F5F7F6] text-[#52796F]" : "bg-white"}`}
    />
  )
}

function ProductCard({ product }: { product: Product }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${open ? "border-[#2D6A4F] shadow-md" : "border-[#DCE5E1]"}`}
    >
      <button
        className="w-full text-left p-5 flex items-start justify-between gap-3"
        onClick={() => setOpen(!open)}
      >
        <div>
          <h4 className="text-sm font-bold text-[#12261F] mb-1">{product.title}</h4>
          <p className="text-xs text-[#52796F] leading-relaxed">{product.description}</p>
        </div>
        <span className="mt-0.5 text-[#2D6A4F] shrink-0">
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-[#E8EEEB]">
          <p className="text-sm text-[#4A5A55] leading-relaxed pt-4">{product.details}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {product.band.map((b) => (
              <span key={b} className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${BAND_META[b].bg} ${BAND_META[b].color} ${BAND_META[b].border}`}>
                {b}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─────────────────────── Tabs ─────────────────────── */

function PersonalTab({ user, onSaved }: { user: any; onSaved: (u: any) => void }) {
  const [name, setName] = useState(user?.name || "")
  const [phone, setPhone] = useState(user?.phone || "")
  const [position, setPosition] = useState(user?.position || "")
  const [experience, setExperience] = useState(user?.experienceLevel || "")
  const [interests, setInterests] = useState<string[]>(user?.areasOfInterest || [])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  const toggleInterest = (tag: string) =>
    setInterests((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag])

  const handleSave = async () => {
    setSaving(true); setError("")
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, position, experienceLevel: experience, areasOfInterest: interests }),
      })
      if (!res.ok) throw new Error("Failed to save")
      setSaved(true)
      onSaved({ ...user, name, phone, position, experienceLevel: experience, areasOfInterest: interests })
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError("Failed to save. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <SectionTitle icon={<User size={20} />} title="Personal Profile" subtitle="Manage your personal details and investment background." />

      <div className="bg-white rounded-2xl border border-[#DCE5E1] p-6 sm:p-8 space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Full Name">
            <Input value={name} onChange={setName} placeholder="Your full name" />
          </Field>
          <Field label="Email Address">
            <Input value={user?.email || ""} readOnly />
          </Field>
          <Field label="Phone / Contact">
            <Input value={phone} onChange={setPhone} placeholder="+61 4XX XXX XXX" />
          </Field>
          <Field label="Job Title / Position">
            <Input value={position} onChange={setPosition} placeholder="e.g. CFO, Treasury Manager" />
          </Field>
        </div>

        <Field label="Investment Experience Level">
          <select
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-[#DCE5E1] text-[#12261F] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
          >
            <option value="">Select level</option>
            {EXPERIENCE_LEVELS.map((l) => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </Field>

        <Field label="Areas of Interest">
          <div className="flex flex-wrap gap-2 mt-1">
            {INTEREST_FLAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleInterest(tag)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all ${
                  interests.includes(tag)
                    ? "bg-[#2D6A4F] border-[#2D6A4F] text-white"
                    : "bg-white border-[#DCE5E1] text-[#4A5A55] hover:border-[#2D6A4F]"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </Field>

        {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2">{error}</p>}

        <div className="flex items-center gap-3 pt-2">
          <Button onClick={handleSave} disabled={saving} className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white rounded-xl px-6">
            {saving ? <Loader2 size={15} className="animate-spin mr-2" /> : <Save size={15} className="mr-2" />}
            Save Changes
          </Button>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-emerald-700 font-semibold">
              <CheckCircle2 size={16} /> Saved
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function BusinessTab({ user, onSaved }: { user: any; onSaved: (u: any) => void }) {
  const [company, setCompany] = useState(user?.company || "")
  const [industry, setIndustry] = useState(user?.industry || "")
  const [businessContact, setBusinessContact] = useState(user?.businessContact || "")
  const [businessPreferences, setBusinessPreferences] = useState(user?.businessPreferences || "")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  const handleSave = async () => {
    setSaving(true); setError("")
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, industry, businessContact, businessPreferences }),
      })
      if (!res.ok) throw new Error("Failed to save")
      setSaved(true)
      onSaved({ ...user, company, industry, businessContact, businessPreferences })
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError("Failed to save. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <SectionTitle icon={<Building2 size={20} />} title="Business Profile" subtitle="Your business information and FX investment preferences." />

      <div className="bg-white rounded-2xl border border-[#DCE5E1] p-6 sm:p-8 space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Business Name">
            <Input value={company} onChange={setCompany} placeholder="e.g. Acme Exports Pty Ltd" />
          </Field>
          <Field label="Industry">
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#DCE5E1] text-[#12261F] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
            >
              <option value="">Select industry</option>
              {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </Field>
        </div>

        <Field label="Business Contact Details">
          <Input value={businessContact} onChange={setBusinessContact} placeholder="Business phone / address" />
        </Field>

        <Field label="Business Investment Preferences">
          <textarea
            value={businessPreferences}
            onChange={(e) => setBusinessPreferences(e.target.value)}
            placeholder="e.g. We primarily hedge USD receivables on a 3-month rolling basis..."
            rows={4}
            className="w-full px-4 py-2.5 rounded-xl border border-[#DCE5E1] text-[#12261F] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] resize-none"
          />
        </Field>

        {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2">{error}</p>}

        <div className="flex items-center gap-3 pt-2">
          <Button onClick={handleSave} disabled={saving} className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white rounded-xl px-6">
            {saving ? <Loader2 size={15} className="animate-spin mr-2" /> : <Save size={15} className="mr-2" />}
            Save Changes
          </Button>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-emerald-700 font-semibold">
              <CheckCircle2 size={16} /> Saved
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function RiskTab() {
  const [step, setStep] = useState<"intro" | "questionnaire" | "results">("intro")
  const [capAnswers, setCapAnswers] = useState<number[]>(Array(4).fill(0))
  const [willAnswers, setWillAnswers] = useState<number[]>(Array(4).fill(0))
  const [saving, setSaving] = useState(false)
  const [riskData, setRiskData] = useState<any>(null)
  const [loadingExisting, setLoadingExisting] = useState(true)
  // Dynamic matrix hover
  const [hoverCell, setHoverCell] = useState<[number, number] | null>(null)

  useEffect(() => {
    fetch("/api/user/risk-profile")
      .then((r) => r.json())
      .then((d) => {
        if (d && d.band) {
          setRiskData(d)
          setCapAnswers(d.capacityAnswers)
          setWillAnswers(d.willingnessAnswers)
          setStep("results")
        }
      })
      .catch(() => {})
      .finally(() => setLoadingExisting(false))
  }, [])

  const allAnswered = capAnswers.every((a) => a > 0) && willAnswers.every((a) => a > 0)

  const handleSubmit = async () => {
    if (!allAnswered) return
    setSaving(true)
    try {
      const res = await fetch("/api/user/risk-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ capacityAnswers: capAnswers, willingnessAnswers: willAnswers }),
      })
      const data = await res.json()
      if (data.success) {
        setRiskData({ ...data, capacityAnswers: capAnswers, willingnessAnswers: willAnswers })
        setStep("results")
      }
    } catch { /* fail silently */ }
    finally { setSaving(false) }
  }

  const capScore = capAnswers.every((a) => a > 0)
    ? capAnswers.reduce((s, n) => s + n, 0) / capAnswers.length
    : 0
  const willScore = willAnswers.every((a) => a > 0)
    ? willAnswers.reduce((s, n) => s + n, 0) / willAnswers.length
    : 0
  const liveScore = capScore && willScore ? (capScore + willScore) / 2 : 0
  const liveBand: RiskBand | null = liveScore > 0 ? bandFromScore(liveScore) : null

  const activeBand: RiskBand = riskData?.band ?? liveBand ?? "Balanced"
  const relevantProducts = PRODUCTS.filter((p) => p.band.includes(activeBand))

  if (loadingExisting) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={28} className="animate-spin text-[#2D6A4F]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SectionTitle
        icon={<ShieldCheck size={20} />}
        title="Risk Profile"
        subtitle="Complete the RS Risk Matrix questionnaire to generate your personalised FX risk profile."
      />

      {/* ─── Intro ─── */}
      {step === "intro" && (
        <div className="bg-white rounded-2xl border border-[#DCE5E1] p-8 max-w-2xl">
          <h3 className="text-lg font-bold text-[#12261F] mb-3">RS Risk Matrix Assessment</h3>
          <p className="text-[#4A5A55] text-sm leading-relaxed mb-6">
            Answer 8 short questions across two dimensions — your financial <strong>capacity</strong> to
            bear FX risk, and your psychological <strong>willingness</strong> to accept it. We'll plot
            your position on the risk matrix and recommend matched FX products.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {["4 Capacity questions (financial ability)", "4 Willingness questions (risk psychology)", "Dynamic risk matrix visualisation", "Personalised FX product recommendations"].map((item) => (
              <div key={item} className="flex items-start gap-2 text-sm text-[#4A5A55]">
                <CheckCircle2 size={16} className="text-[#2D6A4F] mt-0.5 shrink-0" />
                {item}
              </div>
            ))}
          </div>
          <Button onClick={() => setStep("questionnaire")} className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white rounded-xl px-6">
            Start Assessment
          </Button>
        </div>
      )}

      {/* ─── Questionnaire ─── */}
      {step === "questionnaire" && (
        <div className="space-y-6 max-w-2xl">
          {/* Capacity */}
          <div className="bg-white rounded-2xl border border-[#DCE5E1] p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-6">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">Part 1 of 2</span>
              <h3 className="text-base font-bold text-[#12261F]">Financial Capacity</h3>
            </div>
            <div className="space-y-8">
              {CAPACITY_QUESTIONS.map((q, qi) => (
                <div key={qi}>
                  <p className="text-sm font-semibold text-[#12261F] mb-3">
                    <span className="text-[#52796F] mr-1">C{qi + 1}.</span> {q.q}
                  </p>
                  <div className="grid gap-2">
                    {q.options.map((opt, oi) => (
                      <button
                        key={oi}
                        onClick={() => {
                          const updated = [...capAnswers]
                          updated[qi] = oi + 1
                          setCapAnswers(updated)
                        }}
                        className={`text-left px-4 py-2.5 rounded-xl border-2 text-sm transition-all ${
                          capAnswers[qi] === oi + 1
                            ? "border-[#2D6A4F] bg-[#E8EEEB] text-[#12261F] font-semibold"
                            : "border-[#DCE5E1] text-[#4A5A55] hover:border-[#2D6A4F]/50"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Willingness */}
          <div className="bg-white rounded-2xl border border-[#DCE5E1] p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-6">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">Part 2 of 2</span>
              <h3 className="text-base font-bold text-[#12261F]">Risk Willingness</h3>
            </div>
            <div className="space-y-8">
              {WILLINGNESS_QUESTIONS.map((q, qi) => (
                <div key={qi}>
                  <p className="text-sm font-semibold text-[#12261F] mb-3">
                    <span className="text-[#52796F] mr-1">W{qi + 1}.</span> {q.q}
                  </p>
                  <div className="grid gap-2">
                    {q.options.map((opt, oi) => (
                      <button
                        key={oi}
                        onClick={() => {
                          const updated = [...willAnswers]
                          updated[qi] = oi + 1
                          setWillAnswers(updated)
                        }}
                        className={`text-left px-4 py-2.5 rounded-xl border-2 text-sm transition-all ${
                          willAnswers[qi] === oi + 1
                            ? "border-[#2D6A4F] bg-[#E8EEEB] text-[#12261F] font-semibold"
                            : "border-[#DCE5E1] text-[#4A5A55] hover:border-[#2D6A4F]/50"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={handleSubmit}
              disabled={!allAnswered || saving}
              className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white rounded-xl px-8"
            >
              {saving ? <Loader2 size={15} className="animate-spin mr-2" /> : <ShieldCheck size={15} className="mr-2" />}
              Generate My Risk Profile
            </Button>
            {!allAnswered && (
              <span className="text-xs text-[#52796F] flex items-center gap-1.5">
                <AlertCircle size={14} /> Please answer all questions
              </span>
            )}
          </div>
        </div>
      )}

      {/* ─── Results ─── */}
      {step === "results" && riskData && (
        <div className="space-y-6">
          {/* Band summary */}
          <div className={`rounded-2xl border-2 p-6 sm:p-8 ${BAND_META[riskData.band as RiskBand].bg} ${BAND_META[riskData.band as RiskBand].border}`}>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#52796F] mb-2 block">Your Risk Profile</span>
                <h3 className={`text-2xl font-bold mb-2 flex items-center gap-2 ${BAND_META[riskData.band as RiskBand].color}`}>
                  {BAND_META[riskData.band as RiskBand].icon}
                  {riskData.band}
                </h3>
                <p className="text-sm text-[#4A5A55] max-w-xl leading-relaxed">
                  {BAND_META[riskData.band as RiskBand].desc}
                </p>
              </div>
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#12261F]">{riskData.capacityScore?.toFixed(1)}</div>
                  <div className="text-xs text-[#52796F] font-semibold">Capacity</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#12261F]">{riskData.willingnessScore?.toFixed(1)}</div>
                  <div className="text-xs text-[#52796F] font-semibold">Willingness</div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setStep("questionnaire")}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#2D6A4F] hover:underline"
            >
              <RefreshCw size={13} /> Retake Assessment
            </button>
          </div>

          {/* Risk Matrix */}
          <div className="bg-white rounded-2xl border border-[#DCE5E1] p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-2">
              <Sliders size={18} className="text-[#2D6A4F]" />
              <h3 className="text-base font-bold text-[#12261F]">Dynamic Tolerance Matrix</h3>
            </div>
            <p className="text-xs text-[#52796F] mb-6">
              Hover over any cell to see the risk band for that combination. Your position is marked with a dot.
            </p>

            {/* Axis labels + grid */}
            <div className="flex gap-3">
              {/* Y-axis label */}
              <div className="flex items-center">
                <span
                  className="text-xs font-semibold text-[#52796F] uppercase tracking-wider"
                  style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                >
                  Capacity to Bear Risk →
                </span>
              </div>

              <div className="flex-1">
                <div className="grid grid-cols-5 gap-1">
                  {[5, 4, 3, 2, 1].map((y) =>
                    [1, 2, 3, 4, 5].map((x) => {
                      const b = cellBand(x, y)
                      const isUser =
                        Math.round(riskData.capacityScore) === y &&
                        Math.round(riskData.willingnessScore) === x
                      const isHover = hoverCell?.[0] === x && hoverCell?.[1] === y
                      const bandNames: RiskBand[] = ["Very Conservative", "Conservative", "Balanced", "Growth", "Aggressive"]
                      return (
                        <div
                          key={`${x}-${y}`}
                          onMouseEnter={() => setHoverCell([x, y])}
                          onMouseLeave={() => setHoverCell(null)}
                          className={`relative aspect-square rounded-lg flex items-center justify-center transition-all cursor-default ${MATRIX_CELL_BG(b)} ${isHover ? "ring-2 ring-[#2D6A4F] scale-105 z-10" : ""}`}
                        >
                          {isUser && (
                            <span className="w-4 h-4 rounded-full bg-[#12261F] border-2 border-white shadow-lg block" />
                          )}
                        </div>
                      )
                    })
                  )}
                </div>
                {/* X-axis label */}
                <div className="text-center mt-2 text-xs font-semibold text-[#52796F] uppercase tracking-wider">
                  Willingness to Take Risk →
                </div>
              </div>
            </div>

            {/* Hover tooltip */}
            {hoverCell && (
              <div className="mt-4 px-4 py-3 rounded-xl bg-[#F5F7F6] border border-[#DCE5E1] text-sm">
                <span className="font-semibold text-[#12261F]">
                  {bandFromScore((cellBand(hoverCell[0], hoverCell[1]) * 2 - 1))}
                </span>
                <span className="text-[#52796F] ml-2">
                  — Capacity {hoverCell[1]}, Willingness {hoverCell[0]}
                </span>
              </div>
            )}

            {/* Legend */}
            <div className="mt-5 flex flex-wrap gap-3">
              {(["Very Conservative", "Conservative", "Balanced", "Growth", "Aggressive"] as RiskBand[]).map((band, i) => (
                <span key={band} className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${BAND_META[band].bg} ${BAND_META[band].color} ${BAND_META[band].border}`}>
                  {band}
                </span>
              ))}
            </div>
          </div>

          {/* Product cards */}
          <div className="bg-white rounded-2xl border border-[#DCE5E1] p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-2">
              <Star size={18} className="text-[#2D6A4F]" />
              <h3 className="text-base font-bold text-[#12261F]">Recommended Products</h3>
            </div>
            <p className="text-xs text-[#52796F] mb-5">
              Based on your <strong>{riskData.band}</strong> risk profile. Click any card to expand details.
            </p>
            <div className="space-y-3">
              {relevantProducts.map((p) => <ProductCard key={p.title} product={p} />)}
            </div>
            {relevantProducts.length === 0 && (
              <p className="text-sm text-[#52796F] text-center py-6">Complete the assessment to see matched products.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─────────────────────── Page ─────────────────────── */

type Tab = "personal" | "business" | "risk"

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "personal",  label: "Personal Profile",  icon: <User size={16} /> },
  { id: "business",  label: "Business Profile",  icon: <Building2 size={16} /> },
  { id: "risk",      label: "Risk Profile",       icon: <ShieldCheck size={16} /> },
]

export default function ProfilePage() {
  const { data: session } = useSession()
  const [tab, setTab] = useState<Tab>("personal")
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/user/profile")
      .then((r) => r.json())
      .then((d) => setUser(d))
      .catch(() => setUser(session?.user))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-2xl bg-[#12261F] flex items-center justify-center text-2xl font-bold text-white shrink-0">
          {(user?.name || session?.user?.name || "U")[0].toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#12261F]">{user?.name || session?.user?.name || "Your Profile"}</h1>
          <p className="text-sm text-[#52796F]">{user?.email || session?.user?.email}</p>
          {user?.company && <p className="text-xs text-[#52796F] mt-0.5">{user.company}{user.industry ? ` · ${user.industry}` : ""}</p>}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-2xl border border-[#DCE5E1] p-1.5 w-fit">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === t.id
                ? "bg-[#2D6A4F] text-white shadow-sm"
                : "text-[#4A5A55] hover:bg-[#E8EEEB]"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={28} className="animate-spin text-[#2D6A4F]" />
        </div>
      ) : (
        <>
          {tab === "personal" && <PersonalTab user={user} onSaved={setUser} />}
          {tab === "business" && <BusinessTab user={user} onSaved={setUser} />}
          {tab === "risk" && <RiskTab />}
        </>
      )}
    </div>
  )
}
