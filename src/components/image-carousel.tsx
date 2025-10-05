'use client'

import { useState, useEffect } from 'react'

interface CarouselSection {
  id: number
  images: string[]
}

export function ImageCarousel() {
  const [currentSection, setCurrentSection] = useState(0)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const [isMobile, setIsMobile] = useState(false)

  // Datos de ejemplo para las secciones del carrusel
  const desktopSections: CarouselSection[] = [
    {
      id: 1,
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1483985988355-7647b8b3e340?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=800&h=400&fit=crop'
      ]
    },
    {
      id: 2,
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=400&fit=crop'
      ]
    },
    {
      id: 3,
      images: [
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1551107696-a4b0c5a0b9b1?w=800&h=400&fit=crop'
      ]
    },
    {
      id: 4,
      images: [
        'https://images.unsplash.com/photo-1526170375885-4d8ec677e1c8?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1551024601-bec78aea804d?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&h=400&fit=crop'
      ]
    }
  ]

  // Crear secciones para móvil: 6 secciones con 2 imágenes cada una
  const mobileSections: CarouselSection[] = []
  let imageIndex = 0
  for (let i = 0; i < 6; i++) {
    const sectionImages: string[] = []
    for (let j = 0; j < 2; j++) {
      if (imageIndex < 12) { // Total de 12 imágenes (4 secciones × 3 imágenes)
        const sectionIndex = Math.floor(imageIndex / 3)
        const imageInSection = imageIndex % 3
        if (desktopSections[sectionIndex] && desktopSections[sectionIndex].images[imageInSection]) {
          sectionImages.push(desktopSections[sectionIndex].images[imageInSection])
        }
        imageIndex++
      }
    }
    mobileSections.push({
      id: i + 1,
      images: sectionImages
    })
  }

  const currentSections = isMobile ? mobileSections : desktopSections

  // Efecto para detectar tamaño de pantalla
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640) // sm breakpoint
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Resetear sección actual cuando cambia el tamaño de pantalla
  useEffect(() => {
    setCurrentSection(0)
  }, [isMobile])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSection(prev => {
        const totalSections = currentSections.length
        if (direction === 'forward') {
          if (prev === totalSections - 1) {
            setDirection('backward')
            return prev - 1
          }
          return prev + 1
        } else {
          if (prev === 0) {
            setDirection('forward')
            return prev + 1
          }
          return prev - 1
        }
      })
    }, 5000) // Cambiado a 5000 ms (5 segundos) para ambos modos

    return () => clearInterval(interval)
  }, [direction, currentSections.length])

  return (
    <div className="w-full bg-gray-50">
      <div className="w-full overflow-hidden">
        <div
          className="flex transition-transform duration-2500 ease-in-out"
          style={{ transform: `translateX(-${currentSection * 100}%)` }}
        >
          {/* Versión Desktop: 4 secciones, cada una con una fila de 3 imágenes una al lado de la otra */}
          <div className="hidden sm:block w-full">
            {desktopSections.map((section, sectionIndex) => (
              <div
                key={section.id}
                className="w-full flex-shrink-0 flex"
              >
                {section.images.map((image, imageIndex) => (
                  <div
                    key={`${section.id}-${imageIndex}`}
                    className="relative group overflow-hidden flex-1"
                  >
                    <img
                      src={image}
                      alt={`Carrusel sección ${section.id} imagen ${imageIndex + 1}`}
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="text-lg font-semibold">Sección {section.id}</div>
                        <div className="text-sm">Imagen {imageIndex + 1}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Versión Móvil: 6 secciones con 2 imágenes cada una, mostradas una sección a la vez */}
          <div className="sm:hidden w-full">
            {mobileSections.map((section, sectionIndex) => (
              <div
                key={section.id}
                className="w-full flex-shrink-0"
              >
                <div className="grid grid-cols-2 gap-0">
                  {section.images.map((image, imageIndex) => (
                    <div
                      key={`${section.id}-${imageIndex}`}
                      className="relative group overflow-hidden"
                    >
                      <img
                        src={image}
                        alt={`Carrusel sección ${section.id} imagen ${imageIndex + 1}`}
                        className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="text-sm font-semibold">Sección {section.id}</div>
                          <div className="text-xs">Imagen {imageIndex + 1}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Indicadores de sección - Desktop */}
      <div className="hidden sm:flex justify-center py-3 space-x-2">
        {desktopSections.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentSection(index)
              setDirection(index > currentSection ? 'forward' : 'backward')
            }}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${index === currentSection
                ? 'bg-purple-600'
                : 'bg-gray-300 hover:bg-gray-400'
              }`}
            aria-label={`Ir a la sección ${index + 1}`}
          />
        ))}
      </div>

      {/* Indicadores de sección - Móvil */}
      <div className="sm:hidden flex justify-center py-2 space-x-2">
        {mobileSections.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentSection(index)
              setDirection(index > currentSection ? 'forward' : 'backward')
            }}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${index === currentSection
                ? 'bg-purple-600'
                : 'bg-gray-300 hover:bg-gray-400'
              }`}
            aria-label={`Ir a la sección ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}