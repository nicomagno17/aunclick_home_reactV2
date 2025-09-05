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
  const [currentImage, setCurrentImage] = useState(0)
  const [direction, setDirection] = useState(1) // 1 for forward, -1 for backward
  const [isMobile, setIsMobile] = useState(false)

  // Verificar si es modo móvil
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 640) // Tailwind sm breakpoint
    }
    
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  // En modo móvil, manejar las imágenes individualmente
  useEffect(() => {
    if (!isMobile) return
    
    const interval = setInterval(() => {
      setCurrentImage(prev => {
        const totalImages = sections.reduce((acc, section) => acc + section.images.length, 0)
        const currentIndex = getCurrentImageIndex()
        
        // Si llegamos a la primera imagen y vamos hacia atrás, cambiar dirección a adelante
        if (currentIndex === 0 && direction === -1) {
          setDirection(1)
          return 1
        }
        // Si llegamos a la última imagen y vamos hacia adelante, cambiar dirección a atrás
        else if (currentIndex === totalImages - 1 && direction === 1) {
          setDirection(-1)
          return currentIndex - 1
        }
        // De lo contrario, continuar en la dirección actual
        else {
          return currentIndex + direction
        }
      })
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [direction, sections, autoPlayInterval, isMobile])

  // En modo desktop, manejar las secciones como antes
  useEffect(() => {
    if (isMobile) return
    
    const interval = setInterval(() => {
      setCurrentSection(prev => {
        // Si estamos en la primera sección y vamos hacia atrás, cambiar dirección a adelante
        if (prev === 0 && direction === -1) {
          setDirection(1)
          return 1
        }
        // Si estamos en la última sección y vamos hacia adelante, cambiar dirección a atrás
        else if (prev === sections.length - 1 && direction === 1) {
          setDirection(-1)
          return prev - 1
        }
        // De lo contrario, continuar en la dirección actual
        else {
          return prev + direction
        }
      })
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [direction, sections.length, autoPlayInterval, isMobile])

  // Obtener el índice de imagen actual en modo móvil
  const getCurrentImageIndex = () => {
    let index = 0
    for (let i = 0; i < currentSection; i++) {
      index += sections[i].images.length
    }
    return index + currentImage
  }

  // Obtener la imagen actual en modo móvil
  const getCurrentImage = () => {
    let imageIndex = 0
    for (const section of sections) {
      if (imageIndex + section.images.length > getCurrentImageIndex()) {
        return section.images[getCurrentImageIndex() - imageIndex]
      }
      imageIndex += section.images.length
    }
    return sections[0].images[0]
  }

  // Obtener todas las imágenes para el modo móvil
  const getAllImages = () => {
    return sections.flatMap(section => section.images)
  }

  return (
    <div className="w-full bg-gray-50 h-80 -mt-4 pt-0"> {/* Increased height and removed margin */}
      <div className="w-full h-full overflow-hidden">
        {isMobile ? (
          // Modo móvil: mostrar imágenes individuales
          <div 
            className="flex transition-transform duration-1000 ease-in-out h-full"
            style={{ transform: `translateX(-${getCurrentImageIndex() * 100}%)` }}
          >
            {getAllImages().map((image, index) => (
              <div 
                key={index}
                className="flex-shrink-0 w-full h-full"
              >
                <img
                  src={image}
                  alt={`Imagen ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          // Modo desktop: mostrar secciones como antes
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
        )}
      </div>
      
      {/* Indicadores de posición */}
      <div className="flex justify-center mt-4 space-x-2">
        {isMobile ? (
          // Indicadores para modo móvil
          getAllImages().map((_, index) => {
            const isActive = getCurrentImageIndex() === index
            return (
              <button
                key={index}
                onClick={() => {
                  // Encontrar a qué sección e imagen corresponde este índice
                  let accumulated = 0
                  for (let i = 0; i < sections.length; i++) {
                    if (index < accumulated + sections[i].images.length) {
                      setCurrentSection(i)
                      setCurrentImage(index - accumulated)
                      setDirection(index > getCurrentImageIndex() ? 1 : -1)
                      break
                    }
                    accumulated += sections[i].images.length
                  }
                }}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  isActive 
                    ? 'bg-purple-600' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Ir a la imagen ${index + 1}`}
              />
            )
          })
        ) : (
          // Indicadores para modo desktop
          sections.map((_, index) => {
            const isActive = currentSection === index
            return (
              <button
                key={index}
                onClick={() => {
                  setCurrentSection(index)
                  // Establecer dirección basada en si nos movemos hacia adelante o atrás
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
          })
        )}
      </div>
    </div>
  )
}