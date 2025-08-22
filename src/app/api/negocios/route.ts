
import { NextRequest, NextResponse } from 'next/server'

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
