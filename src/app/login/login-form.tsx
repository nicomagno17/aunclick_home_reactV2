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
        </div>
    );
}
