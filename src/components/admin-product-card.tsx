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
        className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow md:w-44 w-28 md:h-[280px] h-[220px] cursor-pointer flex flex-col shadow-sm"
        onClick={() => setShowInfoPopup(true)}
      >
        {/* Parte superior con imagen - sin bordes visibles */}
        <div className="md:h-40 h-24 bg-white overflow-hidden flex-shrink-0">
          <img 
            src={producto.image} 
            alt={producto.name}
            className="w-full h-full object-contain bg-white"
            loading="lazy"
          />
        </div>
        
        {/* Parte inferior con información - fondo blanco */}
        <div className="md:p-1.5 md:pb-1 p-1 pb-0.5 flex flex-col flex-grow bg-white">
          {/* Fila con categoría y subcategoría centradas - altura fija */}
          <div className="flex items-center justify-center md:text-[10px] text-[8px] text-gray-500 md:mb-0.5 mb-0 h-4">
            <span className="text-center truncate max-w-[35%]">{producto.category}</span>
            <span className="mx-0.5">/</span>
            <span className="text-center truncate max-w-[35%]">{producto.category}</span>
          </div>
          
          {/* Nombre del producto - altura fija */}
          <div className="md:h-[2.5rem] h-10 flex items-center justify-center">
            <h3 className="md:text-[10px] text-[8px] font-semibold text-gray-700 leading-tight line-clamp-2 text-center w-full">
              {producto.name}
            </h3>
          </div>
          
          {/* Fila con precios - altura fija */}
          <div className="flex items-center justify-between md:mb-1 mb-0.5 h-5">
            {/* Precio actual */}
            <div className="text-purple-600 font-bold md:text-xs text-[9px]">
              ${producto.price.toLocaleString('es-CL')}
            </div>
            
            {/* Precio anterior tachado */}
            {producto.originalPrice && (
              <div className="relative">
                <span className="text-gray-500 line-through md:text-[9px] text-[7px]">
                  ${producto.originalPrice.toLocaleString('es-CL')}
                </span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-px bg-red-500"></div>
                </div>
              </div>
            )}
          </div>
          
          {/* Botón +Información - altura fija */}
          <div className="mt-auto mb-1">
            <button 
              onClick={(e) => {
                e.stopPropagation()
                setShowInfoPopup(true)
              }}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white md:py-0.5 py-0 md:px-1 px-0.5 rounded transition-colors md:text-[9px] text-[7px] font-medium"
            >
              +Información
            </button>
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