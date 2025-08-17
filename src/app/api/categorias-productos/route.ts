
import { NextRequest, NextResponse } from 'next/server'
import { getMySQLPool } from '@/lib/database'

// GET /api/categorias-productos - Obtener todas las categorías de productos
export async function GET(request: NextRequest) {
  try {
    // Obtener datos reales de la base de datos
    const pool = getMySQLPool()
    const connection = await pool.getConnection()
    
    try {
      const [rows] = await connection.execute(`
        SELECT id, nombre, slug, descripcion 
        FROM categorias_productos 
        WHERE activo = 1
        ORDER BY orden, nombre
      `)
      
      return NextResponse.json({
        data: rows,
        total: (rows as any[]).length
      })
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error('Error al obtener categorías de productos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST /api/categorias-productos - Crear nueva categoría de producto
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    console.log('Creando categoría de producto:', data)

    // Aquí implementarías la lógica para guardar en la base de datos
    const newCategoria = {
      id: Date.now(),
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    return NextResponse.json(newCategoria, { status: 201 })
  } catch (error) {
    console.error('Error al crear categoría de producto:', error)
    return NextResponse.json(
      { error: 'Error al crear la categoría' },
      { status: 500 }
    )
  }
}
