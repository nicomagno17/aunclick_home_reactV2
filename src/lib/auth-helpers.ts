import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { executeQuerySingle } from '@/lib/database'
import { NextResponse } from 'next/server'

// Tipo para respuestas de autenticación
export type AuthResult<T = any> = 
  | { success: true; data: T }
  | { success: false; error: string; status: number }

// Obtener sesión actual
export const getSession = () => getServerSession(authOptions)

// Requerir autenticación
export const requireAuth = async (): Promise<AuthResult<any>> => {
  const session = await getSession()
  
  if (!session) {
    return {
      success: false,
      error: 'Autenticación requerida',
      status: 401
    }
  }
  
  return {
    success: true,
    data: session
  }
}

// Requerir roles específicos
export const requireRole = async (allowedRoles: string[]): Promise<AuthResult<any>> => {
  const authResult = await requireAuth()
  
  if (!authResult.success) {
    return authResult
  }
  
  const session = authResult.data
  
  if (!session.user?.rol || !allowedRoles.includes(session.user.rol)) {
    return {
      success: false,
      error: 'No tienes permisos para acceder a este recurso',
      status: 403
    }
  }
  
  return {
    success: true,
    data: session
  }
}

// Verificar si es admin
export const isAdmin = (session: any): boolean => {
  return session?.user?.rol === 'admin'
}

// Verificar si es propietario de negocio
export const isPropietarioNegocio = (session: any): boolean => {
  return session?.user?.rol === 'propietario_negocio'
}

// Verificar si el usuario puede acceder a un negocio específico
export const canAccessNegocio = async (session: any, negocioId: number): Promise<boolean> => {
  if (!session || !session.user) {
    return false
  }
  
  // Admin tiene acceso a todos los negocios
  if (isAdmin(session)) {
    return true
  }
  
  // Verificar si el negocio pertenece al propietario
  try {
    const negocio = await executeQuerySingle(
      'SELECT id FROM negocios WHERE id = ? AND propietario_id = ? AND deleted_at IS NULL',
      [negocioId, session.user.id]
    )
    
    return !!negocio
  } catch (error) {
    console.error('Error verificando acceso a negocio:', error)
    return false
  }
}

// Verificar si el usuario puede acceder a un producto específico
export const canAccessProducto = async (session: any, productoId: number): Promise<boolean> => {
  if (!session || !session.user) {
    return false
  }
  
  // Admin tiene acceso a todos los productos
  if (isAdmin(session)) {
    return true
  }
  
  // Verificar si el producto pertenece a un negocio del propietario
  try {
    const producto = await executeQuerySingle(
      `SELECT p.id 
       FROM productos p 
       JOIN negocios n ON p.negocio_id = n.id 
       WHERE p.id = ? AND n.propietario_id = ? AND p.deleted_at IS NULL`,
      [productoId, session.user.id]
    )
    
    return !!producto
  } catch (error) {
    console.error('Error verificando acceso a producto:', error)
    return false
  }
}

// Crear respuesta de error de autenticación consistente
export const createAuthResponse = (status: number, message: string) => {
  return NextResponse.json({ error: message }, { status })
}

// Verificar si el usuario ha alcanzado el límite de negocios
export const checkNegociosLimit = async (session: any): Promise<AuthResult<boolean>> => {
  if (isAdmin(session)) {
    // Admins no tienen límite
    return { success: true, data: false }
  }
  
  try {
    // Obtener el plan del usuario
    const usuario = await executeQuerySingle(
      `SELECT p.max_negocios 
       FROM usuarios u 
       LEFT JOIN planes_suscripcion p ON u.plan_id = p.id 
       WHERE u.id = ?`,
      [session.user.id]
    )
    
    if (!usuario || !usuario.max_negocios) {
      return {
        success: false,
        error: 'No se pudo verificar el límite de negocios',
        status: 500
      }
    }
    
    // Contar negocios actuales
    const countResult = await executeQuerySingle(
      'SELECT COUNT(*) as count FROM negocios WHERE propietario_id = ? AND deleted_at IS NULL',
      [session.user.id]
    )
    
    const currentCount = countResult?.count || 0
    const maxNegocios = usuario.max_negocios
    
    return {
      success: true,
      data: currentCount >= maxNegocios
    }
  } catch (error) {
    console.error('Error verificando límite de negocios:', error)
    return {
      success: false,
      error: 'Error al verificar límite de negocios',
      status: 500
    }
  }
}

// Helper para manejar errores de autenticación en endpoints
export const handleAuthError = (authResult: AuthResult<any>) => {
  if (!authResult.success) {
    return createAuthResponse(authResult.status, authResult.error)
  }
  return null
}