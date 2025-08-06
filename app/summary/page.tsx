'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  BookOpen, 
  ArrowLeft,
  Download,
  Share2,
  Copy,
  CheckCircle,
  Brain,
  FileText,
  List,
  Eye,
  BookmarkPlus
} from 'lucide-react'

// Mock data
const summaryData = {
  id: 1,
  title: 'Matematika - Kalkulus Diferensial',
  subject: 'Matematika',
  uploadedAt: '2 jam yang lalu',
  originalFile: 'kalkulus-diferensial-bab1.pdf',
  wordCount: 2450,
  readingTime: '8 menit',
  summaryTypes: {
    bullets: [
      'Definisi turunan sebagai limit dari rasio perubahan',
      'Aturan turunan dasar: konstanta, pangkat, dan jumlah',
      'Turunan fungsi trigonometri dan logaritma',
      'Aplikasi turunan dalam menentukan kecepatan dan percepatan',
      'Teorema nilai rata-rata dan interpretasi geometrisnya',
      'Penggunaan turunan untuk menganalisis perilaku fungsi'
    ],
    paragraphs: `Kalkulus diferensial adalah cabang matematika yang mempelajari konsep turunan dan aplikasinya. 
    Turunan didefinisikan sebagai limit dari rasio perubahan suatu fungsi terhadap variabel independennya ketika perubahan tersebut mendekati nol.

    Aturan-aturan dasar dalam menghitung turunan meliputi aturan konstanta, aturan pangkat, dan aturan jumlah. 
    Untuk fungsi yang lebih kompleks, terdapat aturan rantai, aturan hasil kali, dan aturan hasil bagi yang memungkinkan kita menghitung turunan fungsi komposit.

    Aplikasi turunan sangat luas, mulai dari menentukan kecepatan dan percepatan dalam fisika, hingga optimisasi dalam ekonomi dan teknik. 
    Teorema nilai rata-rata memberikan hubungan penting antara nilai rata-rata turunan dengan perubahan fungsi pada interval tertentu.`,
    concepts: [
      {
        title: 'Limit dan Kontinuitas',
        description: 'Konsep dasar yang diperlukan untuk memahami turunan'
      },
      {
        title: 'Definisi Turunan',
        description: 'f\'(x) = lim(h→0) [f(x+h) - f(x)]/h'
      },
      {
        title: 'Aturan Turunan',
        description: 'Kumpulan rumus untuk menghitung turunan berbagai fungsi'
      },
      {
        title: 'Aplikasi Turunan',
        description: 'Penggunaan turunan dalam masalah optimisasi dan analisis'
      }
    ]
  }
}

export default function SummaryPage() {
  const [activeTab, setActiveTab] = useState<'bullets' | 'paragraphs' | 'concepts'>('bullets')
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    let textToCopy = ''
    
    switch (activeTab) {
      case 'bullets':
        textToCopy = summaryData.summaryTypes.bullets.map(item => `• ${item}`).join('\n')
        break
      case 'paragraphs':
        textToCopy = summaryData.summaryTypes.paragraphs
        break
      case 'concepts':
        textToCopy = summaryData.summaryTypes.concepts
          .map(concept => `${concept.title}: ${concept.description}`)
          .join('\n\n')
        break
    }
    
    navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    // TODO: Implement PDF download
    console.log('Download PDF summary')
  }

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log('Share summary')
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
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleCopy}>
                {copied ? (
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4 mr-2" />
                )}
                {copied ? 'Disalin!' : 'Salin'}
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Bagikan
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Material Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{summaryData.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <FileText className="h-4 w-4 mr-1" />
                  {summaryData.originalFile}
                </span>
                <span>{summaryData.wordCount} kata</span>
                <span>{summaryData.readingTime} baca</span>
                <span>{summaryData.uploadedAt}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <BookmarkPlus className="h-4 w-4 mr-2" />
                Simpan
              </Button>
              <Button size="sm" asChild>
                <Link href={`/quiz/${summaryData.id}`}>
                  <Brain className="h-4 w-4 mr-2" />
                  Latihan Soal
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {/* Tab Navigation */}
          <div className="border-b border-gray-100">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('bullets')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'bullets'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <List className="h-4 w-4 mr-2 inline" />
                Poin Utama
              </button>
              <button
                onClick={() => setActiveTab('paragraphs')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'paragraphs'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FileText className="h-4 w-4 mr-2 inline" />
                Paragraf Ringkas
              </button>
              <button
                onClick={() => setActiveTab('concepts')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'concepts'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Brain className="h-4 w-4 mr-2 inline" />
                Konsep Kunci
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'bullets' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Poin-Poin Utama</h3>
                <ul className="space-y-3">
                  {summaryData.summaryTypes.bullets.map((bullet, index) => (
                    <li key={index} className="flex items-start">
                      <div className="h-2 w-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700 leading-relaxed">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'paragraphs' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan Paragraf</h3>
                <div className="prose prose-gray max-w-none">
                  {summaryData.summaryTypes.paragraphs.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-gray-700 leading-relaxed mb-4">
                      {paragraph.trim()}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'concepts' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Konsep Kunci</h3>
                <div className="grid gap-4">
                  {summaryData.summaryTypes.concepts.map((concept, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-2">{concept.title}</h4>
                      <p className="text-gray-700 text-sm">{concept.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-center space-x-4">
          <Button variant="outline" asChild>
            <Link href={`/quiz/${summaryData.id}`}>
              <Brain className="h-4 w-4 mr-2" />
              Kerjakan Latihan Soal
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard">
              <Eye className="h-4 w-4 mr-2" />
              Lihat Materi Lain
            </Link>
          </Button>
        </div>

        {/* AI Assistant Prompt */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-100">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Butuh Penjelasan Lebih Detail?</h3>
          <p className="text-blue-800 mb-4">
            Gunakan AI Assistant untuk bertanya tentang konsep yang belum dipahami dari materi ini.
          </p>
          <Button asChild>
            <Link href={`/assistant?material=${summaryData.id}`}>
              <Brain className="h-4 w-4 mr-2" />
              Tanya AI Assistant
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
