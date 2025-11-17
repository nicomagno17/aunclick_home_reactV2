'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Product } from '@/types/product'
import { AdminProductCard } from '@/components/admin-product-card'

interface ProductRowProps {
  products: Product[]
  onProductClick: (product: Product) => void
}

export function ProductRow({ products, onProductClick }: ProductRowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isForward, setIsForward] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  // Detectar si estamos en móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Auto-scroll solo en móvil
  useEffect(() => {
    if (!isMobile || products.length <= 3) return

    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => {
        const maxIndex = products.length - 3

        // Si estamos avanzando
        if (isForward) {
          if (prevIndex >= maxIndex) {
            setIsForward(false)
            return prevIndex - 1
          }
          return prevIndex + 1
        } else {
          // Si estamos retrocediendo
          if (prevIndex <= 0) {
            setIsForward(true)
            return prevIndex + 1
          }
          return prevIndex - 1
        }
      })
    }, 5000) // Cada 5 segundos

    return () => clearInterval(interval)
  }, [isMobile, isForward, products.length])

  // Scroll suave cuando cambia el índice
  useEffect(() => {
    if (!isMobile || !scrollContainerRef.current) return

    const container = scrollContainerRef.current
    const cardWidth = container.scrollWidth / products.length
    const scrollPosition = currentIndex * cardWidth

    container.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    })

    // Actualizar estado de las flechas
    updateArrowStates()
  }, [currentIndex, isMobile, products.length])

  // Actualizar el estado de las flechas basado en la posición actual
  const updateArrowStates = () => {
    if (!isMobile || !scrollContainerRef.current) return

    const maxIndex = products.length - 3
    setCanScrollLeft(currentIndex > 0)
    setCanScrollRight(currentIndex < maxIndex)
  }

  // Navegar a la izquierda
  const scrollLeft = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  // Navegar a la derecha
  const scrollRight = () => {
    const maxIndex = products.length - 3
    if (currentIndex < maxIndex) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  return (
    <div className="relative">
      {/* Flechas de navegación - Solo móvil */}
      {isMobile && products.length > 3 && (
        <>
          {/* Flecha izquierda */}
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={`absolute left-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-purple-600 text-white shadow-lg flex items-center justify-center transition-all ${
              canScrollLeft ? 'opacity-90 hover:opacity-100 hover:scale-110' : 'opacity-30 cursor-not-allowed'
            }`}
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Flecha derecha */}
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={`absolute right-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-purple-600 text-white shadow-lg flex items-center justify-center transition-all ${
              canScrollRight ? 'opacity-90 hover:opacity-100 hover:scale-110' : 'opacity-30 cursor-not-allowed'
            }`}
            aria-label="Siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Contenedor de productos */}
      <div
        ref={scrollContainerRef}
        className="flex gap-3 md:gap-4 overflow-x-auto md:overflow-x-visible scrollbar-hide snap-x snap-mandatory md:grid md:grid-cols-5"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="flex-shrink-0 w-[calc(33.333%-8px)] md:w-auto snap-start"
            onClick={() => onProductClick(product)}
          >
            <AdminProductCard producto={product} />
          </div>
        ))}
      </div>
    </div>
  )
}
