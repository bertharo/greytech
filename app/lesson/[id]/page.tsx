'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ArrowLeft, CheckCircle } from 'lucide-react'

interface Lesson {
  id: string
  title: string
  description: string
  content: any
  difficulty: string
  estimatedTime: number
  quizQuestions: QuizQuestion[]
}

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

export default function LessonPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const lessonId = params.id as string

  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [currentSection, setCurrentSection] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({})
  const [quizResults, setQuizResults] = useState<Record<number, boolean>>({})
  const [showQuizResults, setShowQuizResults] = useState(false)
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated') {
      fetchLesson()
    }
  }, [status, router, lessonId])

  const fetchLesson = async () => {
    try {
      const response = await fetch(`/api/lessons/${lessonId}`)
      if (response.ok) {
        const data = await response.json()
        setLesson(data)
      }
    } catch (error) {
      console.error('Error fetching lesson:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleQuizSubmit = () => {
    if (!lesson) return

    const results: Record<number, boolean> = {}
    let correctCount = 0

    lesson.quizQuestions.forEach((question, index) => {
      const userAnswer = quizAnswers[index]
      const isCorrect = userAnswer === question.correctAnswer
      results[index] = isCorrect
      if (isCorrect) correctCount++
    })

    setQuizResults(results)
    setShowQuizResults(true)

    // Calculate score and complete lesson
    const score = Math.round((correctCount / lesson.quizQuestions.length) * 100)
    completeLesson(score)
  }

  const completeLesson = async (score: number) => {
    setCompleting(true)
    try {
      const response = await fetch(`/api/lessons/${lessonId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score })
      })

      if (response.ok) {
        // Redirect to learn page after a short delay
        setTimeout(() => {
          router.push('/learn')
        }, 3000)
      }
    } catch (error) {
      console.error('Error completing lesson:', error)
      setCompleting(false)
    }
  }

  if (loading || !lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading lesson...</div>
      </div>
    )
  }

  const content = typeof lesson.content === 'string' 
    ? JSON.parse(lesson.content) 
    : lesson.content

  const sections = content.sections || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/learn">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {!showQuizResults ? (
          <>
            {/* Lesson Content */}
            {currentSection < sections.length ? (
              <Card className="mb-6">
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg text-gray-600">
                      Section {currentSection + 1} of {sections.length}
                    </span>
                    <div className="w-64 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="prose prose-lg max-w-none">
                  <p className="text-xl leading-relaxed text-gray-800">
                    {sections[currentSection].content}
                  </p>
                </div>

                <div className="mt-8 flex gap-4">
                  {currentSection > 0 && (
                    <Button
                      variant="outline"
                      onClick={() => setCurrentSection(currentSection - 1)}
                    >
                      Previous
                    </Button>
                  )}
                  <Button
                    onClick={() => {
                      if (currentSection < sections.length - 1) {
                        setCurrentSection(currentSection + 1)
                      }
                    }}
                    className="ml-auto"
                  >
                    {currentSection < sections.length - 1 ? 'Next' : 'Continue to Quiz'}
                  </Button>
                </div>
              </Card>
            ) : (
              /* Quiz Section */
              <Card>
                <h2 className="text-2xl font-bold mb-6">Quiz: Test Your Knowledge</h2>
                <div className="space-y-6">
                  {lesson.quizQuestions.map((question, index) => (
                    <div key={question.id} className="border-b border-gray-200 pb-6 last:border-0">
                      <h3 className="text-xl font-semibold mb-4">
                        {index + 1}. {question.question}
                      </h3>
                      <div className="space-y-3">
                        {question.options.map((option, optIndex) => (
                          <button
                            key={optIndex}
                            onClick={() => setQuizAnswers({ ...quizAnswers, [index]: optIndex })}
                            className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
                              quizAnswers[index] === optIndex
                                ? 'border-blue-600 bg-blue-50'
                                : 'border-gray-300 hover:border-blue-400'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={handleQuizSubmit}
                  className="w-full mt-8"
                  size="lg"
                  disabled={Object.keys(quizAnswers).length !== lesson.quizQuestions.length}
                >
                  Submit Quiz
                </Button>
              </Card>
            )}
          </>
        ) : (
          /* Quiz Results */
          <Card>
            <div className="text-center mb-8">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
              <p className="text-xl text-gray-600">
                Score: {Object.values(quizResults).filter(r => r).length} / {lesson.quizQuestions.length}
              </p>
            </div>

            <div className="space-y-6 mb-8">
              {lesson.quizQuestions.map((question, index) => (
                <div
                  key={question.id}
                  className={`p-4 rounded-lg ${
                    quizResults[index] ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'
                  }`}
                >
                  <div className="flex items-start gap-2 mb-2">
                    {quizResults[index] ? (
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    ) : (
                      <span className="text-red-600 text-xl">✗</span>
                    )}
                    <p className="font-semibold">{question.question}</p>
                  </div>
                  {question.explanation && (
                    <p className="text-gray-700 ml-8">{question.explanation}</p>
                  )}
                </div>
              ))}
            </div>

            {completing ? (
              <div className="text-center">
                <p className="text-lg text-gray-600">Completing lesson and updating your progress...</p>
                <p className="text-sm text-gray-500 mt-2">Redirecting to lessons page...</p>
              </div>
            ) : (
              <Link href="/learn">
                <Button className="w-full" size="lg">
                  Continue Learning
                </Button>
              </Link>
            )}
          </Card>
        )}
      </div>
    </div>
  )
}
