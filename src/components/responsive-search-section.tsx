
'use client'

import { useState } from 'react'
import { SearchBar } from '@/components/search-bar'

export function ResponsiveSearchSection() {
  const [searchValue, setSearchValue] = useState('')

  return (
    <>
      {/* Desktop Banner (mantener el banner original en desktop) */}
      <div className="hidden md:block bg-gradient-to-r from-purple-600 to-pink-600 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">Solo a un CLICK</h2>
            <div className="bg-purple-400/30 backdrop-blur-sm rounded-lg p-4 mb-4">
              <p className="text-sm font-semibold mb-1">ESPACIO PREMIUM</p>
              <p className="text-lg font-bold">Publicitario</p>
              <p className="text-xs opacity-90">• Disponible •</p>
            </div>
          </div>
          
          <div className="flex-1 max-w-md ml-8">
            <SearchBar 
              value={searchValue}
              onChange={setSearchValue}
              placeholder="Buscar..."
            />
          </div>
        </div>
      </div>

      {/* Mobile Search (reemplazar el banner publicitario en móvil) */}
      <div className="block md:hidden bg-gradient-to-r from-purple-600 to-pink-600 text-white py-6 px-4">
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-4 text-center">Encuentra lo que buscas</h2>
          <SearchBar 
            value={searchValue}
            onChange={setSearchValue}
            placeholder="Buscar productos..."
          />
        </div>
      </div>
    </>
  )
}
