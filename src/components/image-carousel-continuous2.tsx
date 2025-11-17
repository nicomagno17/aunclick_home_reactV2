'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface ImageCarouselContinuous2Props {
  images: string[]
  sourceNames?: string[]
  showSource?: boolean
  autoPlayInterval?: number
}

export function ImageCarouselContinuous2({
  images,
  sourceNames = [],
  showSource = false,
  autoPlayInterval = 6000
}: ImageCarouselContinuous2Props) {
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Función para navegar a la página de la tienda
  const handleStoreClick = (storeName: string, storeIndex: number) => {
    // Obtener posición de scroll actual
    const scrollY = window.scrollY

    // Crear un ID único para la tienda basado en el nombre
    const storeId = storeName.toLowerCase().replace(/\s+/g, '-')

    // Construir URL con parámetros para preservar estado
    const params = new URLSearchParams()
    params.append('scrollY', scrollY.toString())

    // Navegar a la página de la tienda
    router.push(`/tienda/${storeId}?${params.toString()}`)
  }

  // Triplicar las imágenes para crear efecto infinito sin saltos
  const triplicatedImages = [...images, ...images, ...images]

  return (
    <div className="w-full bg-gradient-to-b from-gray-50 to-white py-8 overflow-hidden">
      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        .animate-scroll {
          animation: scroll-left 8s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Título */}
      <div className="text-center mb-8 px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-purple-800 mb-2">
          Tiendas que nos Acompañan
        </h2>
        <p className="text-sm md:text-base text-gray-600">
          Conoce a nuestros aliados comerciales
        </p>
      </div>

      <div className="w-full">
        <div className="flex gap-4 md:gap-6 px-4 md:px-6 animate-scroll">
          {triplicatedImages.map((image, index) => {
            const storeIndex = index % images.length
            const storeName = sourceNames[storeIndex] || `Tienda ${storeIndex + 1}`

            return (
              <div
                key={index}
                onClick={() => handleStoreClick(storeName, storeIndex)}
                className="flex-shrink-0 relative group cursor-pointer"
                style={{
                  width: isMobile ? 'calc(50% - 8px)' : 'calc(20% - 19.2px)'
                }}
              >
                {/* Contenedor circular */}
                <div className="aspect-square rounded-full overflow-hidden shadow-xl border-4 border-purple-300 bg-white hover:border-yellow-400 transition-all duration-300 hover:scale-105">
                  <img
                    src={image}
                    alt={storeName}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Nombre de la tienda debajo */}
                {showSource && sourceNames[storeIndex] && (
                  <div className="mt-2 text-center">
                    <span className="text-xs md:text-sm font-semibold text-purple-800 bg-purple-100 px-3 py-1 rounded-full inline-block shadow-sm hover:bg-yellow-100 transition-colors">
                      {sourceNames[storeIndex]}
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
