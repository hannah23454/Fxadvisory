import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { I18nProvider } from "@/components/i18n/i18n"

export const metadata: Metadata = {
  title: "SwitchYard FX - Corporate FX Solutions for CFOs",
  description: "Manage FX risk with confidence. Tailored solutions for mid-market CFOs and treasury professionals.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`antialiased`} suppressHydrationWarning>
        <I18nProvider>
          {children}
        </I18nProvider>
        <Analytics />
      </body>
    </html>
  )
}
