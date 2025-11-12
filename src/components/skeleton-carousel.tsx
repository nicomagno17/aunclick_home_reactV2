'use client'

import { SkeletonCard } from './skeleton-card'

interface SkeletonCarouselProps {
  title?: string
  subtitle?: string
  cardCount?: number
}

export function SkeletonCarousel({ 
  title = "Cargando...", 
  subtitle = "Obteniendo los mejores productos para ti",
  cardCount = 10 
}: SkeletonCarouselProps) {
  return (
    <section className="mb-12">
      {/* Header skeleton */}
      <div className="mb-6 px-6">
        <div className="flex items-center justify-between mb-2">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="hidden md:flex items-center gap-2">
            <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-72 animate-pulse"></div>
      </div>

      {/* Cards container */}
      <div className="relative group px-6">
        <div 
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {[...Array(cardCount)].map((_, index) => (
            <div key={index} className="flex-none w-64">
              <SkeletonCard />
            </div>
          ))}
        </div>
        
        {/* Navigation arrows skeleton */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-12 w-12 bg-gray-200 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-12 w-12 bg-gray-200 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
    </section>
  )
}