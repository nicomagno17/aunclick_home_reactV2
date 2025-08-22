
import { NextResponse } from 'next/server'
import { executeQuery } from '@/lib/database'

export async function GET() {
  try {
    // Consultar usuarios de la base de datos
    const usuarios = await executeQuery(`
      SELECT 
        id,
        uuid,
        email,
        nombre,
        apellidos,
        telefono,
        estado,
        rol,
        email_verificado_at,
        ultimo_acceso,
        created_at,
        updated_at
      FROM usuarios 
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
      LIMIT 50
    `)

    return NextResponse.json({
      success: true,
      usuarios,
      total: usuarios.length,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Error al obtener usuarios:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido al obtener usuarios',
      usuarios: [],
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, nombre, apellidos, telefono, password_hash, rol = 'usuario' } = body

    if (!email || !nombre || !password_hash) {
      return NextResponse.json({
        success: false,
        error: 'Email, nombre y password_hash son requeridos'
      }, { status: 400 })
    }

    // Insertar nuevo usuario
    const result = await executeQuery(`
      INSERT INTO usuarios (email, nombre, apellidos, telefono, password_hash, rol, estado)
      VALUES (?, ?, ?, ?, ?, ?, 'pendiente_verificacion')
    `, [email, nombre, apellidos, telefono, password_hash, rol])

    return NextResponse.json({
      success: true,
      message: 'Usuario creado exitosamente',
      userId: (result as any).insertId,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Error al crear usuario:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido al crear usuario',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
