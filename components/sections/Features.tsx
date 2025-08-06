import { Brain, FileText, BarChart3, MessageSquare, Upload, Download } from "lucide-react"

const features = [
  {
    name: "Upload & Ekstraksi Otomatis",
    description: "Upload file PDF atau gambar dan biarkan AI mengekstrak teks secara otomatis dengan teknologi OCR terdepan.",
    icon: Upload,
  },
  {
    name: "Ringkasan Cerdas",
    description: "Dapatkan ringkasan materi dalam berbagai format: poin-poin utama, paragraf ringkas, dan visualisasi konsep.",
    icon: FileText,
  },
  {
    name: "Generator Soal AI",
    description: "Buat soal latihan otomatis dengan berbagai tipe: pilihan ganda, benar/salah, dan isian singkat dengan penjelasan.",
    icon: Brain,
  },
  {
    name: "Pelacakan Progress",
    description: "Monitor kemajuan belajar Anda dengan dashboard analytics yang detail dan insight yang actionable.",
    icon: BarChart3,
  },
  {
    name: "AI Assistant",
    description: "Tanyakan apapun tentang materi Anda kepada AI assistant yang siap membantu 24/7.",
    icon: MessageSquare,
  },
  {
    name: "Ekspor Hasil",
    description: "Download ringkasan dan hasil latihan dalam format PDF yang rapi untuk pembelajaran offline.",
    icon: Download,
  },
]

export function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Fitur Unggulan untuk Pembelajaran Modern
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Teknologi AI terdepan yang dirancang khusus untuk meningkatkan efektivitas belajar Anda
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.name} className="relative group">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-600 text-white group-hover:bg-blue-700 transition-colors">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">
                  {feature.name}
                </h3>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
