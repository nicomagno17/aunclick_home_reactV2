'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useNavigation } from '@/components/admin/NavigationContext'
import {
    LayoutDashboard,
    Users,
    ShoppingCart,
    Settings,
    FileText,
    Shield,
    HelpCircle,
    LogOut,
    Package,
    BarChart3,
    Database,
    Plug,
    Book,
    ChevronDown,
    Menu,
    X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface NavItem {
    id: string
    label: string
    icon: any
    href?: string
    children?: NavItem[]
}

const navigationItems: NavItem[] = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        href: '/admin'
    },
    {
        id: 'business-data',
        label: 'Datos del Negocio',
        icon: BarChart3,
        href: '/admin/datos-negocio'
    },
    {
        id: 'products',
        label: 'Gestión de Productos',
        icon: Package,
        href: '/admin/gestion-productos'
    },
    {
        id: 'users',
        label: 'Gestión de Usuarios',
        icon: Users,
        href: '/admin/gestion-usuarios'
    },
    {
        id: 'analytics',
        label: 'Analytics',
        icon: BarChart3,
        href: '/admin/analytics'
    },
    {
        id: 'settings',
        label: 'Configuración',
        icon: Settings,
        href: '/admin/configuracion'
    },
    {
        id: 'support',
        label: 'Soporte',
        icon: HelpCircle,
        href: '/admin/soporte'
    },
    {
        id: 'logs',
        label: 'Logs',
        icon: FileText,
        href: '/admin/logs'
    },
    {
        id: 'security',
        label: 'Seguridad',
        icon: Shield,
        href: '/admin/seguridad'
    },
    {
        id: 'integrations',
        label: 'Integraciones',
        icon: Plug,
        href: '/admin/integraciones'
    },
    {
        id: 'backups',
        label: 'Respaldos',
        icon: Database,
        href: '/admin/respaldos'
    },
    {
        id: 'documentation',
        label: 'Documentación',
        icon: Book,
        href: '/admin/documentacion'
    }
]

export default function AdminAside() {
    const pathname = usePathname()
    const { isMobileMenuOpen, toggleMobileMenu, isCollapsed, expandedItems, toggleExpanded, toggleCollapse, windowWidth, isResponsive } = useNavigation()

    const isActive = (href: string) => {
        if (href === '/admin') {
            return pathname === href || pathname === '/admin/'
        }
        return pathname === href
    }

    const isParentActive = (item: NavItem) => {
        if (item.children) {
            return item.children.some(child => child.href && isActive(child.href))
        }
        return false
    }

    const renderNavItem = (item: NavItem, level: number = 0) => {
        const IconComponent = item.icon
        const hasChildren = item.children && item.children.length > 0
        const isExpanded = expandedItems.includes(item.id)
        const isItemActive = item.href ? isActive(item.href) : isParentActive(item)

        const navContent = (
            <Link
                href={item.href || '#'}
                onClick={(e) => {
                    if (hasChildren) {
                        e.preventDefault()
                        toggleExpanded(item.id)
                    }
                }}
                className={cn(
                    'w-full flex items-center gap-3 px-3 py-3 text-left transition-all duration-300 group relative rounded-lg mx-1',
                    'hover:bg-gradient-to-r hover:from-indigo-600/20 hover:to-purple-600/20 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:ring-inset',
                    'text-sm font-medium backdrop-blur-sm',
                    level > 0 && 'pl-10 mx-2',
                    isCollapsed && level === 0 && 'md:justify-center md:px-3',
                    isItemActive && 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-xl transform scale-[1.02] border border-yellow-400/30 animate-pulse-shadow',
                    !isItemActive && 'text-gray-300 hover:text-white hover:transform hover:scale-[1.01] hover:shadow-lg',
                    'before:content-[""] before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300',
                    'after:content-[""] after:absolute after:inset-0 after:rounded-lg after:bg-gradient-to-r after:from-yellow-400/10 after:via-transparent after:to-purple-400/10 after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-500'
                )}
            >
                {/* Icon */}
                <div className={cn(
                    'flex-shrink-0 w-5 h-5 transition-all duration-300 relative',
                    isItemActive ? 'text-yellow-300 scale-110 drop-shadow-lg' : 'text-gray-400 group-hover:text-yellow-300 group-hover:scale-105'
                )}>
                    <div className={cn(
                        'absolute inset-0 rounded-full blur-md transition-opacity duration-300',
                        isItemActive ? 'bg-yellow-400/30 opacity-100' : 'bg-purple-400/20 opacity-0 group-hover:opacity-100'
                    )} />
                    <IconComponent className="w-5 h-5 relative z-10" />
                </div>

                {/* Label */}
                <span className={cn(
                    'flex-1 truncate transition-all duration-300',
                    isItemActive ? 'text-white font-semibold' : 'text-gray-300 group-hover:text-white',
                    // En escritorio: ocultar textos si está colapsado
                    // En móvil: mostrar textos si el menú móvil está abierto
                    isCollapsed && level === 0 && !isMobileMenuOpen && 'md:hidden opacity-0 w-0 overflow-hidden',
                    // En móvil, si el menú está abierto, asegurar que los textos sean visibles
                    isMobileMenuOpen && windowWidth < 768 && 'opacity-100 w-auto'
                )}>
                    {item.label}
                </span>

                {/* Expand/Collapse indicator */}
                {hasChildren && !isCollapsed && (
                    <div className={cn(
                        'flex-shrink-0 w-4 h-4 transition-all duration-300 transform',
                        isExpanded ? 'rotate-180 text-yellow-300 scale-110' : 'text-gray-400 group-hover:text-yellow-300 group-hover:scale-105'
                    )}>
                        <ChevronDown className="w-4 h-4 drop-shadow-sm" />
                    </div>
                )}
            </Link>
        )

        return (
            <li key={item.id} className="relative">
                {isCollapsed && level === 0 ? (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            {navContent}
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <p>{item.label}</p>
                        </TooltipContent>
                    </Tooltip>
                ) : (
                    navContent
                )}

                {/* Submenu */}
                {hasChildren && isExpanded && !isCollapsed && (
                    <ul className="mt-2 space-y-1 ml-2 animate-in slide-in-from-top-2 duration-300 opacity-100 h-auto">
                        <div className="relative">
                            <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-yellow-400/50 via-purple-400/30 to-transparent" />
                            {item.children?.map((child, index) => (
                                <div key={child.id} className="relative animate-in slide-in-from-left-2 duration-300 opacity-100 h-auto" style={{ animationDelay: `${index * 50}ms` }}>
                                    {renderNavItem(child, level + 1)}
                                </div>
                            ))}
                        </div>
                    </ul>
                )}
            </li>
        )
    }

    return (
        <>
            {/* Mobile Menu Toggle */}
            <button
                onClick={toggleMobileMenu}
                className={cn(
                    'fixed top-4 left-4 z-50 p-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300',
                    'transform hover:scale-105 active:scale-95',
                    windowWidth >= 768 && windowWidth < 1024 && 'md:block', // Show on tablet too
                    windowWidth >= 1024 && 'hidden' // Hide on desktop
                )}
            >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className={cn(
                        'fixed inset-0 z-30 transition-all duration-300',
                        windowWidth < 768 ? 'bg-black/60 backdrop-blur-enhanced' : 'bg-black/40 backdrop-blur-sm',
                        'animate-fade-in'
                    )}
                    onClick={toggleMobileMenu}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed top-0 left-0 z-40 h-screen bg-gradient-to-br from-slate-900 via-purple-900/90 to-indigo-900/90 backdrop-blur-xl border-r border-yellow-400/30 shadow-2xl transition-all duration-300 ease-in-out',
                    'before:absolute before:inset-0 before:bg-gradient-to-br before:from-purple-600/10 before:via-pink-600/5 before:to-indigo-600/10 before:opacity-50',
                    'md:translate-x-0',
                    // Dynamic width based on screen size and collapse state
                    (() => {
                        if (windowWidth < 768) return 'w-72' // Mobile: always full width
                        if (windowWidth < 1024) return 'w-72' // Tablet: always full width
                        if (windowWidth < 1280) return isCollapsed ? 'w-16' : 'w-72' // Large tablet
                        return isCollapsed ? 'w-16' : 'w-72' // Desktop
                    })(),
                    isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
                    // Enhanced visual effects
                    'shadow-black/20 dark:shadow-black/40'
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-yellow-400/20 backdrop-blur-sm bg-gradient-to-r from-purple-900/20 to-indigo-900/20">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
                            <LayoutDashboard className="w-6 h-6 text-slate-900" />
                        </div>
                        <div className={cn(
                            'transition-all duration-300',
                            // En escritorio: ocultar si está colapsado
                            // En móvil: mostrar si el menú móvil está abierto
                            isCollapsed && !isMobileMenuOpen && 'md:hidden opacity-0 w-0 overflow-hidden',
                            // En móvil, si el menú está abierto, asegurar visibilidad
                            isMobileMenuOpen && windowWidth < 768 && 'opacity-100 w-auto'
                        )}>
                            <h2 className="text-white font-bold text-base bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">Panel Admin</h2>
                            <p className="text-gray-300 text-xs font-medium opacity-80">Solo a un CLICK</p>
                        </div>
                    </div>

                    {/* Desktop Toggle Button - REMOVED */}
                    {/* Toggle functionality is now only available in the header */}
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-6">
                    <ul className="space-y-2 px-3">
                        {navigationItems.map(item => renderNavItem(item))}
                    </ul>
                </nav>

                {/* Footer */}
                <div className={cn(
                    'p-4 border-t border-yellow-400/20 backdrop-blur-sm bg-gradient-to-r from-purple-900/10 to-indigo-900/10 transition-all duration-300',
                    isCollapsed && 'md:px-2'
                )}>
                    <div className={cn(
                        'flex flex-col items-center space-y-2',
                        isCollapsed && 'md:space-y-1'
                    )}>
                        <div className={cn(
                            'flex items-center justify-center gap-2',
                            isCollapsed && 'md:justify-center'
                        )}>
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
                           <p className={cn(
                                'text-xs font-medium transition-all duration-300 text-gray-300',
                                // En escritorio: ocultar si está colapsado
                                // En móvil: mostrar si el menú móvil está abierto
                                isCollapsed && !isMobileMenuOpen && 'md:hidden opacity-0 w-0 overflow-hidden',
                                // En móvil, si el menú está abierto, asegurar visibilidad
                                isMobileMenuOpen && windowWidth < 768 && 'opacity-100 w-auto'
                            )}>
                                {windowWidth < 768 ? 'Online' : 'Conectado'}
                            </p>
                        </div>
                        <p className={cn(
                            'text-xs transition-all duration-300 text-gray-400 font-medium',
                            // En escritorio: ocultar si está colapsado
                            // En móvil: mostrar si el menú móvil está abierto
                            isCollapsed && !isMobileMenuOpen && 'md:hidden opacity-0 w-0 overflow-hidden',
                            // En móvil, si el menú está abierto, asegurar visibilidad
                            isMobileMenuOpen && windowWidth < 768 && 'opacity-100 w-auto'
                        )}>
                            v2.0.0 Pro
                        </p>
                        {/* Version indicator for collapsed state */}
                        {isCollapsed && windowWidth >= 1024 && (
                            <div className="md:flex hidden">
                                <span className="text-xs text-yellow-400 font-bold">v2</span>
                            </div>
                        )}
                    </div>
                </div>
            </aside>
        </>
    )
}
