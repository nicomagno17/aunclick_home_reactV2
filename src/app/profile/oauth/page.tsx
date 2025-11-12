"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Unlink, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export default function OAuthManagementPage() {
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [connectedProviders, setConnectedProviders] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            window.location.href = "/login";
        }
    }, [status]);

    useEffect(() => {
        // Check which OAuth providers are connected
        // This would typically come from the session or a separate API call
        const checkConnectedProviders = async () => {
            if (session?.user) {
                try {
                    const response = await fetch("/api/auth/providers/status");
                    if (response.ok) {
                        const data = await response.json();
                        setConnectedProviders(data.connectedProviders || []);
                    }
                } catch (error) {
                    console.error("Error checking provider status:", error);
                }
            }
        };

        if (session) {
            checkConnectedProviders();
        }
    }, [session]);

    const handleConnectProvider = async (provider: string) => {
        setIsLoading(true);
        setError(null);

        try {
            await signIn(provider, {
                callbackUrl: "/profile/oauth",
                redirect: true,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al conectar proveedor");
            setIsLoading(false);
        }
    };

    const handleDisconnectProvider = async (provider: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/auth/oauth/revoke", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ provider }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error al desconectar proveedor");
            }

            const data = await response.json();
            toast.success(data.message);

            // Update connected providers list
            setConnectedProviders(prev => prev.filter(p => p !== provider));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al desconectar proveedor");
            toast.error("Error al desconectar proveedor");
        } finally {
            setIsLoading(false);
        }
    };

    if (status === "loading") {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!session) {
        return null;
    }

    const providers = [
        {
            id: "google",
            name: "Google",
            description: "Conecta tu cuenta de Google para iniciar sesión más fácilmente",
            icon: "🌐",
        },
        {
            id: "facebook",
            name: "Facebook",
            description: "Conecta tu cuenta de Facebook para iniciar sesión más fácilmente",
            icon: "📘",
        },
    ];

    return (
        <div className="container mx-auto max-w-2xl px-4 py-12">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Conexiones OAuth</h1>
                    <p className="text-muted-foreground">
                        Gestiona tus conexiones con proveedores externos para facilitar el inicio de sesión.
                    </p>
                </div>

                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="space-y-4">
                    {providers.map((provider) => {
                        const isConnected = connectedProviders.includes(provider.id);

                        return (
                            <Card key={provider.id}>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <span className="text-2xl">{provider.icon}</span>
                                        {provider.name}
                                    </CardTitle>
                                    <CardDescription>{provider.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {isConnected ? (
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-green-600">
                                                <div className="h-2 w-2 rounded-full bg-green-600" />
                                                Conectado
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDisconnectProvider(provider.id)}
                                                disabled={isLoading}
                                            >
                                                {isLoading ? (
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Unlink className="mr-2 h-4 w-4" />
                                                )}
                                                Desconectar
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button
                                            onClick={() => handleConnectProvider(provider.id)}
                                            disabled={isLoading}
                                            className="w-full"
                                        >
                                            {isLoading ? (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            ) : (
                                                <ExternalLink className="mr-2 h-4 w-4" />
                                            )}
                                            Conectar {provider.name}
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Información de seguridad</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-muted-foreground">
                        <p>
                            • Las conexiones OAuth permiten iniciar sesión sin contraseña, pero siguen siendo seguras.
                        </p>
                        <p>
                            • Puedes revocar el acceso en cualquier momento desde aquí o desde la configuración del proveedor.
                        </p>
                        <p>
                            • Los tokens se refrescan automáticamente y se almacenan de forma segura.
                        </p>
                        <p>
                            • Si desconectas un proveedor, deberás usar tu contraseña para iniciar sesión.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}