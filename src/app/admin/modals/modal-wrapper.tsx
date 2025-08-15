"use client"

import React, { ReactNode } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface ModalWrapperProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: ReactNode
  onSave?: () => void
  saveLabel?: string
  isSaving?: boolean
  maxWidth?: string
}

export default function ModalWrapper({
  open,
  onOpenChange,
  title,
  description,
  children,
  onSave,
  saveLabel = "Guardar",
  isSaving = false,
  maxWidth = "md:max-w-2xl"
}: ModalWrapperProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${maxWidth} h-auto max-h-[90vh] overflow-y-auto`}>
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Cerrar</span>
          </Button>
        </DialogHeader>
        
        <div className="py-4">{children}</div>
        
        {onSave && (
          <DialogFooter>
            <Button onClick={onSave} disabled={isSaving}>
              {isSaving ? "Guardando..." : saveLabel}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}