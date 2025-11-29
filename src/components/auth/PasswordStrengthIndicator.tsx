"use client";

import { usePasswordStrength } from "@/hooks/use-password-strength";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
  showSuggestions?: boolean;
}

export function PasswordStrengthIndicator({ password, className, showSuggestions = true }: PasswordStrengthIndicatorProps) {
  const { score, level, feedback, suggestions } = usePasswordStrength(password);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'weak':
        return 'text-red-600 dark:text-red-400';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'strong':
        return 'text-green-600 dark:text-green-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getProgressColor = (level: string) => {
    switch (level) {
      case 'weak':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'strong':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'weak':
        return 'Débil';
      case 'medium':
        return 'Media';
      case 'strong':
        return 'Fuerte';
      default:
        return '';
    }
  };

  if (!password) return null;

  return (
    <div className={cn("space-y-3 animate-in slide-in-from-top-2 duration-300", className)}>
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Fortaleza de contraseña
          </span>
          <Badge
            variant="outline"
            className={cn("text-xs font-semibold", getLevelColor(level))}
          >
            {getLevelText(level)} ({score}%)
          </Badge>
        </div>
        <Progress
          value={score}
          className="h-2 transition-all duration-300"
          style={{
            '--progress-background': getProgressColor(level),
          } as React.CSSProperties}
        />
      </div>

      {/* Feedback */}
      {feedback.length > 0 && (
        <div className="space-y-1">
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
      )}

      {/* Suggestions - Only show when explicitly enabled */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
            <Lightbulb className="w-4 h-4" />
            <span className="font-medium">Sugerencias:</span>
          </div>
          <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1 ml-6">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3" />
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}