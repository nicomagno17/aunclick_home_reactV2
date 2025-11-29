import crypto from 'crypto';
import { executeQuerySingle, insertAndGetId } from '@/lib/database';

// ============================================================================
// CONFIGURATION CONSTANTS
// ============================================================================

export const OAUTH_STATE_EXPIRY_MINUTES = 10;
export const OAUTH_REFRESH_RETRY_ATTEMPTS = 3;
export const OAUTH_REFRESH_BACKOFF_MS = [1000, 2000, 4000];
export const OAUTH_REQUIRED_SCOPES = {
  google: ['openid', 'email', 'profile'],
  facebook: ['email', 'public_profile']
} as const;

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface EncryptedToken {
  encrypted: string;
  iv: string;
  authTag: string;
}

export interface OAuthState {
  state: string;
  timestamp: number;
  nonce: string;
  provider: string;
}

export type OAuthProvider = 'google' | 'facebook';

// ============================================================================
// IN-MEMORY STORAGE FOR NONCES (PRODUCTION SHOULD USE REDIS)
// ============================================================================

const usedNonces = new Map<string, number>();
const NONCE_TTL_MS = OAUTH_STATE_EXPIRY_MINUTES * 60 * 1000;

// Clean up expired nonces periodically
setInterval(() => {
  const now = Date.now();
  for (const [nonce, timestamp] of usedNonces.entries()) {
    if (now - timestamp > NONCE_TTL_MS) {
      usedNonces.delete(nonce);
    }
  }
}, 60000); // Clean every minute

// ============================================================================
// TOKEN ENCRYPTION/DECRYPTION FUNCTIONS
// ============================================================================

/**
 * Encrypt OAuth token using AES-256-GCM
 */
export function encryptOAuthToken(token: string): EncryptedToken {
  try {
    const key = Buffer.from(process.env.OAUTH_ENCRYPTION_KEY!, 'base64');
    const iv = crypto.randomBytes(16); // 128-bit IV
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    cipher.setAAD(Buffer.from('oauth-token', 'utf8')); // Additional authenticated data
    
    let encrypted = cipher.update(token, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  } catch (error) {
    console.error('Error encrypting OAuth token:', error);
    throw new Error('Failed to encrypt OAuth token');
  }
}

/**
 * Decrypt OAuth token using AES-256-GCM
 */
export function decryptOAuthToken(encryptedData: EncryptedToken): string {
  try {
    const key = Buffer.from(process.env.OAUTH_ENCRYPTION_KEY!, 'base64');
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(encryptedData.iv, 'hex'));
    decipher.setAAD(Buffer.from('oauth-token', 'utf8'));
    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
    
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Error decrypting OAuth token:', error);
    throw new Error('Failed to decrypt OAuth token');
  }
}

// ============================================================================
// OAUTH STATE VALIDATION FUNCTIONS
// ============================================================================
// NOTE: These functions are currently not used with NextAuth's built-in state handling.
// They are kept for potential custom OAuth flows outside of NextAuth.

/**
 * Generate secure OAuth state token with timestamp and HMAC signature
 * 
 * @deprecated Not currently used with NextAuth's built-in state handling.
 * Kept for potential custom OAuth flows.
 */
export function generateOAuthState(provider: OAuthProvider): string {
  try {
    const timestamp = Date.now();
    const nonce = crypto.randomBytes(32).toString('hex');
    
    // Create state payload
    const payload = {
      timestamp,
      nonce,
      provider
    };
    
    // Create HMAC signature
    const hmac = crypto.createHmac('sha256', process.env.NEXTAUTH_SECRET!);
    hmac.update(JSON.stringify(payload));
    const signature = hmac.digest('hex');
    
    // Combine payload and signature
    const stateData = {
      ...payload,
      signature
    };
    
    // Store nonce for replay protection
    usedNonces.set(nonce, timestamp);
    
    // Encode as base64url for URL safety
    const stateString = JSON.stringify(stateData);
    return Buffer.from(stateString).toString('base64url');
  } catch (error) {
    console.error('Error generating OAuth state:', error);
    throw new Error('Failed to generate OAuth state');
  }
}

/**
 * Validate OAuth state token
 * 
 * @deprecated Not currently used with NextAuth's built-in state handling.
 * Kept for potential custom OAuth flows.
 */
export function validateOAuthState(state: string, expectedProvider?: OAuthProvider): boolean {
  try {
    // Decode base64url
    const stateString = Buffer.from(state, 'base64url').toString('utf8');
    const stateData: OAuthState & { signature: string } = JSON.parse(stateString);
    
    // Check required fields
    if (!stateData.timestamp || !stateData.nonce || !stateData.signature || !stateData.provider) {
      return false;
    }
    
    // Check provider match if specified
    if (expectedProvider && stateData.provider !== expectedProvider) {
      return false;
    }
    
    // Check timestamp (not expired)
    const now = Date.now();
    const ageMs = now - stateData.timestamp;
    const maxAgeMs = OAUTH_STATE_EXPIRY_MINUTES * 60 * 1000;
    
    if (ageMs > maxAgeMs) {
      return false;
    }
    
    // Check nonce replay
    const nonceTimestamp = usedNonces.get(stateData.nonce);
    if (!nonceTimestamp) {
      return false; // Nonce not found or already used
    }
    
    // Remove nonce to prevent reuse
    usedNonces.delete(stateData.nonce);
    
    // Verify HMAC signature
    const payload = {
      timestamp: stateData.timestamp,
      nonce: stateData.nonce,
      provider: stateData.provider
    };
    
    const hmac = crypto.createHmac('sha256', process.env.NEXTAUTH_SECRET!);
    hmac.update(JSON.stringify(payload));
    const expectedSignature = hmac.digest('hex');
    
    // Constant-time comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(stateData.signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch (error) {
    console.error('Error validating OAuth state:', error);
    return false;
  }
}

// ============================================================================
// OAUTH TOKEN REVOCATION FUNCTIONS
// ============================================================================

/**
 * Revoke OAuth token with provider
 */
export async function revokeOAuthToken(provider: OAuthProvider, token: string): Promise<boolean> {
  try {
    if (provider === 'google') {
      const response = await fetch('https://oauth2.googleapis.com/revoke', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          token: token,
        }),
      });
      
      return response.ok;
    } else if (provider === 'facebook') {
      const response = await fetch(`https://graph.facebook.com/me/permissions?access_token=${token}`, {
        method: 'DELETE',
      });
      
      return response.ok;
    }
    
    return false;
  } catch (error) {
    console.error(`Error revoking ${provider} token:`, error);
    return false;
  }
}

// ============================================================================
// OAUTH SCOPES VALIDATION
// ============================================================================

/**
 * Validate OAuth scopes against required scopes
 */
export function validateOAuthScopes(receivedScopes: string[], provider: OAuthProvider): boolean {
  try {
    const requiredScopes = OAUTH_REQUIRED_SCOPES[provider];
    
    // Check if all required scopes are present
    return requiredScopes.every(scope => receivedScopes.includes(scope));
  } catch (error) {
    console.error('Error validating OAuth scopes:', error);
    return false;
  }
}

// ============================================================================
// OAUTH EVENT LOGGING
// ============================================================================

/**
 * Log OAuth event to security_events table
 */
export async function logOAuthEvent(
  userId: number,
  eventType: 'oauth_linked' | 'oauth_unlinked',
  provider: OAuthProvider,
  metadata?: Record<string, any>
): Promise<void> {
  try {
    await insertAndGetId(`
      INSERT INTO security_events (
        user_id, event_type, severity, description, metadata, created_at
      ) VALUES (?, ?, 'medium', ?, ?, NOW())
    `, [
      userId,
      eventType,
      `OAuth ${eventType.replace('oauth_', '')} with ${provider}`,
      JSON.stringify({
        provider,
        ...metadata,
        timestamp: new Date().toISOString()
      })
    ]);
  } catch (error) {
    console.error('Error logging OAuth event:', error);
    // Don't throw - logging failure shouldn't break the flow
  }
}

/**
 * Record OAuth login attempt
 */
export async function recordOAuthLoginAttempt(
  userId: number | null,
  email: string,
  provider: OAuthProvider,
  success: boolean,
  ipAddress?: string,
  userAgent?: string,
  failureReason?: string
): Promise<void> {
  try {
    await insertAndGetId(`
      INSERT INTO login_attempts (
        user_id, email, ip_address, user_agent, login_method, 
        success, failure_reason, created_at
      ) VALUES (?, ?, INET6_ATON(?), ?, ?, ?, ?, NOW())
    `, [
      userId,
      email,
      ipAddress || '',
      userAgent || '',
      provider,
      success,
      failureReason || null
    ]);
  } catch (error) {
    console.error('Error recording OAuth login attempt:', error);
    // Don't throw - logging failure shouldn't break the flow
  }
}

// ============================================================================
// OAUTH PROVIDER STATUS MANAGEMENT
// ============================================================================

/**
 * Update OAuth provider status after attempt
 */
export async function updateOAuthProviderStatus(
  provider: OAuthProvider,
  success: boolean,
  responseTimeMs?: number,
  error?: string
): Promise<void> {
  try {
    // First, try to update existing record
    const updateResult = await executeQuerySingle(`
      UPDATE oauth_provider_status 
      SET 
        last_check = NOW(),
        error_count = CASE WHEN ? THEN 0 ELSE error_count + 1 END,
        last_error = ?,
        avg_response_time_ms = CASE 
          WHEN ? IS NOT NULL THEN 
            (avg_response_time_ms * (success_rate / 100) + ?) / ((success_rate / 100) + 1)
          ELSE avg_response_time_ms 
        END
      WHERE provider = ?
    `, [
      success,
      success ? null : (error || 'Unknown error'),
      responseTimeMs,
      responseTimeMs,
      provider
    ]);
    
    // If no rows were updated, insert new record
    if (!updateResult || updateResult.affectedRows === 0) {
      await insertAndGetId(`
        INSERT INTO oauth_provider_status (
          provider, is_available, last_check, error_count, 
          success_rate, avg_response_time_ms
        ) VALUES (?, ?, NOW(), ?, 100.00, ?)
      `, [
        provider,
        success,
        success ? 0 : 1,
        responseTimeMs || null
      ]);
    }
  } catch (error) {
    console.error('Error updating OAuth provider status:', error);
    // Don't throw - status update failure shouldn't break the flow
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate secure random string for OAuth purposes
 */
export function generateSecureRandomString(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Get OAuth encryption key status
 */
export function getOAuthEncryptionStatus(): { valid: boolean; error?: string } {
  try {
    if (!process.env.OAUTH_ENCRYPTION_KEY) {
      return { valid: false, error: 'OAUTH_ENCRYPTION_KEY not set' };
    }
    
    const key = Buffer.from(process.env.OAUTH_ENCRYPTION_KEY, 'base64');
    if (key.length !== 32) {
      return { valid: false, error: 'OAUTH_ENCRYPTION_KEY must be 32 bytes (base64 encoded)' };
    }
    
    return { valid: true };
  } catch (error) {
    return { valid: false, error: 'Invalid OAUTH_ENCRYPTION_KEY format' };
  }
}