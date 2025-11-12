import { z } from 'zod'

// Schema para crear usuarios (POST)
export const createUsuarioSchema = z.object({
  email: z.string()
    .trim()
    .toLowerCase()
    .email('Formato de email inválido')
    .max(320, 'El email no puede exceder 320 caracteres'),

  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(255, 'La contraseña no puede exceder 255 caracteres'),

  nombre: z.string()
    .trim()
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres'),

  apellidos: z.string()
    .trim()
    .max(150, 'Los apellidos no pueden exceder 150 caracteres')
    .optional(),

  telefono: z.string()
    .trim()
    .regex(/^\+?[\d\s\-\(\)]+$/, 'Formato telefónico inválido')
    .max(20, 'El teléfono no puede exceder 20 caracteres')
    .optional(),

  avatar_url: z.string()
    .url('URL de avatar inválida')
    .max(500, 'La URL del avatar no puede exceder 500 caracteres')
    .optional(),

  rol: z.enum(['usuario', 'propietario_negocio', 'moderador', 'admin'], {
    message: 'Rol inválido'
  }).default('usuario'),

  estado: z.enum(['activo', 'inactivo', 'suspendido', 'pendiente_verificacion'], {
    message: 'Estado inválido'
  }).default('pendiente_verificacion'),

  preferencias: z.record(z.string(), z.unknown()).optional(),
  metadata: z.record(z.string(), z.unknown()).optional()
})

// Schema para actualizar usuarios (PUT) - permite actualizaciones parciales
export const updateUsuarioSchema = createUsuarioSchema.omit({
  password: true
}).partial()

// Tipos TypeScript inferidos
export type CreateUsuarioInput = z.infer<typeof createUsuarioSchema>
export type UpdateUsuarioInput = z.infer<typeof updateUsuarioSchema>