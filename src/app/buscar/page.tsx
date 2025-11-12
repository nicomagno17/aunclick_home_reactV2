'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Product } from '@/types/product'
import { mockProducts } from '@/data/mock-products'
import { Filter, ChevronDown } from 'lucide-react'

function SearchPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('todos')
  const [sortBy, setSortBy] = useState<'relevance' | 'price-low' | 'price-high' | 'rating'>('relevance')
  const [showFilters, setShowFilters] = useState(false)
  const [showSortOptions, setShowSortOptions] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 1000000])
  const [selectedRating, setSelectedRating] = useState('')
  const [selectedAvailability, setSelectedAvailability] = useState('')
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Obtener el término de búsqueda de la URL
  const initialQuery = searchParams.get('q') || ''

  useEffect(() => {
    setSearchTerm(initialQuery)
    fetchProducts()
  }, [initialQuery])

  // Efecto para cerrar dropdowns al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      
      // Solo cerrar sort options si el click no es en el contenedor de sort
      if (!target.closest('.sort-dropdown-container')) {
        setShowSortOptions(false)
      }
      
      // Solo cerrar filtros si el click no es en el contenedor de filtros
      if (!target.closest('.filters-dropdown-container') && !target.closest('.filters-panel')) {
        setShowFilters(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const fetchProducts = async () => {
    try {
      // Simular carga de datos reales y agregar datos de prueba
      const response = await fetch('/api/products')
      const apiData = await response.json()
      
      // Combinar datos de la API con datos de prueba
      const combinedData = [...apiData, ...mockProducts]
      setProducts(combinedData)
    } catch (error) {
      console.error('Error fetching products:', error)
      // Si falla la API, usar solo datos de prueba
      setProducts(mockProducts)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch = searchTerm === '' || 
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.source.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower)
      
      const matchesCategory = selectedCategory === 'todos' || product.category === selectedCategory
      
      // Filtro de precio - solo usar el máximo del range
      const matchesPrice = product.price <= priceRange[1]
      
      // Filtro de calificación
      const matchesRating = selectedRating === '' || product.rating >= parseFloat(selectedRating)
      
      // Filtro de disponibilidad
      const matchesAvailability = selectedAvailability === '' || 
        (selectedAvailability === 'instock' && product.inStock) ||
        (selectedAvailability === 'discount' && product.discount)
      
      return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesAvailability
    })

    // Aplicar ordenamiento
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'relevance':
      default:
        // Ordenar por relevancia (productos con descuento primero, luego por rating)
        filtered.sort((a, b) => {
          if (a.discount && !b.discount) return -1
          if (!a.discount && b.discount) return 1
          return b.rating - a.rating
        })
        break
    }

    return filtered
  }, [products, searchTerm, selectedCategory, sortBy, priceRange, selectedRating, selectedAvailability])

  const categories = [
    { id: 'todos', name: 'Todos' },
    { id: 'electronica', name: 'Electrónica' },
    { id: 'ropa', name: 'Ropa' },
    { id: 'hogar', name: 'Hogar' },
    { id: 'deportes', name: 'Deportes' },
    { id: 'belleza', name: 'Belleza' },
    { id: 'juguetes', name: 'Juguetes' },
    { id: 'libros', name: 'Libros' },
    { id: 'automotriz', name: 'Automotriz' },
    { id: 'salud', name: 'Salud' }
  ]

  const incrementPrice = () => {
    setPriceRange([priceRange[0], Math.min(priceRange[1] + 5000, 1000000)])
  }

  const decrementPrice = () => {
    setPriceRange([priceRange[0], Math.max(priceRange[1] - 5000, 0)])
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Reutilizable */}
      <Header 
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        showBackButton={true}
        showFloatingSearch={false}
      />

      {/* Filtros y ordenamiento */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          {/* Versión Desktop */}
          <div className="hidden sm:block">
            {/* Filtros de categoría */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Controles de filtro y ordenamiento */}
              <div className="flex items-center gap-2 ml-4">
                <div className="filters-dropdown-container">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowFilters(!showFilters)
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Filter className="h-4 w-4" />
                    <span>Filtros</span>
                  </button>
                </div>
                
                {/* Botón de ordenamiento desplegable para desktop */}
                <div className="relative sort-dropdown-container">
                  <button
                    onClick={() => setShowSortOptions(!showSortOptions)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <span>Ordenar</span>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showSortOptions ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Dropdown de ordenamiento */}
                  {showSortOptions && (
                    <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                      <div className="py-2">
                        <button
                          onClick={() => { setSortBy('relevance'); setShowSortOptions(false) }}
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors ${
                            sortBy === 'relevance' ? 'text-purple-600 font-medium' : 'text-gray-700'
                          }`}
                        >
                          Más relevante
                        </button>
                        <button
                          onClick={() => { setSortBy('price-low'); setShowSortOptions(false) }}
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors ${
                            sortBy === 'price-low' ? 'text-purple-600 font-medium' : 'text-gray-700'
                          }`}
                        >
                          Precio: menor a mayor
                        </button>
                        <button
                          onClick={() => { setSortBy('price-high'); setShowSortOptions(false) }}
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors ${
                            sortBy === 'price-high' ? 'text-purple-600 font-medium' : 'text-gray-700'
                          }`}
                        >
                          Precio: mayor a menor
                        </button>
                        <button
                          onClick={() => { setSortBy('rating'); setShowSortOptions(false) }}
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors ${
                            sortBy === 'rating' ? 'text-purple-600 font-medium' : 'text-gray-700'
                          }`}
                        >
                          Mejor calificados coqui
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Panel de filtros expandible Desktop */}
            {showFilters && (
              <div className="filters-panel border-t border-gray-200 pt-3" onClick={(e) => e.stopPropagation()}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Precio máximo: ${priceRange[1].toLocaleString()}
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={decrementPrice}
                        className="w-8 h-8 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors flex items-center justify-center"
                      >
                        -
                      </button>
                      <div className="flex-1 px-3 py-2">
                        <input
                          type="range"
                          min="0"
                          max="1000000"
                          step="5000"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #9333ea 0%, #9333ea ${(priceRange[1]/1000000)*100}%, #e5e7eb ${(priceRange[1]/1000000)*100}%, #e5e7eb 100%)`
                          }}
                        />
                      </div>
                      <button
                        onClick={incrementPrice}
                        className="w-8 h-8 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Calificación</label>
                    <select 
                      value={selectedRating}
                      onChange={(e) => setSelectedRating(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="">Todas</option>
                      <option value="4.5">4.5+ estrellas</option>
                      <option value="4">4+ estrellas</option>
                      <option value="3.5">3.5+ estrellas</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Disponibilidad</label>
                    <select 
                      value={selectedAvailability}
                      onChange={(e) => setSelectedAvailability(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="">Todos</option>
                      <option value="instock">En stock</option>
                      <option value="discount">Con descuento</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Versión Móvil */}
          <div className="sm:hidden">
            {/* Solo botones de filtro y ordenar */}
            <div className="flex items-center justify-center gap-3">
              <div className="filters-dropdown-container">
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Filter className="h-4 w-4" />
                  <span>Filtros</span>
                </button>
              </div>
              
              {/* Botón de ordenamiento desplegable para móvil */}
              <div className="relative sort-dropdown-container">
                <button
                  onClick={() => setShowSortOptions(!showSortOptions)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <span>Ordenar</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showSortOptions ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Dropdown de ordenamiento */}
                {showSortOptions && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <div className="py-2">
                      <button
                        onClick={() => { setSortBy('relevance'); setShowSortOptions(false) }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors ${
                          sortBy === 'relevance' ? 'text-purple-600 font-medium' : 'text-gray-700'
                        }`}
                      >
                        Más relevante
                      </button>
                      <button
                        onClick={() => { setSortBy('price-low'); setShowSortOptions(false) }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors ${
                          sortBy === 'price-low' ? 'text-purple-600 font-medium' : 'text-gray-700'
                        }`}
                      >
                        Precio: menor a mayor
                      </button>
                      <button
                        onClick={() => { setSortBy('price-high'); setShowSortOptions(false) }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors ${
                          sortBy === 'price-high' ? 'text-purple-600 font-medium' : 'text-gray-700'
                        }`}
                      >
                        Precio: mayor a menor
                      </button>
                      <button
                        onClick={() => { setSortBy('rating'); setShowSortOptions(false) }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors ${
                          sortBy === 'rating' ? 'text-purple-600 font-medium' : 'text-gray-700'
                        }`}
                      >
                        Mejor calificados
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <main className="container mx-auto px-4 py-6">
        {/* Información de resultados */}
        {searchTerm && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Resultados para "{searchTerm}"
            </h1>
            <p className="text-gray-600">
              {loading ? 'Buscando...' : `${filteredProducts.length} productos encontrados`}
            </p>
          </div>
        )}

        

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        )}

        {/* No hay resultados */}
        {!loading && searchTerm && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No se encontraron resultados
              </h3>
              <p className="text-gray-600 mb-4">
                No pudimos encontrar productos que coincidan con "{searchTerm}"
                {selectedCategory !== 'todos' && ` en la categoría "${categories.find(c => c.id === selectedCategory)?.name}"`}
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <button 
                  onClick={() => setSearchTerm('')}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Limpiar búsqueda
                </button>
                {selectedCategory !== 'todos' && (
                  <button 
                    onClick={() => setSelectedCategory('todos')}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Ver todas las categorías
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Resultados en grid */}
        {!loading && filteredProducts.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <div className="relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-32 sm:h-36 md:h-40 object-cover"
                  />
                  {product.discount && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      -{product.discount}%
                    </div>
                  )}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-bold text-xs bg-red-600 px-2 py-1 rounded">Agotado</span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2 h-10">{product.name}</h3>
                  <p className="text-xs text-gray-600 mb-2">{product.source}</p>
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8 2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      ))}
                      <span className="ml-1 text-xs text-gray-600">({product.reviews})</span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    {product.originalPrice && product.originalPrice > product.price ? (
                      <>
                        <span className="text-xs text-gray-400 line-through">${product.originalPrice.toLocaleString()}</span>
                        <span className="text-sm font-bold text-purple-600">${product.price.toLocaleString()}</span>
                      </>
                    ) : (
                      <span className="text-sm font-bold text-purple-600">${product.price.toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Mobile Filters Sidebar */}
      {showMobileFilters && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-50 sm:hidden"
            onClick={() => setShowMobileFilters(false)}
          />
          
          {/* Sidebar */}
          <div className="fixed right-0 top-0 h-full w-80 bg-white z-50 sm:hidden transform transition-transform duration-300 shadow-xl border-l border-gray-200">
            <div className="h-full flex flex-col" style={{ background: 'linear-gradient(180deg, #3b0764 0%, #4c1d95 20%, #6d28d9 100%)' }}>
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-purple-300/30">
                <h2 className="text-lg font-semibold text-white">Filtros</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-8 h-8 bg-purple-600/50 text-white rounded-full hover:bg-purple-600/70 transition-colors flex items-center justify-center"
                >
                  ×
                </button>
              </div>

              {/* Filters Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Categorías */}
                <div>
                  <label className="block text-sm font-medium text-white mb-3">Categoría</label>
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-purple-300/30 rounded-lg bg-white/10 text-white backdrop-blur-sm"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id} className="text-gray-900">{category.name}</option>
                    ))}
                  </select>
                </div>

                {/* Precio */}
                <div>
                  <label className="block text-sm font-medium text-white mb-3">
                    Precio máximo: ${priceRange[1].toLocaleString()}
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={decrementPrice}
                      className="w-8 h-8 bg-yellow-400 text-purple-900 rounded-full hover:bg-yellow-300 transition-colors flex items-center justify-center font-bold"
                    >
                      -
                    </button>
                    <div className="flex-1 px-3 py-2">
                      <input
                        type="range"
                        min="0"
                        max="1000000"
                        step="5000"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #fbbf24 0%, #fbbf24 ${(priceRange[1]/1000000)*100}%, rgba(255,255,255,0.2) ${(priceRange[1]/1000000)*100}%, rgba(255,255,255,0.2) 100%)`
                        }}
                      />
                    </div>
                    <button
                      onClick={incrementPrice}
                      className="w-8 h-8 bg-yellow-400 text-purple-900 rounded-full hover:bg-yellow-300 transition-colors flex items-center justify-center font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Calificación */}
                <div>
                  <label className="block text-sm font-medium text-white mb-3">Calificación</label>
                  <select 
                    value={selectedRating}
                    onChange={(e) => setSelectedRating(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-purple-300/30 rounded-lg bg-white/10 text-white backdrop-blur-sm"
                  >
                    <option value="" className="text-gray-900">Todas</option>
                    <option value="4.5" className="text-gray-900">4.5+ estrellas</option>
                    <option value="4" className="text-gray-900">4+ estrellas</option>
                    <option value="3.5" className="text-gray-900">3.5+ estrellas</option>
                  </select>
                </div>

                {/* Disponibilidad */}
                <div>
                  <label className="block text-sm font-medium text-white mb-3">Disponibilidad</label>
                  <select 
                    value={selectedAvailability}
                    onChange={(e) => setSelectedAvailability(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-purple-300/30 rounded-lg bg-white/10 text-white backdrop-blur-sm"
                  >
                    <option value="" className="text-gray-900">Todos</option>
                    <option value="instock" className="text-gray-900">En stock</option>
                    <option value="discount" className="text-gray-900">Con descuento</option>
                  </select>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-purple-300/30">
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full bg-yellow-400 text-purple-900 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
                >
                  Aplicar Filtros
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  )
}