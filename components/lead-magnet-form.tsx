"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function LeadMagnetForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    submitted: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await fetch("/api/airtable/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          source: "Hedge Piece Signup",
          requestType: "Hedge Piece",
        }),
      })
    } catch {
      // Non-blocking — form succeeds regardless
    }
    setFormData((prev) => ({ ...prev, submitted: true }))
  }

  return (
    <Card className="bg-[#F5F7F6] border-0 p-8 max-w-md">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-[#12261F] mb-2">Download Your Free Guide</h3>
        <p className="text-sm text-[#4A5A55]">Sample Hedge Policy Template for Mid-Market CFOs</p>
      </div>

      {!formData.submitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded border border-[#DCE5E1] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] bg-white"
          />
          <input
            type="email"
            name="email"
            placeholder="Work Email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded border border-[#DCE5E1] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] bg-white"
          />
          <input
            type="text"
            name="company"
            placeholder="Company Name"
            required
            value={formData.company}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded border border-[#DCE5E1] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] bg-white"
          />
          <Button type="submit" className="w-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold py-3">
            Download PDF
          </Button>
          <p className="text-xs text-[#4A5A55] text-center">We respect your privacy. Unsubscribe anytime.</p>
        </form>
      ) : (
        <div className="text-center py-6">
          <div className="inline-block w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h4 className="font-bold text-[#12261F] mb-2">Download Started</h4>
          <p className="text-sm text-[#4A5A55] mb-4">Check your email for the PDF. Look for admin@switchyard.com.au</p>
        </div>
      )}
    </Card>
  )
}
