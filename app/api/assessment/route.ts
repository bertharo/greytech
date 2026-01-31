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

    // Check if assessment already exists
    const existingAssessment = await prisma.assessment.findUnique({
      where: { userId: session.user.id }
    })

    if (existingAssessment) {
      // Update existing assessment
      await prisma.assessment.update({
        where: { userId: session.user.id },
        data: {
          answers: JSON.stringify(answers),
          calculatedScore,
          skillLevel,
          completedAt: new Date()
        }
      })
    } else {
      // Create new assessment
      await prisma.assessment.create({
        data: {
          userId: session.user.id,
          answers: JSON.stringify(answers),
          calculatedScore,
          skillLevel
        }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Assessment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
