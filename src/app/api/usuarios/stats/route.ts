
import { NextResponse } from 'next/server'
import { executeQuery } from '@/lib/database'

export async function GET() {
  try {
    // Obtener estadísticas de usuarios
    const [
      totalUsuarios,
      usuariosPorEstado,
      usuariosPorRol,
      usuariosRecientes
    ] = await Promise.all([
      // Total de usuarios
      executeQuery(`
        SELECT COUNT(*) as total 
        FROM usuarios 
        WHERE deleted_at IS NULL
      `),
      
      // Usuarios por estado
      executeQuery(`
        SELECT estado, COUNT(*) as cantidad
        FROM usuarios 
        WHERE deleted_at IS NULL
        GROUP BY estado
      `),
      
      // Usuarios por rol
      executeQuery(`
        SELECT rol, COUNT(*) as cantidad
        FROM usuarios 
        WHERE deleted_at IS NULL
        GROUP BY rol
      `),
      
      // Usuarios creados en los últimos 7 días
      executeQuery(`
        SELECT COUNT(*) as recientes
        FROM usuarios 
        WHERE deleted_at IS NULL 
        AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      `)
    ])

    return NextResponse.json({
      success: true,
      stats: {
        total: (totalUsuarios[0] as any)?.total || 0,
        recientes: (usuariosRecientes[0] as any)?.recientes || 0,
        porEstado: usuariosPorEstado,
        porRol: usuariosPorRol
      },
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Error al obtener estadísticas:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error al obtener estadísticas',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
