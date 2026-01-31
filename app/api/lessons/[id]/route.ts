import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        quizQuestions: {
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      )
    }

    // Parse quiz options
    const formattedLesson = {
      ...lesson,
      quizQuestions: lesson.quizQuestions.map((q: { options: string; [key: string]: any }) => ({
        ...q,
        options: JSON.parse(q.options)
      }))
    }

    return NextResponse.json(formattedLesson)
  } catch (error) {
    console.error('Get lesson error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
