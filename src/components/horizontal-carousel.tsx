'use client'

import { useState, useRef, useEffect } from 'react'
import { AdminProductCard } from '@/components/admin-product-card'
import { Product } from '@/types/product'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface HorizontalCarouselProps {
  title: string
  subtitle: string
  products: Product[]
  cardKeyPrefix: string
}

export function HorizontalCarousel({ title, subtitle, products, cardKeyPrefix }: HorizontalCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)
  const restartAutoPlayRef = useRef<NodeJS.Timeout | null>(null)

  // Configuración responsive
  const getViewportConfig = () => {
    if (typeof window === 'undefined') return { width: 176, gap: 12, visible: 4 }
    
    const windowWidth = window.innerWidth
    if (windowWidth < 640) {
      // Mobile
      return { width: 112, gap: 12, visible: 2.5 }
    } else if (windowWidth < 1024) {
      // Tablet
      return { width: 150, gap: 16, visible: 3.5 }
    } else {
      // Desktop
      return { width: 176, gap: 12, visible: 4 }
    }
  }

  const [config, setConfig] = useState(getViewportConfig())
  
  // Efecto para actualizar configuración en resize
  useEffect(() => {
    const handleResize = () => {
      setConfig(getViewportConfig())
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const maxIndex = Math.max(0, products.length - Math.floor(config.visible))

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || products.length <= Math.floor(config.visible)) return

    const autoPlay = () => {
      setCurrentIndex(prev => {
        if (prev >= maxIndex) {
          return 0 // Volver al inicio
        }
        return prev + 1
      })
    }

    autoPlayRef.current = setTimeout(autoPlay, 4000)

    return () => {
      if (autoPlayRef.current) {
        clearTimeout(autoPlayRef.current)
      }
    }
  }, [currentIndex, isAutoPlaying, maxIndex, config.visible, products.length])

  // Función para pausar y reanudar auto-play
  const handleUserInteraction = () => {
    setIsAutoPlaying(false)
    
    if (autoPlayRef.current) {
      clearTimeout(autoPlayRef.current)
    }
    
    if (restartAutoPlayRef.current) {
      clearTimeout(restartAutoPlayRef.current)
    }
    
    // Reanudar auto-play después de 5 segundos
    restartAutoPlayRef.current = setTimeout(() => {
      setIsAutoPlaying(true)
    }, 5000)
  }

  // Touch/Mouse events
  const handleStart = (clientX: number) => {
    if (!scrollContainerRef.current) return
    
    setIsDragging(true)
    setStartX(clientX)
    setScrollLeft(scrollContainerRef.current.scrollLeft)
    handleUserInteraction()
  }

  const handleMove = (clientX: number) => {
    if (!isDragging || !scrollContainerRef.current) return
    
    const x = clientX
    const walk = (x - startX) * 2 // Multiplicador para mayor sensibilidad
    scrollContainerRef.current.scrollLeft = scrollLeft - walk
  }

  const handleEnd = () => {
    if (!isDragging || !scrollContainerRef.current) return
    
    setIsDragging(false)
    
    // Snap to nearest card position
    const scrollPosition = scrollContainerRef.current.scrollLeft
    const cardWidth = config.width + config.gap
    const nearestIndex = Math.round(scrollPosition / cardWidth)
    const clampedIndex = Math.max(0, Math.min(nearestIndex, maxIndex))
    
    setCurrentIndex(clampedIndex)
    scrollContainerRef.current.scrollTo({
      left: clampedIndex * cardWidth,
      behavior: 'smooth'
    })
  }

  // Arrow navigation
  const handlePrevious = () => {
    const newIndex = Math.max(0, currentIndex - 1)
    setCurrentIndex(newIndex)
    handleUserInteraction()
    
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: newIndex * (config.width + config.gap),
        behavior: 'smooth'
      })
    }
  }

  const handleNext = () => {
    const newIndex = Math.min(maxIndex, currentIndex + 1)
    setCurrentIndex(newIndex)
    handleUserInteraction()
    
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: newIndex * (config.width + config.gap),
        behavior: 'smooth'
      })
    }
  }

  // Efecto para sincronizar scroll con currentIndex
  useEffect(() => {
    if (scrollContainerRef.current && !isDragging) {
      scrollContainerRef.current.scrollTo({
        left: currentIndex * (config.width + config.gap),
        behavior: 'smooth'
      })
    }
  }, [currentIndex, config.width, config.gap, isDragging])

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (autoPlayRef.current) {
        clearTimeout(autoPlayRef.current)
      }
      if (restartAutoPlayRef.current) {
        clearTimeout(restartAutoPlayRef.current)
      }
    }
  }, [])

  if (products.length === 0) {
    return null
  }

  return (
    <section className="mb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      
      <div className="relative">
        {/* Container con scroll horizontal */}
        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onTouchStart={(e) => handleStart(e.touches[0].clientX)}
          onTouchMove={(e) => handleMove(e.touches[0].clientX)}
          onTouchEnd={handleEnd}
          onMouseDown={(e) => {
            e.preventDefault()
            handleStart(e.clientX)
          }}
          onMouseMove={(e) => isDragging && handleMove(e.clientX)}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
        >
          <div 
            className="flex gap-3 pb-2"
            style={{
              width: `${products.length * (config.width + config.gap) - config.gap}px`
            }}
          >
            {products.map((product) => (
              <div 
                key={`${cardKeyPrefix}-${product.id}`}
                className="flex-shrink-0"
                style={{ width: config.width }}
                onClick={() => handleUserInteraction()}
              >
                <AdminProductCard producto={product} />
              </div>
            ))}
          </div>
        </div>
        
        {/* Flechas de navegación - Solo en desktop */}
        {currentIndex > 0 && (
          <button
            onClick={handlePrevious}
            className="hidden sm:flex absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-gradient-to-r from-purple-900 to-purple-500 border border-yellow-400 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 z-10 touch-none items-center justify-center"
            aria-label="Ver productos anteriores"
          >
            <ChevronLeft className="h-5 w-5 text-yellow-300" />
          </button>
        )}

        {currentIndex < maxIndex && (
          <button
            onClick={handleNext}
            className="hidden sm:flex absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-gradient-to-r from-purple-900 to-purple-500 border border-yellow-400 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 z-10 touch-none items-center justify-center"
            aria-label="Ver más productos"
          >
            <ChevronRight className="h-5 w-5 text-yellow-300" />
          </button>
        )}

        {/* Indicadores de posición (opcional, para móvil) */}
        {products.length > Math.floor(config.visible) && (
          <div className="flex justify-center mt-4 gap-1 md:hidden">
            {Array.from({ length: maxIndex + 1 }, (_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index)
                  handleUserInteraction()
                }}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  index === currentIndex ? 'bg-purple-500' : 'bg-gray-300'
                }`}
                aria-label={`Ir a posición ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}