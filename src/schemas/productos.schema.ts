import { z } from 'zod'

// Schema para crear productos (POST)
export const createProductoSchema = z.object({
  negocio_id: z.number()
    .positive('El ID del negocio debe ser un número positivo')
    .int('El ID del negocio debe ser un número entero'),
  
  categoria_id: z.number()
    .positive('El ID de la categoría debe ser un número positivo')
    .int('El ID de la categoría debe ser un número entero'),
  
  nombre: z.string()
    .trim()
    .min(1, 'El nombre es requerido')
    .max(200, 'El nombre no puede exceder 200 caracteres'),
  
  slug: z.string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'El slug solo puede contener letras, números y guiones')
    .max(220, 'El slug no puede exceder 220 caracteres'),
  
  descripcion: z.string()
    .trim()
    .optional(),
  
  descripcion_corta: z.string()
    .trim()
    .max(300, 'La descripción corta no puede exceder 300 caracteres')
    .optional(),
  
  precio: z.number()
    .min(0, 'El precio debe ser mayor o igual a 0')
    .max(9999999999.99, 'El precio no puede exceder 9999999999.99'),
  
  precio_antes: z.number()
    .min(0, 'El precio anterior debe ser mayor o igual a 0')
    .max(9999999999.99, 'El precio anterior no puede exceder 9999999999.99')
    .nullable()
    .optional(),
  
  moneda: z.string()
    .length(3, 'La moneda debe tener 3 caracteres')
    .toUpperCase()
    .refine((val) => ['COP', 'USD', 'EUR'].includes(val), {
      message: 'Código de moneda inválido. Use COP, USD o EUR'
    }).default('COP'),
  
  sku: z.string()
    .trim()
    .max(100, 'El SKU no puede exceder 100 caracteres')
    .optional(),
  
  stock_disponible: z.number()
    .int('El stock disponible debe ser un número entero')
    .min(0, 'El stock disponible debe ser mayor o igual a 0')
    .max(16777215, 'El stock disponible no puede exceder 16777215')
    .default(0),
  
  maneja_stock: z.boolean()
    .default(false),
  
  stock_minimo: z.number()
    .int('El stock mínimo debe ser un número entero')
    .min(0, 'El stock mínimo debe ser mayor o igual a 0')
    .max(65535, 'El stock mínimo no puede exceder 65535')
    .default(0),
  
  peso: z.number()
    .min(0, 'El peso debe ser mayor o igual a 0')
    .max(99999.999, 'El peso no puede exceder 99999.999')
    .nullable()
    .optional(),
  
  dimensiones: z.object({
    largo: z.number().positive('El largo debe ser positivo').optional(),
    ancho: z.number().positive('El ancho debe ser positivo').optional(),
    alto: z.number().positive('El alto debe ser positivo').optional()
  }).optional(),
  
  estado: z.enum(['borrador', 'activo', 'inactivo', 'agotado', 'eliminado'], {
    message: 'Estado inválido'
  }).default('borrador'),
  
  destacado: z.boolean()
    .default(false),
  
  permite_personalizacion: z.boolean()
    .default(false),
  
  seo_title: z.string()
    .trim()
    .max(70, 'El título SEO no puede exceder 70 caracteres')
    .optional(),
  
  seo_description: z.string()
    .trim()
    .max(160, 'La descripción SEO no puede exceder 160 caracteres')
    .optional(),
  
  seo_keywords: z.string()
    .trim()
    .max(300, 'Las palabras clave SEO no pueden exceder 300 caracteres')
    .optional(),
  
  atributos: z.record(z.string(), z.unknown()).optional(),
  opciones_personalizacion: z.record(z.string(), z.unknown()).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  
  fecha_disponibilidad: z.string()
    .datetime('Formato de fecha inválido. Use formato ISO 8601')
    .optional()
}).refine((data) => {
  if (data.precio_antes !== null && data.precio_antes !== undefined) {
    return data.precio_antes > data.precio
  }
  return true
}, {
  message: 'El precio anterior debe ser mayor que el precio actual',
  path: ['precio_antes']
}).refine((data) => {
  if (data.maneja_stock) {
    return data.stock_disponible !== undefined && data.stock_disponible >= 0
  }
  return true
}, {
  message: 'Si maneja stock, el stock disponible debe estar definido y ser mayor o igual a 0',
  path: ['stock_disponible']
})

// Schema para actualizar productos (PUT) - permite actualizaciones parciales
export const updateProductoSchema = createProductoSchema.omit({ 
  negocio_id: true 
}).partial()

// Tipos TypeScript inferidos
export type CreateProductoInput = z.infer<typeof createProductoSchema>
export type UpdateProductoInput = z.infer<typeof updateProductoSchema>