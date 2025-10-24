import { z } from 'zod';

// Esquema de validación para el login
export const loginSchema = z.object({
    email: z
        .string()
        .email('El formato del email es inválido')
        .max(320, 'El email no puede tener más de 320 caracteres')
        .trim()
        .toLowerCase()
        .transform((val) => val.trim().toLowerCase()),

    password: z
        .string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .max(255, 'La contraseña no puede tener más de 255 caracteres')
        .trim(),
});

// Tipo inferido del schema para uso en TypeScript
export type LoginInput = z.infer<typeof loginSchema>;

// Esquema para el registro (extiende del schema de usuarios existente)
export const registerSchema = z.object({
    nombre: z
        .string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(100, 'El nombre no puede tener más de 100 caracteres')
        .trim(),

    apellido: z
        .string()
        .min(2, 'El apellido debe tener al menos 2 caracteres')
        .max(100, 'El apellido no puede tener más de 100 caracteres')
        .trim(),

    email: z
        .string()
        .email('El formato del email es inválido')
        .max(320, 'El email no puede tener más de 320 caracteres')
        .trim()
        .toLowerCase()
        .transform((val) => val.trim().toLowerCase()),

    password: z
        .string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .max(255, 'La contraseña no puede tener más de 255 caracteres')
        .regex(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
        .regex(/[a-z]/, 'La contraseña debe contener al menos una letra minúscula')
        .regex(/[0-9]/, 'La contraseña debe contener al menos un número')
        .regex(/[^A-Za-z0-9]/, 'La contraseña debe contener al menos un carácter especial')
        .trim(),

    confirm_password: z.string().trim(),

    rol: z.enum(['admin', 'moderador', 'usuario', 'propietario_negocio']).default('usuario'),
}).refine((data) => data.password === data.confirm_password, {
    message: 'Las contraseñas no coinciden',
    path: ['confirm_password'],
});

// Tipo inferido del schema de registro
export type RegisterInput = z.infer<typeof registerSchema>;