-- ============================================================================
-- MFA (Multi-Factor Authentication) Schema
-- Adds support for TOTP, SMS, and email-based second factors
-- ============================================================================

-- Add MFA fields to usuarios table
ALTER TABLE usuarios
ADD COLUMN mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'MFA enabled for this user',
ADD COLUMN mfa_secret VARCHAR(255) NULL COMMENT 'Encrypted TOTP secret',
ADD COLUMN mfa_backup_codes JSON NULL COMMENT 'Encrypted backup codes',
ADD COLUMN mfa_phone VARCHAR(20) NULL COMMENT 'Phone number for SMS MFA',
ADD COLUMN mfa_phone_verified BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Phone verification status',
ADD COLUMN mfa_method ENUM ('totp', 'sms', 'email') NULL COMMENT 'Primary MFA method',
ADD COLUMN mfa_session_token VARCHAR(255) NULL COMMENT 'Temporary token for MFA verification',
ADD COLUMN mfa_session_expires TIMESTAMP NULL COMMENT 'Expiration of MFA session token',
ADD
INDEX idx_usuarios_mfa_enabled (mfa_enabled),
ADD
INDEX idx_usuarios_mfa_session (
    mfa_session_token,
    mfa_session_expires
);

-- ============================================================================
-- TABLA: mfa_attempts
-- Track MFA verification attempts for rate limiting
-- ============================================================================
CREATE TABLE mfa_attempts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    method ENUM('totp', 'sms', 'email') NOT NULL,
    success BOOLEAN NOT NULL DEFAULT FALSE,
    ip_address VARBINARY(16) COMMENT 'IP address for rate limiting',
    user_agent VARCHAR(500) COMMENT 'User agent string',
    attempt_count TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT 'Attempt count in current window',
    window_start TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Start of current window',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

-- Relations
FOREIGN KEY (user_id) REFERENCES usuarios (id) ON DELETE CASCADE ON UPDATE CASCADE,

-- Indexes
INDEX idx_mfa_attempts_user (user_id),
INDEX idx_mfa_attempts_method (method),
INDEX idx_mfa_attempts_ip (ip_address),
INDEX idx_mfa_attempts_window (user_id, method, window_start),
INDEX idx_mfa_attempts_created (created_at),

-- Constraints
CONSTRAINT chk_mfa_attempts_count CHECK (attempt_count > 0 AND attempt_count <= 10)
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci 
  COMMENT='MFA verification attempts for rate limiting and auditing';

-- ============================================================================
-- TABLA: mfa_devices
-- Track trusted devices for MFA bypass
-- ============================================================================

CREATE TABLE mfa_devices (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    device_identifier VARCHAR(255) NOT NULL COMMENT 'Unique device fingerprint',
    device_name VARCHAR(100) COMMENT 'User-friendly device name',
    device_type ENUM('desktop', 'mobile', 'tablet') NOT NULL DEFAULT 'desktop',
    user_agent VARCHAR(500) COMMENT 'User agent string',
    ip_address VARBINARY(16) COMMENT 'IP address when device was registered',
    trusted BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Whether this device is trusted',
    last_used TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL COMMENT 'When trust expires (NULL = never)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

-- Relations
FOREIGN KEY (user_id) REFERENCES usuarios (id) ON DELETE CASCADE ON UPDATE CASCADE,

-- Indexes
INDEX idx_mfa_devices_user (user_id),
INDEX idx_mfa_devices_identifier (device_identifier),
INDEX idx_mfa_devices_trusted (trusted),
INDEX idx_mfa_devices_expires (expires_at),
INDEX idx_mfa_devices_last_used (last_used),

-- Constraints
UNIQUE KEY uk_mfa_devices_user_identifier (user_id, device_identifier),
    CONSTRAINT chk_mfa_devices_expires CHECK (expires_at IS NULL OR expires_at > created_at)
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci 
  COMMENT='Trusted devices for MFA bypass';

-- ============================================================================
-- TABLA: mfa_recovery_codes
-- Track usage of backup codes
-- ============================================================================
CREATE TABLE mfa_recovery_codes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    code_hash VARCHAR(255) NOT NULL COMMENT 'Hashed recovery code',
    used BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Whether this code has been used',
    used_at TIMESTAMP NULL COMMENT 'When the code was used',
    ip_address VARBINARY(16) COMMENT 'IP address when code was used',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

-- Relations
FOREIGN KEY (user_id) REFERENCES usuarios (id) ON DELETE CASCADE ON UPDATE CASCADE,

-- Indexes
INDEX idx_mfa_recovery_user (user_id),
INDEX idx_mfa_recovery_used (used),
INDEX idx_mfa_recovery_created (created_at),

-- Constraints
CONSTRAINT chk_mfa_recovery_used_at CHECK (
        used = FALSE OR (used = TRUE AND used_at IS NOT NULL)
    )
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci 
  COMMENT='One-time recovery codes for MFA bypass';

-- ============================================================================
-- Update usuarios table to add MFA enforcement by role
-- ============================================================================

-- Add a field to enforce MFA for specific roles
ALTER TABLE usuarios
ADD COLUMN mfa_required BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'MFA required for this role',
ADD
INDEX idx_usuarios_mfa_required (mfa_required);

-- Set MFA as required for admin and moderator roles
UPDATE usuarios
SET
    mfa_required = TRUE
WHERE
    rol IN ('admin', 'moderador');

-- ============================================================================
-- Trigger to automatically set mfa_required based on role
-- ============================================================================

DELIMITER / /

CREATE TRIGGER tr_usuarios_role_mfa_required
    BEFORE INSERT ON usuarios
    FOR EACH ROW
BEGIN
    IF NEW.rol IN ('admin', 'moderador') THEN
        SET NEW.mfa_required = TRUE;
    END IF;
END//

CREATE TRIGGER tr_usuarios_role_update_mfa_required
    BEFORE UPDATE ON usuarios
    FOR EACH ROW
BEGIN
    IF NEW.rol IN ('admin', 'moderador') AND OLD.rol NOT IN ('admin', 'moderador') THEN
        SET NEW.mfa_required = TRUE;
    ELSEIF NEW.rol NOT IN ('admin', 'moderador') AND OLD.rol IN ('admin', 'moderador') THEN
        SET NEW.mfa_required = FALSE;
    END IF;
END//

DELIMITER;

-- ============================================================================
-- Clean up old MFA attempts (older than 24 hours)
-- ============================================================================

-- Create an event to clean up old MFA attempts (requires event scheduler)
SET GLOBAL event_scheduler = ON;

DELIMITER / /

CREATE EVENT ev_cleanup_mfa_attempts
    ON SCHEDULE EVERY 1 HOUR
    DO
    BEGIN
        DELETE FROM mfa_attempts WHERE created_at < DATE_SUB(NOW(), INTERVAL 24 HOUR);
    END//

DELIMITER;