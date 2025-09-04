'use client'

import { useState } from 'react'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    console.log('Login attempt:', formData)
    // For now, simulate successful login and redirect to home page
    // In a real app, you would validate credentials with your backend
    localStorage.setItem('isAuthenticated', 'true')
    // Store the username for display in the admin panel
    localStorage.setItem('userName', formData.usernameOrEmail)
    window.location.href = '/'
  }

  const handleCancel = () => {
    // Redirect back to home page
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <div className="container mx-auto py-4 px-2 sm:py-6 sm:px-4 md:py-8 md:px-6">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-4 sm:mb-6 md:mb-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">Iniciar Sesión</h1>
            <p className="text-xs sm:text-sm md:text-base text-gray-200">
              Ingresa tus credenciales para acceder
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/20 p-3 sm:p-4 md:p-6 md:p-8 shadow-lg sm:shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Username or Email Field */}
              <div>
                <label htmlFor="usernameOrEmail" className="block text-xs sm:text-sm font-medium text-gray-200 mb-1">
                  Nombre de Usuario o Email del Negocio
                </label>
                <input
                  type="text"
                  id="usernameOrEmail"
                  name="usernameOrEmail"
                  value={formData.usernameOrEmail}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 bg-white/20 border border-white/30 rounded-lg text-xs sm:text-sm md:text-base text-white placeholder-gray-300 focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-yellow-400"
                  placeholder="Ingresa tu nombre de usuario o email"
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-200 mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 bg-white/20 border border-white/30 rounded-lg text-xs sm:text-sm md:text-base text-white placeholder-gray-300 focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-yellow-400"
                  placeholder="Ingresa tu contraseña"
                />
              </div>

              {/* Forgot Links */}
              <div className="space-y-2">
                <p className="text-xs text-gray-300 hover:text-yellow-400 cursor-pointer">
                  ¿No recuerda su nombre de usuario o correo?
                </p>
                <p className="text-xs text-gray-300 hover:text-yellow-400 cursor-pointer">
                  ¿No recuerda su contraseña?
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 sm:gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-3 py-1.5 sm:px-6 sm:py-2 text-xs sm:text-sm bg-white/20 text-gray-200 rounded-lg hover:bg-white/30 transition-colors border border-white/30"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-3 py-1.5 sm:px-6 sm:py-2 text-xs sm:text-sm bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 font-bold rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all shadow-md sm:shadow-lg"
                >
                  Aceptar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}