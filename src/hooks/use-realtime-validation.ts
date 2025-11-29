import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useDebounce } from './use-debounce';

interface ValidationResult {
  isValid: boolean;
  error: string | null;
  isValidating: boolean;
}

// Función para generar mensajes dinámicos de validación
function getDynamicValidationMessage(value: string, fieldType: 'email' | 'password'): string | null {
  // Si está vacío, mostrar mensaje de requerido
  if (!value.trim()) {
    return fieldType === 'email' ? 'El email es requerido' : 'La contraseña es requerida';
  }

  // Para email: validar formato básico
  if (fieldType === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'El formato del email es inválido';
    }
    return null; // Válido
  }

  // Para contraseña: validaciones progresivas
  if (fieldType === 'password') {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumbers = /\d/.test(value);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(value);

    // Longitud mínima
    if (value.length < minLength) {
      const remaining = minLength - value.length;
      return `La contraseña debe tener al menos 8 caracteres (${remaining} más)`;
    }

    // Si tiene longitud suficiente, verificar complejidad faltante
    const missingRequirements = [];
    if (!hasUpperCase) missingRequirements.push('una mayúscula');
    if (!hasLowerCase) missingRequirements.push('una minúscula');
    if (!hasNumbers) missingRequirements.push('un número');
    if (!hasSpecialChar) missingRequirements.push('un carácter especial');

    if (missingRequirements.length > 0) {
      const lastReq = missingRequirements.pop();
      const requirementsText = missingRequirements.length > 0
        ? missingRequirements.join(', ') + ' y ' + lastReq
        : lastReq;
      return `La contraseña debe contener ${requirementsText}`;
    }

    return null; // Válido
  }

  return null;
}

export function useRealtimeValidation(
  value: string,
  schema: z.ZodTypeAny,
  fieldType: 'email' | 'password',
  delay: number = 300
): ValidationResult {
  const debouncedValue = useDebounce(value, delay);
  const [result, setResult] = useState<ValidationResult>({
    isValid: false,
    error: null,
    isValidating: false,
  });

  useEffect(() => {
    if (debouncedValue === value) {
      // Primero verificar con mensajes dinámicos
      const dynamicMessage = getDynamicValidationMessage(value, fieldType);

      if (dynamicMessage) {
        setResult({
          isValid: false,
          error: dynamicMessage,
          isValidating: false,
        });
        return;
      }

      // Si pasa validación dinámica, usar Zod para validación final
      const validation = schema.safeParse(debouncedValue);
      setResult({
        isValid: validation.success,
        error: validation.success ? null : validation.error.issues[0]?.message || 'Error de validación',
        isValidating: false,
      });
    } else {
      // Still debouncing
      setResult(prev => ({ ...prev, isValidating: true }));
    }
  }, [debouncedValue, value, schema, fieldType]);

  return result;
}