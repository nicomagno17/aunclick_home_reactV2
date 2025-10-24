import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import logger, { correlationStorage } from './lib/logger'
import { checkLoginRateLimit, checkLoginPerAccountRateLimit, checkOAuthRateLimit, checkRegisterRateLimit, checkPasswordResetRateLimit, logBlockedAttempt, getRateLimitHeaders } from './lib/rate-limit'

// Generate a simple UUID for Edge Runtime compatibility
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export const config = {
  matcher: [
    '/api/:path*',
  ],
}

// Función para obtener la IP del cliente
function getClientIP(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    request.headers.get('x-client-ip') ??
    '127.0.0.1'
  )
}

export default withAuth(
  async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const method = request.method
    const correlationId = generateUUID()
    const startTime = Date.now()
    const clientIP = getClientIP(request)

    // Set correlation ID in a header that NextAuth can access
    request.headers.set('x-correlation-id', correlationId)
    request.headers.set('x-request-start-time', startTime.toString())

    // Lista de rutas públicas (no requieren autenticación)
    const publicRoutes = [
      '/api/auth/signin',   // NextAuth signin endpoint
      '/api/auth/signout',  // NextAuth signout endpoint
      '/api/auth/session',  // NextAuth session endpoint
      '/api/auth/callback', // NextAuth callback endpoint
      '/api/health',        // Health check
      '/api/test-db',       // Test de conexión a BD
      '/api/categorias-productos', // Categorías de productos
    ]

    // Rutas públicas por método HTTP
    const publicByMethod = {
      '/api/productos': ['GET'],           // Listado público de productos
      '/api/products': ['GET'],           // Listado público de productos (English route)
      '/api/negocios': ['GET'],          // Listado público de negocios
      '/api/planes-suscripcion': ['GET'], // Listado público de planes
      '/api/usuarios': ['POST'],          // Registro público de usuarios
      '/api/auth/password/forgot': ['POST'], // Recuperación de contraseña
      '/api/auth/password/reset': ['POST'],  // Restablecimiento de contraseña
    }

    // Verificar si la ruta es completamente pública
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
    if (isPublicRoute) {
      return correlationStorage.run(
        { correlationId, endpoint: pathname, method },
        async () => {
          try {
            // Log incoming request
            await logger.logRequest(method, pathname, Object.fromEntries(request.nextUrl.searchParams))

            const response = NextResponse.next()
            response.headers.set('X-Correlation-ID', correlationId)

            // Log response for public route
            const duration = Date.now() - startTime
            await logger.logResponse(method, pathname, 200, duration, { correlationId })

            return response
          } catch (error) {
            const response = NextResponse.next()
            response.headers.set('X-Correlation-ID', correlationId)
            return response
          }
        }
      )
    }

    // Verificar si la ruta es pública por método HTTP
    for (const [route, allowedMethods] of Object.entries(publicByMethod)) {
      if (pathname.startsWith(route) && allowedMethods.includes(method)) {
        return correlationStorage.run(
          { correlationId, endpoint: pathname, method },
          async () => {
            try {
              // Log incoming request
              await logger.logRequest(method, pathname, Object.fromEntries(request.nextUrl.searchParams))

              const response = NextResponse.next()
              response.headers.set('X-Correlation-ID', correlationId)

              // Log response for public route by method
              const duration = Date.now() - startTime
              await logger.logResponse(method, pathname, 200, duration, { correlationId })

              return response
            } catch (error) {
              const response = NextResponse.next()
              response.headers.set('X-Correlation-ID', correlationId)
              return response
            }
          }
        )
      }
    }

    // Rate limiting para rutas sensibles
    let rateLimitResponse: any = null

    // Verificar rate limiting para login (solo IP-based)
    if (pathname.startsWith('/api/auth/signin')) {
      rateLimitResponse = await checkLoginRateLimit(clientIP)
      if (!rateLimitResponse.success) {
        logBlockedAttempt('login', clientIP, 'Rate limit exceeded (IP only)')

        const response = NextResponse.json(
          { error: 'Demasiados intentos. Intenta de nuevo más tarde.' },
          { status: 429 }
        )

        // Agregar headers de rate limit
        const rateLimitHeaders = getRateLimitHeaders(rateLimitResponse)
        Object.entries(rateLimitHeaders).forEach(([key, value]) => {
          response.headers.set(key, value)
        })

        response.headers.set('X-Correlation-ID', correlationId)
        return response
      }
    }

    // Verificar rate limiting para OAuth callbacks
    if (pathname.startsWith('/api/auth/callback')) {
      rateLimitResponse = await checkOAuthRateLimit(clientIP)
      if (!rateLimitResponse.success) {
        logBlockedAttempt('oauth', clientIP, 'Rate limit exceeded')

        const response = NextResponse.json(
          { error: 'Demasiados intentos de OAuth. Intenta de nuevo más tarde.' },
          { status: 429 }
        )

        // Agregar headers de rate limit
        const rateLimitHeaders = getRateLimitHeaders(rateLimitResponse)
        Object.entries(rateLimitHeaders).forEach(([key, value]) => {
          response.headers.set(key, value)
        })

        response.headers.set('X-Correlation-ID', correlationId)
        return response
      }
    }

    // Verificar rate limiting para registro
    if (pathname === '/api/usuarios' && method === 'POST') {
      rateLimitResponse = await checkRegisterRateLimit(clientIP)
      if (!rateLimitResponse.success) {
        logBlockedAttempt('register', clientIP, 'Rate limit exceeded')

        const response = NextResponse.json(
          { error: 'Demasiados intentos de registro. Intenta de nuevo más tarde.' },
          { status: 429 }
        )

        // Agregar headers de rate limit
        const rateLimitHeaders = getRateLimitHeaders(rateLimitResponse)
        Object.entries(rateLimitHeaders).forEach(([key, value]) => {
          response.headers.set(key, value)
        })

        response.headers.set('X-Correlation-ID', correlationId)
        return response
      }
    }

    // Verificar rate limiting para recuperación de contraseña
    if (pathname === '/api/auth/password/forgot' && method === 'POST') {
      rateLimitResponse = await checkPasswordResetRateLimit(clientIP)
      if (!rateLimitResponse.success) {
        logBlockedAttempt('password-forgot', clientIP, 'Rate limit exceeded')

        const response = NextResponse.json(
          { error: 'Demasiados intentos de recuperación. Intenta de nuevo más tarde.' },
          { status: 429 }
        )

        // Agregar headers de rate limit
        const rateLimitHeaders = getRateLimitHeaders(rateLimitResponse)
        Object.entries(rateLimitHeaders).forEach(([key, value]) => {
          response.headers.set(key, value)
        })

        response.headers.set('X-Correlation-ID', correlationId)
        return response
      }
    }

    // Verificar rate limiting para restablecimiento de contraseña
    if (pathname === '/api/auth/password/reset' && method === 'POST') {
      rateLimitResponse = await checkPasswordResetRateLimit(clientIP)
      if (!rateLimitResponse.success) {
        logBlockedAttempt('password-reset', clientIP, 'Rate limit exceeded')

        const response = NextResponse.json(
          { error: 'Demasiados intentos de restablecimiento. Intenta de nuevo más tarde.' },
          { status: 429 }
        )

        // Agregar headers de rate limit
        const rateLimitHeaders = getRateLimitHeaders(rateLimitResponse)
        Object.entries(rateLimitHeaders).forEach(([key, value]) => {
          response.headers.set(key, value)
        })

        response.headers.set('X-Correlation-ID', correlationId)
        return response
      }
    }

    // For protected routes, let NextAuth handle authentication
    // The response will be handled in the authorization callback
    const response = NextResponse.next()
    response.headers.set('X-Correlation-ID', correlationId)
    response.headers.set('X-Request-Start-Time', startTime.toString())

    // Agregar headers de rate limit si se verificó
    if (rateLimitResponse) {
      const rateLimitHeaders = getRateLimitHeaders(rateLimitResponse)
      Object.entries(rateLimitHeaders).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
    }

    return response
  },
  {
    callbacks: {
      authorized: async ({ token, req }) => {
        const { pathname } = req.nextUrl
        const method = req.method
        const correlationId = req.headers.get('x-correlation-id') || 'unknown'
        const startTime = req.headers.get('x-request-start-time') || '0'

        // Set correlation context for logging
        return correlationStorage.run(
          { correlationId, endpoint: pathname, method, userId: token?.id?.toString() },
          async () => {
            // Lista de rutas públicas (no requieren autenticación)
            const publicRoutes = [
              '/api/auth/signin',
              '/api/auth/signout',
              '/api/auth/session',
              '/api/auth/callback',
              '/api/health',
              '/api/test-db',
              '/api/categorias-productos',
            ]

            // Rutas públicas por método HTTP
            const publicByMethod = {
              '/api/productos': ['GET'],
              '/api/products': ['GET'],    // English route
              '/api/negocios': ['GET'],
              '/api/planes-suscripcion': ['GET'],
              '/api/usuarios': ['POST'],
              '/api/auth/password/forgot': ['POST'], // Recuperación de contraseña
              '/api/auth/password/reset': ['POST'],  // Restablecimiento de contraseña
            }

            // Verificar si la ruta es completamente pública
            const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
            if (isPublicRoute) {
              return true
            }

            // Verificar si la ruta es pública por método HTTP
            for (const [route, allowedMethods] of Object.entries(publicByMethod)) {
              if (pathname.startsWith(route) && allowedMethods.includes(method)) {
                return true
              }
            }

            // Para rutas protegidas, requerir token
            if (!token) {
              await logger.warn('Unauthorized access attempt - no token', {
                correlationId,
                endpoint: pathname,
                method,
                type: 'unauthorized_attempt'
              })

              const duration = Date.now() - parseInt(startTime)
              await logger.logResponse(method, pathname, 401, duration, { correlationId })

              return false
            }

            return true
          }
        )
      },
    },
    pages: {
      signIn: '/login',
    },
  }
)