"use client"


import { SessionProvider } from "next-auth/react"
import { I18nProvider } from "@/components/context/i18n/i18n"
import { CurrencyProvider } from "@/components/context/currency-context"
import { SiteSettingsProvider } from "@/components/context/site-settings/site-settings"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider
      refetchInterval={5 * 60}
      refetchOnWindowFocus={true}
    >
      <CurrencyProvider>
        <I18nProvider>
          <SiteSettingsProvider>
            {children}
          </SiteSettingsProvider>
        </I18nProvider>
      </CurrencyProvider>
    </SessionProvider>
  )
}
