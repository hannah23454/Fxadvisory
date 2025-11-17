"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import Disclaimer from "@/components/disclaimer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, Zap, CreditCard, Users, Briefcase } from "lucide-react"
import { useI18n } from "@/components/i18n/i18n"

export default function Services() {
  const { t } = useI18n()

  const services = [
    {
      id: "forward-contracts",
      icon: TrendingUp,
      title: t('services_forward'),
      summary: t('services_forward_summary'),
      benefits: [
        t('services_forward_benefit_1'),
        t('services_forward_benefit_2'),
        t('services_forward_benefit_3'),
        t('services_forward_benefit_4'),
      ],
      useCases: [
        t('services_forward_use_1'),
        t('services_forward_use_2'),
        t('services_forward_use_3'),
        t('services_forward_use_4'),
      ],
      description: t('services_forward_full'),
      cta: t('services_request_pricing'),
    },
    {
      id: "options-zero-cost",
      icon: Zap,
      title: t('services_options_title'),
      summary: t('services_options_summary'),
      benefits: [
        t('services_options_benefit_1'),
        t('services_options_benefit_2'),
        t('services_options_benefit_3'),
        t('services_options_benefit_4'),
      ],
      useCases: [
        t('services_options_use_1'),
        t('services_options_use_2'),
        t('services_options_use_3'),
        t('services_options_use_4'),
      ],
      description: t('services_options_full'),
      cta: t('services_request_pricing'),
    },
    {
      id: "payments-settlements",
      icon: CreditCard,
      title: t('services_payments_title'),
      summary: t('services_payments_summary'),
      benefits: [
        t('services_payments_benefit_1'),
        t('services_payments_benefit_2'),
        t('services_payments_benefit_3'),
        t('services_payments_benefit_4'),
      ],
      useCases: [
        t('services_payments_use_1'),
        t('services_payments_use_2'),
        t('services_payments_use_3'),
        t('services_payments_use_4'),
      ],
      description: t('services_payments_full'),
      cta: t('services_learn_more'),
    },
    {
      id: "risk-strategy",
      icon: Users,
      title: t('services_risk_title'),
      summary: t('services_risk_summary'),
      benefits: [
        t('services_risk_benefit_1'),
        t('services_risk_benefit_2'),
        t('services_risk_benefit_3'),
        t('services_risk_benefit_4'),
      ],
      useCases: [
        t('services_risk_use_1'),
        t('services_risk_use_2'),
        t('services_risk_use_3'),
        t('services_risk_use_4'),
      ],
      description: t('services_risk_full'),
      cta: t('services_book_consultation'),
    },
    {
      id: "treasury-support",
      icon: Briefcase,
      title: t('services_treasury_title'),
      summary: t('services_treasury_summary'),
      benefits: [
        t('services_treasury_benefit_1'),
        t('services_treasury_benefit_2'),
        t('services_treasury_benefit_3'),
        t('services_treasury_benefit_4'),
      ],
      useCases: [
        t('services_treasury_use_1'),
        t('services_treasury_use_2'),
        t('services_treasury_use_3'),
        t('services_treasury_use_4'),
      ],
      description: t('services_treasury_full'),
      cta: t('services_request_support'),
    },
  ]

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="bg-[#12261f] text-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 text-balance">{t('services_page_title')}</h1>
          <p className="text-xl text-[#dce5e1]">{t('services_page_subtitle')}</p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-12">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <Card key={service.id} className="bg-white border-[#dce5e1] hover:shadow-lg transition overflow-hidden">
                  <div className="grid md:grid-cols-3 gap-0">
                    {/* Left: Icon & Title */}
                    <div className="bg-[#f5f7f6] p-8 flex flex-col justify-center md:border-r border-[#dce5e1]">
                      <Icon className="text-[#bd6908] mb-4" size={32} />
                      <h3 className="text-2xl font-bold text-[#12261f] mb-3">{service.title}</h3>
                      <p className="text-[#4a5a55]">{service.summary}</p>
                    </div>

                    {/* Right: Details */}
                    <div className="p-8 md:col-span-2">
                      <p className="text-[#4a5a55] mb-6 leading-relaxed">{service.description}</p>

                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="font-bold text-[#12261f] mb-3">{t('services_key_benefits')}</h4>
                          <ul className="space-y-2">
                            {service.benefits.map((benefit, i) => (
                              <li key={i} className="text-sm text-[#4a5a55] flex gap-2">
                                <span className="text-[#bd6908] font-bold">•</span>
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-bold text-[#12261f] mb-3">{t('services_use_cases')}</h4>
                          <ul className="space-y-2">
                            {service.useCases.map((useCase, i) => (
                              <li key={i} className="text-sm text-[#4a5a55] flex gap-2">
                                <span className="text-[#bd6908] font-bold">•</span>
                                {useCase}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <Button className="bg-[#bd6908] hover:bg-[#a35a07] text-white font-bold">{service.cta}</Button>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#12261f] text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">{t('services_not_sure_title')}</h2>
          <p className="text-[#dce5e1] mb-6">{t('services_not_sure_desc')}</p>
          <a href="/contact" className="inline-block">
            <Button className="bg-[#bd6908] hover:bg-[#a35a07] text-white font-bold px-8 py-3">
              {t('services_schedule_consultation')}
            </Button>
          </a>
        </div>
      </section>

      <Disclaimer />
      <Footer />
    </main>
  )
}
