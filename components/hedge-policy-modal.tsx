"use client"

import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Shield, CheckCircle, Loader2, AlertCircle } from "lucide-react"
import type { FxVolumeRange, FxProviderType } from "@/lib/types/models"

const FX_VOLUMES: FxVolumeRange[] = [
  "<1M",
  "1M–5M",
  "5M–10M",
  "10M–20M",
  "20M–40M",
  "40M–80M",
  "80M–150M",
  "150M–200M",
  "200M+",
]

const FX_PROVIDERS: FxProviderType[] = [
  "Non-Bank",
  "Bank",
  "Both Bank & Non-Bank",
]

interface HedgePolicyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function HedgePolicyModal({ open, onOpenChange }: HedgePolicyModalProps) {
  const [fxVolume, setFxVolume] = useState<FxVolumeRange | "">("")
  const [fxProvider, setFxProvider] = useState<FxProviderType | "">("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const resetForm = () => {
    setFxVolume("")
    setFxProvider("")
    setEmail("")
    setLoading(false)
    setSubmitted(false)
    setError("")
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset after close animation
      setTimeout(resetForm, 300)
    }
    onOpenChange(open)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (!fxVolume) {
      setError("Please select your annual FX volume.")
      return
    }
    if (!fxProvider) {
      setError("Please select your current FX provider.")
      return
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/hedge-policy/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, fxVolume, fxProvider }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Something went wrong. Please try again.")
        return
      }

      setSubmitted(true)
    } catch (err) {
      setError("Network error. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  const selectClass =
    "w-full px-4 py-3 rounded-lg border border-[#DCE5E1] bg-white text-[#12261f] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent transition-all appearance-none cursor-pointer text-sm"
  const labelClass = "block text-sm font-semibold text-[#12261f] mb-1.5"

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-0 rounded-xl shadow-2xl bg-white">
        {/* Header */}
        <div className="bg-[#12261f] px-6 pt-6 pb-5">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[#2D6A4F] flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-white text-lg font-bold">
                  FX Hedge Policy
                </DialogTitle>
                <DialogDescription className="text-[#a8c5ba] text-sm mt-0.5">
                  Access our institutional-grade hedge policy template
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Body */}
        <div className="px-6 pb-6 pt-4">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* FX Volume */}
              <div>
                <label htmlFor="fxVolume" className={labelClass}>
                  Annual FX Volume <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="fxVolume"
                    value={fxVolume}
                    onChange={(e) => setFxVolume(e.target.value as FxVolumeRange)}
                    className={selectClass}
                    required
                  >
                    <option value="" disabled>
                      Select your annual FX volume
                    </option>
                    {FX_VOLUMES.map((vol) => (
                      <option key={vol} value={vol}>
                        {vol}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* FX Provider */}
              <div>
                <label htmlFor="fxProvider" className={labelClass}>
                  Current FX Provider <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="fxProvider"
                    value={fxProvider}
                    onChange={(e) => setFxProvider(e.target.value as FxProviderType)}
                    className={selectClass}
                    required
                  >
                    <option value="" disabled>
                      Select your current FX provider
                    </option>
                    {FX_PROVIDERS.map((prov) => (
                      <option key={prov} value={prov}>
                        {prov}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="hedgeEmail" className={labelClass}>
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="hedgeEmail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-[#DCE5E1] bg-white text-[#12261f] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent transition-all text-sm"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-semibold py-3 rounded-lg text-sm transition-all duration-200 h-12 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm & Receive Policy"
                )}
              </Button>

              <p className="text-xs text-center text-gray-400 pt-1">
                Your data is secure. We respect your privacy.
              </p>
            </form>
          ) : (
            /* Success State */
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-[#12261f] mb-2">
                You&apos;re All Set!
              </h3>
              <p className="text-sm text-[#4a5a55] mb-4 leading-relaxed">
                Check your inbox at <strong>{email}</strong> for your FX Hedge Policy access link and dashboard credentials.
              </p>
              <div className="bg-[#f5f7f6] rounded-lg p-4 text-left space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[#4a5a55]">FX Volume:</span>
                  <span className="font-semibold text-[#12261f]">{fxVolume}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#4a5a55]">FX Provider:</span>
                  <span className="font-semibold text-[#12261f]">{fxProvider}</span>
                </div>
              </div>
              <Button
                onClick={() => handleOpenChange(false)}
                className="w-full bg-[#12261f] hover:bg-[#1B4332] text-white font-semibold py-3 rounded-lg text-sm h-11 cursor-pointer"
              >
                Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
