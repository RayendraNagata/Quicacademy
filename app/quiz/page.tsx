'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  BookOpen, 
  ArrowLeft,
  Clock,
  CheckCircle,
  X,
  AlertCircle,
  Trophy,
  RotateCcw,
  Eye,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

interface Question {
  id: number
  type: 'multiple-choice' | 'true-false' | 'fill-blank'
  question: string
  options?: string[]
  correctAnswer: string | number
  explanation: string
  userAnswer?: string | number
  isCorrect?: boolean
}

// Mock quiz data
const quizData = {
  id: 1,
  title: 'Latihan Soal: Kalkulus Diferensial',
  subject: 'Matematika',
  totalQuestions: 10,
  timeLimit: 15, // minutes
  questions: [
    {
      id: 1,
      type: 'multiple-choice',
      question: 'Apa definisi turunan f\'(x) dari fungsi f(x)?',
      options: [
        'Limit dari f(x+h)/h ketika h mendekati 0',
        'Limit dari [f(x+h) - f(x)]/h ketika h mendekati 0',
        'Limit dari f(x) ketika x mendekati 0',
        'Integral dari f(x)'
      ],
      correctAnswer: 1,
      explanation: 'Turunan didefinisikan sebagai limit dari rasio perubahan fungsi ketika perubahan variabel mendekati nol.'
    },
    {
      id: 2,
      type: 'true-false',
      question: 'Turunan dari konstanta selalu sama dengan nol.',
      correctAnswer: 'true',
      explanation: 'Benar. Turunan dari konstanta c adalah 0, karena konstanta tidak berubah terhadap variabel.'
    },
    {
      id: 3,
      type: 'multiple-choice',
      question: 'Berapakah turunan dari f(x) = x³?',
      options: [
        '3x²',
        'x²',
        '3x',
        'x³/3'
      ],
      correctAnswer: 0,
      explanation: 'Menggunakan aturan pangkat: d/dx(xⁿ) = n·xⁿ⁻¹, sehingga turunan x³ adalah 3x².'
    }
  ] as Question[]
}

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: string | number }>({})
  const [timeLeft, setTimeLeft] = useState(quizData.timeLimit * 60) // in seconds
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [results, setResults] = useState<{
    score: number
    correctAnswers: number
    totalQuestions: number
    percentage: number
  } | null>(null)

  // Timer
  useEffect(() => {
    if (timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !quizCompleted) {
      handleSubmitQuiz()
    }
  }, [timeLeft, quizCompleted])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerSelect = (answer: string | number) => {
    setAnswers(prev => ({
      ...prev,
      [quizData.questions[currentQuestion].id]: answer
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setShowExplanation(false)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setShowExplanation(false)
    }
  }

  const handleSubmitQuiz = () => {
    let correctCount = 0
    const updatedQuestions = quizData.questions.map(question => {
      const userAnswer = answers[question.id]
      const isCorrect = userAnswer === question.correctAnswer
      if (isCorrect) correctCount++
      
      return {
        ...question,
        userAnswer,
        isCorrect
      }
    })

    const percentage = Math.round((correctCount / quizData.questions.length) * 100)
    
    setResults({
      score: correctCount,
      correctAnswers: correctCount,
      totalQuestions: quizData.questions.length,
      percentage
    })
    
    setQuizCompleted(true)
  }

  const handleRetakeQuiz = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setTimeLeft(quizData.timeLimit * 60)
    setQuizCompleted(false)
    setShowExplanation(false)
    setResults(null)
  }

  const currentQ = quizData.questions[currentQuestion]
  const currentAnswer = answers[currentQ?.id]

  if (quizCompleted && results) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Kembali
                  </Link>
                </Button>
                <Link href="/" className="flex items-center space-x-2">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                  <span className="text-xl font-bold text-gray-900">Quicacademy</span>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Results */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="mb-6">
              {results.percentage >= 80 ? (
                <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              ) : results.percentage >= 60 ? (
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              ) : (
                <AlertCircle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
              )}
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Quiz Selesai!
              </h1>
              
              <div className="text-6xl font-bold text-blue-600 mb-4">
                {results.percentage}%
              </div>
              
              <p className="text-gray-600 mb-6">
                Anda menjawab {results.correctAnswers} dari {results.totalQuestions} soal dengan benar
              </p>
            </div>

            {/* Performance Badge */}
            <div className="mb-6">
              {results.percentage >= 90 && (
                <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  <Trophy className="h-4 w-4 mr-2" />
                  Excellent! Pemahaman sempurna
                </div>
              )}
              {results.percentage >= 80 && results.percentage < 90 && (
                <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Great! Pemahaman sangat baik
                </div>
              )}
              {results.percentage >= 60 && results.percentage < 80 && (
                <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Good! Perlu sedikit review
                </div>
              )}
              {results.percentage < 60 && (
                <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                  <X className="h-4 w-4 mr-2" />
                  Perlu belajar lebih banyak
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleRetakeQuiz}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Ulangi Quiz
              </Button>
              <Button variant="outline" asChild>
                <Link href="/summary">
                  <Eye className="h-4 w-4 mr-2" />
                  Review Materi
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard">
                  Dashboard
                </Link>
              </Button>
            </div>
          </div>

          {/* Recommendations */}
          <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Rekomendasi Belajar</h3>
            {results.percentage >= 80 ? (
              <p className="text-blue-800">
                Pemahaman Anda sangat baik! Lanjutkan ke materi berikutnya atau coba soal yang lebih menantang.
              </p>
            ) : (
              <p className="text-blue-800">
                Sebaiknya review kembali materi ini dan fokus pada konsep yang masih kurang dipahami. 
                Gunakan AI Assistant untuk penjelasan tambahan.
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kembali
                </Link>
              </Button>
              <Link href="/" className="flex items-center space-x-2">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">Quicacademy</span>
              </Link>
            </div>
            
            {/* Timer */}
            <div className="flex items-center space-x-2 bg-red-50 px-4 py-2 rounded-lg">
              <Clock className="h-4 w-4 text-red-600" />
              <span className="font-medium text-red-600">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quiz Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{quizData.title}</h1>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{quizData.subject}</span>
            <span>Soal {currentQuestion + 1} dari {quizData.totalQuestions}</span>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / quizData.totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {currentQ?.question}
          </h2>

          {/* Multiple Choice */}
          {currentQ?.type === 'multiple-choice' && (
            <div className="space-y-3">
              {currentQ.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                    currentAnswer === index
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                      currentAnswer === index
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {currentAnswer === index && (
                        <div className="w-full h-full rounded-full bg-white scale-50" />
                      )}
                    </div>
                    <span className="text-gray-900">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* True/False */}
          {currentQ?.type === 'true-false' && (
            <div className="space-y-3">
              {['true', 'false'].map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswerSelect(option)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                    currentAnswer === option
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                      currentAnswer === option
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {currentAnswer === option && (
                        <div className="w-full h-full rounded-full bg-white scale-50" />
                      )}
                    </div>
                    <span className="text-gray-900 capitalize">
                      {option === 'true' ? 'Benar' : 'Salah'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Explanation */}
          {showExplanation && currentAnswer !== undefined && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Penjelasan:</h4>
              <p className="text-blue-800 text-sm">{currentQ.explanation}</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevQuestion}
            disabled={currentQuestion === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Sebelumnya
          </Button>

          <div className="flex items-center space-x-2">
            {currentAnswer !== undefined && !showExplanation && (
              <Button
                variant="outline"
                onClick={() => setShowExplanation(true)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Lihat Penjelasan
              </Button>
            )}
            
            {currentQuestion === quizData.questions.length - 1 ? (
              <Button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(answers).length !== quizData.questions.length}
              >
                Selesai Quiz
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                disabled={currentAnswer === undefined}
              >
                Selanjutnya
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>

        {/* Quiz Info */}
        <div className="mt-8 bg-yellow-50 rounded-xl p-6 border border-yellow-200">
          <h3 className="text-lg font-semibold text-yellow-900 mb-3">Tips Mengerjakan Quiz</h3>
          <ul className="space-y-2 text-sm text-yellow-800">
            <li className="flex items-start">
              <div className="h-1.5 w-1.5 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              Baca soal dengan teliti sebelum memilih jawaban
            </li>
            <li className="flex items-start">
              <div className="h-1.5 w-1.5 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              Anda bisa melihat penjelasan setelah menjawab
            </li>
            <li className="flex items-start">
              <div className="h-1.5 w-1.5 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              Perhatikan waktu yang tersisa di pojok kanan atas
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
