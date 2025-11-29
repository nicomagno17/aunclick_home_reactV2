"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Sparkles,
  ArrowLeft
} from "lucide-react";
import { loginSchema, type LoginInput } from "@/schemas/auth.schema";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PasswordValidationHints } from "./PasswordValidationHints";
import { useRealtimeValidation } from "@/hooks/use-realtime-validation";
import { ValidationFeedback } from "./ValidationFeedback";
import { SkipLinks } from "./SkipLinks";
import { useFocusManagement } from "@/hooks/use-focus-management";
import BiometricAuth from "./BiometricAuth";
import { z } from "zod";

export default function ModernLoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [oauthProviderStatus, setOAuthProviderStatus] = useState<{google: boolean, facebook: boolean}>({google: true, facebook: true});
  const [oauthTimeout, setOAuthTimeout] = useState<NodeJS.Timeout | null>(null);

  // Focus management for accessibility
  const { announceToScreenReader } = useFocusManagement({
    autoFocus: true,
    trapFocus: false,
    restoreFocus: true,
  });

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Field schemas for real-time validation
  const emailFieldSchema = z.string().email('El formato del email es inválido').max(320, 'El email no puede tener más de 320 caracteres').trim().toLowerCase().transform((val) => val.trim().toLowerCase());
  const passwordFieldSchema = z.string().min(8, 'La contraseña debe tener al menos 8 caracteres').max(255, 'La contraseña no puede tener más de 255 caracteres').trim();

  // Efecto para animaciones de entrada
  useEffect(() => {
    const timer = setTimeout(() => {
      const formElement = document.getElementById('modern-login-form');
      if (formElement) {
        formElement.classList.add('animate-in');
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Check OAuth provider status on component mount
  useEffect(() => {
    const checkOAuthStatus = async () => {
      try {
        const response = await fetch('/api/auth/providers/status');
        if (response.ok) {
          const status = await response.json();
          setOAuthProviderStatus(status);
        }
      } catch (error) {
        console.error('Error checking OAuth provider status:', error);
      }
    };

    checkOAuthStatus();
  }, []);

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    announceToScreenReader("Iniciando sesión, por favor espere...", "polite");

    let result: any = null;
    try {
      result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        remember: rememberMe,
        redirect: false,
      });

      if (result?.error) {
        if (result.error.includes("CredentialsSignin")) {
          announceToScreenReader("Error: Credenciales incorrectas. El email o contraseña son incorrectos.", "assertive");
          toast({
            title: "Credenciales incorrectas",
            description: "El email o contraseña son incorrectos. Verifica tus datos.",
            variant: "destructive",
          });
        } else if (result.error.includes("AccessDenied")) {
          announceToScreenReader("Error: Acceso denegado. Tu cuenta ha sido suspendida.", "assertive");
          toast({
            title: "Acceso denegado",
            description: "Tu cuenta ha sido suspendida. Contacta al soporte.",
            variant: "destructive",
          });
        } else {
          announceToScreenReader("Error: Ha ocurrido un error inesperado durante la autenticación.", "assertive");
          toast({
            title: "Error de autenticación",
            description: "Ha ocurrido un error inesperado. Inténtalo de nuevo.",
            variant: "destructive",
          });
        }
      } else {
        announceToScreenReader("¡Inicio de sesión exitoso! Redirigiendo...", "polite");
        toast({
          title: "¡Bienvenido de vuelta! 🎉",
          description: "Has iniciado sesión correctamente.",
        });
        router.push("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      announceToScreenReader("Error: No se pudo conectar con el servidor. Verifica tu conexión.", "assertive");
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor. Verifica tu conexión.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      if (result && !result.error) {
        announceToScreenReader("Proceso de inicio de sesión completado.", "polite");
      }
    }
  };

  const handleOAuthSignIn = async (provider: "google" | "facebook") => {
    // Check if provider is available
    if (!oauthProviderStatus[provider]) {
      toast({
        title: "Proveedor no disponible",
        description: `El servicio de ${provider} no está disponible en este momento. Por favor, intenta más tarde o usa otro método de inicio de sesión.`,
        variant: "destructive",
      });
      return;
    }

    setIsOAuthLoading(provider);
    
    // Set timeout for OAuth process
    const timeout = setTimeout(() => {
      setIsOAuthLoading(null);
      toast({
        title: "Tiempo de espera agotado",
        description: `La autenticación con ${provider} está tomando más tiempo de lo esperado. Por favor, intenta de nuevo.`,
        variant: "destructive",
      });
    }, 30000); // 30 seconds timeout
    
    setOAuthTimeout(timeout);

    try {
      const result = await signIn(provider, { redirect: false });

      if (timeout) {
        clearTimeout(timeout);
        setOAuthTimeout(null);
      }

      if (result?.error) {
        let errorMessage = `No se pudo iniciar sesión con ${provider}. Inténtalo de nuevo.`;
        let errorTitle = "Error de autenticación";

        // Provide more specific error messages based on error type
        if (result.error.includes('OAuthSignin') || result.error.includes('OAuthCallback')) {
          errorTitle = "Error del proveedor";
          errorMessage = `Hubo un error al comunicarse con ${provider}. El servicio podría estar temporalmente no disponible.`;
        } else if (result.error.includes('OAuthCreateAccount') || result.error.includes('EmailCreateAccount')) {
          errorTitle = "Error de cuenta";
          errorMessage = `No se pudo crear una cuenta con ${provider} usando este email.`;
        } else if (result.error.includes('AccessDenied')) {
          errorTitle = "Acceso denegado";
          errorMessage = `Has cancelado el inicio de sesión con ${provider} o no se otorgaron los permisos necesarios.`;
        } else if (result.error.includes('OAuthAccountNotLinked')) {
          errorTitle = "Cuenta no vinculada";
          errorMessage = `Este email ya está registrado con otro método. Por favor, inicia sesión con tu método original.`;
        }

        toast({
          title: errorTitle,
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        toast({
          title: "¡Bienvenido!",
          description: `Has iniciado sesión correctamente con ${provider}`,
        });
        router.push("/");
      }
    } catch (error) {
      if (timeout) {
        clearTimeout(timeout);
        setOAuthTimeout(null);
      }
      
      console.error(`${provider} login error:`, error);
      toast({
        title: "Error de conexión",
        description: `No se pudo conectar con ${provider}. Verifica tu conexión a internet e intenta de nuevo.`,
        variant: "destructive",
      });
    } finally {
      setIsOAuthLoading(null);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (oauthTimeout) {
        clearTimeout(oauthTimeout);
      }
    };
  }, [oauthTimeout]);

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Skip Links for accessibility */}
      <SkipLinks />

      {/* Header con animación */}
      <div
        className="text-center mb-8 animate-in slide-in-from-top-4 duration-700"
        id="main-content"
        role="banner"
        aria-label="Encabezado del formulario de inicio de sesión"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Bienvenido de vuelta
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Ingresa tus credenciales para continuar
        </p>
      </div>

      {/* Formulario principal */}
      <div
        id="login-form"
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 translate-y-4 transition-all duration-500"
        role="main"
        aria-label="Formulario de inicio de sesión"
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
            role="form"
            aria-label="Formulario de inicio de sesión moderno"
            aria-describedby="login-description"
            noValidate
          >
            {/* Hidden description for screen readers */}
            <div id="login-description" className="sr-only">
              Formulario de inicio de sesión con campos para email y contraseña. Todos los campos son obligatorios.
            </div>
            {/* Campo Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => {
                const emailValidation = useRealtimeValidation(field.value || "", emailFieldSchema, 'email');
                return (
                  <FormItem>
                    <label htmlFor="email" className="sr-only">
                      Correo electrónico
                    </label>
                    <div className="relative">
                      <Mail
                        className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                          emailFocused ? 'text-blue-500' : 'text-gray-600'
                        }`}
                        aria-hidden="true"
                      />
                      <FormControl>
                        <Input
                          id="email"
                          type="email"
                          placeholder="tu@email.com"
                          autoComplete="email"
                          required
                          aria-required="true"
                          aria-describedby={`email-error email-validation-${emailValidation.isValid ? 'valid' : 'invalid'}`}
                          aria-invalid={field.value && !emailValidation.isValid}
                          className={`pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-700 border-2 rounded-xl text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none ${
                            emailFocused ? 'border-blue-500 shadow-lg' : 'border-gray-200 dark:border-gray-600'
                          }`}
                          {...field}
                          onFocus={() => setEmailFocused(true)}
                          onBlur={() => setEmailFocused(false)}
                        />
                      </FormControl>
                      {emailValidation.isValidating ? (
                        <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
                      ) : emailValidation.isValid ? (
                        <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-600" />
                      ) : field.value && emailValidation.error ? (
                        <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-600" />
                      ) : null}
                    </div>
                    {/* Solo mostrar mensaje cuando el usuario haya escrito algo o exista un error del servidor */}
                    {field.value && emailValidation.error && (
                      <p
                        id="email-error"
                        className="text-red-500 text-sm mt-1"
                        role="alert"
                        aria-live="polite"
                      >
                        {emailValidation.error}
                      </p>
                    )}
                    <ValidationFeedback
                      isValid={emailValidation.isValid}
                      error={field.value ? emailValidation.error : null}
                      isValidating={emailValidation.isValidating}
                      className="mt-2"
                      aria-label={
                        field.value
                          ? `Validación del email: ${
                              emailValidation.isValid
                                ? 'válido'
                                : emailValidation.error || 'validando'
                            }`
                          : 'Validación del email pendiente, sin interacción del usuario'
                      }
                    />
                  </FormItem>
                );
              }}
            />

            {/* Campo Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => {
                const passwordValidation = useRealtimeValidation(field.value || "", passwordFieldSchema, 'password');
                return (
                  <FormItem>
                    <label htmlFor="password" className="sr-only">
                      Contraseña
                    </label>
                    <div className="relative">
                      <Lock
                        className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                          passwordFocused ? 'text-blue-500' : 'text-gray-600'
                        }`}
                        aria-hidden="true"
                      />
                      <FormControl>
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          autoComplete="current-password"
                          required
                          aria-required="true"
                          aria-describedby={`password-error password-validation-${passwordValidation.isValid ? 'valid' : 'invalid'}`}
                          aria-invalid={field.value && !passwordValidation.isValid}
                          className={`pl-10 pr-16 py-3 bg-gray-50 dark:bg-gray-700 border-2 rounded-xl text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none ${
                            passwordFocused ? 'border-blue-500 shadow-lg' : 'border-gray-200 dark:border-gray-600'
                          }`}
                          {...field}
                          onFocus={() => setPasswordFocused(true)}
                          onBlur={() => {
                            setPasswordFocused(false);
                            if (field.value) {
                              setPasswordTouched(true);
                            }
                          }}
                          onChange={(e) => {
                            field.onChange(e);
                            // Reset touched state if field becomes empty
                            if (!e.target.value) {
                              setPasswordTouched(false);
                            }
                          }}
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                      {passwordValidation.isValidating ? (
                        <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
                      ) : passwordValidation.isValid ? (
                        <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-600" />
                      ) : field.value && passwordValidation.error ? (
                        <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-600" />
                      ) : null}
                    </div>
                    {/* Solo mostrar mensaje de error cuando el usuario haya hecho blur del campo */}
                    {passwordTouched && field.value && passwordValidation.error && (
                      <p
                        id="password-error"
                        className="text-red-500 text-sm mt-1"
                        role="alert"
                        aria-live="polite"
                      >
                        {passwordValidation.error}
                      </p>
                    )}
                    {/* Mostrar hints de validación cuando el usuario haya hecho blur del campo */}
                    {passwordTouched && field.value && (
                      <PasswordValidationHints
                        password={field.value}
                        className="mt-3"
                      />
                    )}
                    <ValidationFeedback
                      isValid={passwordValidation.isValid}
                      error={field.value && !passwordTouched ? passwordValidation.error : null}
                      isValidating={passwordValidation.isValidating}
                      className="mt-2"
                      aria-label={
                        field.value
                          ? `Validación de la contraseña: ${
                              passwordValidation.isValid
                                ? 'válida'
                                : passwordValidation.error || 'validando'
                            }`
                          : 'Validación de la contraseña pendiente, sin interacción del usuario'
                      }
                    />
                  </FormItem>
                );
              }}
            />

            {/* Remember Me y Forgot Password */}
            <div className="flex items-center justify-between" role="group" aria-label="Opciones de sesión">
              <div className="flex items-center space-x-2">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 focus:outline-none"
                  aria-describedby="remember-description"
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none"
                >
                  Recordarme
                </label>
                <span id="remember-description" className="sr-only">
                  Mantener la sesión iniciada por 30 días
                </span>
              </div>
              <Link
                href="/password/forgot"
                className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Botón Submit */}
            <Button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-blue-300"
              disabled={isLoading}
              aria-busy={isLoading}
              aria-describedby="submit-description"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Iniciando sesión...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5" />
                  <span>Iniciar Sesión</span>
                </div>
              )}
            </Button>
            <span id="submit-description" className="sr-only">
              Botón para enviar el formulario de inicio de sesión con las credenciales proporcionadas
            </span>
          </form>
        </Form>

        {/* Biometric Authentication */}
        <div className="my-6">
          <BiometricAuth
            mode="authenticate"
            onSuccess={(result) => {
              // Handle successful biometric authentication
              console.log('Biometric auth success:', result);
              // Redirect to dashboard or handle login
              router.push("/");
            }}
            onError={(error) => {
              console.error('Biometric auth error:', error);
            }}
          />
        </div>

        {/* Divider */}
        <div className="relative my-6" role="separator" aria-label="O continúa con otras opciones de inicio de sesión">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              O continúa con
            </span>
          </div>
        </div>

        {/* OAuth Buttons */}
        <div className="grid grid-cols-2 gap-3" role="group" aria-label="Opciones de inicio de sesión con redes sociales">
          {/* Google OAuth */}
          <Button
            variant="outline"
            className={`flex items-center justify-center gap-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 disabled:bg-gray-100 dark:disabled:bg-gray-700 rounded-xl py-3 transition-all duration-200 hover:shadow-md ${
              !oauthProviderStatus.google ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={() => handleOAuthSignIn("google")}
            disabled={isOAuthLoading === "google" || isLoading || !oauthProviderStatus.google}
            aria-busy={isOAuthLoading === "google"}
            title={oauthProviderStatus.google ? "Iniciar sesión con Google" : "Google no disponible temporalmente"}
            aria-label={oauthProviderStatus.google ? "Iniciar sesión con Google" : "Google no disponible temporalmente"}
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
            <span className="hidden sm:inline">Google</span>
            {/* Provider status indicator */}
            <div className={`w-2 h-2 rounded-full ml-1 ${oauthProviderStatus.google ? 'bg-green-500' : 'bg-red-500'}`}
                 aria-hidden="true"
                 title={oauthProviderStatus.google ? 'Google disponible' : 'Google no disponible'} />
          </Button>

          {/* Facebook OAuth */}
          <Button
            variant="outline"
            className={`flex items-center justify-center gap-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 disabled:bg-gray-100 dark:disabled:bg-gray-700 rounded-xl py-3 transition-all duration-200 hover:shadow-md ${
              !oauthProviderStatus.facebook ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={() => handleOAuthSignIn("facebook")}
            disabled={isOAuthLoading === "facebook" || isLoading || !oauthProviderStatus.facebook}
            aria-busy={isOAuthLoading === "facebook"}
            title={oauthProviderStatus.facebook ? "Iniciar sesión con Facebook" : "Facebook no disponible temporalmente"}
            aria-label={oauthProviderStatus.facebook ? "Iniciar sesión con Facebook" : "Facebook no disponible temporalmente"}
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
            <span className="hidden sm:inline">Facebook</span>
            {/* Provider status indicator */}
            <div className={`w-2 h-2 rounded-full ml-1 ${oauthProviderStatus.facebook ? 'bg-green-500' : 'bg-red-500'}`}
                 aria-hidden="true"
                 title={oauthProviderStatus.facebook ? 'Facebook disponible' : 'Facebook no disponible'} />
          </Button>
        </div>

        {/* Sign Up Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600 dark:text-gray-400">
            ¿No tienes cuenta?{" "}
            <button
              type="button"
              onClick={() => router.push("/register")}
              className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
              aria-label="Ir a la página de registro para crear una nueva cuenta"
            >
              Regístrate gratis
            </button>
          </p>
        </div>
      </div>

      {/* Footer con animación */}
      <div
        id="footer"
        className="text-center mt-6 animate-in slide-in-from-bottom-4 duration-700 delay-300"
        role="contentinfo"
        aria-label="Información de seguridad del sitio"
      >
        <p className="text-xs text-gray-600 dark:text-gray-400">
          🔒 Tu información está segura y protegida
        </p>
      </div>
    </div>
  );
}