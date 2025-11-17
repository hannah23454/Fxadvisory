"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("")
  const [frequency, setFrequency] = useState("daily")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Newsletter signup:", { email, role, frequency })
    setSubmitted(true)
    setTimeout(() => {
      setEmail("")
      setRole("")
      setSubmitted(false)
    }, 3000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="email"
        placeholder="your@company.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full px-4 py-3 rounded border border-[#DCE5E1] focus:outline-none focus:ring-2 focus:ring-[#BD6908] bg-white"
      />

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full px-4 py-3 rounded border border-[#DCE5E1] focus:outline-none focus:ring-2 focus:ring-[#BD6908] bg-white  text-black"
      >
        <option value="">Select Your Role</option>
        <option value="cfo">CFO / Finance Director</option>
        <option value="treasury">Treasury Manager</option>
        <option value="owner">Business Owner</option>
        <option value="other">Other</option>
      </select>

      <select
        value={frequency}
        onChange={(e) => setFrequency(e.target.value)}
        className="w-full px-4 py-3 rounded border border-[#DCE5E1] focus:outline-none focus:ring-2 focus:ring-[#BD6908] bg-white  text-black"
      >
        <option value="daily">Daily Insights</option>
        <option value="weekly">Weekly Summary</option>
      </select>

      <Button type="submit" className="w-full bg-[#BD6908] hover:bg-[#a35a07] text-black font-bold py-3">
        {submitted ? "Subscribed!" : "Subscribe"}
      </Button>
    </form>
  )
}
