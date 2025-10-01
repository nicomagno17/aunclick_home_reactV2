'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SearchBar } from '@/components/search-bar'
import { FloatingSearchBar } from '@/components/floating-search-bar'
import { ChevronDown, Menu, ArrowLeft, Home, User, LogOut } from 'lucide-react'
import Link from 'next/link'

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

  // Estado para el menú de usuario
  const [showUserMenu, setShowUserMenu] = useState(false)

  // Estado de autenticación (using localStorage for persistence)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check authentication status on component mount
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated') === 'true'
    setIsAuthenticated(authStatus)
  }, [])

  // Función para cerrar todos los modales
  const closeAllModals = () => {
    setShowCategorias(false)
    setShowArriendos(false)
    setShowServicios(false)
    setShowMobileMenu(false)
    setShowUserMenu(false)
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

  // Función para toggle del menú de usuario (cierra otros modales)
  const toggleUserMenu = () => {
    if (showUserMenu) {
      setShowUserMenu(false)
    } else {
      closeAllModals()
      setShowUserMenu(true)
    }
  }

  // Función para cerrar sesión
  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.setItem('isAuthenticated', 'false')
    closeAllModals()
    // Redirigir a la página principal
    router.push('/')
  }

  // Efecto para cerrar modales al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Si algún modal está abierto y el clic fue fuera de los modales
      if ((showCategorias || showArriendos || showServicios || showMobileMenu || showUserMenu) && 
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
  }, [showCategorias, showArriendos, showServicios, showMobileMenu, showUserMenu])

  // Efecto para detectar scroll y mostrar/ocultar barra de búsqueda flotante
  useEffect(() => {
    if (!showFloatingSearch) return

    const handleScroll = () => {
      const header = document.querySelector('header')
      if (header) {
        const headerRect = header.getBoundingClientRect()
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        // Prevenir scroll negativo y mostrar barra flotante si el header no está visible
        if (scrollTop < 0) {
          window.scrollTo(0, 0)
          return
        }
        setShowFloatingSearchBar(headerRect.bottom <= 0 && scrollTop > 0)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
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
          <div className="hidden sm:block py-8 px-6">
            <div className="flex items-center justify-between">
              {/* Título aún más a la izquierda con filas casi juntas */}
              <div className="flex flex-col items-start cursor-pointer -ml-12 -mt-3" onClick={() => router.push('/')}>
                <h1 className="text-2xl font-bold leading-tight text-white mb-0 pb-0">Solo a</h1>
                <h1 className="text-5xl font-bold leading-tight text-yellow-300 mt-0 pt-0 -mt-3">un CLICK</h1>
              </div>

              {/* Buscador centrado y más angosto con mayor margen izquierdo */}
              <div className="flex justify-center flex-1 max-w-md ml-20">
                <div className="w-full">
                  <SearchBar 
                    value={searchTerm} 
                    onChange={onSearchTermChange}
                    placeholder="Buscar productos, tiendas, categorías..."
                  />
                </div>
              </div>

              {/* Nuevo diseño de banner publicitario */}
              <div className="relative overflow-hidden bg-purple-900 rounded-l-xl shadow-xl border-l-4 border-yellow-400 -mr-6 transform hover:scale-105 transition-all duration-300 w-48">
                <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-400 rotate-45 translate-x-8 -translate-y-8"></div>
                <div className="relative z-10 py-3 px-5">
                  <p className="text-sm font-bold text-white mb-1">¡PROMOCIONA</p>
                  <p className="text-lg font-extrabold text-white">TU NEGOCIO!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Versión Móvil */}
          <div className="sm:hidden w-full">
            {/* Primera fila: Título y buscador centrados uno al lado del otro */}
            <div className="flex items-center justify-center px-4 py-3 space-x-8">
              {/* Título con filas casi juntas */}
              <div className="flex flex-col items-center cursor-pointer -mt-2" onClick={() => router.push('/')}>
                <h1 className="text-lg font-bold leading-tight text-white mb-0 pb-0">Solo a</h1>
                <h1 className="text-2xl font-bold leading-tight text-yellow-300 mt-0 pt-0 -mt-2">un CLICK</h1>
              </div>

              {/* Buscador */}
              <div className="flex-1 max-w-[180px]">
                <SearchBar 
                  value={searchTerm} 
                  onChange={onSearchTermChange}
                  placeholder="Buscar..."
                  className="text-sm"
                />
              </div>
            </div>

            {/* Segunda fila: Banner publicitario más alto */}
            <div className="flex justify-center py-2 px-4 mb-2">
              {/* Banner publicitario - ligeramente más angosto y más bajo */}
              <div className="relative overflow-hidden bg-purple-900 rounded-xl shadow-lg border-l-2 border-r-2 border-yellow-400 transform hover:scale-105 transition-all duration-300 w-11/12">
                <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-400 rotate-45 translate-x-6 -translate-y-6"></div>
                <div className="relative z-10 py-3 px-4 flex justify-center">
                  <div className="text-center">
                    <p className="text-sm font-bold text-white leading-tight mb-1">¡PROMOCIONA</p>
                    <p className="text-lg font-extrabold text-white leading-tight">TU NEGOCIO!</p>
                  </div>
                </div>
              </div>
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

              {/* Enlaces al lado derecho: Panel de administrador o Registrarse/Ingresar */}
              <div className="flex items-center space-x-4">
                {isAuthenticated ? (
                  <>
                    <Link href="/admin" className="flex items-center space-x-2 text-white hover:text-yellow-200 transition-colors cursor-pointer text-sm font-medium">
                      <User className="w-4 h-4" />
                      <span>Panel de administrador</span>
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center space-x-2 text-white hover:text-yellow-200 transition-colors cursor-pointer text-sm font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Cerrar sesión</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/register" className="flex items-center space-x-2 text-white hover:text-yellow-200 transition-colors cursor-pointer text-sm font-medium">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      <span>Registrarse</span>
                    </Link>
                    <Link href="/login" className="flex items-center space-x-2 text-white hover:text-yellow-200 transition-colors cursor-pointer text-sm font-medium">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      <span>Ingresar</span>
                    </Link>
                  </>
                )}
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
                    {isAuthenticated ? (
                      <>
                        <Link 
                          href="/admin" 
                          className="flex items-center space-x-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 cursor-pointer"
                          onClick={closeAllModals}
                        >
                          <User className="w-3 h-3" />
                          <span>Panel de administrador</span>
                        </Link>
                        <button 
                          onClick={handleLogout}
                          className="flex items-center space-x-2 w-full px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 cursor-pointer text-left"
                        >
                          <LogOut className="w-3 h-3" />
                          <span>Cerrar sesión</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <Link 
                          href="/register" 
                          className="flex items-center space-x-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 cursor-pointer"
                          onClick={closeAllModals}
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                          </svg>
                          <span>Registrarse</span>
                        </Link>
                        <Link 
                          href="/login" 
                          className="flex items-center space-x-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 cursor-pointer"
                          onClick={closeAllModals}
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                          </svg>
                          <span>Ingresar</span>
                        </Link>
                      </>
                    )}
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