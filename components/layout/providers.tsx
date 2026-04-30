"use client"


import { SessionProvider } from "next-auth/react"
import { I18nProvider } from "@/components/context/i18n/i18n"
import { CurrencyProvider } from "@/components/context/currency-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider
      refetchInterval={5 * 60}
      refetchOnWindowFocus={true}
    >
      <CurrencyProvider>
        <I18nProvider>
          {children}
        </I18nProvider>
      </CurrencyProvider>
    </SessionProvider>
  )
}
