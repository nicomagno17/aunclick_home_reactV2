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
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [featuredProductIndex, setFeaturedProductIndex] = useState(0)
  const [isFeaturedRotationPaused, setIsFeaturedRotationPaused] = useState(false)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)
  const restartAutoPlayRef = useRef<NodeJS.Timeout | null>(null)
  const featuredProductRef = useRef<NodeJS.Timeout | null>(null)

  // Configuración responsive
  const getViewportConfig = () => {
    if (typeof window === 'undefined') return { width: 220, gap: 0, visible: 4 }

    const windowWidth = window.innerWidth
    if (windowWidth < 640) {
      // Mobile - 3 tarjetas completas con menos gap
      return { width: 110, gap: 4, visible: 3 }
    } else if (windowWidth < 1024) {
      // Tablet
      return { width: 150, gap: 16, visible: 3.5 }
    } else {
      // Desktop - 4 tarjetas más grandes sin espacio
      return { width: 220, gap: 0, visible: 4 }
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
    if (!isAutoPlaying || products.length === 0) return

    const autoPlay = () => {
      setCurrentIndex(prev => {
        // Rotación automática: siempre mover 4 tarjetas en desktop, 1 en móvil
        const moveAmount = window.innerWidth >= 1024 ? 4 : 1
        const nextIndex = prev + moveAmount

        // Si llegamos al final o más allá, volver al inicio
        if (nextIndex >= products.length) {
          return 0
        }
        return nextIndex
      })
    }

    // 7 segundos para rotación automática
    const interval = 7000
    autoPlayRef.current = setTimeout(autoPlay, interval)

    return () => {
      if (autoPlayRef.current) {
        clearTimeout(autoPlayRef.current)
      }
    }
  }, [currentIndex, isAutoPlaying, products.length])

  // Función para pausar y reanudar auto-play
  const handleUserInteraction = () => {
    setIsAutoPlaying(false)

    if (autoPlayRef.current) {
      clearTimeout(autoPlayRef.current)
    }

    if (restartAutoPlayRef.current) {
      clearTimeout(restartAutoPlayRef.current)
    }

    // Reanudar auto-play después de 7 segundos
    restartAutoPlayRef.current = setTimeout(() => {
      setIsAutoPlaying(true)
    }, 7000)
  }


  // Arrow navigation
  const handlePrevious = () => {
    // Flechas siempre mueven de 1 en 1
    const newIndex = Math.max(0, currentIndex - 1)
    setCurrentIndex(newIndex)
    handleUserInteraction()
  }

  const handleNext = () => {
    // Flechas siempre mueven de 1 en 1
    const newIndex = Math.min(maxIndex, currentIndex + 1)
    setCurrentIndex(newIndex)
    handleUserInteraction()
  }

  // Auto-rotate featured product (tarjeta dorada)
  useEffect(() => {
    if (products.length === 0 || isFeaturedRotationPaused) {
      // Limpiar el intervalo si está pausado
      if (featuredProductRef.current) {
        clearInterval(featuredProductRef.current)
        featuredProductRef.current = null
      }
      return
    }

    featuredProductRef.current = setInterval(() => {
      setFeaturedProductIndex(prev => (prev + 1) % products.length)
    }, 10000)

    return () => {
      if (featuredProductRef.current) {
        clearInterval(featuredProductRef.current)
      }
    }
  }, [products.length, isFeaturedRotationPaused])

  // Handlers para pausar/reanudar la rotación de la tarjeta dorada
  const handleFeaturedPopupOpen = () => {
    setIsFeaturedRotationPaused(true)
  }

  const handleFeaturedPopupClose = () => {
    setIsFeaturedRotationPaused(false)
  }

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (autoPlayRef.current) {
        clearTimeout(autoPlayRef.current)
      }
      if (restartAutoPlayRef.current) {
        clearTimeout(restartAutoPlayRef.current)
      }
      if (featuredProductRef.current) {
        clearInterval(featuredProductRef.current)
      }
    }
  }, [])

  if (products.length === 0) {
    return null
  }

  return (
    <section className="mb-12">
      <div className="mb-6 px-6 lg:max-w-[1200px] lg:mx-auto">
        <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <div className="relative md:pb-16 pb-4">
        {/* Layout con tarjeta fija a la izquierda en desktop */}
        <div className="flex gap-4 lg:justify-center lg:mx-auto lg:max-w-[1200px]">
          {/* Tarjeta fija con borde dorado - Solo desktop */}
          {products[featuredProductIndex] && (
            <div className="hidden lg:block flex-shrink-0 px-6">
              <div className="w-[220px] border-2 border-yellow-400 rounded-lg bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-50 shadow-2xl overflow-hidden relative">
                {/* Badge "Destacado" */}
                <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-purple-900 px-3 py-1 rounded-full text-xs font-bold z-10 shadow-lg flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  DESTACADO
                </div>

                {/* Producto con animación */}
                <div
                  key={`featured-${products[featuredProductIndex].id}`}
                  className="animate-fadeIn"
                >
                  <AdminProductCard
                    producto={products[featuredProductIndex]}
                    onPopupOpen={handleFeaturedPopupOpen}
                    onPopupClose={handleFeaturedPopupClose}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Container con scroll horizontal */}
          <div className="flex-1 min-w-0 px-2 lg:px-0 lg:pr-6 relative lg:max-w-[880px]">
            <div className="overflow-hidden">
              <div className="overflow-x-auto lg:overflow-hidden scrollbar-hide">
                <div
                  className="flex transition-opacity duration-700 ease-in-out"
                  style={{
                    gap: `${config.gap}px`
                  }}
                >
                  {products.slice(currentIndex, currentIndex + Math.floor(config.visible)).map((product) => (
                    <div
                      key={`${cardKeyPrefix}-${product.id}`}
                      className="flex-shrink-0 animate-fadeIn"
                      style={{ width: config.width }}
                      onClick={() => handleUserInteraction()}
                    >
                      <AdminProductCard producto={product} />
                    </div>
                  ))}
                  {/* Espacios vacíos si no hay suficientes productos */}
                  {Array.from({ length: Math.max(0, Math.floor(config.visible) - products.slice(currentIndex, currentIndex + Math.floor(config.visible)).length) }).map((_, index) => (
                    <div
                      key={`empty-${index}`}
                      className="flex-shrink-0"
                      style={{ width: config.width }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Flechas de navegación - Solo en desktop, dentro del contenedor del carrusel */}
            {currentIndex > 0 && (
              <button
                onClick={handlePrevious}
                className="hidden lg:flex absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-gradient-to-r from-purple-900 to-purple-500 border border-yellow-400 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 z-10 touch-none items-center justify-center"
                aria-label="Ver productos anteriores"
              >
                <ChevronLeft className="h-5 w-5 text-yellow-300" />
              </button>
            )}

            {currentIndex < maxIndex && (
              <button
                onClick={handleNext}
                className="hidden lg:flex absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-900 to-purple-500 border border-yellow-400 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 z-10 touch-none items-center justify-center"
                aria-label="Ver más productos"
              >
                <ChevronRight className="h-5 w-5 text-yellow-300" />
              </button>
            )}
          </div>
        </div>

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