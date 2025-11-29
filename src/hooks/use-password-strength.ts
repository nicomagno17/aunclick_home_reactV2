import { useMemo } from 'react';

export interface PasswordStrength {
  score: number;
  level: 'weak' | 'medium' | 'strong';
  feedback: string[];
  suggestions: string[];
}

export function usePasswordStrength(password: string): PasswordStrength {
  return useMemo(() => {
    if (!password) {
      return {
        score: 0,
        level: 'weak',
        feedback: [],
        suggestions: [
          'Usa al menos 8 caracteres',
          'Incluye mayúsculas y minúsculas',
          'Agrega números y símbolos'
        ]
      };
    }

    let score = 0;
    const feedback: string[] = [];
    const suggestions: string[] = [];

    // Length check
    if (password.length >= 8) {
      score += 25;
    } else {
      feedback.push('Contraseña muy corta');
      suggestions.push('Usa al menos 8 caracteres');
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score += 20;
    } else {
      feedback.push('Falta mayúscula');
      suggestions.push('Incluye al menos una letra mayúscula');
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
      score += 20;
    } else {
      feedback.push('Falta minúscula');
      suggestions.push('Incluye al menos una letra minúscula');
    }

    // Numbers check
    if (/\d/.test(password)) {
      score += 15;
    } else {
      feedback.push('Falta número');
      suggestions.push('Agrega al menos un número');
    }

    // Special characters check
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      score += 10;
    } else {
      feedback.push('Falta símbolo');
      suggestions.push('Incluye al menos un símbolo especial');
    }

    // Bonus for longer passwords
    if (password.length >= 12) {
      score += 10;
    }

    // Determine level
    let level: 'weak' | 'medium' | 'strong';
    if (score < 40) {
      level = 'weak';
    } else if (score < 70) {
      level = 'medium';
    } else {
      level = 'strong';
    }

    return {
      score: Math.min(score, 100),
      level,
      feedback,
      suggestions
    };
  }, [password]);
}