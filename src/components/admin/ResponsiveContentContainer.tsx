'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useNavigation } from './NavigationContext'
import { useResponsiveContent, getResponsiveClasses } from './useResponsiveContent'
import { cn } from '@/lib/utils'

interface ResponsiveContentContainerProps {
  children: ReactNode
  className?: string
  maxWidth?: string
  enableGrid?: boolean
  gridCols?: number
}

export function ResponsiveContentContainer({
  children,
  className = '',
  maxWidth,
  enableGrid = false,
  gridCols
}: ResponsiveContentContainerProps) {
  const { windowWidth, isCollapsed } = useNavigation()
  const [mounted, setMounted] = useState(false)
  const responsive = useResponsiveContent()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Estado inicial para evitar hidratación incorrecta
    return (
      <div className="flex-1 p-6">
        <div className={cn('transition-all duration-300', className)}>
          {children}
        </div>
      </div>
    )
  }

  const classes = getResponsiveClasses(responsive)
  const actualGridCols = gridCols || responsive.gridCols

  const getMaxWidth = () => {
    if (maxWidth) return maxWidth

    // Para pantallas grandes (xl+), ajustar según el estado del sidebar
    if (windowWidth >= 1280) {
      if (isCollapsed) {
        // Cuando el sidebar está colapsado, podemos usar más espacio
        return 'max-w-7xl' // 1280px
      } else {
        // Cuando el sidebar está expandido, limitar para no extenderse demasiado
        // Considerando que el sidebar ocupa ~288px (72 * 4px), dejamos espacio adecuado
        return 'max-w-6xl' // 1152px, dejando buen espacio para el sidebar
      }
    }

    // Para pantallas más pequeñas, usar 7xl como máximo
    return 'max-w-7xl'
  }

  const getPadding = () => {
    if (windowWidth < 640) return 'p-3'
    if (windowWidth < 768) return 'p-4'
    if (windowWidth < 1024) return 'p-5'
    if (windowWidth >= 1280 && isCollapsed) return 'p-8'
    return 'p-6'
  }

  const getGap = () => {
    if (windowWidth < 640) return 'gap-2'
    if (windowWidth < 768) return 'gap-3'
    if (windowWidth < 1024) return 'gap-4'
    if (windowWidth >= 1280 && isCollapsed) return 'gap-6'
    return 'gap-4'
  }

  return (
    <div className={cn(
      'flex-1 transition-all duration-300 ease-in-out relative',
      getPadding(),
      className
    )}>
      <div className={cn(
        getMaxWidth(),
        'w-full mx-auto transition-all duration-300 ease-in-out'
      )}>
        {enableGrid ? (
          <div className={cn(
            'grid transition-all duration-300 ease-in-out',
            `grid-cols-1 sm:grid-cols-2 lg:grid-cols-${Math.min(actualGridCols, 3)} xl:grid-cols-${actualGridCols}`,
            getGap()
          )}>
            {children}
          </div>
        ) : (
          <div className={cn(
            'transition-all duration-300 ease-in-out',
            getGap()
          )}>
            {children}
          </div>
        )}
      </div>

      {/* Indicador de estado responsivo (solo para desarrollo) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 z-50 bg-black/80 text-white p-2 rounded-lg text-xs backdrop-blur-sm">
          <div>Width: {windowWidth}px</div>
          <div>Cols: {actualGridCols}</div>
          <div>Card Size: {responsive.cardSize}</div>
          <div>Sidebar: {isCollapsed ? 'Collapsed' : 'Expanded'}</div>
        </div>
      )}
    </div>
  )
}

// Componente específico para tarjetas responsivas
interface ResponsiveCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  clickable?: boolean
  onClick?: () => void
}

export function ResponsiveCard({
  children,
  className = '',
  hover = true,
  clickable = false,
  onClick
}: ResponsiveCardProps) {
  const responsive = useResponsiveContent()

  const getCardClasses = () => {
    const baseClasses = 'rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm transition-all duration-300'

    const sizeClasses = {
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
      xl: 'p-8'
    }[responsive.cardSize]

    const hoverClasses = hover ? 'hover:shadow-lg hover:scale-[1.02] hover:border-yellow-400/50' : ''
    const clickableClasses = clickable ? 'cursor-pointer active:scale-[0.98]' : ''

    return cn(baseClasses, sizeClasses, hoverClasses, clickableClasses, className)
  }

  return (
    <div className={getCardClasses()} onClick={clickable ? onClick : undefined}>
      {children}
    </div>
  )
}

// Componente para texto responsivo
interface ResponsiveTextProps {
  children: ReactNode
  variant?: 'heading' | 'subheading' | 'body' | 'caption'
  className?: string
}

export function ResponsiveText({
  children,
  variant = 'body',
  className = ''
}: ResponsiveTextProps) {
  const responsive = useResponsiveContent()

  const getTextClasses = () => {
    const sizeClasses = {
      xs: { heading: 'text-lg', subheading: 'text-base', body: 'text-sm', caption: 'text-xs' },
      sm: { heading: 'text-xl', subheading: 'text-lg', body: 'text-base', caption: 'text-sm' },
      base: { heading: 'text-2xl', subheading: 'text-xl', body: 'text-base', caption: 'text-sm' },
      lg: { heading: 'text-3xl', subheading: 'text-2xl', body: 'text-lg', caption: 'text-base' }
    }

    return cn(
      sizeClasses[responsive.fontSize][variant],
      'transition-all duration-300',
      className
    )
  }

  const Tag = variant === 'heading' ? 'h1' :
             variant === 'subheading' ? 'h2' :
             variant === 'caption' ? 'p' : 'p'

  return <Tag className={getTextClasses()}>{children}</Tag>
}