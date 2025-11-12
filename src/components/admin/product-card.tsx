'use client'

import { memo } from 'react'
import { ProductoCarrusel } from '@/types/product'

interface ProductCardProps {
  producto: ProductoCarrusel
  section?: string
  getCategoriaLabel: (categoriaValue: string) => string
  getSubcategoriaLabel: (subcategoriaValue: string) => string
  onInfoClick: (producto: ProductoCarrusel) => void
  onEditClick?: (producto: ProductoCarrusel, section: string) => void
  onDeleteClick?: (producto: ProductoCarrusel, section: string) => void
}

export const ProductCard = memo(function ProductCard({
  producto,
  section,
  getCategoriaLabel,
  getSubcategoriaLabel,
  onInfoClick,
  onEditClick,
  onDeleteClick
}: ProductCardProps) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow md:w-44 w-28">
      {/* Parte superior con imagen - ocupa todo el espacio */}
      <div className="md:h-40 h-24 bg-white overflow-hidden">
        <img
          src={producto.imagen}
          alt={producto.nombre}
          className="w-full h-full object-contain bg-gray-100"
          loading="lazy"
        />
      </div>

      {/* Parte inferior con información - ultra compacta */}
      <div className="md:p-1.5 md:pb-1.5 p-1 pb-1 flex flex-col gap-0">
        {/* Fila con categoría y subcategoría centradas */}
        <div className="flex items-center justify-center md:text-[9px] text-[8px] text-gray-400">
          <span className="text-center truncate max-w-[35%]">{getCategoriaLabel(producto.categoria)}</span>
          <span className="mx-0.5">/</span>
          <span className="text-center truncate max-w-[35%]">{getSubcategoriaLabel(producto.subcategoria)}</span>
        </div>

        {/* Nombre del producto - una sola línea */}
        <div className="px-1">
          <h3 className="md:text-[9px] text-[8px] font-semibold text-gray-100 leading-none truncate text-center">
            {producto.nombre}
          </h3>
        </div>

        {/* Fila con precios */}
        <div
          className="flex items-center justify-center gap-2 cursor-pointer"
          onClick={() => onInfoClick(producto)}
        >
          {/* Precio actual */}
          <div className="text-purple-400 font-bold md:text-xs text-[9px]">
            ${producto.precioActual}
          </div>

          {/* Precio anterior tachado */}
          {producto.precioAnterior && (
            <div className="relative">
              <span className="text-gray-400 line-through md:text-[9px] text-[7px]">
                ${producto.precioAnterior}
              </span>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-px bg-red-500"></div>
              </div>
            </div>
          )}
        </div>

        {/* Botones de Editar y Eliminar */}
        {section && onEditClick && onDeleteClick && (
          <div className="flex gap-1">
            <button
              onClick={() => onEditClick(producto, section)}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white md:py-0.5 py-0 md:px-1 px-0.5 rounded transition-colors md:text-[8px] text-[6px] font-medium"
            >
              Editar
            </button>
            <button
              onClick={() => onDeleteClick(producto, section)}
              className="flex-1 bg-red-600 hover:bg-red-500 text-white md:py-0.5 py-0 md:px-1 px-0.5 rounded transition-colors md:text-[8px] text-[6px] font-medium"
            >
              Eliminar
            </button>
          </div>
        )}
      </div>
    </div>
  )
})