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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left side - Home link */}
        <Link 
          href="/" 
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
        >
          <Home className="h-5 w-5 text-purple-700 dark:text-purple-400" />
          <span className="font-medium">Home</span>
        </Link>

        {/* Center - Title */}
        <h1 className="text-xl font-bold text-center">
          Panel Administrador
        </h1>

        {/* Right side - User session */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" className="flex items-center space-x-2">
            <User className="h-5 w-5 text-purple-700 dark:text-purple-400" />
            <span className="hidden md:inline-block">{userName}</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Cerrar sesión</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
