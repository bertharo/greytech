'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

const assessmentQuestions = [
  {
    id: 1,
    question: 'How comfortable are you with using a smartphone?',
    options: [
      { text: 'I rarely use a smartphone', score: 0 },
      { text: 'I can make calls and send texts', score: 2 },
      { text: 'I use apps and browse the internet', score: 4 },
      { text: 'I use many apps and features regularly', score: 6 }
    ]
  },
  {
    id: 2,
    question: 'How often do you use email?',
    options: [
      { text: 'Never or rarely', score: 0 },
      { text: 'A few times a month', score: 2 },
      { text: 'A few times a week', score: 4 },
      { text: 'Daily', score: 6 }
    ]
  },
  {
    id: 3,
    question: 'Have you ever made a video call (Zoom, FaceTime, etc.)?',
    options: [
      { text: 'No, never', score: 0 },
      { text: 'Yes, but I need help', score: 2 },
      { text: 'Yes, I can do it with some guidance', score: 4 },
      { text: 'Yes, I do it regularly and easily', score: 6 }
    ]
  },
  {
    id: 4,
    question: 'How comfortable are you with installing apps on your phone?',
    options: [
      { text: 'I have never installed an app', score: 0 },
      { text: 'I have tried but need help', score: 2 },
      { text: 'I can do it with instructions', score: 4 },
      { text: 'I install apps regularly', score: 6 }
    ]
  },
  {
    id: 5,
    question: 'Have you used online banking or paid bills online?',
    options: [
      { text: 'No, never', score: 0 },
      { text: 'Yes, but I find it difficult', score: 2 },
      { text: 'Yes, I can do it with some help', score: 4 },
      { text: 'Yes, I do it regularly', score: 6 }
    ]
  },
  {
    id: 6,
    question: 'How familiar are you with social media (Facebook, Instagram, etc.)?',
    options: [
      { text: 'I do not use social media', score: 0 },
      { text: 'I have an account but rarely use it', score: 2 },
      { text: 'I use it occasionally', score: 4 },
      { text: 'I use it regularly', score: 6 }
    ]
  },
  {
    id: 7,
    question: 'Have you ever shopped online (Amazon, grocery delivery, etc.)?',
    options: [
      { text: 'No, never', score: 0 },
      { text: 'Yes, but I need assistance', score: 2 },
      { text: 'Yes, I can do it with guidance', score: 4 },
      { text: 'Yes, I shop online regularly', score: 6 }
    ]
  },
  {
    id: 8,
    question: 'How do you feel about creating and remembering passwords?',
    options: [
      { text: 'I find it very difficult', score: 0 },
      { text: 'I struggle with it', score: 2 },
      { text: 'I can manage with help', score: 4 },
      { text: 'I handle passwords well', score: 6 }
    ]
  },
  {
    id: 9,
    question: 'Have you used streaming services (Netflix, YouTube, etc.)?',
    options: [
      { text: 'No, never', score: 0 },
      { text: 'Yes, but I need help navigating', score: 2 },
      { text: 'Yes, I can use them with some guidance', score: 4 },
      { text: 'Yes, I use them regularly', score: 6 }
    ]
  },
  {
    id: 10,
    question: 'How comfortable are you with using a computer or tablet?',
    options: [
      { text: 'Not comfortable at all', score: 0 },
      { text: 'Somewhat comfortable with basics', score: 2 },
      { text: 'Comfortable with common tasks', score: 4 },
      { text: 'Very comfortable', score: 6 }
    ]
  },
  {
    id: 11,
    question: 'Have you ever used a calendar app or set reminders on your device?',
    options: [
      { text: 'No, never', score: 0 },
      { text: 'I have tried but need help', score: 2 },
      { text: 'Yes, I can do it with instructions', score: 4 },
      { text: 'Yes, I use them regularly', score: 6 }
    ]
  },
  {
    id: 12,
    question: 'How would you rate your overall confidence with technology?',
    options: [
      { text: 'Very low - I avoid technology when possible', score: 0 },
      { text: 'Low - I only use what I absolutely must', score: 2 },
      { text: 'Moderate - I use technology but often need help', score: 4 },
      { text: 'High - I enjoy learning new technology', score: 6 }
    ]
  }
]

export default function AssessmentPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [loading, setLoading] = useState(false)

  const handleAnswer = (questionId: number, score: number) => {
    setAnswers({ ...answers, [questionId]: score })
    
    if (currentQuestion < assessmentQuestions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300)
    } else {
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== assessmentQuestions.length) {
      return
    }

    setLoading(true)
    
    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0)
    const maxScore = assessmentQuestions.length * 6
    const percentage = (totalScore / maxScore) * 100
    
    let skillLevel = 'Beginner'
    if (percentage > 70) {
      skillLevel = 'Advanced'
    } else if (percentage > 30) {
      skillLevel = 'Intermediate'
    }

    try {
      const response = await fetch('/api/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          calculatedScore: totalScore,
          skillLevel
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save assessment')
      }

      // Update user skill level
      await fetch('/api/user/update-skill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skillLevel })
      })

      router.push('/time-commitment')
    } catch (error) {
      console.error('Assessment error:', error)
      setLoading(false)
    }
  }

  const progress = ((currentQuestion + 1) / assessmentQuestions.length) * 100
  const question = assessmentQuestions[currentQuestion]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-2xl">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-medium text-gray-700">
              Question {currentQuestion + 1} of {assessmentQuestions.length}
            </span>
            <span className="text-lg font-medium text-gray-700">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-600 h-4 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
          {question.question}
        </h2>

        <div className="space-y-4">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(question.id, option.score)}
              className="w-full p-6 text-left bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span className="text-lg font-medium text-gray-900">
                {option.text}
              </span>
            </button>
          ))}
        </div>

        {loading && (
          <div className="mt-6 text-center">
            <p className="text-lg text-gray-600">Processing your results...</p>
          </div>
        )}
      </Card>
    </div>
  )
}
