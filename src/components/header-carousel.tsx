'use client'

import { useState, useEffect } from 'react'

interface HeaderCarouselProps {
  sections: {
    images: string[]
  }[]
  autoPlayInterval?: number
}

export function HeaderCarousel({ sections, autoPlayInterval = 7000 }: HeaderCarouselProps) {
  const [currentSection, setCurrentSection] = useState(0)
  const [direction, setDirection] = useState(1) // 1 for forward, -1 for backward

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSection(prev => {
        // If we're at the first section and going backward, change direction to forward
        if (prev === 0 && direction === -1) {
          setDirection(1)
          return 1
        }
        // If we're at the last section and going forward, change direction to backward
        else if (prev === sections.length - 1 && direction === 1) {
          setDirection(-1)
          return prev - 1
        }
        // Otherwise, continue in the current direction
        else {
          return prev + direction
        }
      })
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [direction, sections.length, autoPlayInterval])

  return (
    <div className="w-full bg-gray-50 h-80 -mt-4 pt-0"> {/* Increased height and removed margin */}
      <div className="w-full h-full overflow-hidden">
        <div 
          className="flex transition-transform duration-1000 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSection * 100}%)` }}
        >
          {sections.map((section, sectionIndex) => (
            <div 
              key={sectionIndex}
              className="flex-shrink-0 w-full flex justify-center space-x-4 h-full"
            >
              {section.images.map((image, imageIndex) => (
                <div 
                  key={imageIndex}
                  className="relative group overflow-hidden w-1/2 h-full"
                >
                  <img
                    src={image}
                    alt={`Imagen ${imageIndex + 1} de sección ${sectionIndex + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="text-sm font-semibold">Sección {sectionIndex + 1}</div>
                      <div className="text-xs">Imagen {imageIndex + 1}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      {/* Indicadores de posición */}
      <div className="flex justify-center mt-4 space-x-2">
        {sections.map((_, index) => {
          const isActive = currentSection === index
          return (
            <button
              key={index}
              onClick={() => {
                setCurrentSection(index)
                // Set direction based on whether we're moving forward or backward
                setDirection(index > currentSection ? 1 : -1)
              }}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                isActive 
                  ? 'bg-purple-600' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Ir a la sección ${index + 1}`}
            />
          )
        })}
      </div>
    </div>
  )
}