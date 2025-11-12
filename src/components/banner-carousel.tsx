'use client'

import { useState, useEffect } from 'react'

interface BannerCarouselProps {
  children: React.ReactNode[]
  autoPlayInterval?: number
}

export function BannerCarousel({ children, autoPlayInterval = 6000 }: BannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % children.length)
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [children.length, autoPlayInterval])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % children.length)
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + children.length) % children.length)
  }

  return (
    <div className="relative w-full mb-12">
      {/* Contenedor del carrusel */}
      <div className="overflow-hidden rounded-xl">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {children.map((child, index) => (
            <div key={index} className="w-full flex-shrink-0">
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Indicadores */}
      <div className="flex justify-center mt-4 space-x-2">
        {children.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-purple-600 scale-110' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Ir al banner ${index + 1}`}
          />
        ))}
      </div>

      {/* Flechas de navegación (opcional) */}
      <button
        onClick={goToPrevious}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-all duration-200 hover:scale-110 z-10"
        aria-label="Banner anterior"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={goToNext}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-all duration-200 hover:scale-110 z-10"
        aria-label="Siguiente banner"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}