"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2, Loader2, Eye, EyeOff } from "lucide-react"

export const dynamic = 'force-dynamic';

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [token, setToken] = useState("")
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })

  useEffect(() => {
    const resetToken = searchParams.get('token')
    if (!resetToken) {
      setError('Invalid or missing reset token')
      setVerifying(false)
      return
    }
    setToken(resetToken)
    verifyToken(resetToken)
  }, [searchParams])

  const verifyToken = async (resetToken: string) => {
    try {
      const response = await fetch(`/api/auth/verify-reset-token?token=${resetToken}`)
      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Invalid or expired reset link')
      }
    } catch (err) {
      setError('Failed to verify reset link')
    } finally {
      setVerifying(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long")
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to reset password')
        setLoading(false)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (err) {
      setError("An unexpected error occurred")
      setLoading(false)
    }
  }

  if (verifying) {
    return (
      <main className="min-h-screen bg-[#f5f7f6]">
        <Header />
        <div className="container mx-auto px-6 py-20">
          <Card className="max-w-md mx-auto p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#2D6A4F] mx-auto mb-4" />
            <p className="text-[#4a5a55]">Verifying reset link...</p>
          </Card>
        </div>
        <Footer />
      </main>
    )
  }

  if (success) {
    return (
      <main className="min-h-screen bg-[#f5f7f6]">
        <Header />
        <div className="container mx-auto px-6 py-20">
          <Card className="max-w-md mx-auto p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-[#12261f] mb-2">
              Password Reset Successful!
            </h1>
            <p className="text-[#4a5a55] mb-6">
              Your password has been reset. Redirecting to login...
            </p>
          </Card>
        </div>
        <Footer />
      </main>
    )
  }

  if (error && !token) {
    return (
      <main className="min-h-screen bg-[#f5f7f6]">
        <Header />
        <div className="container mx-auto px-6 py-20">
          <Card className="max-w-md mx-auto p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-[#12261f] mb-2">
              Invalid Reset Link
            </h1>
            <p className="text-[#4a5a55] mb-6">
              {error}
            </p>
            <Link href="/forgot-password">
              <Button className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white">
                Request New Link
              </Button>
            </Link>
          </Card>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f5f7f6]">
      <Header />
      
      <div className="container mx-auto px-6 py-20">
        <Card className="max-w-md mx-auto p-8">
          <h1 className="text-3xl font-bold text-[#12261f] mb-2">
            Reset Your Password
          </h1>
          <p className="text-[#4a5a55] mb-6">
            Enter your new password below.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password">New Password</Label>
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
              <p className="text-xs text-[#4a5a55] mt-1">
                Minimum 8 characters
              </p>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative mt-1">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a5a55] hover:text-[#12261f] transition"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
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
                  Resetting Password...
                </>
              ) : (
                'Reset Password'
              )}
            </Button>
          </form>
        </Card>
      </div>

      <Footer />
    </main>
  )
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin text-[#2D6A4F]" /></div>}>
      <ResetPasswordForm />
    </Suspense>
  )
}
