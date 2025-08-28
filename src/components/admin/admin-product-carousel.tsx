'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'

interface ProductoCarouselProps {
  titulo: string
  descripcion: string
  productos: any[]
  onAgregarProducto: () => void
  textoBotonAgregar: string
  ProductoCard: React.ComponentType<{ producto: any }>
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

  // Configuración fija: 6 cards por vista (incluyendo el botón agregar)
  const CARDS_PER_VIEW = 6
  const CARD_WIDTH = 176 // w-44 = 11rem = 176px
  const CARD_HEIGHT = 256 // h-64 = 16rem = 256px
  const GAP = 12 // gap-3 = 0.75rem = 12px
  
  // Total de elementos: productos + 1 (botón agregar)
  const totalItems = productos.length + 1
  const maxIndex = Math.max(0, totalItems - CARDS_PER_VIEW)
  const showArrows = totalItems > CARDS_PER_VIEW

  // Navegación con flechas
  const handlePrevious = () => {
    const newIndex = Math.max(0, currentIndex - 1)
    setCurrentIndex(newIndex)
    
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: newIndex * (CARD_WIDTH + GAP),
        behavior: 'smooth'
      })
    }
  }

  const handleNext = () => {
    const newIndex = Math.min(maxIndex, currentIndex + 1)
    setCurrentIndex(newIndex)
    
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: newIndex * (CARD_WIDTH + GAP),
        behavior: 'smooth'
      })
    }
  }

  // Sincronizar scroll con currentIndex
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: currentIndex * (CARD_WIDTH + GAP),
        behavior: 'smooth'
      })
    }
  }, [currentIndex])

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <h2 className="text-xl font-semibold text-white mb-4">{titulo}</h2>
      <p className="text-gray-400 mb-6">{descripcion}</p>
      
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
              width: `${totalItems * (CARD_WIDTH + GAP) - GAP}px`
            }}
          >
            {/* Tarjeta con botón agregar - siempre primera */}
            <div 
              className="flex-shrink-0 bg-gray-700 border-2 border-dashed border-gray-600 rounded-lg p-2 hover:border-gray-500 transition-colors cursor-pointer w-44 h-64 flex flex-col justify-center"
              onClick={onAgregarProducto}
            >
              <div className="flex flex-col items-center justify-center space-y-2 h-full">
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-500 transition-colors">
                  <Plus className="w-4 h-4 text-gray-300" />
                </div>
                <p className="text-gray-400 text-[10px] text-center leading-tight">
                  {textoBotonAgregar}
                </p>
              </div>
            </div>
            
            {/* Tarjetas de productos existentes */}
            {productos.map((producto) => (
              <div key={producto.id} className="flex-shrink-0 w-44">
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
              className={`w-2 h-2 rounded-full transition-colors ${
                currentIndex === index 
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