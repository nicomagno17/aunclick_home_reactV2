
import { NextRequest, NextResponse } from 'next/server'
import { getSession, requireRole, checkNegociosLimit, handleAuthError } from '@/lib/auth-helpers'

// GET /api/negocios - Obtener todos los negocios
export async function GET(request: NextRequest) {
  try {
    // Simulando datos de negocios por ahora
    const negocios = [
      { id: 1, nombre: 'Negocio Demo 1' },
      { id: 2, nombre: 'Negocio Demo 2' },
      { id: 3, nombre: 'Negocio Demo 3' }
    ]

    return NextResponse.json({
      data: negocios,
      total: negocios.length
    })
  } catch (error) {
    console.error('Error al obtener negocios:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST /api/negocios - Crear nuevo negocio
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Autenticación requerida' },
        { status: 401 }
      )
    }

    // Verificar que el usuario tiene rol adecuado
    if (!['propietario_negocio', 'admin'].includes(session.user?.rol)) {
      return NextResponse.json(
        { error: 'Necesitas ser propietario de negocio para crear un negocio' },
        { status: 403 }
      )
    }

    // Si no es admin, verificar límite de negocios
    if (session.user.rol !== 'admin') {
      const limitResult = await checkNegociosLimit(session)
      if (!limitResult.success) {
        // Type assertion explícita para TypeScript
        const errorResult = limitResult as { success: false; error: string; status: number }
        return NextResponse.json(
          { error: errorResult.error },
          { status: errorResult.status }
        )
      }

      if (limitResult.data) {
        return NextResponse.json(
          { error: 'Has alcanzado el límite de negocios de tu plan' },
          { status: 403 }
        )
      }
    }

    const data = await request.json()
    console.log('Creando negocio:', data)

    // Aquí implementarías la lógica para guardar en la base de datos
    // Si el usuario es propietario_negocio, forzar propietario_id = session.user.id
    // Si el usuario es admin, permitir especificar propietario_id
    const newNegocio = {
      id: Date.now(),
      ...data,
      propietario_id: session.user.rol === 'admin' ? data.propietario_id : session.user.id,
      estado: 'borrador', // Estado inicial para nuevos negocios
      verificado: false, // Solo admins pueden verificar
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    return NextResponse.json(newNegocio, { status: 201 })
  } catch (error) {
    console.error('Error al crear negocio:', error)
    return NextResponse.json(
      { error: 'Error al crear el negocio' },
      { status: 500 }
    )
  }
}
