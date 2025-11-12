'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface InfoBannerCarouselProps {
  children: React.ReactNode[]
  autoPlayInterval?: number
}

export function InfoBannerCarousel({ children, autoPlayInterval = 5000 }: InfoBannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        if (direction === 'forward') {
          if (prevIndex === children.length - 1) {
            setDirection('backward')
            return prevIndex - 1
          }
          return prevIndex + 1
        } else {
          if (prevIndex === 0) {
            setDirection('forward')
            return prevIndex + 1
          }
          return prevIndex - 1
        }
      })
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [children.length, autoPlayInterval, direction])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    // Si vamos a un índice mayor, dirección es forward; si es menor, backward
    setDirection(index > currentIndex ? 'forward' : 'backward')
  }

  const goToNext = () => {
    if (direction === 'forward') {
      if (currentIndex === children.length - 1) {
        setDirection('backward')
        setCurrentIndex(currentIndex - 1)
      } else {
        setCurrentIndex(currentIndex + 1)
      }
    } else {
      if (currentIndex === 0) {
        setDirection('forward')
        setCurrentIndex(currentIndex + 1)
      } else {
        setCurrentIndex(currentIndex - 1)
      }
    }
  }

  const goToPrevious = () => {
    if (direction === 'forward') {
      if (currentIndex === 0) {
        setDirection('backward')
        setCurrentIndex(currentIndex + 1)
      } else {
        setCurrentIndex(currentIndex - 1)
      }
    } else {
      if (currentIndex === children.length - 1) {
        setDirection('forward')
        setCurrentIndex(currentIndex - 1)
      } else {
        setCurrentIndex(currentIndex + 1)
      }
    }
  }

  return (
    <div className="relative w-full mb-8 md:mb-10">
      {/* Contenedor del carrusel */}
      <div className="overflow-hidden rounded-2xl">
        <div 
          className="flex transition-transform duration-700 ease-in-out"
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
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-white scale-125' 
                : 'bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Ir al banner ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}