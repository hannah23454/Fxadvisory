"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Loader2, TrendingUp, Eye, Download } from "lucide-react"

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState<any>(null)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics?period=30')
      if (res.ok) {
        const data = await res.json()
        setAnalytics(data)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error loading analytics:', error)
      setLoading(false)
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
      <div>
        <h1 className="text-3xl font-bold text-[#12261f] mb-2">
          Analytics & Insights
        </h1>
        <p className="text-[#4a5a55]">
          Track user engagement and market intelligence
        </p>
      </div>

      {/* Top Currencies */}
      <Card className="p-6 border-[#DCE5E1]">
        <h2 className="text-xl font-semibold text-[#12261f] mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#2D6A4F]" />
          Most Viewed Currencies
        </h2>
        <div className="space-y-3">
          {analytics?.topCurrencies?.map((item: any, index: number) => (
            <div key={item._id} className="flex items-center justify-between p-3 rounded-lg border border-[#DCE5E1]">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-[#2D6A4F]">#{index + 1}</span>
                <div>
                  <p className="font-semibold text-[#12261f]">{item._id || 'USD'}</p>
                  <p className="text-sm text-[#4a5a55]">{item.count} views</p>
                </div>
              </div>
              <div className="w-24 h-2 bg-[#E8EEEB] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#2D6A4F]"
                  style={{ width: `${(item.count / (analytics.topCurrencies[0]?.count || 1)) * 100}%` }}
                />
              </div>
            </div>
          )) || (
            <p className="text-center text-[#4a5a55] py-8">No data available yet</p>
          )}
        </div>
      </Card>

      {/* Top Content */}
      <Card className="p-6 border-[#DCE5E1]">
        <h2 className="text-xl font-semibold text-[#12261f] mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5 text-[#2D6A4F]" />
          Most Viewed Content
        </h2>
        <div className="space-y-3">
          {analytics?.topContent?.map((item: any, index: number) => (
            <div key={item._id} className="flex items-center justify-between p-3 rounded-lg border border-[#DCE5E1]">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-[#52796F]">#{index + 1}</span>
                <div>
                  <p className="font-semibold text-[#12261f]">Article {item._id?.substring(0, 8)}</p>
                  <p className="text-sm text-[#4a5a55]">{item.count} views</p>
                </div>
              </div>
            </div>
          )) || (
            <p className="text-center text-[#4a5a55] py-8">No data available yet</p>
          )}
        </div>
      </Card>

      {/* Engagement Trends */}
      <Card className="p-6 border-[#DCE5E1]">
        <h2 className="text-xl font-semibold text-[#12261f] mb-4">
          Engagement Over Time
        </h2>
        <div className="h-64 flex items-end justify-between gap-2">
          {analytics?.engagementTrends?.slice(-14).map((item: any, index: number) => (
            <div key={item._id} className="flex-1 flex flex-col items-center gap-2">
              <div 
                className="w-full bg-[#2D6A4F] rounded-t-lg transition-all hover:bg-[#1B4332] cursor-pointer"
                style={{ height: `${(item.count / Math.max(...analytics.engagementTrends.map((t: any) => t.count), 1)) * 100}%` }}
                title={`${item._id}: ${item.count} events`}
              />
              <span className="text-xs text-[#4a5a55] rotate-45 origin-left">
                {new Date(item._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          )) || null}
        </div>
        {(!analytics?.engagementTrends || analytics.engagementTrends.length === 0) && (
          <p className="text-center text-[#4a5a55] py-8">No data available yet</p>
        )}
      </Card>

      {/* Key Insights */}
      <Card className="p-6 border-[#DCE5E1] bg-gradient-to-br from-[#E8EEEB] to-white">
        <h2 className="text-xl font-semibold text-[#12261f] mb-4">
          Key Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-white border border-[#DCE5E1]">
            <p className="text-sm text-[#4a5a55] mb-1">Peak Activity</p>
            <p className="text-2xl font-bold text-[#12261f]">2-4 PM</p>
            <p className="text-xs text-[#4a5a55] mt-1">AEST</p>
          </div>
          <div className="p-4 rounded-lg bg-white border border-[#DCE5E1]">
            <p className="text-sm text-[#4a5a55] mb-1">Avg. Session</p>
            <p className="text-2xl font-bold text-[#12261f]">8.5 min</p>
            <p className="text-xs text-green-600 mt-1">+12% from last month</p>
          </div>
          <div className="p-4 rounded-lg bg-white border border-[#DCE5E1]">
            <p className="text-sm text-[#4a5a55] mb-1">Return Rate</p>
            <p className="text-2xl font-bold text-[#12261f]">73%</p>
            <p className="text-xs text-green-600 mt-1">+5% from last month</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
