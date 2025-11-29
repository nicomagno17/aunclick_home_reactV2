// Client-side WebAuthn utilities - NO server imports allowed
"use client";

import {
  startRegistration,
  startAuthentication,
  type PublicKeyCredentialCreationOptionsJSON,
  type PublicKeyCredentialRequestOptionsJSON,
  type RegistrationResponseJSON,
  type AuthenticationResponseJSON,
} from '@simplewebauthn/browser';

// WebAuthn configuration for client
export const WEBAUTHN_CLIENT_CONFIG = {
  rpName: 'AunClick',
  rpID: typeof window !== 'undefined' && window.location
    ? window.location.hostname
    : 'localhost',
};

// Verificar si el navegador soporta WebAuthn
export function isWebAuthnSupported(): boolean {
  if (typeof window === 'undefined') return false;

  return !!(window.navigator && window.navigator.credentials && window.PublicKeyCredential);
}

// Obtener información del autenticador
export function getAuthenticatorInfo(): string {
  if (typeof window === 'undefined') return 'Unknown';

  // Detectar tipo de autenticador basado en el user agent y capacidades
  const ua = navigator.userAgent.toLowerCase();

  if (ua.includes('iphone') || ua.includes('ipad')) {
    return 'Face ID (iOS)';
  }

  if (ua.includes('android')) {
    return 'Fingerprint/Face (Android)';
  }

  if (ua.includes('windows')) {
    return 'Windows Hello';
  }

  if (ua.includes('mac')) {
    return 'Touch ID (macOS)';
  }

  return 'Biometric Authenticator';
}

// Iniciar registro biométrico
export async function startBiometricRegistration(options: PublicKeyCredentialCreationOptionsJSON): Promise<RegistrationResponseJSON> {
  try {
    const response = await startRegistration(options);
    return response;
  } catch (error) {
    console.error('Error starting biometric registration:', error);
    throw new Error('Error al iniciar el registro biométrico');
  }
}

// Iniciar autenticación biométrica
export async function startBiometricAuthentication(options: PublicKeyCredentialRequestOptionsJSON): Promise<AuthenticationResponseJSON> {
  try {
    const response = await startAuthentication(options);
    return response;
  } catch (error) {
    console.error('Error starting biometric authentication:', error);
    throw new Error('Error al iniciar la autenticación biométrica');
  }
}

// Convertir respuesta de registro para envío al servidor
export function formatRegistrationResponse(response: RegistrationResponseJSON) {
  return {
    id: response.id,
    rawId: response.rawId,
    response: {
      attestationObject: response.response.attestationObject,
      clientDataJSON: response.response.clientDataJSON,
      transports: response.response.transports,
    },
    type: response.type,
    clientExtensionResults: response.clientExtensionResults,
  };
}

// Convertir respuesta de autenticación para envío al servidor
export function formatAuthenticationResponse(response: AuthenticationResponseJSON) {
  return {
    id: response.id,
    rawId: response.rawId,
    response: {
      authenticatorData: response.response.authenticatorData,
      clientDataJSON: response.response.clientDataJSON,
      signature: response.response.signature,
      userHandle: response.response.userHandle,
    },
    type: response.type,
    clientExtensionResults: response.clientExtensionResults,
  };
}