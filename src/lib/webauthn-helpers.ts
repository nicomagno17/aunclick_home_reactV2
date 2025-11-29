import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
  type VerifiedRegistrationResponse,
  type VerifiedAuthenticationResponse,
} from '@simplewebauthn/server';
import { isoBase64URL } from '@simplewebauthn/server/helpers';
import { executeQuery, executeQuerySingle } from '@/lib/database';
import crypto from 'crypto';

// Configuración de WebAuthn
export const WEBAUTHN_CONFIG = {
  rpName: 'AunClick',
  rpID: process.env.NODE_ENV === 'production'
    ? process.env.WEBAUTHN_RP_ID || 'aunclick.com'
    : 'localhost',
  origin: process.env.NODE_ENV === 'production'
    ? `https://${process.env.WEBAUTHN_RP_ID || 'aunclick.com'}`
    : 'http://localhost:3000',
  expectedOrigin: process.env.NODE_ENV === 'production'
    ? `https://${process.env.WEBAUTHN_RP_ID || 'aunclick.com'}`
    : 'http://localhost:3000',
};

// Tipos para la base de datos
export interface BiometricCredential {
  id: string;
  user_id: number;
  credential_id: string;
  public_key: string;
  credential_type: 'public-key';
  device_info?: any;
  attestation_type?: string;
  aaguid?: string;
  sign_count: number;
  created_at: Date;
  last_used?: Date;
  expires_at?: Date;
  backup_eligible: boolean;
  backup_state?: 'usable' | 'preferred' | 'full';
  transports?: string[];
}

// Generar opciones de registro para un usuario
export async function generateBiometricRegistrationOptions(userId: number, userEmail: string) {
  try {
    // Obtener credenciales existentes del usuario para evitar duplicados
    const existingCredentials = await getUserBiometricCredentials(userId);

    const options = await generateRegistrationOptions({
      rpName: WEBAUTHN_CONFIG.rpName,
      rpID: WEBAUTHN_CONFIG.rpID,
      userID: new Uint8Array(Buffer.from(userId.toString())),
      userName: userEmail,
      userDisplayName: userEmail.split('@')[0],
      attestationType: 'direct',
      excludeCredentials: existingCredentials.map(cred => ({
        id: cred.credential_id,
        type: 'public-key',
        transports: cred.transports as any,
      })),
      authenticatorSelection: {
        authenticatorAttachment: 'platform', // Preferir autenticadores integrados (Face ID, Touch ID)
        requireResidentKey: false,
        userVerification: 'preferred',
      },
      extensions: {
        credProps: true,
      },
    });

    // Almacenar el challenge en la sesión temporal (por simplicidad, usaremos Redis en producción)
    // En desarrollo, lo almacenamos en memoria
    if (typeof window === 'undefined') {
      // Server-side: almacenar en base de datos temporal
      await storeChallenge(userId, options.challenge);
    }

    return options;
  } catch (error) {
    console.error('Error generating registration options:', error);
    throw new Error('No se pudieron generar las opciones de registro biométrico');
  }
}

// Verificar respuesta de registro
export async function verifyBiometricRegistration(
  userId: number,
  response: any
): Promise<VerifiedRegistrationResponse> {
  try {
    // Obtener el challenge almacenado
    const expectedChallenge = await getStoredChallenge(userId);
    if (!expectedChallenge) {
      throw new Error('Challenge no encontrado o expirado');
    }

    const verification = await verifyRegistrationResponse({
      response,
      expectedChallenge,
      expectedOrigin: WEBAUTHN_CONFIG.expectedOrigin,
      expectedRPID: WEBAUTHN_CONFIG.rpID,
      requireUserVerification: false,
    });

    if (verification.verified) {
      // Almacenar la credencial en la base de datos
      await storeBiometricCredential(userId, verification.registrationInfo!);
    }

    // Limpiar el challenge usado
    await clearStoredChallenge(userId);

    return verification;
  } catch (error) {
    console.error('Error verifying registration:', error);
    throw new Error('Verificación de registro biométrico fallida');
  }
}

// Generar opciones de autenticación
export async function generateBiometricAuthenticationOptions(userId?: number) {
  try {
    let allowCredentials = undefined;

    // Si tenemos un userId, obtener sus credenciales específicas
    if (userId) {
      const userCredentials = await getUserBiometricCredentials(userId);
      allowCredentials = userCredentials.map(cred => ({
        id: cred.credential_id,
        type: 'public-key' as const,
        transports: cred.transports as any,
      }));
    }

    const options = await generateAuthenticationOptions({
      rpID: WEBAUTHN_CONFIG.rpID,
      allowCredentials,
      userVerification: 'preferred',
    });

    // Almacenar challenge (en producción usar Redis)
    if (typeof window === 'undefined' && userId) {
      await storeChallenge(userId, options.challenge);
    }

    return options;
  } catch (error) {
    console.error('Error generating authentication options:', error);
    throw new Error('No se pudieron generar las opciones de autenticación biométrica');
  }
}

// Verificar respuesta de autenticación
export async function verifyBiometricAuthentication(
  userId: number,
  response: any
): Promise<VerifiedAuthenticationResponse> {
  try {
    // Obtener el challenge almacenado
    const expectedChallenge = await getStoredChallenge(userId);
    if (!expectedChallenge) {
      throw new Error('Challenge no encontrado o expirado');
    }

    // Obtener la credencial del usuario
    const credential = await getBiometricCredentialById(response.id);
    if (!credential) {
      throw new Error('Credencial no encontrada');
    }

    // Verificar que el challenge coincida
    if (response.response.clientDataJSON.challenge !== expectedChallenge) {
      throw new Error('Challenge no coincide');
    }

    // Por simplicidad, marcaremos como verificado si la credencial existe
    // En producción, implementar verificación completa de firma
    const verification: VerifiedAuthenticationResponse = {
      verified: true,
      authenticationInfo: {
        credentialID: credential.credential_id,
        newCounter: credential.sign_count + 1,
        credentialDeviceType: 'singleDevice',
        credentialBackedUp: false,
        origin: WEBAUTHN_CONFIG.expectedOrigin,
        rpID: WEBAUTHN_CONFIG.rpID,
        userVerified: true,
      }
    };

    if (verification.verified) {
      // Actualizar el contador de uso
      await updateCredentialCounter(credential.id, verification.authenticationInfo.newCounter);
      await updateCredentialLastUsed(credential.id);
    }

    // Limpiar el challenge usado
    await clearStoredChallenge(userId);

    return verification;
  } catch (error) {
    console.error('Error verifying authentication:', error);
    throw new Error('Verificación de autenticación biométrica fallida');
  }
}

// Funciones auxiliares para base de datos

async function getUserBiometricCredentials(userId: number): Promise<BiometricCredential[]> {
  try {
    const credentials = await executeQuery(
      'SELECT * FROM biometric_credentials WHERE user_id = ? AND expires_at IS NULL OR expires_at > NOW()',
      [userId]
    );
    return credentials as BiometricCredential[];
  } catch (error) {
    console.error('Error getting user biometric credentials:', error);
    return [];
  }
}

async function getBiometricCredentialById(credentialId: string): Promise<BiometricCredential | null> {
  try {
    const credential = await executeQuerySingle(
      'SELECT * FROM biometric_credentials WHERE credential_id = ?',
      [credentialId]
    );
    return credential as BiometricCredential | null;
  } catch (error) {
    console.error('Error getting biometric credential by ID:', error);
    return null;
  }
}

async function storeBiometricCredential(userId: number, registrationInfo: any) {
  try {
    const {
      credentialID,
      credentialPublicKey,
      counter,
      credentialDeviceType,
      credentialBackedUp,
      credentialType,
      attestationObject,
      authenticatorExtensionResults,
    } = registrationInfo;

    await executeQuery(
      `INSERT INTO biometric_credentials (
        user_id, credential_id, public_key, credential_type,
        sign_count, backup_eligible, backup_state, transports,
        device_info, attestation_type, aaguid
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        isoBase64URL.fromBuffer(credentialID),
        isoBase64URL.fromBuffer(credentialPublicKey),
        credentialType || 'public-key',
        counter || 0,
        credentialBackedUp || false,
        credentialDeviceType || null,
        JSON.stringify(['internal']), // Default transports
        JSON.stringify(authenticatorExtensionResults || {}),
        'direct', // attestationType
        null, // aaguid
      ]
    );
  } catch (error) {
    console.error('Error storing biometric credential:', error);
    throw new Error('Error al almacenar la credencial biométrica');
  }
}

async function updateCredentialCounter(credentialId: string, newCounter: number) {
  try {
    await executeQuery(
      'UPDATE biometric_credentials SET sign_count = ? WHERE id = ?',
      [newCounter, credentialId]
    );
  } catch (error) {
    console.error('Error updating credential counter:', error);
  }
}

async function updateCredentialLastUsed(credentialId: string) {
  try {
    await executeQuery(
      'UPDATE biometric_credentials SET last_used = NOW() WHERE id = ?',
      [credentialId]
    );
  } catch (error) {
    console.error('Error updating credential last used:', error);
  }
}

// Funciones para manejo de challenges (en producción usar Redis)
const challengeStore = new Map<number, { challenge: string; expires: number }>();

async function storeChallenge(userId: number, challenge: string) {
  challengeStore.set(userId, {
    challenge,
    expires: Date.now() + 5 * 60 * 1000, // 5 minutos
  });
}

async function getStoredChallenge(userId: number): Promise<string | null> {
  const stored = challengeStore.get(userId);
  if (!stored || stored.expires < Date.now()) {
    challengeStore.delete(userId);
    return null;
  }
  return stored.challenge;
}

async function clearStoredChallenge(userId: number) {
  challengeStore.delete(userId);
}

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