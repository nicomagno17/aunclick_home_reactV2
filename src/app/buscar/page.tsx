'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { SearchBar } from '@/components/search-bar'
import { HorizontalCarousel } from '@/components/horizontal-carousel'
import { Product } from '@/types/product'
import { mockProducts } from '@/data/mock-products'
import { ArrowLeft, Filter, SortDesc } from 'lucide-react'

function SearchPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('todos')
  const [sortBy, setSortBy] = useState<'relevance' | 'price-low' | 'price-high' | 'rating'>('relevance')
  const [showFilters, setShowFilters] = useState(false)

  // Obtener el término de búsqueda de la URL
  const initialQuery = searchParams.get('q') || ''

  useEffect(() => {
    setSearchTerm(initialQuery)
    fetchProducts()
  }, [initialQuery])

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
      return matchesSearch && matchesCategory
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
  }, [products, searchTerm, selectedCategory, sortBy])

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header de búsqueda */}
      <header className="bg-gradient-to-r from-purple-900 via-purple-800 to-purple-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          {/* Botón volver */}
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="text-sm">Volver</span>
            </button>
          </div>
          
          {/* Barra de búsqueda */}
          <div className="w-full">
            <SearchBar 
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Buscar productos, tiendas, categorías..."
            />
          </div>
        </div>
      </header>

      {/* Filtros y ordenamiento */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
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
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filtros</span>
              </button>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border-0 rounded-lg hover:bg-gray-200 transition-colors outline-none"
              >
                <option value="relevance">Más relevante</option>
                <option value="price-low">Precio: menor a mayor</option>
                <option value="price-high">Precio: mayor a menor</option>
                <option value="rating">Mejor calificados</option>
              </select>
            </div>
          </div>

          {/* Panel de filtros expandible */}
          {showFilters && (
            <div className="border-t border-gray-200 pt-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Precio</label>
                  <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg">
                    <option value="">Todos los precios</option>
                    <option value="0-50000">Hasta $50.000</option>
                    <option value="50000-100000">$50.000 - $100.000</option>
                    <option value="100000-500000">$100.000 - $500.000</option>
                    <option value="500000+">Más de $500.000</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Calificación</label>
                  <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg">
                    <option value="">Todas</option>
                    <option value="4.5">4.5+ estrellas</option>
                    <option value="4">4+ estrellas</option>
                    <option value="3.5">3.5+ estrellas</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Disponibilidad</label>
                  <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg">
                    <option value="">Todos</option>
                    <option value="instock">En stock</option>
                    <option value="discount">Con descuento</option>
                  </select>
                </div>
              </div>
            </div>
          )}
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

        {/* Resultados */}
        {!loading && filteredProducts.length > 0 && (
          <div className="space-y-8">
            {/* Productos con descuento */}
            {filteredProducts.some(p => p.discount) && (
              <HorizontalCarousel
                title="🔥 Ofertas encontradas"
                subtitle={`${filteredProducts.filter(p => p.discount).length} productos con descuento`}
                products={filteredProducts.filter(p => p.discount).slice(0, 12)}
                cardKeyPrefix="offers-results"
              />
            )}
            
            {/* Todos los resultados */}
            <HorizontalCarousel
              title={searchTerm ? `Resultados para "${searchTerm}"` : "Todos los productos"}
              subtitle={`${filteredProducts.length} productos encontrados${selectedCategory !== 'todos' ? ` en ${categories.find(c => c.id === selectedCategory)?.name}` : ''}`}
              products={filteredProducts.slice(0, 20)}
              cardKeyPrefix="all-results"
            />
            
            {/* Productos mejor calificados */}
            {filteredProducts.filter(p => p.rating >= 4.5).length > 0 && (
              <HorizontalCarousel
                title="⭐ Mejor calificados"
                subtitle={`Los ${filteredProducts.filter(p => p.rating >= 4.5).length} productos mejor valorados`}
                products={filteredProducts.filter(p => p.rating >= 4.5).slice(0, 12)}
                cardKeyPrefix="top-rated-results"
              />
            )}
            
            {/* Más resultados si hay muchos productos */}
            {filteredProducts.length > 20 && (
              <HorizontalCarousel
                title="Más resultados"
                subtitle={`${filteredProducts.length - 20} productos adicionales`}
                products={filteredProducts.slice(20, 40)}
                cardKeyPrefix="more-results"
              />
            )}

            {/* Estadísticas de búsqueda */}
            <div className="bg-gray-50 rounded-lg p-6 mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen de búsqueda</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-white rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-600">{filteredProducts.length}</div>
                  <div className="text-sm text-gray-600">Productos</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {filteredProducts.filter(p => p.discount).length}
                  </div>
                  <div className="text-sm text-gray-600">Con descuento</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {new Set(filteredProducts.map(p => p.source)).size}
                  </div>
                  <div className="text-sm text-gray-600">Tiendas</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-2xl font-bold text-orange-600">
                    {filteredProducts.filter(p => p.rating >= 4.5).length}
                  </div>
                  <div className="text-sm text-gray-600">4.5+ ⭐</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mensaje cuando no hay término de búsqueda */}
        {!loading && !searchTerm && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ¿Qué estás buscando?
              </h3>
              <p className="text-gray-600">
                Escribe algo en el buscador para encontrar productos, tiendas y más.
              </p>
            </div>
          </div>
        )}
      </main>
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