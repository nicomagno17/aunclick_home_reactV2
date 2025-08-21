'use client'

import Link from 'next/link'
import { Home, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePathname } from 'next/navigation'

export function AdminHeader() {
  const pathname = usePathname()
  const isActive = (path: string) => pathname === path

  // This would typically come from your auth context
  const userName = 'Admin User' // Replace with actual user name from your auth context

  return (
    <header className="sticky top-0 z-50 w-full border-b shadow-2xl text-white" style={{ background: 'linear-gradient(90deg, #3b0764 0%, #4c1d95 20%, #6d28d9 40%, var(--yellow-accent) 100%)' }}>
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left side - Home link */}
        <Link 
          href="/" 
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
        >
          <Home className="h-5 w-5 text-yellow-300" />
          <span className="font-medium text-white">Home</span>
        </Link>

        {/* Center - Title */}
        <h1 className="text-xl font-bold text-center text-white">
          Panel Administrador
        </h1>

        {/* Right side - User session */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" className="flex items-center space-x-2 text-white/90 hover:text-white hover:bg-white/10">
            <User className="h-5 w-5 text-yellow-300" />
            <span className="hidden md:inline-block text-white">{userName}</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-white/80 hover:text-white hover:bg-white/10">
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Cerrar sesión</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
