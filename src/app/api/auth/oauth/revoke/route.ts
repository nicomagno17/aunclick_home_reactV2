import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../[...nextauth]/route";
import { executeQuerySingle } from "@/lib/database";
import logger from "@/lib/logger";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "No autorizado" },
                { status: 401 }
            );
        }

        const { provider } = await request.json();

        if (!provider || !['google', 'facebook'].includes(provider)) {
            return NextResponse.json(
                { error: "Proveedor no válido" },
                { status: 400 }
            );
        }

        const userId = session.user.id;

        // Get the user's OAuth tokens
        const userTokens = await executeQuerySingle<any>(
            'SELECT access_token, refresh_token FROM usuarios WHERE id = ?',
            [userId]
        );

        if (!userTokens) {
            return NextResponse.json(
                { error: "Usuario no encontrado" },
                { status: 404 }
            );
        }

        // Revoke tokens with the provider
        let revokeSuccess = false;

        if (provider === 'google' && userTokens.access_token) {
            try {
                const response = await fetch('https://oauth2.googleapis.com/revoke', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        token: userTokens.access_token,
                    }),
                });

                revokeSuccess = response.ok;
            } catch (error) {
                logger.error('Error revoking Google token:', error);
            }
        } else if (provider === 'facebook' && userTokens.access_token) {
            try {
                const response = await fetch(`https://graph.facebook.com/me/permissions?access_token=${userTokens.access_token}`, {
                    method: 'DELETE',
                });

                revokeSuccess = response.ok;
            } catch (error) {
                logger.error('Error revoking Facebook token:', error);
            }
        }

        // Clear tokens from database regardless of revocation success
        await executeQuerySingle(
            'UPDATE usuarios SET access_token = NULL, refresh_token = NULL, token_expires_at = NULL WHERE id = ?',
            [userId]
        );

        logger.info('OAuth tokens revoked', {
            userId: userId.toString(),
            provider,
            revokeSuccess,
        });

        return NextResponse.json({
            success: true,
            message: revokeSuccess
                ? `Tokens de ${provider} revocados exitosamente`
                : `Tokens de ${provider} eliminados localmente. Puede requerir revocación manual en ${provider}.`,
        });

    } catch (error) {
        logger.error('Error in OAuth revoke:', error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}