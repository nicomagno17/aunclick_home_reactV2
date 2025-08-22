import { AdminHeader } from '@/components/admin/header'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-900">
      <AdminHeader />
      <main className="w-full">
        {children}
      </main>
    </div>
  )
}
