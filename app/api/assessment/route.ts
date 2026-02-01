import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { answers, calculatedScore, skillLevel } = await request.json()

    // Update user's skill level directly (assessment data is stored in User model)
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        skillLevel: skillLevel
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Assessment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
