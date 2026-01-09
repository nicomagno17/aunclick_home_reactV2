'use client'

import { useState, useRef } from 'react'
import { Package, Home, Building2, Car, Briefcase, PawPrint, Dumbbell, ChevronRight } from 'lucide-react'

interface Category {
  name: string
  icon: React.ReactNode
}

const categories: Category[] = [
  { name: 'Productos', icon: <Package className="w-5 h-5 md:w-6 md:h-6" /> },
  { name: 'Arriendos', icon: <Home className="w-5 h-5 md:w-6 md:h-6" /> },
  { name: 'Propiedades', icon: <Building2 className="w-5 h-5 md:w-6 md:h-6" /> },
  { name: 'Vehiculos', icon: <Car className="w-5 h-5 md:w-6 md:h-6" /> },
  { name: 'Servicios', icon: <Briefcase className="w-5 h-5 md:w-6 md:h-6" /> },
  { name: 'Mascotas', icon: <PawPrint className="w-5 h-5 md:w-6 md:h-6" /> },
  { name: 'Deportes', icon: <Dumbbell className="w-5 h-5 md:w-6 md:h-6" /> },
]

interface CategoryFilterCardsProps {
  onCategorySelect?: (category: string) => void
  selectedCategory?: string | null
  standalone?: boolean // Modo independiente sin banner
}

export function CategoryFilterCards({ onCategorySelect, selectedCategory, standalone = false }: CategoryFilterCardsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showArrow, setShowArrow] = useState(true)

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setShowArrow(scrollLeft + clientWidth < scrollWidth - 10)
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' })
    }
  }

  // Modo standalone: sin posicionamiento absoluto ni transformaciones
  if (standalone) {
    return (
      <div className="w-full">
        {/* Desktop: tarjetas distribuidas en todo el ancho */}
        <div className="hidden md:flex justify-between items-center gap-3 px-12 mx-auto max-w-7xl">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => onCategorySelect?.(category.name)}
              className={`flex flex-col items-center justify-center rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 p-3 flex-1 min-w-0 h-24 border ${
                selectedCategory === category.name
                  ? 'bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700 text-yellow-300 border-yellow-400 scale-105'
                  : 'bg-gradient-to-br from-purple-300 via-purple-200 to-yellow-100 hover:from-purple-400 hover:via-purple-300 hover:to-yellow-200 text-purple-800 border-purple-300'
              }`}
            >
              <div className="mb-1.5">
                {category.icon}
              </div>
              <span className="text-xs font-semibold text-center leading-tight">
                {category.name}
              </span>
            </button>
          ))}
        </div>

        {/* Mobile: scroll horizontal con flecha */}
        <div className="md:hidden relative px-4">
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="overflow-x-auto scrollbar-hide"
          >
            <div className="flex gap-2 pb-2" style={{ minWidth: 'min-content' }}>
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => onCategorySelect?.(category.name)}
                  className={`flex-shrink-0 flex items-center justify-center rounded-lg shadow-md transition-all duration-300 active:scale-95 w-14 h-14 border ${
                    selectedCategory === category.name
                      ? 'bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700 text-yellow-300 border-yellow-400'
                      : 'bg-gradient-to-br from-purple-300 via-purple-200 to-yellow-100 active:from-purple-400 active:via-purple-300 active:to-yellow-200 text-purple-800 border-purple-300'
                  }`}
                  title={category.name}
                >
                  {category.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Flecha derecha */}
          {showArrow && (
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-2 bg-purple-400 hover:bg-purple-500 text-white rounded-full p-1.5 shadow-lg transition-all duration-200 hover:scale-110 z-10"
              aria-label="Deslizar a la derecha"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20">
      {/* Desktop: tarjetas distribuidas en todo el ancho - 30% arriba, 70% abajo */}
      <div className="hidden md:flex justify-between items-center gap-3 px-12 mx-auto max-w-7xl" style={{ transform: 'translateY(70%)' }}>
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => onCategorySelect?.(category.name)}
            className={`flex flex-col items-center justify-center rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 p-3 flex-1 min-w-0 h-24 border ${
              selectedCategory === category.name
                ? 'bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700 text-yellow-300 border-yellow-400 scale-105'
                : 'bg-gradient-to-br from-purple-300 via-purple-200 to-yellow-100 hover:from-purple-400 hover:via-purple-300 hover:to-yellow-200 text-purple-800 border-purple-300'
            }`}
          >
            <div className="mb-1.5">
              {category.icon}
            </div>
            <span className="text-xs font-semibold text-center leading-tight">
              {category.name}
            </span>
          </button>
        ))}
      </div>

      {/* Mobile: scroll horizontal con flecha - 50% arriba, 50% abajo */}
      <div className="md:hidden relative px-4 transform translate-y-1/2">
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="overflow-x-auto scrollbar-hide"
        >
          <div className="flex gap-2 pb-2" style={{ minWidth: 'min-content' }}>
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => onCategorySelect?.(category.name)}
                className={`flex-shrink-0 flex items-center justify-center rounded-lg shadow-md transition-all duration-300 active:scale-95 w-14 h-14 border ${
                  selectedCategory === category.name
                    ? 'bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700 text-yellow-300 border-yellow-400'
                    : 'bg-gradient-to-br from-purple-300 via-purple-200 to-yellow-100 active:from-purple-400 active:via-purple-300 active:to-yellow-200 text-purple-800 border-purple-300'
                }`}
                title={category.name}
              >
                {category.icon}
              </button>
            ))}
          </div>
        </div>

        {/* Flecha derecha */}
        {showArrow && (
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-2 bg-purple-400 hover:bg-purple-500 text-white rounded-full p-1.5 shadow-lg transition-all duration-200 hover:scale-110 z-10"
            aria-label="Deslizar a la derecha"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
