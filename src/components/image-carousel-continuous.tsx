'use client'

import { useState, useEffect } from 'react'

interface ImageCarouselContinuousProps {
  images: string[]
  autoPlayInterval?: number
  showSource?: boolean
  sourceNames?: string[]
}

export function ImageCarouselContinuous({ images, autoPlayInterval = 6000, showSource = false, sourceNames = [] }: ImageCarouselContinuousProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const [isMobile, setIsMobile] = useState(false)

  // Efecto para detectar tamaño de pantalla
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640) // sm breakpoint
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        const itemsPerView = isMobile ? 2 : 4
        const totalItems = images.length
        
        if (direction === 'forward') {
          if (prev >= totalItems - itemsPerView) {
            setDirection('backward')
            return prev - itemsPerView
          }
          return prev + itemsPerView
        } else {
          if (prev <= 0) {
            setDirection('forward')
            return prev + itemsPerView
          }
          return prev - itemsPerView
        }
      })
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [direction, images.length, isMobile, autoPlayInterval])

  const itemsPerView = isMobile ? 2 : 4
  const totalItems = images.length

  return (
    <div className="w-full bg-gray-50 sm:py-6 py-2 sm:h-64 h-32">
      <div className="w-full h-full overflow-hidden">
        <div 
          className="flex transition-transform duration-1000 ease-in-out"
          style={{ transform: `translateX(-${(currentIndex * 100) / itemsPerView}%)` }}
        >
          {/* Versión Desktop: 12 imágenes, mostrando 4 a la vez */}
          <div className="hidden sm:flex w-full">
            {images.map((image, index) => (
              <div 
                key={index}
                className="flex-shrink-0"
                style={{ width: `${100 / 4}%` }}
              >
                <div className="relative group overflow-hidden mx-1 h-full">
                  <img
                    src={image}
                    alt={`Imagen ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="text-xs font-semibold">Imagen {index + 1}</div>
                    </div>
                  </div>
                  {/* Source Badge - Nombre de la empresa */}
                  {showSource && sourceNames[index] && (
                    <div className="absolute top-1 sm:top-2 left-1 sm:left-2">
                      <span className="bg-white/80 backdrop-blur-sm text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded border border-gray-200">
                        {sourceNames[index]}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Versión Móvil: 12 imágenes, mostrando 2 a la vez */}
          <div className="sm:hidden flex w-full">
            {images.map((image, index) => (
              <div 
                key={index}
                className="flex-shrink-0"
                style={{ width: `${100 / 2}%` }}
              >
                <div className="relative group overflow-hidden mx-1 h-full">
                  <img
                    src={image}
                    alt={`Imagen ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="text-xs font-semibold">Imagen {index + 1}</div>
                    </div>
                  </div>
                  {/* Source Badge - Nombre de la empresa */}
                  {showSource && sourceNames[index] && (
                    <div className="absolute top-1 sm:top-2 left-1 sm:left-2">
                      <span className="bg-white/80 backdrop-blur-sm text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded border border-gray-200">
                        {sourceNames[index]}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Indicadores de posición - Ocultos en móvil */}
      <div className="hidden sm:flex justify-center mt-4 space-x-2">
        {Array.from({ length: Math.ceil(totalItems / itemsPerView) }).map((_, index) => {
          const isActive = currentIndex === index * itemsPerView
          return (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index * itemsPerView)
                setDirection(index * itemsPerView > currentIndex ? 'forward' : 'backward')
              }}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                isActive 
                  ? 'bg-purple-600' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Ir al grupo ${index + 1}`}
            />
          )
        })}
      </div>
    </div>
  )
}