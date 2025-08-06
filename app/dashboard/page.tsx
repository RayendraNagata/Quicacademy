'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  BookOpen, 
  Upload, 
  FileText, 
  Brain, 
  BarChart3, 
  Clock,
  TrendingUp,
  CheckCircle,
  Plus,
  Eye,
  Download
} from 'lucide-react'

// Mock data
const recentMaterials = [
  {
    id: 1,
    title: 'Matematika - Kalkulus Diferensial',
    subject: 'Matematika',
    uploadedAt: '2 jam yang lalu',
    status: 'processed',
    summary: true,
    quiz: true,
  },
  {
    id: 2,
    title: 'Fisika - Hukum Newton',
    subject: 'Fisika',
    uploadedAt: '1 hari yang lalu',
    status: 'processed',
    summary: true,
    quiz: true,
  },
  {
    id: 3,
    title: 'Kimia - Ikatan Kovalen',
    subject: 'Kimia',
    uploadedAt: '3 hari yang lalu',
    status: 'processing',
    summary: false,
    quiz: false,
  },
]

const stats = [
  {
    title: 'Total Materi',
    value: '12',
    change: '+2',
    changeType: 'increase',
    icon: FileText,
  },
  {
    title: 'Soal Dikerjakan',
    value: '87',
    change: '+12',
    changeType: 'increase', 
    icon: Brain,
  },
  {
    title: 'Jam Belajar',
    value: '24.5',
    change: '+3.2',
    changeType: 'increase',
    icon: Clock,
  },
  {
    title: 'Akurasi Rata-rata',
    value: '85%',
    change: '+5%',
    changeType: 'increase',
    icon: TrendingUp,
  },
]

export default function DashboardPage() {
  const [user] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    avatar: null,
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">Quicacademy</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Selamat datang kembali, {user.name.split(' ')[0]}!
          </h1>
          <p className="mt-2 text-gray-600">
            Lanjutkan pembelajaran Anda dan capai target belajar hari ini.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button asChild className="h-auto p-6 flex-col space-y-2">
            <Link href="/upload">
              <Upload className="h-8 w-8" />
              <span className="font-medium">Upload Materi</span>
            </Link>
          </Button>
          <Button variant="outline" asChild className="h-auto p-6 flex-col space-y-2">
            <Link href="/summary">
              <FileText className="h-8 w-8" />
              <span className="font-medium">Lihat Ringkasan</span>
            </Link>
          </Button>
          <Button variant="outline" asChild className="h-auto p-6 flex-col space-y-2">
            <Link href="/quiz">
              <Brain className="h-8 w-8" />
              <span className="font-medium">Latihan Soal</span>
            </Link>
          </Button>
          <Button variant="outline" asChild className="h-auto p-6 flex-col space-y-2">
            <Link href="/progress">
              <BarChart3 className="h-8 w-8" />
              <span className="font-medium">Lihat Progress</span>
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className={`text-sm mt-2 flex items-center ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendingUp className="h-4 w-4 mr-1" />
                    {stat.change} dari minggu lalu
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Materials */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Materi Terbaru</h2>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/materials">
                      Lihat Semua
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {recentMaterials.map((material) => (
                  <div key={material.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium text-gray-900">{material.title}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            material.status === 'processed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {material.status === 'processed' ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Selesai
                              </>
                            ) : (
                              <>
                                <Clock className="h-3 w-3 mr-1" />
                                Diproses
                              </>
                            )}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{material.subject}</p>
                        <p className="text-xs text-gray-500">{material.uploadedAt}</p>
                        
                        {material.status === 'processed' && (
                          <div className="flex items-center space-x-4 mt-3">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/summary/${material.id}`}>
                                <Eye className="h-4 w-4 mr-1" />
                                Ringkasan
                              </Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/quiz/${material.id}`}>
                                <Brain className="h-4 w-4 mr-1" />
                                Latihan
                              </Link>
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4 mr-1" />
                              Export
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Aktivitas Terbaru</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Menyelesaikan quiz Kalkulus
                    </p>
                    <p className="text-xs text-gray-500">Skor: 85% • 2 jam yang lalu</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Upload className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Upload materi Fisika baru
                    </p>
                    <p className="text-xs text-gray-500">1 hari yang lalu</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <FileText className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Ringkasan Kimia dibuat
                    </p>
                    <p className="text-xs text-gray-500">3 hari yang lalu</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="mt-6 bg-blue-50 rounded-xl p-6 border border-blue-100">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Tips Belajar</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start">
                  <div className="h-1.5 w-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                  Upload materi dalam format PDF untuk hasil terbaik
                </li>
                <li className="flex items-start">
                  <div className="h-1.5 w-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                  Kerjakan quiz setelah membaca ringkasan
                </li>
                <li className="flex items-start">
                  <div className="h-1.5 w-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                  Gunakan AI Assistant untuk pertanyaan sulit
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
