import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getXPForLevel, getTotalXPForLevel, shouldLevelUp } from '@/lib/utils'

export async function POST(
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
    const { score } = await request.json()

    const lesson = await prisma.lesson.findUnique({
      where: { id }
    })

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      )
    }

    // Calculate XP earned (base XP + bonus for high score)
    const baseXP = lesson.estimatedTime * 2 // 2 XP per minute
    const scoreBonus = score >= 80 ? 20 : score >= 60 ? 10 : 0
    const xpEarned = baseXP + scoreBonus

    // Get current user data
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Update or create progress
    const existingProgress = await prisma.progress.findUnique({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId: id
        }
      }
    })

    if (existingProgress) {
      await prisma.progress.update({
        where: { id: existingProgress.id },
        data: {
          completed: true,
          score,
          attempts: existingProgress.attempts + 1,
          completedAt: new Date(),
          xpEarned: Math.max(xpEarned, existingProgress.xpEarned) // Keep highest XP
        }
      })
    } else {
      await prisma.progress.create({
        data: {
          userId: session.user.id,
          lessonId: id,
          completed: true,
          score,
          attempts: 1,
          completedAt: new Date(),
          xpEarned
        }
      })
    }

    // Update user XP and check for level up
    const newTotalXP = user.totalXP + xpEarned
    let newLevel = user.currentLevel
    let leveledUp = false

    if (shouldLevelUp(user.currentLevel, newTotalXP)) {
      newLevel = user.currentLevel + 1
      leveledUp = true
    }

    // Update streak (simplified - check if last active was yesterday)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null
    const lastActiveDate = lastActive ? new Date(lastActive.setHours(0, 0, 0, 0)) : null
    
    let newStreak = user.currentStreak
    if (!lastActiveDate || lastActiveDate.getTime() === today.getTime() - 86400000) {
      // Same day or consecutive day
      if (lastActiveDate?.getTime() === today.getTime() - 86400000) {
        newStreak = user.currentStreak + 1
      } else if (!lastActiveDate) {
        newStreak = 1
      }
    } else {
      // Streak broken
      newStreak = 1
    }

    // Update user
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        totalXP: newTotalXP,
        currentLevel: newLevel,
        currentStreak: newStreak,
        longestStreak: Math.max(user.longestStreak, newStreak),
        lastActiveDate: new Date()
      }
    })

    // Check for badge unlocks (simplified - just check first lesson badge)
    if (!existingProgress) {
      const firstLessonBadge = await prisma.badge.findUnique({
        where: { name: 'First Steps' }
      })

      if (firstLessonBadge) {
        const hasBadge = await prisma.userBadge.findUnique({
          where: {
            userId_badgeId: {
              userId: session.user.id,
              badgeId: firstLessonBadge.id
            }
          }
        })

        if (!hasBadge) {
          await prisma.userBadge.create({
            data: {
              userId: session.user.id,
              badgeId: firstLessonBadge.id
            }
          })
        }
      }
    }

    return NextResponse.json({
      success: true,
      xpEarned,
      leveledUp,
      newLevel,
      newStreak
    })
  } catch (error) {
    console.error('Complete lesson error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
