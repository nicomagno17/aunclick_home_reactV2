"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, QrCode, ShieldCheck, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

const mfaSetupSchema = z.object({
    code: z.string().min(6, "El código debe tener 6 dígitos").max(6, "El código debe tener 6 dígitos"),
});

type MFASetupValues = z.infer<typeof mfaSetupSchema>;

export default function MFASetupPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
    const [secret, setSecret] = useState<string>("");
    const [backupCodes, setBackupCodes] = useState<string[]>([]);
    const [showBackupCodes, setShowBackupCodes] = useState(false);
    const [copiedSecret, setCopiedSecret] = useState(false);
    const [copiedCodes, setCopiedCodes] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<MFASetupValues>({
        resolver: zodResolver(mfaSetupSchema),
        defaultValues: {
            code: "",
        },
    });

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    useEffect(() => {
        generateMFASetup();
    }, []);

    const generateMFASetup = async () => {
        setIsGenerating(true);
        setError(null);

        try {
            const response = await fetch("/api/auth/mfa/setup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error al generar la configuración MFA");
            }

            const data = await response.json();
            setQrCodeUrl(data.qrCodeUrl);
            setSecret(data.secret);
            setBackupCodes(data.backupCodes);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al generar la configuración MFA");
            toast.error("Error al generar la configuración MFA");
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = (text: string, type: "secret" | "codes") => {
        navigator.clipboard.writeText(text);
        if (type === "secret") {
            setCopiedSecret(true);
            setTimeout(() => setCopiedSecret(false), 2000);
        } else {
            setCopiedCodes(true);
            setTimeout(() => setCopiedCodes(false), 2000);
        }
        toast.success("Copiado al portapapeles");
    };

    const onSubmit = async (values: MFASetupValues) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/auth/mfa/setup", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token: values.code,
                    secret,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error al verificar el código");
            }

            toast.success("Autenticación de dos factores configurada correctamente");
            router.push("/profile?mfa=enabled");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al verificar el código");
            toast.error("Error al verificar el código");
        } finally {
            setIsLoading(false);
        }
    };

    if (status === "loading" || isGenerating) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <div className="container mx-auto flex max-w-md flex-col justify-center px-4 py-12">
            <Card>
                <CardHeader className="space-y-1">
                    <CardTitle className="flex items-center gap-2 text-2xl">
                        <ShieldCheck className="h-6 w-6" />
                        Configurar Autenticación de Dos Factores
                    </CardTitle>
                    <CardDescription>
                        Escanea el código QR con tu aplicación de autenticación y verifica el código para activar la seguridad adicional.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {qrCodeUrl && (
                        <div className="flex flex-col items-center space-y-4">
                            <div className="rounded-lg border p-4">
                                <img src={qrCodeUrl} alt="Código QR para MFA" className="h-48 w-48" />
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Escanea este código con tu aplicación de autenticación (Google Authenticator, Authy, etc.)
                            </p>
                        </div>
                    )}

                    {secret && (
                        <div className="space-y-2">
                            <Label htmlFor="secret">Código secreto (si no puedes escanear el QR)</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="secret"
                                    value={secret}
                                    readOnly
                                    className="font-mono"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => copyToClipboard(secret, "secret")}
                                    className="shrink-0"
                                >
                                    {copiedSecret ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>
                    )}

                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="code">Código de verificación</Label>
                            <Input
                                id="code"
                                placeholder="000000"
                                maxLength={6}
                                {...form.register("code")}
                                className="text-center text-lg tracking-widest"
                            />
                            {form.formState.errors.code && (
                                <p className="text-sm text-destructive">{form.formState.errors.code.message}</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Verificando...
                                </>
                            ) : (
                                "Verificar y Activar"
                            )}
                        </Button>
                    </form>

                    {backupCodes.length > 0 && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>Códigos de recuperación</Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowBackupCodes(!showBackupCodes)}
                                >
                                    {showBackupCodes ? "Ocultar" : "Mostrar"}
                                </Button>
                            </div>
                            {showBackupCodes && (
                                <Alert>
                                    <AlertDescription>
                                        <p className="mb-2 text-sm font-medium">
                                            Guarda estos códigos en un lugar seguro. Solo puedes verlos una vez.
                                        </p>
                                        <div className="flex gap-2">
                                            <pre className="flex-1 rounded bg-muted p-2 text-xs">
                                                {backupCodes.join("\n")}
                                            </pre>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={() => copyToClipboard(backupCodes.join("\n"), "codes")}
                                                className="shrink-0"
                                            >
                                                {copiedCodes ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}