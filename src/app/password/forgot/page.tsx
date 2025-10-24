'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, Mail, ArrowLeft, CheckCircle } from 'lucide-react'
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

// Schema for email validation
const forgotPasswordSchema = z.object({
    email: z.string().email('Email inválido').trim().toLowerCase(),
})

type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const form = useForm<ForgotPasswordInput>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        },
    })

    const onSubmit = async (data: ForgotPasswordInput) => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/auth/password/forgot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                const errorData = await response.json()
                toast({
                    title: 'Error',
                    description: errorData.error || 'Ocurrió un error al procesar tu solicitud',
                    variant: 'destructive',
                })
                return
            }

            // Always show success message to prevent email enumeration
            setIsSubmitted(true)
            toast({
                title: 'Email enviado',
                description: 'Si el email está registrado, recibirás instrucciones para restablecer tu contraseña',
            })
        } catch (error) {
            console.error('Password reset request error:', error)
            toast({
                title: 'Error de conexión',
                description: 'No se pudo conectar con el servidor. Por favor, intenta de nuevo.',
                variant: 'destructive',
            })
        } finally {
            setIsLoading(false)
        }
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
                            <ArrowLeft className="w-5 h-5" />
                            <span>Volver al login</span>
                        </Link>
                        <div className="text-center">
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">
                                {isSubmitted ? 'Email Enviado' : 'Recuperar Contraseña'}
                            </h1>
                            <p className="text-xs sm:text-sm md:text-base text-gray-200">
                                {isSubmitted
                                    ? 'Revisa tu bandeja de entrada'
                                    : 'Ingresa tu email para recibir instrucciones'}
                            </p>
                        </div>
                        <div className="w-24"></div> {/* Spacer for alignment */}
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/20 p-3 sm:p-4 md:p-6 md:p-8 shadow-lg sm:shadow-2xl">
                        {!isSubmitted ? (
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="space-y-6"
                                    role="form"
                                    aria-label="Formulario de recuperación de contraseña"
                                >
                                    <div className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel
                                                        htmlFor="email"
                                                        className="text-sm font-medium text-gray-200"
                                                    >
                                                        Email del Negocio
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            id="email"
                                                            type="email"
                                                            placeholder="Ingresa tu email"
                                                            className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
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
                                                Enviando...
                                            </>
                                        ) : (
                                            <>
                                                <Mail className="w-4 h-4 mr-2" />
                                                Enviar Instrucciones
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </Form>
                        ) : (
                            <div className="text-center space-y-6">
                                <div className="flex justify-center">
                                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-8 h-8 text-green-400" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold text-white">
                                        Revisa tu email
                                    </h3>
                                    <p className="text-gray-200 text-sm">
                                        Hemos enviado instrucciones para restablecer tu contraseña a la dirección de email proporcionada.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <Alert className="bg-white/10 border-white/20">
                                        <AlertDescription className="text-gray-200 text-sm">
                                            <strong>Importante:</strong> Si no recibes el email en unos minutos, revisa tu carpeta de spam o correo no deseado.
                                        </AlertDescription>
                                    </Alert>

                                    <div className="space-y-2">
                                        <p className="text-gray-300 text-sm">
                                            ¿No recibiste el email?
                                        </p>
                                        <Button
                                            variant="outline"
                                            className="bg-white/20 text-gray-200 border-white/30 hover:bg-white/30"
                                            onClick={() => setIsSubmitted(false)}
                                        >
                                            Reintentar
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mt-6 text-center">
                            <Link
                                href="/login"
                                className="text-xs text-gray-300 hover:text-yellow-400 transition-colors"
                            >
                                Volver al inicio de sesión
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}