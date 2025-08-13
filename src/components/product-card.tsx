'use client'

import { ShoppingCart, ExternalLink, Heart } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Product } from '@/types/product'
import { ImageModal } from '@/components/image-modal'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <Card className="group h-full overflow-hidden hover:shadow-xl transition-all duration-300 border-border hover:border-primary/50 bg-card">
      <div className="p-0">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discountPercentage > 0 && (
              <Badge className="bg-destructive text-destructive-foreground px-2 py-1 text-xs font-bold">
                -{discountPercentage}%
              </Badge>
            )}
            {!product.inStock && (
              <Badge variant="secondary" className="bg-muted text-muted-foreground px-2 py-1 text-xs">
                Agotado
              </Badge>
            )}
          </div>

          {/* Action Buttons - Only visible on hover for desktop */}
          <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
            <Button 
              size="sm" 
              variant="secondary" 
              className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm hover:bg-background"
            >
              <Heart className="h-4 w-4" />
            </Button>
            <ImageModal 
              imageSrc={product.image} 
              imageAlt={product.name}
              productName={product.name}
            >
              <Button 
                size="sm" 
                variant="secondary" 
                className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm hover:bg-background"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </ImageModal>
          </div>

          {/* Source Badge */}
          <div className="absolute bottom-2 left-2">
            <Badge variant="outline" className="bg-background/80 backdrop-blur-sm text-xs">
              {product.source}
            </Badge>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 flex flex-col h-full">
          {/* Category */}
          <div className="mb-2">
            <Badge variant="secondary" className="text-xs bg-muted text-muted-foreground">
              {product.category}
            </Badge>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors mb-2 flex-grow">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {product.description}
          </p>

          {/* Price */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl font-bold text-purple-700 dark:text-purple-400">
              ${product.price.toLocaleString('es-CL')}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                ${product.originalPrice.toLocaleString('es-CL')}
              </span>
            )}
          </div>

          {/* Action Button */}
          <Button 
            className="w-full bg-purple-700 hover:bg-purple-800 text-white mt-auto"
            disabled={!product.inStock}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.inStock ? 'Añadir al carrito' : 'No disponible'}
          </Button>
        </div>
      </div>
    </Card>
  )
}