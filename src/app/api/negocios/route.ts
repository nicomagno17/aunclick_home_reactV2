
import { NextRequest, NextResponse } from 'next/server'
import { getMySQLPool } from '@/lib/database'

// GET /api/negocios - Obtener todos los negocios
export async function GET(request: NextRequest) {
  try {
    // Obtener datos reales de la base de datos
    const pool = getMySQLPool()
    const connection = await pool.getConnection()
    
    try {
      const [rows] = await connection.execute(`
        SELECT id, nombre, slug, descripcion_corta, estado 
        FROM negocios 
        WHERE deleted_at IS NULL
        ORDER BY nombre
      `)
      
      return NextResponse.json({
        data: rows,
        total: (rows as any[]).length
      })
    } finally {
      connection.release()
    }
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
    const data = await request.json()
    console.log('Creando negocio:', data)

    // Aquí implementarías la lógica para guardar en la base de datos
    const newNegocio = {
      id: Date.now(),
      ...data,
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
