import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
  matcher: [
    '/api/:path*',
  ],
}

export default withAuth(
  function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const method = request.method
    
    // Lista de rutas públicas (no requieren autenticación)
    const publicRoutes = [
      '/api/auth',          // Endpoints de NextAuth (signin, signout, session, etc.)
      '/api/health',        // Health check
      '/api/test-db',       // Test de conexión a BD
      '/api/categorias-productos', // Categorías de productos
    ]
    
    // Rutas públicas por método HTTP
    const publicByMethod = {
      '/api/productos': ['GET'],           // Listado público de productos
      '/api/products': ['GET'],            // Listado público de productos (datos de prueba)
      '/api/negocios': ['GET'],          // Listado público de negocios
      '/api/planes-suscripcion': ['GET'], // Listado público de planes
      '/api/usuarios': ['POST'],          // Registro público de usuarios
    }
    
    // Verificar si la ruta es completamente pública
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
    if (isPublicRoute) {
      return NextResponse.next()
    }
    
    // Verificar si la ruta es pública por método HTTP
    for (const [route, allowedMethods] of Object.entries(publicByMethod)) {
      if (pathname.startsWith(route) && allowedMethods.includes(method)) {
        return NextResponse.next()
      }
    }
    
    // Si llegamos aquí, la ruta requiere autenticación
    // withAuth ya maneja la redirección si no hay token
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        const method = req.method
        
        // Lista de rutas públicas (no requieren autenticación)
        const publicRoutes = [
          '/api/auth',
          '/api/health',
          '/api/test-db',
          '/api/categorias-productos',
        ]
        
        // Rutas públicas por método HTTP
        const publicByMethod = {
          '/api/productos': ['GET'],
          '/api/products': ['GET'],
          '/api/negocios': ['GET'],
          '/api/planes-suscripcion': ['GET'],
          '/api/usuarios': ['POST'],
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
        return !!token
      },
    },
    pages: {
      signIn: '/login',
    },
  }
)