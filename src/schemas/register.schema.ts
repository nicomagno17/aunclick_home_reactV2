import { z } from 'zod';

// Step 1: Personal Information
const personalInfoSchema = z.object({
    firstName: z
        .string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(100, 'El nombre no puede tener más de 100 caracteres')
        .trim(),

    lastName: z
        .string()
        .min(2, 'El apellido debe tener al menos 2 caracteres')
        .max(100, 'El apellido no puede tener más de 100 caracteres')
        .trim(),

    rut: z
        .string()
        .min(8, 'El RUT es inválido')
        .max(12, 'El RUT es inválido')
        .regex(/^\d{1,2}\.\d{3}\.\d{3}[-][0-9kK]$/, 'Formato de RUT inválido (ej: 12.345.678-9)')
        .trim(),

    birthDate: z
        .string()
        .refine((date) => {
            const birthDate = new Date(date);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();

            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                return age - 1 >= 18;
            }
            return age >= 18;
        }, 'Debes ser mayor de 18 años'),

    gender: z
        .enum(['masculino', 'femenino', 'otro']),

    phone: z
        .string()
        .min(9, 'El teléfono debe tener al menos 9 caracteres')
        .max(20, 'El teléfono no puede tener más de 20 caracteres')
        .regex(/^\+?[\d\s\-\(\)]+$/, 'Formato telefónico inválido')
        .trim(),

    region: z
        .string()
        .min(1, 'Selecciona una región')
        .trim(),

    commune: z
        .string()
        .min(1, 'Selecciona una comuna')
        .trim(),

    address: z
        .string()
        .min(5, 'La dirección debe tener al menos 5 caracteres')
        .max(200, 'La dirección no puede tener más de 200 caracteres')
        .trim(),
});

// Step 2: Account Information
const accountInfoSchema = z.object({
    username: z
        .string()
        .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
        .max(50, 'El nombre de usuario no puede tener más de 50 caracteres')
        .regex(/^[a-zA-Z0-9_]+$/, 'Solo se permiten letras, números y guiones bajos')
        .trim(),

    email: z
        .string()
        .email('El formato del email es inválido')
        .max(320, 'El email no puede tener más de 320 caracteres')
        .trim()
        .toLowerCase(),

    backupEmail: z
        .string()
        .email('El formato del email es inválido')
        .max(320, 'El email no puede tener más de 320 caracteres')
        .trim()
        .toLowerCase()
        .optional()
        .or(z.literal('')),

    password: z
        .string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .max(255, 'La contraseña no puede tener más de 255 caracteres')
        .regex(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
        .regex(/[0-9]/, 'La contraseña debe contener al menos un número')
        .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'La contraseña debe contener al menos un carácter especial')
        .trim(),

    confirmPassword: z
        .string()
        .trim(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
});

// Step 3: Plan Selection
const planSelectionSchema = z.object({
    selectedPlan: z
        .enum(['gratuito', 'normal', 'premium']),
});

// Step 3.5: Payment Information (only for paid plans)
const paymentInfoSchema = z.object({
    cardNumber: z
        .string()
        .min(15, 'Número de tarjeta inválido')
        .max(19, 'Número de tarjeta inválido')
        .regex(/^[\d\s]+$/, 'Solo se permiten números')
        .trim()
        .optional()
        .or(z.literal('')),

    cardHolderName: z
        .string()
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(100, 'El nombre no puede tener más de 100 caracteres')
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras y espacios')
        .trim()
        .optional()
        .or(z.literal('')),

    cardExpiryDate: z
        .string()
        .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Formato inválido (MM/AA)')
        .trim()
        .optional()
        .or(z.literal('')),

    cardCvv: z
        .string()
        .min(3, 'CVV debe tener 3 o 4 dígitos')
        .max(4, 'CVV debe tener 3 o 4 dígitos')
        .regex(/^\d+$/, 'Solo se permiten números')
        .trim()
        .optional()
        .or(z.literal('')),

    cardType: z
        .enum(['credito', 'debito'])
        .optional(),

    rut: z
        .string()
        .min(8, 'El RUT es inválido')
        .max(12, 'El RUT es inválido')
        .regex(/^\d{1,2}\.\d{3}\.\d{3}[-][0-9kK]$/, 'Formato de RUT inválido (ej: 12.345.678-9)')
        .trim()
        .optional()
        .or(z.literal('')),
});

// Step 4: Business Information
const businessInfoSchema = z.object({
    businessName: z
        .string()
        .min(2, 'El nombre del negocio debe tener al menos 2 caracteres')
        .max(100, 'El nombre del negocio no puede tener más de 100 caracteres')
        .trim(),

    businessAddress: z
        .string()
        .min(5, 'La dirección debe tener al menos 5 caracteres')
        .max(200, 'La dirección no puede tener más de 200 caracteres')
        .trim(),

    businessPhone: z
        .string()
        .min(9, 'El teléfono debe tener al menos 9 caracteres')
        .max(20, 'El teléfono no puede tener más de 20 caracteres')
        .regex(/^\+?[\d\s\-\(\)]+$/, 'Formato telefónico inválido')
        .trim(),

    businessWhatsApp: z
        .string()
        .min(9, 'El WhatsApp debe tener al menos 9 caracteres')
        .max(20, 'El WhatsApp no puede tener más de 20 caracteres')
        .regex(/^\+?[\d\s\-\(\)]+$/, 'Formato de WhatsApp inválido')
        .trim()
        .optional()
        .or(z.literal('')),

    businessEmail: z
        .string()
        .email('El formato del email es inválido')
        .max(320, 'El email no puede tener más de 320 caracteres')
        .trim()
        .toLowerCase(),

    businessOwner: z
        .string()
        .min(2, 'El nombre del responsable debe tener al menos 2 caracteres')
        .max(100, 'El nombre del responsable no puede tener más de 100 caracteres')
        .trim(),

    businessFeature: z
        .string()
        .min(10, 'La característica debe tener al menos 10 caracteres')
        .max(500, 'La característica no puede tener más de 500 caracteres')
        .trim(),
});

// Complete registration schema combining all steps
export const registerSchema = personalInfoSchema
    .merge(accountInfoSchema)
    .merge(planSelectionSchema)
    .merge(paymentInfoSchema)
    .merge(businessInfoSchema);

// Individual step schemas for validation
export { personalInfoSchema, accountInfoSchema, planSelectionSchema, paymentInfoSchema, businessInfoSchema };

// Type definitions
export type RegisterInput = z.infer<typeof registerSchema>;
export type PersonalInfoInput = z.infer<typeof personalInfoSchema>;
export type AccountInfoInput = z.infer<typeof accountInfoSchema>;
export type PlanSelectionInput = z.infer<typeof planSelectionSchema>;
export type PaymentInfoInput = z.infer<typeof paymentInfoSchema>;
export type BusinessInfoInput = z.infer<typeof businessInfoSchema>;