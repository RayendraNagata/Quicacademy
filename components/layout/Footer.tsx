import Link from "next/link"
import { BookOpen, Mail, MapPin, Phone } from "lucide-react"

const navigation = {
  product: [
    { name: "Fitur", href: "#features" },
    { name: "Cara Kerja", href: "#how-it-works" },
    { name: "Harga", href: "#pricing" },
    { name: "Demo", href: "/demo" },
  ],
  company: [
    { name: "Tentang Kami", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Karir", href: "/careers" },
    { name: "Kontak", href: "/contact" },
  ],
  support: [
    { name: "Pusat Bantuan", href: "/help" },
    { name: "Tutorial", href: "/tutorials" },
    { name: "FAQ", href: "/faq" },
    { name: "Status", href: "/status" },
  ],
  legal: [
    { name: "Privasi", href: "/privacy" },
    { name: "Syarat Layanan", href: "/terms" },
    { name: "Cookies", href: "/cookies" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-gray-900">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <BookOpen className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold text-white">Quicacademy</span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              Platform edukasi berbasis AI yang membantu pelajar memahami materi dengan lebih cepat dan efektif melalui ringkasan otomatis dan soal latihan cerdas.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-gray-400">
                <Mail className="h-4 w-4 mr-2" />
                <span className="text-sm">hello@quicacademy.com</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Phone className="h-4 w-4 mr-2" />
                <span className="text-sm">+62 21 1234 5678</span>
              </div>
              <div className="flex items-center text-gray-400">
                <MapPin className="h-4 w-4 mr-2" />
                <span className="text-sm">Jakarta, Indonesia</span>
              </div>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-6">Produk</h3>
            <ul className="space-y-3">
              {navigation.product.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-6">Perusahaan</h3>
            <ul className="space-y-3">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-6">Dukungan</h3>
            <ul className="space-y-3">
              {navigation.support.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 Quicacademy. Seluruh hak cipta dilindungi.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {navigation.legal.map((item) => (
              <Link 
                key={item.name} 
                href={item.href} 
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
