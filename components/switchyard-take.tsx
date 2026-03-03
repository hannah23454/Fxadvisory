"use client"

import { useState } from "react"
import { Linkedin, ExternalLink, ChevronDown, ChevronUp } from "lucide-react"
import Image from "next/image"

// ─────────────────────────────────────────────
// Types — swap `posts` data source with an API
// call (e.g. LinkedIn API, CMS) in the future.
// ─────────────────────────────────────────────
export interface LinkedInPost {
  id: string
  author: {
    name: string
    title: string
    avatar: string // URL or "/images/..." path
    linkedinUrl: string
  }
  date: string
  excerpt: string
  linkedinUrl: string
  tags?: string[]
  isFeatured?: boolean
}

// ─────────────────────────────────────────────
// Static placeholder data — replace with
// real API response when LinkedIn integration
// is ready.
// ─────────────────────────────────────────────
const POSTS: LinkedInPost[] = [
  {
    id: "1",
    author: {
      name: "Michael Boulton",
      title: "Director — SwitchYard FX Advisory",
      avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Michael+Boulton&backgroundColor=12261F&fontColor=A8C5BA",
      linkedinUrl: "https://www.linkedin.com/in/",
    },
    date: "Mar 3, 2026",
    excerpt:
      "The AUD is under renewed pressure as US jobs data continues to surprise to the upside. For businesses with USD payables, now is a critical window to reassess your forward cover. Here's what we're watching this week…",
    linkedinUrl: "https://www.linkedin.com/posts/",
    tags: ["AUD/USD", "Hedging", "FX Strategy"],
    isFeatured: true,
  },
  {
    id: "2",
    author: {
      name: "James Ellery",
      title: "Head of FX Strategy — SwitchYard FX Advisory",
      avatar: "https://api.dicebear.com/9.x/initials/svg?seed=James+Ellery&backgroundColor=2D6A4F&fontColor=ffffff",
      linkedinUrl: "https://www.linkedin.com/in/",
    },
    date: "Mar 2, 2026",
    excerpt:
      "A lot of clients are asking us about CNY exposure right now. The PBOC's recent guidance suggests further yuan depreciation is on the table — here's how Australian exporters should be thinking about their RMB receivables strategy.",
    linkedinUrl: "https://www.linkedin.com/posts/",
    tags: ["CNY", "Export Strategy", "Risk Management"],
    isFeatured: true,
  },
  {
    id: "3",
    author: {
      name: "Michael Boulton",
      title: "Director — SwitchYard FX Advisory",
      avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Michael+Boulton&backgroundColor=12261F&fontColor=A8C5BA",
      linkedinUrl: "https://www.linkedin.com/in/",
    },
    date: "Feb 27, 2026",
    excerpt:
      "RBA held rates steady — the market had priced in a 30% chance of a cut. AUD spiked on the decision but quickly faded. This tells you a lot about underlying sentiment. Hedgers should not read this as a relief rally.",
    linkedinUrl: "https://www.linkedin.com/posts/",
    tags: ["RBA", "AUD"],
    isFeatured: false,
  },
  {
    id: "4",
    author: {
      name: "James Ellery",
      title: "Head of FX Strategy — SwitchYard FX Advisory",
      avatar: "https://api.dicebear.com/9.x/initials/svg?seed=James+Ellery&backgroundColor=2D6A4F&fontColor=ffffff",
      linkedinUrl: "https://www.linkedin.com/in/",
    },
    date: "Feb 24, 2026",
    excerpt:
      "Five questions every CFO should be asking their bank about FX right now. Thread 🧵 — covering policy, tenor, documentation, and pricing transparency.",
    linkedinUrl: "https://www.linkedin.com/posts/",
    tags: ["Treasury", "CFO", "Best Practice"],
    isFeatured: false,
  },
  {
    id: "5",
    author: {
      name: "Michael Boulton",
      title: "Director — SwitchYard FX Advisory",
      avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Michael+Boulton&backgroundColor=12261F&fontColor=A8C5BA",
      linkedinUrl: "https://www.linkedin.com/in/",
    },
    date: "Feb 20, 2026",
    excerpt:
      "EUR/AUD is testing the 1.68 handle for the first time since Q3 2024. If you have Euro receivables sitting unhedged, you're sitting on a meaningful FX gain — but that can reverse quickly.",
    linkedinUrl: "https://www.linkedin.com/posts/",
    tags: ["EUR/AUD", "Hedging"],
    isFeatured: false,
  },
  {
    id: "6",
    author: {
      name: "James Ellery",
      title: "Head of FX Strategy — SwitchYard FX Advisory",
      avatar: "https://api.dicebear.com/9.x/initials/svg?seed=James+Ellery&backgroundColor=2D6A4F&fontColor=ffffff",
      linkedinUrl: "https://www.linkedin.com/in/",
    },
    date: "Feb 17, 2026",
    excerpt:
      "Why vanilla forwards are still the most misunderstood product in commercial FX. Most businesses have used them — fewer understand the nuances of break costs, rollover, and mark-to-market.",
    linkedinUrl: "https://www.linkedin.com/posts/",
    tags: ["Forward Contracts", "Education"],
    isFeatured: false,
  },
  {
    id: "7",
    author: {
      name: "Michael Boulton",
      title: "Director — SwitchYard FX Advisory",
      avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Michael+Boulton&backgroundColor=12261F&fontColor=A8C5BA",
      linkedinUrl: "https://www.linkedin.com/in/",
    },
    date: "Feb 12, 2026",
    excerpt:
      "The Fed's tone at its last meeting was decidedly hawkish, and markets are now pricing just one cut in 2026. For AUD bulls, this is a headwind that will persist. We walk through the macro implications.",
    linkedinUrl: "https://www.linkedin.com/posts/",
    tags: ["USD", "Macro", "Fed"],
    isFeatured: false,
  },
  {
    id: "8",
    author: {
      name: "James Ellery",
      title: "Head of FX Strategy — SwitchYard FX Advisory",
      avatar: "https://api.dicebear.com/9.x/initials/svg?seed=James+Ellery&backgroundColor=2D6A4F&fontColor=ffffff",
      linkedinUrl: "https://www.linkedin.com/in/",
    },
    date: "Feb 8, 2026",
    excerpt:
      "Three common mistakes importers make when building an FX hedging program — and how to avoid them. Spoiler: the biggest one is not the rate, it's the tenor.",
    linkedinUrl: "https://www.linkedin.com/posts/",
    tags: ["Importers", "Best Practice"],
    isFeatured: false,
  },
]

const PAGE_SIZE = 4

// ─────────────────────────────────────────────
// PostCard — reusable for both contexts
// ─────────────────────────────────────────────
interface PostCardProps {
  post: LinkedInPost
  featured?: boolean
}

export function PostCard({ post, featured = false }: PostCardProps) {
  return (
    <article
      className={`group flex flex-col bg-white border rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-xl hover:border-[#2D6A4F] ${
        featured ? "border-[#A8C5BA] shadow-md" : "border-[#DCE5E1]"
      }`}
    >
      {featured && (
        <div className="bg-[#12261F] px-5 py-2 flex items-center gap-2">
          <Linkedin size={14} className="text-[#A8C5BA]" />
          <span className="text-[#A8C5BA] text-xs font-semibold tracking-wide uppercase">
            Featured Post
          </span>
        </div>
      )}

      <div className="p-6 flex flex-col flex-1 gap-4">
        {/* Author row */}
        <div className="flex items-center gap-3">
          <a
            href={post.author.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
            aria-label={`${post.author.name} on LinkedIn`}
          >
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              width={44}
              height={44}
              className="rounded-full ring-2 ring-[#DCE5E1] group-hover:ring-[#2D6A4F] transition"
              unoptimized
            />
          </a>
          <div className="min-w-0">
            <a
              href={post.author.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#12261F] text-sm hover:text-[#2D6A4F] transition leading-tight truncate block"
            >
              {post.author.name}
            </a>
            <p className="text-[#4A5A55] text-xs leading-tight mt-0.5 truncate">
              {post.author.title}
            </p>
          </div>
          <span className="ml-auto shrink-0 text-xs text-[#4A5A55] whitespace-nowrap">
            {post.date}
          </span>
        </div>

        {/* Excerpt */}
        <p
          className={`text-[#374A44] leading-relaxed flex-1 ${
            featured ? "text-base" : "text-sm"
          }`}
        >
          {post.excerpt}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F0F5F3] text-[#2D6A4F]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <a
          href={post.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2D6A4F] hover:text-[#12261F] transition mt-auto pt-2 border-t border-[#F0F5F3]"
        >
          <Linkedin size={15} />
          View on LinkedIn
          <ExternalLink size={13} className="ml-0.5 opacity-60" />
        </a>
      </div>
    </article>
  )
}

// ─────────────────────────────────────────────
// Main section component
// ─────────────────────────────────────────────
interface SwitchyardTakeProps {
  /**
   * Pass posts here to use real data from an API.
   * Falls back to static placeholder data when omitted.
   */
  posts?: LinkedInPost[]
}

export default function SwitchyardTake({ posts = POSTS }: SwitchyardTakeProps) {
  const featured = posts.filter((p) => p.isFeatured).slice(0, 2)
  const older = posts.filter((p) => !p.isFeatured)

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const visibleOlder = older.slice(0, visibleCount)
  const hasMore = visibleCount < older.length

  return (
    <section className="py-16 sm:py-24 bg-[#F5F7F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <Linkedin size={20} className="text-[#2D6A4F]" />
            <span className="text-sm font-semibold text-[#2D6A4F] uppercase tracking-wider">
              LinkedIn
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#12261F] text-balance leading-tight mb-3">
            SwitchYard&apos;s Take
          </h2>
          <p className="text-[#4A5A55] text-lg max-w-2xl">
            Direct perspectives from our advisors — market commentary, strategy insights, and
            professional education.
          </p>
        </div>

        {/* Featured posts — 2 up */}
        {featured.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-6 mb-14">
            {featured.map((post) => (
              <PostCard key={post.id} post={post} featured />
            ))}
          </div>
        )}

        {/* Divider */}
        {older.length > 0 && (
          <>
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-px bg-[#DCE5E1]" />
              <span className="text-xs font-semibold text-[#4A5A55] uppercase tracking-wider whitespace-nowrap">
                Earlier Posts
              </span>
              <div className="flex-1 h-px bg-[#DCE5E1]" />
            </div>

            {/* Older posts grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {visibleOlder.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {/* Load More / Show Less */}
            <div className="flex justify-center gap-3">
              {hasMore && (
                <button
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full border-2 border-[#2D6A4F] text-[#2D6A4F] font-semibold text-sm hover:bg-[#2D6A4F] hover:text-white transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F]"
                >
                  <ChevronDown size={16} />
                  Load More
                </button>
              )}
              {visibleCount > PAGE_SIZE && (
                <button
                  onClick={() => setVisibleCount(PAGE_SIZE)}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full border-2 border-gray-300 text-[#4A5A55] font-semibold text-sm hover:border-[#2D6A4F] hover:text-[#2D6A4F] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F]"
                >
                  <ChevronUp size={16} />
                  Show Less
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
