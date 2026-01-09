'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, Eye, CreditCard, Building2, Crown, Banknote, Home } from 'lucide-react'
import { registerSchema, type RegisterInput } from '@/schemas/register.schema'
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
import { Textarea } from '@/components/ui/textarea'
import { PlansPopup } from '@/components/plans-popup'
import { TermsConditionsPopup } from '@/components/terms-conditions-popup'
import { PaymentInstructionsPopup } from '@/components/payment-instructions-popup'

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [showPasswordHelp, setShowPasswordHelp] = useState(false)
  const [showPlansModal, setShowPlansModal] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [showPaymentInstructions, setShowPaymentInstructions] = useState(false)
  const [wordCount, setWordCount] = useState(30)
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      rut: '',
      birthDate: '',
      gender: 'masculino',
      phone: '',
      region: '',
      commune: '',
      address: '',
      username: '',
      email: '',
      backupEmail: '',
      password: '',
      confirmPassword: '',
      selectedPlan: 'gratuito',
      cardNumber: '',
      cardHolderName: '',
      cardExpiryDate: '',
      cardCvv: '',
      cardType: 'credito',
      rut: '',
      businessName: '',
      businessAddress: '',
      businessPhone: '',
      businessWhatsApp: '',
      businessEmail: '',
      businessOwner: '',
      businessFeature: '',
    },
  })


  // Auto-fill function with sample data
  const handleAutoFill = () => {
    console.log('🔧 Autollenado activado para step:', step)

    if (step === 1) {
      console.log('📝 Llenando campos del paso 1')
      form.setValue('firstName', 'Juan')
      form.setValue('lastName', 'Pérez')
      form.setValue('rut', '12.345.678-9')
      form.setValue('birthDate', '1990-01-15')
      form.setValue('gender', 'masculino')
      form.setValue('phone', '+56 9 1234 5678')
      form.setValue('email', 'juan.perez@email.com')
      form.setValue('backupEmail', 'juan.perez@email.com')
      form.setValue('region', 'metropolitana')
      form.setValue('commune', 'santiago')
      form.setValue('address', 'Av. Providencia 1234, Santiago')
      form.setValue('password', 'Password123!')
      form.setValue('confirmPassword', 'Password123!')
      console.log('✅ Paso 1 completado')
    } else if (step === 2) {
      console.log('📝 Llenando campos del paso 2')
      form.setValue('selectedPlan', 'normal')
      console.log('✅ Paso 2 completado')
    } else if (step === 3) {
      console.log('📝 Llenando campos del paso 3')
      const sampleFeature = 'Venta de productos electrónicos y accesorios de alta calidad'
      const wordsInSample = sampleFeature.trim().split(/\s+/).length
      form.setValue('businessName', 'Tienda de Ejemplo')
      form.setValue('businessAddress', 'Calle Falsa 123, Santiago')
      form.setValue('businessPhone', '+56 2 1234 5678')
      form.setValue('businessWhatsApp', '+56 9 1234 5678')
      form.setValue('businessEmail', 'info@tiendadeejemplo.cl')
      form.setValue('businessFeature', sampleFeature)
      setWordCount(30 - wordsInSample)
      console.log('✅ Paso 3 completado')
    }
  }

  const nextStep = async () => {
    let isValid = false

    if (step === 1) {
      isValid = await form.trigger([
        'firstName', 'lastName', 'rut', 'birthDate', 'gender',
        'phone', 'region', 'commune', 'address', 'email', 'backupEmail',
        'password', 'confirmPassword'
      ])
    } else if (step === 2) {
      isValid = await form.trigger(['selectedPlan'])
      if (isValid) {
        const selectedPlan = form.getValues('selectedPlan')
        // Si es un plan de pago, mostrar popup de instrucciones
        if (selectedPlan === 'normal' || selectedPlan === 'premium') {
          setShowPaymentInstructions(true)
          return // No avanzar el paso aún
        }
        // Si es gratuito, avanzar directamente
        setStep(3)
        return
      }
    }

    if (isValid && step < 3) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  const handlePaymentInstructionsClose = () => {
    setShowPaymentInstructions(false)
    setStep(3)
  }

  const onSubmit = async (data: RegisterInput) => {
    // Validar que los términos hayan sido aceptados
    if (!acceptedTerms) {
      toast({
        title: 'Términos y condiciones requeridos',
        description: 'Debes aceptar los términos y condiciones para completar el registro',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    try {
      // Submit registration data to API
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Paso 1: Información Personal
          firstName: data.firstName,
          lastName: data.lastName,
          rut: data.rut,
          birthDate: data.birthDate,
          gender: data.gender,
          phone: data.phone,
          region: data.region,
          commune: data.commune,
          address: data.address,
          email: data.email,
          backupEmail: data.backupEmail,
          password: data.password,
          confirmPassword: data.confirmPassword,
          // Paso 2: Plan
          selectedPlan: data.selectedPlan,
          // Paso 3: Información del Negocio
          businessName: data.businessName,
          businessAddress: data.businessAddress,
          businessPhone: data.businessPhone,
          businessWhatsApp: data.businessWhatsApp,
          businessEmail: data.businessEmail,
          businessFeature: data.businessFeature,
          acceptedTerms: acceptedTerms,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        if (response.status === 400 && result.message.includes('correo electrónico ya está registrado')) {
          toast({
            title: 'Email ya registrado',
            description: 'Este email ya está registrado en el sistema',
            variant: 'destructive',
          })
        } else {
          toast({
            title: 'Error en el registro',
            description: result.message || 'Ocurrió un error durante el registro',
            variant: 'destructive',
          })
        }
        return
      }

      // Success - Mostrar mensaje y redirigir
      toast({
        title: '¡Registro exitoso!',
        description: 'Tu cuenta ha sido creada correctamente. Serás redirigido al inicio de sesión.',
      })

      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        router.push('/login')
      }, 2000)

    } catch (error) {
      console.error('Registration error:', error)
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
    <>
      <style jsx>{`
        @keyframes purplePulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 15px rgba(147, 51, 234, 0.6);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 25px rgba(147, 51, 234, 0.9);
          }
        }

        .animate-purple-pulse {
          background-color: rgb(147, 51, 234) !important;
          border-color: rgb(147, 51, 234) !important;
          animation: purplePulse 2s ease-in-out infinite;
        }

        .animate-purple-pulse:hover {
          animation: none;
          background-color: rgb(126, 34, 206) !important;
          transform: perspective(1000px) rotateX(10deg) translateY(-5px);
          box-shadow: 0 15px 30px rgba(147, 51, 234, 0.8),
                      0 5px 15px rgba(0, 0, 0, 0.5);
          transition: all 0.3s ease;
        }
      `}</style>
      <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto py-4 px-2 sm:py-6 sm:px-4 md:py-8 md:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-4 sm:mb-6 md:mb-8">
            <Link href="/" className="flex flex-col items-center text-white hover:text-purple-400 transition-colors cursor-pointer group">
              <Home className="w-6 h-6 sm:w-7 sm:h-7 mb-0.5" />
              <span className="text-[10px] sm:text-xs font-medium">Home</span>
            </Link>
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2 tracking-tight">Registro</h1>
              <p className="text-xs sm:text-sm md:text-base text-gray-400">
                {step === 1
                  ? 'Información personal y acceso'
                  : step === 2
                    ? 'Tu plan'
                    : 'Información del negocio'}
              </p>
            </div>
            <div className="w-32"></div> {/* Spacer for alignment */}
          </div>

          {/* Progress Bar */}
          <div className="mb-4 sm:mb-6 md:mb-8">
            <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-6">
              {[1, 2, 3].map((stepNum) => (
                <div key={stepNum} className="flex flex-col items-center relative">
                  {/* Línea conectora */}
                  {stepNum < 3 && (
                    <div className={`absolute top-3 sm:top-4 left-full w-3 sm:w-4 md:w-6 h-0.5 sm:h-1 ${
                      step > stepNum ? 'bg-purple-600' : 'bg-gray-700'
                    }`}></div>
                  )}
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm relative z-10 ${step >= stepNum
                      ? 'bg-purple-600 text-white font-bold'
                      : 'bg-gray-700 text-gray-400'
                    }`}>
                    {stepNum}
                  </div>
                  <span className="mt-1 sm:mt-2 text-[10px] sm:text-xs text-gray-400">
                    {stepNum === 1 && 'Info Personal'}
                    {stepNum === 2 && 'Plan'}
                    {stepNum === 3 && 'Negocio'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Registration Form */}
          <div className="bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-700 p-4 sm:p-6 md:p-8 shadow-2xl">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 sm:space-y-3">
                {step === 1 && (
                  <div className="space-y-2 sm:space-y-3">
                    <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 pb-2 border-b-2 border-gray-700">Información Personal y Acceso</h2>

                    {/* First Row: Nombre y Apellidos */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs sm:text-sm font-semibold text-gray-300">Nombre</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-base"
                                placeholder="Tu nombre"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs sm:text-sm font-medium text-gray-300">Apellidos</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500 text-xs sm:text-base"
                                placeholder="Tus apellidos"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Second Row: RUT y Sexo */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <FormField
                        control={form.control}
                        name="rut"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs sm:text-sm font-medium text-gray-300">RUT</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500 text-xs sm:text-base"
                                placeholder="12.345.678-9"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs sm:text-sm font-medium text-gray-300">Sexo</FormLabel>
                            <FormControl>
                              <select
                                {...field}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs sm:text-base"
                              >
                                <option value="" className="bg-gray-800">Selecciona</option>
                                <option value="masculino" className="bg-gray-800">Masculino</option>
                                <option value="femenino" className="bg-gray-800">Femenino</option>
                                <option value="otro" className="bg-gray-800">Otro</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Third Row: Fecha de Nacimiento y Teléfono */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <FormField
                        control={form.control}
                        name="birthDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs sm:text-sm font-medium text-gray-300">Fecha de Nacimiento</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="date"
                                className="bg-white/20 border-white/30 text-white focus:ring-purple-500 text-xs sm:text-base"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs sm:text-sm font-medium text-gray-300">Teléfono</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="tel"
                                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500 text-xs sm:text-base"
                                placeholder="+56 9 1234 5678"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Fourth Row: Región y Comuna */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <FormField
                        control={form.control}
                        name="region"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs sm:text-sm font-medium text-gray-300">Región</FormLabel>
                            <FormControl>
                              <select
                                {...field}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs sm:text-base"
                              >
                                <option value="" className="bg-gray-800">Selecciona</option>
                                <option value="metropolitana" className="bg-gray-800">Metropolitana</option>
                                <option value="valparaiso" className="bg-gray-800">Valparaíso</option>
                                <option value="biobio" className="bg-gray-800">Biobío</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="commune"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs sm:text-sm font-medium text-gray-300">Comuna</FormLabel>
                            <FormControl>
                              <select
                                {...field}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs sm:text-base"
                              >
                                <option value="" className="bg-gray-800">Selecciona</option>
                                <option value="santiago" className="bg-gray-800">Santiago</option>
                                <option value="las-condes" className="bg-gray-800">Las Condes</option>
                                <option value="providencia" className="bg-gray-800">Providencia</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Fifth Row: Dirección */}
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs sm:text-sm font-medium text-gray-300">Dirección</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500 text-xs sm:text-base"
                              placeholder="Tu dirección completa"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Sixth Row: Correo Electrónico y Confirmar Correo */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs sm:text-sm font-medium text-gray-300">Correo Electrónico</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="email"
                                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500 text-xs sm:text-base"
                                placeholder="tu@email.com"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="backupEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs sm:text-sm font-medium text-gray-300">Confirmar Correo</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="email"
                                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500 text-xs sm:text-base"
                                placeholder="tu@email.com"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Seventh Row: Contraseña y Confirmar Contraseña */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center gap-2 mb-1">
                              <FormLabel className="text-xs sm:text-sm font-medium text-gray-300">Contraseña</FormLabel>
                              <Button
                                type="button"
                                onClick={() => setShowPasswordHelp(true)}
                                variant="ghost"
                                size="sm"
                                className="w-4 h-4 p-0 text-yellow-400 hover:text-yellow-300"
                              >
                                ?
                              </Button>
                            </div>
                            <FormControl>
                              <Input
                                {...field}
                                type="password"
                                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500 text-xs sm:text-base"
                                placeholder="Contraseña segura"
                              />
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
                            <FormLabel className="text-xs sm:text-sm font-medium text-gray-300">Repetir Contraseña</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="password"
                                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500 text-xs sm:text-base"
                                placeholder="Repite tu contraseña"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Password Help Popup */}
                    {showPasswordHelp && (
                      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                        <div className="bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-700 p-6 sm:p-8 max-w-md w-full shadow-2xl">
                          <div className="text-center">
                            <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Requisitos de Contraseña</h3>
                            <p className="text-gray-300 mb-4">
                              La contraseña debe cumplir con los siguientes requisitos:
                            </p>
                            <ul className="text-gray-300 text-left mb-4 space-y-2">
                              <li className="flex items-start gap-2">
                                <span className="text-purple-400">•</span>
                                <span>Mínimo 8 caracteres</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-purple-400">•</span>
                                <span>Al menos una letra mayúscula</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-purple-400">•</span>
                                <span>Al menos un número</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-purple-400">•</span>
                                <span>Al menos un carácter especial</span>
                              </li>
                            </ul>
                            <p className="text-gray-300 mb-4">
                              <strong>Ejemplo:</strong> Password123!
                            </p>
                            <Button
                              onClick={() => setShowPasswordHelp(false)}
                              className="bg-purple-600 hover:bg-purple-500 text-white font-bold"
                            >
                              Entendido
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Auto-fill and Next buttons */}
                    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-3 sm:mt-4">
                      <Button
                        type="button"
                        onClick={handleAutoFill}
                        variant="outline"
                        className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600 text-xs sm:text-sm px-3 sm:px-4"
                      >
                        Autocompletar
                      </Button>
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm px-3 sm:px-4"
                      >
                        Siguiente
                      </Button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-2 sm:space-y-3">
                    <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 text-center pb-2 border-b-2 border-gray-700">Tu Plan es</h2>

                    {/* Plan Selection */}
                    <FormField
                      control={form.control}
                      name="selectedPlan"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex justify-center">
                              {/* Plan Gratuito - Único plan visible */}
                              <div
                                onClick={() => field.onChange('gratuito')}
                                className={`cursor-pointer p-4 sm:p-6 rounded-lg border-2 transition-all max-w-sm ${
                                  field.value === 'gratuito'
                                    ? 'border-purple-500 bg-gray-700'
                                    : 'border-gray-600 bg-gray-800 hover:bg-gray-700'
                                }`}
                              >
                                <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
                                  <Building2 className="w-8 h-8 sm:w-12 sm:h-12 text-green-400" />
                                  <div className="space-y-1 sm:space-y-2">
                                    <h3 className="text-sm sm:text-lg md:text-xl font-bold text-white">Panel básico de administración</h3>
                                    <span className="text-xl sm:text-2xl font-bold text-green-400">$0</span>
                                  </div>
                                  <p className="text-xs sm:text-sm text-gray-300">
                                    Perfecto para empezar
                                  </p>
                                  <ul className="text-xs sm:text-sm text-gray-300 space-y-1 sm:space-y-2 text-left w-full">
                                    <li>• 5 imágenes</li>
                                    <li>• Página principal</li>
                                    <li>• Panel básico</li>
                                  </ul>
                                </div>
                              </div>

                              {/* TEMPORALMENTE OCULTO - Plan Normal */}
                              {/* <div
                                onClick={() => field.onChange('normal')}
                                className={`cursor-pointer p-2 sm:p-3 rounded-lg border-2 transition-all ${
                                  field.value === 'normal'
                                    ? 'border-purple-500 bg-gray-700'
                                    : 'border-gray-600 bg-gray-800 hover:bg-gray-700'
                                }`}
                              >
                                <div className="flex flex-col items-center text-center space-y-1 sm:space-y-2">
                                  <CreditCard className="w-5 h-5 sm:w-8 sm:h-8 text-blue-400" />
                                  <div className="space-y-0.5 sm:space-y-1">
                                    <h3 className="text-xs sm:text-sm md:text-base font-bold text-white">Plan Normal</h3>
                                    <div className="flex items-center justify-center gap-1">
                                      <span className="text-base sm:text-xl font-bold text-blue-400">$2.990</span>
                                      <span className="text-[8px] sm:text-[10px] text-gray-300">/mes</span>
                                    </div>
                                    <span className="inline-block px-1.5 py-0.5 bg-yellow-400 text-purple-900 text-[7px] sm:text-[9px] font-bold rounded-full">
                                      RECOMENDADO
                                    </span>
                                  </div>
                                  <p className="text-[9px] sm:text-xs text-gray-300">
                                    Ideal para crecer
                                  </p>
                                  <ul className="text-[9px] sm:text-xs text-gray-300 space-y-0.5 sm:space-y-1 text-left w-full">
                                    <li>• 25 imágenes</li>
                                    <li>• 1 Carrusel</li>
                                    <li>• Prioridad alta</li>
                                  </ul>
                                </div>
                              </div> */}

                              {/* TEMPORALMENTE OCULTO - Plan Premium */}
                              {/* <div className="col-span-2 md:col-span-1 flex justify-center">
                                <div
                                  onClick={() => field.onChange('premium')}
                                  className={`cursor-pointer p-2 sm:p-3 rounded-lg border-2 transition-all w-1/2 md:w-full ${
                                    field.value === 'premium'
                                      ? 'border-purple-500 bg-gray-700'
                                      : 'border-gray-600 bg-gray-800 hover:bg-gray-700'
                                  }`}
                                >
                                  <div className="flex flex-col items-center text-center space-y-1 sm:space-y-2">
                                    <Crown className="w-5 h-5 sm:w-8 sm:h-8 text-orange-400" />
                                    <div className="space-y-0.5 sm:space-y-1">
                                      <h3 className="text-xs sm:text-sm md:text-base font-bold text-white">Plan Premium</h3>
                                      <div className="flex items-center justify-center gap-1">
                                        <span className="text-base sm:text-xl font-bold text-orange-400">$4.990</span>
                                        <span className="text-[8px] sm:text-[10px] text-gray-300">/mes</span>
                                      </div>
                                      <span className="inline-block px-1.5 py-0.5 bg-orange-400 text-black text-[7px] sm:text-[9px] font-bold rounded-full">
                                        MEJOR OPCIÓN
                                      </span>
                                      <div className="bg-gradient-to-r from-green-600 to-green-500 px-2 py-0.5 rounded text-[7px] sm:text-[9px] font-bold text-white mt-1">
                                        ¡Paga 2 meses, lleva 3! 🎉
                                      </div>
                                      <p className="text-[7px] sm:text-[8px] text-green-300 italic">
                                        *Solo clientes nuevos
                                      </p>
                                    </div>
                                    <p className="text-[9px] sm:text-xs text-gray-300">
                                      Máxima visibilidad
                                    </p>
                                    <ul className="text-[9px] sm:text-xs text-gray-300 space-y-0.5 sm:space-y-1 text-left w-full">
                                      <li>• 100 imágenes</li>
                                      <li>• 2 Carruseles</li>
                                      <li>• Prioridad máxima</li>
                                      <li>• + Estadísticas</li>
                                    </ul>
                                  </div>
                                </div>
                              </div> */}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* TEMPORALMENTE OCULTO - Ver Detalles de Planes */}
                    {/* <div className="flex justify-center">
                      <Button
                        type="button"
                        onClick={() => setShowPlansModal(true)}
                        className="animate-purple-pulse text-white flex items-center gap-2 font-bold px-6 py-3 text-sm"
                      >
                        <Eye className="w-5 h-5" />
                        Ver comparación detallada de planes
                      </Button>
                    </div> */}

                    {/* Botones de navegación */}
                    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-3 sm:mt-4">
                      <Button
                        type="button"
                        onClick={prevStep}
                        variant="outline"
                        className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600 text-xs sm:text-sm px-3 sm:px-4"
                      >
                        Anterior
                      </Button>
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm px-3 sm:px-4"
                      >
                        Siguiente
                      </Button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-2 sm:space-y-3">
                    <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 text-center pb-2 border-b-2 border-gray-700">Información del Negocio</h2>

                    {/* Business Name and Address - Same row, equal space */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                      <FormField
                        control={form.control}
                        name="businessName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs sm:text-sm font-medium text-gray-300">Nombre del Negocio</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500 text-xs sm:text-base"
                                placeholder="Ingresa el nombre del negocio"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="businessAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs sm:text-sm font-medium text-gray-300">Dirección</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500 text-xs sm:text-base"
                                placeholder="Ingresa la dirección completa"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Business Phone, WhatsApp and Email - Mobile: Phone & WhatsApp side by side, Desktop: all 3 side by side */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
                      <FormField
                        control={form.control}
                        name="businessPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs sm:text-sm font-medium text-gray-300">Teléfono</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="tel"
                                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500 text-xs sm:text-base"
                                placeholder="Ingresa el número"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="businessWhatsApp"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs sm:text-sm font-medium text-gray-300">WhatsApp (Opcional)</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="tel"
                                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500 text-xs sm:text-base"
                                placeholder="Ingresa el número"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="businessEmail"
                        render={({ field }) => (
                          <FormItem className="col-span-2 md:col-span-1">
                            <FormLabel className="text-xs sm:text-sm font-medium text-gray-300">Email del Negocio</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="email"
                                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500 text-xs sm:text-base"
                                placeholder="Email del negocio"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Business Feature */}
                    <FormField
                      control={form.control}
                      name="businessFeature"
                      render={({ field }) => {
                        const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
                          const text = e.target.value

                          // Si el texto está vacío, resetear el contador
                          if (!text || text.trim() === '') {
                            field.onChange('')
                            setWordCount(30)
                            return
                          }

                          const words = text.trim().split(/\s+/).filter(word => word.length > 0)
                          const currentWordCount = words.length

                          // Limitar a 30 palabras
                          if (currentWordCount <= 30) {
                            field.onChange(text)
                            setWordCount(30 - currentWordCount)
                          } else {
                            // Si excede, tomar solo las primeras 30 palabras
                            const limitedText = words.slice(0, 30).join(' ')
                            field.onChange(limitedText)
                            setWordCount(0)
                          }
                        }

                        return (
                          <FormItem>
                            <FormLabel className="text-xs sm:text-sm font-medium text-gray-300">
                              Característica del Negocio (máximo 30 palabras)
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                onChange={handleTextChange}
                                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500 min-h-[100px] text-xs sm:text-base"
                                placeholder="Describe una característica distintiva de tu negocio"
                              />
                            </FormControl>
                            <div className="flex justify-between items-center mt-1">
                              <FormMessage />
                              <span className={`text-xs font-medium ${
                                wordCount <= 10 ? 'text-red-400' :
                                wordCount <= 20 ? 'text-yellow-400' :
                                'text-gray-400'
                              }`}>
                                {wordCount} {wordCount === 1 ? 'palabra restante' : 'palabras restantes'}
                              </span>
                            </div>
                          </FormItem>
                        )
                      }}
                    />

                    {/* Terms & Conditions Acceptance */}
                    <div className="flex items-start gap-3 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                      <input
                        type="checkbox"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        className="mt-1 w-4 h-4 rounded border-gray-500 bg-gray-600 text-purple-600 focus:ring-purple-500 cursor-pointer"
                      />
                      <label className="text-xs sm:text-sm text-gray-300">
                        <span
                          onClick={() => setShowTermsModal(true)}
                          className="underline cursor-pointer hover:text-purple-400 transition-colors"
                        >
                          Acepto términos y condiciones
                        </span>
                      </label>
                    </div>

                    {/* Auto-fill and Next/Previous buttons */}
                    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-3 sm:mt-4">
                      <Button
                        type="button"
                        onClick={handleAutoFill}
                        variant="outline"
                        className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600 text-xs sm:text-sm px-3 sm:px-4"
                      >
                        Autocompletar
                      </Button>
                      <Button
                        type="button"
                        onClick={prevStep}
                        variant="outline"
                        className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600 text-xs sm:text-sm px-3 sm:px-4"
                      >
                        Anterior
                      </Button>
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm px-3 sm:px-4"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 animate-spin" />
                            <span className="text-xs sm:text-sm">Registrando...</span>
                          </>
                        ) : (
                          'Completar Registro'
                        )}
                      </Button>
                    </div>
                  </div>
                )}

              </form>
            </Form>
          </div>
        </div>
      </div>

      {/* Modal de Planes */}
      <PlansPopup
        isOpen={showPlansModal}
        onClose={() => setShowPlansModal(false)}
      />

      {/* Modal de Términos y Condiciones */}
      <TermsConditionsPopup
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />

      {/* Modal de Instrucciones de Pago */}
      <PaymentInstructionsPopup
        isOpen={showPaymentInstructions}
        onClose={handlePaymentInstructionsClose}
        planName={form.watch('selectedPlan') === 'normal' ? 'Plan Normal' : 'Plan Premium'}
        planPrice={form.watch('selectedPlan') === 'normal' ? 2990 : 4990}
      />
      </div>
    </>
  )
}