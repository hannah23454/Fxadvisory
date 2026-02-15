"use client"

import { useSession, signOut } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { useEffect } from "react"
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  BarChart3, 
  Upload,
  Calendar,
  MessageSquare,
  Settings,
  LogOut,
  Shield,
  Globe
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/components/i18n/i18n"

const navigation = [
  { name: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
  { name: 'User Management', href: '/dashboard/admin/users', icon: Users },
  { name: 'Meeting Requests', href: '/dashboard/admin/meetings', icon: Calendar },
  { name: 'Messages', href: '/dashboard/admin/messages', icon: MessageSquare },
  { name: 'Content Management', href: '/dashboard/admin/content', icon: FileText },
  { name: 'Analytics', href: '/dashboard/admin/analytics', icon: BarChart3 },
  { name: 'Trade Oversight', href: '/dashboard/admin/trades', icon: Upload },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const { locale, setLocale } = useI18n()

  useEffect(() => {
    if (status === 'authenticated' && (session?.user as any)?.role !== 'admin') {
      router.push('/dashboard')
    }
  }, [status, session, router])

  if (status === 'loading') {
    return <div className="min-h-screen bg-[#f5f7f6] flex items-center justify-center">
      <p>Loading...</p>
    </div>
  }

  if ((session?.user as any)?.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-[#f5f7f6]">
      {/* Admin Header */}
      <header className="bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] text-white px-6 py-4 shadow-lg border-b border-[#1B4332] sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-white/10 border border-white/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/90 text-amber-900 text-xs font-semibold">
                  ADMIN
                </span>
              </div>
              <p className="text-xs text-white/80">SwitchYard FX Control Center</p>
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
                {session?.user?.name?.[0] || 'A'}
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
                  <item.icon className={`w-5 h-5 shrink-0`} />
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
