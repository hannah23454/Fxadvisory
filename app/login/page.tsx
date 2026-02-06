"use client"

import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/components/i18n/i18n"

export default function Login() {
  const { t } = useI18n()
  const router = useRouter()

  return (
    <main className="min-h-screen bg-[#f5f7f6]">
      <Header />
      
      <div className="container mx-auto px-6 py-20">
        <Card className="max-w-md mx-auto p-8 text-center">
          <h1 className="text-3xl font-bold text-[#12261f] mb-4">
            Authentication Disabled
          </h1>
          <p className="text-[#4a5a55] mb-6">
            User authentication has been temporarily disabled. Please contact us for access.
          </p>
          <Button 
            onClick={() => router.push('/contact')}
            className="bg-[#bd6908] hover:bg-[#a35a07] text-white w-full"
          >
            {t('nav_contact')}
          </Button>
        </Card>
      </div>

      <Footer />
    </main>
  )
}
