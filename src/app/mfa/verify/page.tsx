"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, ShieldCheck, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { useSession, signIn } from "next-auth/react";

const mfaVerifySchema = z.object({
    code: z.string().min(6, "El código debe tener 6 dígitos").max(6, "El código debe tener 6 dígitos"),
    rememberDevice: z.boolean().default(false),
});

type MFAVerifyValues = z.infer<typeof mfaVerifySchema>;

function MFAVerifyContent() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [useBackupCode, setUseBackupCode] = useState(false);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [rememberMe, setRememberMe] = useState<boolean>(false);

    const form = useForm({
        resolver: zodResolver(mfaVerifySchema),
        defaultValues: {
            code: "",
            rememberDevice: false,
        },
    });

    useEffect(() => {
        // Get credentials from URL params or session storage
        const emailParam = searchParams.get("email");
        const passwordParam = searchParams.get("password");
        const rememberParam = searchParams.get("remember");

        if (emailParam) setEmail(emailParam);
        if (passwordParam) setPassword(passwordParam);
        if (rememberParam) setRememberMe(rememberParam === "true");

        // If already authenticated, redirect to dashboard
        if (status === "authenticated") {
            router.push("/dashboard");
        }
    }, [status, router, searchParams]);

    const onSubmit = async (values: any) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/auth/mfa/verify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token: values.code,
                    email,
                    password,
                    rememberMe,
                    rememberDevice: values.rememberDevice,
                    useBackupCode,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Error al verificar el código");
            }

            // Sign in with the provided session token
            const result = await signIn("credentials", {
                email,
                password,
                mfaSessionToken: data.sessionToken,
                redirect: false,
            });

            if (result?.error) {
                throw new Error("Error al iniciar sesión después de verificar MFA");
            }

            toast.success("Autenticación de dos factores verificada correctamente");
            router.push("/dashboard");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al verificar el código");
            toast.error("Error al verificar el código");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        try {
            const response = await fetch("/api/auth/mfa/resend", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                }),
            });

            if (!response.ok) {
                throw new Error("Error al reenviar el código");
            }

            toast.success("Código reenviado correctamente");
        } catch (err) {
            toast.error("Error al reenviar el código");
        }
    };

    if (status === "loading") {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="container mx-auto flex max-w-md flex-col justify-center px-4 py-12">
            <Card>
                <CardHeader className="space-y-1">
                    <CardTitle className="flex items-center gap-2 text-2xl">
                        <ShieldCheck className="h-6 w-6" />
                        Verificación de Dos Factores
                    </CardTitle>
                    <CardDescription>
                        Introduce el código de tu aplicación de autenticación para continuar.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={e => { e.preventDefault(); form.handleSubmit(onSubmit)(); }} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="code">
                                {useBackupCode ? "Código de recuperación" : "Código de verificación"}
                            </Label>
                            <Input
                                id="code"
                                placeholder={useBackupCode ? "XXXX-XXXX-XXXX" : "000000"}
                                maxLength={useBackupCode ? 14 : 6}
                                {...form.register("code")}
                                className="text-center text-lg tracking-widest"
                            />
                            {form.formState.errors.code && (
                                <p className="text-sm text-destructive">{form.formState.errors.code.message}</p>
                            )}
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="rememberDevice"
                                checked={form.watch("rememberDevice")}
                                onCheckedChange={(checked) => form.setValue("rememberDevice", checked as boolean)}
                            />
                            <Label htmlFor="rememberDevice" className="text-sm font-normal">
                                Recordar este dispositivo por 30 días
                            </Label>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Verificando...
                                </>
                            ) : (
                                "Verificar"
                            )}
                        </Button>
                    </form>

                    <div className="space-y-2">
                        <Button
                            type="button"
                            variant="ghost"
                            className="w-full"
                            onClick={() => setUseBackupCode(!useBackupCode)}
                        >
                            <Smartphone className="mr-2 h-4 w-4" />
                            {useBackupCode ? "Usar código de autenticación" : "Usar código de recuperación"}
                        </Button>

                        <Button
                            type="button"
                            variant="ghost"
                            className="w-full"
                            onClick={handleResendCode}
                        >
                            Reenviar código
                        </Button>
                    </div>

                    {useBackupCode && (
                        <Alert>
                            <AlertDescription>
                                Los códigos de recuperación son de un solo uso. Si usas todos tus códigos, deberás configurar
                                la autenticación de dos factores nuevamente.
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default function MFAVerifyPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        }>
            <MFAVerifyContent />
        </Suspense>
    );
}