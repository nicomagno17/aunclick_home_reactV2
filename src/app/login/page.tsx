'use client';

import Link from 'next/link';
import { Home } from 'lucide-react';
import LoginForm from './login-form';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto py-4 px-2 sm:py-6 sm:px-4 md:py-8 md:px-6">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-4 sm:mb-6 md:mb-8">
            <Link href="/" className="flex flex-col items-center text-white hover:text-purple-400 transition-colors cursor-pointer group">
              <Home className="w-6 h-6 sm:w-7 sm:h-7 mb-0.5" />
              <span className="text-[10px] sm:text-xs font-medium">Home</span>
            </Link>
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2 tracking-tight">Iniciar Sesión</h1>
              <p className="text-xs sm:text-sm md:text-base text-gray-400">
                Ingresa tus credenciales para acceder
              </p>
            </div>
            <div className="w-16"></div> {/* Spacer for alignment */}
          </div>

          {/* Login Form */}
          <div className="bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-700 p-4 sm:p-6 md:p-8 shadow-2xl">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}