'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Loader2, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'
import { z } from 'zod'
import { useToast } from '@/hooks/use-toast'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

// Schema for password reset validation
const resetPasswordSchema = z.object({
    password: z
        .string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .max(255, 'La contraseña no puede tener más de 255 caracteres')
        .regex(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
        .regex(/[0-9]/, 'La contraseña debe contener al menos un número')
        .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'La contraseña debe contener al menos un carácter especial')
        .trim(),
    confirmPassword: z
        .string()
        .trim(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
})

type ResetPasswordInput = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordPage() {
    const router = useRouter()
    const params = useParams()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [tokenError, setTokenError] = useState<string | null>(null)

    const token = params.token as string

    const form = useForm<ResetPasswordInput>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    })

    const onSubmit = async (data: ResetPasswordInput) => {
        setIsLoading(true)
        setTokenError(null)

        try {
            const response = await fetch('/api/auth/password/reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token,
                    password: data.password,
                }),
            })

            const responseData = await response.json()

            if (!response.ok) {
                setTokenError(responseData.error || 'Ocurrió un error al restablecer tu contraseña')
                toast({
                    title: 'Error',
                    description: responseData.error || 'Ocurrió un error al restablecer tu contraseña',
                    variant: 'destructive',
                })
                return
            }

            setIsSuccess(true)
            toast({
                title: 'Contraseña restablecida',
                description: 'Tu contraseña ha sido restablecida exitosamente',
            })
        } catch (error) {
            console.error('Password reset error:', error)
            setTokenError('No se pudo conectar con el servidor. Por favor, intenta de nuevo.')
            toast({
                title: 'Error de conexión',
                description: 'No se pudo conectar con el servidor. Por favor, intenta de nuevo.',
                variant: 'destructive',
            })
        } finally {
            setIsLoading(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
                <div className="container mx-auto py-4 px-2 sm:py-6 sm:px-4 md:py-8 md:px-6">
                    <div className="max-w-md mx-auto">
                        <div className="flex justify-between items-center mb-4 sm:mb-6 md:mb-8">
                            <div className="w-24"></div> {/* Spacer for alignment */}
                            <div className="text-center">
                                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">
                                    ¡Contraseña Restablecida!
                                </h1>
                                <p className="text-xs sm:text-sm md:text-base text-gray-200">
                                    Tu contraseña ha sido actualizada exitosamente
                                </p>
                            </div>
                            <div className="w-24"></div> {/* Spacer for alignment */}
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/20 p-3 sm:p-4 md:p-6 md:p-8 shadow-lg sm:shadow-2xl">
                            <div className="text-center space-y-6">
                                <div className="flex justify-center">
                                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-8 h-8 text-green-400" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold text-white">
                                        ¡Listo para continuar!
                                    </h3>
                                    <p className="text-gray-200 text-sm">
                                        Tu contraseña ha sido restablecida exitosamente. Ahora puedes iniciar sesión con tu nueva contraseña.
                                    </p>
                                </div>

                                <Button
                                    className="w-full px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 font-bold rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all shadow-lg"
                                    onClick={() => router.push('/login')}
                                >
                                    Iniciar Sesión
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
            <div className="container mx-auto py-4 px-2 sm:py-6 sm:px-4 md:py-8 md:px-6">
                <div className="max-w-md mx-auto">
                    <div className="flex justify-between items-center mb-4 sm:mb-6 md:mb-8">
                        <Link
                            href="/login"
                            className="flex items-center space-x-2 text-white hover:text-yellow-200 transition-colors cursor-pointer text-sm font-medium"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                            </svg>
                            <span>Volver al login</span>
                        </Link>
                        <div className="text-center">
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">
                                Restablecer Contraseña
                            </h1>
                            <p className="text-xs sm:text-sm md:text-base text-gray-200">
                                Ingresa tu nueva contraseña
                            </p>
                        </div>
                        <div className="w-24"></div> {/* Spacer for alignment */}
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/20 p-3 sm:p-4 md:p-6 md:p-8 shadow-lg sm:shadow-2xl">
                        {tokenError && (
                            <Alert className="mb-6 bg-red-500/10 border-red-500/30">
                                <AlertCircle className="h-4 w-4 text-red-400" />
                                <AlertDescription className="text-red-200">
                                    {tokenError}
                                </AlertDescription>
                            </Alert>
                        )}

                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-6"
                                role="form"
                                aria-label="Formulario de restablecimiento de contraseña"
                            >
                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel
                                                    htmlFor="password"
                                                    className="text-sm font-medium text-gray-200"
                                                >
                                                    Nueva Contraseña
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            id="password"
                                                            type={showPassword ? 'text' : 'password'}
                                                            placeholder="Ingresa tu nueva contraseña"
                                                            className="w-full px-3 py-2 pr-10 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                                            {...field}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-300 hover:text-white"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                                        >
                                                            {showPassword ? (
                                                                <EyeOff className="w-4 h-4" />
                                                            ) : (
                                                                <Eye className="w-4 h-4" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel
                                                    htmlFor="confirmPassword"
                                                    className="text-sm font-medium text-gray-200"
                                                >
                                                    Confirmar Contraseña
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            id="confirmPassword"
                                                            type={showConfirmPassword ? 'text' : 'password'}
                                                            placeholder="Repite tu nueva contraseña"
                                                            className="w-full px-3 py-2 pr-10 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                                            {...field}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-300 hover:text-white"
                                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                            aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                                        >
                                                            {showConfirmPassword ? (
                                                                <EyeOff className="w-4 h-4" />
                                                            ) : (
                                                                <Eye className="w-4 h-4" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="bg-white/5 rounded-lg p-3 space-y-2">
                                    <p className="text-xs text-gray-200 font-medium">Requisitos de contraseña:</p>
                                    <ul className="text-xs text-gray-300 space-y-1">
                                        <li>• Mínimo 8 caracteres</li>
                                        <li>• Al menos una letra mayúscula</li>
                                        <li>• Al menos un número</li>
                                        <li>• Al menos un carácter especial</li>
                                    </ul>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 font-bold rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all shadow-lg"
                                    disabled={isLoading}
                                    aria-busy={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Restableciendo...
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="w-4 h-4 mr-2" />
                                            Restablecer Contraseña
                                        </>
                                    )}
                                </Button>
                            </form>
                        </Form>

                        <div className="mt-6 text-center">
                            <Link
                                href="/password/forgot"
                                className="text-xs text-gray-300 hover:text-yellow-400 transition-colors"
                            >
                                Solicitar un nuevo enlace de restablecimiento
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}