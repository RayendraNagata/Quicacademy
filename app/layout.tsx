import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata = {
  title: 'Quicacademy - Platform Edukasi Pintar Berbasis AI',
  description: 'Platform pembelajaran cerdas dengan teknologi AI untuk membantu siswa belajar lebih efektif melalui ringkasan otomatis dan soal latihan adaptif.',
  keywords: 'edukasi, AI, pembelajaran, ringkasan, soal latihan, platform belajar',
  authors: [{ name: 'Quicacademy Team' }],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="flex min-h-screen flex-col">
          {children}
        </div>
      </body>
    </html>
  )
}
