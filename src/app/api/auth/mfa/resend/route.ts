import { NextRequest, NextResponse } from "next/server";
import { checkMFARateLimit } from "@/lib/mfa";
import logger from "@/lib/logger";

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: "Email es requerido" },
                { status: 400 }
            );
        }

        // Check rate limiting for MFA resend
        const rateLimitResult = await checkMFARateLimit(email, "totp");
        if (!rateLimitResult.allowed) {
            logger.warn("MFA resend rate limit exceeded", {
                email,
                ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
                retryAfter: Math.ceil((rateLimitResult.resetTime.getTime() - Date.now()) / 1000),
            });

            return NextResponse.json(
                { error: "Demasiados intentos. Por favor, espera unos minutos antes de intentar nuevamente." },
                {
                    status: 429,
                    headers: {
                        "Retry-After": Math.ceil((rateLimitResult.resetTime.getTime() - Date.now()) / 1000).toString(),
                        "X-RateLimit-Limit": "5",
                        "X-RateLimit-Remaining": rateLimitResult.remainingAttempts.toString(),
                        "X-RateLimit-Reset": rateLimitResult.resetTime.toISOString(),
                    }
                }
            );
        }

        // In a real implementation, you would:
        // 1. Check if the user exists and has MFA enabled
        // 2. Generate a new MFA session token
        // 3. Send an email/SMS with the new code
        // 4. Store the new token with expiration

        // For now, we'll just log the request
        logger.info("MFA code resend requested", {
            email,
            ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
        });

        // Always return success to prevent email enumeration
        return NextResponse.json({
            message: "Si el email está registrado y tiene MFA activado, recibirás un nuevo código.",
        });
    } catch (error) {
        logger.error("Error in MFA resend", {
            error: error instanceof Error ? error.message : "Unknown error",
            stack: error instanceof Error ? error.stack : undefined,
        });

        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}