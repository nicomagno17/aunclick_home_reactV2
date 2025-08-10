'use client'

import { useState, useCallback } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchBar({ 
  value, 
  onChange, 
  placeholder = "Buscar...", 
  className = ""
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false)
  const router = useRouter()

  const handleClear = () => {
    onChange('')
  }

  const handleSearch = () => {
    if (value.trim()) {
      // Redirigir a página de búsqueda con el término como parámetro
      router.push(`/buscar?q=${encodeURIComponent(value.trim())}`)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch()
    }
  }

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
  }, [onChange])

  return (
    <div className={`relative max-w-2xl mx-auto transition-all duration-300 ${isFocused ? 'scale-105' : ''}`}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white h-5 w-5 md:h-6 md:w-6 z-10" />
        <Input
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`pl-12 pr-16 py-2 text-base md:text-lg text-white placeholder:text-white/70 border-2 transition-all duration-300 cursor-text ${
            isFocused 
              ? 'border-white shadow-lg shadow-white/20' 
              : 'border-white/50 hover:border-white/80'
          } bg-white/10 backdrop-blur-sm ${className}`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        
        {/* Botón de limpiar (X) */}
        {value && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-12 top-1/2 transform -translate-y-1/2 h-6 w-6 md:h-8 md:w-8 p-0 hover:bg-white/20 z-10"
          >
            <X className="h-3 w-3 md:h-4 md:w-4 text-white" />
          </Button>
        )}
        
        {/* Botón de búsqueda (lupa clickeable) */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSearch}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 md:h-10 md:w-10 p-0 hover:bg-white/20 z-10 rounded-full"
          aria-label="Buscar"
        >
          <Search className="h-4 w-4 md:h-5 md:w-5 text-white" />
        </Button>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -inset-1 bg-gradient-to-r from-white/20 to-white/10 rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
    </div>
  )
}