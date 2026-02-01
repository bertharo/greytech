import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    })

    // Don't reveal if user exists (security best practice)
    if (!user) {
      return NextResponse.json(
        { 
          message: 'If an account exists with this email, a password reset link has been sent.',
          resetToken: null 
        },
        { status: 200 }
      )
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const expires = new Date()
    expires.setHours(expires.getHours() + 1) // Token expires in 1 hour

    // Store reset token in VerificationToken table
    await prisma.verificationToken.upsert({
      where: {
        identifier_token: {
          identifier: email,
          token: resetToken
        }
      },
      update: {
        token: resetToken,
        expires
      },
      create: {
        identifier: email,
        token: resetToken,
        expires
      }
    })

    // In production, send email here
    // For now, return the token so user can use it
    return NextResponse.json({
      message: 'Password reset token generated',
      resetToken // In production, don't return this - send via email instead
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
