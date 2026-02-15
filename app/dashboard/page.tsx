"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  TrendingUp, 
  FileText, 
  Calendar, 
  MessageSquare,
  Download,
  Eye,
  EyeOff,
  Loader2,
  ArrowUpRight,
  DollarSign
} from "lucide-react"
import Link from "next/link"
import { useI18n } from "@/components/i18n/i18n"

export const dynamic = 'force-dynamic';

interface CurrencyRate {
  code: string
  name: string
  rate: number
  change: number
  lastUpdated: string
}

interface FeedModule {
  id: string
  title: string
  enabled: boolean
  component: React.ReactNode
}

export default function DashboardHome() {
  const { data: session } = useSession()
  const { t } = useI18n()
  const [loading, setLoading] = useState(true)
  const [preferences, setPreferences] = useState<any>(null)
  const [currencyRates, setCurrencyRates] = useState<CurrencyRate[]>([])
  const [recentContent, setRecentContent] = useState<any[]>([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Load user preferences
      const prefRes = await fetch('/api/user/preferences')
      if (prefRes.ok) {
        const prefs = await prefRes.json()
        setPreferences(prefs)
      }

      // Load recent content
      const contentRes = await fetch('/api/content?limit=5')
      if (contentRes.ok) {
        const content = await contentRes.json()
        setRecentContent(content)
      }

      // Simulate currency rates (in production, integrate with a real FX API)
      setCurrencyRates([
        { code: 'USD', name: 'US Dollar', rate: 0.6523, change: +0.12, lastUpdated: new Date().toISOString() },
        { code: 'EUR', name: 'Euro', rate: 0.6089, change: -0.05, lastUpdated: new Date().toISOString() },
        { code: 'GBP', name: 'British Pound', rate: 0.5198, change: +0.08, lastUpdated: new Date().toISOString() },
        { code: 'JPY', name: 'Japanese Yen', rate: 98.45, change: +0.34, lastUpdated: new Date().toISOString() },
        { code: 'NZD', name: 'New Zealand Dollar', rate: 1.0876, change: -0.02, lastUpdated: new Date().toISOString() },
        { code: 'CNY', name: 'Chinese Yuan', rate: 4.7234, change: +0.18, lastUpdated: new Date().toISOString() },
        { code: 'SGD', name: 'Singapore Dollar', rate: 0.8765, change: +0.11, lastUpdated: new Date().toISOString() },
        { code: 'HKD', name: 'Hong Kong Dollar', rate: 5.1023, change: -0.09, lastUpdated: new Date().toISOString() },
      ])

      setLoading(false)
    } catch (error) {
      console.error('Error loading dashboard:', error)
      setLoading(false)
    }
  }

  const toggleModule = async (moduleId: string, enabled: boolean) => {
    if (!preferences) return

    const updatedLayout = {
      ...preferences.feedLayout,
      [moduleId]: enabled
    }

    try {
      await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedLayout: updatedLayout })
      })

      setPreferences({
        ...preferences,
        feedLayout: updatedLayout
      })
    } catch (error) {
      console.error('Error updating preferences:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#2D6A4F]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div>
        <h1 className="text-3xl font-bold text-[#12261f] mb-2">
          {t('dash_welcome_back')}, {session?.user?.name?.split(' ')[0]}
        </h1>
        <p className="text-[#4a5a55]">
          {t('dash_personalized_dashboard')}
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link href="/dashboard/messages?action=new">
          <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer border-[#DCE5E1]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#2D6A4F]/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-[#2D6A4F]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#12261f]">{t('dash_send_message')}</p>
                <p className="text-xs text-[#4a5a55]">{t('dash_contact_advisor')}</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/contact?action=book-consultation">
          <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer border-[#DCE5E1]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#2D6A4F]/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#2D6A4F]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#12261f]">{t('dash_book_call')}</p>
                <p className="text-xs text-[#4a5a55]">{t('dash_15min_consult')}</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/dashboard/documents">
          <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer border-[#DCE5E1]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#2D6A4F]/10 flex items-center justify-center">
                <Download className="w-5 h-5 text-[#2D6A4F]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#12261f]">{t('dash_documents')}</p>
                <p className="text-xs text-[#4a5a55]">{t('dash_policies_guides')}</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/dashboard/trades">
          <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer border-[#DCE5E1]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#2D6A4F]/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#2D6A4F]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#12261f]">{t('dash_upload_trades')}</p>
                <p className="text-xs text-[#4a5a55]">{t('dash_compare_deals')}</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Live Currency Rates */}
      {preferences?.feedLayout?.liveRates && (
        <Card className="p-6 border-[#DCE5E1]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#12261f] flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#2D6A4F]" />
              {t('dash_live_aud_rates')}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleModule('liveRates', false)}
            >
              <EyeOff className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {currencyRates
              .filter((currency) => 
                !preferences?.currencies || 
                preferences.currencies.length === 0 || 
                preferences.currencies.includes(currency.code)
              )
              .map((currency) => (
              <div key={currency.code} className="p-4 rounded-lg border border-[#DCE5E1] bg-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-[#12261f]">{currency.code}</span>
                  <span className={`text-xs font-medium ${currency.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {currency.change >= 0 ? '+' : ''}{currency.change}%
                  </span>
                </div>
                <p className="text-2xl font-bold text-[#12261f]">{currency.rate.toFixed(4)}</p>
                <p className="text-xs text-[#4a5a55] mt-1">{currency.name}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#4a5a55] mt-4">
            {t('dash_last_updated')}: {new Date().toLocaleTimeString()}
          </p>
        </Card>
      )}

      {/* Market Headlines */}
      {preferences?.feedLayout?.marketNews && (
        <Card className="p-6 border-[#DCE5E1]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#12261f] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#2D6A4F]" />
              {t('dash_latest_market_insights')}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleModule('marketNews', false)}
            >
              <EyeOff className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-4">
            {recentContent.length > 0 ? (
              recentContent.slice(0, 3).map((item: any) => (
                <div key={item._id} className="p-4 rounded-lg border border-[#DCE5E1] hover:border-[#2D6A4F] transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#12261f] mb-1">{item.title}</h3>
                      <p className="text-sm text-[#4a5a55] line-clamp-2">
                        {item.content?.substring(0, 150)}...
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-[#4a5a55]">
                          {new Date(item.publishedAt).toLocaleDateString()}
                        </span>
                        {item.tags && (
                          <div className="flex gap-2">
                            {item.tags.slice(0, 2).map((tag: string) => (
                              <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-[#E8EEEB] text-[#2D6A4F]">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <Link href={`/dashboard/market?article=${item._id}`}>
                      <Button variant="ghost" size="sm">
                        <ArrowUpRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-[#4a5a55] py-8">{t('dash_no_insights')}</p>
            )}
          </div>
          <Link href="/dashboard/market">
            <Button variant="outline" className="w-full mt-4 border-[#DCE5E1] text-[#2D6A4F] hover:bg-[#E8EEEB]">
              {t('dash_view_all_insights')}
            </Button>
          </Link>
        </Card>
      )}

      {/* Documents & Resources */}
      {preferences?.feedLayout?.hedgingDocs && (
        <Card className="p-6 border-[#DCE5E1]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#12261f] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#2D6A4F]" />
              {t('dash_hedging_docs_resources')}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleModule('hedgingDocs', false)}
            >
              <EyeOff className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border border-[#DCE5E1] hover:border-[#2D6A4F] transition-colors cursor-pointer">
              <FileText className="w-8 h-8 text-[#2D6A4F] mb-2" />
              <h3 className="font-semibold text-[#12261f] mb-1">{t('dash_fx_policy_template')}</h3>
              <p className="text-sm text-[#4a5a55] mb-3">{t('dash_comprehensive_guide')}</p>
              <Button size="sm" variant="outline" className="border-[#DCE5E1]">
                <Download className="w-4 h-4 mr-2" />
                {t('dash_download_pdf')}
              </Button>
            </div>
            <div className="p-4 rounded-lg border border-[#DCE5E1] hover:border-[#2D6A4F] transition-colors cursor-pointer">
              <FileText className="w-8 h-8 text-[#2D6A4F] mb-2" />
              <h3 className="font-semibold text-[#12261f] mb-1">{t('dash_market_risk_report')}</h3>
              <p className="text-sm text-[#4a5a55] mb-3">{t('dash_latest_volatility')}</p>
              <Button size="sm" variant="outline" className="border-[#DCE5E1]">
                <Download className="w-4 h-4 mr-2" />
                {t('dash_download_pdf')}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Customize Feed */}
      {!preferences?.feedLayout?.liveRates && 
       !preferences?.feedLayout?.marketNews && 
       !preferences?.feedLayout?.hedgingDocs && (
        <Card className="p-8 border-[#DCE5E1] text-center">
          <h3 className="text-lg font-semibold text-[#12261f] mb-2">
            {t('dash_feed_empty')}
          </h3>
          <p className="text-[#4a5a55] mb-4">
            {t('dash_customize_dashboard')}
          </p>
          <Link href="/dashboard/settings">
            <Button className="bg-[#2D6A4F] hover:bg-[#1B4332]">
              {t('dash_go_to_settings')}
            </Button>
          </Link>
        </Card>
      )}
    </div>
  )
}
