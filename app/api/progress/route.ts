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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        progress: {
          where: { completed: true },
          include: {
            lesson: {
              select: {
                id: true,
                title: true
              }
            }
          },
          orderBy: { completedAt: 'desc' },
          take: 10
        },
        badges: {
          include: {
            badge: true
          },
          orderBy: { earnedAt: 'desc' }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get total lessons count
    const totalLessons = await prisma.lesson.count({
      where: { isActive: true }
    })

    const completedLessons = user.progress.filter((p: any) => p.completed).length

    const progressData = {
      totalLessons,
      completedLessons,
      totalXP: user.totalXP,
      currentLevel: user.currentLevel,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      badges: user.badges.map((ub: any) => ({
        id: ub.badge.id,
        name: ub.badge.name,
        description: ub.badge.description,
        icon: ub.badge.icon,
        earnedAt: ub.earnedAt.toISOString()
      })),
      recentLessons: user.progress.map((p: any) => ({
        id: p.lesson.id,
        title: p.lesson.title,
        score: p.score || 0,
        completedAt: p.completedAt?.toISOString() || p.updatedAt.toISOString()
      }))
    }

    return NextResponse.json(progressData)
  } catch (error) {
    console.error('Get progress error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
