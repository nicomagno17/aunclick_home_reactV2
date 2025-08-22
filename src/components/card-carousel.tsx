'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { ProductCard } from './product-card-simple'
import { Product } from '@/types/product'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CardCarouselProps {
  title: string
  subtitle: string
  products: Product[]
  cardKeyPrefix: string
}

interface RowState {
  startIndex: number
  isAutoPlaying: boolean
  direction: 'forward' | 'backward'
}

export function CardCarousel({ title, subtitle, products, cardKeyPrefix }: CardCarouselProps) {
  // Estado independiente para cada fila
  const [row1State, setRow1State] = useState<RowState>({
    startIndex: 0,
    isAutoPlaying: true,
    direction: 'forward'
  })

  const [row2State, setRow2State] = useState<RowState>({
    startIndex: 4, // Empezar en la posición 4 para la segunda fila
    isAutoPlaying: true,
    direction: 'forward'
  })

  const timeoutRef1 = useRef<NodeJS.Timeout | null>(null)
  const timeoutRef2 = useRef<NodeJS.Timeout | null>(null)
  const restartTimeoutRef1 = useRef<NodeJS.Timeout | null>(null)
  const restartTimeoutRef2 = useRef<NodeJS.Timeout | null>(null)

  // Configuración responsive
  const visibleCardsPerRowDesktop = 4 // 4 tarjetas visibles por fila en desktop
  const visibleCardsPerRowMobile = 2 // 2 tarjetas visibles por fila en móvil
  const cardsPerMove = 1 // Mover de a 1 tarjeta para mejor control en móvil

  const totalCards = products.length

  // Calcular máximos basados en el viewport actual
  const getVisibleCardsPerRow = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 640 ? visibleCardsPerRowMobile : visibleCardsPerRowDesktop
    }
    return visibleCardsPerRowDesktop // Default para SSR
  }

  const [visibleCardsPerRow, setVisibleCardsPerRow] = useState(getVisibleCardsPerRow())

  // Efecto para detectar cambios de viewport
  useEffect(() => {
    const handleResize = () => {
      const newVisibleCards = getVisibleCardsPerRow()
      setVisibleCardsPerRow(newVisibleCards)

      // Resetear índices si es necesario para evitar estados inválidos
      const maxIndex1 = Math.max(0, totalCards - newVisibleCards)
      const maxIndex2 = Math.max(0, totalCards - newVisibleCards)

      setRow1State(prev => ({
        ...prev,
        startIndex: Math.min(prev.startIndex, maxIndex1)
      }))

      setRow2State(prev => ({
        ...prev,
        startIndex: Math.min(prev.startIndex, maxIndex2)
      }))
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [totalCards, visibleCardsPerRowDesktop, visibleCardsPerRowMobile])

  // Calcular máximos usando useMemo para optimización
  const maxIndex1 = useMemo(() => Math.max(0, totalCards - visibleCardsPerRow), [totalCards, visibleCardsPerRow])
  const maxIndex2 = useMemo(() => Math.max(0, totalCards - visibleCardsPerRow), [totalCards, visibleCardsPerRow])

  // Función para limpiar timeouts de una fila específica
  const clearTimeoutsForRow = (rowNumber: number) => {
    if (rowNumber === 1) {
      if (timeoutRef1.current) {
        clearTimeout(timeoutRef1.current)
        timeoutRef1.current = null
      }
      if (restartTimeoutRef1.current) {
        clearTimeout(restartTimeoutRef1.current)
        restartTimeoutRef1.current = null
      }
    } else {
      if (timeoutRef2.current) {
        clearTimeout(timeoutRef2.current)
        timeoutRef2.current = null
      }
      if (restartTimeoutRef2.current) {
        clearTimeout(restartTimeoutRef2.current)
        restartTimeoutRef2.current = null
      }
    }
  }

  // Función para manejar interacción del usuario en una fila específica
  const handleUserInteractionForRow = (rowNumber: number) => {
    if (rowNumber === 1) {
      setRow1State(prev => ({ ...prev, isAutoPlaying: false }))
      clearTimeoutsForRow(1)

      restartTimeoutRef1.current = setTimeout(() => {
        setRow1State(prev => ({ ...prev, isAutoPlaying: true }))
      }, 5000)
    } else {
      setRow2State(prev => ({ ...prev, isAutoPlaying: false }))
      clearTimeoutsForRow(2)

      restartTimeoutRef2.current = setTimeout(() => {
        setRow2State(prev => ({ ...prev, isAutoPlaying: true }))
      }, 5000)
    }
  }

  const handleNextForRow = (rowNumber: number) => {
    if (rowNumber === 1) {
      const canGoNext = row1State.startIndex < maxIndex1
      if (canGoNext) {
        setRow1State(prev => {
          const newIndex = Math.min(prev.startIndex + cardsPerMove, maxIndex1)
          const newDirection = newIndex >= maxIndex1 ? 'backward' : 'forward'
          return {
            ...prev,
            startIndex: newIndex,
            direction: newDirection
          }
        })
        handleUserInteractionForRow(1)
      }
    } else {
      const canGoNext = row2State.startIndex < maxIndex2
      if (canGoNext) {
        setRow2State(prev => {
          const newIndex = Math.min(prev.startIndex + cardsPerMove, maxIndex2)
          const newDirection = newIndex >= maxIndex2 ? 'backward' : 'forward'
          return {
            ...prev,
            startIndex: newIndex,
            direction: newDirection
          }
        })
        handleUserInteractionForRow(2)
      }
    }
  }

  const handlePreviousForRow = (rowNumber: number) => {
    if (rowNumber === 1) {
      const canGoPrevious = row1State.startIndex > 0
      if (canGoPrevious) {
        setRow1State(prev => {
          const newIndex = Math.max(prev.startIndex - cardsPerMove, 0)
          const newDirection = newIndex <= 0 ? 'forward' : 'backward'
          return {
            ...prev,
            startIndex: newIndex,
            direction: newDirection
          }
        })
        handleUserInteractionForRow(1)
      }
    } else {
      const canGoPrevious = row2State.startIndex > 0
      if (canGoPrevious) {
        setRow2State(prev => {
          const newIndex = Math.max(prev.startIndex - cardsPerMove, 0)
          const newDirection = newIndex <= 0 ? 'forward' : 'backward'
          return {
            ...prev,
            startIndex: newIndex,
            direction: newDirection
          }
        })
        handleUserInteractionForRow(2)
      }
    }
  }

  // Función para manejar interacción con las tarjetas
  const handleCardInteractionForRow = (rowNumber: number) => {
    handleUserInteractionForRow(rowNumber)
  }

  // Productos visibles para cada fila (usando el valor dinámico responsive)
  const visibleProductsRow1 = products.slice(row1State.startIndex, row1State.startIndex + visibleCardsPerRow)
  const visibleProductsRow2 = products.slice(row2State.startIndex, row2State.startIndex + visibleCardsPerRow)

  // Efecto para manejar la rotación automática de la fila 1
  useEffect(() => {
    if (!row1State.isAutoPlaying) return

    const rotateCards = () => {
      if (row1State.direction === 'forward') {
        if (row1State.startIndex < maxIndex1) {
          setRow1State(prev => ({
            ...prev,
            startIndex: Math.min(prev.startIndex + cardsPerMove, maxIndex1)
          }))
        } else {
          setRow1State(prev => ({ ...prev, direction: 'backward' }))
        }
      } else {
        if (row1State.startIndex > 0) {
          setRow1State(prev => ({
            ...prev,
            startIndex: Math.max(prev.startIndex - cardsPerMove, 0)
          }))
        } else {
          setRow1State(prev => ({ ...prev, direction: 'forward' }))
        }
      }
    }

    timeoutRef1.current = setTimeout(() => {
      rotateCards()
    }, 4000)

    return () => {
      if (timeoutRef1.current) {
        clearTimeout(timeoutRef1.current)
        timeoutRef1.current = null
      }
    }
  }, [row1State.isAutoPlaying, row1State.direction, row1State.startIndex, maxIndex1, cardsPerMove, visibleCardsPerRow])

  // Efecto para manejar la rotación automática de la fila 2
  useEffect(() => {
    if (!row2State.isAutoPlaying) return

    const rotateCards = () => {
      if (row2State.direction === 'forward') {
        if (row2State.startIndex < maxIndex2) {
          setRow2State(prev => ({
            ...prev,
            startIndex: Math.min(prev.startIndex + cardsPerMove, maxIndex2)
          }))
        } else {
          setRow2State(prev => ({ ...prev, direction: 'backward' }))
        }
      } else {
        if (row2State.startIndex > 0) {
          setRow2State(prev => ({
            ...prev,
            startIndex: Math.max(prev.startIndex - cardsPerMove, 0)
          }))
        } else {
          setRow2State(prev => ({ ...prev, direction: 'forward' }))
        }
      }
    }

    timeoutRef2.current = setTimeout(() => {
      rotateCards()
    }, 4000)

    return () => {
      if (timeoutRef2.current) {
        clearTimeout(timeoutRef2.current)
        timeoutRef2.current = null
      }
    }
  }, [row2State.isAutoPlaying, row2State.direction, row2State.startIndex, maxIndex2, cardsPerMove, visibleCardsPerRow])

  // Efecto para limpiar timeouts al desmontar
  useEffect(() => {
    return () => {
      clearTimeoutsForRow(1)
      clearTimeoutsForRow(2)
    }
  }, [])

  return (
    <section className="mb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>

      {/* Fila 1 */}
      <div className="relative mb-8">
        <div className="overflow-hidden">
          <div className={`grid ${visibleCardsPerRow === 2 ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'} gap-2 sm:gap-4 md:gap-6`}>
            {visibleProductsRow1.map((product) => (
              <div key={`${cardKeyPrefix}-row1-${product.id}`} onClick={() => handleCardInteractionForRow(1)}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        {/* Flechas para la fila 1 */}
        {row1State.startIndex > 0 && (
          <button
            onClick={() => handlePreviousForRow(1)}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-gradient-to-r from-purple-900 via-purple-800 via-purple-700 via-purple-600 to-purple-500 border border-yellow-400 rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 z-10"
            aria-label="Ver tarjetas anteriores - Fila 1"
          >
            <ChevronLeft className="h-5 w-5 text-yellow-300" />
          </button>
        )}

        {row1State.startIndex < maxIndex1 && (
          <button
            onClick={() => handleNextForRow(1)}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-gradient-to-r from-purple-900 via-purple-800 via-purple-700 via-purple-600 to-purple-500 border border-yellow-400 rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 z-10"
            aria-label="Ver más tarjetas - Fila 1"
          >
            <ChevronRight className="h-5 w-5 text-yellow-300" />
          </button>
        )}
      </div>

      {/* Fila 2 */}
      <div className="relative">
        <div className="overflow-hidden">
          <div className={`grid ${visibleCardsPerRow === 2 ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'} gap-2 sm:gap-4 md:gap-6`}>
            {visibleProductsRow2.map((product) => (
              <div key={`${cardKeyPrefix}-row2-${product.id}`} onClick={() => handleCardInteractionForRow(2)}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        {/* Flechas para la fila 2 - Solo en desktop */}
        {row2State.startIndex > 0 && (
          <button
            onClick={() => handlePreviousForRow(2)}
            className="hidden sm:flex absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-gradient-to-r from-purple-900 via-purple-800 via-purple-700 via-purple-600 to-purple-500 border border-yellow-400 rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 z-10 items-center justify-center"
            aria-label="Ver tarjetas anteriores - Fila 2"
          >
            <ChevronLeft className="h-5 w-5 text-yellow-300" />
          </button>
        )}

        {row2State.startIndex < maxIndex2 && (
          <button
            onClick={() => handleNextForRow(2)}
            className="hidden sm:flex absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-gradient-to-r from-purple-900 via-purple-800 via-purple-700 via-purple-600 to-purple-500 border border-yellow-400 rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 z-10 items-center justify-center"
            aria-label="Ver más tarjetas - Fila 2"
          >
            <ChevronRight className="h-5 w-5 text-yellow-300" />
          </button>
        )}
      </div>
    </section>
  )
}