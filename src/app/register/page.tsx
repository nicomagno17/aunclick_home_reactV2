'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
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

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [showPasswordHelp, setShowPasswordHelp] = useState(false)

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
    if (step === 1) {
      form.setValue('firstName', 'Juan')
      form.setValue('lastName', 'Pérez')
      form.setValue('rut', '12.345.678-9')
      form.setValue('birthDate', '1990-01-15')
      form.setValue('gender', 'masculino')
      form.setValue('phone', '+56 9 1234 5678')
      form.setValue('region', 'metropolitana')
      form.setValue('commune', 'santiago')
      form.setValue('address', 'Av. Providencia 1234, Santiago')
    } else if (step === 2) {
      form.setValue('username', 'juanperez')
      form.setValue('email', 'juan.perez@email.com')
      form.setValue('backupEmail', 'juan.perez.backup@email.com')
      form.setValue('password', 'Password123!')
      form.setValue('confirmPassword', 'Password123!')
    } else if (step === 3) {
      form.setValue('businessName', 'Tienda de Ejemplo')
      form.setValue('businessAddress', 'Calle Falsa 123, Santiago')
      form.setValue('businessPhone', '+56 2 1234 5678')
      form.setValue('businessWhatsApp', '+56 9 1234 5678')
      form.setValue('businessEmail', 'info@tiendadeejemplo.cl')
      form.setValue('businessOwner', 'María González')
      form.setValue('businessFeature', 'Venta de productos electrónicos y accesorios')
    }
  }

  const nextStep = async () => {
    let isValid = false

    if (step === 1) {
      isValid = await form.trigger([
        'firstName', 'lastName', 'rut', 'birthDate', 'gender',
        'phone', 'region', 'commune', 'address'
      ])
    } else if (step === 2) {
      isValid = await form.trigger([
        'username', 'email', 'backupEmail', 'password', 'confirmPassword'
      ])
    } else if (step === 3) {
      isValid = await form.trigger([
        'businessName', 'businessAddress', 'businessPhone',
        'businessWhatsApp', 'businessEmail', 'businessOwner', 'businessFeature'
      ])
    }

    if (isValid) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true)
    try {
      // Submit registration data to API
      const response = await fetch('/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: `${data.firstName} ${data.lastName}`,
          apellidos: data.lastName,
          email: data.email,
          password: data.password,
          telefono: data.phone,
          rol: 'propietario_negocio',
          estado: 'pendiente_verificacion',
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (response.status === 409) {
          toast({
            title: 'Email ya registrado',
            description: 'Este email ya está registrado en el sistema',
            variant: 'destructive',
          })
        } else {
          toast({
            title: 'Error en el registro',
            description: errorData.message || 'Ocurrió un error durante el registro',
            variant: 'destructive',
          })
        }
        return
      }

      // Success - auto login
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        // Registration successful but login failed - redirect to login page
        toast({
          title: 'Registro exitoso',
          description: 'Tu cuenta ha sido creada. Por favor, inicia sesión.',
        })
        router.push('/login')
      } else {
        // Both registration and login successful
        toast({
          title: '¡Bienvenido!',
          description: 'Tu cuenta ha sido creada y has iniciado sesión correctamente',
        })
        router.push('/')
      }
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <div className="container mx-auto py-4 px-2 sm:py-6 sm:px-4 md:py-8 md:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-4 sm:mb-6 md:mb-8">
            <Link href="/" className="flex items-center space-x-2 text-white hover:text-yellow-200 transition-colors cursor-pointer text-sm font-medium">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              <span>Volver al inicio</span>
            </Link>
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">Registro de Usuario</h1>
              <p className="text-xs sm:text-sm md:text-base text-gray-200">
                {step === 1
                  ? 'Información personal'
                  : step === 2
                    ? 'Información de acceso'
                    : step === 3
                      ? 'Información del negocio'
                      : 'Términos y condiciones'}
              </p>
            </div>
            <div className="w-32"></div> {/* Spacer for alignment */}
          </div>

          {/* Progress Bar */}
          <div className="mb-4 sm:mb-6 md:mb-8">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 sm:h-1 bg-purple-700 -z-10"></div>
              {[1, 2, 3, 4].map((stepNum) => (
                <div key={stepNum} className="flex flex-col items-center">
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm ${step >= stepNum
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 font-bold'
                      : 'bg-purple-700 text-gray-300'
                    }`}>
                    {stepNum}
                  </div>
                  <span className="mt-1 sm:mt-2 text-[10px] sm:text-xs text-gray-300">
                    {stepNum === 1 && 'Personal'}
                    {stepNum === 2 && 'Acceso'}
                    {stepNum === 3 && 'Negocio'}
                    {stepNum === 4 && 'Confirmar'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Registration Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/20 p-3 sm:p-4 md:p-6 md:p-8 shadow-lg sm:shadow-2xl">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                {step === 1 && (
                  <div className="space-y-4 sm:space-y-6">
                    <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Información Personal</h2>

                    {/* First Row: Nombre y Apellidos */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs sm:text-sm font-medium text-gray-200">Nombre</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="bg-white/20 border-white/30 text-white placeholder-gray-300 focus:ring-yellow-400"
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
                            <FormLabel className="text-xs sm:text-sm font-medium text-gray-200">Apellidos</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="bg-white/20 border-white/30 text-white placeholder-gray-300 focus:ring-yellow-400"
                                placeholder="Tus apellidos"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Second Row: RUT y Sexo */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                      <FormField
                        control={form.control}
                        name="rut"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs sm:text-sm font-medium text-gray-200">RUT</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="bg-white/20 border-white/30 text-white placeholder-gray-300 focus:ring-yellow-400"
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
                            <FormLabel className="text-xs sm:text-sm font-medium text-gray-200">Sexo</FormLabel>
                            <FormControl>
                              <select
                                {...field}
                                className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                              >
                                <option value="" className="bg-purple-900">Selecciona tu sexo</option>
                                <option value="masculino" className="bg-purple-900">Masculino</option>
                                <option value="femenino" className="bg-purple-900">Femenino</option>
                                <option value="otro" className="bg-purple-900">Otro</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Third Row: Fecha de Nacimiento y Teléfono */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                      <FormField
                        control={form.control}
                        name="birthDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs sm:text-sm font-medium text-gray-200">Fecha de Nacimiento</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="date"
                                className="bg-white/20 border-white/30 text-white focus:ring-yellow-400"
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
                            <FormLabel className="text-xs sm:text-sm font-medium text-gray-200">Teléfono</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="tel"
                                className="bg-white/20 border-white/30 text-white placeholder-gray-300 focus:ring-yellow-400"
                                placeholder="+56 9 1234 5678"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Fourth Row: Región y Comuna */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                      <FormField
                        control={form.control}
                        name="region"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs sm:text-sm font-medium text-gray-200">Región</FormLabel>
                            <FormControl>
                              <select
                                {...field}
                                className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                              >
                                <option value="" className="bg-purple-900">Selecciona tu región</option>
                                <option value="metropolitana" className="bg-purple-900">Región Metropolitana</option>
                                <option value="valparaiso" className="bg-purple-900">Región de Valparaíso</option>
                                <option value="biobio" className="bg-purple-900">Región del Biobío</option>
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
                            <FormLabel className="text-xs sm:text-sm font-medium text-gray-200">Comuna</FormLabel>
                            <FormControl>
                              <select
                                {...field}
                                className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                              >
                                <option value="" className="bg-purple-900">Selecciona tu comuna</option>
                                <option value="santiago" className="bg-purple-900">Santiago</option>
                                <option value="las-condes" className="bg-purple-900">Las Condes</option>
                                <option value="providencia" className="bg-purple-900">Providencia</option>
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
                          <FormLabel className="text-xs sm:text-sm font-medium text-gray-200">Dirección</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="bg-white/20 border-white/30 text-white placeholder-gray-300 focus:ring-yellow-400"
                              placeholder="Tu dirección completa"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Auto-fill and Next buttons */}
                    <div className="flex justify-between items-center mt-4 sm:mt-6 md:mt-8">
                      <Button
                        type="button"
                        onClick={handleAutoFill}
                        variant="outline"
                        className="bg-white/20 text-gray-200 border-white/30 hover:bg-white/30"
                      >
                        Autocompletar
                      </Button>
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 font-bold hover:from-yellow-500 hover:to-orange-600"
                      >
                        Siguiente
                      </Button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4 sm:space-y-6">
                    <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Información de Acceso</h2>

                    {/* Username */}
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs sm:text-sm font-medium text-gray-200">Nombre de Usuario</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="bg-white/20 border-white/30 text-white placeholder-gray-300 focus:ring-yellow-400"
                              placeholder="Nombre de usuario único"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Email Personal */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs sm:text-sm font-medium text-gray-200">Correo Electrónico Personal</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              className="bg-white/20 border-white/30 text-white placeholder-gray-300 focus:ring-yellow-400"
                              placeholder="tu@email.com"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Backup Email */}
                    <FormField
                      control={form.control}
                      name="backupEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs sm:text-sm font-medium text-gray-200">Correo Electrónico de Respaldo (Opcional)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              className="bg-white/20 border-white/30 text-white placeholder-gray-300 focus:ring-yellow-400"
                              placeholder="respaldo@email.com"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Password */}
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-2 mb-1">
                            <FormLabel className="text-xs sm:text-sm font-medium text-gray-200">Contraseña</FormLabel>
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
                              className="bg-white/20 border-white/30 text-white placeholder-gray-300 focus:ring-yellow-400"
                              placeholder="Contraseña segura"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Confirm Password */}
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs sm:text-sm font-medium text-gray-200">Repetir Contraseña</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              className="bg-white/20 border-white/30 text-white placeholder-gray-300 focus:ring-yellow-400"
                              placeholder="Repite tu contraseña"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Password Help Popup */}
                    {showPasswordHelp && (
                      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                        <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-xl sm:rounded-2xl border border-white/20 p-6 sm:p-8 max-w-md w-full shadow-2xl">
                          <div className="text-center">
                            <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Requisitos de Contraseña</h3>
                            <p className="text-gray-200 mb-4">
                              La contraseña debe cumplir con los siguientes requisitos:
                            </p>
                            <ul className="text-gray-200 text-left mb-4 space-y-2">
                              <li className="flex items-start gap-2">
                                <span className="text-yellow-400">•</span>
                                <span>Mínimo 8 caracteres</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-yellow-400">•</span>
                                <span>Al menos una letra mayúscula</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-yellow-400">•</span>
                                <span>Al menos un número</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-yellow-400">•</span>
                                <span>Al menos un carácter especial</span>
                              </li>
                            </ul>
                            <p className="text-gray-200 mb-4">
                              <strong>Ejemplo:</strong> Password123!
                            </p>
                            <Button
                              onClick={() => setShowPasswordHelp(false)}
                              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 font-bold hover:from-yellow-500 hover:to-orange-600"
                            >
                              Entendido
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Auto-fill and Next/Previous buttons */}
                    <div className="flex justify-between items-center mt-4 sm:mt-6 md:mt-8">
                      <Button
                        type="button"
                        onClick={handleAutoFill}
                        variant="outline"
                        className="bg-white/20 text-gray-200 border-white/30 hover:bg-white/30"
                      >
                        Autocompletar
                      </Button>
                      <div className="flex gap-2 sm:gap-3">
                        <Button
                          type="button"
                          onClick={prevStep}
                          variant="outline"
                          className="bg-white/20 text-gray-200 border-white/30 hover:bg-white/30"
                        >
                          Anterior
                        </Button>
                        <Button
                          type="button"
                          onClick={nextStep}
                          className="bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 font-bold hover:from-yellow-500 hover:to-orange-600"
                        >
                          Siguiente
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4 sm:space-y-6">
                    <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Información del Negocio</h2>

                    {/* Business Name */}
                    <FormField
                      control={form.control}
                      name="businessName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs sm:text-sm font-medium text-gray-200">Nombre del Negocio</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="bg-white/20 border-white/30 text-white placeholder-gray-300 focus:ring-yellow-400"
                              placeholder="Ingresa el nombre del negocio"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Business Address */}
                    <FormField
                      control={form.control}
                      name="businessAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs sm:text-sm font-medium text-gray-200">Dirección</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="bg-white/20 border-white/30 text-white placeholder-gray-300 focus:ring-yellow-400"
                              placeholder="Ingresa la dirección completa"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Business Phone and WhatsApp */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                      <FormField
                        control={form.control}
                        name="businessPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs sm:text-sm font-medium text-gray-200">Teléfono</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="tel"
                                className="bg-white/20 border-white/30 text-white placeholder-gray-300 focus:ring-yellow-400"
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
                            <FormLabel className="text-xs sm:text-sm font-medium text-gray-200">WhatsApp</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="tel"
                                className="bg-white/20 border-white/30 text-white placeholder-gray-300 focus:ring-yellow-400"
                                placeholder="Ingresa el número"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Business Email */}
                    <FormField
                      control={form.control}
                      name="businessEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs sm:text-sm font-medium text-gray-200">Email del Negocio</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              className="bg-white/20 border-white/30 text-white placeholder-gray-300 focus:ring-yellow-400"
                              placeholder="Ingresa el correo electrónico del negocio"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Business Owner */}
                    <FormField
                      control={form.control}
                      name="businessOwner"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs sm:text-sm font-medium text-gray-200">Nombre del Responsable del Negocio</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="bg-white/20 border-white/30 text-white placeholder-gray-300 focus:ring-yellow-400"
                              placeholder="Ingresa el nombre del responsable del negocio"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Business Feature */}
                    <FormField
                      control={form.control}
                      name="businessFeature"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs sm:text-sm font-medium text-gray-200">Característica del Negocio</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              className="bg-white/20 border-white/30 text-white placeholder-gray-300 focus:ring-yellow-400 min-h-[100px]"
                              placeholder="Describe una característica distintiva de tu negocio"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Auto-fill and Next/Previous buttons */}
                    <div className="flex justify-between items-center mt-4 sm:mt-6 md:mt-8">
                      <Button
                        type="button"
                        onClick={handleAutoFill}
                        variant="outline"
                        className="bg-white/20 text-gray-200 border-white/30 hover:bg-white/30"
                      >
                        Autocompletar
                      </Button>
                      <div className="flex gap-2 sm:gap-3">
                        <Button
                          type="button"
                          onClick={prevStep}
                          variant="outline"
                          className="bg-white/20 text-gray-200 border-white/30 hover:bg-white/30"
                        >
                          Anterior
                        </Button>
                        <Button
                          type="button"
                          onClick={nextStep}
                          className="bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 font-bold hover:from-yellow-500 hover:to-orange-600"
                        >
                          Siguiente
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-6">
                    <h2 className="text-lg sm:text-xl font-semibold text-white mb-6">Términos y Condiciones</h2>

                    <div className="bg-white/5 rounded-lg p-4 space-y-4 text-xs sm:text-sm text-gray-200">
                      <p className="mb-4">
                        Al registrarse en nuestra plataforma, usted acepta los siguientes términos y condiciones:
                      </p>

                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <span className="text-yellow-400 mt-1">•</span>
                          <p><strong className="text-white">Solo Vitrinas:</strong> Nuestra página es únicamente una plataforma de exhibición de productos (vitrinas) y no realizamos ventas directas de productos.</p>
                        </div>

                        <div className="flex items-start gap-2">
                          <span className="text-yellow-400 mt-1">•</span>
                          <p><strong className="text-white">No Responsables:</strong> No somos responsables de los productos exhibidos ni de su calidad, precios o disponibilidad.</p>
                        </div>

                        <div className="flex items-start gap-2">
                          <span className="text-yellow-400 mt-1">•</span>
                          <p><strong className="text-white">Datos Fidedignos:</strong> Usted se compromete a proporcionar información veraz y actualizada de su negocio y productos.</p>
                        </div>

                        <div className="flex items-start gap-2">
                          <span className="text-yellow-400 mt-1">•</span>
                          <p><strong className="text-white">Imágenes Gratuitas:</strong> Tendrá la posibilidad gratuita de subir hasta 7 imágenes que serán distribuidas en las secciones que más le acomoden.</p>
                        </div>

                        <div className="flex items-start gap-2">
                          <span className="text-yellow-400 mt-1">•</span>
                          <p><strong className="text-white">Uso Responsable:</strong> Se prohíbe el uso indebido de la plataforma y la publicación de contenido inapropiado.</p>
                        </div>
                      </div>

                      <p className="mt-4 pt-4 border-t border-white/10">
                        Al aceptar estos términos, usted podrá acceder a su panel de administración para comenzar a subir sus imágenes y gestionar su vitrina.
                      </p>
                    </div>

                    {/* Confirm and Previous buttons */}
                    <div className="flex justify-between items-center mt-6">
                      <Button
                        type="button"
                        onClick={prevStep}
                        variant="outline"
                        className="bg-white/20 text-gray-200 border-white/30 hover:bg-white/30"
                      >
                        Anterior
                      </Button>
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold hover:from-green-600 hover:to-emerald-700"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Registrando...
                          </>
                        ) : (
                          'Acepto los Términos'
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
    </div>
  )
}