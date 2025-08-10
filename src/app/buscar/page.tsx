'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { SearchBar } from '@/components/search-bar'
import { HorizontalCarousel } from '@/components/horizontal-carousel'
import { Product } from '@/types/product'
import { ChevronDown, ArrowLeft } from 'lucide-react'

function SearchPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('todos')

  // Obtener el término de búsqueda de la URL
  const initialQuery = searchParams.get('q') || ''

  useEffect(() => {
    setSearchTerm(initialQuery)
    fetchProducts()
  }, [initialQuery])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch = searchTerm === '' || 
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.source.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower)
      
      const matchesCategory = selectedCategory === 'todos' || product.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [products, searchTerm, selectedCategory])

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

      {/* Filtros de categoría */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
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
          <div>
            <HorizontalCarousel
              title="Resultados de búsqueda"
              subtitle={`${filteredProducts.length} productos encontrados`}
              products={filteredProducts}
              cardKeyPrefix="search-results"
            />
            
            {/* Si hay muchos resultados, mostrarlos en grupos */}
            {filteredProducts.length > 20 && (
              <>
                <HorizontalCarousel
                  title="Más resultados"
                  subtitle="Productos adicionales"
                  products={filteredProducts.slice(20)}
                  cardKeyPrefix="more-results"
                />
              </>
            )}
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