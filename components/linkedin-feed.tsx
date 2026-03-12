"use client"

import { useEffect, useState } from "react"
import { Linkedin, ExternalLink, User } from "lucide-react"
import Image from "next/image"

interface LinkedInPost {
  id: string
  title: string
  caption: string
  imageUrl: string | null
  date: string
  status: string
  person: string
  url: string | null
}

function formatDate(dateStr: string): string {
  if (!dateStr) return ""
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })
}

function truncate(text: string, maxLen = 240): string {
  if (!text) return ""
  if (text.length <= maxLen) return text
  return text.slice(0, maxLen).trimEnd() + "…"
}

/** Convert a Google Drive view link to a thumbnail URL, or return null for non-image URLs */
function resolveImageUrl(url: string | null): string | null {
  if (!url) return null
  // Convert Google Drive view links to thumbnail format
  const driveMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)\//)
  if (driveMatch) {
    return `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w800`
  }
  // Only show if it looks like a direct image URL
  if (/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i.test(url)) return url
  if (url.startsWith("https://images.unsplash.com")) return url
  return null
}

function PostCard({ post }: { post: LinkedInPost }) {
  const [expanded, setExpanded] = useState(false)
  const imageUrl = resolveImageUrl(post.imageUrl)
  const short = truncate(post.caption)
  const needsExpand = post.caption.length > 240

  return (
    <article
      className={`flex flex-col rounded-2xl bg-white border border-[#DCE5E1] overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full ${post.url ? "cursor-pointer" : ""}`}
      onClick={() => { if (post.url) window.open(post.url, "_blank", "noopener,noreferrer") }}
    >
      {/* Image */}
      {imageUrl && (
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      )}

      <div className="flex flex-col flex-1 p-6">
        {/* Author + date row */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-full bg-[#0A66C2] flex items-center justify-center shrink-0">
            <Linkedin size={16} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-[#12261F]">{post.person}</div>
            <div className="text-xs text-[#52796F]">{formatDate(post.date)}</div>
          </div>
          <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#E8EEEB] text-[#2D6A4F]">
            <User size={10} /> Market Update
          </span>
        </div>

        {/* Title */}
        {post.title && (
          <h3 className="text-base font-bold text-[#12261F] mb-2 leading-snug">{post.title}</h3>
        )}

        {/* Caption */}
        <p className="text-sm text-[#4A5A55] leading-relaxed flex-1 whitespace-pre-line">
          {expanded ? post.caption : short}
        </p>

        {needsExpand && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 text-xs font-semibold text-[#2D6A4F] hover:underline cursor-pointer self-start"
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-[#E8EEEB] flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0A66C2]">
            <Linkedin size={12} />
            LinkedIn Post
          </span>
          {post.url && (
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#0A66C2] hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              View on LinkedIn <ExternalLink size={11} />
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

export default function LinkedInFeed() {
  const [posts, setPosts] = useState<LinkedInPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch("/api/airtable/linkedin")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPosts(data.slice(0, 6))
        } else {
          setError(true)
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  // Don't render section if permanently errored with no posts
  if (!loading && error && posts.length === 0) return null

  return (
    <section className="py-20 md:py-24 bg-[#F5F7F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#0A66C2]/10 text-[#0A66C2] mb-4">
              <Linkedin size={14} />
              Market Communications
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#12261F] mb-3">
              From Our LinkedIn
            </h2>
            <p className="text-[#4A5A55] text-lg max-w-2xl">
              Latest market insights and commentary shared by the SwitchYard team.
            </p>
          </div>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(n => (
              <div key={n} className="rounded-2xl bg-white border border-[#DCE5E1] h-64 animate-pulse" />
            ))}
          </div>
        )}

        {/* Posts grid */}
        {!loading && posts.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
