
'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog'
import { ExternalLink, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ImageModalProps {
  imageSrc: string
  imageAlt: string
  productName: string
  children: React.ReactNode
}

export function ImageModal({ imageSrc, imageAlt, productName, children }: ImageModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full p-0 bg-background" showCloseButton={false}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <DialogTitle className="text-lg font-semibold text-foreground">{productName}</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Image Container */}
        <div className="relative flex items-center justify-center p-4 bg-muted/30">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="max-w-full max-h-[70vh] object-contain rounded-lg"
          />
        </div>
        
        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
