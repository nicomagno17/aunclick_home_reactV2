
import { NextResponse } from 'next/server'
import { executeQuery } from '@/lib/database'
import { createUsuarioSchema } from '@/schemas'
import { ZodError } from 'zod'
import { requireRole, handleAuthError } from '@/lib/auth-helpers'

export async function GET() {
  // Verificar autorización - solo admin y moderadores pueden ver lista de usuarios
  const authResult = await requireRole(['admin', 'moderador'])
  const authError = handleAuthError(authResult)
  if (authError) return authError

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
      error: 'Error al obtener usuarios',
      usuarios: [],
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validar datos con Zod
    const validation = createUsuarioSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'Datos de entrada inválidos',
        details: validation.error.format()
      }, { status: 400 })
    }
    
    const validatedData = validation.data

// Insertar nuevo usuario con datos validados y sanitizados
    // Forzar rol = 'usuario' para registro público (previene que usuarios se asignen roles especiales)
    const result = await executeQuery(`
      INSERT INTO usuarios (email, nombre, apellidos, telefono, password_hash, rol, estado, preferencias, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      validatedData.email,
      validatedData.nombre,
      validatedData.apellidos || null,
      validatedData.telefono || null,
      validatedData.password_hash,
      'usuario', // Forzar rol de usuario normal para registro público
      'pendiente_verificacion', // Forzar estado pendiente de verificación
      JSON.stringify(validatedData.preferencias || {}),
      JSON.stringify(validatedData.metadata || {})
    ])

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
      error: 'Error al crear usuario',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
