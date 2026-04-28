import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Providers } from "@/components/providers"
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
      </body>
    </html>
  )
}
