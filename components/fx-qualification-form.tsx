"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

interface FormData {
  name: string
  email: string
  role: string
  fxVolume: string
  interests: string[]
  language: "en" | "zh"
  submitted: boolean
  tier: "standard" | "detailed" | null
}

const translations = {
  en: {
    title: "Get My FX Insights",
    subtitle: "Access My FX Intelligence Dashboard",
    description: "Join our FX strategy briefings — tailored to your scale.",
    name: "Full Name",
    email: "Business Email",
    role: "Your Role",
    fxVolume: "Annual FX Exposure",
    interests: "What interests you most?",
    portfolioVisibility: "Portfolio Visibility & Consolidation",
    optionStrategies: "Option Strategies & Structured Products",
    policySupport: "Policy Support & Governance",
    executionBenchmarking: "Execution Benchmarking",
    underVolume: "Under A$15m",
    aboveVolume: "A$15m+",
    submit: "Access My Intelligence Dashboard",
    privacy:
      "AFSL Disclosure: Payment & FX services provided by Ebury Partners Australia Pty Ltd | AFSL 520548. We respect your privacy.",
    success: "Success!",
    successMessage: "Check your email for your personalized FX insights and next steps.",
    standardTrack: "Standard Track - Comprehensive FX Resources",
    detailedTrack: "Detailed Track - Strategic Partnership Opportunity",
  },
  zh: {
    title: "获取我的外汇洞察",
    subtitle: "访问我的外汇智能仪表板",
    description: "加入我们的外汇战略简报 — 针对您的规模量身定制。",
    name: "全名",
    email: "商务邮箱",
    role: "您的角色",
    fxVolume: "年度外汇敞口",
    interests: "您最感兴趣的是什么？",
    portfolioVisibility: "投资组合可见性和整合",
    optionStrategies: "期权策略和结构化产品",
    policySupport: "政策支持和治理",
    executionBenchmarking: "执行基准测试",
    underVolume: "低于 A$15m",
    aboveVolume: "A$15m 及以上",
    submit: "访问我的智能仪表板",
    privacy: "AFSL 声明：支付和外汇服务由 Ebury Partners Australia Pty Ltd | AFSL 520548 提供。我们尊重您的隐私。",
    success: "成功！",
    successMessage: "查看您的电子邮件以获取您的个性化外汇洞察和后续步骤。",
    standardTrack: "标准跟踪 - 综合外汇资源",
    detailedTrack: "详细跟踪 - 战略合作伙伴机会",
  },
}

export default function FXQualificationForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    role: "",
    fxVolume: "",
    interests: [],
    language: "en",
    submitted: false,
    tier: null,
  })

  const t = translations[formData.language]

  const roles = ["CFO", "Finance Director", "Treasurer", "Founder", "Other"]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleInterestChange = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const tier = formData.fxVolume === "A$15m+" ? "detailed" : "standard"

    const payload = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      fxVolume: formData.fxVolume,
      interests: formData.interests,
      tier: tier,
      language: formData.language,
      timestamp: new Date().toISOString(),
    }

    console.log("[v0] FX Qualification form submitted:", payload)

    // Mock Airtable sync - replace with actual API call
    // await fetch('/api/airtable/sync-lead', { method: 'POST', body: JSON.stringify(payload) })

    setFormData((prev) => ({ ...prev, submitted: true, tier }))
  }

  return (
    <div className="bg-gradient-to-br from-[#F5F7F6] to-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Language Toggle */}
        <div className="flex justify-end gap-2 mb-8">
          <button
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                language: "en",
              }))
            }
            className={`px-3 py-1 rounded text-sm font-semibold transition ${
              formData.language === "en"
                ? "bg-[#2D6A4F] text-white"
                : "bg-[#DCE5E1] text-[#12261F] hover:bg-[#2D6A4F] hover:text-white"
            }`}
          >
            EN
          </button>
          <button
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                language: "zh",
              }))
            }
            className={`px-3 py-1 rounded text-sm font-semibold transition ${
              formData.language === "zh"
                ? "bg-[#2D6A4F] text-white"
                : "bg-[#DCE5E1] text-[#12261F] hover:bg-[#2D6A4F] hover:text-white"
            }`}
          >
            中文
          </button>
        </div>

        {!formData.submitted ? (
          <Card className="bg-white border-2 border-[#DCE5E1] p-8 md:p-12">
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-[#12261F] mb-2">{t.title}</h2>
              <p className="text-[#2D6A4F] font-semibold text-lg mb-4">{t.subtitle}</p>
              <p className="text-lg text-[#4A5A55]">{t.description}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-[#12261F] mb-2">{t.name} *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded border border-[#DCE5E1] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] bg-white"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-[#12261F] mb-2">{t.email} *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded border border-[#DCE5E1] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] bg-white"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-semibold text-[#12261F] mb-2">{t.role} *</label>
                <select
                  name="role"
                  required
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded border border-[#DCE5E1] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] bg-white"
                >
                  <option value="">Select your role</option>
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* FX Volume - Triggers Tier */}
              <div>
                <label className="block text-sm font-semibold text-[#12261F] mb-2">{t.fxVolume} *</label>
                <div className="space-y-3">
                  {[
                    { value: "Under A$15m", label: t.underVolume },
                    { value: "A$15m+", label: t.aboveVolume },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="fxVolume"
                        value={option.value}
                        checked={formData.fxVolume === option.value}
                        onChange={handleChange}
                        className="w-4 h-4 accent-[#2D6A4F]"
                      />
                      <span className="text-[#4A5A55]">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Conditional Interests - Only show if FX volume selected */}
              {formData.fxVolume && (
                <div className="bg-[#F5F7F6] p-6 rounded-lg border border-[#DCE5E1]">
                  <label className="block text-sm font-semibold text-[#12261F] mb-4">{t.interests}</label>
                  <div className="space-y-3">
                    {[
                      { id: "portfolio", label: t.portfolioVisibility },
                      { id: "options", label: t.optionStrategies },
                      { id: "policy", label: t.policySupport },
                      { id: "benchmarking", label: t.executionBenchmarking },
                    ].map((interest) => (
                      <label key={interest.id} className="flex items-center gap-3 cursor-pointer">
                        <Checkbox
                          checked={formData.interests.includes(interest.id)}
                          onCheckedChange={() => handleInterestChange(interest.id)}
                        />
                        <span className="text-[#4A5A55]">{interest.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Tier Preview */}
              {formData.fxVolume && (
                <div
                  className={`p-4 rounded-lg border-l-4 ${
                    formData.fxVolume === "A$15m+" ? "bg-blue-50 border-blue-400" : "bg-green-50 border-green-400"
                  }`}
                >
                  <p className="text-sm font-semibold text-[#12261F]">
                    {formData.fxVolume === "A$15m+" ? t.detailedTrack : t.standardTrack}
                  </p>
                </div>
              )}

              <Button
                type="submit"
                disabled={!formData.name || !formData.email || !formData.role || !formData.fxVolume}
                className="w-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold py-3 text-lg disabled:opacity-50"
              >
                {t.submit}
              </Button>

              <p className="text-xs text-[#4A5A55] text-center leading-relaxed">{t.privacy}</p>
            </form>
          </Card>
        ) : (
          <Card className="bg-white border-2 border-[#DCE5E1] p-8 md:p-12 text-center">
            <div className="inline-block w-16 h-16 bg-[#2D6A4F] bg-opacity-10 text-[#2D6A4F] rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-[#12261F] mb-3">{t.success}</h3>
            <p className="text-lg text-[#4A5A55] mb-6">{t.successMessage}</p>
            <div
              className={`inline-block px-4 py-2 rounded-full text-white font-semibold ${
                formData.tier === "detailed" ? "bg-blue-600" : "bg-green-600"
              }`}
            >
              {formData.tier === "detailed" ? t.detailedTrack : t.standardTrack}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
