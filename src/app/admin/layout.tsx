'use client'

import { useEffect } from 'react'
import { SessionProvider } from 'next-auth/react'
import { AdminHeader } from '@/components/admin/header'
import AdminAside from '@/components/admin/AdminAside'
import { ResponsiveContentContainer } from '@/components/admin/ResponsiveContentContainer'
import { usePathname } from 'next/navigation'
import { NavigationProvider, useNavigation } from '@/components/admin/NavigationContext'
import { cn } from '@/lib/utils'

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { windowWidth, isCollapsed, isMobileMenuOpen } = useNavigation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 transition-all duration-300 ease-in-out">
      <div className="flex relative">
        <AdminAside />
        <div className={cn(
          'flex-1 flex flex-col transition-all duration-300 ease-in-out relative min-h-screen',
          // Add margin-left to compensate for fixed sidebar
          (() => {
            if (windowWidth < 768) return 'ml-0' // Mobile: sidebar overlay
            if (windowWidth < 1024) return 'ml-0' // Tablet: sidebar overlay
            return isCollapsed ? 'ml-16' : 'ml-72' // Desktop: compensate for sidebar
          })()
        )}>
          <AdminHeader />
          <main className="flex-1 relative">
            <ResponsiveContentContainer>
              {children}
            </ResponsiveContentContainer>
          </main>
        </div>
      </div>

      {/* Mobile menu overlay - improved */}
      {isMobileMenuOpen && windowWidth < 1024 && (
        <div
          className="fixed inset-0 bg-black/60 z-30 backdrop-blur-sm md:hidden transition-opacity duration-300"
          onClick={() => {
            // Close mobile menu when clicking overlay
            const event = new CustomEvent('closeMobileMenu')
            window.dispatchEvent(event)
          }}
        />
      )}
    </div>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <SessionProvider>
      <NavigationProvider>
        <AdminLayoutContent>
          {children}
        </AdminLayoutContent>
      </NavigationProvider>
    </SessionProvider>
  )
}
