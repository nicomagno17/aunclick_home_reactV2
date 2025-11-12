'use client';

import { useRouter } from 'next/navigation';
import LoginForm from './login-form';

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <div className="container mx-auto py-4 px-2 sm:py-6 sm:px-4 md:py-8 md:px-6">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-4 sm:mb-6 md:mb-8">
            <button
              onClick={() => router.push('/')}
              className="flex items-center space-x-2 text-white hover:text-yellow-200 transition-colors cursor-pointer text-sm font-medium"
              aria-label="Volver a la página principal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              <span>Volver atrás</span>
            </button>
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">Iniciar Sesión</h1>
              <p className="text-xs sm:text-sm md:text-base text-gray-200">
                Ingresa tus credenciales para acceder
              </p>
            </div>
            <div className="w-24"></div> {/* Spacer for alignment */}
          </div>

          {/* Login Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/20 p-3 sm:p-4 md:p-6 md:p-8 shadow-lg sm:shadow-2xl">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}