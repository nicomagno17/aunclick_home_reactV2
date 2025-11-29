'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface NavigationContextType {
    isMobileMenuOpen: boolean
    toggleMobileMenu: () => void
    closeMobileMenu: () => void
    isCollapsed: boolean
    toggleCollapse: () => void
    setCollapsed: (collapsed: boolean) => void
    expandedItems: string[]
    toggleExpanded: (itemId: string) => void
    isResponsive: boolean
    windowWidth: number
    autoCollapse: () => void
    autoExpand: () => void
    sectionActive: string | null
    setSectionActive: (section: string | null) => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export function NavigationProvider({ children }: { children: ReactNode }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [expandedItems, setExpandedItems] = useState<string[]>(['products'])
    const [windowWidth, setWindowWidth] = useState(0)
    const [isResponsive, setIsResponsive] = useState(false)
    const [sectionActive, setSectionActive] = useState<string | null>(null)

    // Responsive behavior
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth
            setWindowWidth(width)

            // Auto-collapse on small screens
            if (width < 1024) { // lg breakpoint
                setIsCollapsed(true)
                setIsResponsive(true)
                setIsMobileMenuOpen(false) // Close mobile menu on resize
            } else if (width >= 1280) { // xl breakpoint
                setIsResponsive(false)
                // Restore desktop state from localStorage if available
                const savedCollapsedState = localStorage.getItem('admin-aside-collapsed')
                if (savedCollapsedState !== null) {
                    setIsCollapsed(JSON.parse(savedCollapsedState))
                }
            }
        }

        // Initial check
        handleResize()

        // Add event listener
        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // Load initial state from localStorage (only for desktop)
    useEffect(() => {
        if (windowWidth >= 1280) {
            const savedCollapsedState = localStorage.getItem('admin-aside-collapsed')
            if (savedCollapsedState !== null) {
                setIsCollapsed(JSON.parse(savedCollapsedState))
            }
        }
    }, [windowWidth])

    // Save collapsed state to localStorage whenever it changes (only for desktop)
    useEffect(() => {
        if (windowWidth >= 1280) {
            localStorage.setItem('admin-aside-collapsed', JSON.stringify(isCollapsed))
        }
    }, [isCollapsed, windowWidth])

    // Handle custom events for mobile menu
    useEffect(() => {
        const handleCloseMobileMenu = () => {
            setIsMobileMenuOpen(false)
        }

        window.addEventListener('closeMobileMenu', handleCloseMobileMenu)
        return () => window.removeEventListener('closeMobileMenu', handleCloseMobileMenu)
    }, [])

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(prev => !prev)
    }

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false)
    }

    const toggleCollapse = () => {
        setIsCollapsed(prev => !prev)
    }

    const setCollapsed = (collapsed: boolean) => {
        setIsCollapsed(collapsed)
    }

    const toggleExpanded = (itemId: string) => {
        setExpandedItems(prev =>
            prev.includes(itemId)
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        )
    }

    const autoCollapse = () => {
        if (windowWidth < 1024) {
            setIsCollapsed(true)
            setIsResponsive(true)
        }
    }

    const autoExpand = () => {
        if (windowWidth >= 1280) {
            setIsCollapsed(false)
            setIsResponsive(false)
        }
    }

    return (
        <NavigationContext.Provider value={{
            isMobileMenuOpen,
            toggleMobileMenu,
            closeMobileMenu,
            isCollapsed,
            toggleCollapse,
            setCollapsed,
            expandedItems,
            toggleExpanded,
            isResponsive,
            windowWidth,
            autoCollapse,
            autoExpand,
            sectionActive,
            setSectionActive
        }}>
            {children}
        </NavigationContext.Provider>
    )
}

export function useNavigation() {
    const context = useContext(NavigationContext)
    if (context === undefined) {
        throw new Error('useNavigation must be used within a NavigationProvider')
    }
    return context
}
