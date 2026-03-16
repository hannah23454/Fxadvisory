"use client"

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Upload, FileText, Loader2, CheckCircle2, AlertCircle, Download } from "lucide-react"
import HedgeReportChart from "@/components/hedge-report-chart"

export default function TradesPage() {
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'hedge' | 'competitor') => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      // In production, upload to S3 or similar
      const fileName = file.name
      const fileUrl = `/uploads/${fileName}` // Mock URL

      const res = await fetch('/api/trades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName,
          fileUrl,
          uploadType: type,
          trades: []
        })
      })

      if (res.ok) {
        toast.success('Trade file uploaded successfully')
        loadTrades()
      } else {
        toast.error('Failed to upload trade file')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('An error occurred during upload')
    }
    setUploading(false)
    e.target.value = '' // Reset input
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
          Trade Upload
        </h1>
        <p className="text-[#4a5a55]">
          Upload your hedge trades or competitor deals for analysis
        </p>
      </div>

      {/* Hedge Report Chart */}
      <div className="max-w-xl">
        <HedgeReportChart />
      </div>

      {/* Upload Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 border-[#DCE5E1]">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-[#2D6A4F]/10 flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-[#2D6A4F]" />
            </div>
            <h3 className="text-xl font-semibold text-[#12261f] mb-2">
              Upload Hedge Trades
            </h3>
            <p className="text-sm text-[#4a5a55] mb-6">
              Upload your previous hedge trades for portfolio analysis
            </p>
            <label htmlFor="hedge-upload">
              <Button 
                disabled={uploading}
                className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white w-full cursor-pointer"
                onClick={() => document.getElementById('hedge-upload')?.click()}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Select File
                  </>
                )}
              </Button>
            </label>
            <input
              id="hedge-upload"
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={(e) => handleFileUpload(e, 'hedge')}
              className="hidden"
            />
            <p className="text-xs text-[#4a5a55] mt-2">
              Accepts CSV, Excel files
            </p>
          </div>
        </Card>

        <Card className="p-6 border-[#DCE5E1]">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-[#52796F]/10 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-[#52796F]" />
            </div>
            <h3 className="text-xl font-semibold text-[#12261f] mb-2">
              Upload Competitor Trades
            </h3>
            <p className="text-sm text-[#4a5a55] mb-6">
              Compare competitor pricing against our rates
            </p>
            <label htmlFor="competitor-upload">
              <Button 
                disabled={uploading}
                variant="outline"
                className="border-[#DCE5E1] hover:bg-[#E8EEEB] w-full cursor-pointer"
                onClick={() => document.getElementById('competitor-upload')?.click()}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Select File
                  </>
                )}
              </Button>
            </label>
            <input
              id="competitor-upload"
              type="file"
              accept=".csv,.xlsx,.xls,.pdf"
              onChange={(e) => handleFileUpload(e, 'competitor')}
              className="hidden"
            />
            <p className="text-xs text-[#4a5a55] mt-2">
              Accepts CSV, Excel, PDF files
            </p>
          </div>
        </Card>
      </div>

      {/* Upload History */}
      <Card className="p-6 border-[#DCE5E1]">
        <h2 className="text-xl font-semibold text-[#12261f] mb-4">
          Upload History
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
                        {new Date(trade.createdAt).toLocaleDateString()}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        trade.uploadType === 'hedge' 
                          ? 'bg-[#2D6A4F]/10 text-[#2D6A4F]' 
                          : 'bg-[#52796F]/10 text-[#52796F]'
                      }`}>
                        {trade.uploadType === 'hedge' ? 'Hedge Trade' : 'Competitor Trade'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {trade.status === 'completed' && trade.bracketGroupSubmitted ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="text-sm font-medium">Submitted to BracketGroup</span>
                    </div>
                  ) : trade.status === 'processing' ? (
                    <div className="flex items-center gap-2 text-[#4a5a55]">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="text-sm">Processing...</span>
                    </div>
                  ) : trade.status === 'error' ? (
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertCircle className="w-5 h-5" />
                      <span className="text-sm">Error</span>
                    </div>
                  ) : (
                    <span className="text-sm text-[#4a5a55]">Pending</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Upload className="w-12 h-12 text-[#4a5a55] mx-auto mb-4 opacity-50" />
            <p className="text-[#4a5a55]">No trades uploaded yet</p>
            <p className="text-sm text-[#4a5a55] mt-2">
              Start by uploading your hedge or competitor trades above
            </p>
          </div>
        )}
      </Card>

      {/* BracketGroup Info */}
      <Card className="p-6 border-[#DCE5E1] bg-gradient-to-br from-[#E8EEEB] to-white">
        <h3 className="text-lg font-semibold text-[#12261f] mb-2">
          Direct BracketGroup Integration
        </h3>
        <p className="text-sm text-[#4a5a55] mb-4">
          All uploaded trades are automatically submitted to BracketGroup for comprehensive analysis and benchmarking.
        </p>
        <Button variant="outline" className="border-[#2D6A4F] text-[#2D6A4F] hover:bg-[#2D6A4F] hover:text-white">
          Learn More About BracketGroup
        </Button>
      </Card>
    </div>
  )
}
