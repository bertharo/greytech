'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resetToken, setResetToken] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        setLoading(false)
        return
      }

      // Show success message with reset link
      setSuccess(true)
      setResetToken(data.resetToken)
      setLoading(false)
    } catch (error) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  if (success && resetToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-8">Password Reset</h1>
          
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 mb-4">
              We've generated a password reset link for you. Click the button below to reset your password.
            </p>
            <p className="text-sm text-gray-600 mb-4">
              <strong>Note:</strong> In a production app, this link would be sent to your email. For now, use the button below.
            </p>
            <Button
              onClick={() => router.push(`/reset-password?token=${resetToken}`)}
              className="w-full"
            >
              Reset My Password
            </Button>
          </div>

          <p className="text-center text-gray-600">
            <Link href="/login" className="text-blue-600 hover:underline font-semibold">
              Back to Login
            </Link>
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">Forgot Password</h1>
        
        <p className="text-gray-600 text-center mb-6">
          Enter your email address and we'll help you reset your password.
        </p>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Remember your password?{' '}
          <Link href="/login" className="text-blue-600 hover:underline font-semibold">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  )
}
