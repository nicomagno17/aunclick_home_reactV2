'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { SearchBar } from '@/components/search-bar'
import { FloatingSearchBar } from '@/components/floating-search-bar'
import { PlansPopup } from '@/components/plans-popup'
import { ChevronDown, Menu, ArrowLeft, Home, User, LogOut, Loader2, UserCircle } from 'lucide-react'
import Link from 'next/link'

interface HeaderProps {
  searchTerm: string
  onSearchTermChange: (value: string) => void
  showBackButton?: boolean
  showFloatingSearch?: boolean
  onCategorySelect?: (category: string) => void
}

export function Header({
  searchTerm,
  onSearchTermChange,
  showBackButton = false,
  showFloatingSearch = true,
  onCategorySelect
}: HeaderProps) {
  const router = useRouter()

  // Estados para los modales desplegables
  const [showCategorias, setShowCategorias] = useState(false)

  // Estado para el menú móvil
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  // Estado para la barra de búsqueda flotante
  const [showFloatingSearchBar, setShowFloatingSearchBar] = useState(false)

  // Estado para el menú de usuario
  const [showUserMenu, setShowUserMenu] = useState(false)

  // Estado para el modal de planes
  const [showPlansPopup, setShowPlansPopup] = useState(false)

  // Estado de autenticación usando NextAuth
  const { data: session, status } = useSession()

  // Estado de carga durante la verificación de sesión
  const [isClientSideLoading, setIsClientSideLoading] = useState(true)

  // Verificar estado de autenticación
  useEffect(() => {
    if (status !== 'loading') {
      setIsClientSideLoading(false)
    }
  }, [status])

  // Función para cerrar todos los modales
  const closeAllModals = () => {
    setShowCategorias(false)
    setShowMobileMenu(false)
    setShowUserMenu(false)
  }

  // Función para manejar selección de categoría
  const handleCategoryClick = (category: string) => {
    if (onCategorySelect) {
      onCategorySelect(category)
    }
    closeAllModals()
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
  const handleLogout = async () => {
    closeAllModals()
    try {
      await signOut({ callbackUrl: '/' })
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      // Fallback en caso de error
      router.push('/')
    }
  }

  // Efecto para cerrar modales al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Si algún modal está abierto y el clic fue fuera de los modales
      if ((showCategorias || showMobileMenu || showUserMenu) &&
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
  }, [showCategorias, showMobileMenu, showUserMenu])

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
      <header className="relative text-white shadow-2xl bg-gradient-to-r from-[#3b0764] via-[#4c1d95] to-[#6d28d9]">
        <div className="container mx-auto relative z-10">
          {/* Versión Desktop */}
          <div className="hidden sm:block py-8 px-6">
            <div className="flex items-center justify-between">
              {/* Título aún más a la izquierda con filas casi juntas */}
              <div className="flex flex-col items-start cursor-pointer -ml-12 -mt-3" onClick={() => router.push('/')}>
                <h1 className="text-2xl font-bold leading-tight text-white mb-0 pb-0">Solo a</h1>
                <h1 className="text-5xl font-bold leading-tight text-yellow-300 mt-0 pt-0 -mt-3">un CLICK</h1>
              </div>

              {/* Banner publicitario mucho más ancho */}
              <div className="relative overflow-hidden bg-purple-900 rounded-l-xl shadow-xl border-l-4 border-yellow-400 -mr-6 transform hover:scale-105 transition-all duration-300 flex-1 max-w-2xl ml-12">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 rotate-45 translate-x-12 -translate-y-12"></div>
                <div className="relative z-10 py-2 px-8 text-center">
                  <p className="text-lg font-bold text-white mb-0.5">¡PROMOCIONA TU NEGOCIO!</p>
                  <p className="text-sm font-medium text-yellow-300 leading-tight">Llega a más clientes con nosotros</p>
                  <p className="text-xs font-semibold text-yellow-200 mt-0.5">Espacio disponible</p>
                </div>
              </div>
            </div>
          </div>

          {/* Versión Móvil */}
          <div className="sm:hidden w-full">
            {/* Primera fila: Título centrado en una sola línea */}
            <div className="flex items-center justify-center px-4 py-3">
              {/* Título en una sola fila */}
              <div className="flex items-baseline cursor-pointer space-x-1" onClick={() => router.push('/')}>
                <h1 className="text-lg font-bold text-white">Solo a</h1>
                <h1 className="text-2xl font-bold text-yellow-300">un CLICK</h1>
              </div>
            </div>

            {/* Segunda fila: Banner publicitario */}
            <div className="flex justify-center py-1 px-4 mb-1">
              {/* Banner publicitario - ligeramente más angosto y más bajo */}
              <div className="relative overflow-hidden bg-purple-900 rounded-xl shadow-lg border-l-2 border-r-2 border-yellow-400 transform hover:scale-105 transition-all duration-300 w-11/12">
                <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-400 rotate-45 translate-x-6 -translate-y-6"></div>
                <div className="relative z-10 py-2 px-4 flex justify-center">
                  <div className="text-center">
                    <p className="text-sm font-bold text-white leading-tight mb-0.5">¡PROMOCIONA</p>
                    <p className="text-lg font-extrabold text-white leading-tight">TU NEGOCIO!</p>
                    <p className="text-[10px] font-semibold text-yellow-200 mt-0.5 leading-tight">Espacio disponible</p>
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
          <div className="container mx-auto">
            <div className="flex items-center justify-between py-2 pl-2 pr-6">
              {/* Categorías a la izquierda */}
              <div className="flex items-center min-w-[120px]">
                {/* Categorías */}
                <div className="modal-container">
                  <button
                    onClick={toggleCategorias}
                    className="flex items-center space-x-2 text-white/90 hover:text-white transition-colors cursor-pointer text-sm font-medium"
                  >
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showCategorias ? 'rotate-180' : ''}`} />
                    <span>Categorías</span>
                  </button>
                </div>
              </div>

              {/* Modal desplegable de Categorías - Pegado al borde izquierdo de la página */}
              {showCategorias && (
                <div className="absolute left-0 top-[218px] w-auto min-w-[220px] max-w-[260px] bg-gradient-to-br from-purple-50 via-white to-purple-50 rounded-br-2xl shadow-2xl border-r-4 border-b-4 border-purple-300 z-50 modal-container">
                  <div className="p-4 pb-6 space-y-2">
                    <button onClick={() => handleCategoryClick('Arriendos')} className="w-full text-left font-bold text-purple-900 py-2.5 px-4 text-sm rounded-xl bg-gradient-to-r from-purple-100 to-purple-50 hover:from-purple-200 hover:to-purple-100 hover:shadow-md hover:scale-[1.02] transition-all duration-300 border-l-4 border-purple-500 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                      <span className="relative z-10">Arriendos</span>
                    </button>
                    <button onClick={() => handleCategoryClick('Propiedades')} className="w-full text-left font-bold text-purple-900 py-2.5 px-4 text-sm rounded-xl bg-gradient-to-r from-purple-100 to-purple-50 hover:from-purple-200 hover:to-purple-100 hover:shadow-md hover:scale-[1.02] transition-all duration-300 border-l-4 border-purple-500 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                      <span className="relative z-10">Propiedades</span>
                    </button>
                    <button onClick={() => handleCategoryClick('Servicios')} className="w-full text-left font-bold text-purple-900 py-2.5 px-4 text-sm rounded-xl bg-gradient-to-r from-purple-100 to-purple-50 hover:from-purple-200 hover:to-purple-100 hover:shadow-md hover:scale-[1.02] transition-all duration-300 border-l-4 border-purple-500 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                      <span className="relative z-10">Servicios</span>
                    </button>
                    <button onClick={() => handleCategoryClick('Productos')} className="w-full text-left font-bold text-purple-900 py-2.5 px-4 text-sm rounded-xl bg-gradient-to-r from-purple-100 to-purple-50 hover:from-purple-200 hover:to-purple-100 hover:shadow-md hover:scale-[1.02] transition-all duration-300 border-l-4 border-purple-500 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                      <span className="relative z-10">Vta. Productos</span>
                    </button>
                    <button onClick={() => handleCategoryClick('Deportes')} className="w-full text-left font-bold text-purple-900 py-2.5 px-4 text-sm rounded-xl bg-gradient-to-r from-purple-100 to-purple-50 hover:from-purple-200 hover:to-purple-100 hover:shadow-md hover:scale-[1.02] transition-all duration-300 border-l-4 border-purple-500 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                      <span className="relative z-10">Deporte</span>
                    </button>
                    <button onClick={() => handleCategoryClick('Mascotas')} className="w-full text-left font-bold text-purple-900 py-2.5 px-4 text-sm rounded-xl bg-gradient-to-r from-purple-100 to-purple-50 hover:from-purple-200 hover:to-purple-100 hover:shadow-md hover:scale-[1.02] transition-all duration-300 border-l-4 border-purple-500 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                      <span className="relative z-10">Mascota</span>
                    </button>
                    <button onClick={() => handleCategoryClick('Belleza')} className="w-full text-left font-bold text-purple-900 py-2.5 px-4 text-sm rounded-xl bg-gradient-to-r from-purple-100 to-purple-50 hover:from-purple-200 hover:to-purple-100 hover:shadow-md hover:scale-[1.02] transition-all duration-300 border-l-4 border-purple-500 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                      <span className="relative z-10">Belleza</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Buscador centrado */}
              <div className="flex-1 max-w-xl mx-4">
                <SearchBar
                  value={searchTerm}
                  onChange={onSearchTermChange}
                  placeholder="Buscar productos, tiendas, categorías..."
                />
              </div>

              {/* Enlaces al lado derecho: Panel de administrador o Registrarse/Ingresar */}
              <div className="flex items-center space-x-4 min-w-[200px] justify-end">
                {status === 'loading' ? (
                  <div className="flex items-center space-x-2 text-white">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Cargando...</span>
                  </div>
                ) : status === 'authenticated' ? (
                  <>
                    {/* Show admin panel only for specific roles */}
                    {session?.user?.rol && ['admin', 'moderador', 'propietario_negocio'].includes(session.user.rol) && (
                      <Link href="/admin" className="flex items-center space-x-2 text-white hover:text-yellow-200 transition-colors cursor-pointer text-sm font-medium">
                        <User className="w-4 h-4" />
                        <span>Panel de administrador</span>
                      </Link>
                    )}

                    {/* Show user name/avatar */}
                    <div className="flex items-center space-x-2 text-white/90 text-sm">
                      {session?.user?.avatar_url ? (
                        <img
                          src={session.user.avatar_url}
                          alt="Avatar"
                          className="w-6 h-6 rounded-full"
                        />
                      ) : (
                        <UserCircle className="w-6 h-6" />
                      )}
                      <span className="font-medium">
                        {session?.user?.nombre || session?.user?.email || 'Usuario'}
                      </span>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 text-white hover:text-yellow-200 transition-colors cursor-pointer text-sm font-medium"
                      title="Cerrar sesión"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Cerrar sesión</span>
                    </button>
                  </>
                ) : (
                  <>
                    {/* TEMPORALMENTE OCULTO - Descomentar cuando se necesite mostrar Planes */}
                    {/* <button
                      onClick={() => setShowPlansPopup(true)}
                      className="flex items-center space-x-2 text-white hover:text-yellow-200 transition-colors cursor-pointer text-sm font-medium"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Planes</span>
                    </button> */}
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
          <div className="flex items-center justify-between px-2 py-2 gap-2">
            {/* Categorías a la izquierda */}
            <div className="flex items-center flex-shrink-0">
              {/* Categorías */}
              <div className="modal-container">
                <button
                  onClick={toggleCategorias}
                  className="flex items-center space-x-1 text-white/90 hover:text-white transition-colors cursor-pointer text-xs font-medium"
                >
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showCategorias ? 'rotate-180' : ''}`} />
                  <span>Categorías</span>
                </button>
              </div>
            </div>

            {/* Modal desplegable de Categorías - Pegado al borde izquierdo de la página (Móvil) */}
            {showCategorias && (
              <div className="sm:hidden absolute left-0 top-[208px] w-auto min-w-[140px] max-w-[200px] bg-gradient-to-br from-purple-50 via-white to-purple-50 rounded-br-2xl shadow-2xl border-r-4 border-b-4 border-purple-300 z-50 modal-container">
                <div className="p-3 space-y-1">
                  <button onClick={() => handleCategoryClick('Arriendos')} className="w-full text-left font-bold text-purple-900 py-2 px-3 text-xs rounded-xl bg-gradient-to-r from-purple-100 to-purple-50 hover:from-purple-200 hover:to-purple-100 active:scale-95 transition-all duration-200 border-l-4 border-purple-500 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                    <span className="relative z-10">Arriendos</span>
                  </button>
                  <button onClick={() => handleCategoryClick('Propiedades')} className="w-full text-left font-bold text-purple-900 py-2 px-3 text-xs rounded-xl bg-gradient-to-r from-purple-100 to-purple-50 hover:from-purple-200 hover:to-purple-100 active:scale-95 transition-all duration-200 border-l-4 border-purple-500 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                    <span className="relative z-10">Propiedades</span>
                  </button>
                  <button onClick={() => handleCategoryClick('Servicios')} className="w-full text-left font-bold text-purple-900 py-2 px-3 text-xs rounded-xl bg-gradient-to-r from-purple-100 to-purple-50 hover:from-purple-200 hover:to-purple-100 active:scale-95 transition-all duration-200 border-l-4 border-purple-500 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                    <span className="relative z-10">Servicios</span>
                  </button>
                  <button onClick={() => handleCategoryClick('Productos')} className="w-full text-left font-bold text-purple-900 py-2 px-3 text-xs rounded-xl bg-gradient-to-r from-purple-100 to-purple-50 hover:from-purple-200 hover:to-purple-100 active:scale-95 transition-all duration-200 border-l-4 border-purple-500 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                    <span className="relative z-10">Vta. Productos</span>
                  </button>
                  <button onClick={() => handleCategoryClick('Deportes')} className="w-full text-left font-bold text-purple-900 py-2 px-3 text-xs rounded-xl bg-gradient-to-r from-purple-100 to-purple-50 hover:from-purple-200 hover:to-purple-100 active:scale-95 transition-all duration-200 border-l-4 border-purple-500 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                    <span className="relative z-10">Deporte</span>
                  </button>
                  <button onClick={() => handleCategoryClick('Mascotas')} className="w-full text-left font-bold text-purple-900 py-2 px-3 text-xs rounded-xl bg-gradient-to-r from-purple-100 to-purple-50 hover:from-purple-200 hover:to-purple-100 active:scale-95 transition-all duration-200 border-l-4 border-purple-500 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                    <span className="relative z-10">Mascota</span>
                  </button>
                  <button onClick={() => handleCategoryClick('Belleza')} className="w-full text-left font-bold text-purple-900 py-2 px-3 text-xs rounded-xl bg-gradient-to-r from-purple-100 to-purple-50 hover:from-purple-200 hover:to-purple-100 active:scale-95 transition-all duration-200 border-l-4 border-purple-500 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                    <span className="relative z-10">Belleza</span>
                  </button>
                </div>
              </div>
            )}

            {/* Buscador centrado en móvil */}
            <div className="flex-1 min-w-0">
              <SearchBar
                value={searchTerm}
                onChange={onSearchTermChange}
                placeholder="Buscar..."
                className="text-xs"
              />
            </div>

            {/* Icono de hamburguesa a la derecha */}
            <div className="relative modal-container flex-shrink-0">
              <button
                onClick={toggleMobileMenu}
                className="flex items-center justify-center w-8 h-8 text-white/90 hover:text-white transition-colors cursor-pointer"
                title="Abrir menú"
                aria-label="Abrir menú"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Menú desplegable de opciones de usuario */}
              {showMobileMenu && (
                <div className="absolute top-full right-0 mt-1 w-40 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <div className="py-1">
                    {status === 'loading' ? (
                      <div className="flex items-center space-x-2 px-3 py-2 text-xs text-gray-700">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Cargando...</span>
                      </div>
                    ) : status === 'authenticated' ? (
                      <>
                        {/* Show admin panel only for specific roles */}
                        {session?.user?.rol && ['admin', 'moderador', 'propietario_negocio'].includes(session.user.rol) && (
                          <Link
                            href="/admin"
                            className="flex items-center space-x-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 cursor-pointer"
                            onClick={closeAllModals}
                          >
                            <User className="w-3 h-3" />
                            <span>Panel de administrador</span>
                          </Link>
                        )}

                        {/* Show user name */}
                        <div className="flex items-center space-x-2 px-3 py-2 text-xs text-gray-700">
                          {session?.user?.avatar_url ? (
                            <img
                              src={session.user.avatar_url}
                              alt="Avatar"
                              className="w-4 h-4 rounded-full"
                            />
                          ) : (
                            <UserCircle className="w-4 h-4" />
                          )}
                          <span className="truncate max-w-[100px]">
                            {session?.user?.nombre || session?.user?.email || 'Usuario'}
                          </span>
                        </div>

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
                        {/* TEMPORALMENTE OCULTO - Descomentar cuando se necesite mostrar Planes */}
                        {/* <button
                          onClick={() => {
                            setShowPlansPopup(true)
                            closeAllModals()
                          }}
                          className="flex items-center space-x-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 cursor-pointer w-full text-left"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span>Planes</span>
                        </button> */}
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

      {/* Modal de Planes */}
      <PlansPopup
        isOpen={showPlansPopup}
        onClose={() => setShowPlansPopup(false)}
      />
    </>
  )
}