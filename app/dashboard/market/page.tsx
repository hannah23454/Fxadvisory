"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, TrendingUp, Eye, Calendar } from "lucide-react"
import Link from "next/link"

export default function MarketPage() {
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState<any[]>([])

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      const res = await fetch('/api/content?type=commentary')
      if (res.ok) {
        const data = await res.json()
        setContent(data)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error loading content:', error)
      setLoading(false)
    }
  }

  const trackView = async (articleId: string) => {
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'view',
        resourceType: 'article',
        resourceId: articleId,
        metadata: {}
      })
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#2D6A4F]" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold text-[#12261f] mb-2">
          Market Insights
        </h1>
        <p className="text-[#4a5a55]">
          Professional FX market analysis and commentary
        </p>
      </div>

      {/* Featured Article */}
      {content.length > 0 && (
        <Card className="p-6 border-[#2D6A4F] border-2 bg-gradient-to-br from-white to-[#E8EEEB]">
          <div className="flex items-start justify-between mb-4">
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#2D6A4F] text-white">
              Featured
            </span>
            <span className="text-sm text-[#4a5a55]">
              {new Date(content[0].publishedAt).toLocaleDateString()}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-[#12261f] mb-3">
            {content[0].title}
          </h2>
          <p className="text-[#4a5a55] mb-4 line-clamp-3">
            {content[0].content.substring(0, 250)}...
          </p>
          <div className="flex items-center gap-3 mb-4">
            {content[0].currencies?.map((currency: string) => (
              <span key={currency} className="text-xs px-2 py-1 rounded-full bg-white border border-[#DCE5E1] text-[#2D6A4F]">
                {currency}
              </span>
            ))}
          </div>
          <Button 
            onClick={() => trackView(content[0]._id)}
            className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white"
          >
            <Eye className="w-4 h-4 mr-2" />
            Read Full Article
          </Button>
        </Card>
      )}

      {/* Recent Insights */}
      <div>
        <h2 className="text-xl font-semibold text-[#12261f] mb-4">
          Recent Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {content.slice(1).map((article) => (
            <Card key={article._id} className="p-6 border-[#DCE5E1] hover:border-[#2D6A4F] hover:shadow-lg transition-all">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-[#4a5a55]" />
                <span className="text-sm text-[#4a5a55]">
                  {new Date(article.publishedAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-[#12261f] mb-2">
                {article.title}
              </h3>
              <p className="text-sm text-[#4a5a55] mb-4 line-clamp-3">
                {article.content.substring(0, 150)}...
              </p>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {article.tags?.slice(0, 2).map((tag: string) => (
                    <span key={tag} className="text-xs px-2 py-1 rounded-full bg-[#E8EEEB] text-[#2D6A4F]">
                      {tag}
                    </span>
                  ))}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => trackView(article._id)}
                  className="text-[#2D6A4F] hover:bg-[#E8EEEB]"
                >
                  Read More →
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {content.length === 0 && (
          <Card className="p-12 border-[#DCE5E1] text-center">
            <TrendingUp className="w-12 h-12 text-[#4a5a55] mx-auto mb-4 opacity-50" />
            <p className="text-[#4a5a55]">No market insights available yet</p>
          </Card>
        )}
      </div>

      {/* Newsletter Signup */}
      <Card className="p-6 border-[#DCE5E1] bg-gradient-to-br from-[#2D6A4F] to-[#1B4332] text-white">
        <h3 className="text-xl font-semibold mb-2">
          Get Market Updates
        </h3>
        <p className="text-white/80 mb-4">
          Stay ahead with weekly FX market insights delivered to your inbox
        </p>
        <Link href="/dashboard/settings">
          <Button variant="secondary" className="bg-white text-[#2D6A4F] hover:bg-[#E8EEEB]">
            Manage Notifications
          </Button>
        </Link>
      </Card>
    </div>
  )
}
