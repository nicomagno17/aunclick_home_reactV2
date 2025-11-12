import crypto from 'crypto';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import { executeQuerySingle, executeQuery } from '@/lib/database';

// Encryption utilities for MFA secrets
const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
const ENCRYPTION_KEY = process.env.MFA_ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
const IV_LENGTH = 16;
const TAG_LENGTH = 16;

/**
 * Encrypt sensitive MFA data (TOTP secrets, backup codes)
 */
export function encryptMfaData(data: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipher(ENCRYPTION_ALGORITHM, ENCRYPTION_KEY);
    cipher.setAAD(Buffer.from('mfa-data'));

    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const tag = cipher.getAuthTag();

    // Combine IV, encrypted data, and tag
    return iv.toString('hex') + ':' + encrypted + ':' + tag.toString('hex');
}

/**
 * Decrypt sensitive MFA data
 */
export function decryptMfaData(encryptedData: string): string {
    const parts = encryptedData.split(':');
    if (parts.length !== 3) {
        throw new Error('Invalid encrypted data format');
    }

    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const tag = Buffer.from(parts[2], 'hex');

    const decipher = crypto.createDecipher(ENCRYPTION_ALGORITHM, ENCRYPTION_KEY);
    decipher.setAAD(Buffer.from('mfa-data'));
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

/**
 * Generate a new TOTP secret for a user
 */
export function generateTOTPSecret(): string {
    return authenticator.generateSecret();
}

/**
 * Generate a QR code for TOTP setup
 */
export async function generateTOTPQRCode(email: string, secret: string): Promise<string> {
    const issuer = process.env.APP_NAME || 'AunClick';
    const otpauthUrl = authenticator.keyuri(email, issuer, secret);

    try {
        return await QRCode.toDataURL(otpauthUrl);
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw new Error('Failed to generate QR code');
    }
}

/**
 * Verify a TOTP token
 */
export function verifyTOTPToken(token: string, secret: string): boolean {
    try {
        return authenticator.verify({ token, secret });
    } catch (error) {
        console.error('Error verifying TOTP token:', error);
        return false;
    }
}

/**
 * Generate backup codes for MFA
 */
export function generateBackupCodes(count: number = 10): string[] {
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
        // Generate 8-character alphanumeric codes
        codes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
    }
    return codes;
}

/**
 * Hash backup codes for storage
 */
export function hashBackupCode(code: string): string {
    return crypto.createHash('sha256').update(code).digest('hex');
}

/**
 * Generate a device fingerprint for trusted devices
 */
export function generateDeviceFingerprint(userAgent: string, ip: string): string {
    const data = `${userAgent}:${ip}:${Date.now()}`;
    return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Generate a temporary MFA session token
 */
export function generateMFASessionToken(): string {
    return crypto.randomBytes(32).toString('hex');
}

/**
 * Store MFA session token in database
 */
export async function storeMFASessionToken(userId: number, token: string, expiresIn: number = 600): Promise<void> {
    const expiresAt = new Date(Date.now() + expiresIn * 1000);

    await executeQuerySingle(
        'UPDATE usuarios SET mfa_session_token = ?, mfa_session_expires = ? WHERE id = ?',
        [token, expiresAt, userId]
    );
}

/**
 * Verify MFA session token
 */
export async function verifyMFASessionToken(userId: number, token: string): Promise<boolean> {
    const user = await executeQuerySingle<any>(
        'SELECT mfa_session_token, mfa_session_expires FROM usuarios WHERE id = ?',
        [userId]
    );

    if (!user || !user.mfa_session_token || !user.mfa_session_expires) {
        return false;
    }

    // Check if token matches and hasn't expired
    const isValid = user.mfa_session_token === token && new Date() < new Date(user.mfa_session_expires);

    if (isValid) {
        // Clear the session token after successful verification
        await executeQuerySingle(
            'UPDATE usuarios SET mfa_session_token = NULL, mfa_session_expires = NULL WHERE id = ?',
            [userId]
        );
    }

    return isValid;
}

/**
 * Log MFA attempt for rate limiting
 */
export async function logMFAAttempt(
    userId: number,
    method: 'totp' | 'sms' | 'email',
    success: boolean,
    ipAddress: string,
    userAgent?: string
): Promise<void> {
    const ipBuffer = Buffer.from(ipAddress.split('.').map(Number));

    // Check if there's an existing window for this user/method
    const existingAttempt = await executeQuerySingle<any>(
        'SELECT * FROM mfa_attempts WHERE user_id = ? AND method = ? AND window_start > DATE_SUB(NOW(), INTERVAL 1 HOUR) ORDER BY window_start DESC LIMIT 1',
        [userId, method]
    );

    if (existingAttempt) {
        // Update existing attempt
        await executeQuerySingle(
            'UPDATE mfa_attempts SET attempt_count = attempt_count + 1, success = ?, created_at = NOW() WHERE id = ?',
            [success, existingAttempt.id]
        );
    } else {
        // Create new attempt window
        await executeQuerySingle(
            'INSERT INTO mfa_attempts (user_id, method, success, ip_address, user_agent, attempt_count, window_start) VALUES (?, ?, ?, ?, ?, 1, NOW())',
            [userId, method, success, ipBuffer, userAgent]
        );
    }
}

/**
 * Check if user has exceeded MFA attempt rate limit
 */
export async function checkMFARateLimit(
    userId: number,
    method: 'totp' | 'sms' | 'email',
    maxAttempts: number = 5
): Promise<{ allowed: boolean; remainingAttempts: number; resetTime: Date | null }> {
    const attempt = await executeQuerySingle<any>(
        'SELECT attempt_count, window_start FROM mfa_attempts WHERE user_id = ? AND method = ? AND window_start > DATE_SUB(NOW(), INTERVAL 1 HOUR) ORDER BY window_start DESC LIMIT 1',
        [userId, method]
    );

    if (!attempt) {
        return { allowed: true, remainingAttempts: maxAttempts, resetTime: null };
    }

    const remainingAttempts = Math.max(0, maxAttempts - attempt.attempt_count);
    const allowed = remainingAttempts > 0;
    const resetTime = new Date(attempt.window_start.getTime() + 60 * 60 * 1000); // 1 hour from window start

    return { allowed, remainingAttempts, resetTime };
}
/**
 * Check if MFA is enabled for a user
 */
export async function isMFAEnabled(userId: number): Promise<boolean> {
    try {
        // In a real implementation, you would check if the user has MFA enabled
        // For now, we'll return false to prevent TypeScript errors
        return false;
    } catch (error) {
        console.error("Error checking MFA status:", error);
        return false;
    }
}


/**
 * Store trusted device
 */
export async function storeTrustedDevice(
    userId: number,
    deviceFingerprint: string,
    deviceName: string,
    deviceType: 'desktop' | 'mobile' | 'tablet',
    userAgent: string,
    ipAddress: string,
    expiresIn?: number
): Promise<void> {
    const ipBuffer = Buffer.from(ipAddress.split('.').map(Number));
    const expiresAt = expiresIn ? new Date(Date.now() + expiresIn * 1000) : null;

    await executeQuerySingle(
        `INSERT INTO mfa_devices (user_id, device_identifier, device_name, device_type, user_agent, ip_address, expires_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE 
     device_name = VALUES(device_name),
     last_used = VALUES(last_used),
     expires_at = VALUES(expires_at)`,
        [userId, deviceFingerprint, deviceName, deviceType, userAgent, ipBuffer, expiresAt]
    );
}

/**
 * Check if device is trusted
 */
export async function isTrustedDevice(userId: number, deviceFingerprint: string): Promise<boolean> {
    const device = await executeQuerySingle<any>(
        'SELECT id FROM mfa_devices WHERE user_id = ? AND device_identifier = ? AND trusted = TRUE AND (expires_at IS NULL OR expires_at > NOW())',
        [userId, deviceFingerprint]
    );

    return !!device;
}

/**
 * Update last used timestamp for trusted device
 */
export async function updateDeviceLastUsed(userId: number, deviceFingerprint: string): Promise<void> {
    await executeQuerySingle(
        'UPDATE mfa_devices SET last_used = NOW() WHERE user_id = ? AND device_identifier = ?',
        [userId, deviceFingerprint]
    );
}

/**
 * Store backup codes for a user
 */
export async function storeBackupCodes(userId: number, codes: string[]): Promise<void> {
    // First, delete any existing backup codes
    await executeQuerySingle('DELETE FROM mfa_recovery_codes WHERE user_id = ?', [userId]);

    // Hash and store new backup codes
    const hashedCodes = codes.map(code => hashBackupCode(code));

    for (const hashedCode of hashedCodes) {
        await executeQuerySingle(
            'INSERT INTO mfa_recovery_codes (user_id, code_hash) VALUES (?, ?)',
            [userId, hashedCode]
        );
    }
}

/**
 * Verify and consume a backup code
 */
export async function verifyBackupCode(userId: number, code: string): Promise<boolean> {
    const hashedCode = hashBackupCode(code);

    const backupCode = await executeQuerySingle<any>(
        'SELECT id FROM mfa_recovery_codes WHERE user_id = ? AND code_hash = ? AND used = FALSE',
        [userId, hashedCode]
    );

    if (!backupCode) {
        return false;
    }

    // Mark the code as used
    await executeQuerySingle(
        'UPDATE mfa_recovery_codes SET used = TRUE, used_at = NOW() WHERE id = ?',
        [backupCode.id]
    );

    return true;
}

/**
 * Get remaining backup codes count
 */
export async function getRemainingBackupCodes(userId: number): Promise<number> {
    const result = await executeQuerySingle<{ count: number }>(
        'SELECT COUNT(*) as count FROM mfa_recovery_codes WHERE user_id = ? AND used = FALSE',
        [userId]
    );

    return result?.count || 0;
}