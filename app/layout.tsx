import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"
import "./globals.css"
import { Providers } from "@/components/layout/providers"
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: "SwitchYard FX - Corporate FX Solutions for CFOs",
  description: "Manage FX risk with confidence. Tailored solutions for mid-market CFOs and treasury professionals.",
  generator: "v0.app",
  icons: {
    icon: "/logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`antialiased`} suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
        <Toaster />
        <Analytics />
        <Script
          src="https://switchyard-fx-chatbot-production.up.railway.app/widget/switchyard-fx-chat.js"
          integrity="sha384-PXchUd5FCS88CLKZSNb6hoRXovqBdXk+DfqSTzNWutEd4DFvZscaRhjlZzsx1VPF"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
