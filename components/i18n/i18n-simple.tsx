"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"

export type Locale = "en" | "zh"

type Dictionary = Record<string, string>

type Dictionaries = Record<Locale, Dictionary>

const dictionaries: Dictionaries = {
  en: {
    // Navigation
    nav_home: "Home",
    nav_about: "About",
    nav_services: "Services",
    nav_market_insights: "Market Insights",
    nav_contact: "Contact",
    cta_book_call: "Book a Call",
    cta_login: "Login",
    welcome: "Welcome",
    dashboard: "Dashboard",
    logout: "Logout",
    admin_panel: "Admin Panel",
    
    // Hero Section
    hero_badge: "FOR MID-MARKET CFOs",
    hero_title_1: "Manage FX Risk",
    hero_title_2: "With Confidence",
    hero_desc: "Tailored corporate FX solutions that protect your margins and simplify treasury management.",
    hero_expert_analysis: "Expert Analysis",
    hero_risk_protection: "Risk Protection",
    hero_15min_setup: "15-Min Setup",
    hero_book_consult: "Book a 15-Min Consult",
    hero_download_policy: "Download Hedge Policy",
    hero_disclaimer: "💡 This information is general in nature and does not constitute financial advice.",
    hero_live_fx: "Live FX Rates",
    hero_updated_live: "Updated live",
    hero_trusted: "Trusted by 500+ CFOs",
    hero_alt: "Financial management illustration",
    
    // Services
    services_badge: "TREASURY SOLUTIONS",
    services_title_1: "Corporate FX",
    services_title_2: "Solutions",
    services_desc: "Comprehensive treasury services designed for mid-market enterprises managing multi-currency exposure.",
    services_benefit_1: "Competitive rates with full transparency",
    services_benefit_2: "24/7 online platform access",
    services_benefit_3: "Dedicated account manager",
    services_currencies: "Currencies",
    services_forward: "Forward Contracts",
    services_forward_desc: "Lock in FX rates today for future obligations. Simplify forecasting and protect cash flow.",
    services_popular: "Most Popular",
    services_options: "Options & Zero Cost",
    services_options_desc: "Flexible hedging with upside potential. No premium strategies tailored to your risk profile.",
    services_flexible: "Flexible",
    services_payments: "Payments & Settlements",
    services_payments_desc: "Streamlined cross-border payments with optimal FX execution and settlement tracking.",
    services_fast_secure: "Fast & Secure",
    services_advisory: "Risk Strategy Advisory",
    services_advisory_desc: "Expert guidance on portfolio hedging. Policy design and ongoing risk management support.",
    services_expert_led: "Expert Led",
    services_alt: "Corporate FX Solutions",
    
    // Corporate FX Hero
    corp_fx_title: "Manage your",
    corp_fx_title_highlight: "finances",
    corp_fx_title_end: "with ease.",
    corp_fx_feature_1: "Simple to use and enhanced reporting to help you make smarter decisions.",
    corp_fx_feature_2: "Robust and fully secure payment infrastructure to enable reliable transfers across the globe.",
    corp_fx_feature_3: "Transact seamlessly using our online platform or with the help of your dedicated relationship manager.",
    corp_fx_cta: "See features",
    corp_fx_alt: "Manage finances illustration",
    
    // Lets Talk
    lets_talk_badge: "LET'S TALK",
    lets_talk_title: "Grow your business with",
    lets_talk_title_highlight: "expert FX advisory.",
    lets_talk_desc: "We have helped thousands of businesses trade and thrive globally. Get in touch with our team to learn how we can help you succeed beyond borders.",
    lets_talk_cta: "Book a 15-min call",
    lets_talk_alt: "Business communication illustration",
    
    // Business Lending
    lending_badge: "BUSINESS LENDING",
    lending_title: "Flexible lending solutions to help you realise your ambitions.",
    lending_desc: "Access our fast and hassle-free trade finance facility when needed to fund your purchases.",
    lending_cta: "Explore more",
    lending_alt: "Business delivery and logistics",
    
    // How We Work
    how_we_work_title: "How We Work",
    how_we_work_desc: "Our proven 4-step process ensures comprehensive FX risk management from start to finish.",
    step_1_title: "Assess",
    step_1_desc: "We analyze your FX exposure, cash flows, and risk tolerance to understand your unique situation.",
    step_2_title: "Hedge",
    step_2_desc: "Design and execute tailored strategies. Forward contracts, options, or custom structures.",
    step_3_title: "Track",
    step_3_desc: "Real-time monitoring and reporting. Transparent dashboards showing P&L and position management.",
    step_4_title: "Report",
    step_4_desc: "Monthly compliance and strategy reviews. Ongoing optimizations based on market conditions.",
    
    // Lead Magnet
    lead_free_resource: "FREE RESOURCE",
    lead_title: "Get the Free Hedge Policy Guide",
    lead_desc: "Download our sample treasury policy template and learn how to build a hedging framework that works for mid-market CFOs.",
    lead_benefit_1: "Policy structure & governance best practices",
    lead_benefit_2: "Currency pair prioritization framework",
    lead_benefit_3: "Reporting & board communication templates",
    
    // CTA Section
    cta_title: "Ready to Transform Your Treasury?",
    cta_desc: "Schedule a 15-minute consultation with our FX specialists. No obligation. Just expert advice tailored to your situation.",
    cta_book: "Book Consultation",
    cta_whatsapp: "WhatsApp Us",
    
    // Footer
    footer_tagline: "Trusted FX solutions for mid-market corporates. Simplify treasury risk management.",
    footer_products: "Products",
    footer_forward: "Forward Contracts",
    footer_options: "Options & Strategies",
    footer_payment: "Payment Services",
    footer_treasury: "Treasury Support",
    footer_company: "Company",
    footer_about: "About Us",
    footer_market: "Market Insights",
    footer_contact: "Contact",
    footer_login: "Login",
    footer_get_touch: "Get in Touch",
    footer_sydney: "Sydney, Australia",
    footer_afsl: "Payment & FX services provided by Ebury Partners Australia Pty Ltd",
    footer_afsl_detail: "AFSL 520548 | ABN 54 632 570 702",
    footer_switchyard: "SwitchYard is engaged as a Programme Manager under this licence.",
    footer_privacy: "Privacy Policy",
    footer_terms: "Terms of Service",
    footer_compliance: "Compliance",
    footer_copyright: "© 2025 SwitchYard FX. All rights reserved.",
    
    // Disclaimer
    disclaimer_title: "General Information Disclaimer:",
    disclaimer_text: "The information provided on this website is general in nature and does not constitute personal financial advice. It does not take into account your personal circumstances, financial situation, needs, or objectives. Before making any financial decisions, you should consider whether the information is appropriate for your situation and seek professional advice from a qualified financial advisor as needed. Past performance is not indicative of future results.",
    
    // Market Commentary
    market_commentary: "Market Commentary",
    market_insights: "Market Insights",
    featured: "FEATURED",
    read_more: "Read More",
    view_all: "View All",
    newsletter_cta_title: "Stay Ahead with Daily Updates",
    newsletter_cta_desc: "Subscribe for daily commentary, policy moves, and strategic recommendations.",
  },
  zh: {
    // Navigation
    nav_home: "首页",
    nav_about: "关于我们",
    nav_services: "服务",
    nav_market_insights: "市场洞察",
    nav_contact: "联系",
    cta_book_call: "预约电话",
    cta_login: "登录",
    welcome: "欢迎",
    dashboard: "控制台",
    logout: "退出",
    admin_panel: "管理面板",
    
    // Hero Section
    hero_badge: "面向中型市场首席财务官",
    hero_title_1: "管理外汇风险",
    hero_title_2: "充满信心",
    hero_desc: "量身定制的企业外汇解决方案，保护您的利润并简化资金管理。",
    hero_expert_analysis: "专家分析",
    hero_risk_protection: "风险保护",
    hero_15min_setup: "15分钟设置",
    hero_book_consult: "预约15分钟咨询",
    hero_download_policy: "下载对冲政策",
    hero_disclaimer: "💡 此信息为一般性质，不构成财务建议。",
    hero_live_fx: "实时外汇汇率",
    hero_updated_live: "实时更新",
    hero_trusted: "受到500多位首席财务官的信赖",
    hero_alt: "财务管理插图",
    
    // Services
    services_badge: "资金解决方案",
    services_title_1: "企业外汇",
    services_title_2: "解决方案",
    services_desc: "为管理多币种风险敞口的中型企业设计的综合资金服务。",
    services_benefit_1: "具有完全透明度的有竞争力的价格",
    services_benefit_2: "全天候在线平台访问",
    services_benefit_3: "专属客户经理",
    services_currencies: "货币",
    services_forward: "远期合约",
    services_forward_desc: "今天锁定未来义务的外汇汇率。简化预测并保护现金流。",
    services_popular: "最受欢迎",
    services_options: "期权与零成本",
    services_options_desc: "具有上涨潜力的灵活对冲。根据您的风险状况量身定制的无溢价策略。",
    services_flexible: "灵活",
    services_payments: "支付与结算",
    services_payments_desc: "具有最佳外汇执行和结算跟踪的简化跨境支付。",
    services_fast_secure: "快速且安全",
    services_advisory: "风险策略咨询",
    services_advisory_desc: "关于投资组合对冲的专家指导。政策设计和持续风险管理支持。",
    services_expert_led: "专家主导",
    services_alt: "企业外汇解决方案",
    
    // Corporate FX Hero
    corp_fx_title: "轻松管理您的",
    corp_fx_title_highlight: "财务",
    corp_fx_title_end: "。",
    corp_fx_feature_1: "简单易用且增强的报告功能，帮助您做出更明智的决策。",
    corp_fx_feature_2: "强大且完全安全的支付基础设施，可在全球范围内实现可靠的转账。",
    corp_fx_feature_3: "使用我们的在线平台或在专属客户经理的帮助下无缝交易。",
    corp_fx_cta: "查看功能",
    corp_fx_alt: "管理财务插图",
    
    // Lets Talk
    lets_talk_badge: "让我们谈谈",
    lets_talk_title: "通过",
    lets_talk_title_highlight: "专业外汇咨询发展您的业务。",
    lets_talk_desc: "我们已帮助数千家企业在全球范围内进行贸易和蓬勃发展。请联系我们的团队，了解我们如何帮助您在国际上取得成功。",
    lets_talk_cta: "预约15分钟电话",
    lets_talk_alt: "商务沟通插图",
    
    // Business Lending
    lending_badge: "商业贷款",
    lending_title: "灵活的贷款解决方案，帮助您实现抱负。",
    lending_desc: "在需要时访问我们快速且无忧的贸易融资设施，为您的采购提供资金。",
    lending_cta: "了解更多",
    lending_alt: "商业交付和物流",
    
    // How We Work
    how_we_work_title: "我们的工作方式",
    how_we_work_desc: "我们经过验证的4步流程确保从头到尾全面的外汇风险管理。",
    step_1_title: "评估",
    step_1_desc: "我们分析您的外汇敞口、现金流和风险承受能力，以了解您的独特情况。",
    step_2_title: "对冲",
    step_2_desc: "设计和执行量身定制的策略。远期合约、期权或定制结构。",
    step_3_title: "跟踪",
    step_3_desc: "实时监控和报告。显示损益和头寸管理的透明仪表板。",
    step_4_title: "报告",
    step_4_desc: "每月合规和策略审查。根据市场条件进行持续优化。",
    
    // Lead Magnet
    lead_free_resource: "免费资源",
    lead_title: "获取免费对冲政策指南",
    lead_desc: "下载我们的样本资金政策模板，学习如何为中型市场首席财务官构建有效的对冲框架。",
    lead_benefit_1: "政策结构和治理最佳实践",
    lead_benefit_2: "货币对优先级框架",
    lead_benefit_3: "报告和董事会沟通模板",
    
    // CTA Section
    cta_title: "准备好转型您的资金管理了吗？",
    cta_desc: "安排与我们外汇专家的15分钟咨询。无义务。只是根据您的情况量身定制的专家建议。",
    cta_book: "预约咨询",
    cta_whatsapp: "WhatsApp联系我们",
    
    // Footer
    footer_tagline: "值得信赖的中型企业外汇解决方案。简化资金风险管理。",
    footer_products: "产品",
    footer_forward: "远期合约",
    footer_options: "期权与策略",
    footer_payment: "支付服务",
    footer_treasury: "资金支持",
    footer_company: "公司",
    footer_about: "关于我们",
    footer_market: "市场洞察",
    footer_contact: "联系",
    footer_login: "登录",
    footer_get_touch: "联系我们",
    footer_sydney: "悉尼，澳大利亚",
    footer_afsl: "支付和外汇服务由Ebury Partners Australia Pty Ltd提供",
    footer_afsl_detail: "AFSL 520548 | ABN 54 632 570 702",
    footer_switchyard: "SwitchYard作为该许可证下的项目经理。",
    footer_privacy: "隐私政策",
    footer_terms: "服务条款",
    footer_compliance: "合规",
    footer_copyright: "© 2025 SwitchYard FX。保留所有权利。",
    
    // Disclaimer
    disclaimer_title: "一般信息免责声明：",
    disclaimer_text: "本网站提供的信息为一般性质，不构成个人财务建议。它没有考虑您的个人情况、财务状况、需求或目标。在做出任何财务决策之前，您应该考虑该信息是否适合您的情况，并根据需要寻求合格财务顾问的专业建议。过去的表现并不代表未来的结果。",
    
    // Market Commentary
    market_commentary: "市场评论",
    market_insights: "市场洞察",
    featured: "精选",
    read_more: "阅读全文",
    view_all: "查看全部",
    newsletter_cta_title: "订阅每日更新，领先一步",
    newsletter_cta_desc: "订阅获取每日评论、政策动向与策略建议。",
  },
}

interface I18nContextValue {
  locale: Locale
  t: (key: string) => string
  setLocale: (loc: Locale) => void
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en")

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? (localStorage.getItem('locale') as Locale | null) : null
    if (stored) setLocaleState(stored)
  }, [])

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale
    }
  }, [locale])

  const setLocale = (loc: Locale) => {
    setLocaleState(loc)
    try { localStorage.setItem('locale', loc) } catch {}
  }

  const t = useMemo(() => {
    const dict = dictionaries[locale]
    return (key: string) => dict[key] ?? key
  }, [locale])

  const value = useMemo(() => ({ locale, t, setLocale }), [locale, t])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
