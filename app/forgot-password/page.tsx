"use client"

import { useState } from "react"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2, Loader2, ArrowLeft } from "lucide-react"

export const dynamic = 'force-dynamic';

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [email, setEmail] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to send reset email')
        setLoading(false)
        return
      }

      setSuccess(true)
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
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
              Check Your Email
            </h1>
            <p className="text-[#4a5a55] mb-6">
              If an account exists with <strong>{email}</strong>, you will receive a password reset link shortly.
            </p>
            <p className="text-sm text-[#4a5a55] mb-6">
              The link will expire in 1 hour for security reasons.
            </p>
            <Link href="/login">
              <Button className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
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
          <Link 
            href="/login" 
            className="inline-flex items-center text-sm text-[#2D6A4F] hover:text-[#1B4332] mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Login
          </Link>

          <h1 className="text-3xl font-bold text-[#12261f] mb-2">
            Forgot Password?
          </h1>
          <p className="text-[#4a5a55] mb-6">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
                placeholder="you@company.com"
              />
            </div>

            <Button 
              type="submit"
              disabled={loading}
              className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-[#4a5a55]">
              Remember your password?{" "}
              <Link 
                href="/login" 
                className="text-[#2D6A4F] hover:text-[#1B4332] font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>

      <Footer />
    </main>
  )
}
