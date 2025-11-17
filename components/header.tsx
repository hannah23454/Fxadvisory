"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import { User } from "@supabase/supabase-js" // Import Supabase User type

/**
 * Define a custom type for the user state for better type safety.
 * This ensures 'user' is always a Supabase User object or null.
 */
type CurrentUser = User | null

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [user, setUser] = useState<CurrentUser>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [goToDashboard, setGoToDashboard] = useState(false)
  const router = useRouter()

  // --- Utility Functions ---

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 50)
  }, [])

  const checkAdminStatus = useCallback((currentUser: CurrentUser) => {
    const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",") || []
    return currentUser?.email ? adminEmails.includes(currentUser.email) : false
  }, [])

  // --- Effects ---

  // 1. Scroll detection
  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  // 2. Load current user and listen for auth changes
  useEffect(() => {
    const loadUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const currentUser = session?.user ?? null
      setUser(currentUser)
      setIsAdmin(checkAdminStatus(currentUser))
    }

    loadUser()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      setIsAdmin(checkAdminStatus(currentUser))
    })

    return () => listener.subscription.unsubscribe()
  }, [checkAdminStatus])

  // 3. Redirect handler
  useEffect(() => {
    if (goToDashboard) {
      const path = isAdmin ? "/dashboard/admin" : "/dashboard/user"
      router.push(path)
      setGoToDashboard(false)
    }
  }, [goToDashboard, isAdmin, router])

  // --- Handlers ---

  const handleDashboardClick = () => {
    setMobileMenuOpen(false)
    setGoToDashboard(true) // Triggers redirect via useEffect
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh() // Force UI update
    router.push("/")
  }

  // User name safe fallback
  const userName =
    user?.user_metadata?.full_name?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "User"

  // --- Render ---

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
          <nav className="hidden md:flex gap-8">
            {["Home", "About", "Services", "Market Insights", "Contact"].map(
              (item) => {
                const path =
                  item === "Home"
                    ? "/"
                    : "/" + item.toLowerCase().replace(" ", "-")
                return (
                  <Link
                    key={item}
                    href={path}
                    className={`transition text-sm font-medium ${
                      isScrolled
                        ? "text-[#4A5A55] hover:text-[#12261F]"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    {item}
                  </Link>
                )
              }
            )}
          </nav>

          {/* Desktop Auth - Separated Buttons (New Requirement) */}
          <div className="hidden md:flex gap-3 items-center">
            {user ? (
              <>
                {/* 1. User Name/Welcome Text */}
                <div
                  className={`text-sm font-medium pr-2 ${
                    isScrolled ? "text-[#12261F]" : "text-white"
                  }`}
                >
                  Welcome, **{userName}**
                </div>

                {/* 2. Dashboard Button */}
                <button
                  onClick={handleDashboardClick}
                  className={`px-4 py-2 rounded-full transition text-sm font-medium flex items-center gap-1 border ${
                    isScrolled
                      ? "text-[#12261F] border-[#12261F] hover:bg-[#F5F7F6]"
                      : "text-white border-white hover:bg-white/10"
                  }`}
                >
                  <LayoutDashboard size={16} /> Dashboard
                </button>

                {/* 3. Logout Button */}
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 rounded-full transition text-sm font-medium flex items-center gap-1 bg-red-600 text-white hover:bg-red-700"
                >
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <>
                {/* Unauthenticated Links */}
                <Link
                  href="/login"
                  className={`px-6 py-2 rounded-full border text-sm font-medium transition ${
                    isScrolled
                      ? "text-[#12261F] border-[#12261F] hover:bg-[#F5F7F6]"
                      : "text-white border-white hover:bg-white/10"
                  }`}
                >
                  Login
                </Link>

                <Link
                  href="/contact"
                  className="px-6 py-2 rounded-full bg-[#BD6908] text-white text-sm font-medium hover:bg-opacity-90"
                >
                  Book a Call
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 ${
              isScrolled ? "text-[#12261F]" : "text-white"
            }`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            {["Home", "About", "Services", "Market Insights", "Contact"].map(
              (item) => {
                const path =
                  item === "Home"
                    ? "/"
                    : "/" + item.toLowerCase().replace(" ", "-")

                return (
                  <Link
                    key={item}
                    href={path}
                    className={`block px-4 py-2 rounded text-sm ${
                      isScrolled
                        ? "text-[#12261F] hover:bg-[#F5F7F6]"
                        : "text-white hover:bg-white/10"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item}
                  </Link>
                )
              }
            )}

            {/* Mobile Auth */}
            {user ? (
              <>
                <div className="px-4 py-2 border-t mt-2 pt-4">
                  <p
                    className={`text-xs font-medium ${
                      isScrolled ? "text-[#4A5A55]" : "text-gray-400"
                    }`}
                  >
                    Logged in as
                  </p>
                  <p
                    className={`text-sm font-medium ${
                      isScrolled ? "text-[#12261F]" : "text-white"
                    }`}
                  >
                    {user?.user_metadata?.full_name || userName}
                  </p>
                </div>

                <button
                  onClick={handleDashboardClick}
                  className={`w-full px-4 py-2 rounded text-sm flex items-center gap-2 ${
                    isScrolled
                      ? "text-[#12261F] hover:bg-[#F5F7F6]"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  <LayoutDashboard size={16} /> Dashboard
                </button>

                <button
                  onClick={handleSignOut}
                  className="w-full px-4 py-2 rounded text-sm text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`block w-full px-4 py-2 rounded text-sm text-center border mt-4 ${
                    isScrolled
                      ? "text-[#12261F] border-[#12261F] hover:bg-[#F5F7F6]"
                      : "text-white border-white hover:bg-white/10"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>

                <Link
                  href="/contact"
                  className="w-full px-6 py-2 rounded-full bg-[#BD6908] text-white text-sm font-medium block text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Book a Call
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
      
    </header>
  )
}