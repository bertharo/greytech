'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Trophy, BookOpen, TrendingUp, Award } from 'lucide-react'

interface ProgressData {
  totalLessons: number
  completedLessons: number
  totalXP: number
  currentLevel: number
  currentStreak: number
  longestStreak: number
  badges: Array<{
    id: string
    name: string
    description: string
    icon: string
    earnedAt: string
  }>
  recentLessons: Array<{
    id: string
    title: string
    score: number
    completedAt: string
  }>
}

export default function ProgressPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [progress, setProgress] = useState<ProgressData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated') {
      fetchProgress()
    }
  }, [status, router])

  const fetchProgress = async () => {
    try {
      const response = await fetch('/api/progress')
      if (response.ok) {
        const data = await response.json()
        setProgress(data)
      }
    } catch (error) {
      console.error('Error fetching progress:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !progress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading progress...</div>
      </div>
    )
  }

  const completionPercentage = progress.totalLessons > 0
    ? Math.round((progress.completedLessons / progress.totalLessons) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Your Progress</h1>
            <Link href="/dashboard">
              <Button variant="ghost">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center gap-4">
              <BookOpen className="w-10 h-10 text-blue-600" />
              <div>
                <p className="text-gray-600 mb-1">Lessons Completed</p>
                <p className="text-3xl font-bold text-gray-900">
                  {progress.completedLessons} / {progress.totalLessons}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <TrendingUp className="w-10 h-10 text-green-600" />
              <div>
                <p className="text-gray-600 mb-1">Total XP</p>
                <p className="text-3xl font-bold text-gray-900">{progress.totalXP}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <Trophy className="w-10 h-10 text-yellow-600" />
              <div>
                <p className="text-gray-600 mb-1">Current Level</p>
                <p className="text-3xl font-bold text-gray-900">{progress.currentLevel}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <Award className="w-10 h-10 text-orange-600" />
              <div>
                <p className="text-gray-600 mb-1">Longest Streak</p>
                <p className="text-3xl font-bold text-gray-900">{progress.longestStreak} days</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Completion Progress */}
        <Card className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Overall Progress</h2>
          <div className="mb-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-medium text-gray-700">
                {completionPercentage}% Complete
              </span>
              <span className="text-lg text-gray-600">
                {progress.completedLessons} of {progress.totalLessons} lessons
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-6">
              <div
                className="bg-blue-600 h-6 rounded-full transition-all duration-300 flex items-center justify-center"
                style={{ width: `${completionPercentage}%` }}
              >
                {completionPercentage > 15 && (
                  <span className="text-white text-sm font-medium">
                    {completionPercentage}%
                  </span>
                )}
              </div>
            </div>
            {completionPercentage <= 15 && (
              <p className="text-center mt-2 text-gray-600">
                {progress.completedLessons} / {progress.totalLessons} lessons completed
              </p>
            )}
          </div>
        </Card>

        {/* Badges */}
        {progress.badges.length > 0 && (
          <Card className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Your Badges</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {progress.badges.map((badge) => (
                <div
                  key={badge.id}
                  className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border-2 border-yellow-200"
                >
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <h3 className="text-lg font-semibold mb-1">{badge.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{badge.description}</p>
                  <p className="text-xs text-gray-500">
                    Earned: {new Date(badge.earnedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Recent Lessons */}
        {progress.recentLessons.length > 0 && (
          <Card>
            <h2 className="text-2xl font-semibold mb-4">Recent Lessons</h2>
            <div className="space-y-4">
              {progress.recentLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h3 className="text-lg font-semibold">{lesson.title}</h3>
                    <p className="text-sm text-gray-600">
                      Completed: {new Date(lesson.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-green-600">{lesson.score}%</p>
                    <p className="text-sm text-gray-500">Score</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
