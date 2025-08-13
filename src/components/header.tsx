'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SearchBar } from '@/components/search-bar'
import { FloatingSearchBar } from '@/components/floating-search-bar'
import { ChevronDown, Menu, ArrowLeft } from 'lucide-react'

interface HeaderProps {
  searchTerm: string
  onSearchTermChange: (value: string) => void
  showBackButton?: boolean
  showFloatingSearch?: boolean
}

export function Header({ 
  searchTerm, 
  onSearchTermChange, 
  showBackButton = false,
  showFloatingSearch = true 
}: HeaderProps) {
  const router = useRouter()
  
  // Estados para los modales desplegables
  const [showCategorias, setShowCategorias] = useState(false)
  const [showArriendos, setShowArriendos] = useState(false)
  const [showServicios, setShowServicios] = useState(false)
  
  // Estado para el menú móvil
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  // Estado para la barra de búsqueda flotante
  const [showFloatingSearchBar, setShowFloatingSearchBar] = useState(false)

  // Función para cerrar todos los modales
  const closeAllModals = () => {
    setShowCategorias(false)
    setShowArriendos(false)
    setShowServicios(false)
    setShowMobileMenu(false)
  }

  // Función para toggle de categorías (cierra otros modales)
  const toggleCategorias = () => {
    if (showCategorias) {
      setShowCategorias(false)
    } else {
      closeAllModals()
      setShowCategorias(true)
    }
  }

  // Función para toggle de arriendos (cierra otros modales)
  const toggleArriendos = () => {
    if (showArriendos) {
      setShowArriendos(false)
    } else {
      closeAllModals()
      setShowArriendos(true)
    }
  }

  // Función para toggle de servicios (cierra otros modales)
  const toggleServicios = () => {
    if (showServicios) {
      setShowServicios(false)
    } else {
      closeAllModals()
      setShowServicios(true)
    }
  }

  // Función para toggle del menú móvil (cierra otros modales)
  const toggleMobileMenu = () => {
    if (showMobileMenu) {
      setShowMobileMenu(false)
    } else {
      closeAllModals()
      setShowMobileMenu(true)
    }
  }

  // Efecto para cerrar modales al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Si algún modal está abierto y el clic fue fuera de los modales
      if ((showCategorias || showArriendos || showServicios || showMobileMenu) && 
          !(event.target as Element).closest('.modal-container')) {
        closeAllModals()
      }
    }

    // Agregar event listener
    document.addEventListener('mousedown', handleClickOutside)
    
    // Limpiar event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showCategorias, showArriendos, showServicios, showMobileMenu])

  // Efecto para detectar scroll y mostrar/ocultar barra de búsqueda flotante
  useEffect(() => {
    if (!showFloatingSearch) return

    const handleScroll = () => {
      const header = document.querySelector('header')
      if (header) {
        const headerRect = header.getBoundingClientRect()
        // Mostrar barra flotante si el header no está visible
        setShowFloatingSearchBar(headerRect.bottom < 0)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Verificar estado inicial
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [showFloatingSearch])

  return (
    <>
      {/* Barra de búsqueda flotante */}
      {showFloatingSearch && (
        <FloatingSearchBar
          value={searchTerm}
          onChange={onSearchTermChange}
          isVisible={showFloatingSearchBar}
          placeholder="Buscar productos, tiendas, categorías..."
        />
      )}

      {/* Header Principal */}
      <header className="relative text-white shadow-2xl" style={{ background: 'linear-gradient(90deg, #3b0764 0%, #4c1d95 20%, #6d28d9 40%, var(--yellow-accent) 100%)' }}>
        <div className="container mx-auto relative z-10">
          {/* Versión Desktop */}
          <div className="hidden sm:block py-6 px-6">
            <div className="flex items-center justify-between">
              {/* Logo/Título - Dos filas a la izquierda */}
              <div className="flex flex-col items-start cursor-pointer" onClick={() => router.push('/')}>
                <h1 className="text-xl font-bold leading-tight text-white">Solo a</h1>
                <h1 className="text-4xl font-bold leading-tight text-yellow-300">un CLICK</h1>
              </div>

              {/* Buscador en el centro */}
              <div className="flex-1 max-w-lg mx-8">
                <SearchBar 
                  value={searchTerm} 
                  onChange={onSearchTermChange}
                  placeholder="Buscar productos, tiendas, categorías..."
                />
              </div>

              {/* Botón volver o Espacio publicitario */}
              {showBackButton ? (
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-purple-600/50 hover:bg-purple-600/70 px-4 py-2 rounded-lg backdrop-blur-sm border border-purple-300/30"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    <span className="text-sm">Volver</span>
                  </button>
                </div>
              ) : (
                /* Espacio publicitario a la derecha */
                <div className="group w-56 h-16 bg-gradient-to-br from-purple-700/80 via-purple-600/70 to-purple-500/60 border-2 border-purple-300/60 rounded-xl flex items-center justify-center p-3 hover:shadow-xl hover:shadow-purple-400/40 transition-all duration-500 hover:scale-105 backdrop-blur-sm relative overflow-hidden">
                  {/* Efecto de brillo */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  
                  {/* Icono decorativo */}
                  <div className="absolute top-1 right-2">
                    <svg className="w-3 h-3 text-white/60" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8 2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </div>
                  
                  <div className="text-center relative z-10">
                    <div className="text-[9px] font-extrabold text-white leading-tight tracking-wider uppercase">Espacio Premium</div>
                    <div className="text-xs font-bold text-white leading-tight tracking-wide">Publicitario</div>
                    <div className="text-[9px] text-purple-200 leading-tight mt-0.5">• Disponible •</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Versión Móvil */}
          <div className="sm:hidden w-full">
            {/* Primera fila: Título, banner publicitario y botón volver */}
            <div className="flex items-center justify-between px-4 py-3 gap-3">
              {/* Logo/Título - Más pequeño y a la izquierda */}
              <div className="flex flex-col items-start cursor-pointer flex-shrink-0" onClick={() => router.push('/')}>
                <h1 className="text-sm font-bold leading-tight text-white">Solo a</h1>
                <h1 className="text-lg font-bold leading-tight text-yellow-300">un CLICK</h1>
              </div>

              {/* Banner publicitario en el centro (solo si no hay botón volver) */}
              {!showBackButton && (
                <div className="flex-1 max-w-[180px]">
                  <div className="group w-full h-12 bg-gradient-to-br from-purple-700/80 via-purple-600/70 to-purple-500/60 border-2 border-purple-300/60 rounded-lg flex items-center justify-center p-2 hover:shadow-lg hover:shadow-purple-400/40 transition-all duration-500 backdrop-blur-sm relative overflow-hidden">
                    {/* Efecto de brillo */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    
                    {/* Icono decorativo */}
                    <div className="absolute top-1 right-2">
                      <svg className="w-2 h-2 text-white/60" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8 2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    </div>
                    
                    <div className="text-center relative z-10">
                      <div className="text-[8px] font-extrabold text-white leading-tight tracking-wider uppercase">Espacio Premium</div>
                      <div className="text-[10px] font-bold text-white leading-tight tracking-wide">Publicitario</div>
                      <div className="text-[8px] text-purple-200 leading-tight mt-0.5">• Disponible •</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Botón volver si es necesario */}
              {showBackButton && (
                <button
                  onClick={() => router.back()}
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-purple-600/50 hover:bg-purple-600/70 px-3 py-2 rounded-lg backdrop-blur-sm border border-purple-300/30 flex-shrink-0"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="text-xs">Volver</span>
                </button>
              )}
            </div>

            {/* Segunda fila: Buscador (siempre presente) */}
            <div className="px-4 pb-3">
              <SearchBar 
                value={searchTerm} 
                onChange={onSearchTermChange}
                placeholder="Buscar productos..."
                className="text-sm"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Barra de navegación inferior */}
      <nav className="bg-gradient-to-r from-purple-900 via-purple-800 to-purple-700 border-t border-yellow-400 shadow-md mb-4">
        {/* Versión Desktop */}
        <div className="hidden sm:block">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between py-1">
              {/* Enlaces centrados: Categorías, Arriendos, Servicios */}
              <div className="flex-1 flex items-center justify-center space-x-8 relative">
                {/* Categorías */}
                <div className="relative modal-container">
                  <button 
                    onClick={toggleCategorias}
                    className="flex items-center space-x-2 text-white/90 hover:text-white transition-colors cursor-pointer text-sm font-medium"
                  >
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showCategorias ? 'rotate-180' : ''}`} />
                    <span>Categorías</span>
                  </button>
                  
                  {/* Modal desplegable de Categorías */}
                  {showCategorias && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                      <div className="py-2">
                        <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Electrónica</div>
                        <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Ropa y Accesorios</div>
                        <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Hogar y Jardín</div>
                        <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Deportes</div>
                        <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Belleza y Salud</div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Arriendos */}
                <div className="relative modal-container">
                  <button 
                    onClick={toggleArriendos}
                    className="flex items-center space-x-2 text-white/90 hover:text-white transition-colors cursor-pointer text-sm font-medium"
                  >
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showArriendos ? 'rotate-180' : ''}`} />
                    <span>Arriendos</span>
                  </button>
                  
                  {/* Modal desplegable de Arriendos */}
                  {showArriendos && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                      <div className="py-2">
                        <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Departamentos</div>
                        <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Casas</div>
                        <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Oficinas</div>
                        <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Bodegas</div>
                        <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Estacionamientos</div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Servicios */}
                <div className="relative modal-container">
                  <button 
                    onClick={toggleServicios}
                    className="flex items-center space-x-2 text-white/90 hover:text-white transition-colors cursor-pointer text-sm font-medium"
                  >
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showServicios ? 'rotate-180' : ''}`} />
                    <span>Servicios</span>
                  </button>
                  
                  {/* Modal desplegable de Servicios */}
                  {showServicios && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                      <div className="py-2">
                        <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Servicios Profesionales</div>
                        <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Mantenimiento y Reparación</div>
                        <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Consultoría</div>
                        <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Educación y Cursos</div>
                        <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Salud y Bienestar</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Enlaces al lado derecho: Registrarse, Ingresar con iconos */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-white hover:text-yellow-200 transition-colors cursor-pointer text-sm font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  <span>Registrarse</span>
                </div>
                <div className="flex items-center space-x-2 text-white hover:text-yellow-200 transition-colors cursor-pointer text-sm font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Ingresar</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Versión Móvil */}
        <div className="sm:hidden w-full">
          <div className="flex items-center justify-between px-4 py-1">
            {/* Enlaces a la izquierda: Categorías, Arriendos, Servicios - nombres completos */}
            <div className="flex items-center space-x-2">
              {/* Categorías */}
              <div className="relative modal-container">
                <button 
                  onClick={toggleCategorias}
                  className="flex items-center space-x-1 text-white/90 hover:text-white transition-colors cursor-pointer text-[10px] font-medium"
                >
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showCategorias ? 'rotate-180' : ''}`} />
                  <span>Categorías</span>
                </button>
                
                {/* Modal desplegable de Categorías */}
                {showCategorias && (
                  <div className="absolute top-full left-0 mt-1 w-40 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <div className="py-1">
                      <div className="px-3 py-1 text-xs text-gray-700 hover:bg-gray-100 cursor-pointer">Electrónica</div>
                      <div className="px-3 py-1 text-xs text-gray-700 hover:bg-gray-100 cursor-pointer">Ropa</div>
                      <div className="px-3 py-1 text-xs text-gray-700 hover:bg-gray-100 cursor-pointer">Hogar</div>
                      <div className="px-3 py-1 text-xs text-gray-700 hover:bg-gray-100 cursor-pointer">Deportes</div>
                      <div className="px-3 py-1 text-xs text-gray-700 hover:bg-gray-100 cursor-pointer">Belleza</div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Arriendos */}
              <div className="relative modal-container">
                <button 
                  onClick={toggleArriendos}
                  className="flex items-center space-x-1 text-white/90 hover:text-white transition-colors cursor-pointer text-[10px] font-medium"
                >
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showArriendos ? 'rotate-180' : ''}`} />
                  <span>Arriendos</span>
                </button>
                
                {/* Modal desplegable de Arriendos */}
                {showArriendos && (
                  <div className="absolute top-full left-0 mt-1 w-40 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <div className="py-1">
                      <div className="px-3 py-1 text-xs text-gray-700 hover:bg-gray-100 cursor-pointer">Departamentos</div>
                      <div className="px-3 py-1 text-xs text-gray-700 hover:bg-gray-100 cursor-pointer">Casas</div>
                      <div className="px-3 py-1 text-xs text-gray-700 hover:bg-gray-100 cursor-pointer">Oficinas</div>
                      <div className="px-3 py-1 text-xs text-gray-700 hover:bg-gray-100 cursor-pointer">Bodegas</div>
                      <div className="px-3 py-1 text-xs text-gray-700 hover:bg-gray-100 cursor-pointer">Estaciona</div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Servicios */}
              <div className="relative modal-container">
                <button 
                  onClick={toggleServicios}
                  className="flex items-center space-x-1 text-white/90 hover:text-white transition-colors cursor-pointer text-[10px] font-medium"
                >
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showServicios ? 'rotate-180' : ''}`} />
                  <span>Servicios</span>
                </button>
                
                {/* Modal desplegable de Servicios */}
                {showServicios && (
                  <div className="absolute top-full left-0 mt-1 w-40 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <div className="py-1">
                      <div className="px-3 py-1 text-xs text-gray-700 hover:bg-gray-100 cursor-pointer">Profesionales</div>
                      <div className="px-3 py-1 text-xs text-gray-700 hover:bg-gray-100 cursor-pointer">Mantenimiento</div>
                      <div className="px-3 py-1 text-xs text-gray-700 hover:bg-gray-100 cursor-pointer">Consultoría</div>
                      <div className="px-3 py-1 text-xs text-gray-700 hover:bg-gray-100 cursor-pointer">Educación</div>
                      <div className="px-3 py-1 text-xs text-gray-700 hover:bg-gray-100 cursor-pointer">Salud</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Icono de hamburguesa a la derecha */}
            <div className="relative modal-container">
              <button 
                onClick={toggleMobileMenu}
                className="flex items-center justify-center w-8 h-8 text-white/90 hover:text-white transition-colors cursor-pointer"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              {/* Menú desplegable de opciones de usuario */}
              {showMobileMenu && (
                <div className="absolute top-full right-0 mt-1 w-40 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <div className="py-1">
                    <div className="flex items-center space-x-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 cursor-pointer">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      <span>Registrarse</span>
                    </div>
                    <div className="flex items-center space-x-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 cursor-pointer">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      <span>Ingresar</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}