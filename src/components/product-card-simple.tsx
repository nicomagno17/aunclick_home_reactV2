'use client'

import { useState } from 'react'
import { Heart, MessageCircle, MapPin } from 'lucide-react'
import { Product } from '@/types/product'

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation() // Evita que el clic se propague al contenedor principal
    setIsFlipped(!isFlipped)
  }

  return (
    <>
      <div 
        className="group h-full bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col min-w-[160px] sm:min-w-[200px] md:min-w-[240px] cursor-pointer"
        onClick={onClick}
      >
      {/* Parte Superior - Imagen más grande para touch */}
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

      {/* Parte Inferior con efecto 3D - Se mantiene igual pero con volteo */}
      <div className="flex-1 relative perspective-1000 min-h-44 sm:min-h-56">
        <div className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>

          {/* Parte Frontal (Contenido original del producto) */}
          <div className="absolute inset-0 w-full h-full backface-hidden p-1.5 sm:p-2 flex flex-col bg-white">
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
            <div className="flex items-center gap-1 sm:gap-2 mb-0.5">
              <span className="text-sm sm:text-lg font-bold text-purple-900">
                ${product.price.toLocaleString('es-CL')}
              </span>
              {product.originalPrice && (
                <span className="text-xs sm:text-sm text-gray-500 line-through">
                  ${product.originalPrice.toLocaleString('es-CL')}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 mt-2 mb-2">
              {product.whatsappNumber && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`https://wa.me/${product.whatsappNumber}`, '_blank');
                  }}
                  className="flex-1 bg-green-500 text-white p-2 rounded-md flex items-center justify-center gap-1 hover:bg-green-600 transition-colors"
                >
                  <MessageCircle size={16} />
                </button>
              )}
              {product.address && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(product.address!)}`, '_blank');
                  }}
                  className="flex-1 bg-blue-500 text-white p-2 rounded-md flex items-center justify-center gap-1 hover:bg-blue-600 transition-colors"
                >
                  <MapPin size={16} />
                </button>
              )}
            </div>

            {/* Botón de Información de la Tienda */}
            <button 
              onClick={(e) => {
                e.stopPropagation()
                handleFlip(e)
              }}
              className="w-full bg-gradient-to-r from-purple-900 via-purple-800 via-purple-700 via-purple-600 to-purple-500 text-white text-[10px] sm:text-xs font-medium py-1 sm:py-1.5 rounded-md hover:opacity-90 transition-opacity duration-200"
            >
              Información de la Tienda
            </button>
          </div>

          {/* Parte Trasera (Información de la tienda) */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 p-1.5 sm:p-2 flex flex-col bg-gradient-to-br from-purple-50 to-blue-50 text-[10px] sm:text-xs">
            {/* Header - Solo el título */}
            <div className="mb-0.5 sm:mb-1">
              <h3 className="text-[10px] sm:text-xs font-bold text-purple-900">Información de la Tienda</h3>
            </div>

            {/* Información de contacto */}
            <div className="space-y-1 sm:space-y-1.5 flex-1">
              <div className="flex items-start gap-1 sm:gap-1.5">
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-[10px] sm:text-xs text-gray-700">Calle Principal #123, Ciudad</span>
              </div>

              <div className="flex items-start gap-1 sm:gap-1.5">
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="text-[10px] sm:text-xs text-gray-700">+56 9 8765 4321</span>
              </div>

              {/* Horarios de atención */}
              <div className="mt-1 sm:mt-2 pt-1 sm:pt-2 border-t border-purple-200">
                <div className="flex items-start gap-1 sm:gap-1.5 mb-1">
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-[10px] sm:text-xs font-medium text-gray-900 mb-0.5">Horarios:</p>
                    <div className="text-[10px] sm:text-xs text-gray-600 space-y-0.5">
                      <p>L-V: 09:00-20:00</p>
                      <p>Sáb: 10:00-18:00</p>
                      <p>Dom: 11:00-15:00</p>
                    </div>
                  </div>
                </div>

                {/* Botón de volver - Justo debajo de los horarios */}
                <div className="mt-1 sm:mt-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      handleFlip(e)
                    }}
                    className="w-full bg-gradient-to-r from-purple-900 via-purple-800 via-purple-700 via-purple-600 to-purple-500 text-white text-[10px] sm:text-xs font-medium py-1 sm:py-1.5 rounded-md hover:opacity-90 transition-opacity duration-200"
                  >
                    Volver
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}