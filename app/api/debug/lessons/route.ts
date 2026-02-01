import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Debug endpoint to check if lessons exist
export async function GET() {
  try {
    // Check categories
    const categories = await prisma.category.findMany({
      include: {
        lessons: true
      }
    })

    // Check all lessons
    const allLessons = await prisma.lesson.findMany({
      include: {
        category: true
      }
    })

    return NextResponse.json({
      categoriesCount: categories.length,
      categories: categories.map(c => ({
        id: c.id,
        name: c.name,
        lessonsCount: c.lessons.length
      })),
      totalLessons: allLessons.length,
      lessons: allLessons.map(l => ({
        id: l.id,
        title: l.title,
        difficulty: l.difficulty,
        category: l.category.name,
        isActive: l.isActive
      }))
    })
  } catch (error: any) {
    return NextResponse.json(
      { 
        error: 'Debug failed', 
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
