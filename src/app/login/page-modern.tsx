"use client";

import { useRouter } from 'next/navigation';
import ModernLoginForm from '@/components/auth/ModernLoginForm';
import { ArrowLeft, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ModernLoginPage() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);

  // Detectar tema del sistema
  useEffect(() => {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(isDarkMode);

    // Aplicar tema al documento
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDark
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'
        : 'bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-50'
    }`}>
      {/* Header con navegación */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            {/* Botón volver */}
            <button
              onClick={() => router.push('/')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                isDark
                  ? 'text-white hover:bg-white/10'
                  : 'text-gray-700 hover:bg-black/5'
              }`}
              aria-label="Volver a la página principal"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Volver</span>
            </button>

            {/* Toggle de tema */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl transition-all duration-200 ${
                isDark
                  ? 'text-white hover:bg-white/10'
                  : 'text-gray-700 hover:bg-black/5'
              }`}
              aria-label={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Elementos decorativos de fondo */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Círculos decorativos */}
            <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 ${
              isDark ? 'bg-purple-500' : 'bg-blue-300'
            } blur-3xl animate-pulse`} />
            <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 ${
              isDark ? 'bg-blue-500' : 'bg-purple-300'
            } blur-3xl animate-pulse`} style={{ animationDelay: '2s' }} />
          </div>

          {/* Formulario */}
          <div className="relative z-10">
            <ModernLoginForm />
          </div>
        </div>
      </div>

      {/* Footer discreto */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <p className={`text-xs text-center ${
          isDark ? 'text-gray-400' : 'text-gray-500'
        }`}>
          AunClick - Tu plataforma de confianza
        </p>
      </div>
    </div>
  );
}