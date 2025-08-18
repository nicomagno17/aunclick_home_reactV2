'use client'

import { Heart } from 'lucide-react'
import { Product } from '@/types/product'

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div
      className="group h-full bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col min-w-[160px] sm:min-w-[200px] md:min-w-[240px] cursor-pointer"
      onClick={onClick}
    >
      {/* Parte Superior - Imagen */}
      <div className="relative aspect-[4/3] sm:aspect-[3/3] overflow-hidden bg-white">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-1 sm:top-2 left-1 sm:left-2 flex flex-col gap-1">
          {discountPercentage > 0 && (
            <span className="bg-red-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold rounded">
              -{discountPercentage}%
            </span>
          )}
          {!product.inStock && (
            <span className="bg-gray-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs rounded">
              Agotado
            </span>
          )}
        </div>

        {/* Action buttons overlay - Only visible on hover for desktop */}
        <div className="absolute top-1 sm:top-2 right-1 sm:right-2 flex flex-col gap-1 opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={(e) => e.stopPropagation()} 
            className="bg-white/90 backdrop-blur-sm p-1.5 sm:p-2 rounded-full hover:bg-white transition-colors shadow-sm"
          >
            <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
          </button>
        </div>

        {/* Source Badge */}
        <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2">
          <span className="bg-white/80 backdrop-blur-sm text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded border border-gray-200">
            {product.source}
          </span>
        </div>
      </div>

      {/* Parte Inferior */}
      <div className="p-1.5 sm:p-2 flex flex-col flex-1 bg-white">
        {/* Category */}
        <div className="mb-0.5 sm:mb-1">
          <span className="text-[10px] sm:text-xs bg-gray-100 text-gray-600 px-1.5 sm:px-2 py-0.5 rounded">
            {product.category}
          </span>
        </div>

        {/* Title */}
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 line-clamp-2 leading-tight mb-0.5 min-h-[1.8em] sm:min-h-[2.2em] text-xs sm:text-sm">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-tight mb-0.5 min-h-[2.4em] sm:min-h-[3.6em]">
            {product.description}
          </p>
        </div>

        {/* Price */}
        <div className="flex items-center gap-1 sm:gap-2 mt-auto pt-2">
          <span className="text-sm sm:text-lg font-bold text-purple-900">
            ${product.price.toLocaleString('es-CL')}
          </span>
          {product.originalPrice && (
            <span className="text-xs sm:text-sm text-gray-500 line-through">
              ${product.originalPrice.toLocaleString('es-CL')}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}