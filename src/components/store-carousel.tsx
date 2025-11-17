'use client'

import { useState, useEffect, useRef } from 'react'
import { AdminProductCard } from '@/components/admin-product-card'
import { Product } from '@/types/product'

interface StoreCarouselProps {
  products: Product[]
  storeName: string
}

export function StoreCarousel({ products, storeName }: StoreCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  // Configuración de visualización: 6 tarjetas visibles
  const visibleCards = 6
  const cardWidth = 220
  const gap = 16

  // Auto-rotación lenta (cada 5 segundos)
  useEffect(() => {
    if (products.length === 0) return

    const autoPlay = () => {
      setCurrentIndex((prev) => {
        // Mover una tarjeta a la vez
        const nextIndex = prev + 1
        // Si llegamos al final, volver al inicio (indefinido)
        if (nextIndex >= products.length) {
          return 0
        }
        return nextIndex
      })
    }

    // Intervalo de 5 segundos para rotación lenta
    autoPlayRef.current = setInterval(autoPlay, 5000)

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [products.length])

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [])

  if (products.length === 0) {
    return null
  }

  // Duplicar productos para crear efecto infinito suave
  const extendedProducts = [...products, ...products, ...products]

  return (
    <section className="mb-12 overflow-hidden">
      <div className="mb-6 px-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Productos Destacados
        </h2>
        <p className="text-sm text-muted-foreground">
          Lo mejor de {storeName}
        </p>
      </div>

      <div className="relative">
        {/* Contenedor del carrusel */}
        <div className="overflow-hidden px-6">
          <div
            className="flex transition-transform duration-1000 ease-in-out"
            style={{
              gap: `${gap}px`,
              transform: `translateX(-${currentIndex * (cardWidth + gap)}px)`
            }}
          >
            {extendedProducts.map((product, index) => (
              <div
                key={`carousel-${index}-${product.id}`}
                className="flex-shrink-0"
                style={{ width: cardWidth }}
              >
                <AdminProductCard producto={product} />
              </div>
            ))}
          </div>
        </div>

        {/* Indicador visual de carrusel activo */}
        <div className="flex justify-center mt-6 gap-2">
          {products.map((_, index) => (
            <div
              key={`indicator-${index}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex % products.length
                  ? 'w-8 bg-purple-600'
                  : 'w-2 bg-purple-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
