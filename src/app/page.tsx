'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { HorizontalCarousel } from '@/components/horizontal-carousel'
import { SkeletonCarousel } from '@/components/skeleton-carousel'
import { ImageCarouselContinuous } from '@/components/image-carousel-continuous'
import { ImageCarouselContinuous2 } from '@/components/image-carousel-continuous2'
import { HeaderCarousel } from '@/components/header-carousel'
import { InfoBannerCarousel } from '@/components/info-banner-carousel'
import { CategoryFilterCards } from '@/components/category-filter-cards'
import { Product } from '@/types/product'
import { Mail, Phone, MessageCircle, Users, Store, HelpCircle, Shield, Cookie, RefreshCw, FileText, Package, Gift, Lock, Key, Eye, AlertTriangle, Search, MapPin, Ban } from 'lucide-react'
import { ResponsiveSearchSection } from '@/components/responsive-search-section'

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')



  useEffect(() => {
    fetchProducts()
  }, [])



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



  return (
    <div className="min-h-screen bg-background">
      {/* Header Reutilizable */}
      <Header 
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        showBackButton={false}
        showFloatingSearch={true}
      />

      {/* Nuevo Carrusel entre Header y Destacados con tarjetas de filtro */}
      <div className="relative">
        <HeaderCarousel
          sections={[
            {
              images: [
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
                "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400&h=300&fit=crop"
              ]
            },
            {
              images: [
                "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop",
                "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop"
              ]
            },
            {
              images: [
                "https://images.unsplash.com/photo-1551818255-e6e10975bc51?w=400&h=300&fit=crop",
                "https://images.unsplash.com/photo-1526170375885-4d8ec677e1c8?w=400&h=300&fit=crop"
              ]
            }
          ]}
          autoPlayInterval={7000}
        />
        <CategoryFilterCards />
      </div>

      {/* Main Content */}
      <main className="pt-20 md:pt-24 pb-8">
        {loading ? (
          <>
            {/* Skeletons de carga */}
            <SkeletonCarousel
              title="Destacados"
              subtitle="Los productos más populares del momento"
              cardCount={10}
            />
            <SkeletonCarousel
              title="Ofertas"
              subtitle="Descuentos exclusivos por tiempo limitado"
              cardCount={10}
            />
            <SkeletonCarousel
              title="Novedades"
              subtitle="Los últimos lanzamientos del mercado"
              cardCount={10}
            />
            <SkeletonCarousel
              title="Tendencias"
              subtitle="Lo más buscado y deseado actualmente"
              cardCount={10}
            />
          </>
        ) : (
          <>
            {/* Sección Destacados */}
            <HorizontalCarousel
              title="Destacados"
              subtitle="Los productos más populares del momento"
              products={products.slice(0, 10)}
              cardKeyPrefix="destacados"
            />

            {/* Sección Ofertas */}
            <HorizontalCarousel
              title="Ofertas"
              subtitle="Descuentos exclusivos por tiempo limitado"
              products={products.filter(p => p.discount && p.discount > 0).slice(0, 10)}
              cardKeyPrefix="ofertas"
            />

            {/* Carrusel Circular Infinito de 8 Tiendas */}
            <ImageCarouselContinuous2
              images={[
                "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1503376780353-7b66bfc32e44?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=400&fit=crop"
              ]}
              sourceNames={[
                "ElectroMax",
                "Style House",
                "Green Life",
                "Sports Pro",
                "Wellness Center",
                "Art Studio",
                "Tech Solutions",
                "Fashion Elite"
              ]}
              showSource={true}
            />

            {/* Sección Novedades */}
            <HorizontalCarousel
              title="Novedades"
              subtitle="Los últimos lanzamientos del mercado"
              products={products.slice(4, 14)}
              cardKeyPrefix="novedades"
            />

            {/* Sección Tendencias */}
            <HorizontalCarousel
              title="Tendencias"
              subtitle="Lo más buscado y deseado actualmente"
              products={products.slice(2, 12)}
              cardKeyPrefix="tendencias"
            />

            {/* Carrusel Informativo */}
            <div className="px-6">
              <InfoBannerCarousel autoPlayInterval={7000}>
                {/* Banner 1: Regístrate y Obtén Beneficios */}
                <section className="mb-6 md:mb-8">
                <div className="relative overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl h-[240px] md:h-[260px] bg-purple-200">
                  {/* Patrón decorativo sutil */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `radial-gradient(circle at 30% 40%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
                                       radial-gradient(circle at 70% 60%, rgba(196, 181, 253, 0.3) 0%, transparent 50%)`
                    }}></div>
                  </div>

                  {/* Contenido */}
                  <div className="relative z-10 h-full p-4 md:p-6">
                    <div className="h-full md:grid md:grid-cols-2 md:gap-6">
                      {/* Columna Izquierda - Contenido de texto */}
                      <div className="h-full flex flex-col justify-between max-w-3xl">
                        {/* Contenido superior */}
                        <div>
                          {/* Título */}
                          <div className="flex items-center gap-2 mb-3">
                            <div className="bg-purple-600 text-white p-2 rounded-lg">
                              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                              </svg>
                            </div>
                            <h2 className="text-xl md:text-3xl font-black text-purple-900">
                              ¡Regístrate Gratis!
                            </h2>
                          </div>

                          {/* Beneficios */}
                          <div className="space-y-2 mb-4">
                            <div className="flex items-start gap-2">
                              <svg className="w-5 h-5 text-purple-700 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <p className="text-purple-900 text-xs md:text-sm font-medium">Crea tu tienda virtual y sube productos ilimitados</p>
                            </div>
                            <div className="flex items-start gap-2">
                              <svg className="w-5 h-5 text-purple-700 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <p className="text-purple-900 text-xs md:text-sm font-medium">Contacto directo con clientes de tu zona</p>
                            </div>
                            <div className="flex items-start gap-2">
                              <svg className="w-5 h-5 text-purple-700 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <p className="text-purple-900 text-xs md:text-sm font-medium">Sin comisiones por ventas - 100% gratis</p>
                            </div>
                            <div className="flex items-start gap-2">
                              <svg className="w-5 h-5 text-purple-700 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <p className="text-purple-900 text-xs md:text-sm font-medium">Administra tu negocio desde cualquier dispositivo</p>
                            </div>
                          </div>
                        </div>

                        {/* Botón en la parte inferior */}
                        <div>
                          <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-5 py-2 rounded-lg text-sm transition-colors shadow-lg">
                            Crear mi cuenta gratis
                          </button>
                        </div>
                      </div>

                      {/* Columna Derecha - Grid de 4 tarjetas con iconos (Solo Desktop) */}
                      <div className="hidden md:grid grid-cols-2 gap-2 items-center justify-center">
                        {/* Tarjeta 1 - Tienda */}
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-3 flex flex-col items-center justify-center hover:shadow-lg hover:scale-105 transition-all duration-300 border border-purple-300">
                          <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-2 rounded-full mb-2">
                            <Store className="w-6 h-6 text-white" />
                          </div>
                          <p className="text-purple-900 font-bold text-[10px] text-center leading-tight">Tu Tienda Virtual</p>
                        </div>

                        {/* Tarjeta 2 - Productos */}
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-3 flex flex-col items-center justify-center hover:shadow-lg hover:scale-105 transition-all duration-300 border border-blue-300">
                          <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-2 rounded-full mb-2">
                            <Package className="w-6 h-6 text-white" />
                          </div>
                          <p className="text-blue-900 font-bold text-[10px] text-center leading-tight">Productos Ilimitados</p>
                        </div>

                        {/* Tarjeta 3 - Clientes */}
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-3 flex flex-col items-center justify-center hover:shadow-lg hover:scale-105 transition-all duration-300 border border-green-300">
                          <div className="bg-gradient-to-br from-green-500 to-green-700 p-2 rounded-full mb-2">
                            <Users className="w-6 h-6 text-white" />
                          </div>
                          <p className="text-green-900 font-bold text-[10px] text-center leading-tight">Contacto Directo</p>
                        </div>

                        {/* Tarjeta 4 - Gratis */}
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-3 flex flex-col items-center justify-center hover:shadow-lg hover:scale-105 transition-all duration-300 border border-orange-300">
                          <div className="bg-gradient-to-br from-orange-500 to-orange-700 p-2 rounded-full mb-2">
                            <Gift className="w-6 h-6 text-white" />
                          </div>
                          <p className="text-orange-900 font-bold text-[10px] text-center leading-tight">100% Gratis</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Banner 2: Tus Datos Están Seguros */}
              <section className="mb-6 md:mb-8">
                <div className="relative overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl h-[240px] md:h-[260px] bg-purple-200">
                  {/* Patrón decorativo sutil */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `radial-gradient(circle at 30% 40%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
                                       radial-gradient(circle at 70% 60%, rgba(196, 181, 253, 0.3) 0%, transparent 50%)`
                    }}></div>
                  </div>

                  {/* Contenido */}
                  <div className="relative z-10 h-full p-4 md:p-6">
                    <div className="h-full md:grid md:grid-cols-2 md:gap-6">
                      {/* Columna Izquierda - Contenido de texto */}
                      <div className="h-full flex flex-col justify-between max-w-3xl">
                        {/* Contenido superior */}
                        <div>
                          {/* Título */}
                          <div className="flex items-center gap-2 mb-3">
                            <div className="bg-purple-600 text-white p-2 rounded-lg">
                              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                            </div>
                            <h2 className="text-xl md:text-3xl font-black text-purple-900">
                              Tus Datos Están Seguros
                            </h2>
                          </div>

                          {/* Información de seguridad */}
                          <div className="space-y-2 mb-4">
                            <div className="flex items-start gap-2">
                              <svg className="w-5 h-5 text-purple-700 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <p className="text-purple-900 text-xs md:text-sm font-medium">Protegemos tu información personal con encriptación</p>
                            </div>
                            <div className="flex items-start gap-2">
                              <svg className="w-5 h-5 text-purple-700 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <p className="text-purple-900 text-xs md:text-sm font-medium">No compartimos tus datos con terceros</p>
                            </div>
                            <div className="flex items-start gap-2">
                              <svg className="w-5 h-5 text-purple-700 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <p className="text-purple-900 text-xs md:text-sm font-medium">Cumplimos con las normas de privacidad y seguridad</p>
                            </div>
                            <div className="flex items-start gap-2">
                              <svg className="w-5 h-5 text-purple-700 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <p className="text-purple-900 text-xs md:text-sm font-medium">Controlas qué información compartes públicamente</p>
                            </div>
                          </div>
                        </div>

                        {/* Botón en la parte inferior */}
                        <div>
                          <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-5 py-2 rounded-lg text-sm transition-colors shadow-lg">
                            Conoce más sobre nuestra seguridad
                          </button>
                        </div>
                      </div>

                      {/* Columna Derecha - Grid de 4 tarjetas con iconos de seguridad (Solo Desktop) */}
                      <div className="hidden md:grid grid-cols-2 gap-2 items-center justify-center">
                        {/* Tarjeta 1 - Candado */}
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-3 flex flex-col items-center justify-center hover:shadow-lg hover:scale-105 transition-all duration-300 border border-purple-300">
                          <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-2 rounded-full mb-2">
                            <Lock className="w-6 h-6 text-white" />
                          </div>
                          <p className="text-purple-900 font-bold text-[10px] text-center leading-tight">Datos Protegidos</p>
                        </div>

                        {/* Tarjeta 2 - Escudo */}
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-3 flex flex-col items-center justify-center hover:shadow-lg hover:scale-105 transition-all duration-300 border border-blue-300">
                          <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-2 rounded-full mb-2">
                            <Shield className="w-6 h-6 text-white" />
                          </div>
                          <p className="text-blue-900 font-bold text-[10px] text-center leading-tight">Seguridad Total</p>
                        </div>

                        {/* Tarjeta 3 - Llave */}
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-3 flex flex-col items-center justify-center hover:shadow-lg hover:scale-105 transition-all duration-300 border border-green-300">
                          <div className="bg-gradient-to-br from-green-500 to-green-700 p-2 rounded-full mb-2">
                            <Key className="w-6 h-6 text-white" />
                          </div>
                          <p className="text-green-900 font-bold text-[10px] text-center leading-tight">Encriptación</p>
                        </div>

                        {/* Tarjeta 4 - Privacidad */}
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-3 flex flex-col items-center justify-center hover:shadow-lg hover:scale-105 transition-all duration-300 border border-indigo-300">
                          <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-2 rounded-full mb-2">
                            <Eye className="w-6 h-6 text-white" />
                          </div>
                          <p className="text-indigo-900 font-bold text-[10px] text-center leading-tight">Privacidad</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Banner 3: Compra con Seguridad */}
              <section className="mb-6 md:mb-8">
                <div className="relative overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl h-[240px] md:h-[260px] bg-purple-200">
                  {/* Patrón decorativo sutil */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `radial-gradient(circle at 30% 40%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
                                       radial-gradient(circle at 70% 60%, rgba(196, 181, 253, 0.3) 0%, transparent 50%)`
                    }}></div>
                  </div>

                  {/* Contenido */}
                  <div className="relative z-10 h-full p-4 md:p-6">
                    <div className="h-full md:grid md:grid-cols-2 md:gap-6">
                      {/* Columna Izquierda - Contenido de texto */}
                      <div className="h-full flex flex-col justify-between max-w-3xl">
                        {/* Contenido superior */}
                        <div>
                          {/* Título */}
                          <div className="flex items-center gap-2 mb-3">
                            <div className="bg-purple-600 text-white p-2 rounded-lg">
                              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                            </div>
                            <h2 className="text-xl md:text-3xl font-black text-purple-900">
                              ⚠️ Compra con Precaución
                            </h2>
                          </div>

                          {/* Advertencias */}
                          <div className="space-y-2 mb-4">
                            <div className="flex items-start gap-2">
                              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M13.477 14.89A6 6 0 515.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                              </svg>
                              <p className="text-purple-900 text-xs md:text-sm font-medium">Somos una vitrina, NO procesamos pagos</p>
                            </div>
                            <div className="flex items-start gap-2">
                              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M13.477 14.89A6 6 0 515.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                              </svg>
                              <p className="text-purple-900 text-xs md:text-sm font-medium">Nunca transfieras sin conocer al vendedor</p>
                            </div>
                            <div className="flex items-start gap-2">
                              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M13.477 14.89A6 6 0 515.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                              </svg>
                              <p className="text-purple-900 text-xs md:text-sm font-medium">Verifica el producto antes de pagar</p>
                            </div>
                            <div className="flex items-start gap-2">
                              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M13.477 14.89A6 6 0 515.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                              </svg>
                              <p className="text-purple-900 text-xs md:text-sm font-medium">Acuerda un lugar seguro de encuentro</p>
                            </div>
                          </div>
                        </div>

                        {/* Botón en la parte inferior */}
                        <div>
                          <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-5 py-2 rounded-lg text-sm transition-colors shadow-lg">
                            Leer consejos de seguridad
                          </button>
                        </div>
                      </div>

                      {/* Columna Derecha - Grid de 4 tarjetas con iconos de precaución (Solo Desktop) */}
                      <div className="hidden md:grid grid-cols-2 gap-2 items-center justify-center">
                        {/* Tarjeta 1 - Advertencia */}
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-3 flex flex-col items-center justify-center hover:shadow-lg hover:scale-105 transition-all duration-300 border border-red-300">
                          <div className="bg-gradient-to-br from-red-500 to-red-700 p-2 rounded-full mb-2">
                            <AlertTriangle className="w-6 h-6 text-white" />
                          </div>
                          <p className="text-red-900 font-bold text-[10px] text-center leading-tight">Mantente Alerta</p>
                        </div>

                        {/* Tarjeta 2 - Verificar */}
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-3 flex flex-col items-center justify-center hover:shadow-lg hover:scale-105 transition-all duration-300 border border-orange-300">
                          <div className="bg-gradient-to-br from-orange-500 to-orange-700 p-2 rounded-full mb-2">
                            <Search className="w-6 h-6 text-white" />
                          </div>
                          <p className="text-orange-900 font-bold text-[10px] text-center leading-tight">Verifica Producto</p>
                        </div>

                        {/* Tarjeta 3 - Lugar Seguro */}
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-3 flex flex-col items-center justify-center hover:shadow-lg hover:scale-105 transition-all duration-300 border border-amber-300">
                          <div className="bg-gradient-to-br from-amber-500 to-amber-700 p-2 rounded-full mb-2">
                            <MapPin className="w-6 h-6 text-white" />
                          </div>
                          <p className="text-amber-900 font-bold text-[10px] text-center leading-tight">Lugar Seguro</p>
                        </div>

                        {/* Tarjeta 4 - No Pago Anticipado */}
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-3 flex flex-col items-center justify-center hover:shadow-lg hover:scale-105 transition-all duration-300 border border-yellow-300">
                          <div className="bg-gradient-to-br from-yellow-500 to-yellow-700 p-2 rounded-full mb-2">
                            <Ban className="w-6 h-6 text-white" />
                          </div>
                          <p className="text-yellow-900 font-bold text-[10px] text-center leading-tight">No Pago Anticipado</p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </section>
              </InfoBannerCarousel>
            </div>

            {loading ? (
              <SkeletonCarousel
                title="¡No te lo Pierdas!"
                subtitle="Oportunidades únicas que no puedes dejar pasar"
                cardCount={10}
              />
            ) : (
              /* Sección ¡No te lo Pierdas! */
              <HorizontalCarousel
                title="¡No te lo Pierdas!"
                subtitle="Oportunidades únicas que no puedes dejar pasar"
                products={products.slice(6, 16)}
                cardKeyPrefix="no-te-lo-pierdas"
              />
            )}

            {loading ? (
              <SkeletonCarousel
                title="Liquidaciones"
                subtitle="Precios increíbles en productos seleccionados"
                cardCount={8}
              />
            ) : (
              /* Sección Liquidaciones */
              <HorizontalCarousel
                title="Liquidaciones"
                subtitle="Precios increíbles en productos seleccionados"
                products={products.slice(4, 12)}
                cardKeyPrefix="liquidaciones"
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="relative text-white py-8 mt-12 shadow-2xl" style={{ background: 'linear-gradient(90deg, #3b0764 0%, #4c1d95 20%, #6d28d9 40%, var(--yellow-accent) 100%)' }}>
        <div className="px-6">
          {/* Fila superior - 2 filas de 2 columnas en móvil, 4 columnas en desktop */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 mb-8">

            {/* Primera fila en móvil: Logo y Contacto */}
            <div className="grid grid-cols-2 gap-6 md:gap-8 md:col-span-2">

              {/* Columna 1 - Logo y descripción */}
              <div className="text-left">
                <div className="mb-3 md:mb-4">
                  <h2 className="text-lg md:text-2xl font-bold text-white mb-0.5">Solo a un</h2>
                  <h2 className="text-xl md:text-3xl font-bold text-yellow-300">CLICK</h2>
                </div>
                <p className="text-primary-foreground/80 text-xs md:text-sm leading-relaxed">
                  Tu guía completa de comercios, servicios y eventos.
                </p>
                <p className="text-primary-foreground/80 text-xs md:text-sm leading-relaxed">
                  Descubre todo lo que tu ciudad tiene para ofrecer.
                </p>
              </div>

              {/* Columna 2 - Avisos Legales (intercambiado con Contacto) */}
              <div className="text-left">
                <h3 className="text-sm md:text-lg font-semibold text-white mb-3 md:mb-4 border-b border-yellow-400/30 pb-2">
                  Avisos Legales
                </h3>
                <div className="space-y-1 md:space-y-2">
                  <a href="#" className="flex items-center gap-1 md:gap-2 text-primary-foreground/80 text-xs hover:text-yellow-300 transition-colors duration-200">
                    <Shield className="w-3 h-3 md:w-4 md:h-4 text-yellow-300" />
                    Privacidad
                  </a>
                  <a href="#" className="flex items-center gap-1 md:gap-2 text-primary-foreground/80 text-xs hover:text-yellow-300 transition-colors duration-200">
                    <Cookie className="w-3 h-3 md:w-4 md:h-4 text-yellow-300" />
                    Cookies
                  </a>
                  <a href="#" className="flex items-center gap-1 md:gap-2 text-primary-foreground/80 text-xs hover:text-yellow-300 transition-colors duration-200">
                    <RefreshCw className="w-3 h-3 md:w-4 md:h-4 text-yellow-300" />
                    Reembolso
                  </a>
                  <a href="#" className="flex items-center gap-1 md:gap-2 text-primary-foreground/80 text-xs hover:text-yellow-300 transition-colors duration-200">
                    <Shield className="w-3 h-3 md:w-4 md:h-4 text-yellow-300" />
                    Seguridad
                  </a>
                  <a href="#" className="flex items-center gap-1 md:gap-2 text-primary-foreground/80 text-xs hover:text-yellow-300 transition-colors duration-200">
                    <FileText className="w-3 h-3 md:w-4 md:h-4 text-yellow-300" />
                    Condiciones y términos
                  </a>
                </div>
              </div>
            </div>

            {/* Segunda fila en móvil: Información y Contacto */}
            <div className="grid grid-cols-2 gap-6 md:gap-8 md:col-span-2">

              {/* Columna 3 - Información */}
              <div className="text-left">
                <h3 className="text-sm md:text-lg font-semibold text-white mb-3 md:mb-4 border-b border-yellow-400/30 pb-2">
                  Información
                </h3>
                <div className="space-y-1 md:space-y-2">
                  <a href="#" className="flex items-center gap-1 md:gap-2 text-primary-foreground/80 text-xs hover:text-yellow-300 transition-colors duration-200">
                    <Users className="w-3 h-3 md:w-4 md:h-4 text-yellow-300" />
                    Sobre Nosotros
                  </a>
                  <a href="#" className="flex items-center gap-1 md:gap-2 text-primary-foreground/80 text-xs hover:text-yellow-300 transition-colors duration-200">
                    <Store className="w-3 h-3 md:w-4 md:h-4 text-yellow-300" />
                    Registra tu Negocio
                  </a>
                  <a href="#" className="flex items-center gap-1 md:gap-2 text-primary-foreground/80 text-xs hover:text-yellow-300 transition-colors duration-200">
                    <HelpCircle className="w-3 h-3 md:w-4 md:h-4 text-yellow-300" />
                    Preguntas
                  </a>
                </div>
              </div>

              {/* Columna 4 - Contacto (intercambiado con Avisos Legales) */}
              <div className="text-left">
                <h3 className="text-sm md:text-lg font-semibold text-white mb-3 md:mb-4 border-b border-yellow-400/30 pb-2">
                  Contacto
                </h3>
                <div className="space-y-2 md:space-y-3">
                  <div className="flex items-center gap-2 md:gap-3">
                    <Mail className="w-3 h-3 md:w-4 md:h-4 text-yellow-300" />
                    <span className="text-primary-foreground/80 text-xs">soloaunclick@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3">
                    <Phone className="w-3 h-3 md:w-4 md:h-4 text-yellow-300" />
                    <span className="text-primary-foreground/80 text-xs">+1 234 567 890</span>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3">
                    <MessageCircle className="w-3 h-3 md:w-4 md:h-4 text-yellow-300" />
                    <span className="text-primary-foreground/80 text-xs">+1 234 567 891</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fila inferior - Copyright */}
          <div className="border-t border-primary-foreground/20 pt-4 md:pt-6">
            <div className="text-center">
              <p className="text-primary-foreground/90 text-xs md:text-sm mb-1 md:mb-2">
                © 2025 Solo a un CLICK. Todos los derechos reservados.
              </p>
              <p className="text-primary-foreground/70 text-[10px] md:text-xs leading-relaxed max-w-2xl mx-auto">
                Solo a un CLICK es una plataforma de exhibición. Los productos publicados son responsabilidad exclusiva de la tienda que los ofrece.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}