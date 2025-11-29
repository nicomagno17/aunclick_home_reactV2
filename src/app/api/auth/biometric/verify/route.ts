import { NextRequest, NextResponse } from 'next/server';
import { signIn } from 'next-auth/react';
import { verifyBiometricAuthentication } from '@/lib/webauthn-helpers';
import { executeQuerySingle } from '@/lib/database';
import { createAuthResponse } from '@/lib/auth-helpers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.response || !body.response.id) {
      return createAuthResponse(400, 'Respuesta de autenticación biométrica requerida');
    }

    // Obtener el usuario por la credencial
    const credential = await executeQuerySingle(
      'SELECT user_id FROM biometric_credentials WHERE credential_id = ?',
      [body.response.id]
    );

    if (!credential) {
      return createAuthResponse(400, 'Credencial biométrica no encontrada');
    }

    const userId = credential.user_id;

    // Verificar la autenticación biométrica
    const verification = await verifyBiometricAuthentication(userId, body.response);

    if (!verification.verified) {
      return createAuthResponse(400, 'Verificación biométrica fallida');
    }

    // Obtener información del usuario para el login
    const user = await executeQuerySingle(
      'SELECT id, email, nombre, rol FROM usuarios WHERE id = ? AND deleted_at IS NULL',
      [userId]
    );

    if (!user) {
      return createAuthResponse(400, 'Usuario no encontrado');
    }

    // Crear sesión usando NextAuth (esto requiere configuración adicional)
    // Por ahora, devolver éxito y dejar que el frontend maneje el login
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.nombre,
        role: user.rol
      },
      message: 'Autenticación biométrica exitosa'
    });

  } catch (error) {
    console.error('Error verifying biometric authentication:', error);
    return createAuthResponse(500, 'Error interno del servidor');
  }
}