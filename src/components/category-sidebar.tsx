'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

interface Category {
  name: string
  subcategories: string[]
}

interface CategorySidebarProps {
  categories: Category[]
  onClose?: () => void
  isMobile?: boolean
}

export function CategorySidebar({ categories, onClose, isMobile = false }: CategorySidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<number[]>([])

  const toggleCategory = (index: number) => {
    setExpandedCategories(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  return (
    <div
      className={`
        bg-gradient-to-br from-purple-50 via-white to-purple-50 border-r-4 border-purple-300 shadow-lg
        ${isMobile
          ? 'w-full h-full overflow-y-auto'
          : 'w-auto min-w-[220px] max-w-[260px] sticky top-[76px] h-[calc(100vh-76px)] overflow-y-auto'
        }
      `}
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#9333ea #f3e8ff'
      }}
    >
      {/* Header del sidebar móvil */}
      {isMobile && (
        <div className="sticky top-0 bg-gradient-to-r from-purple-900 via-purple-700 to-purple-600 text-white p-4 flex items-center justify-between border-b-4 border-yellow-400 shadow-xl">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <h2 className="text-base font-bold">Categorías</h2>
          </div>
          <button
            onClick={onClose}
            className="text-yellow-300 hover:text-yellow-400 text-2xl font-bold hover:rotate-90 transition-transform duration-300"
            aria-label="Cerrar menú"
          >
            ✕
          </button>
        </div>
      )}

      {/* Contenido de categorías */}
      <div className={`${isMobile ? 'p-3' : 'p-4 pb-8'}`}>
        {!isMobile && (
          <div className="mb-6 pb-3 border-b-2 border-purple-300">
            <div className="bg-gradient-to-r from-purple-700 to-purple-600 text-white px-4 py-3 rounded-xl shadow-lg">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <h2 className="text-lg font-bold">Categorías</h2>
              </div>
            </div>
          </div>
        )}

        <div className={`space-y-${isMobile ? '2' : '3'}`}>
          {categories.map((category, index) => {
            const isExpanded = expandedCategories.includes(index)
            const hasSubcategories = category.subcategories.length > 0

            return (
              <div key={index} className="space-y-1">
                {/* Nombre de categoría */}
                <button
                  onClick={() => hasSubcategories && toggleCategory(index)}
                  className={`
                    w-full text-left font-bold text-purple-900
                    transition-all duration-300 ease-out
                    ${isMobile ? 'py-2 px-3 text-xs' : 'py-2.5 px-4 text-sm'}
                    rounded-xl
                    bg-gradient-to-r from-purple-100 to-purple-50
                    hover:from-purple-200 hover:to-purple-100
                    hover:shadow-md hover:scale-[1.02]
                    border-l-4 border-purple-500
                    relative overflow-hidden
                    group
                  `}
                >
                  {/* Efecto brillante al hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>

                  <div className="flex items-center justify-between relative z-10">
                    <span className="flex-1">{category.name}</span>
                    {hasSubcategories && (
                      <span className="ml-2 text-purple-600 transition-transform duration-300">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </span>
                    )}
                  </div>
                </button>

                {/* Subcategorías */}
                {hasSubcategories && (
                  <div
                    className={`
                      ${isMobile ? 'ml-2' : 'ml-3'}
                      space-y-1
                      overflow-hidden transition-all duration-300 ease-in-out
                      ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}
                    `}
                  >
                    {category.subcategories.map((sub, subIndex) => (
                      <button
                        key={subIndex}
                        className={`
                          w-full text-left text-purple-700
                          transition-all duration-200
                          ${isMobile ? 'text-xs py-1.5 px-3' : 'text-sm py-2 px-4'}
                          rounded-lg
                          bg-white
                          hover:bg-gradient-to-r hover:from-purple-50 hover:to-white
                          hover:shadow-sm hover:translate-x-1
                          border-l-2 border-purple-300
                          hover:border-purple-500
                          flex items-center gap-2
                          group
                        `}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 group-hover:bg-purple-600 transition-colors"></span>
                        <span>{sub}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-3">
              <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className={`text-gray-500 font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>
              No hay categorías disponibles
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
