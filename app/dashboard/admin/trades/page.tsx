"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, FileText, CheckCircle2, AlertCircle, Download } from "lucide-react"

export default function TradesOversight() {
  const [loading, setLoading] = useState(true)
  const [trades, setTrades] = useState<any[]>([])

  useEffect(() => {
    loadTrades()
  }, [])

  const loadTrades = async () => {
    try {
      const res = await fetch('/api/trades')
      if (res.ok) {
        const data = await res.json()
        setTrades(data)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error loading trades:', error)
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
          Trade Oversight
        </h1>
        <p className="text-[#4a5a55]">
          Monitor all trade uploads and BracketGroup submissions
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-[#DCE5E1]">
          <p className="text-sm text-[#4a5a55] mb-1">Total Uploads</p>
          <p className="text-3xl font-bold text-[#12261f]">{trades.length}</p>
        </Card>
        <Card className="p-4 border-[#DCE5E1]">
          <p className="text-sm text-[#4a5a55] mb-1">Submitted</p>
          <p className="text-3xl font-bold text-green-600">
            {trades.filter(t => t.bracketGroupSubmitted).length}
          </p>
        </Card>
        <Card className="p-4 border-[#DCE5E1]">
          <p className="text-sm text-[#4a5a55] mb-1">Processing</p>
          <p className="text-3xl font-bold text-blue-600">
            {trades.filter(t => t.status === 'processing').length}
          </p>
        </Card>
        <Card className="p-4 border-[#DCE5E1]">
          <p className="text-sm text-[#4a5a55] mb-1">Errors</p>
          <p className="text-3xl font-bold text-red-600">
            {trades.filter(t => t.status === 'error').length}
          </p>
        </Card>
      </div>

      {/* Trades List */}
      <Card className="p-6 border-[#DCE5E1]">
        <h2 className="text-xl font-semibold text-[#12261f] mb-4">
          All Trade Uploads
        </h2>
        {trades.length > 0 ? (
          <div className="space-y-3">
            {trades.map((trade) => (
              <div
                key={trade._id}
                className="flex items-center justify-between p-4 rounded-lg border border-[#DCE5E1] hover:border-[#2D6A4F] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <FileText className="w-8 h-8 text-[#2D6A4F]" />
                  <div>
                    <h4 className="font-medium text-[#12261f]">{trade.fileName}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-[#4a5a55]">
                        User ID: {trade.userId?.toString().substring(0, 8)}...
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        trade.uploadType === 'hedge'
                          ? 'bg-[#2D6A4F]/10 text-[#2D6A4F]'
                          : 'bg-[#52796F]/10 text-[#52796F]'
                      }`}>
                        {trade.uploadType === 'hedge' ? 'Hedge' : 'Competitor'}
                      </span>
                      <span className="text-xs text-[#4a5a55]">
                        {new Date(trade.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {trade.status === 'completed' && trade.bracketGroupSubmitted ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="text-sm font-medium">Submitted</span>
                    </div>
                  ) : trade.status === 'processing' ? (
                    <div className="flex items-center gap-2 text-blue-600">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="text-sm">Processing</span>
                    </div>
                  ) : trade.status === 'error' ? (
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertCircle className="w-5 h-5" />
                      <span className="text-sm">Error</span>
                    </div>
                  ) : (
                    <span className="text-sm text-[#4a5a55]">Pending</span>
                  )}
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-[#4a5a55] mx-auto mb-4 opacity-50" />
            <p className="text-[#4a5a55]">No trades uploaded yet</p>
          </div>
        )}
      </Card>

      {/* BracketGroup Integration */}
      <Card className="p-6 border-[#DCE5E1] bg-gradient-to-br from-[#E8EEEB] to-white">
        <h3 className="text-lg font-semibold text-[#12261f] mb-2">
          BracketGroup Integration Status
        </h3>
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <span className="text-sm font-medium text-green-600">Active & Connected</span>
        </div>
        <p className="text-sm text-[#4a5a55] mb-4">
          All trade uploads are automatically forwarded to BracketGroup for analysis. 
          Submissions typically process within 2-3 minutes.
        </p>
        <Button variant="outline" className="border-[#2D6A4F] text-[#2D6A4F]">
          View BracketGroup Dashboard
        </Button>
      </Card>
    </div>
  )
}
