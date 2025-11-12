/**
 * Standardized authentication error codes and messages
 * Provides consistent error handling across client and server
 */

export enum AuthErrorCode {
    // Credentials errors
    INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
    ACCOUNT_NOT_FOUND = 'ACCOUNT_NOT_FOUND',
    ACCOUNT_INACTIVE = 'ACCOUNT_INACTIVE',
    ACCOUNT_SUSPENDED = 'ACCOUNT_SUSPENDED',
    ACCOUNT_PENDING_VERIFICATION = 'ACCOUNT_PENDING_VERIFICATION',
    INVALID_ACCOUNT_STATE = 'INVALID_ACCOUNT_STATE',

    // MFA errors
    MFA_REQUIRED = 'MFA_REQUIRED',
    MFA_INVALID_CODE = 'MFA_INVALID_CODE',
    MFA_SETUP_REQUIRED = 'MFA_SETUP_REQUIRED',
    MFA_RATE_LIMITED = 'MFA_RATE_LIMITED',
    MFA_BACKUP_CODE_INVALID = 'MFA_BACKUP_CODE_INVALID',

    // Password reset errors
    PASSWORD_RESET_INVALID_TOKEN = 'PASSWORD_RESET_INVALID_TOKEN',
    PASSWORD_RESET_EXPIRED_TOKEN = 'PASSWORD_RESET_EXPIRED_TOKEN',
    PASSWORD_RESET_RATE_LIMITED = 'PASSWORD_RESET_RATE_LIMITED',
    PASSWORD_RESET_EMAIL_NOT_FOUND = 'PASSWORD_RESET_EMAIL_NOT_FOUND',

    // OAuth errors
    OAUTH_INVALID_STATE = 'OAUTH_INVALID_STATE',
    OAUTH_ACCESS_DENIED = 'OAUTH_ACCESS_DENIED',
    OAUTH_INVALID_GRANT = 'OAUTH_INVALID_GRANT',
    OAUTH_TOKEN_EXPIRED = 'OAUTH_TOKEN_EXPIRED',

    // Rate limiting
    RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
    ACCOUNT_RATE_LIMIT_EXCEEDED = 'ACCOUNT_RATE_LIMIT_EXCEEDED',

    // Generic errors
    INTERNAL_ERROR = 'INTERNAL_ERROR',
    CONFIGURATION_ERROR = 'CONFIGURATION_ERROR',
    NETWORK_ERROR = 'NETWORK_ERROR',
}

export interface AuthError {
    code: AuthErrorCode;
    message: string;
    details?: any;
    retryAfter?: number;
}

/**
 * Localized error messages (Spanish)
 */
export const AUTH_ERROR_MESSAGES: Record<AuthErrorCode, string> = {
    [AuthErrorCode.INVALID_CREDENTIALS]: 'Credenciales inválidas. Verifica tu email y contraseña.',
    [AuthErrorCode.ACCOUNT_NOT_FOUND]: 'No se encontró una cuenta con ese email.',
    [AuthErrorCode.ACCOUNT_INACTIVE]: 'Tu cuenta está inactiva. Contacta al soporte.',
    [AuthErrorCode.ACCOUNT_SUSPENDED]: 'Tu cuenta ha sido suspendida. Contacta al soporte.',
    [AuthErrorCode.ACCOUNT_PENDING_VERIFICATION]: 'Tu cuenta está pendiente de verificación. Revisa tu email.',
    [AuthErrorCode.INVALID_ACCOUNT_STATE]: 'Estado de cuenta inválido.',

    [AuthErrorCode.MFA_REQUIRED]: 'Se requiere autenticación de dos factores.',
    [AuthErrorCode.MFA_INVALID_CODE]: 'Código MFA inválido.',
    [AuthErrorCode.MFA_SETUP_REQUIRED]: 'Debes configurar la autenticación de dos factores.',
    [AuthErrorCode.MFA_RATE_LIMITED]: 'Demasiados intentos MFA. Intenta de nuevo más tarde.',
    [AuthErrorCode.MFA_BACKUP_CODE_INVALID]: 'Código de recuperación inválido.',

    [AuthErrorCode.PASSWORD_RESET_INVALID_TOKEN]: 'Enlace de restablecimiento inválido.',
    [AuthErrorCode.PASSWORD_RESET_EXPIRED_TOKEN]: 'Enlace de restablecimiento expirado.',
    [AuthErrorCode.PASSWORD_RESET_RATE_LIMITED]: 'Demasiados intentos de restablecimiento. Intenta de nuevo más tarde.',
    [AuthErrorCode.PASSWORD_RESET_EMAIL_NOT_FOUND]: 'No se encontró una cuenta con ese email.',

    [AuthErrorCode.OAUTH_INVALID_STATE]: 'Error de estado OAuth. Intenta de nuevo.',
    [AuthErrorCode.OAUTH_ACCESS_DENIED]: 'Acceso denegado por el proveedor.',
    [AuthErrorCode.OAUTH_INVALID_GRANT]: 'Concesión OAuth inválida.',
    [AuthErrorCode.OAUTH_TOKEN_EXPIRED]: 'Token OAuth expirado.',

    [AuthErrorCode.RATE_LIMIT_EXCEEDED]: 'Demasiados intentos. Intenta de nuevo más tarde.',
    [AuthErrorCode.ACCOUNT_RATE_LIMIT_EXCEEDED]: 'Demasiados intentos para este email. Intenta de nuevo más tarde.',

    [AuthErrorCode.INTERNAL_ERROR]: 'Error interno del servidor.',
    [AuthErrorCode.CONFIGURATION_ERROR]: 'Error de configuración.',
    [AuthErrorCode.NETWORK_ERROR]: 'Error de conexión.',
};

/**
 * Create a standardized auth error
 */
export function createAuthError(
    code: AuthErrorCode,
    details?: any,
    retryAfter?: number
): AuthError {
    return {
        code,
        message: AUTH_ERROR_MESSAGES[code],
        details,
        retryAfter,
    };
}

/**
 * Custom error class for authentication errors
 */
export class AuthErrorException extends Error {
    public readonly code: AuthErrorCode;
    public readonly details?: any;
    public readonly retryAfter?: number;

    constructor(code: AuthErrorCode, details?: any, retryAfter?: number) {
        const message = AUTH_ERROR_MESSAGES[code];
        super(message);
        this.name = 'AuthErrorException';
        this.code = code;
        this.details = details;
        this.retryAfter = retryAfter;
    }

    toJSON(): AuthError {
        return createAuthError(this.code, this.details, this.retryAfter);
    }
}