'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { HorizontalCarousel } from '@/components/horizontal-carousel'
import { SkeletonCarousel } from '@/components/skeleton-carousel'
import { ImageCarouselContinuous } from '@/components/image-carousel-continuous'
import { ImageCarouselContinuous2 } from '@/components/image-carousel-continuous2'
import { InfoBannerCarousel } from '@/components/info-banner-carousel'
import { Product } from '@/types/product'
import { Mail, Phone, MessageCircle, Users, Store, HelpCircle, Shield, Cookie, RefreshCw, FileText } from 'lucide-react'

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

      {/* Carrusel Continuo de 12 Imágenes */}
      <ImageCarouselContinuous 
        images={[
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1483985988355-7647b8b3e340?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1551107696-a4b0c5a0b9b1?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1526170375885-4d8ec677e1c8?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1551024601-bec78aea804d?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=300&fit=crop"
        ]}
        sourceNames={[
          "TechStore Pro",
          "Fashion Hub",
          "Home & Garden",
          "Sports World",
          "Beauty Plus",
          "Book Corner",
          "Music Zone",
          "Gadget Galaxy",
          "Pet Paradise",
          "Auto Parts",
          "Health Store",
          "Toy Kingdom"
        ]}
        showSource={true}
        autoPlayInterval={6000}
      />

      {/* Main Content */}
      <main className="container mx-auto py-8 px-6">
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
          </>
        )}

        {/* Segundo Carrusel Continuo de 12 Imágenes */}
        <ImageCarouselContinuous2 
          images={[
            "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1503376780353-7b66bfc32e44?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1551818255-e6e10975bc51?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1526170375885-4d8ec677e1c8?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1551024601-bec78aea804d?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=300&fit=crop"
          ]}
          sourceNames={[
            "ElectroMax",
            "Style House",
            "Green Life",
            "Sports Pro",
            "Wellness Center",
            "Art Studio",
            "Tech Solutions",
            "Fashion Elite",
            "Smart Home",
            "Digital World",
            "Innovation Lab",
            "Future Tech"
          ]}
          showSource={true}
          autoPlayInterval={6000}
        />

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

        {/* Carrusel Informativo */}
        <InfoBannerCarousel autoPlayInterval={7000}>
          {/* Banner 1: Plataforma de Registro Gratuito */}
          <section className="mb-6 md:mb-8">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl h-[280px] md:h-[260px] bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
              {/* Patrón de fondo dinámico */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0" style={{
                  backgroundImage: `radial-gradient(circle at 25% 25%, rgba(168, 85, 247, 0.4) 0%, transparent 50%), 
                                   radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.4) 0%, transparent 50%)`
                }}></div>
                {/* Líneas de flujo */}
                <div className="absolute inset-0" style={{
                  backgroundImage: `linear-gradient(45deg, transparent 48%, rgba(255,255,255,0.1) 49%, rgba(255,255,255,0.1) 51%, transparent 52%)`,
                  backgroundSize: '60px 60px'
                }}></div>
              </div>
              
              {/* Elementos flotantes animados */}
              <div className="absolute top-6 left-6 w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
              <div className="absolute bottom-8 right-8 w-4 h-4 bg-blue-400 rounded-full animate-ping"></div>
              <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
              
              {/* Contenido principal */}
              <div className="relative z-10 h-full flex flex-col lg:flex-row items-center justify-between p-4 md:p-6 lg:p-8">
                {/* Lado izquierdo - Contenido principal */}
                <div className="flex-1 flex items-center justify-center lg:justify-start">
                  <div className="text-center lg:text-left">
                    {/* Título principal con énfasis */}
                    <div className="mb-4">
                      <span className="inline-block bg-gradient-to-r from-yellow-400 to-orange-400 text-transparent bg-clip-text text-xl md:text-2xl lg:text-3xl font-black">
                        ¡REGÍSTRATE GRATIS!
                      </span>
                    </div>
                    
                    {/* Descripción detallada */}
                    <p className="text-gray-200 text-xs md:text-sm mb-3 md:mb-6 leading-relaxed text-justify max-w-md">
                      <span className="lg:hidden">Sube productos, crea tu tienda virtual y expande tu alcance. ¡Aumenta tus ventas con nosotros!</span>
                      <span className="hidden lg:inline">Sube tus productos, crea tu tienda virtual y expande tu alcance. ¡Aumenta tus ventas y haz crecer tu negocio con nosotros!</span>
                    </p>
                    
                    {/* CTA Principal */}
                    <button className="group relative bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold px-6 py-2 md:px-8 md:py-3 rounded-lg md:rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-yellow-500/40 overflow-hidden">
                      <span className="relative z-10 text-sm md:text-lg uppercase tracking-wide">COMENZAR AHORA</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      {/* Flecha animada */}
                      <svg className="hidden md:block w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Lado derecho - Elementos visuales */}
                <div className="flex-1 max-w-sm">
                  <div className="lg:hidden mt-2">
                    {/* Iconos de características - Versión móvil */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center border border-white/20">
                        <div className="w-5 h-5 bg-yellow-400/20 rounded-lg flex items-center justify-center mx-auto mb-1">
                          <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                          </svg>
                        </div>
                        <div className="text-yellow-300 font-semibold text-[9px]">Tienda Virtual</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center border border-white/20">
                        <div className="w-5 h-5 bg-orange-400/20 rounded-lg flex items-center justify-center mx-auto mb-1">
                          <svg className="w-3 h-3 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="text-orange-300 font-semibold text-[9px]">Sube Productos</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center border border-white/20">
                        <div className="w-5 h-5 bg-purple-400/20 rounded-lg flex items-center justify-center mx-auto mb-1">
                          <svg className="w-3 h-3 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="text-purple-300 font-semibold text-[9px]">Expande Alcance</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center border border-white/20">
                        <div className="w-5 h-5 bg-blue-400/20 rounded-lg flex items-center justify-center mx-auto mb-1">
                          <svg className="w-3 h-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="text-blue-300 font-semibold text-[9px]">Aumenta Ventas</div>
                      </div>
                    </div>
                  </div>
                  <div className="hidden lg:block">
                    {/* Iconos de características - Versión desktop (sin cambios) */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
                        <div className="w-8 h-8 bg-yellow-400/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                          </svg>
                        </div>
                        <div className="text-yellow-300 font-semibold text-xs">Tienda Virtual</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
                        <div className="w-8 h-8 bg-orange-400/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <svg className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="text-orange-300 font-semibold text-xs">Sube Productos</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
                        <div className="w-8 h-8 bg-purple-400/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="text-purple-300 font-semibold text-xs">Expande Alcance</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
                        <div className="w-8 h-8 bg-blue-400/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="text-blue-300 font-semibold text-xs">Aumenta Ventas</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Banner 2: Información de Seguridad */}
          <section className="mb-6 md:mb-8">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl h-[280px] md:h-[260px] bg-gradient-to-br from-amber-900 via-red-900 to-orange-900">
              {/* Patrón de advertencia */}
              <div className="absolute inset-0 opacity-15">
                <div className="absolute inset-0" style={{
                  backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)`,
                }}></div>
                {/* Patrón de escudo */}
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M30 10c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z'/%3E%3Cpath d='M30 15c-2.761 0-5 2.239-5 5s2.239 5 5 5 5-2.239 5-5-2.239-5-5-5zm0 8c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundSize: '60px 60px'
                }}></div>
              </div>
              
              {/* Contenido principal */}
              <div className="relative z-10 h-full flex flex-col lg:flex-row items-center justify-between p-4 md:p-6 lg:p-8">
                {/* Lado izquierdo - Mensaje principal */}
                <div className="flex-1 flex items-center justify-center lg:justify-start">
                  <div className="text-center lg:text-left">
                    {/* Título de seguridad */}
                    <div className="inline-flex items-center gap-2 bg-red-600/20 backdrop-blur-sm px-3 py-1 md:px-4 md:py-2 rounded-full mb-3 md:mb-4 border border-red-500/30">
                      <svg className="w-3 h-3 md:w-4 md:h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-red-300 font-semibold text-xs md:text-sm tracking-wide uppercase">Información de Seguridad</span>
                    </div>
                    
                    {/* Mensaje principal */}
                    <p className="text-gray-200 text-xs md:text-sm mb-3 md:mb-6 leading-relaxed text-justify max-w-md">
                      <span className="lg:hidden">Plataforma de vitrina para negocios locales. No realizamos ventas directas. Verifica la identidad del vendedor antes de transferencias.</span>
                      <span className="hidden lg:inline">Somos únicamente una plataforma de vitrina para negocios locales. No realizamos ventas directas ni procesamos pagos. Siempre verifica la identidad del vendedor antes de realizar transferencias.</span>
                    </p>
                  </div>
                </div>
                
                {/* Lado derecho - Tips de seguridad */}
                <div className="flex-1 max-w-sm">
                  <div className="bg-red-600/10 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-red-500/20">
                    <h4 className="text-red-300 font-semibold text-xs md:text-sm mb-2 md:mb-3 text-center uppercase tracking-wide">Recomendaciones de Seguridad</h4>
                    <div className="space-y-1 md:space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 md:w-6 md:h-6 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-2 h-2 md:w-3 md:h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-white/90 text-xs">Verifica datos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 md:w-6 md:h-6 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-2 h-2 md:w-3 md:h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-white/90 text-xs">Solicita referencias</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 md:w-6 md:h-6 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-2 h-2 md:w-3 md:h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-white/90 text-xs">Protege tus datos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 md:w-6 md:h-6 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-2 h-2 md:w-3 md:h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-white/90 text-xs">Reporta sospechas</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </InfoBannerCarousel>
        
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
      </main>

      {/* Footer */}
      <footer className="relative text-white py-8 px-6 mt-12 shadow-2xl" style={{ background: 'linear-gradient(90deg, #3b0764 0%, #4c1d95 20%, #6d28d9 40%, var(--yellow-accent) 100%)' }}>
        <div className="container mx-auto">
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