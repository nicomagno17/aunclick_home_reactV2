"use client";

import { AlertCircle } from 'lucide-react';
import { usePasswordStrength } from '@/hooks/use-password-strength';
import { cn } from '@/lib/utils';

interface PasswordValidationHintsProps {
  password: string;
  className?: string;
}

export function PasswordValidationHints({ password, className }: PasswordValidationHintsProps) {
  const { feedback } = usePasswordStrength(password);

  if (!password || feedback.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
        <AlertCircle className="w-4 h-4" />
        <span className="font-medium">Falta:</span>
      </div>
      <ul className="text-sm text-red-600 dark:text-red-400 space-y-1 ml-6">
        {feedback.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <span className="w-1 h-1 bg-red-500 rounded-full" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}