import { Button } from "@/components/ui/button"
import { ArrowRight, Brain, FileText, MessageSquare } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-24 max-w-6xl">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full border bg-white/80 px-4 py-2 text-sm text-gray-600 shadow-sm backdrop-blur-sm mb-8">
            <Brain className="mr-2 h-4 w-4 text-blue-600" />
            Platform Edukasi Berbasis AI Terdepan
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
            Belajar Lebih Cepat
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {" "}dengan AI
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            Quicacademy menggunakan kecerdasan buatan untuk membuat ringkasan materi, 
            soal latihan otomatis, dan membantu Anda memahami pelajaran dengan lebih efektif.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" asChild>
              <Link href="/register" className="flex items-center">
                Mulai Belajar Gratis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="#demo">Lihat Demo</Link>
            </Button>
          </div>

          {/* Feature Pills */}
          <div className="mt-16 flex flex-wrap justify-center gap-4">
            <div className="flex items-center rounded-full bg-white/60 px-4 py-2 text-sm text-gray-700 shadow-sm backdrop-blur-sm">
              <FileText className="mr-2 h-4 w-4 text-blue-600" />
              Ringkasan Otomatis
            </div>
            <div className="flex items-center rounded-full bg-white/60 px-4 py-2 text-sm text-gray-700 shadow-sm backdrop-blur-sm">
              <Brain className="mr-2 h-4 w-4 text-blue-600" />
              Soal Latihan AI
            </div>
            <div className="flex items-center rounded-full bg-white/60 px-4 py-2 text-sm text-gray-700 shadow-sm backdrop-blur-sm">
              <MessageSquare className="mr-2 h-4 w-4 text-blue-600" />
              AI Assistant
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
        </div>
      </div>
    </section>
  )
}
