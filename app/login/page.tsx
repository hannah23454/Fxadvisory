"use client"

import { useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useI18n } from "@/components/i18n/i18n"
import { AlertCircle, Loader2, Eye, EyeOff } from "lucide-react"

export const dynamic = 'force-dynamic';

function LoginForm() {
  const { t } = useI18n()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
        setLoading(false)
      } else {
        // Check user role and redirect accordingly
        const response = await fetch('/api/auth/session')
        const session = await response.json()
        
        const isAdmin = session?.user?.role === 'admin'
        const defaultRedirect = isAdmin ? '/dashboard/admin' : '/dashboard'
        const redirect = searchParams.get('redirect') || defaultRedirect
        
        // Use window.location.href for hard navigation to ensure session cookie is set
        window.location.href = redirect
      }
    } catch (err) {
      setError("An unexpected error occurred")
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f7f6]">
      <Header />
      
      <div className="container mx-auto px-6 py-20">
        <Card className="max-w-md mx-auto p-8">
          <h1 className="text-3xl font-bold text-[#12261f] mb-2">
            Welcome Back
          </h1>
          <p className="text-[#4a5a55] mb-6">
            Sign in to access your FX advisory dashboard
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a5a55] hover:text-[#12261f] transition"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <div className="mt-2 text-right">
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-[#2D6A4F] hover:text-[#1B4332] font-medium"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button 
              type="submit"
              disabled={loading}
              className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-[#4a5a55]">
              Don't have an account?{" "}
              <Link 
                href="/register" 
                className="text-[#2D6A4F] hover:text-[#1B4332] font-medium"
              >
                Register here
              </Link>
            </p>
          </div>

          <div className="mt-4 pt-6 border-t border-[#DCE5E1] text-center">
            <p className="text-xs text-[#4a5a55] mb-3">
              Need access or having trouble?
            </p>
            <Button 
              variant="outline"
              onClick={() => router.push('/contact')}
              className="border-[#DCE5E1] text-[#2D6A4F] hover:bg-[#E8EEEB]"
            >
              {t('nav_contact')}
            </Button>
          </div>
        </Card>
      </div>

      <Footer />
    </main>
  )
}

export default function Login() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin text-[#2D6A4F]" /></div>}>
      <LoginForm />
    </Suspense>
  )
}
