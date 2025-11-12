import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import logger from './logger';

// Tipos para las respuestas de rate limiting
export interface RateLimitResponse {
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
    pending?: boolean;
}

// Configuración de límites por endpoint
const RATE_LIMITS = {
    login: {
        requests: 5,
        window: '10m', // 10 minutos
        windowMs: 10 * 60 * 1000,
    },
    loginPerAccount: {
        requests: 10,
        window: '1h', // 1 hora
        windowMs: 60 * 60 * 1000,
    },
    oauth: {
        requests: 10,
        window: '5m', // 5 minutos
        windowMs: 5 * 60 * 1000,
    },
    register: {
        requests: 3,
        window: '1h', // 1 hora
        windowMs: 60 * 60 * 1000,
    },
} as const;

// Add password reset rate limiting configuration
const passwordResetRateLimit = {
    requests: 3 as const,
    window: '1h' as const, // 1 hora
    windowMs: 60 * 60 * 1000,
};

// Inicializar cliente Redis si hay configuración
let redisClient: Redis | null = null;
let loginRatelimit: Ratelimit | null = null;
let loginAccountRatelimit: Ratelimit | null = null;
let oauthRatelimit: Ratelimit | null = null;
let registerRatelimit: Ratelimit | null = null;
let passwordResetRatelimit: Ratelimit | null = null;

try {
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
        redisClient = new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL,
            token: process.env.UPSTASH_REDIS_REST_TOKEN,
        });

        // Crear instancias separadas para cada endpoint
        loginRatelimit = new Ratelimit({
            redis: redisClient,
            limiter: Ratelimit.slidingWindow(RATE_LIMITS.login.requests, RATE_LIMITS.login.window),
        });

        loginAccountRatelimit = new Ratelimit({
            redis: redisClient,
            limiter: Ratelimit.slidingWindow(RATE_LIMITS.loginPerAccount.requests, RATE_LIMITS.loginPerAccount.window),
        });

        oauthRatelimit = new Ratelimit({
            redis: redisClient,
            limiter: Ratelimit.slidingWindow(RATE_LIMITS.oauth.requests, RATE_LIMITS.oauth.window),
        });

        registerRatelimit = new Ratelimit({
            redis: redisClient,
            limiter: Ratelimit.slidingWindow(RATE_LIMITS.register.requests, RATE_LIMITS.register.window),
        });

        passwordResetRatelimit = new Ratelimit({
            redis: redisClient,
            limiter: Ratelimit.slidingWindow(passwordResetRateLimit.requests, passwordResetRateLimit.window as any),
        });

        logger.info('Rate limiting initialized with Upstash Redis');
    } else {
        logger.warn('Rate limiting: Upstash Redis credentials not found. Using in-memory fallback (not recommended for production)');
    }
} catch (error) {
    logger.error('Failed to initialize rate limiting:', error);
    // Continuar sin rate limiting si hay error
}

// Fallback in-memory (no recomendado para producción)
const memoryStore = new Map<string, { count: number; reset: number }>();

function getMemoryKey(prefix: string, identifier: string): string {
    return `${prefix}:${identifier}`;
}

async function cleanupMemoryStore(): Promise<void> {
    const now = Date.now();
    for (const [key, value] of memoryStore.entries()) {
        if (value.reset <= now) {
            memoryStore.delete(key);
        }
    }
}

// Función principal para verificar rate limiting con la instancia específica
async function checkRateLimitWithInstance(
    ratelimitInstance: Ratelimit | null,
    prefix: string,
    identifier: string,
    limits: typeof RATE_LIMITS[keyof typeof RATE_LIMITS] | typeof passwordResetRateLimit
): Promise<RateLimitResponse> {
    try {
        // Limpiar store de memoria periódicamente
        if (!ratelimitInstance) {
            await cleanupMemoryStore();
        }

        if (ratelimitInstance && redisClient) {
            // Usar Upstash Redis (recomendado)
            const result = await ratelimitInstance.limit(identifier);

            return {
                success: result.success,
                limit: result.limit,
                remaining: result.remaining,
                reset: result.reset,
                pending: false, // Upstash doesn't provide pending in the result
            };
        } else {
            // Fallback in-memory
            const key = getMemoryKey(prefix, identifier);
            const now = Date.now();
            const windowStart = now - limits.windowMs;

            let entry = memoryStore.get(key);

            // Si la entrada no existe o ha expirado, crear nueva
            if (!entry || entry.reset <= now) {
                entry = {
                    count: 1,
                    reset: now + limits.windowMs,
                };
                memoryStore.set(key, entry);

                return {
                    success: true,
                    limit: limits.requests,
                    remaining: limits.requests - 1,
                    reset: entry.reset,
                };
            }

            // Si está dentro del límite, incrementar contador
            if (entry.count < limits.requests) {
                entry.count++;
                memoryStore.set(key, entry);

                return {
                    success: true,
                    limit: limits.requests,
                    remaining: limits.requests - entry.count,
                    reset: entry.reset,
                };
            }

            // Si se excede el límite
            return {
                success: false,
                limit: limits.requests,
                remaining: 0,
                reset: entry.reset,
            };
        }
    } catch (error) {
        logger.error(`Rate limit check failed for ${prefix}:${identifier}:`, error);
        // En caso de error, permitir el request pero logearlo
        return {
            success: true,
            limit: limits.requests,
            remaining: limits.requests,
            reset: Date.now() + limits.windowMs,
        };
    }
}

// Funciones exportadas para cada tipo de endpoint
export async function checkLoginRateLimit(
    ip: string
): Promise<RateLimitResponse> {
    return checkRateLimitWithInstance(loginRatelimit, 'login', ip, RATE_LIMITS.login);
}

export async function checkLoginPerAccountRateLimit(
    email: string
): Promise<RateLimitResponse> {
    const identifier = email.toLowerCase();
    return checkRateLimitWithInstance(loginAccountRatelimit, 'login-account', identifier, RATE_LIMITS.loginPerAccount);
}

export async function checkOAuthRateLimit(
    ip: string
): Promise<RateLimitResponse> {
    return checkRateLimitWithInstance(oauthRatelimit, 'oauth', ip, RATE_LIMITS.oauth);
}

export async function checkRegisterRateLimit(
    ip: string
): Promise<RateLimitResponse> {
    return checkRateLimitWithInstance(registerRatelimit, 'register', ip, RATE_LIMITS.register);
}

export async function checkPasswordResetRateLimit(
    ip: string
): Promise<RateLimitResponse> {
    return checkRateLimitWithInstance(passwordResetRatelimit, 'password-reset', ip, passwordResetRateLimit);
}

// Función para loggear intentos bloqueados
export function logBlockedAttempt(
    endpoint: string,
    identifier: string,
    reason: string
): void {
    logger.warn(`Rate limit blocked: ${endpoint} for ${identifier} - ${reason}`, {
        endpoint,
        identifier,
        reason,
        timestamp: new Date().toISOString(),
    });
}

// Función para obtener headers de rate limit para la respuesta
export function getRateLimitHeaders(response: RateLimitResponse): Record<string, string> {
    const now = Date.now();
    const resetTimeSeconds = Math.ceil(response.reset / 1000);
    const retryAfterSeconds = Math.max(0, Math.ceil((response.reset - now) / 1000));

    return {
        'X-RateLimit-Limit': response.limit.toString(),
        'X-RateLimit-Remaining': response.remaining.toString(),
        'X-RateLimit-Reset': resetTimeSeconds.toString(), // Epoch seconds
        'Retry-After': retryAfterSeconds.toString(), // Seconds until reset
    };
}

// Exportar configuración para ajustes manuales
export { RATE_LIMITS };

// Exportar tipos para uso en otros archivos
