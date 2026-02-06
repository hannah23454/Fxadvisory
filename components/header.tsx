"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, X } from "lucide-react"
import { useI18n } from "@/components/i18n/i18n"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const router = useRouter()
  const { t, locale, setLocale } = useI18n()

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 50)
  }, [])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  const navItems = [
    { key: 'nav_home', path: '/' },
    { key: 'nav_about', path: '/about' },
    { key: 'nav_services', path: '/services' },
    { key: 'nav_market_insights', path: '/market-insights' },
    { key: 'nav_contact', path: '/contact' },
  ]

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white border-b border-gray-200 shadow-md"
          : "bg-[#12261F]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <Link href="/" className="shrink-0">
            <div
              className={`text-2xl font-bold transition-colors ${
                isScrolled ? "text-[#12261F]" : "text-white"
              }`}
            >
              SwitchYard
            </div>
            <div className="text-xs text-[#BD6908] font-medium">FX ADVISORY</div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8 items-center">
            {navItems.map(({ key, path }) => (
              <Link
                key={key}
                href={path}
                className={`transition text-sm font-medium ${
                  isScrolled
                    ? "text-[#4A5A55] hover:text-[#12261F]"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {t(key)}
              </Link>
            ))}

            {/* Language switcher */}
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value as any)}
              className={`text-sm rounded px-2 py-1 bg-transparent focus:outline-none focus:ring-0 ${
                isScrolled ? "text-[#12261F]" : "text-white"
              }`}
            >
              <option value="en">English</option>
              <option value="zh">中文</option>
            </select>
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex gap-3 items-center">
            <Link
              href="/contact"
              className="px-6 py-2 rounded-full bg-[#BD6908] text-white text-sm font-medium hover:bg-opacity-90"
            >
              {t('cta_book_call')}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 ${isScrolled ? "text-[#12261F]" : "text-white"}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            {navItems.map(({ key, path }) => (
              <Link
                key={key}
                href={path}
                className={`block px-4 py-2 rounded text-sm ${
                  isScrolled
                    ? "text-[#12261F] hover:bg-[#F5F7F6]"
                    : "text-white hover:bg-white/10"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t(key)}
              </Link>
            ))}

            {/* Mobile Language switcher */}
            <div className="px-4">
              <select
                value={locale}
                onChange={(e) => setLocale(e.target.value as any)}
                className="w-full text-sm rounded px-2 py-2 bg-white text-[#12261F] focus:outline-none focus:ring-0"
              >
                <option value="en">English</option>
                <option value="zh">中文</option>
              </select>
            </div>

            {/* Mobile Auth */}
            <div className="px-4 flex flex-col gap-2 mt-2">
              <Link
                href="/contact"
                className="w-full px-4 py-2 rounded-full bg-[#BD6908] text-white text-sm font-medium text-center hover:bg-opacity-90"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('cta_book_call')}
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
