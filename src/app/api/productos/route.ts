
import { NextRequest, NextResponse } from 'next/server'

// GET /api/productos - Obtener todos los productos
export async function GET(request: NextRequest) {
  try {
    // Simulando datos de productos por ahora
    const productos = [
      { id: 1, nombre: 'Producto Demo 1', precio: 100, categoria_id: 1, negocio_id: 1 },
      { id: 2, nombre: 'Producto Demo 2', precio: 200, categoria_id: 2, negocio_id: 1 },
      { id: 3, nombre: 'Producto Demo 3', precio: 150, categoria_id: 1, negocio_id: 2 }
    ]

    return NextResponse.json({
      data: productos,
      total: productos.length
    })
  } catch (error) {
    console.error('Error al obtener productos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST /api/productos - Crear nuevo producto
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    console.log('Creando producto:', data)

    // Validaciones básicas
    if (!data.nombre || !data.negocio_id || !data.categoria_id) {
      return NextResponse.json(
        { error: 'Los campos nombre, negocio_id y categoria_id son requeridos' },
        { status: 400 }
      )
    }

    // Aquí implementarías la lógica para guardar en la base de datos
    const newProducto = {
      id: Date.now(),
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    return NextResponse.json(newProducto, { status: 201 })
  } catch (error) {
    console.error('Error al crear producto:', error)
    return NextResponse.json(
      { error: 'Error al crear el producto' },
      { status: 500 }
    )
  }
}
