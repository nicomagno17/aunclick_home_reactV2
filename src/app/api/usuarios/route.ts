
import { NextResponse } from 'next/server'
import { executeQuery, executeQuerySingle, insertAndGetId } from '@/lib/database'
import { createUsuarioSchema } from '@/schemas'
import { ZodError } from 'zod'
import { requireRole, handleAuthError } from '@/lib/auth-helpers'
import logger, { setCorrelationContextFromRequest } from '@/lib/logger'
import { handleError, validationError, successResponse } from '@/lib/error-handler'
import bcrypt from 'bcrypt'

export async function GET(request: Request) {
  // Set correlation context from request headers
  setCorrelationContextFromRequest(request)

  // Verificar autorización - solo admin y moderadores pueden ver lista de usuarios
  const authResult = await requireRole(['admin', 'moderador'])
  const authError = handleAuthError(authResult)
  if (authError) return authError

  try {
    await logger.info('Fetching users list', { endpoint: '/api/usuarios', method: 'GET' })

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

    await logger.info(`Retrieved ${usuarios.length} users`, { endpoint: '/api/usuarios', count: usuarios.length })

    return successResponse({ usuarios, total: usuarios.length })

  } catch (error) {
    return handleError(error as Error, { endpoint: '/api/usuarios', method: 'GET' })
  }
}

export async function POST(request: Request) {
  try {
    // Set correlation context from request headers
    setCorrelationContextFromRequest(request)

    const body = await request.json()

    await logger.debug('Creating new user', { endpoint: '/api/usuarios', method: 'POST', email: body.email })

    // Validar datos con Zod
    const validation = createUsuarioSchema.safeParse(body)

    if (!validation.success) {
      return validationError('Datos de entrada inválidos', validation.error.format(), { endpoint: '/api/usuarios', method: 'POST' })
    }

    const validatedData = validation.data

    // Check for duplicate email
    const existingUser = await executeQuerySingle(
      'SELECT id FROM usuarios WHERE email = ? AND deleted_at IS NULL',
      [validatedData.email]
    )

    if (existingUser) {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 409 }
      )
    }

    // Validate password complexity server-side (same rules as Zod schema)
    const passwordRegex = {
      minLength: /.{8,}/,
      hasUpperCase: /[A-Z]/,
      hasNumber: /[0-9]/,
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/
    }

    if (!passwordRegex.minLength.test(validatedData.password)) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 8 caracteres' },
        { status: 400 }
      )
    }

    if (!passwordRegex.hasUpperCase.test(validatedData.password)) {
      return NextResponse.json(
        { error: 'La contraseña debe contener al menos una letra mayúscula' },
        { status: 400 }
      )
    }

    if (!passwordRegex.hasNumber.test(validatedData.password)) {
      return NextResponse.json(
        { error: 'La contraseña debe contener al menos un número' },
        { status: 400 }
      )
    }

    if (!passwordRegex.hasSpecialChar.test(validatedData.password)) {
      return NextResponse.json(
        { error: 'La contraseña debe contener al menos un carácter especial' },
        { status: 400 }
      )
    }

    // Hash the password with configurable cost
    const bcryptCost = parseInt(process.env.BCRYPT_COST ?? '12')
    const passwordHash = await bcrypt.hash(validatedData.password, bcryptCost)

    // Insertar nuevo usuario con datos validados y sanitizados
    // Forzar rol = 'usuario' para registro público (previene que usuarios se asignen roles especiales)
    const userId = await insertAndGetId(`
      INSERT INTO usuarios (email, nombre, apellidos, telefono, password_hash, rol, estado, preferencias, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      validatedData.email,
      validatedData.nombre,
      validatedData.apellidos || null,
      validatedData.telefono || null,
      passwordHash, // Use hashed password
      'usuario', // Forzar rol de usuario normal para registro público
      'pendiente_verificacion', // Forzar estado pendiente de verificación
      JSON.stringify(validatedData.preferencias || {}),
      JSON.stringify(validatedData.metadata || {})
    ])
    await logger.info('User created successfully', { endpoint: '/api/usuarios', method: 'POST', userId: String(userId), email: validatedData.email })

    return successResponse({ message: 'Usuario creado exitosamente', userId }, 201)

  } catch (error) {
    return handleError(error as Error, { endpoint: '/api/usuarios', method: 'POST' })
  }
}
