"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { loginSchema, type LoginInput } from "@/schemas/auth.schema";
import { useToast } from "@/hooks/use-toast";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginForm() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isOAuthLoading, setIsOAuthLoading] = useState<string | null>(null);
    const [rememberMe, setRememberMe] = useState(false);

    const form = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginInput) => {
        setIsLoading(true);
        try {
            const result = await signIn("credentials", {
                email: data.email,
                password: data.password,
                remember: rememberMe,
                redirect: false,
            });

            if (result?.error) {
                // Handle different error codes
                if (result.error.includes("CredentialsSignin")) {
                    toast({
                        title: "Error de autenticación",
                        description: "Email o contraseña incorrectos",
                        variant: "destructive",
                    });
                } else if (result.error.includes("AccessDenied")) {
                    toast({
                        title: "Acceso denegado",
                        description: "Tu cuenta ha sido suspendida o no está activa",
                        variant: "destructive",
                    });
                } else {
                    toast({
                        title: "Error",
                        description:
                            "Ocurrió un error inesperado. Por favor, intenta de nuevo.",
                        variant: "destructive",
                    });
                }
            } else {
                // Success
                toast({
                    title: "¡Bienvenido de vuelta!",
                    description: "Has iniciado sesión correctamente",
                });
                router.push("/");
            }
        } catch (error) {
            console.error("Login error:", error);
            toast({
                title: "Error de conexión",
                description:
                    "No se pudo conectar con el servidor. Por favor, intenta de nuevo.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleOAuthSignIn = async (provider: "google" | "facebook") => {
        setIsOAuthLoading(provider);
        try {
            const result = await signIn(provider, {
                redirect: false,
            });

            if (result?.error) {
                toast({
                    title: "Error de autenticación",
                    description: `No se pudo iniciar sesión con ${provider}. Por favor, intenta de nuevo.`,
                    variant: "destructive",
                });
            } else {
                // Success
                toast({
                    title: "¡Bienvenido!",
                    description: `Has iniciado sesión correctamente con ${provider}`,
                });
                router.push("/");
            }
        } catch (error) {
            console.error(`${provider} login error:`, error);
            toast({
                title: "Error de conexión",
                description: `No se pudo conectar con ${provider}. Por favor, intenta de nuevo.`,
                variant: "destructive",
            });
        } finally {
            setIsOAuthLoading(null);
        }
    };

    return (
        <div className="w-full max-w-md">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                    role="form"
                    aria-label="Formulario de inicio de sesión"
                >
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel
                                        htmlFor="email"
                                        className="text-xs sm:text-sm font-medium text-gray-300"
                                    >
                                        Email del Negocio
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="Ingresa tu email"
                                            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-base"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel
                                        htmlFor="password"
                                        className="text-xs sm:text-sm font-medium text-gray-300"
                                    >
                                        Contraseña
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="Ingresa tu contraseña"
                                            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-base"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center space-x-2">
                        <input
                            id="remember"
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-500 bg-gray-600 text-purple-600 focus:ring-purple-500 cursor-pointer"
                        />
                        <label
                            htmlFor="remember"
                            className="text-xs sm:text-sm text-gray-300 cursor-pointer"
                        >
                            Recordarme en este dispositivo
                        </label>
                    </div>

                    {/* Forgot Links */}
                    <div className="space-y-2">
                        <Link
                            href="/password/forgot"
                            className="text-xs text-gray-400 hover:text-purple-400 transition-colors block"
                        >
                            ¿No recuerdas tu contraseña?
                        </Link>
                        <p
                            className="text-xs text-gray-400 hover:text-purple-400 cursor-pointer transition-colors"
                            onClick={() => router.push("/register")}
                        >
                            ¿No tienes cuenta? Regístrate
                        </p>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm sm:text-base"
                        disabled={isLoading}
                        aria-busy={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Iniciando sesión...
                            </>
                        ) : (
                            "Iniciar Sesión"
                        )}
                    </Button>
                </form>
            </Form>

            {/* OAuth Section */}
            <div className="mt-8">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-700" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="px-2 bg-gray-800 text-gray-400">
                            O continúa con
                        </span>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                    {/* Google OAuth */}
                    <Button
                        variant="outline"
                        className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white border-gray-600 disabled:bg-gray-700"
                        onClick={() => handleOAuthSignIn("google")}
                        disabled={isOAuthLoading === "google" || isLoading}
                        aria-busy={isOAuthLoading === "google"}
                        title="Iniciar sesión con Google"
                        aria-label="Iniciar sesión con Google"
                    >
                        {isOAuthLoading === "google" ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                        )}
                        Google
                    </Button>

                    {/* Facebook OAuth */}
                    <Button
                        variant="outline"
                        className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white border-gray-600 disabled:bg-gray-700"
                        onClick={() => handleOAuthSignIn("facebook")}
                        disabled={isOAuthLoading === "facebook" || isLoading}
                        aria-busy={isOAuthLoading === "facebook"}
                        title="Iniciar sesión con Facebook"
                        aria-label="Iniciar sesión con Facebook"
                    >
                        {isOAuthLoading === "facebook" ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                                />
                            </svg>
                        )}
                        Facebook
                    </Button>
                </div>
            </div>
        </div>
    );
}
