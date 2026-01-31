'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { BookOpen, CheckCircle, Lock, Clock } from 'lucide-react'

interface Lesson {
  id: string
  title: string
  description: string
  category: {
    name: string
  }
  difficulty: string
  estimatedTime: number
  progress?: {
    completed: boolean
    score?: number
  }
}

interface Category {
  id: string
  name: string
  description: string
  lessons: Lesson[]
}

export default function LearnPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated') {
      fetchLessons()
    }
  }, [status, router])

  const fetchLessons = async () => {
    try {
      const response = await fetch('/api/lessons')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching lessons:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800'
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'Advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading lessons...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Learn</h1>
            <Link href="/dashboard">
              <Button variant="ghost">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {categories.length === 0 ? (
          <Card className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No lessons available yet</h2>
            <p className="text-gray-600">
              Lessons are being prepared. Check back soon!
            </p>
          </Card>
        ) : (
          categories.map((category) => (
            <div key={category.id} className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{category.name}</h2>
              {category.description && (
                <p className="text-lg text-gray-600 mb-6">{category.description}</p>
              )}

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.lessons.map((lesson) => (
                  <Card key={lesson.id} className="hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">{lesson.title}</h3>
                        {lesson.description && (
                          <p className="text-gray-600 mb-3 line-clamp-2">
                            {lesson.description}
                          </p>
                        )}
                      </div>
                      {lesson.progress?.completed && (
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 ml-2" />
                      )}
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(
                          lesson.difficulty
                        )}`}
                      >
                        {lesson.difficulty}
                      </span>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{lesson.estimatedTime} min</span>
                      </div>
                    </div>

                    {lesson.progress?.completed ? (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          Score: {lesson.progress.score}%
                        </p>
                        <Link href={`/lesson/${lesson.id}`}>
                          <Button variant="outline" className="w-full">
                            Review Lesson
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <Link href={`/lesson/${lesson.id}`}>
                        <Button className="w-full">Start Lesson</Button>
                      </Link>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
