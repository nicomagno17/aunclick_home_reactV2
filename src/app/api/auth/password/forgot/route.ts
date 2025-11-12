import { NextResponse } from 'next/server'
import { executeQuerySingle } from '@/lib/database'
import { checkPasswordResetRateLimit } from '@/lib/rate-limit'
import { z } from 'zod'
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import logger, { setCorrelationContextFromRequest } from '@/lib/logger'

// Schema for email validation
const forgotPasswordSchema = z.object({
    email: z.string().email('Email inválido').trim().toLowerCase(),
})

// Generate a secure random token
function generateResetToken(): string {
    return crypto.randomBytes(32).toString('hex')
}

// Hash the token for storage
async function hashToken(token: string): Promise<string> {
    return bcrypt.hash(token, 10)
}

// Verify a token against its hash
async function verifyToken(token: string, hash: string): Promise<boolean> {
    return bcrypt.compare(token, hash)
}

export async function POST(request: Request) {
    try {
        // Set correlation context from request headers
        setCorrelationContextFromRequest(request)

        const body = await request.json()
        const { email } = forgotPasswordSchema.parse(body)

        // Get client IP for rate limiting
        const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
            request.headers.get('x-real-ip') ||
            request.headers.get('x-client-ip') ||
            '127.0.0.1'

        // Check rate limiting
        const rateLimitResponse = await checkPasswordResetRateLimit(clientIP)
        if (!rateLimitResponse.success) {
            await logger.warn('Password reset rate limit exceeded', {
                email,
                ip: clientIP,
                endpoint: '/api/auth/password/forgot',
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

        // Always return 200 to prevent email enumeration attacks
        // But only actually process if user exists
        const user = await executeQuerySingle(
            'SELECT id, email, nombre FROM usuarios WHERE email = ? AND deleted_at IS NULL',
            [email]
        )

        if (user) {
            // Generate reset token
            const resetToken = generateResetToken()
            const hashedToken = await hashToken(resetToken)
            const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now

            // Store the reset token in the database
            await executeQuerySingle(`
        INSERT INTO password_reset_tokens (user_id, email, token_hash, expires_at, created_at)
        VALUES (?, ?, ?, ?, NOW())
        ON DUPLICATE KEY UPDATE
        token_hash = VALUES(token_hash),
        expires_at = VALUES(expires_at),
        created_at = VALUES(created_at),
        used = 0
      `, [user.id, email, hashedToken, expiresAt])

            // TODO: Send email with reset link
            // For now, just log the token (in production, this should be sent via email)
            await logger.info('Password reset token generated', {
                userId: user.id,
                email,
                endpoint: '/api/auth/password/forgot',
                method: 'POST'
            })

            // In a real implementation, you would send an email like:
            // await sendPasswordResetEmail(email, resetToken)
        }

        await logger.info('Password reset request processed', {
            email,
            userExists: !!user,
            endpoint: '/api/auth/password/forgot',
            method: 'POST'
        })

        // Always return success to prevent email enumeration
        return NextResponse.json({
            message: 'Si el email está registrado, recibirás instrucciones para restablecer tu contraseña'
        })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Datos inválidos', details: error.format() },
                { status: 400 }
            )
        }

        await logger.error('Password reset request failed', {
            error: error instanceof Error ? error.message : 'Unknown error',
            endpoint: '/api/auth/password/forgot',
            method: 'POST'
        })

        // Always return success to prevent email enumeration
        return NextResponse.json({
            message: 'Si el email está registrado, recibirás instrucciones para restablecer tu contraseña'
        })
    }
}