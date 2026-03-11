"use client"

import { useState } from "react"
import { Plus, Minus, Check, Sparkles, MessageSquarePlus } from "lucide-react"
import Link from "next/link"

const ALL_TOPICS = [
  "AUD/USD", "EUR/AUD", "GBP/AUD", "NZD/AUD", "USD/CAD",
  "AUD/CNY", "AUD/JPY", "AUD/SGD", "AUD/HKD",
  "Hedging Strategy", "RBA Commentary", "US Fed", "Risk Management",
  "Commodity FX", "Emerging Markets", "Trade Finance",
]

const DEFAULT_TOPICS = ["AUD/USD", "EUR/AUD", "Hedging Strategy", "RBA Commentary"]

interface TopicPersonalizationProps {
  isLoggedIn: boolean
  selectedTopics?: string[]
  onTopicsChange?: (topics: string[]) => void
  variant?: "compact" | "full"
}

export default function TopicPersonalization({
  isLoggedIn,
  selectedTopics: controlledTopics,
  onTopicsChange,
  variant = "compact",
}: TopicPersonalizationProps) {
  const [localTopics, setLocalTopics] = useState<string[]>(DEFAULT_TOPICS)
  const [showAll, setShowAll] = useState(false)

  const selected = controlledTopics ?? localTopics
  const setSelected = (topics: string[]) => {
    if (onTopicsChange) onTopicsChange(topics)
    else setLocalTopics(topics)
  }

  const toggle = (topic: string) => {
    if (selected.includes(topic)) {
      setSelected(selected.filter((t) => t !== topic))
    } else {
      setSelected([...selected, topic])
    }
  }

  const availableTopics = ALL_TOPICS.filter((t) => !selected.includes(t))
  const visibleAvailable = showAll ? availableTopics : availableTopics.slice(0, 4)

  /* ── Compact variant (for hero/sidebar) ── */
  if (variant === "compact") {
    return (
      <div className="w-full lg:w-80 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={16} className="text-[#A8C5BA]" />
          <h3 className="text-sm font-bold text-white tracking-wide">Your Topics</h3>
        </div>

        {!isLoggedIn ? (
          <div className="text-center py-3">
            <p className="text-xs text-[#A8C5BA] mb-3 leading-relaxed">
              Log in to personalise your market insights feed.
            </p>
            <Link
              href="/login?redirect=/market-insights"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#2D6A4F] text-white text-xs font-semibold hover:bg-[#1B4332] transition-all"
            >
              Log In to Personalise
            </Link>
          </div>
        ) : (
          <>
            {/* Subscribed chips */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {selected.map((topic) => (
                <button
                  key={topic}
                  onClick={() => toggle(topic)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#2D6A4F] text-white hover:bg-[#1B4332] transition-all cursor-pointer"
                >
                  <Check size={12} />
                  {topic}
                </button>
              ))}
            </div>

            {/* Available chips */}
            {visibleAvailable.length > 0 && (
              <>
                <p className="text-[10px] uppercase tracking-wider text-[#A8C5BA]/70 font-semibold mb-2">
                  + Add Topics
                </p>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {visibleAvailable.map((topic) => (
                    <button
                      key={topic}
                      onClick={() => toggle(topic)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border border-white/20 text-white/70 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                    >
                      <Plus size={11} />
                      {topic}
                    </button>
                  ))}
                </div>
                {availableTopics.length > 4 && (
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="text-[10px] text-[#A8C5BA] hover:text-white font-medium underline underline-offset-2 cursor-pointer"
                  >
                    {showAll ? "Show less" : `+${availableTopics.length - 4} more`}
                  </button>
                )}
              </>
            )}

            {/* Request new topic */}
            <div className="mt-3 pt-3 border-t border-white/10">
              <Link
                href="/contact?subject=Topic+Request"
                className="inline-flex items-center gap-1.5 text-[11px] text-[#A8C5BA] hover:text-white transition-colors font-medium"
              >
                <MessageSquarePlus size={12} />
                Request a New Topic
              </Link>
            </div>
          </>
        )}
      </div>
    )
  }

  /* ── Full variant (for dashboard) ── */
  return (
    <div className="rounded-2xl bg-white border border-[#DCE5E1] p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={18} className="text-[#2D6A4F]" />
        <h3 className="text-base font-bold text-[#12261F]">Personalise Your Feed</h3>
      </div>

      {/* Subscribed */}
      <div className="mb-5">
        <p className="text-xs uppercase tracking-wider text-[#52796F] font-semibold mb-2">Currently Subscribed</p>
        <div className="flex flex-wrap gap-2">
          {selected.length === 0 && (
            <p className="text-sm text-[#52796F] italic">No topics selected — add some below!</p>
          )}
          {selected.map((topic) => (
            <button
              key={topic}
              onClick={() => toggle(topic)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#2D6A4F] text-white hover:bg-red-500 transition-all cursor-pointer group"
            >
              <Check size={14} className="group-hover:hidden" />
              <Minus size={14} className="hidden group-hover:block" />
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Available */}
      <div className="mb-4">
        <p className="text-xs uppercase tracking-wider text-[#52796F] font-semibold mb-2">Available Topics</p>
        <div className="flex flex-wrap gap-2">
          {availableTopics.length === 0 && (
            <p className="text-sm text-[#52796F] italic">You&apos;re subscribed to everything!</p>
          )}
          {(showAll ? availableTopics : availableTopics.slice(0, 8)).map((topic) => (
            <button
              key={topic}
              onClick={() => toggle(topic)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-[#DCE5E1] text-[#4A5A55] hover:border-[#2D6A4F] hover:text-[#2D6A4F] hover:bg-[#E8EEEB] transition-all cursor-pointer"
            >
              <Plus size={14} />
              {topic}
            </button>
          ))}
        </div>
        {availableTopics.length > 8 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="mt-2 text-xs text-[#2D6A4F] hover:underline font-medium cursor-pointer"
          >
            {showAll ? "Show less" : `Show all (${availableTopics.length})`}
          </button>
        )}
      </div>

      {/* Request */}
      <div className="pt-4 border-t border-[#E8EEEB]">
        <Link
          href="/contact?subject=Topic+Request"
          className="inline-flex items-center gap-2 text-sm text-[#2D6A4F] hover:text-[#1B4332] font-medium transition-colors"
        >
          <MessageSquarePlus size={16} />
          Request a New Topic
        </Link>
      </div>
    </div>
  )
}
