import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'
import { encrypt } from '@/lib/encryption'
import { hashPassword } from '@/lib/auth'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      // Paso 1: Información Personal
      firstName,
      lastName,
      rut,
      birthDate,
      gender,
      phone,
      region,
      commune,
      address,
      email,
      backupEmail,
      password,
      confirmPassword,
      // Paso 2: Plan
      selectedPlan,
      // Paso 3: Información del Negocio
      businessName,
      businessAddress,
      businessPhone,
      businessWhatsApp,
      businessEmail,
      businessFeature,
      acceptedTerms
    } = body

    // Validaciones básicas
    if (!email || !password || !confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'Las contraseñas no coinciden' },
        { status: 400 }
      )
    }

    // Validar que se aceptaron los términos
    if (!acceptedTerms) {
      return NextResponse.json(
        { success: false, message: 'Debes aceptar los términos y condiciones' },
        { status: 400 }
      )
    }

    // Verificar si el email ya existe
    const [existingUsers] = await db.query(
      'SELECT id FROM usuarios WHERE email = ?',
      [email]
    )

    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      return NextResponse.json(
        { success: false, message: 'El correo electrónico ya está registrado' },
        { status: 400 }
      )
    }

    // Encriptar datos sensibles
    const rutEncrypted = encrypt(rut)
    const birthDateEncrypted = encrypt(birthDate)
    const phoneEncrypted = encrypt(phone)
    const addressEncrypted = encrypt(address)

    // Hashear contraseña
    const passwordHash = await hashPassword(password)

    // Convertir plan a número
    const planMap: { [key: string]: number } = {
      gratuito: 1,
      normal: 2,
      premium: 3
    }
    const planNumero = planMap[selectedPlan?.toLowerCase()] || 1

    // Obtener IP del cliente
    const ipRegistro = request.headers.get('x-forwarded-for') ||
                       request.headers.get('x-real-ip') ||
                       'unknown'

    // Generar token de verificación
    const tokenVerificacion = crypto.randomBytes(32).toString('hex')

    // Insertar en la base de datos
    const [result] = await db.query(
      `INSERT INTO usuarios (
        email, password_hash,
        rut_encrypted, fecha_nacimiento_encrypted, telefono_personal_encrypted, direccion_personal_encrypted,
        nombre, apellidos, genero, region, comuna,
        nombre_negocio, direccion_negocio, telefono_negocio, whatsapp_negocio, email_negocio, caracteristica_negocio,
        plan, acepto_terminos, fecha_aceptacion_terminos, token_verificacion, ip_registro
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?)`,
      [
        email,
        passwordHash,
        rutEncrypted,
        birthDateEncrypted,
        phoneEncrypted,
        addressEncrypted,
        firstName,
        lastName,
        gender,
        region,
        commune,
        businessName,
        businessAddress,
        businessPhone,
        businessWhatsApp || null,
        businessEmail,
        businessFeature,
        planNumero,
        true,
        tokenVerificacion,
        ipRegistro
      ]
    )

    // Aquí puedes agregar lógica para enviar email de verificación
    // await sendVerificationEmail(email, tokenVerificacion)

    return NextResponse.json(
      {
        success: true,
        message: 'Registro exitoso',
        userId: (result as any).insertId
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error en registro:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Error al procesar el registro'
      },
      { status: 500 }
    )
  }
}
