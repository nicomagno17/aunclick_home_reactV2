'use client'

import { useState } from 'react'
import { ProductInfoPopup } from '@/components/product-info-popup'
import { Product } from '@/types/product'

interface AdminProductCardProps {
  producto: Product
}

export function AdminProductCard({ producto }: AdminProductCardProps) {
  const [showInfoPopup, setShowInfoPopup] = useState(false)

  // Calculate discount percentage
  const discountPercentage = producto.originalPrice 
    ? Math.round(((producto.originalPrice - producto.price) / producto.originalPrice) * 100)
    : 0

  return (
    <>
      <div
        className="bg-white rounded-lg hover:shadow-lg transition-shadow md:w-full w-28 md:h-auto h-[175px] cursor-pointer flex flex-col shadow-sm overflow-visible"
        onClick={() => setShowInfoPopup(true)}
      >
        {/* Parte superior con imagen - sin bordes visibles */}
        <div className="md:h-48 h-24 bg-white overflow-hidden flex-shrink-0 rounded-t-lg">
          <img 
            src={producto.image} 
            alt={producto.name}
            className="w-full h-full object-contain bg-white"
            loading="lazy"
          />
        </div>
        
        {/* Parte inferior con información - fondo blanco */}
        <div className="md:p-1.5 md:pb-2 p-1 pb-1 flex flex-col flex-grow bg-white justify-center gap-0 rounded-b-lg">
          {/* Fila con categoría y subcategoría centradas - altura fija */}
          <div className="flex items-center justify-center md:text-[10px] text-[8px] text-gray-500 md:h-3.5 h-3">
            <span className="text-center truncate max-w-[35%]">{producto.category}</span>
            <span className="mx-0.5">/</span>
            <span className="text-center truncate max-w-[35%]">{producto.category}</span>
          </div>

          {/* Nombre del producto - altura fija, una sola línea */}
          <div className="md:h-5 h-6 flex items-center justify-center px-1">
            <h3 className="md:text-xs text-[8px] font-semibold text-gray-700 leading-none truncate text-center w-full">
              {producto.name}
            </h3>
          </div>

          {/* Fila con precios - altura fija */}
          <div className="flex items-center justify-center gap-2 md:h-5 h-4">
            {/* Precio actual */}
            <div className="text-purple-600 font-bold md:text-base text-[9px]">
              ${producto.price.toLocaleString('es-CL')}
            </div>

            {/* Precio anterior tachado */}
            {producto.originalPrice && (
              <div className="relative">
                <span className="text-gray-500 line-through md:text-sm text-[7px]">
                  ${producto.originalPrice.toLocaleString('es-CL')}
                </span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-px bg-red-500"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Popup de Información del Producto */}
      <ProductInfoPopup 
        product={producto}
        isOpen={showInfoPopup}
        onClose={() => setShowInfoPopup(false)}
      />
    </>
  )
}