'use client'

import { useState, useEffect } from 'react'

interface ImageCarouselSectionsProps {
  sections: {
    id: number
    images: string[]
    title?: string
  }[]
  autoPlayInterval?: number
}

export function ImageCarouselSections({ sections, autoPlayInterval = 5000 }: ImageCarouselSectionsProps) {
  const [currentSection, setCurrentSection] = useState(0)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const [isMobile, setIsMobile] = useState(false)

  // Crear diferentes estructuras para desktop y móvil
  const desktopSections = sections.slice(0, 4).map((section, index) => ({
    ...section,
    images: section.images.slice(0, 3) // 3 imágenes por sección para desktop
  }))

  interface CarouselSection {
    id: number;
    title?: string;
    images: string[];
  }

  const mobileSections: CarouselSection[] = []
  let imageIndex = 0
  for (let i = 0; i < 6; i++) {
    const sectionImages: string[] = []
    for (let j = 0; j < 2; j++) {
      if (imageIndex < 12) { // Total de 12 imágenes
        const sectionIndex = Math.floor(imageIndex / 3)
        const imageInSection = imageIndex % 3
        if (sections[sectionIndex] && sections[sectionIndex].images[imageInSection]) {
          sectionImages.push(sections[sectionIndex].images[imageInSection])
        }
        imageIndex++
      }
    }
    mobileSections.push({
      id: i + 1,
      title: `Sección ${i + 1}`,
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
      setCurrentSection((prevIndex) => {
        const totalSections = currentSections.length
        if (direction === 'forward') {
          if (prevIndex === totalSections - 1) {
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
  }, [currentSections.length, autoPlayInterval, direction])

  const goToSection = (index: number) => {
    setCurrentSection(index)
    // Determinar dirección basada en la sección actual y la nueva
    if (index > currentSection) {
      setDirection('forward')
    } else if (index < currentSection) {
      setDirection('backward')
    }
  }

  return (
    <div className="relative w-full my-12">
      {/* Contenedor principal del carrusel */}
      <div className="overflow-hidden rounded-xl">
        <div
          className="flex transition-transform duration-2000 ease-in-out"
          style={{ transform: `translateX(-${currentSection * 100}%)` }}
        >
          {/* Versión Desktop: 4 secciones con 3 imágenes cada una */}
          <div className="hidden sm:block w-full">
            {desktopSections.map((section, sectionIndex) => (
              <div key={section.id} className="w-full flex-shrink-0">
                <div className="p-6">
                  {section.title && (
                    <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
                      {section.title}
                    </h3>
                  )}
                  <div className="grid grid-cols-3 gap-4">
                    {section.images.map((image, imageIndex) => (
                      <div key={imageIndex} className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                        <img
                          src={image}
                          alt={`Imagen ${imageIndex + 1} de sección ${sectionIndex + 1}`}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Versión Móvil: 6 secciones con 2 imágenes cada una */}
          <div className="sm:hidden w-full">
            {mobileSections.map((section, sectionIndex) => (
              <div key={section.id} className="w-full flex-shrink-0">
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-2">
                    {section.images.map((image, imageIndex) => (
                      <div key={imageIndex} className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                        <img
                          src={image}
                          alt={`Imagen ${imageIndex + 1} de sección ${sectionIndex + 1}`}
                          className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Indicadores de sección - Desktop */}
      <div className="hidden sm:flex justify-center mt-6 space-x-3">
        {desktopSections.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSection(index)}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${index === currentSection
                ? 'bg-purple-600 scale-125'
                : 'bg-gray-300 hover:bg-gray-400'
              }`}
            aria-label={`Ir a la sección ${index + 1}`}
          />
        ))}
      </div>

      {/* Indicadores de sección - Móvil */}
      <div className="sm:hidden flex justify-center mt-4 space-x-2">
        {mobileSections.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSection(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSection
                ? 'bg-purple-600 scale-125'
                : 'bg-gray-300 hover:bg-gray-400'
              }`}
            aria-label={`Ir a la sección ${index + 1}`}
          />
        ))}
      </div>

      {/* Flechas de navegación */}
      <button
        onClick={() => {
          const totalSections = currentSections.length
          if (currentSection > 0) {
            goToSection(currentSection - 1)
          }
        }}
        disabled={currentSection === 0}
        className={`absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-3 transition-all duration-200 hover:scale-110 z-10 shadow-lg ${currentSection === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        aria-label="Sección anterior"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={() => {
          const totalSections = currentSections.length
          if (currentSection < totalSections - 1) {
            goToSection(currentSection + 1)
          }
        }}
        disabled={currentSection === currentSections.length - 1}
        className={`absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-3 transition-all duration-200 hover:scale-110 z-10 shadow-lg ${currentSection === currentSections.length - 1 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        aria-label="Siguiente sección"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Indicador de dirección actual - Desktop */}
      <div className="hidden sm:block text-center mt-4">
        <span className="text-sm text-gray-600">
          Sección {currentSection + 1} de {desktopSections.length} •
          Dirección: {direction === 'forward' ? 'Adelante →' : '← Atrás'}
        </span>
      </div>

      {/* Indicador de dirección actual - Móvil */}
      <div className="sm:hidden text-center mt-3">
        <span className="text-xs text-gray-600">
          {currentSection + 1} / {mobileSections.length}
        </span>
      </div>
    </div>
  )
}