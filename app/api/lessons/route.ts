import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's skill level
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { skillLevel: true }
    })

    // Get categories with lessons
    const categories = await prisma.category.findMany({
      where: {
        lessons: {
          some: {
            isActive: true
          }
        }
      },
      include: {
        lessons: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
          include: {
            progress: {
              where: { userId: session.user.id },
              take: 1
            }
          }
        }
      },
      orderBy: { order: 'asc' }
    })

    // Format response
    const formattedCategories = categories.map((category: any) => ({
      id: category.id,
      name: category.name,
      description: category.description,
      lessons: category.lessons.map((lesson: any) => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        category: {
          name: category.name
        },
        difficulty: lesson.difficulty,
        estimatedTime: lesson.estimatedTime,
        progress: lesson.progress[0] ? {
          completed: lesson.progress[0].completed,
          score: lesson.progress[0].score
        } : undefined
      }))
    }))

    return NextResponse.json(formattedCategories)
  } catch (error) {
    console.error('Get lessons error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
