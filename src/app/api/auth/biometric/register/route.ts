import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { generateBiometricRegistrationOptions, verifyBiometricRegistration } from '@/lib/webauthn-helpers';
import { createAuthResponse } from '@/lib/auth-helpers';

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación del usuario
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session?.user?.email) {
      return createAuthResponse(401, 'Usuario no autenticado');
    }

    const userId = typeof session.user.id === 'string' ? parseInt(session.user.id) : session.user.id;
    const userEmail = session.user.email;

    // Generar opciones de registro
    const options = await generateBiometricRegistrationOptions(userId, userEmail);

    return NextResponse.json(options);
  } catch (error) {
    console.error('Error generating biometric registration options:', error);
    return createAuthResponse(500, 'Error interno del servidor');
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Verificar autenticación del usuario
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return createAuthResponse(401, 'Usuario no autenticado');
    }

    const userId = typeof session.user.id === 'string' ? parseInt(session.user.id) : session.user.id;
    const body = await request.json();

    if (!body.response) {
      return createAuthResponse(400, 'Respuesta de registro requerida');
    }

    // Verificar la respuesta de registro
    const verification = await verifyBiometricRegistration(userId, body.response);

    if (verification.verified) {
      return NextResponse.json({
        success: true,
        message: 'Credencial biométrica registrada exitosamente'
      });
    } else {
      return createAuthResponse(400, 'Verificación de registro fallida');
    }
  } catch (error) {
    console.error('Error verifying biometric registration:', error);
    return createAuthResponse(500, 'Error interno del servidor');
  }
}