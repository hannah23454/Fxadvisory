"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react"

export default function ContentManagement() {
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState<any[]>([])
  const [showEditor, setShowEditor] = useState(false)
  const [editorForm, setEditorForm] = useState({
    id: '',
    title: '',
    content: '',
    type: 'commentary',
    visibility: 'public',
    tags: '',
    currencies: ''
  })

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      const res = await fetch('/api/content')
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

  const saveContent = async () => {
    try {
      const method = editorForm.id ? 'PUT' : 'POST'
      const res = await fetch('/api/content', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editorForm,
          tags: editorForm.tags.split(',').map(t => t.trim()),
          currencies: editorForm.currencies.split(',').map(c => c.trim())
        })
      })

      if (res.ok) {
        toast.success('Content saved successfully')
        setShowEditor(false)
        setEditorForm({ id: '', title: '', content: '', type: 'commentary', visibility: 'public', tags: '', currencies: '' })
        loadContent()
      } else {
        toast.error('Failed to save content')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const deleteContent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return

    try {
      const res = await fetch(`/api/content?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Content deleted successfully')
        loadContent()
      } else {
        toast.error('Failed to delete content')
      }
    } catch (error) {
      toast.error('An error occurred')
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#12261f] mb-2">
            Content Management
          </h1>
          <p className="text-[#4a5a55]">
            Create and manage market insights and resources
          </p>
        </div>
        <Button
          onClick={() => setShowEditor(true)}
          className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Content
        </Button>
      </div>

      {/* Content Editor */}
      {showEditor && (
        <Card className="p-6 border-[#DCE5E1]">
          <h3 className="text-lg font-semibold text-[#12261f] mb-4">
            {editorForm.id ? 'Edit Content' : 'Create New Content'}
          </h3>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={editorForm.title}
                onChange={(e) => setEditorForm({ ...editorForm, title: e.target.value })}
                placeholder="Content title"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Type</Label>
                <select
                  value={editorForm.type}
                  onChange={(e) => setEditorForm({ ...editorForm, type: e.target.value })}
                  className="w-full px-3 py-2 border border-[#DCE5E1] rounded-md"
                >
                  <option value="commentary">Commentary</option>
                  <option value="newsletter">Newsletter</option>
                  <option value="policy">Policy</option>
                  <option value="product">Product</option>
                </select>
              </div>
              <div>
                <Label>Visibility</Label>
                <select
                  value={editorForm.visibility}
                  onChange={(e) => setEditorForm({ ...editorForm, visibility: e.target.value })}
                  className="w-full px-3 py-2 border border-[#DCE5E1] rounded-md"
                >
                  <option value="public">Public</option>
                  <option value="members-only">Members Only</option>
                </select>
              </div>
            </div>
            <div>
              <Label>Content</Label>
              <Textarea
                value={editorForm.content}
                onChange={(e) => setEditorForm({ ...editorForm, content: e.target.value })}
                placeholder="Content body..."
                rows={8}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tags (comma-separated)</Label>
                <Input
                  value={editorForm.tags}
                  onChange={(e) => setEditorForm({ ...editorForm, tags: e.target.value })}
                  placeholder="market-update, analysis"
                />
              </div>
              <div>
                <Label>Currencies (comma-separated)</Label>
                <Input
                  value={editorForm.currencies}
                  onChange={(e) => setEditorForm({ ...editorForm, currencies: e.target.value })}
                  placeholder="AUD, USD, EUR"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={saveContent} className="bg-[#2D6A4F] hover:bg-[#1B4332]">
                Save Content
              </Button>
              <Button variant="outline" onClick={() => setShowEditor(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Content List */}
      <Card className="p-6 border-[#DCE5E1]">
        <div className="space-y-4">
          {content.map((item) => (
            <div
              key={item._id}
              className="flex items-start justify-between p-4 rounded-lg border border-[#DCE5E1]"
            >
              <div className="flex-1">
                <h4 className="font-semibold text-[#12261f] mb-1">{item.title}</h4>
                <p className="text-sm text-[#4a5a55] line-clamp-2 mb-2">
                  {item.content.substring(0, 150)}...
                </p>
                <div className="flex gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-[#E8EEEB] text-[#2D6A4F]">
                    {item.type}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-[#E8EEEB] text-[#2D6A4F]">
                    {item.visibility}
                  </span>
                  <span className="text-xs text-[#4a5a55]">
                    {new Date(item.publishedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteContent(item._id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
