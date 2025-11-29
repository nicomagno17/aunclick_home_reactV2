'use client'

import { useEffect, useState } from 'react'
import { useNavigation } from './NavigationContext'

interface UseResponsiveContent {
  contentWidth: string
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isLargeDesktop: boolean
  sidebarWidth: number
  availableWidth: number
  gridCols: number
  cardSize: 'sm' | 'md' | 'lg' | 'xl'
  fontSize: 'xs' | 'sm' | 'base' | 'lg'
  spacing: 'tight' | 'normal' | 'loose'
}

export function useResponsiveContent(): UseResponsiveContent {
  const { windowWidth, isCollapsed } = useNavigation()
  const [availableWidth, setAvailableWidth] = useState(0)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sidebarWidth = getSidebarWidth(windowWidth, isCollapsed)
      const available = window.innerWidth - sidebarWidth
      setAvailableWidth(available)
    }
  }, [windowWidth, isCollapsed])

  const getSidebarWidth = (width: number, collapsed: boolean): number => {
    if (width < 768) return 0 // Mobile: sidebar overlays content
    if (width < 1024) return 0 // Tablet: sidebar overlays content when open
    return collapsed ? 64 : 288 // Desktop: actual sidebar width in pixels
  }

  const getContentWidth = (): string => {
    if (windowWidth < 768) return '100%'
    if (windowWidth < 1024) return '100%'
    if (isCollapsed) return 'calc(100% - 64px)'
    return 'calc(100% - 288px)'
  }

  const getGridCols = (): number => {
    if (windowWidth < 640) return 1 // sm
    if (windowWidth < 768) return 2 // md
    if (windowWidth < 1024) return isCollapsed ? 3 : 2 // lg
    if (windowWidth < 1280) return isCollapsed ? 4 : 3 // xl
    return isCollapsed ? 5 : 4 // 2xl
  }

  const getCardSize = (): 'sm' | 'md' | 'lg' | 'xl' => {
    if (windowWidth < 768) return 'sm'
    if (windowWidth < 1024) return 'md'
    if (isCollapsed) return 'lg'
    return 'md'
  }

  const getFontSize = (): 'xs' | 'sm' | 'base' | 'lg' => {
    if (windowWidth < 640) return 'xs'
    if (windowWidth < 1024) return 'sm'
    if (isCollapsed && windowWidth >= 1280) return 'lg'
    return 'base'
  }

  const getSpacing = (): 'tight' | 'normal' | 'loose' => {
    if (windowWidth < 768) return 'tight'
    if (isCollapsed && windowWidth >= 1280) return 'loose'
    return 'normal'
  }

  return {
    contentWidth: getContentWidth(),
    isMobile: windowWidth < 768,
    isTablet: windowWidth >= 768 && windowWidth < 1024,
    isDesktop: windowWidth >= 1024 && windowWidth < 1280,
    isLargeDesktop: windowWidth >= 1280,
    sidebarWidth: getSidebarWidth(windowWidth, isCollapsed),
    availableWidth,
    gridCols: getGridCols(),
    cardSize: getCardSize(),
    fontSize: getFontSize(),
    spacing: getSpacing()
  }
}

// Helper function para generar clases CSS dinámicas
export function getResponsiveClasses(responsive: UseResponsiveContent): {
  container: string
  grid: string
  card: string
  text: string
  spacing: string
} {
  return {
    container: `transition-all duration-300 ease-in-out`,
    grid: `grid grid-cols-${responsive.gridCols} gap-4 transition-all duration-300`,
    card: `${getCardSizeClass(responsive.cardSize)} transition-all duration-300 hover:scale-105`,
    text: `${getFontSizeClass(responsive.fontSize)} transition-all duration-300`,
    spacing: `${getSpacingClass(responsive.spacing)} transition-all duration-300`
  }
}

function getCardSizeClass(size: 'sm' | 'md' | 'lg' | 'xl'): string {
  switch (size) {
    case 'sm': return 'p-3 text-sm'
    case 'md': return 'p-4 text-base'
    case 'lg': return 'p-6 text-lg'
    case 'xl': return 'p-8 text-xl'
    default: return 'p-4 text-base'
  }
}

function getFontSizeClass(size: 'xs' | 'sm' | 'base' | 'lg'): string {
  switch (size) {
    case 'xs': return 'text-xs'
    case 'sm': return 'text-sm'
    case 'base': return 'text-base'
    case 'lg': return 'text-lg'
    default: return 'text-base'
  }
}

function getSpacingClass(spacing: 'tight' | 'normal' | 'loose'): string {
  switch (spacing) {
    case 'tight': return 'gap-2 p-2'
    case 'normal': return 'gap-4 p-4'
    case 'loose': return 'gap-6 p-6'
    default: return 'gap-4 p-4'
  }
}