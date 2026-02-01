'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Flame, Trophy, Heart, Target, BookOpen, TrendingUp } from 'lucide-react'

interface UserData {
  name: string
  currentLevel: number
  totalXP: number
  currentStreak: number
  hearts: number
  skillLevel: string
  dailyTimeCommit: number
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated') {
      fetchUserData()
    }
  }, [status, router])

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/data')
      if (response.ok) {
        const data = await response.json()
        setUserData(data)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getXPForNextLevel = (level: number) => {
    return Math.floor(100 * Math.pow(1.5, level - 1))
  }

  const getTotalXPForLevel = (level: number) => {
    let total = 0
    for (let i = 1; i < level; i++) {
      total += getXPForNextLevel(i)
    }
    return total
  }

  if (loading || !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    )
  }

  const xpForNextLevel = getXPForNextLevel(userData.currentLevel)
  const totalXPNeeded = getTotalXPForLevel(userData.currentLevel + 1)
  const xpProgress = userData.totalXP - getTotalXPForLevel(userData.currentLevel)
  const progressPercentage = Math.min((xpProgress / xpForNextLevel) * 100, 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {userData.name || 'Learner'}!
            </h1>
            <Button variant="ghost" onClick={() => signOut()}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Current Streak</p>
                <p className="text-3xl font-bold text-orange-600">{userData.currentStreak}</p>
                <p className="text-sm text-gray-500 mt-1">days</p>
              </div>
              <Flame className="w-12 h-12 text-orange-500" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Level</p>
                <p className="text-3xl font-bold text-blue-600">{userData.currentLevel}</p>
                <p className="text-sm text-gray-500 mt-1">Skill Level: {userData.skillLevel}</p>
              </div>
              <Trophy className="w-12 h-12 text-blue-500" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Hearts</p>
                <p className="text-3xl font-bold text-red-600">{userData.hearts}</p>
                <p className="text-sm text-gray-500 mt-1">/ 5</p>
              </div>
              <Heart className="w-12 h-12 text-red-500" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Total XP</p>
                <p className="text-3xl font-bold text-green-600">{userData.totalXP}</p>
                <p className="text-sm text-gray-500 mt-1">XP to next: {xpForNextLevel - xpProgress}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-500" />
            </div>
          </Card>
        </div>

        {/* Level Progress */}
        <Card className="mb-8">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">Level Progress</h2>
              <span className="text-lg font-medium text-gray-700">
                Level {userData.currentLevel} → {userData.currentLevel + 1}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-6">
              <div
                className="bg-blue-600 h-6 rounded-full transition-all duration-300 flex items-center justify-center"
                style={{ width: `${progressPercentage}%` }}
              >
                {progressPercentage > 15 && (
                  <span className="text-white text-sm font-medium">
                    {xpProgress} / {xpForNextLevel} XP
                  </span>
                )}
              </div>
            </div>
            {progressPercentage <= 15 && (
              <p className="text-center mt-2 text-gray-600">
                {xpProgress} / {xpForNextLevel} XP
              </p>
            )}
          </div>
        </Card>

        {/* Daily Goal */}
        <Card className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Target className="w-8 h-8 text-blue-600" />
              <div>
                <h2 className="text-xl font-semibold mb-1">Today's Goal</h2>
                <p className="text-gray-600">
                  Complete {userData.dailyTimeCommit} minutes of learning
                </p>
              </div>
            </div>
            <Link href="/learn">
              <Button size="lg">Start Learning</Button>
            </Link>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <div className="flex items-center gap-4 mb-4">
              <BookOpen className="w-8 h-8 text-green-600" />
              <h2 className="text-xl font-semibold">Continue Learning</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Pick up where you left off and continue your learning journey.
            </p>
            <Link href="/learn">
              <Button variant="secondary" className="w-full">
                View Lessons
              </Button>
            </Link>
          </Card>

          <Card>
            <div className="flex items-center gap-4 mb-4">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <h2 className="text-xl font-semibold">Your Progress</h2>
            </div>
            <p className="text-gray-600 mb-4">
              See your learning statistics and track your improvement.
            </p>
            <Link href="/progress">
              <Button variant="outline" className="w-full">
                View Progress
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}
