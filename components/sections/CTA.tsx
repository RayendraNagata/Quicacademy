import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"

const benefits = [
  "Akses gratis tanpa batas",
  "AI processing berkualitas tinggi", 
  "Dashboard analytics lengkap",
  "Export ke PDF",
  "Support 24/7"
]

export function CTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Siap Meningkatkan Cara Belajar Anda?
          </h2>
          <p className="mt-6 text-xl text-blue-100 max-w-2xl mx-auto">
            Bergabung dengan ribuan pelajar yang sudah merasakan manfaat belajar dengan AI
          </p>

          {/* Benefits List */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center justify-center lg:justify-start">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2 flex-shrink-0" />
                <span className="text-blue-100 text-sm">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 min-w-[200px]" asChild>
              <Link href="/register" className="flex items-center">
                Mulai Sekarang
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-blue-300 text-blue-100 hover:bg-blue-600 hover:text-white min-w-[200px]" 
              asChild
            >
              <Link href="/demo">Coba Demo</Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-8 border-t border-blue-500">
            <p className="text-blue-200 text-sm">
              Dipercaya oleh 10,000+ pelajar di seluruh Indonesia
            </p>
            <div className="mt-4 flex justify-center items-center space-x-8 opacity-60">
              <div className="text-blue-200 text-xs">🎓 Universitas</div>
              <div className="text-blue-200 text-xs">🏫 SMA/SMK</div>
              <div className="text-blue-200 text-xs">📚 Pelajar Mandiri</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
