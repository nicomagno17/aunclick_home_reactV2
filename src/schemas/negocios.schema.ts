import { z } from 'zod'

// Schema para crear negocios (POST)
export const createNegocioSchema = z.object({
  propietario_id: z.number()
    .positive('El ID del propietario debe ser un número positivo')
    .int('El ID del propietario debe ser un número entero'),
  
  categoria_id: z.number()
    .positive('El ID de la categoría debe ser un número positivo')
    .int('El ID de la categoría debe ser un número entero'),
  
  ubicacion_id: z.number()
    .positive('El ID de la ubicación debe ser un número positivo')
    .int('El ID de la ubicación debe ser un número entero'),
  
  plan_id: z.number()
    .positive('El ID del plan debe ser un número positivo')
    .int('El ID del plan debe ser un número entero')
    .default(1),
  
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
  
  telefono_principal: z.string()
    .trim()
    .regex(/^\+?[\d\s\-\(\)]+$/, 'Formato telefónico inválido')
    .max(20, 'El teléfono principal no puede exceder 20 caracteres')
    .optional(),
  
  telefono_secundario: z.string()
    .trim()
    .regex(/^\+?[\d\s\-\(\)]+$/, 'Formato telefónico inválido')
    .max(20, 'El teléfono secundario no puede exceder 20 caracteres')
    .optional(),
  
  email: z.string()
    .trim()
    .toLowerCase()
    .email('Formato de email inválido')
    .max(320, 'El email no puede exceder 320 caracteres')
    .optional(),
  
  sitio_web: z.string()
    .url('URL del sitio web inválida')
    .max(500, 'La URL del sitio web no puede exceder 500 caracteres')
    .optional(),
  
  whatsapp: z.string()
    .trim()
    .regex(/^\+?[\d\s\-\(\)]+$/, 'Formato de WhatsApp inválido')
    .max(20, 'El WhatsApp no puede exceder 20 caracteres')
    .optional(),
  
  redes_sociales: z.object({
    facebook: z.string().url('URL de Facebook inválida').optional(),
    instagram: z.string().url('URL de Instagram inválida').optional(),
    twitter: z.string().url('URL de Twitter inválida').optional(),
    linkedin: z.string().url('URL de LinkedIn inválida').optional(),
    youtube: z.string().url('URL de YouTube inválida').optional()
  }).optional(),
  
  logo_url: z.string()
    .url('URL del logo inválida')
    .max(500, 'La URL del logo no puede exceder 500 caracteres')
    .optional(),
  
  banner_url: z.string()
    .url('URL del banner inválida')
    .max(500, 'La URL del banner no puede exceder 500 caracteres')
    .optional(),
  
  galeria_imagenes: z.array(
    z.string().url('URL de imagen inválida').max(500, 'La URL de la imagen no puede exceder 500 caracteres'),
    {
      message: 'La galería de imágenes debe ser un array de URLs válidas'
    }
  ).optional(),
  
  estado: z.enum(['borrador', 'activo', 'inactivo', 'suspendido', 'eliminado'], {
    message: 'Estado inválido'
  }).default('borrador'),
  
  verificado: z.boolean()
    .default(false),
  
  destacado: z.boolean()
    .default(false),
  
  permite_pedidos: z.boolean()
    .default(true),
  
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
  
  configuracion: z.record(z.string(), z.unknown()).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  
  suscripcion_inicio: z.string()
    .datetime('Formato de fecha inválido. Use formato ISO 8601')
    .optional(),
  
  suscripcion_fin: z.string()
    .datetime('Formato de fecha inválido. Use formato ISO 8601')
    .optional()
}).refine((data) => {
  // Validar que la fecha de fin sea mayor o igual a la fecha de inicio
  if (data.suscripcion_inicio && data.suscripcion_fin) {
    return new Date(data.suscripcion_fin) >= new Date(data.suscripcion_inicio)
  }
  return true
}, {
  message: 'La fecha de fin de suscripción debe ser mayor o igual a la fecha de inicio',
  path: ['suscripcion_fin']
})

// Schema para actualizar negocios (PUT) - permite actualizaciones parciales
export const updateNegocioSchema = createNegocioSchema.omit({ 
  propietario_id: true 
}).partial()

// Tipos TypeScript inferidos
export type CreateNegocioInput = z.infer<typeof createNegocioSchema>
export type UpdateNegocioInput = z.infer<typeof updateNegocioSchema>