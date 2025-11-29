import { NextRequest, NextResponse } from 'next/server';
import { generateBiometricAuthenticationOptions } from '@/lib/webauthn-helpers';
import { createAuthResponse } from '@/lib/auth-helpers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userId = body.userId ? parseInt(body.userId) : undefined;

    // Generar opciones de autenticación
    const options = await generateBiometricAuthenticationOptions(userId);

    return NextResponse.json(options);
  } catch (error) {
    console.error('Error generating biometric authentication options:', error);
    return createAuthResponse(500, 'Error interno del servidor');
  }
}