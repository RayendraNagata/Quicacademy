import Link from "next/link"

export function SimpleHeader() {
  return (
    <header className="bg-white shadow-sm p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Quicacademy</h1>
        <div className="space-x-4">
          <Link href="/login" className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
            Masuk
          </Link>
          <Link href="/register" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Daftar
          </Link>
        </div>
      </div>
    </header>
  )
}
