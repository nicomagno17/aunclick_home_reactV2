import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ValidationFeedbackProps {
  isValid: boolean;
  error: string | null;
  isValidating: boolean;
  className?: string;
}

export function ValidationFeedback({
  isValid,
  error,
  isValidating,
  className
}: ValidationFeedbackProps) {
  if (isValidating) {
    return (
      <div
        className={cn("flex items-center space-x-2 text-gray-500", className)}
        role="status"
        aria-live="polite"
        aria-label="Validando campo"
      >
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm">Validando...</span>
      </div>
    );
  }

  if (isValid) {
    return (
      <div
        className={cn("flex items-center space-x-2 text-green-600", className)}
        role="status"
        aria-live="polite"
        aria-label="Campo válido"
      >
        <CheckCircle className="w-4 h-4" />
        <span className="text-sm">Válido</span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cn("flex items-center space-x-2 text-red-600", className)}
        role="alert"
        aria-live="polite"
        aria-label={`Error de validación: ${error}`}
      >
        <AlertCircle className="w-4 h-4" />
        <span className="text-sm">{error}</span>
      </div>
    );
  }

  return null;
}