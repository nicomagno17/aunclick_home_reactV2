import { NextRequest, NextResponse } from 'next/server';
import { RateLimiter, type RateLimitType } from '@/lib/rate-limiting';

// Configuración de rate limiting por ruta
const routeRateLimits: Record<string, { type: RateLimitType; identifier: 'ip' | 'user' | 'custom' }> = {
  // Auth endpoints
  '/api/auth/signin': { type: 'login', identifier: 'ip' },
  '/api/auth/register': { type: 'registration', identifier: 'ip' },
  '/api/auth/password/forgot': { type: 'passwordReset', identifier: 'ip' },
  '/api/auth/password/reset': { type: 'passwordReset', identifier: 'ip' },

  // Biometric endpoints
  '/api/auth/biometric/register': { type: 'biometric', identifier: 'user' },
  '/api/auth/biometric/verify': { type: 'biometric', identifier: 'user' },
  '/api/auth/biometric/challenge': { type: 'biometric', identifier: 'ip' },

  // Magic link
  '/api/auth/magic-link': { type: 'magicLink', identifier: 'ip' },

  // General API protection
  '/api/': { type: 'api', identifier: 'ip' },
};

// Función para extraer identificador basado en el tipo
function getIdentifier(
  request: NextRequest,
  type: 'ip' | 'user' | 'custom',
  route: string
): string {
  switch (type) {
    case 'ip':
      // Obtener IP real (considerando proxies)
      const forwarded = request.headers.get('x-forwarded-for');
      const realIp = request.headers.get('x-real-ip');
      const clientIp = request.headers.get('x-client-ip');

      return forwarded?.split(',')[0]?.trim() ||
             realIp ||
             clientIp ||
             'unknown';

    case 'user':
      // Para rutas que requieren usuario autenticado
      // El user ID se obtiene del token/session en el endpoint
      return request.headers.get('x-user-id') || 'anonymous';

    case 'custom':
      // Para lógica personalizada por ruta
      if (route.includes('/auth/')) {
        return getIdentifier(request, 'ip', route);
      }
      return 'default';

    default:
      return 'unknown';
  }
}

// Función para determinar si una ruta debe tener rate limiting
function shouldRateLimit(pathname: string): { type: RateLimitType; identifier: 'ip' | 'user' | 'custom' } | null {
  // Verificar rutas exactas primero
  if (routeRateLimits[pathname]) {
    return routeRateLimits[pathname];
  }

  // Verificar patrones (ej: /api/*)
  for (const [pattern, config] of Object.entries(routeRateLimits)) {
    if (pattern.endsWith('/') && pathname.startsWith(pattern)) {
      return config;
    }
  }

  return null;
}

// Headers de rate limiting (RFC 6585)
function createRateLimitHeaders(result: any): Record<string, string> {
  const headers: Record<string, string> = {};

  if (result.limit) {
    headers['X-RateLimit-Limit'] = result.limit.toString();
  }

  if (result.remaining !== undefined) {
    headers['X-RateLimit-Remaining'] = result.remaining.toString();
  }

  if (result.reset) {
    headers['X-RateLimit-Reset'] = Math.floor(result.reset.getTime() / 1000).toString();
  }

  if (result.retryAfter) {
    headers['Retry-After'] = result.retryAfter.toString();
  }

  return headers;
}

// Middleware principal de rate limiting
export async function rateLimitMiddleware(request: NextRequest): Promise<NextResponse | null> {
  const { pathname } = new URL(request.url);

  // Solo aplicar a rutas de API
  if (!pathname.startsWith('/api/')) {
    return null;
  }

  // Verificar si la ruta requiere rate limiting
  const rateLimitConfig = shouldRateLimit(pathname);
  if (!rateLimitConfig) {
    return null;
  }

  try {
    // Obtener identificador
    const identifier = getIdentifier(request, rateLimitConfig.identifier, pathname);

    // Verificar rate limit
    const result = await RateLimiter.check(identifier, rateLimitConfig.type, {
      ip: request.headers.get('x-forwarded-for') || undefined,
      userAgent: request.headers.get('user-agent'),
    });

    // Headers de rate limiting
    const rateLimitHeaders = createRateLimitHeaders(result);

    // Si está bloqueado, devolver error 429
    if (result.blocked) {
      // Registrar evento de seguridad
      await RateLimiter.recordSecurityEvent(identifier, rateLimitConfig.type, 'blocked', {
        pathname,
        userAgent: request.headers.get('user-agent'),
        ip: identifier,
      });

      return new NextResponse(
        JSON.stringify({
          error: 'Too Many Requests',
          message: 'Has excedido el límite de solicitudes. Inténtalo de nuevo más tarde.',
          retryAfter: result.retryAfter,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            ...rateLimitHeaders,
          },
        }
      );
    }

    // Si la verificación fue exitosa, continuar pero agregar headers
    // Nota: En Next.js middleware, no podemos modificar la respuesta directamente,
    // pero podemos devolver una respuesta con headers que serán agregados
    const response = NextResponse.next();
    Object.entries(rateLimitHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;

  } catch (error) {
    console.error('Rate limiting middleware error:', error);

    // En caso de error, permitir la solicitud pero loggear
    return NextResponse.next();
  }
}

// Función helper para usar en API routes individuales
export async function checkEndpointRateLimit(
  request: NextRequest,
  type: RateLimitType,
  options: {
    identifier?: string;
    userId?: number;
    customKey?: string;
  } = {}
): Promise<{ allowed: boolean; response?: NextResponse; headers?: Record<string, string> }> {
  try {
    const identifier = options.identifier ||
                      options.userId?.toString() ||
                      getIdentifier(request, 'ip', request.url);

    const result = await RateLimiter.check(identifier, type, {
      ip: request.headers.get('x-forwarded-for') || undefined,
      userId: options.userId,
      customKey: options.customKey,
    });

    const headers = createRateLimitHeaders(result);

    if (result.blocked) {
      // Registrar evento de seguridad
      await RateLimiter.recordSecurityEvent(identifier, type, 'blocked', {
        endpoint: request.url,
        method: request.method,
        userAgent: request.headers.get('user-agent'),
      });

      const response = new NextResponse(
        JSON.stringify({
          error: 'Too Many Requests',
          message: 'Demasiadas solicitudes. Inténtalo de nuevo más tarde.',
          retryAfter: result.retryAfter,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
        }
      );

      return { allowed: false, response, headers };
    }

    return { allowed: true, headers };

  } catch (error) {
    console.error('Endpoint rate limiting error:', error);
    // En caso de error, permitir la solicitud
    return { allowed: true };
  }
}

// Función para registrar eventos de seguridad en endpoints
export async function recordSecurityEvent(
  identifier: string,
  type: RateLimitType,
  event: 'success' | 'failure',
  metadata: Record<string, any> = {}
): Promise<void> {
  await RateLimiter.recordSecurityEvent(identifier, type, event, metadata);
}