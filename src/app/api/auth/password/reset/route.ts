import { NextResponse } from 'next/server'
import { executeQuerySingle } from '@/lib/database'
import { checkPasswordResetRateLimit } from '@/lib/rate-limit'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import logger, { setCorrelationContextFromRequest } from '@/lib/logger'

// Schema for password reset validation
const resetPasswordSchema = z.object({
    token: z.string().min(1, 'Token inválido'),
    password: z
        .string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .max(255, 'La contraseña no puede tener más de 255 caracteres')
        .regex(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
        .regex(/[0-9]/, 'La contraseña debe contener al menos un número')
        .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'La contraseña debe contener al menos un carácter especial')
        .trim(),
})

// Verify a token against its hash
async function verifyToken(token: string, hash: string): Promise<boolean> {
    return bcrypt.compare(token, hash)
}

export async function POST(request: Request) {
    try {
        // Set correlation context from request headers
        setCorrelationContextFromRequest(request)

        const body = await request.json()
        const { token, password } = resetPasswordSchema.parse(body)

        // Get client IP for rate limiting
        const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
            request.headers.get('x-real-ip') ||
            request.headers.get('x-client-ip') ||
            '127.0.0.1'

        // Check rate limiting
        const rateLimitResponse = await checkPasswordResetRateLimit(clientIP)
        if (!rateLimitResponse.success) {
            await logger.warn('Password reset rate limit exceeded', {
                ip: clientIP,
                endpoint: '/api/auth/password/reset',
                method: 'POST'
            })

            return NextResponse.json(
                { error: 'Demasiados intentos de restablecimiento. Intenta de nuevo más tarde.' },
                {
                    status: 429,
                    headers: {
                        'X-RateLimit-Limit': rateLimitResponse.limit.toString(),
                        'X-RateLimit-Remaining': rateLimitResponse.remaining.toString(),
                        'X-RateLimit-Reset': rateLimitResponse.reset.toString(),
                        'Retry-After': Math.max(0, Math.ceil((rateLimitResponse.reset - Date.now()) / 1000)).toString(),
                    }
                }
            )
        }

        // Find the reset token in the database
        const resetToken = await executeQuerySingle(`
      SELECT prt.user_id, prt.email, prt.token_hash, prt.expires_at, prt.used, u.id as user_exists
      FROM password_reset_tokens prt
      LEFT JOIN usuarios u ON prt.user_id = u.id AND u.deleted_at IS NULL
      WHERE prt.token_hash IS NOT NULL AND prt.expires_at > NOW()
      ORDER BY prt.created_at DESC
      LIMIT 1
    `)

        if (!resetToken) {
            await logger.warn('Password reset attempt with invalid/expired token', {
                endpoint: '/api/auth/password/reset',
                method: 'POST'
            })

            return NextResponse.json(
                { error: 'Token inválido o expirado' },
                { status: 400 }
            )
        }

        // Check if token has already been used
        if (resetToken.used) {
            await logger.warn('Password reset attempt with already used token', {
                userId: resetToken.user_id,
                endpoint: '/api/auth/password/reset',
                method: 'POST'
            })

            return NextResponse.json(
                { error: 'Token ya ha sido utilizado' },
                { status: 400 }
            )
        }

        // Verify the token
        const isValidToken = await verifyToken(token, resetToken.token_hash)
        if (!isValidToken) {
            await logger.warn('Password reset attempt with invalid token', {
                userId: resetToken.user_id,
                endpoint: '/api/auth/password/reset',
                method: 'POST'
            })

            return NextResponse.json(
                { error: 'Token inválido' },
                { status: 400 }
            )
        }

        // Check if user exists
        if (!resetToken.user_exists) {
            await logger.warn('Password reset attempt for non-existent user', {
                userId: resetToken.user_id,
                endpoint: '/api/auth/password/reset',
                method: 'POST'
            })

            return NextResponse.json(
                { error: 'Usuario no encontrado' },
                { status: 404 }
            )
        }

        // Hash the new password with configurable cost
        const bcryptCost = parseInt(process.env.BCRYPT_COST ?? '12')
        const passwordHash = await bcrypt.hash(password, bcryptCost)

        // Update user password
        await executeQuerySingle(
            'UPDATE usuarios SET password_hash = ?, updated_at = NOW() WHERE id = ?',
            [passwordHash, resetToken.user_id]
        )

        // Mark the token as used
        await executeQuerySingle(
            'UPDATE password_reset_tokens SET used = 1, used_at = NOW() WHERE user_id = ?',
            [resetToken.user_id]
        )

        await logger.info('Password reset successful', {
            userId: resetToken.user_id,
            email: resetToken.email,
            endpoint: '/api/auth/password/reset',
            method: 'POST'
        })

        return NextResponse.json({
            message: 'Contraseña restablecida exitosamente'
        })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Datos inválidos', details: error.format() },
                { status: 400 }
            )
        }

        await logger.error('Password reset failed', {
            error: error instanceof Error ? error.message : 'Unknown error',
            endpoint: '/api/auth/password/reset',
            method: 'POST'
        })

        return NextResponse.json(
            { error: 'Error al restablecer la contraseña' },
            { status: 500 }
        )
    }
}