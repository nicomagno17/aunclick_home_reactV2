"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Fingerprint, CheckCircle, AlertCircle } from "lucide-react";
import { isWebAuthnSupported, getAuthenticatorInfo, startBiometricRegistration, startBiometricAuthentication, formatRegistrationResponse, formatAuthenticationResponse } from "@/lib/webauthn-client";
import { useToast } from "@/hooks/use-toast";

interface BiometricAuthProps {
  mode: 'register' | 'authenticate';
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
  userId?: number;
  className?: string;
}

export default function BiometricAuth({
  mode,
  onSuccess,
  onError,
  userId,
  className = ""
}: BiometricAuthProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authenticatorInfo, setAuthenticatorInfo] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    // Verificar soporte de WebAuthn
    const supported = isWebAuthnSupported();
    setIsSupported(supported);

    if (supported) {
      const info = getAuthenticatorInfo();
      setAuthenticatorInfo(info);
    }
  }, []);

  const handleBiometricAction = async () => {
    if (!isSupported) {
      const errorMsg = "WebAuthn no es soportado en este navegador";
      setError(errorMsg);
      onError?.(new Error(errorMsg));
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      if (mode === 'register') {
        await handleRegistration();
      } else {
        await handleAuthentication();
      }
    } catch (error) {
      console.error('Biometric action failed:', error);
      const errorMsg = error instanceof Error ? error.message : 'Error en autenticación biométrica';
      setError(errorMsg);
      onError?.(error instanceof Error ? error : new Error(errorMsg));

      toast({
        title: "Error de autenticación biométrica",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistration = async () => {
    // Paso 1: Obtener opciones de registro del servidor
    const registerResponse = await fetch('/api/auth/biometric/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!registerResponse.ok) {
      throw new Error('Error obteniendo opciones de registro');
    }

    const registerOptions = await registerResponse.json();

    // Paso 2: Crear credencial usando WebAuthn (client-side)
    const registrationResponse = await startBiometricRegistration(registerOptions);

    // Paso 3: Formatear respuesta para el servidor
    const formattedResponse = formatRegistrationResponse(registrationResponse);

    // Paso 4: Enviar credencial al servidor para verificación
    const verifyResponse = await fetch('/api/auth/biometric/register', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        response: formattedResponse
      }),
    });

    if (!verifyResponse.ok) {
      const errorData = await verifyResponse.json();
      throw new Error(errorData.error || 'Error verificando registro');
    }

    const result = await verifyResponse.json();

    toast({
      title: "¡Registro exitoso!",
      description: "Tu dispositivo biométrico ha sido registrado correctamente.",
    });

    onSuccess?.(result);
  };

  const handleAuthentication = async () => {
    // Paso 1: Obtener opciones de autenticación del servidor
    const challengeResponse = await fetch('/api/auth/biometric/challenge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });

    if (!challengeResponse.ok) {
      throw new Error('Error obteniendo challenge de autenticación');
    }

    const authOptions = await challengeResponse.json();

    // Paso 2: Obtener credencial usando WebAuthn (client-side)
    const authenticationResponse = await startBiometricAuthentication(authOptions);

    // Paso 3: Formatear respuesta para el servidor
    const formattedResponse = formatAuthenticationResponse(authenticationResponse);

    // Paso 4: Enviar credencial al servidor para verificación
    const verifyResponse = await fetch('/api/auth/biometric/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        response: formattedResponse
      }),
    });

    if (!verifyResponse.ok) {
      const errorData = await verifyResponse.json();
      throw new Error(errorData.error || 'Error verificando autenticación');
    }

    const result = await verifyResponse.json();

    toast({
      title: "¡Autenticación exitosa!",
      description: "Has sido autenticado correctamente con tu dispositivo biométrico.",
    });

    onSuccess?.(result);
  };

  if (!isSupported) {
    return (
      <Alert className={`${className}`}>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Tu navegador no soporta autenticación biométrica (WebAuthn).
          Considera actualizar a una versión más reciente de Chrome, Firefox, Safari o Edge.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Información del autenticador */}
      {authenticatorInfo && (
        <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
          <Fingerprint className="w-4 h-4" />
          <span>Detectado: {authenticatorInfo}</span>
        </div>
      )}

      {/* Botón de acción biométrica */}
      <Button
        onClick={handleBiometricAction}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
        aria-busy={isLoading}
        aria-describedby={error ? "biometric-error" : undefined}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>
              {mode === 'register' ? 'Registrando...' : 'Autenticando...'}
            </span>
          </>
        ) : (
          <>
            <Fingerprint className="w-5 h-5" />
            <span>
              {mode === 'register'
                ? 'Registrar dispositivo biométrico'
                : 'Iniciar sesión con biometría'
              }
            </span>
          </>
        )}
      </Button>

      {/* Mensaje de error */}
      {error && (
        <Alert variant="destructive" id="biometric-error">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Información adicional */}
      <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
        {mode === 'register'
          ? 'Registra tu huella digital, Face ID o Windows Hello para acceso rápido y seguro.'
          : 'Usa tu huella digital, Face ID o Windows Hello para iniciar sesión sin contraseña.'
        }
      </div>
    </div>
  );
}