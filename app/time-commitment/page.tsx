'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

const timeOptions = [
  { minutes: 5, label: '5 minutes', description: 'Quick daily check-in' },
  { minutes: 10, label: '10 minutes', description: 'Perfect for beginners' },
  { minutes: 15, label: '15 minutes', description: 'Steady progress' },
  { minutes: 20, label: '20 minutes', description: 'Dedicated learning' },
  { minutes: 30, label: '30 minutes', description: 'Intensive learning' }
]

export default function TimeCommitmentPage() {
  const router = useRouter()
  const [selectedTime, setSelectedTime] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!selectedTime) return

    setLoading(true)
    try {
      const response = await fetch('/api/user/update-time', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dailyTimeCommitment: selectedTime })
      })

      if (!response.ok) {
        throw new Error('Failed to save time commitment')
      }

      router.push('/dashboard')
    } catch (error) {
      console.error('Time commitment error:', error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
          How much time would you like to spend learning each day?
        </h1>
        <p className="text-xl text-center text-gray-600 mb-8">
          Choose what works best for your schedule. You can change this anytime.
        </p>

        <div className="space-y-4 mb-8">
          {timeOptions.map((option) => (
            <button
              key={option.minutes}
              onClick={() => setSelectedTime(option.minutes)}
              className={`w-full p-6 text-left border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                selectedTime === option.minutes
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {option.label}
                  </h3>
                  <p className="text-gray-600">{option.description}</p>
                </div>
                {selectedTime === option.minutes && (
                  <div className="text-2xl">✓</div>
                )}
              </div>
            </button>
          ))}
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full"
          size="lg"
          disabled={!selectedTime || loading}
        >
          {loading ? 'Saving...' : 'Continue to Dashboard'}
        </Button>
      </Card>
    </div>
  )
}
