"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ChevronDown } from "lucide-react"

type RequestType = "Hedge Piece" | "Dashboard Access" | "Market Insights"

const REQUEST_OPTIONS: { value: RequestType; label: string; description: string }[] = [
  {
    value: "Hedge Piece",
    label: "Hedge Piece",
    description: "Our sample FX hedge policy template for mid-market CFOs",
  },
  {
    value: "Dashboard Access",
    label: "Dashboard Access",
    description: "Full access to live rates, trade uploads, and personalised insights",
  },
  {
    value: "Market Insights",
    label: "Market Insights",
    description: "Weekly FX commentary and strategic positioning ideas",
  },
]

interface AccessRequestFormProps {
  defaultRequestType?: RequestType
  onSuccess?: () => void
  compact?: boolean
}

export default function AccessRequestForm({
  defaultRequestType = "Market Insights",
  onSuccess,
  compact = false,
}: AccessRequestFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [requestType, setRequestType] = useState<RequestType>(defaultRequestType)
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/airtable/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company,
          requestType,
          notes,
          source: `${requestType} Request`,
        }),
      })

      const data = await res.json()
      if (!res.ok && data.error && !data.warning) {
        setError(data.error || "Something went wrong. Please try again.")
        return
      }

      setSubmitted(true)
      onSuccess?.()
    } catch {
      setError("Unable to submit. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="w-14 h-14 bg-[#E8EEEB] rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={28} className="text-[#2D6A4F]" />
        </div>
        <h4 className="text-xl font-bold text-[#12261F] mb-2">Request Received</h4>
        <p className="text-[#4A5A55] text-sm leading-relaxed max-w-xs mx-auto">
          Thanks! We'll be in touch shortly with your{" "}
          <span className="font-semibold text-[#2D6A4F]">{requestType}</span> access.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Request type selector */}
      <div>
        <label className="block text-xs font-semibold text-[#4A5A55] mb-1.5 uppercase tracking-wider">
          I'm requesting
        </label>
        <div className={`grid gap-2 ${compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-3"}`}>
          {REQUEST_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setRequestType(opt.value)}
              className={`text-left px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                requestType === opt.value
                  ? "border-[#2D6A4F] bg-[#E8EEEB]"
                  : "border-[#DCE5E1] bg-white hover:border-[#2D6A4F]/50"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                    requestType === opt.value ? "border-[#2D6A4F]" : "border-[#DCE5E1]"
                  }`}
                >
                  {requestType === opt.value && (
                    <span className="w-2 h-2 rounded-full bg-[#2D6A4F] block" />
                  )}
                </span>
                <span className="text-sm font-semibold text-[#12261F]">{opt.label}</span>
              </div>
              {!compact && (
                <p className="text-xs text-[#52796F] mt-1 pl-6">{opt.description}</p>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-[#DCE5E1] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] bg-white text-[#12261F] placeholder-[#52796F]"
      />

      {/* Email */}
      <input
        type="email"
        placeholder="Work Email *"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full px-4 py-3 rounded-xl border border-[#DCE5E1] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] bg-white text-[#12261F] placeholder-[#52796F]"
      />

      {/* Company */}
      <input
        type="text"
        placeholder="Company Name"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-[#DCE5E1] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] bg-white text-[#12261F] placeholder-[#52796F]"
      />

      {/* Notes */}
      {!compact && (
        <textarea
          placeholder="Any additional details (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-[#DCE5E1] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] bg-white text-[#12261F] placeholder-[#52796F] resize-none"
        />
      )}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{error}</p>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold py-3 rounded-xl"
      >
        {loading ? "Submitting..." : `Request ${requestType}`}
      </Button>

      <p className="text-xs text-[#52796F] text-center">
        We respect your privacy. No spam, ever.
      </p>
    </form>
  )
}
