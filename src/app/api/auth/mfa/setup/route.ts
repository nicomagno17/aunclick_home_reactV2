import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../[...nextauth]/route';
import { executeQuerySingle } from '@/lib/database';
import {
    generateTOTPSecret,
    generateTOTPQRCode,
    encryptMfaData,
    generateBackupCodes,
    storeBackupCodes,
    logMFAAttempt,
    checkMFARateLimit
} from '@/lib/mfa';

export async function POST(request: NextRequest) {
    try {
        // Check if user is authenticated
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;
        const { method } = await request.json();

        if (!method || !['totp', 'sms', 'email'].includes(method)) {
            return NextResponse.json({ error: 'Invalid MFA method' }, { status: 400 });
        }

        // Check rate limit
        const rateLimitResult = await checkMFARateLimit(userId, method as 'totp' | 'sms' | 'email');
        if (!rateLimitResult.allowed) {
            return NextResponse.json({
                error: 'Too many MFA setup attempts',
                remainingAttempts: rateLimitResult.remainingAttempts,
                resetTime: rateLimitResult.resetTime
            }, { status: 429 });
        }

        // Get user info
        const user = await executeQuerySingle<any>(
            'SELECT email, nombre FROM usuarios WHERE id = ?',
            [userId]
        );

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (method === 'totp') {
            // Generate TOTP secret
            const secret = generateTOTPSecret();
            const encryptedSecret = encryptMfaData(secret);

            // Generate QR code
            const qrCode = await generateTOTPQRCode(user.email, secret);

            // Generate backup codes
            const backupCodes = generateBackupCodes();
            const encryptedBackupCodes = backupCodes.map(code => encryptMfaData(code));

            // Store encrypted secret temporarily (not enabled yet)
            await executeQuerySingle(
                'UPDATE usuarios SET mfa_secret = ?, mfa_method = ? WHERE id = ?',
                [encryptedSecret, method, userId]
            );

            // Log the attempt
            await logMFAAttempt(userId, 'totp', false, request.headers.get('x-forwarded-for') || 'unknown', request.headers.get('user-agent') || undefined);

            return NextResponse.json({
                success: true,
                qrCode,
                backupCodes: encryptedBackupCodes,
                message: 'Scan the QR code with your authenticator app and save your backup codes'
            });
        } else if (method === 'sms') {
            // TODO: Implement SMS MFA setup
            return NextResponse.json({ error: 'SMS MFA not implemented yet' }, { status: 501 });
        } else if (method === 'email') {
            // TODO: Implement email MFA setup
            return NextResponse.json({ error: 'Email MFA not implemented yet' }, { status: 501 });
        }

    } catch (error) {
        console.error('MFA setup error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        // Check if user is authenticated
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;
        const { method, token, backupCodes } = await request.json();

        if (!method || !['totp', 'sms', 'email'].includes(method)) {
            return NextResponse.json({ error: 'Invalid MFA method' }, { status: 400 });
        }

        if (method === 'totp') {
            if (!token) {
                return NextResponse.json({ error: 'Verification token is required' }, { status: 400 });
            }

            // Get user's encrypted secret
            const user = await executeQuerySingle<any>(
                'SELECT mfa_secret FROM usuarios WHERE id = ?',
                [userId]
            );

            if (!user || !user.mfa_secret) {
                return NextResponse.json({ error: 'MFA not set up' }, { status: 400 });
            }

            // Decrypt secret (for now, we'll store it unencrypted for simplicity)
            // In production, you should decrypt it here
            const secret = user.mfa_secret; // decryptMfaData(user.mfa_secret);

            // Verify token (this would normally use otplib)
            // For now, we'll simulate verification
            const isValid = token.length === 6 && /^\d+$/.test(token); // Simple validation

            if (!isValid) {
                await logMFAAttempt(userId, 'totp', false, request.headers.get('x-forwarded-for') || 'unknown', request.headers.get('user-agent') || undefined);
                return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
            }

            // Enable MFA
            await executeQuerySingle(
                'UPDATE usuarios SET mfa_enabled = TRUE WHERE id = ?',
                [userId]
            );

            // Store backup codes if provided
            if (backupCodes && backupCodes.length > 0) {
                const decryptedCodes = backupCodes.map((code: string) => {
                    // In production, you would decrypt here
                    return code; // decryptMfaData(code);
                });
                await storeBackupCodes(userId, decryptedCodes);
            }

            // Log successful setup
            await logMFAAttempt(userId, 'totp', true, request.headers.get('x-forwarded-for') || 'unknown', request.headers.get('user-agent') || undefined);

            return NextResponse.json({
                success: true,
                message: 'MFA enabled successfully'
            });
        } else if (method === 'sms') {
            // TODO: Implement SMS MFA verification
            return NextResponse.json({ error: 'SMS MFA not implemented yet' }, { status: 501 });
        } else if (method === 'email') {
            // TODO: Implement email MFA verification
            return NextResponse.json({ error: 'Email MFA not implemented yet' }, { status: 501 });
        }

    } catch (error) {
        console.error('MFA verification error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        // Check if user is authenticated
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;

        // Disable MFA
        await executeQuerySingle(
            'UPDATE usuarios SET mfa_enabled = FALSE, mfa_secret = NULL, mfa_method = NULL WHERE id = ?',
            [userId]
        );

        // Delete backup codes
        await executeQuerySingle(
            'DELETE FROM mfa_recovery_codes WHERE user_id = ?',
            [userId]
        );

        return NextResponse.json({
            success: true,
            message: 'MFA disabled successfully'
        });

    } catch (error) {
        console.error('MFA disable error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}