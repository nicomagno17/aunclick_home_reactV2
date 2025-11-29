'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { FormFieldGroup } from './FormFieldGroup'

export interface ResponsiveFormGridProps {
  children: React.ReactNode
  className?: string
  columns?: {
    mobile?: 1 | 2
    tablet?: 1 | 2 | 3
    notebook?: 2 | 3 | 4
    desktop?: 2 | 3 | 4 | 5 | 6
  }
  spacing?: 'sm' | 'md' | 'lg'
}

const spacingClasses = {
  sm: 'gap-3 md:gap-4 lg:gap-5',
  md: 'gap-4 md:gap-5 lg:gap-6',
  lg: 'gap-5 md:gap-6 lg:gap-8'
}

const gridClasses = {
  mobile: {
    1: 'grid-cols-1',
    2: 'grid-cols-2'
  },
  tablet: {
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3'
  },
  notebook: {
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4'
  },
  desktop: {
    2: 'xl:grid-cols-2',
    3: 'xl:grid-cols-3',
    4: 'xl:grid-cols-4',
    5: 'xl:grid-cols-5',
    6: 'xl:grid-cols-6'
  }
}

/**
 * Grid System Responsivo para Formularios de Administración
 *
 * Breakpoints:
 * - Mobile: < 768px (1-2 columnas)
 * - Tablet: 768px-1023px (1-3 columnas)
 * - Notebook: 1024px-1365px (2-4 columnas)
 * - Desktop: > 1365px (2-6 columnas)
 */
export function ResponsiveFormGrid({
  children,
  className,
  columns = {
    mobile: 1,
    tablet: 2,
    notebook: 3,
    desktop: 4
  },
  spacing = 'md'
}: ResponsiveFormGridProps) {
  const gridClass = [
    gridClasses.mobile[columns.mobile || 1],
    gridClasses.tablet[columns.tablet || 2],
    gridClasses.notebook[columns.notebook || 3],
    gridClasses.desktop[columns.desktop || 4]
  ].filter(Boolean).join(' ')

  return (
    <div className={cn(
      'grid w-full',
      gridClass,
      spacingClasses[spacing],
      className
    )}>
      {children}
    </div>
  )
}

export interface FormSectionProps {
  title?: string
  description?: string
  icon?: React.ReactNode
  children: React.ReactNode
  className?: string
  cols?: {
    mobile?: 1 | 2
    tablet?: 1 | 2 | 3
    notebook?: 2 | 3 | 4
    desktop?: 2 | 3 | 4 | 5 | 6
  }
}

/**
 * FormSection - Agrupa campos relacionados con su propio grid responsivo
 */
export function FormSection({
  title,
  description,
  icon,
  children,
  className,
  cols = {
    mobile: 1,
    tablet: 1,
    notebook: 2,
    desktop: 2
  }
}: FormSectionProps) {
  return (
    <ResponsiveFormGrid
      className={className}
      columns={cols}
      spacing="md"
    >
      {(title || description) && (
        <div className={cn(
          'col-span-full',
          'mb-4 sm:mb-6'
        )}>
          <div className="flex items-start gap-3">
            {icon && (
              <div className="flex-shrink-0 mt-1">
                {icon}
              </div>
            )}
            <div>
              {title && (
                <h3 className="text-lg font-semibold text-white mb-1">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-sm text-gray-400">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      {children}
    </ResponsiveFormGrid>
  )
}

export interface CompactFormProps {
  title?: string
  description?: string
  icon?: React.ReactNode
  children: React.ReactNode
  className?: string
  actions?: React.ReactNode
}

/**
 * CompactForm - Layout optimizado para notebooks con múltiples columnas
 */
export function CompactForm({
  title,
  description,
  icon,
  children,
  className,
  actions
}: CompactFormProps) {
  return (
    <div className={cn('w-full space-y-6', className)}>
      {(title || description) && (
        <div className="flex items-start gap-3 mb-6">
          {icon && (
            <div className="flex-shrink-0">
              {icon}
            </div>
          )}
          <div className="flex-1">
            {title && (
              <h2 className="text-2xl font-bold text-white mb-1">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-gray-400">
                {description}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex-shrink-0">
              {actions}
            </div>
          )}
        </div>
      )}

      <div className="space-y-8">
        {children}
      </div>
    </div>
  )
}

export { FormFieldGroup } from './FormFieldGroup'