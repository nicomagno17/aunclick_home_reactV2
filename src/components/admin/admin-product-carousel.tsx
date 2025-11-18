'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { ProductoCarrusel } from '@/types/product'

interface ProductoCarouselProps {
  titulo: string
  descripcion: string
  productos: ProductoCarrusel[]
  onAgregarProducto: () => void
  textoBotonAgregar: string
  ProductoCard: React.ComponentType<{ producto: ProductoCarrusel }>
}

export function AdminProductCarousel({
  titulo,
  descripcion,
  productos,
  onAgregarProducto,
  textoBotonAgregar,
  ProductoCard
}: ProductoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Configuración responsiva: 6 cards en desktop, 2 en mobile (incluyendo el botón agregar)
  const CARDS_PER_VIEW_DESKTOP = 6
  const CARDS_PER_VIEW_MOBILE = 2
  const CARD_WIDTH_DESKTOP = 176 // w-44 = 11rem = 176px
  const CARD_WIDTH_MOBILE = 112 // w-28 = 7rem = 112px
  const CARD_HEIGHT_DESKTOP = 256 // h-64 = 16rem = 256px
  const CARD_HEIGHT_MOBILE = 176 // h-44 = 11rem = 176px
  const GAP = 12 // gap-3 = 0.75rem = 12px

  // Total de elementos: productos + 1 (botón agregar)
  const totalItems = productos.length + 1

  // Responsive breakpoint detection (simplified for server-side rendering)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const cardsPerView = isMobile ? CARDS_PER_VIEW_MOBILE : CARDS_PER_VIEW_DESKTOP
  const cardWidth = isMobile ? CARD_WIDTH_MOBILE : CARD_WIDTH_DESKTOP
  const maxIndex = Math.max(0, totalItems - cardsPerView)
  const showArrows = totalItems > cardsPerView

  // Navegación con flechas
  const handlePrevious = () => {
    const newIndex = Math.max(0, currentIndex - 1)
    setCurrentIndex(newIndex)

    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: newIndex * (cardWidth + GAP),
        behavior: 'smooth'
      })
    }
  }

  const handleNext = () => {
    const newIndex = Math.min(maxIndex, currentIndex + 1)
    setCurrentIndex(newIndex)

    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: newIndex * (cardWidth + GAP),
        behavior: 'smooth'
      })
    }
  }

  // Sincronizar scroll con currentIndex
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: currentIndex * (cardWidth + GAP),
        behavior: 'smooth'
      })
    }
  }, [currentIndex, cardWidth])

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <h2 className="text-base md:text-xl font-semibold text-white mb-4">{titulo}</h2>
      <p className="text-gray-400 text-xs md:text-base mb-6">{descripcion}</p>

      <div className="relative">
        {/* Container con scroll horizontal */}
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide scroll-smooth"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          <div
            className="flex gap-3"
            style={{
              width: `${totalItems * (cardWidth + GAP) - GAP}px`
            }}
          >
            {/* Tarjeta con botón agregar - siempre primera */}
            <div
              className="flex-shrink-0 bg-gray-700 border-2 border-dashed border-gray-600 rounded-lg p-2 hover:border-gray-500 transition-colors cursor-pointer md:w-44 w-28 md:h-64 h-44 flex flex-col justify-center"
              onClick={onAgregarProducto}
            >
              <div className="flex flex-col items-center justify-center space-y-2 h-full">
                <div className="md:w-8 md:h-8 w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-500 transition-colors">
                  <Plus className="md:w-4 md:h-4 w-3 h-3 text-gray-300" />
                </div>
                <p className="text-gray-400 md:text-[10px] text-[8px] text-center leading-tight px-1">
                  {textoBotonAgregar}
                </p>
              </div>
            </div>

            {/* Tarjetas de productos existentes */}
            {productos.map((producto) => (
              <div key={producto.id} className="flex-shrink-0 md:w-44 w-28 h-auto">
                <ProductoCard producto={producto} />
              </div>
            ))}
          </div>
        </div>

        {/* Flechas de navegación */}
        {showArrows && currentIndex > 0 && (
          <button
            onClick={handlePrevious}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-gradient-to-r from-purple-900 to-purple-500 border border-yellow-400 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 z-10"
            aria-label="Ver productos anteriores"
          >
            <ChevronLeft className="h-5 w-5 text-yellow-300" />
          </button>
        )}

        {showArrows && currentIndex < maxIndex && (
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-gradient-to-r from-purple-900 to-purple-500 border border-yellow-400 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 z-10"
            aria-label="Ver más productos"
          >
            <ChevronRight className="h-5 w-5 text-yellow-300" />
          </button>
        )}
      </div>

      {/* Indicadores de posición (opcional) */}
      {showArrows && (
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: maxIndex + 1 }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${currentIndex === index
                  ? 'bg-yellow-400'
                  : 'bg-gray-600 hover:bg-gray-500'
                }`}
              aria-label={`Ir a página ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}