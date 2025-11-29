import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Configuración de Redis (Upstash) - Solo en producción
let redis: Redis | null = null;

if (process.env.NODE_ENV === 'production' && process.env.UPSTASH_REDIS_REST_URL) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
  });
}

// Configuraciones de rate limiting por tipo de acción
const createRateLimitConfigs = () => {
  if (redis) {
    return {
      // Login attempts - más restrictivo
      login: {
        ratelimit: new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(5, '15 m'), // 5 intentos por 15 minutos
          analytics: true,
          prefix: 'ratelimit:login',
        }),
        blockDuration: 15 * 60 * 1000, // 15 minutos de bloqueo
        backoffMultiplier: 2,
      },

      // Password reset - restrictivo pero no tanto como login
      passwordReset: {
        ratelimit: new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(3, '1 h'), // 3 intentos por hora
          analytics: true,
          prefix: 'ratelimit:password_reset',
        }),
        blockDuration: 60 * 60 * 1000, // 1 hora de bloqueo
        backoffMultiplier: 2,
      },

      // Magic link requests
      magicLink: {
        ratelimit: new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(3, '5 m'), // 3 enlaces por 5 minutos
          analytics: true,
          prefix: 'ratelimit:magic_link',
        }),
        blockDuration: 5 * 60 * 1000, // 5 minutos de bloqueo
        backoffMultiplier: 1.5,
      },

      // Biometric authentication - más permisivo
      biometric: {
        ratelimit: new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(10, '15 m'), // 10 intentos por 15 minutos
          analytics: true,
          prefix: 'ratelimit:biometric',
        }),
        blockDuration: 30 * 60 * 1000, // 30 minutos de bloqueo
        backoffMultiplier: 1.5,
      },

      // OAuth authentication - específico para OAuth providers
      oauth: {
        ratelimit: new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(
            parseInt(process.env.OAUTH_RATE_LIMIT_ATTEMPTS || '10'), 
            `${process.env.OAUTH_RATE_LIMIT_WINDOW_MINUTES || '15'} m`
          ), // Configurable attempts per window
          analytics: true,
          prefix: 'ratelimit:oauth',
        }),
        blockDuration: parseInt(process.env.OAUTH_RATE_LIMIT_BLOCK_DURATION_MINUTES || '30') * 60 * 1000, // 30 minutes default block
        backoffMultiplier: 1.5,
      },

      // API general - para endpoints públicos
      api: {
        ratelimit: new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests por minuto
          analytics: true,
          prefix: 'ratelimit:api',
        }),
        blockDuration: 60 * 1000, // 1 minuto de bloqueo
        backoffMultiplier: 1.2,
      },

      // Registration attempts
      registration: {
        ratelimit: new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(3, '1 h'), // 3 registros por hora por IP
          analytics: true,
          prefix: 'ratelimit:registration',
        }),
        blockDuration: 2 * 60 * 60 * 1000, // 2 horas de bloqueo
        backoffMultiplier: 2,
      },
    } as const;
  } else {
    // Configuración simplificada para desarrollo (sin Redis)
    return {
      login: {
        ratelimit: null,
        blockDuration: 15 * 60 * 1000,
        backoffMultiplier: 2,
      },
      passwordReset: {
        ratelimit: null,
        blockDuration: 60 * 60 * 1000,
        backoffMultiplier: 2,
      },
      magicLink: {
        ratelimit: null,
        blockDuration: 5 * 60 * 1000,
        backoffMultiplier: 1.5,
      },
      biometric: {
        ratelimit: null,
        blockDuration: 30 * 60 * 1000,
        backoffMultiplier: 1.5,
      },
      oauth: {
        ratelimit: null,
        blockDuration: parseInt(process.env.OAUTH_RATE_LIMIT_BLOCK_DURATION_MINUTES || '30') * 60 * 1000,
        backoffMultiplier: 1.5,
      },
      api: {
        ratelimit: null,
        blockDuration: 60 * 1000,
        backoffMultiplier: 1.2,
      },
      registration: {
        ratelimit: null,
        blockDuration: 2 * 60 * 60 * 1000,
        backoffMultiplier: 2,
      },
    } as const;
  }
};

export const rateLimitConfigs = createRateLimitConfigs();

export type RateLimitType = keyof typeof rateLimitConfigs;

// Información de resultado del rate limiting
export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: Date;
  blocked: boolean;
  blockExpires?: Date;
  retryAfter?: number;
}

// Información de bloqueo
export interface BlockInfo {
  blocked: boolean;
  reason: string;
  expiresAt: Date;
  retryAfter: number;
}

// Clase principal para manejar rate limiting
export class RateLimiter {
  /**
   * Verifica si una acción está permitida por rate limiting
   */
  static async check(
    identifier: string,
    type: RateLimitType,
    options: {
      userId?: number;
      ip?: string;
      userAgent?: string;
      customKey?: string;
    } = {}
  ): Promise<RateLimitResult> {
    try {
      const config = rateLimitConfigs[type];
      const key = this.buildKey(identifier, type, options);

      // Verificar si está bloqueado permanentemente
      const blockInfo = await this.getBlockInfo(key, type);
      if (blockInfo.blocked) {
        return {
          success: false,
          limit: 5, // Default limit for this type
          remaining: 0,
          reset: blockInfo.expiresAt,
          blocked: true,
          blockExpires: blockInfo.expiresAt,
          retryAfter: blockInfo.retryAfter,
        };
      }

      // Si no hay Redis configurado (desarrollo), permitir todas las acciones
      if (!config.ratelimit) {
        return {
          success: true,
          limit: 100,
          remaining: 99,
          reset: new Date(Date.now() + 60000), // 1 minuto
          blocked: false,
        };
      }

      // Verificar rate limit con Upstash
      const result = await config.ratelimit.limit(key);

      // Si se excedió el límite, aplicar bloqueo
      if (!result.success) {
        await this.applyBlock(key, type, config.blockDuration);
        const blockExpires = new Date(Date.now() + config.blockDuration);

        return {
          success: false,
          limit: result.limit,
          remaining: result.remaining,
          reset: new Date(result.reset),
          blocked: true,
          blockExpires,
          retryAfter: Math.ceil(config.blockDuration / 1000),
        };
      }

      return {
        success: true,
        limit: result.limit,
        remaining: result.remaining,
        reset: new Date(result.reset),
        blocked: false,
      };
    } catch (error) {
      console.error('Rate limiting error:', error);
      // En caso de error, permitir la acción pero loggear
      return {
        success: true,
        limit: 100,
        remaining: 99,
        reset: new Date(Date.now() + 60000),
        blocked: false,
      };
    }
  }

  /**
   * Registra un evento de seguridad (login fallido, etc.)
   */
  static async recordSecurityEvent(
    identifier: string,
    type: RateLimitType,
    event: 'success' | 'failure' | 'blocked',
    metadata: Record<string, any> = {}
  ): Promise<void> {
    // En desarrollo sin Redis, solo loggear
    if (!redis) {
      console.log(`Security event [${type}]:`, { identifier, event, metadata });
      return;
    }

    try {
      const key = `security:${type}:${identifier}`;
      const eventData = {
        timestamp: new Date().toISOString(),
        event,
        ...metadata,
      };

      // Almacenar en Redis con expiración de 30 días
      await redis.lpush(key, JSON.stringify(eventData));
      await redis.expire(key, 30 * 24 * 60 * 60);

      // Mantener solo los últimos 100 eventos
      await redis.ltrim(key, 0, 99);

      // Si es un failure, incrementar contador de fallos
      if (event === 'failure') {
        const failureKey = `failures:${type}:${identifier}`;
        await redis.incr(failureKey);
        await redis.expire(failureKey, 24 * 60 * 60); // 24 horas
      }
    } catch (error) {
      console.error('Error recording security event:', error);
    }
  }

  /**
   * Obtiene estadísticas de rate limiting
   */
  static async getStats(type: RateLimitType, timeRange: '1h' | '24h' | '7d' = '24h'): Promise<{
    totalRequests: number;
    blockedRequests: number;
    uniqueIdentifiers: number;
    topIdentifiers: Array<{ identifier: string; count: number }>;
  }> {
    // En desarrollo sin Redis, retornar datos vacíos
    if (!redis) {
      return {
        totalRequests: 0,
        blockedRequests: 0,
        uniqueIdentifiers: 0,
        topIdentifiers: [],
      };
    }

    try {
      const timeRanges = {
        '1h': 60 * 60,
        '24h': 24 * 60 * 60,
        '7d': 7 * 24 * 60 * 60,
      };

      const seconds = timeRanges[timeRange];
      const pattern = `ratelimit:${type}:*`;

      // Obtener todas las keys que coinciden
      const keys = await redis.keys(pattern);

      let totalRequests = 0;
      let blockedRequests = 0;
      const identifierCounts: Record<string, number> = {};

      for (const key of keys) {
        const count = await redis.get(key);
        if (typeof count === 'number') {
          totalRequests += count;
          const identifier = key.replace(`ratelimit:${type}:`, '');
          identifierCounts[identifier] = count;
        }
      }

      // Obtener bloqueos
      const blockPattern = `block:${type}:*`;
      const blockKeys = await redis.keys(blockPattern);
      blockedRequests = blockKeys.length;

      // Top identifiers
      const topIdentifiers = Object.entries(identifierCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([identifier, count]) => ({ identifier, count }));

      return {
        totalRequests,
        blockedRequests,
        uniqueIdentifiers: Object.keys(identifierCounts).length,
        topIdentifiers,
      };
    } catch (error) {
      console.error('Error getting rate limit stats:', error);
      return {
        totalRequests: 0,
        blockedRequests: 0,
        uniqueIdentifiers: 0,
        topIdentifiers: [],
      };
    }
  }

  /**
   * Remueve un bloqueo manualmente (para administración)
   */
  static async unblock(identifier: string, type: RateLimitType): Promise<boolean> {
    // En desarrollo sin Redis, siempre retornar true
    if (!redis) {
      console.log(`Unblocked [${type}]:`, identifier);
      return true;
    }

    try {
      const key = this.buildKey(identifier, type);
      const blockKey = `block:${type}:${key}`;

      await redis.del(blockKey);
      return true;
    } catch (error) {
      console.error('Error unblocking:', error);
      return false;
    }
  }

  // Métodos privados

  private static buildKey(
    identifier: string,
    type: RateLimitType,
    options: { userId?: number; ip?: string; userAgent?: string; customKey?: string } = {}
  ): string {
    const parts = [identifier];

    if (options.userId) parts.push(`user:${options.userId}`);
    if (options.ip) parts.push(`ip:${options.ip}`);
    if (options.userAgent) parts.push(`ua:${options.userAgent}`);
    if (options.customKey) parts.push(options.customKey);

    return parts.join(':');
  }

  private static async getBlockInfo(key: string, type: RateLimitType): Promise<BlockInfo> {
    // En desarrollo sin Redis, nunca hay bloqueos
    if (!redis) {
      return { blocked: false, reason: '', expiresAt: new Date(), retryAfter: 0 };
    }

    try {
      const blockKey = `block:${type}:${key}`;
      const blockData = await redis.get(blockKey);

      if (!blockData) {
        return { blocked: false, reason: '', expiresAt: new Date(), retryAfter: 0 };
      }

      const expiresAt = new Date(blockData as number);
      const now = new Date();

      if (expiresAt <= now) {
        // Bloqueo expirado, remover
        await redis.del(blockKey);
        return { blocked: false, reason: '', expiresAt: new Date(), retryAfter: 0 };
      }

      return {
        blocked: true,
        reason: `Rate limit exceeded for ${type}`,
        expiresAt,
        retryAfter: Math.ceil((expiresAt.getTime() - now.getTime()) / 1000),
      };
    } catch (error) {
      console.error('Error getting block info:', error);
      return { blocked: false, reason: '', expiresAt: new Date(), retryAfter: 0 };
    }
  }

  private static async applyBlock(
    key: string,
    type: RateLimitType,
    duration: number
  ): Promise<void> {
    // En desarrollo sin Redis, solo loggear
    if (!redis) {
      console.log(`Applied block [${type}]:`, { key, duration });
      return;
    }

    try {
      const blockKey = `block:${type}:${key}`;
      const expiresAt = Date.now() + duration;

      await redis.setex(blockKey, Math.ceil(duration / 1000), expiresAt);

      // Log del bloqueo
      await this.recordSecurityEvent(key, type, 'blocked', {
        duration,
        expiresAt: new Date(expiresAt).toISOString(),
      });
    } catch (error) {
      console.error('Error applying block:', error);
    }
  }
}

// Funciones de conveniencia para uso común
export const checkLoginRateLimit = (identifier: string, options?: { ip?: string; userId?: number }) =>
  RateLimiter.check(identifier, 'login', options);

export const checkPasswordResetRateLimit = (identifier: string, options?: { ip?: string }) =>
  RateLimiter.check(identifier, 'passwordReset', options);

export const checkBiometricRateLimit = (identifier: string, options?: { userId?: number }) =>
  RateLimiter.check(identifier, 'biometric', options);

export const checkOAuthRateLimit = (identifier: string, options?: { ip?: string; userId?: number; provider?: string }) =>
  RateLimiter.check(identifier, 'oauth', options);

export const recordLoginFailure = (identifier: string, metadata?: Record<string, any>) =>
  RateLimiter.recordSecurityEvent(identifier, 'login', 'failure', metadata);

export const recordLoginSuccess = (identifier: string, metadata?: Record<string, any>) =>
  RateLimiter.recordSecurityEvent(identifier, 'login', 'success', metadata);