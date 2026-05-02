"use client"

import { useState, useRef, useEffect } from "react"
import { Plus, Minus, Check, Sparkles, MessageSquarePlus, X, ChevronDown } from "lucide-react"
import Link from "next/link"

const ALL_TOPICS = [
  "AUD/USD", "EUR/AUD", "GBP/AUD", "NZD/AUD", "USD/CAD",
  "AUD/CNY", "AUD/JPY", "AUD/SGD", "AUD/HKD",
  "Hedging Strategy", "RBA Commentary", "US Fed", "Risk Management",
  "Commodity FX", "Emerging Markets", "Trade Finance",
]

const DEFAULT_TOPICS = ["AUD/USD", "EUR/AUD", "Hedging Strategy", "RBA Commentary"]

const ALL_CURRENCIES = [
  "AUD", "USD", "EUR", "GBP", "JPY", "CAD", "CNY", "SGD", "HKD", "NZD", "INR", "MXN"
]

const DEFAULT_CURRENCIES = ["AUD", "USD", "EUR"]

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
  const [localCurrencies, setLocalCurrencies] = useState<string[]>(DEFAULT_CURRENCIES)
  const [showAll, setShowAll] = useState(false)
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false)
  const currencyDropdownRef = useRef<HTMLDivElement>(null)

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

  const toggleCurrency = (currency: string) => {
    if (localCurrencies.includes(currency)) {
      setLocalCurrencies(localCurrencies.filter((c) => c !== currency))
    } else {
      setLocalCurrencies([...localCurrencies, currency])
    }
  }

  const removeCurrency = (currency: string) => {
    setLocalCurrencies(localCurrencies.filter((c) => c !== currency))
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (currencyDropdownRef.current && !currencyDropdownRef.current.contains(event.target as Node)) {
        setShowCurrencyDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const availableTopics = ALL_TOPICS.filter((t) => !selected.includes(t))
  const visibleAvailable = showAll ? availableTopics : availableTopics.slice(0, 4)
  const availableCurrencies = ALL_CURRENCIES.filter((c) => !localCurrencies.includes(c))

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

            {/* Currencies Section */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="relative" ref={currencyDropdownRef}>
                <button
                  onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all"
                >
                  <span className="flex items-center gap-1">
                    <Plus size={12} />
                    Add currencies to your Market commentary
                  </span>
                  <ChevronDown size={14} className={`transition-transform ${showCurrencyDropdown ? "rotate-180" : ""}`} />
                </button>

                {showCurrencyDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-[#1B4332] border border-white/20 rounded-lg shadow-lg z-50">
                    <div className="max-h-56 overflow-y-auto p-2">
                      {availableCurrencies.length === 0 ? (
                        <p className="text-[11px] text-[#A8C5BA] text-center py-3">All currencies added</p>
                      ) : (
                        availableCurrencies.map((currency) => (
                          <button
                            key={currency}
                            onClick={() => {
                              toggleCurrency(currency)
                              if (availableCurrencies.length === 1) {
                                setShowCurrencyDropdown(false)
                              }
                            }}
                            className="w-full text-left px-2.5 py-2 rounded text-[11px] font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all"
                          >
                            {currency}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Selected Currencies */}
              {localCurrencies.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {localCurrencies.map((currency) => (
                    <div
                      key={currency}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#2D6A4F] text-white"
                    >
                      {currency}
                      <button
                        onClick={() => removeCurrency(currency)}
                        className="hover:bg-white/20 rounded-full p-0.5 transition-all"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

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

      {/* Currencies Section */}
      <div className="mb-5 pt-5 border-t border-[#E8EEEB]">
        <p className="text-xs uppercase tracking-wider text-[#52796F] font-semibold mb-3">Your Currencies</p>

        {localCurrencies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {localCurrencies.map((currency) => (
              <div
                key={currency}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#2D6A4F] text-white"
              >
                {currency}
                <button
                  onClick={() => removeCurrency(currency)}
                  className="hover:bg-white/20 rounded-full p-0.5 transition-all"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="relative" ref={currencyDropdownRef}>
          <button
            onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-semibold bg-[#F5F7F6] border border-[#DCE5E1] text-[#12261F] hover:border-[#2D6A4F] hover:bg-[#E8EEEB] transition-all"
          >
            <span className="flex items-center gap-2">
              <Plus size={14} />
              Add currencies to your Market commentary
            </span>
            <ChevronDown size={16} className={`transition-transform ${showCurrencyDropdown ? "rotate-180" : ""}`} />
          </button>

          {showCurrencyDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#DCE5E1] rounded-lg shadow-lg z-50">
              <div className="max-h-56 overflow-y-auto p-2">
                {availableCurrencies.length === 0 ? (
                  <p className="text-xs text-[#52796F] text-center py-4">All currencies added</p>
                ) : (
                  availableCurrencies.map((currency) => (
                    <button
                      key={currency}
                      onClick={() => {
                        toggleCurrency(currency)
                        if (availableCurrencies.length === 1) {
                          setShowCurrencyDropdown(false)
                        }
                      }}
                      className="w-full text-left px-3 py-2.5 rounded text-sm font-medium text-[#4A5A55] hover:bg-[#E8EEEB] hover:text-[#2D6A4F] transition-all"
                    >
                      {currency}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
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
