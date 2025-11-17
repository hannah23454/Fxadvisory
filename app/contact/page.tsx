"use client"

import type React from "react"

import Header from "@/components/header"
import Footer from "@/components/footer"
import Disclaimer from "@/components/disclaimer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Mail, Phone, MessageCircle } from "lucide-react"
import { useI18n } from "@/components/i18n/i18n"

export default function Contact() {
  const { t } = useI18n()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Contact form submitted:", formData)
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="bg-[#12261f] text-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 text-balance">{t('contact_title')}</h1>
          <p className="text-xl text-[#dce5e1]">{t('contact_subtitle')}</p>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Left: Booking */}
          <div>
            <h2 className="text-3xl font-bold text-[#12261f] mb-6">{t('contact_schedule_title')}</h2>
            <Card className="bg-[#f5f7f6] border-0 p-8 mb-6">
              <p className="text-sm text-[#4a5a55] mb-6 leading-relaxed">{t('contact_schedule_desc')}</p>

              <div className="space-y-3 mb-6">
                <div className="p-4 bg-white rounded border border-[#dce5e1]">
                  <p className="font-bold text-[#12261f] text-sm mb-2">{t('contact_available_times')}</p>
                  <p className="text-xs text-[#4a5a55]">{t('contact_hours')}</p>
                </div>
              </div>

              <Button className="w-full bg-[#bd6908] hover:bg-[#a35a07] text-white font-bold py-3 mb-3">
                {t('contact_view_calendar')}
              </Button>

              <p className="text-xs text-[#4a5a55] text-center">{t('contact_calendar_note')}</p>
            </Card>

            {/* Resources */}
            <Card className="bg-white border-[#dce5e1] p-6">
              <h3 className="font-bold text-[#12261f] mb-4">{t('contact_resources')}</h3>
              <Button
                variant="outline"
                className="w-full border-[#bd6908] text-[#bd6908] hover:bg-[#f5f7f6] mb-2 bg-transparent"
              >
                {t('contact_watch_loom')}
              </Button>
              <p className="text-xs text-[#4a5a55] text-center">{t('contact_prep_note')}</p>
            </Card>
          </div>

          {/* Right: Contact Options */}
          <div>
            <h2 className="text-3xl font-bold text-[#12261f] mb-6">{t('contact_other_ways')}</h2>
            <div className="space-y-4 mb-8">
              <Card className="bg-white border-[#dce5e1] p-6 hover:shadow-lg transition cursor-pointer">
                <div className="flex items-start gap-4">
                  <Phone className="text-[#bd6908] shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="font-bold text-[#12261f] mb-1">{t('contact_phone')}</h3>
                    <a href="tel:+61261234567" className="text-[#bd6908] hover:underline font-medium">
                      +61 2 6123 4567
                    </a>
                    <p className="text-xs text-[#4a5a55] mt-1">{t('contact_phone_hours')}</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-white border-[#dce5e1] p-6 hover:shadow-lg transition cursor-pointer">
                <div className="flex items-start gap-4">
                  <Mail className="text-[#bd6908] shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="font-bold text-[#12261f] mb-1">{t('contact_email')}</h3>
                    <a href="mailto:hello@switchyardfx.com" className="text-[#bd6908] hover:underline font-medium">
                      hello@switchyardfx.com
                    </a>
                    <p className="text-xs text-[#4a5a55] mt-1">{t('contact_email_response')}</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-white border-[#dce5e1] p-6 hover:shadow-lg transition cursor-pointer">
                <div className="flex items-start gap-4">
                  <MessageCircle className="text-[#bd6908] shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="font-bold text-[#12261f] mb-1">{t('contact_whatsapp')}</h3>
                    <a href="https://wa.me/61261234567" className="text-[#bd6908] hover:underline font-medium">
                      {t('contact_send_message')}
                    </a>
                    <p className="text-xs text-[#4a5a55] mt-1">{t('contact_whatsapp_desc')}</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-white border-[#dce5e1] p-6 hover:shadow-lg transition cursor-pointer">
                <div className="flex items-start gap-4">
                  <MessageCircle className="text-[#bd6908] shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="font-bold text-[#12261f] mb-1">{t('contact_wechat')}</h3>
                    <p className="text-[#bd6908] font-medium">{t('contact_wechat_scan')}</p>
                    <p className="text-xs text-[#4a5a55] mt-1">{t('contact_wechat_id')}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* General Inquiry Form */}
      <section className="bg-[#f5f7f6] py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-[#12261f] mb-8 text-center">{t('contact_form_title')}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder={t('contact_form_name')}
                value={formData.name}
                onChange={handleChange}
                required
                className="px-4 py-3 rounded border border-[#dce5e1] focus:outline-none focus:ring-2 focus:ring-[#bd6908] bg-white"
              />
              <input
                type="email"
                name="email"
                placeholder={t('contact_form_email')}
                value={formData.email}
                onChange={handleChange}
                required
                className="px-4 py-3 rounded border border-[#dce5e1] focus:outline-none focus:ring-2 focus:ring-[#bd6908] bg-white"
              />
            </div>
            <input
              type="text"
              name="company"
              placeholder={t('contact_form_company')}
              value={formData.company}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded border border-[#dce5e1] focus:outline-none focus:ring-2 focus:ring-[#bd6908] bg-white"
            />
            <input
              type="text"
              name="subject"
              placeholder={t('contact_form_subject')}
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded border border-[#dce5e1] focus:outline-none focus:ring-2 focus:ring-[#bd6908] bg-white"
            />
            <textarea
              name="message"
              placeholder={t('contact_form_message')}
              rows={5}
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded border border-[#dce5e1] focus:outline-none focus:ring-2 focus:ring-[#bd6908] bg-white"
            />
            <Button type="submit" className="w-full bg-[#bd6908] hover:bg-[#a35a07] text-white font-bold py-3">
              {t('contact_form_send')}
            </Button>
          </form>
        </div>
      </section>

      <Disclaimer />
      <Footer />
    </main>
  )
}
