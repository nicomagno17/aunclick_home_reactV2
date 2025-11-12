import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../[...nextauth]/route";
import { executeQuerySingle } from "@/lib/database";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "No autorizado" },
                { status: 401 }
            );
        }

        const userId = session.user.id;

        // Check which OAuth providers have tokens stored
        const userTokens = await executeQuerySingle<any>(
            'SELECT access_token, refresh_token FROM usuarios WHERE id = ?',
            [userId]
        );

        const connectedProviders: string[] = [];

        // In a real implementation, you might want to validate tokens
        // For now, we just check if tokens exist
        if (userTokens?.access_token) {
            // This is a simplified check - in production you'd validate with providers
            // For Google, you could call https://www.googleapis.com/oauth2/v1/tokeninfo
            // For Facebook, you could call https://graph.facebook.com/me

            // For this implementation, we'll assume if tokens exist, providers are connected
            // In practice, you'd want to validate token validity
            connectedProviders.push('google'); // Simplified - you'd check which provider the token belongs to
            connectedProviders.push('facebook'); // Simplified
        }

        return NextResponse.json({
            connectedProviders,
        });

    } catch (error) {
        console.error('Error checking provider status:', error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}