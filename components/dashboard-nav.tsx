"use client"

import Link from "next/link"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardNav() {
  return (
    <header className="bg-[#12261f] text-white border-b border-[#1a3a2f] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="font-bold text-xl">
          SwitchYard <span className="text-[#bd6908]">Treasury</span>
        </Link>
        <nav className="hidden md:flex gap-6 text-sm">
          <Link href="/dashboard" className="hover:text-[#bd6908] transition">
            Dashboard
          </Link>
          <Link href="/dashboard/profile" className="hover:text-[#bd6908] transition">
            Profile
          </Link>
          <Link href="/dashboard/documents" className="hover:text-[#bd6908] transition">
            Documents
          </Link>
          <Link href="/dashboard/settings" className="hover:text-[#bd6908] transition">
            Settings
          </Link>
        </nav>
        <Button variant="ghost" className="text-white hover:bg-[#0f201a] gap-2">
          <LogOut size={18} />
          <span className="hidden sm:inline">Sign Out</span>
        </Button>
      </div>
    </header>
  )
}
