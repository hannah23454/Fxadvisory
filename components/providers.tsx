"use client"

import { SessionProvider } from "next-auth/react"
import { I18nProvider } from "@/components/i18n/i18n"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider
      refetchInterval={5 * 60}
      refetchOnWindowFocus={true}
    >
      <I18nProvider>
        {children}
      </I18nProvider>
    </SessionProvider>
  )
}
