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
    <header className="sticky top-0 z-50 w-full border-b shadow-2xl text-white" style={{ background: 'linear-gradient(90deg, #1e3a8a 0%, #1e40af 20%, #2563eb 40%, #60a5fa 100%)' }}>
      <div className="flex h-16 items-center justify-between px-6 w-full">
        {/* Left side - Home link */}
        <Link 
          href="/" 
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
        >
          <Home className="h-5 w-5 text-yellow-300" />
          <span className="font-medium text-white">Home</span>
        </Link>

        {/* Center - Title */}
        <h1 className="text-xl font-bold text-center text-white flex-1">
          Panel Administrador
        </h1>

        {/* Right side - User session */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 text-white/90 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-colors cursor-pointer">
            <User className="h-5 w-5 text-yellow-300" />
            <span className="hidden md:inline-block text-white">{userName}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
