"use client"

import React from 'react'
import { Product } from '@/types/product'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, Tag, ShoppingCart, Info } from 'lucide-react'

interface ImageModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export function ImageModal({ product, isOpen, onClose }: ImageModalProps) {
  if (!product) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md md:max-w-lg lg:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{product.name}</DialogTitle>
          <DialogDescription className="text-md text-gray-500">{product.source}</DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Columna de la imagen */}
          <div className="relative h-64 md:h-auto w-full">
            <img
              src={product.image}
              alt={product.name}
              className="rounded-lg object-cover w-full h-full"
            />
            {product.discount && (
              <Badge 
                variant="destructive" 
                className="absolute top-3 left-3 text-lg"
              >
                {product.discount}% OFF
              </Badge>
            )}
          </div>

          {/* Columna de detalles */}
          <div className="flex flex-col space-y-4">
            <p className="text-gray-700">{product.description}</p>
            
            <div className="flex items-center space-x-2">
              <Star className="text-yellow-500" />
              <span className="font-semibold">{product.rating}</span>
              <span className="text-gray-500">({product.reviews} reviews)</span>
            </div>

            <div className="flex items-baseline space-x-3">
              <p className="text-4xl font-bold text-purple-600">${product.price.toLocaleString()}</p>
              {product.originalPrice && (
                <p className="text-xl text-gray-400 line-through">${product.originalPrice.toLocaleString()}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Tag className="text-gray-500" />
              <Badge variant="secondary">{product.category}</Badge>
            </div>

            {!product.inStock && (
              <div className="flex items-center space-x-2 text-red-600">
                <Info className="h-5 w-5" />
                <span className="font-semibold">Agotado</span>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}