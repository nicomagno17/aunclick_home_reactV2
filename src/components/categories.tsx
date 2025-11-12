'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'

interface CategoriesProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

const categories = [
  { id: 'todos', name: 'Todos', icon: '🛍️' },
  { id: 'electronica', name: 'Electrónica', icon: '📱' },
  { id: 'ropa', name: 'Ropa', icon: '👕' },
  { id: 'hogar', name: 'Hogar', icon: '🏠' },
  { id: 'deportes', name: 'Deportes', icon: '⚽' },
  { id: 'belleza', name: 'Belleza', icon: '💄' },
  { id: 'juguetes', name: 'Juguetes', icon: '🧸' },
  { id: 'libros', name: 'Libros', icon: '📚' },
  { id: 'automotriz', name: 'Automotriz', icon: '🚗' },
  { id: 'salud', name: 'Salud', icon: '💊' },
]

export function Categories({ selectedCategory, onCategoryChange }: CategoriesProps) {
  return (
    <div className="w-full">
      <ScrollArea className="w-full">
        <div className="flex space-x-2 pb-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => onCategoryChange(category.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 h-auto transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                  : 'bg-background text-foreground hover:bg-primary/10 hover:text-primary border-border'
              }`}
            >
              <span className="text-lg">{category.icon}</span>
              <span className="font-medium">{category.name}</span>
              {selectedCategory === category.id && (
                <Badge variant="secondary" className="ml-1 bg-primary-foreground/20 text-primary-foreground">
                  ✓
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </ScrollArea>
      
      {/* Selected Category Indicator */}
      <div className="mt-3 flex items-center justify-center">
        <div className="bg-primary/10 rounded-full px-4 py-1">
          <span className="text-sm font-medium text-primary">
            Categoría: {categories.find(c => c.id === selectedCategory)?.name}
          </span>
        </div>
      </div>
    </div>
  )
}