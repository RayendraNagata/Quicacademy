import { Upload, Brain, BookOpen, TrendingUp } from "lucide-react"

const steps = [
  {
    name: "Upload Materi",
    description: "Upload file PDF, gambar, atau dokumen materi pelajaran Anda ke platform kami.",
    icon: Upload,
    step: 1,
  },
  {
    name: "AI Memproses",
    description: "AI kami menganalisis dan memahami konten materi untuk membuat ringkasan yang akurat.",
    icon: Brain,
    step: 2,
  },
  {
    name: "Belajar & Latihan",
    description: "Pelajari ringkasan yang telah dibuat dan kerjakan soal latihan yang disesuaikan.",
    icon: BookOpen,
    step: 3,
  },
  {
    name: "Pantau Progress",
    description: "Lihat kemajuan belajar Anda dan dapatkan rekomendasi untuk meningkatkan pemahaman.",
    icon: TrendingUp,
    step: 4,
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Cara Kerja Quicacademy
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Proses pembelajaran yang simple dan efektif dalam 4 langkah mudah
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.name} className="relative">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gray-200 -translate-x-1/2 translate-y-1/2" />
                )}
                
                <div className="flex flex-col items-center text-center">
                  {/* Step Number */}
                  <div className="relative">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white">
                      <step.icon className="h-8 w-8" />
                    </div>
                    <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-600">{step.step}</span>
                    </div>
                  </div>

                  <h3 className="mt-6 text-xl font-semibold text-gray-900">
                    {step.name}
                  </h3>
                  <p className="mt-4 text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Demo Preview */}
        <div className="mt-20 rounded-2xl bg-white p-8 shadow-xl">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900">
              Lihat Quicacademy Beraksi
            </h3>
            <p className="mt-4 text-gray-600">
              Demo interaktif menunjukkan bagaimana AI memproses materi Anda
            </p>
            <div className="mt-8 aspect-video rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
              <div className="text-center">
                <div className="h-16 w-16 mx-auto rounded-full bg-blue-600 flex items-center justify-center mb-4">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <p className="text-gray-600">Demo Video Coming Soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
