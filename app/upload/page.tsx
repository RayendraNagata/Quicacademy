'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  BookOpen, 
  Upload, 
  FileText, 
  Image, 
  X,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Eye,
  Download
} from 'lucide-react'

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  status: 'uploading' | 'processing' | 'completed' | 'error'
  progress: number
  preview?: string
}

export default function UploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = (fileList: FileList) => {
    const newFiles: UploadedFile[] = Array.from(fileList).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading',
      progress: 0,
    }))

    setFiles(prev => [...prev, ...newFiles])

    // Simulate upload process
    newFiles.forEach(file => {
      simulateUpload(file.id)
    })
  }

  const simulateUpload = (fileId: string) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 30
      
      setFiles(prev => prev.map(file => 
        file.id === fileId 
          ? { ...file, progress: Math.min(progress, 100) }
          : file
      ))

      if (progress >= 100) {
        clearInterval(interval)
        // Simulate processing
        setTimeout(() => {
          setFiles(prev => prev.map(file => 
            file.id === fileId 
              ? { ...file, status: 'processing', progress: 0 }
              : file
          ))
          
          // Simulate completion
          setTimeout(() => {
            setFiles(prev => prev.map(file => 
              file.id === fileId 
                ? { ...file, status: 'completed', progress: 100 }
                : file
            ))
          }, 3000)
        }, 1000)
      }
    }, 200)
  }

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
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
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Upload Materi Pembelajaran</h1>
          <p className="mt-2 text-gray-600">
            Upload file PDF atau gambar materi pelajaran untuk mendapatkan ringkasan dan soal latihan otomatis
          </p>
        </div>

        {/* Upload Area */}
        <div className="mb-8">
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              className="sr-only"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleChange}
            />
            
            <div className="space-y-4">
              <div className="flex justify-center">
                <Upload className="h-16 w-16 text-gray-400" />
              </div>
              
              <div>
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Pilih File
                </label>
                <p className="mt-2 text-gray-600">atau drag & drop file di sini</p>
              </div>
              
              <div className="text-sm text-gray-500">
                <p>Format yang didukung: PDF, JPG, PNG</p>
                <p>Ukuran maksimal: 10MB per file</p>
              </div>
            </div>
          </div>
        </div>

        {/* Uploaded Files */}
        {files.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">File yang Diupload</h2>
            </div>
            
            <div className="divide-y divide-gray-100">
              {files.map((file) => (
                <div key={file.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        {file.type.includes('pdf') ? (
                          <FileText className="h-10 w-10 text-red-500" />
                        ) : (
                          <Image className="h-10 w-10 text-blue-500" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{file.name}</h3>
                        <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                        
                        {/* Status */}
                        <div className="mt-2 flex items-center space-x-2">
                          {file.status === 'uploading' && (
                            <>
                              <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full transition-all"
                                  style={{ width: `${file.progress}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-500">Uploading...</span>
                            </>
                          )}
                          
                          {file.status === 'processing' && (
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                              <span className="text-sm text-blue-600">Memproses dengan AI...</span>
                            </div>
                          )}
                          
                          {file.status === 'completed' && (
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <span className="text-sm text-green-600">Selesai diproses</span>
                            </div>
                          )}
                          
                          {file.status === 'error' && (
                            <div className="flex items-center space-x-2">
                              <AlertCircle className="h-5 w-5 text-red-600" />
                              <span className="text-sm text-red-600">Error saat memproses</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {file.status === 'completed' && (
                        <>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Lihat Ringkasan
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </>
                      )}
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeFile(file.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-100">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Tips untuk Upload yang Optimal</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start">
              <div className="h-1.5 w-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>Pastikan file PDF memiliki teks yang bisa dicopy (bukan scan gambar)</span>
            </li>
            <li className="flex items-start">
              <div className="h-1.5 w-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>Untuk gambar, pastikan teks terlihat jelas dan tidak buram</span>
            </li>
            <li className="flex items-start">
              <div className="h-1.5 w-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>Berikan nama file yang deskriptif (contoh: "Matematika-Kalkulus-Bab1.pdf")</span>
            </li>
            <li className="flex items-start">
              <div className="h-1.5 w-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>Proses AI membutuhkan waktu 1-3 menit tergantung ukuran file</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
