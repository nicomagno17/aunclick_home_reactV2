'use client'

import Link from 'next/link'
import { Home, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export function AdminHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const isActive = (path: string) => pathname === path
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [userName, setUserName] = useState('Usuario')

  // Get user name from localStorage or use default
  useEffect(() => {
    // In a real application, this would come from your auth context
    // For now, we'll use a default name or get it from localStorage
    const storedUserName = localStorage.getItem('userName') || 'Usuario'
    setUserName(storedUserName)
  }, [])

  // Toggle user menu
  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu)
  }

  // Handle logout
  const handleLogout = () => {
    // Clear authentication state
    localStorage.setItem('isAuthenticated', 'false')
    localStorage.removeItem('userName')
    
    // Close menu
    setShowUserMenu(false)
    
    // Redirect to login page
    router.push('/login')
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showUserMenu && !(event.target as Element).closest('.user-menu-container')) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu])

  return (
    <header className="sticky top-0 z-50 w-full border-b shadow-2xl text-white" style={{ background: 'linear-gradient(90deg, #3b0764 0%, #4c1d95 20%, #6d28d9 40%, var(--yellow-accent) 100%)' }}>
      <div className="flex h-16 items-center justify-between px-6 w-full">
        {/* Left side - Home link */}
        <Link 
          href="/" 
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
        >
          {/* Desktop version - with text */}
          <div className="hidden md:flex items-center space-x-2">
            <Home className="h-5 w-5 text-yellow-300" />
            <span className="font-medium text-white">Home</span>
          </div>
          
          {/* Mobile version - only icon with circular border */}
          <div className="md:hidden flex items-center justify-center w-8 h-8 rounded-full border border-white/80 transition-colors hover:border-white">
            <Home className="h-4 w-4 text-yellow-300" />
          </div>
        </Link>

        {/* Center - Title */}
        <h1 className="text-xl font-bold text-center text-white flex-1">
          Panel Administrador
        </h1>

        {/* Right side - User session */}
        <div className="flex items-center space-x-2">
          <div className="relative user-menu-container">
            {/* Desktop version */}
            <div 
              onClick={toggleUserMenu}
              className="hidden md:flex items-center space-x-2 text-white/90 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-colors cursor-pointer"
            >
              <User className="h-5 w-5 text-yellow-300" />
              <span className="text-white">{userName}</span>
            </div>
            
            {/* Mobile version - only icon with circular border */}
            <div 
              onClick={toggleUserMenu}
              className="md:hidden flex items-center justify-center w-8 h-8 rounded-full border border-white/80 transition-colors hover:border-white cursor-pointer"
            >
              <User className="h-4 w-4 text-yellow-300" />
            </div>
            
            {/* Dropdown menu */}
            {showUserMenu && (
              <div className="absolute top-full right-0 mt-2 w-40 bg-gray-800 rounded-lg shadow-xl border border-gray-600 z-50">
                <div className="py-1">
                  <div className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer transition-colors">
                    <User className="w-4 h-4 text-purple-400" />
                    <span>Mi Perfil</span>
                  </div>
                  <div 
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-red-400" />
                    <span>Cerrar sesión</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}