"use client"

import { useSession, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard,
  TrendingUp,
  FileText,
  Upload,
  MessageSquare,
  Calendar,
  Settings,
  LogOut,
  Globe,
  UserCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/components/i18n/i18n"

const navigation = [
  { name: 'Dashboard',       href: '/dashboard',           icon: LayoutDashboard },
  { name: 'Market Insights', href: '/dashboard/market',    icon: TrendingUp },
  { name: 'Profile',         href: '/dashboard/profile',   icon: UserCircle },
  { name: 'Documents',       href: '/dashboard/documents', icon: FileText },
  { name: 'Trade Upload',    href: '/dashboard/trades',    icon: Upload },
  { name: 'Meetings',        href: '/dashboard/meetings',  icon: Calendar },
  { name: 'Messages',        href: '/dashboard/messages',  icon: MessageSquare },
  { name: 'Settings',        href: '/dashboard/settings',  icon: Settings },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const { locale, setLocale } = useI18n()

  // If on admin routes, render children directly (admin has its own layout)
  if (pathname?.startsWith('/dashboard/admin')) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-[#f5f7f6]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] text-white px-6 py-4 shadow-lg border-b border-[#1B4332] sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-white/10 border border-white/20">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Client Dashboard</h1>
              <p className="text-xs text-white/80">SwitchYard FX</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="relative">
              <select
                value={locale}
                onChange={(e) => setLocale(e.target.value as any)}
                className="appearance-none bg-white/10 border border-white/20 text-white text-sm rounded-lg px-3 py-2 pr-8 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 cursor-pointer"
              >
                <option value="en" className="bg-[#1B4332] text-white">English</option>
                <option value="zh" className="bg-[#1B4332] text-white">中文</option>
              </select>
              <Globe className="w-4 h-4 text-white/70 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/10 border border-white/20">
              <div className="w-8 h-8 rounded-full bg-[#DCE5E1] flex items-center justify-center text-[#2D6A4F] font-bold text-sm">
                {session?.user?.name?.[0] || 'U'}
              </div>
              <span className="text-sm font-medium">{session?.user?.name}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="text-white hover:bg-red-500/20 border border-white/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-72 min-h-[calc(100vh-73px)] bg-white border-r border-[#DCE5E1] sticky top-[73px]">
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-all duration-200
                    ${isActive 
                      ? 'bg-[#2D6A4F] text-white shadow-md' 
                      : 'text-[#4a5a55] hover:bg-[#E8EEEB]'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  <span className="font-medium text-sm">{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 max-w-[1400px]">
          {children}
        </main>
      </div>
    </div>
  )
}
