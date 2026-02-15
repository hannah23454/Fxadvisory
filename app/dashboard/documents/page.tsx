"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, FileText, Download, Search, Filter } from "lucide-react"

export default function DocumentsPage() {
  const [loading, setLoading] = useState(true)
  const [documents, setDocuments] = useState<any[]>([])
  const [filteredDocs, setFilteredDocs] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")

  useEffect(() => {
    loadDocuments()
  }, [])

  useEffect(() => {
    filterDocuments()
  }, [searchQuery, filterType, documents])

  const loadDocuments = async () => {
    try {
      const res = await fetch('/api/content?type=policy')
      if (res.ok) {
        const data = await res.json()
        setDocuments(data)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error loading documents:', error)
      setLoading(false)
    }
  }

  const filterDocuments = () => {
    let filtered = documents

    if (filterType !== 'all') {
      filtered = filtered.filter(doc => doc.type === filterType)
    }

    if (searchQuery) {
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredDocs(filtered)
  }

  const handleDownload = async (doc: any) => {
    // Track download event
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'download',
        resourceType: 'document',
        resourceId: doc._id,
        metadata: { title: doc.title }
      })
    })

    // In production, this would download the actual file
    alert(`Downloading: ${doc.title}`)
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
          Documents & Resources
        </h1>
        <p className="text-[#4a5a55]">
          Hedging policies, guides, and FX resources
        </p>
      </div>

      {/* Search and Filter */}
      <Card className="p-4 border-[#DCE5E1]">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#4a5a55]" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterType === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterType('all')}
              className={filterType === 'all' ? 'bg-[#2D6A4F] hover:bg-[#1B4332]' : 'border-[#DCE5E1]'}
            >
              All
            </Button>
            <Button
              variant={filterType === 'policy' ? 'default' : 'outline'}
              onClick={() => setFilterType('policy')}
              className={filterType === 'policy' ? 'bg-[#2D6A4F] hover:bg-[#1B4332]' : 'border-[#DCE5E1]'}
            >
              Policies
            </Button>
            <Button
              variant={filterType === 'product' ? 'default' : 'outline'}
              onClick={() => setFilterType('product')}
              className={filterType === 'product' ? 'bg-[#2D6A4F] hover:bg-[#1B4332]' : 'border-[#DCE5E1]'}
            >
              Products
            </Button>
          </div>
        </div>
      </Card>

      {/* Document Grid */}
      {filteredDocs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDocs.map((doc) => (
            <Card key={doc._id} className="p-6 border-[#DCE5E1] hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#2D6A4F]/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-[#2D6A4F]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#12261f] mb-2">
                    {doc.title}
                  </h3>
                  <p className="text-sm text-[#4a5a55] line-clamp-3 mb-4">
                    {doc.content.substring(0, 150)}...
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {doc.tags?.slice(0, 2).map((tag: string) => (
                        <span key={tag} className="text-xs px-2 py-1 rounded-full bg-[#E8EEEB] text-[#2D6A4F]">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleDownload(doc)}
                      className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 border-[#DCE5E1] text-center">
          <FileText className="w-12 h-12 text-[#4a5a55] mx-auto mb-4 opacity-50" />
          <p className="text-[#4a5a55]">No documents found</p>
          <p className="text-sm text-[#4a5a55] mt-2">
            Try adjusting your search or filter
          </p>
        </Card>
      )}

      {/* Featured Resources */}
      <Card className="p-6 border-[#DCE5E1] bg-gradient-to-br from-[#E8EEEB] to-white">
        <h3 className="text-lg font-semibold text-[#12261f] mb-4">
          Popular Resources
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg border border-[#DCE5E1] bg-white">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-[#2D6A4F]" />
              <span className="text-sm font-medium text-[#12261f]">
                FX Hedging Policy Template
              </span>
            </div>
            <Button size="sm" variant="ghost" className="text-[#2D6A4F]">
              View
            </Button>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border border-[#DCE5E1] bg-white">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-[#2D6A4F]" />
              <span className="text-sm font-medium text-[#12261f]">
                Forward Contract Guide
              </span>
            </div>
            <Button size="sm" variant="ghost" className="text-[#2D6A4F]">
              View
            </Button>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border border-[#DCE5E1] bg-white">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-[#2D6A4F]" />
              <span className="text-sm font-medium text-[#12261f]">
                Currency Option Strategies
              </span>
            </div>
            <Button size="sm" variant="ghost" className="text-[#2D6A4F]">
              View
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
