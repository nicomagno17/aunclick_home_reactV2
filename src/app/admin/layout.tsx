import { Inter } from 'next/font/google'
import '../globals.css'
import { AdminHeader } from '@/components/admin/header'

const inter = Inter({ subsets: ['latin'] })

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`min-h-screen bg-gray-900 ${inter.className}`}>
      <AdminHeader />
      <main className="w-full">
        {children}
      </main>
    </div>
  )
}