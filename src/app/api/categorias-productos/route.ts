
import { NextRequest, NextResponse } from 'next/server'

// GET /api/categorias-productos - Obtener todas las categorías de productos
export async function GET(request: NextRequest) {
  try {
    // Simulando datos de categorías por ahora
    const categorias = [
      { id: 1, nombre: 'Electrónicos' },
      { id: 2, nombre: 'Ropa y Accesorios' },
      { id: 3, nombre: 'Hogar y Jardín' },
      { id: 4, nombre: 'Deportes' },
      { id: 5, nombre: 'Libros' }
    ]

    return NextResponse.json({
      data: categorias,
      total: categorias.length
    })
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
