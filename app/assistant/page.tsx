'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  BookOpen, 
  ArrowLeft,
  Send,
  Bot,
  User,
  Sparkles,
  FileText,
  Brain,
  Lightbulb
} from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  relatedMaterial?: string
}

const suggestedQuestions = [
  'Jelaskan konsep turunan dengan bahasa yang mudah dipahami',
  'Apa perbedaan antara turunan dan integral?',
  'Berikan contoh aplikasi kalkulus dalam kehidupan sehari-hari',
  'Bagaimana cara menghitung turunan fungsi komposit?'
]

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Halo! Saya AI Assistant Quicacademy. Saya siap membantu Anda memahami materi pembelajaran. Ada yang ingin Anda tanyakan?',
      timestamp: new Date(),
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const simulateAIResponse = (userMessage: string): string => {
    const responses = {
      'turunan': 'Turunan adalah konsep fundamental dalam kalkulus yang mengukur laju perubahan suatu fungsi terhadap variabelnya. Secara geometris, turunan pada suatu titik sama dengan kemiringan garis singgung kurva di titik tersebut.\n\nContoh sederhana: Jika f(x) = x², maka f\'(x) = 2x. Ini berarti pada x = 3, kemiringan kurva adalah 2(3) = 6.',
      'integral': 'Integral adalah kebalikan dari turunan (antiturunan). Jika turunan mengukur laju perubahan, integral mengukur akumulasi perubahan. Secara geometris, integral definit mewakili luas daerah di bawah kurva.\n\nPerbedaan utama:\n• Turunan: f(x) → f\'(x)\n• Integral: f\'(x) → f(x) + C',
      'aplikasi': 'Kalkulus memiliki banyak aplikasi dalam kehidupan sehari-hari:\n\n1. **Fisika**: Menghitung kecepatan dan percepatan\n2. **Ekonomi**: Optimisasi keuntungan dan biaya\n3. **Kedokteran**: Model penyebaran penyakit\n4. **Teknik**: Desain struktur dan mesin\n5. **Grafik Komputer**: Animasi dan rendering',
      'komposit': 'Aturan rantai (chain rule) digunakan untuk turunan fungsi komposit:\n\nJika y = f(g(x)), maka dy/dx = f\'(g(x)) × g\'(x)\n\nContoh: y = (x² + 1)³\n• Misalkan u = x² + 1, maka y = u³\n• dy/du = 3u² dan du/dx = 2x\n• dy/dx = 3u² × 2x = 3(x² + 1)² × 2x = 6x(x² + 1)²'
    }

    const lowercaseMessage = userMessage.toLowerCase()
    
    for (const [key, response] of Object.entries(responses)) {
      if (lowercaseMessage.includes(key)) {
        return response
      }
    }

    return 'Terima kasih atas pertanyaan Anda! Saya memahami Anda ingin belajar lebih dalam. Untuk memberikan jawaban yang lebih spesifik, bisakah Anda memberikan detail lebih lanjut tentang konsep mana yang ingin Anda pahami? Saya dapat membantu menjelaskan:\n\n• Konsep dasar matematika\n• Penerapan rumus\n• Contoh soal dan penyelesaiannya\n• Strategi belajar yang efektif'
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // Simulate AI processing delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: simulateAIResponse(inputValue),
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, aiResponse])
      setIsLoading(false)
    }, 1500)
  }

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question)
    inputRef.current?.focus()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
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
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">AI Assistant</span>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col">
        {/* Messages */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">AI Assistant</h1>
                <p className="text-sm text-gray-600">Tanyakan apapun tentang materi pembelajaran Anda</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6" style={{ maxHeight: '60vh' }}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' ? 'bg-blue-600 ml-2' : 'bg-gray-100 mr-2'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-gray-600" />
                    )}
                  </div>
                  <div className={`rounded-lg px-4 py-3 ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                    <p className={`text-xs mt-2 ${
                      message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString('id-ID', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex">
                  <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center mr-2">
                    <Bot className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="bg-gray-100 rounded-lg px-4 py-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Suggested Questions */}
        {messages.length === 1 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Pertanyaan yang sering ditanyakan:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="text-left p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-start space-x-2">
                    <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{question}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex space-x-4">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ketik pertanyaan Anda di sini..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              size="lg"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <Brain className="h-3 w-3 mr-1" />
                AI-powered by OpenRouter
              </span>
            </div>
            <span>Tekan Enter untuk mengirim</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Button variant="outline" asChild className="h-auto p-4 flex-col space-y-2">
            <Link href="/summary">
              <FileText className="h-6 w-6" />
              <span className="text-sm">Lihat Ringkasan</span>
            </Link>
          </Button>
          <Button variant="outline" asChild className="h-auto p-4 flex-col space-y-2">
            <Link href="/quiz">
              <Brain className="h-6 w-6" />
              <span className="text-sm">Latihan Soal</span>
            </Link>
          </Button>
          <Button variant="outline" asChild className="h-auto p-4 flex-col space-y-2">
            <Link href="/upload">
              <FileText className="h-6 w-6" />
              <span className="text-sm">Upload Materi</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
