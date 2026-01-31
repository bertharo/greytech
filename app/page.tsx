import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to TechBridge
          </h1>
          <p className="text-2xl md:text-3xl text-gray-700 mb-12">
            Learn technology at your own pace, one lesson at a time
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card>
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">Personalized Learning</h3>
              <p className="text-gray-600">Start at your skill level and learn at your own pace</p>
            </Card>
            <Card>
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold mb-2">Gamified Experience</h3>
              <p className="text-gray-600">Earn points, unlock badges, and maintain streaks</p>
            </Card>
            <Card>
              <div className="text-4xl mb-4">⏱️</div>
              <h3 className="text-xl font-semibold mb-2">Flexible Schedule</h3>
              <p className="text-gray-600">Choose how much time you want to spend each day</p>
            </Card>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
