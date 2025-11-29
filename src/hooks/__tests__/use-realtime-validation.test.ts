import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// Función para generar mensajes dinámicos de validación (copiada del hook)
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

describe('Dynamic Validation Messages', () => {
  describe('Email validation', () => {
    it('should show required message for empty email', () => {
      const result = getDynamicValidationMessage('', 'email');
      expect(result).toBe('El email es requerido');
    });

    it('should show required message for whitespace only', () => {
      const result = getDynamicValidationMessage('   ', 'email');
      expect(result).toBe('El email es requerido');
    });

    it('should show invalid format message for malformed email', () => {
      const result = getDynamicValidationMessage('invalid-email', 'email');
      expect(result).toBe('El formato del email es inválido');
    });

    it('should return null for valid email', () => {
      const result = getDynamicValidationMessage('test@example.com', 'email');
      expect(result).toBe(null);
    });
  });

  describe('Password validation', () => {
    it('should show required message for empty password', () => {
      const result = getDynamicValidationMessage('', 'password');
      expect(result).toBe('La contraseña es requerida');
    });

    it('should show character count for short passwords', () => {
      const result = getDynamicValidationMessage('abc', 'password');
      expect(result).toBe('La contraseña debe tener al menos 8 caracteres (5 más)');
    });

    it('should show all missing requirements for password with only lowercase', () => {
      const result = getDynamicValidationMessage('abcdefgh', 'password');
      expect(result).toBe('La contraseña debe contener una mayúscula, un número y un carácter especial');
    });

    it('should show missing requirements for password with uppercase but no number/special', () => {
      const result = getDynamicValidationMessage('Abcdefgh', 'password');
      expect(result).toBe('La contraseña debe contener un número y un carácter especial');
    });

    it('should show all missing requirements', () => {
      const result = getDynamicValidationMessage('abcdefghij', 'password');
      expect(result).toBe('La contraseña debe contener una mayúscula, un número y un carácter especial');
    });

    it('should return null for valid password', () => {
      const result = getDynamicValidationMessage('Password123!', 'password');
      expect(result).toBe(null);
    });
  });
});

describe('useRealtimeValidation (legacy tests)', () => {
  const emailSchema = z.string().email('El formato del email es inválido');
  const passwordSchema = z.string().min(8, 'La contraseña debe tener al menos 8 caracteres');

  // Mock the useDebounce hook
  const mockUseDebounce = (value: any, delay: number) => value;

  // Test the validation logic directly
  const testValidationLogic = (value: string, schema: z.ZodTypeAny) => {
    const debouncedValue = mockUseDebounce(value, 300);
    let result: { isValid: boolean; error: string | null; isValidating: boolean } = { isValid: false, error: null, isValidating: false };

    if (debouncedValue === value) {
      const validation = schema.safeParse(debouncedValue);
      result = {
        isValid: validation.success,
        error: validation.success ? null : validation.error.issues[0]?.message || 'Error de validación',
        isValidating: false,
      };
    } else {
      result = { ...result, isValidating: true };
    }

    return result;
  };

  it('should validate valid email with Zod', () => {
    const result = testValidationLogic('test@example.com', emailSchema);
    expect(result.isValid).toBe(true);
    expect(result.error).toBe(null);
    expect(result.isValidating).toBe(false);
  });

  it('should invalidate invalid email with Zod', () => {
    const result = testValidationLogic('invalid-email', emailSchema);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('El formato del email es inválido');
    expect(result.isValidating).toBe(false);
  });

  it('should validate valid password with Zod', () => {
    const result = testValidationLogic('password123', passwordSchema);
    expect(result.isValid).toBe(true);
    expect(result.error).toBe(null);
    expect(result.isValidating).toBe(false);
  });

  it('should invalidate short password with Zod', () => {
    const result = testValidationLogic('short', passwordSchema);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('La contraseña debe tener al menos 8 caracteres');
    expect(result.isValidating).toBe(false);
  });
});