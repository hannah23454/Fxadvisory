import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import SupabaseProvider from "@/components/supabase-provider"
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { I18nProvider } from "@/components/i18n/i18n"

export const metadata: Metadata = {
  title: "SwitchYard FX - Corporate FX Solutions for CFOs",
  description: "Manage FX risk with confidence. Tailored solutions for mid-market CFOs and treasury professionals.",
  generator: "v0.app",
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const cookieStore = await cookies()
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() { return cookieStore.getAll() },
      setAll(cookiesToSet) { try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set({ name, value, ...options })) } catch {} },
    }
  })
  const { data: { session } } = await supabase.auth.getSession()

  return (
    <html lang="en">
      <body className={`antialiased`} suppressHydrationWarning>
        <I18nProvider>
          <SupabaseProvider initialSession={session}>{children}</SupabaseProvider>
        </I18nProvider>
        <Analytics />
      </body>
    </html>
  )
}
