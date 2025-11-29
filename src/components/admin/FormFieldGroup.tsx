'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

export interface FormFieldProps {
  label: string
  description?: string
  error?: string
  required?: boolean
  icon?: React.ReactNode
  className?: string
  children: React.ReactNode
  cols?: {
    mobile?: 1 | 2
    tablet?: 1 | 2 | 3
    notebook?: 2 | 3 | 4
    desktop?: 2 | 3 | 4 | 5 | 6
  }
}

/**
 * FormField - Contenedor individual para campos de formulario
 * Maneja layout responsivo y estado de error
 */
export function FormField({
  label,
  description,
  error,
  required,
  icon,
  className,
  children,
  cols
}: FormFieldProps) {
  return (
    <div className={cn(
      'space-y-2',
      error && 'space-y-1',
      className
    )}>
      <Label className={cn(
        'text-gray-300 text-sm font-medium flex items-center gap-2',
        error && 'text-red-400'
      )}>
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </Label>

      {children}

      {description && !error && (
        <p className="text-xs text-gray-500">{description}</p>
      )}

      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  )
}

export interface TextInputProps {
  id: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: 'text' | 'email' | 'tel' | 'url' | 'password' | 'number'
  disabled?: boolean
  className?: string
}

/**
 * TextInput - Input de texto optimizado para formularios compactos
 */
export function TextInput({
  id,
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
  className
}: TextInputProps) {
  return (
    <Input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={cn(
        'bg-gray-700 border-gray-600 text-white',
        'placeholder:text-gray-500',
        'focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400',
        'h-10',
        className
      )}
    />
  )
}

export interface TextAreaInputProps {
  id: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  disabled?: boolean
  className?: string
  resize?: 'none' | 'both' | 'horizontal' | 'vertical'
}

/**
 * TextAreaInput - Textarea optimizado para formularios compactos
 */
export function TextAreaInput({
  id,
  value,
  onChange,
  placeholder,
  rows = 3,
  disabled = false,
  className,
  resize = 'vertical'
}: TextAreaInputProps) {
  return (
    <Textarea
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      className={cn(
        'bg-gray-700 border-gray-600 text-white',
        'placeholder:text-gray-500',
        'focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400',
        'resize-' + resize,
        'min-h-[80px]',
        className
      )}
    />
  )
}

export interface SelectInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  children: React.ReactNode
}

/**
 * SelectInput - Select optimizado para formularios compactos
 */
export function SelectInput({
  value,
  onChange,
  placeholder,
  disabled = false,
  className,
  children
}: SelectInputProps) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className={cn(
        'bg-gray-700 border-gray-600 text-white',
        'focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400',
        'h-10',
        className
      )}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-gray-700 border-gray-600">
        {children}
      </SelectContent>
    </Select>
  )
}

export interface SelectOptionProps {
  value: string
  label: string
}

/**
 * SelectOption - Opción para SelectInput
 */
export function SelectOption({ value, label }: SelectOptionProps) {
  return (
    <SelectItem value={value} className="text-gray-300 hover:bg-gray-600">
      {label}
    </SelectItem>
  )
}

export interface SwitchInputProps {
  id: string
  checked: boolean
  onChange: (checked: boolean) => void
  description?: string
  disabled?: boolean
  className?: string
}

/**
 * SwitchInput - Switch optimizado para formularios compactos
 */
export function SwitchInput({
  id,
  checked,
  onChange,
  description,
  disabled = false,
  className
}: SwitchInputProps) {
  return (
    <div className={cn('flex items-center space-x-3', className)}>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
        className="data-[state=checked]:bg-yellow-400"
      />
      {description && (
        <Label htmlFor={id} className="text-sm text-gray-300 cursor-pointer">
          {description}
        </Label>
      )}
    </div>
  )
}

export interface CompactRowProps {
  children: React.ReactNode
  className?: string
  cols?: {
    mobile?: 1 | 2
    tablet?: 1 | 2 | 3
    notebook?: 2 | 3 | 4
    desktop?: 2 | 3 | 4 | 5 | 6
  }
  spacing?: 'sm' | 'md' | 'lg'
}

/**
 * CompactRow - Fila compacta para campos relacionados
 */
export function CompactRow({
  children,
  className,
  cols = {
    mobile: 1,
    tablet: 2,
    notebook: 2,
    desktop: 3
  },
  spacing = 'md'
}: CompactRowProps) {
  const spacingClasses = {
    sm: 'gap-2 md:gap-3 lg:gap-4',
    md: 'gap-3 md:gap-4 lg:gap-5',
    lg: 'gap-4 md:gap-5 lg:gap-6'
  }

  const gridClass = [
    cols.mobile === 1 ? 'grid-cols-1' : 'grid-cols-2',
    cols.tablet === 1 ? 'md:grid-cols-1' :
    cols.tablet === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3',
    cols.notebook === 2 ? 'lg:grid-cols-2' :
    cols.notebook === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4',
    cols.desktop === 2 ? 'xl:grid-cols-2' :
    cols.desktop === 3 ? 'xl:grid-cols-3' :
    cols.desktop === 4 ? 'xl:grid-cols-4' : 'xl:grid-cols-5'
  ].filter(Boolean).join(' ')

  return (
    <div className={cn(
      'grid',
      gridClass,
      spacingClasses[spacing],
      className
    )}>
      {children}
    </div>
  )
}