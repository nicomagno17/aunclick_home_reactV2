import { z } from 'zod'

// Schema para crear planes de suscripción (POST)
export const createPlanSuscripcionSchema = z.object({
  nombre: z.string()
    .trim()
    .min(1, 'El nombre es requerido')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  
  descripcion: z.string()
    .trim()
    .optional(),
  
  precio_mensual: z.number()
    .min(0, 'El precio mensual debe ser mayor o igual a 0')
    .max(99999999.99, 'El precio mensual no puede exceder 99999999.99'),
  
  precio_anual: z.number()
    .min(0, 'El precio anual debe ser mayor o igual a 0')
    .max(99999999.99, 'El precio anual no puede exceder 99999999.99'),
  
  descuento_anual: z.number()
    .int('El descuento anual debe ser un número entero')
    .min(0, 'El descuento anual debe ser mayor o igual a 0')
    .max(100, 'El descuento anual no puede exceder 100')
    .default(0),
  
  max_negocios: z.number()
    .int('El máximo de negocios debe ser un número entero')
    .min(1, 'El máximo de negocios debe ser al menos 1')
    .max(65535, 'El máximo de negocios no puede exceder 65535')
    .default(1),
  
  max_productos_por_negocio: z.number()
    .int('El máximo de productos por negocio debe ser un número entero')
    .min(1, 'El máximo de productos por negocio debe ser al menos 1')
    .max(16777215, 'El máximo de productos por negocio no puede exceder 16777215')
    .default(50),
  
  max_imagenes_por_producto: z.number()
    .int('El máximo de imágenes por producto debe ser un número entero')
    .min(1, 'El máximo de imágenes por producto debe ser al menos 1')
    .max(255, 'El máximo de imágenes por producto no puede exceder 255')
    .default(5),
  
  caracteristicas: z.array(z.string(), {
    message: 'Las características deben ser un array de strings'
  }).min(1, 'Debe especificar al menos una característica'),
  
  activo: z.boolean()
    .default(true),
  
  orden_visualizacion: z.number()
    .int('El orden de visualización debe ser un número entero')
    .min(1, 'El orden de visualización debe ser al menos 1')
    .max(255, 'El orden de visualización no puede exceder 255')
    .default(1),
  
  metadata: z.record(z.string(), z.unknown()).optional()
}).refine((data) => {
  // Validar que el precio anual sea menor o igual al precio mensual * 12
  const precioMensualAnual = data.precio_mensual * 12
  return data.precio_anual <= precioMensualAnual
}, {
  message: 'El precio anual debe ser menor o igual al precio mensual multiplicado por 12',
  path: ['precio_anual']
}).refine((data) => {
  // Validar que si hay descuento, el precio anual refleje correctamente el descuento
  if (data.descuento_anual > 0) {
    const precioMensualAnual = data.precio_mensual * 12
    const precioConDescuento = precioMensualAnual * (1 - data.descuento_anual / 100)
    return Math.abs(data.precio_anual - precioConDescuento) < 0.01
  }
  return true
}, {
  message: 'El precio anual no refleja correctamente el descuento especificado',
  path: ['precio_anual']
})

// Schema para actualizar planes de suscripción (PUT) - permite actualizaciones parciales
export const updatePlanSuscripcionSchema = createPlanSuscripcionSchema.partial()

// Tipos TypeScript inferidos
export type CreatePlanSuscripcionInput = z.infer<typeof createPlanSuscripcionSchema>
export type UpdatePlanSuscripcionInput = z.infer<typeof updatePlanSuscripcionSchema>