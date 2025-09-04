'use client'

import { useState } from 'react'

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1 fields
    firstName: '',
    lastName: '',
    rut: '',
    birthDate: '',
    gender: '',
    phone: '',
    region: '',
    commune: '',
    address: '',
    // Step 2 fields
    username: '',
    email: '',
    backupEmail: '',
    password: '',
    confirmPassword: '',
    // Step 3 fields (business information)
    businessName: '',
    businessAddress: '',
    businessPhone: '',
    businessWhatsApp: '',
    businessEmail: '',
    businessOwner: '',
    businessFeature: '', // Replacing horarios with caracteristica del negocio
  })
  const [showWelcomePopup, setShowWelcomePopup] = useState(false)
  const [showPasswordHelp, setShowPasswordHelp] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: boolean}>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Auto-fill function with sample data
  const handleAutoFill = () => {
    if (step === 1) {
      setFormData(prev => ({
        ...prev,
        firstName: 'Juan',
        lastName: 'Pérez',
        rut: '12.345.678-9',
        birthDate: '1990-01-15',
        gender: 'masculino',
        phone: '+56 9 1234 5678',
        region: 'metropolitana',
        commune: 'santiago',
        address: 'Av. Providencia 1234, Santiago',
      }))
    } else if (step === 2) {
      setFormData(prev => ({
        ...prev,
        username: 'juanperez',
        email: 'juan.perez@email.com',
        backupEmail: 'juan.perez.backup@email.com',
        password: 'Password123',
        confirmPassword: 'Password123',
      }))
    } else if (step === 3) {
      setFormData(prev => ({
        ...prev,
        businessName: 'Tienda de Ejemplo',
        businessAddress: 'Calle Falsa 123, Santiago',
        businessPhone: '+56 2 1234 5678',
        businessWhatsApp: '+56 9 1234 5678',
        businessEmail: 'info@tiendadeejemplo.cl',
        businessOwner: 'María González',
        businessFeature: 'Venta de productos electrónicos y accesorios',
      }))
    }
  }

  // Validation function for each step
  const validateStep = (step: number) => {
    const newErrors: {[key: string]: boolean} = {}
    
    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = true
      if (!formData.lastName.trim()) newErrors.lastName = true
      if (!formData.rut.trim()) newErrors.rut = true
      if (!formData.birthDate) newErrors.birthDate = true
      if (!formData.gender) newErrors.gender = true
      if (!formData.phone.trim()) newErrors.phone = true
      if (!formData.region) newErrors.region = true
      if (!formData.commune) newErrors.commune = true
      if (!formData.address.trim()) newErrors.address = true
    } else if (step === 2) {
      if (!formData.username.trim()) newErrors.username = true
      if (!formData.email.trim()) {
        newErrors.email = true
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = true
      }
      if (!formData.password) {
        newErrors.password = true
      } else if (!/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(formData.password)) {
        newErrors.password = true
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = true
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = true
      }
    } else if (step === 3) {
      if (!formData.businessName.trim()) newErrors.businessName = true
      if (!formData.businessAddress.trim()) newErrors.businessAddress = true
      if (!formData.businessPhone.trim()) newErrors.businessPhone = true
      if (!formData.businessEmail.trim()) {
        newErrors.businessEmail = true
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.businessEmail)) {
        newErrors.businessEmail = true
      }
      if (!formData.businessOwner.trim()) newErrors.businessOwner = true
      if (!formData.businessFeature.trim()) newErrors.businessFeature = true
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  const handleAccept = () => {
    // Handle form submission
    console.log('Form submitted:', formData)
    // Here you would typically send the data to your backend
    setShowWelcomePopup(true)
  }

  const closeWelcomePopup = () => {
    setShowWelcomePopup(false)
    // Redirect to login page instead of admin panel
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <div className="container mx-auto py-4 px-2 sm:py-6 sm:px-4 md:py-8 md:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-4 sm:mb-6 md:mb-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">Registro de Usuario</h1>
            <p className="text-xs sm:text-sm md:text-base text-gray-200">
              {step === 1 
                ? 'Información personal' 
                : step === 2
                ? 'Información de acceso'
                : step === 3
                ? 'Información del negocio'
                : 'Términos y condiciones'}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-4 sm:mb-6 md:mb-8">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 sm:h-1 bg-purple-700 -z-10"></div>
              {[1, 2, 3, 4].map((stepNum) => (
                <div key={stepNum} className="flex flex-col items-center">
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm ${
                    step >= stepNum 
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 font-bold' 
                      : 'bg-purple-700 text-gray-300'
                  }`}>
                    {stepNum}
                  </div>
                  <span className="mt-1 sm:mt-2 text-[10px] sm:text-xs text-gray-300">
                    {stepNum === 1 && 'Personal'}
                    {stepNum === 2 && 'Acceso'}
                    {stepNum === 3 && 'Negocio'}
                    {stepNum === 4 && 'Confirmar'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Registration Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/20 p-3 sm:p-4 md:p-6 md:p-8 shadow-lg sm:shadow-2xl">
            {step === 1 && (
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Información Personal</h2>
                
                {/* First Row: Nombre y Apellidos - Same row on all screen sizes */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-xs sm:text-sm font-medium text-gray-200 mb-1">
                      Nombre
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 bg-white/20 border rounded-lg text-xs sm:text-sm md:text-base text-white placeholder-gray-300 focus:outline-none focus:ring-1 sm:focus:ring-2 ${
                        errors.firstName 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-white/30 focus:ring-yellow-400'
                      }`}
                      placeholder="Tu nombre"
                    />
                    {errors.firstName && <p className="text-white text-xs mt-1">(Este campo es requerido)</p>}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-xs sm:text-sm font-medium text-gray-200 mb-1">
                      Apellidos
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 bg-white/20 border rounded-lg text-xs sm:text-sm md:text-base text-white placeholder-gray-300 focus:outline-none focus:ring-1 sm:focus:ring-2 ${
                        errors.lastName 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-white/30 focus:ring-yellow-400'
                      }`}
                      placeholder="Tus apellidos"
                    />
                    {errors.lastName && <p className="text-white text-xs mt-1">(Este campo es requerido)</p>}
                  </div>
                </div>

                {/* Second Row: RUT y Sexo - Same row on all screen sizes */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                  <div>
                    <label htmlFor="rut" className="block text-xs sm:text-sm font-medium text-gray-200 mb-1">
                      RUT
                    </label>
                    <input
                      type="text"
                      id="rut"
                      name="rut"
                      value={formData.rut}
                      onChange={handleInputChange}
                      className={`w-full px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 bg-white/20 border rounded-lg text-xs sm:text-sm md:text-base text-white placeholder-gray-300 focus:outline-none focus:ring-1 sm:focus:ring-2 ${
                        errors.rut 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-white/30 focus:ring-yellow-400'
                      }`}
                      placeholder="12.345.678-9"
                    />
                    {errors.rut && <p className="text-white text-xs mt-1">(Este campo es requerido)</p>}
                  </div>
                  <div>
                    <label htmlFor="gender" className="block text-xs sm:text-sm font-medium text-gray-200 mb-1">
                      Sexo
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className={`w-full px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 bg-white/20 border rounded-lg text-xs sm:text-sm md:text-base text-white focus:outline-none focus:ring-1 sm:focus:ring-2 ${
                        errors.gender 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-white/30 focus:ring-yellow-400'
                      }`}
                    >
                      <option value="" className="bg-purple-900">Selecciona tu sexo</option>
                      <option value="masculino" className="bg-purple-900">Masculino</option>
                      <option value="femenino" className="bg-purple-900">Femenino</option>
                      <option value="otro" className="bg-purple-900">Otro</option>
                    </select>
                    {errors.gender && <p className="text-white text-xs mt-1">(Este campo es requerido)</p>}
                  </div>
                </div>

                {/* Third Row: Fecha de Nacimiento y Teléfono - Same row on all screen sizes */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                  <div>
                    <label htmlFor="birthDate" className="block text-xs sm:text-sm font-medium text-gray-200 mb-1">
                      Fecha de Nacimiento
                    </label>
                    <input
                      type="date"
                      id="birthDate"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      className={`w-full px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 bg-white/20 border rounded-lg text-xs sm:text-sm md:text-base text-white focus:outline-none focus:ring-1 sm:focus:ring-2 ${
                        errors.birthDate 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-white/30 focus:ring-yellow-400'
                      }`}
                    />
                    {errors.birthDate && <p className="text-white text-xs mt-1">(Este campo es requerido)</p>}
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-xs sm:text-sm font-medium text-gray-200 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 bg-white/20 border rounded-lg text-xs sm:text-sm md:text-base text-white placeholder-gray-300 focus:outline-none focus:ring-1 sm:focus:ring-2 ${
                        errors.phone 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-white/30 focus:ring-yellow-400'
                      }`}
                      placeholder="+56 9 1234 5678"
                    />
                    {errors.phone && <p className="text-white text-xs mt-1">(Este campo es requerido)</p>}
                  </div>
                </div>

                {/* Fourth Row: Región y Comuna - Same row on all screen sizes */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                  <div>
                    <label htmlFor="region" className="block text-xs sm:text-sm font-medium text-gray-200 mb-1">
                      Región
                    </label>
                    <select
                      id="region"
                      name="region"
                      value={formData.region}
                      onChange={handleInputChange}
                      className={`w-full px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 bg-white/20 border rounded-lg text-xs sm:text-sm md:text-base text-white focus:outline-none focus:ring-1 sm:focus:ring-2 ${
                        errors.region 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-white/30 focus:ring-yellow-400'
                      }`}
                    >
                      <option value="" className="bg-purple-900">Selecciona tu región</option>
                      <option value="metropolitana" className="bg-purple-900">Región Metropolitana</option>
                      <option value="valparaiso" className="bg-purple-900">Región de Valparaíso</option>
                      <option value="biobio" className="bg-purple-900">Región del Biobío</option>
                      {/* Add more regions as needed */}
                    </select>
                    {errors.region && <p className="text-white text-xs mt-1">(Este campo es requerido)</p>}
                  </div>
                  <div>
                    <label htmlFor="commune" className="block text-xs sm:text-sm font-medium text-gray-200 mb-1">
                      Comuna
                    </label>
                    <select
                      id="commune"
                      name="commune"
                      value={formData.commune}
                      onChange={handleInputChange}
                      className={`w-full px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 bg-white/20 border rounded-lg text-xs sm:text-sm md:text-base text-white focus:outline-none focus:ring-1 sm:focus:ring-2 ${
                        errors.commune 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-white/30 focus:ring-yellow-400'
                      }`}
                    >
                      <option value="" className="bg-purple-900">Selecciona tu comuna</option>
                      <option value="santiago" className="bg-purple-900">Santiago</option>
                      <option value="las-condes" className="bg-purple-900">Las Condes</option>
                      <option value="providencia" className="bg-purple-900">Providencia</option>
                      {/* Add more communes as needed */}
                    </select>
                    {errors.commune && <p className="text-white text-xs mt-1">(Este campo es requerido)</p>}
                  </div>
                </div>

                {/* Fifth Row: Dirección - Full width on all screen sizes */}
                <div>
                  <label htmlFor="address" className="block text-xs sm:text-sm font-medium text-gray-200 mb-1">
                    Dirección
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 bg-white/20 border rounded-lg text-xs sm:text-sm md:text-base text-white placeholder-gray-300 focus:outline-none focus:ring-1 sm:focus:ring-2 ${
                      errors.address 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-white/30 focus:ring-yellow-400'
                    }`}
                    placeholder="Tu dirección completa"
                  />
                  {errors.address && <p className="text-white text-xs mt-1">(Este campo es requerido)</p>}
                </div>

                {/* Auto-fill and Next buttons */}
                <div className="flex justify-between items-center mt-4 sm:mt-6 md:mt-8">
                  <button
                    type="button"
                    onClick={handleAutoFill}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-white/20 text-gray-200 rounded-lg hover:bg-white/30 transition-colors border border-white/30"
                  >
                    Autocompletar
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-4 py-1.5 sm:px-6 sm:py-2 text-xs sm:text-sm bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 font-bold rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all shadow-md sm:shadow-lg"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Información de Acceso</h2>
                
                {/* First Row: Nombre de Usuario */}
                <div>
                  <label htmlFor="username" className="block text-xs sm:text-sm font-medium text-gray-200 mb-1">
                    Nombre de Usuario
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={`w-full px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 bg-white/20 border rounded-lg text-xs sm:text-sm md:text-base text-white placeholder-gray-300 focus:outline-none focus:ring-1 sm:focus:ring-2 ${
                      errors.username 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-white/30 focus:ring-yellow-400'
                    }`}
                    placeholder="Nombre de usuario único"
                  />
                  {errors.username && <p className="text-white text-xs mt-1">(Este campo es requerido)</p>}
                </div>

                {/* Second Row: Correo Electrónico Personal */}
                <div>
                  <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-200 mb-1">
                    Correo Electrónico Personal
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 bg-white/20 border rounded-lg text-xs sm:text-sm md:text-base text-white placeholder-gray-300 focus:outline-none focus:ring-1 sm:focus:ring-2 ${
                      errors.email 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-white/30 focus:ring-yellow-400'
                    }`}
                    placeholder="tu@email.com"
                  />
                  {errors.email && (
                    <p className="text-white text-xs mt-1">
                      {!formData.email.trim() 
                        ? '(Este campo es requerido)' 
                        : '(Formato de correo inválido)'}
                    </p>
                  )}
                </div>

                {/* Third Row: Correo Electrónico de Respaldo */}
                <div>
                  <label htmlFor="backupEmail" className="block text-xs sm:text-sm font-medium text-gray-200 mb-1">
                    Correo Electrónico de Respaldo (Opcional)
                  </label>
                  <input
                    type="email"
                    id="backupEmail"
                    name="backupEmail"
                    value={formData.backupEmail}
                    onChange={handleInputChange}
                    className={`w-full px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 bg-white/20 border rounded-lg text-xs sm:text-sm md:text-base text-white placeholder-gray-300 focus:outline-none focus:ring-1 sm:focus:ring-2 ${
                      errors.backupEmail 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-white/30 focus:ring-yellow-400'
                    }`}
                    placeholder="respaldo@email.com"
                  />
                  {errors.backupEmail && (
                    <p className="text-white text-xs mt-1">(Formato de correo inválido)</p>
                  )}
                </div>

                {/* Fourth Row: Contraseña */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-200">
                      Contraseña
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPasswordHelp(true)}
                      className="w-4 h-4 rounded-full border border-yellow-400 bg-transparent hover:bg-yellow-400/10 transition-colors flex items-center justify-center text-yellow-400 text-xs font-bold"
                    >
                      ?
                    </button>
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 bg-white/20 border rounded-lg text-xs sm:text-sm md:text-base text-white placeholder-gray-300 focus:outline-none focus:ring-1 sm:focus:ring-2 ${
                      errors.password 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-white/30 focus:ring-yellow-400'
                    }`}
                    placeholder="Contraseña segura"
                  />
                  {errors.password && (
                    <p className="text-white text-xs mt-1">
                      {!formData.password
                        ? '(Este campo es requerido)'
                        : '(La contraseña debe tener al menos 8 caracteres, una mayúscula y un número)'}
                    </p>
                  )}
                </div>

                {/* Fifth Row: Repetir Contraseña */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-medium text-gray-200 mb-1">
                    Repetir Contraseña
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 bg-white/20 border rounded-lg text-xs sm:text-sm md:text-base text-white placeholder-gray-300 focus:outline-none focus:ring-1 sm:focus:ring-2 ${
                      errors.confirmPassword 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-white/30 focus:ring-yellow-400'
                    }`}
                    placeholder="Repite tu contraseña"
                  />
                  {errors.confirmPassword && (
                    <p className="text-white text-xs mt-1">
                      {!formData.confirmPassword
                        ? '(Este campo es requerido)'
                        : '(Las contraseñas deben coincidir)'}
                    </p>
                  )}
                </div>

                {/* Password Help Popup */}
                {showPasswordHelp && (
                  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-xl sm:rounded-2xl border border-white/20 p-6 sm:p-8 max-w-md w-full shadow-2xl">
                      <div className="text-center">
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Requisitos de Contraseña</h3>
                        <p className="text-gray-200 mb-4">
                          La contraseña debe cumplir con los siguientes requisitos:
                        </p>
                        <ul className="text-gray-200 text-left mb-4 space-y-2">
                          <li className="flex items-start gap-2">
                            <span className="text-yellow-400">•</span>
                            <span>Mínimo 8 caracteres</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-yellow-400">•</span>
                            <span>Al menos una letra mayúscula</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-yellow-400">•</span>
                            <span>Al menos un número</span>
                          </li>
                        </ul>
                        <p className="text-gray-200 mb-4">
                          <strong>Ejemplo:</strong> Password123
                        </p>
                        <button
                          onClick={() => setShowPasswordHelp(false)}
                          className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 font-bold rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all shadow-lg"
                        >
                          Entendido
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Auto-fill and Next/Previous buttons */}
                <div className="flex justify-between items-center mt-4 sm:mt-6 md:mt-8">
                  <button
                    type="button"
                    onClick={handleAutoFill}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-white/20 text-gray-200 rounded-lg hover:bg-white/30 transition-colors border border-white/30"
                  >
                    Autocompletar
                  </button>
                  <div className="flex gap-2 sm:gap-3">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-3 py-1.5 sm:px-6 sm:py-2 text-xs sm:text-sm bg-white/20 text-gray-200 rounded-lg hover:bg-white/30 transition-colors border border-white/30"
                    >
                      Anterior
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-3 py-1.5 sm:px-6 sm:py-2 text-xs sm:text-sm bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 font-bold rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all shadow-md sm:shadow-lg"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Información del Negocio</h2>
                
                {/* First Row: Nombre del Negocio */}
                <div>
                  <label htmlFor="businessName" className="block text-xs sm:text-sm font-medium text-gray-200 mb-1">
                    Nombre del Negocio
                  </label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    className={`w-full px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 bg-white/20 border rounded-lg text-xs sm:text-sm md:text-base text-white placeholder-gray-300 focus:outline-none focus:ring-1 sm:focus:ring-2 ${
                      errors.businessName 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-white/30 focus:ring-yellow-400'
                    }`}
                    placeholder="Ingresa el nombre del negocio"
                  />
                  {errors.businessName && <p className="text-white text-xs mt-1">(Este campo es requerido)</p>}
                </div>

                {/* Second Row: Dirección */}
                <div>
                  <label htmlFor="businessAddress" className="block text-xs sm:text-sm font-medium text-gray-200 mb-1">
                    Dirección
                  </label>
                  <input
                    type="text"
                    id="businessAddress"
                    name="businessAddress"
                    value={formData.businessAddress}
                    onChange={handleInputChange}
                    className={`w-full px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 bg-white/20 border rounded-lg text-xs sm:text-sm md:text-base text-white placeholder-gray-300 focus:outline-none focus:ring-1 sm:focus:ring-2 ${
                      errors.businessAddress 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-white/30 focus:ring-yellow-400'
                    }`}
                    placeholder="Ingresa la dirección completa"
                  />
                  {errors.businessAddress && <p className="text-white text-xs mt-1">(Este campo es requerido)</p>}
                </div>

                {/* Third Row: Teléfono y WhatsApp - Same row on all screen sizes */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                  <div>
                    <label htmlFor="businessPhone" className="block text-xs sm:text-sm font-medium text-gray-200 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      id="businessPhone"
                      name="businessPhone"
                      value={formData.businessPhone}
                      onChange={handleInputChange}
                      className={`w-full px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 bg-white/20 border rounded-lg text-xs sm:text-sm md:text-base text-white placeholder-gray-300 focus:outline-none focus:ring-1 sm:focus:ring-2 ${
                        errors.businessPhone 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-white/30 focus:ring-yellow-400'
                      }`}
                      placeholder="Ingresa el número"
                    />
                    {errors.businessPhone && <p className="text-white text-xs mt-1">(Este campo es requerido)</p>}
                  </div>
                  <div>
                    <label htmlFor="businessWhatsApp" className="block text-xs sm:text-sm font-medium text-gray-200 mb-1">
                      WhatsApp
                    </label>
                    <input
                      type="tel"
                      id="businessWhatsApp"
                      name="businessWhatsApp"
                      value={formData.businessWhatsApp}
                      onChange={handleInputChange}
                      className="w-full px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 bg-white/20 border border-white/30 rounded-lg text-xs sm:text-sm md:text-base text-white placeholder-gray-300 focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-yellow-400"
                      placeholder="Ingresa el número"
                    />
                  </div>
                </div>

                {/* Fourth Row: Email del Negocio */}
                <div>
                  <label htmlFor="businessEmail" className="block text-xs sm:text-sm font-medium text-gray-200 mb-1">
                    Email del Negocio
                  </label>
                  <input
                    type="email"
                    id="businessEmail"
                    name="businessEmail"
                    value={formData.businessEmail}
                    onChange={handleInputChange}
                    className={`w-full px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 bg-white/20 border rounded-lg text-xs sm:text-sm md:text-base text-white placeholder-gray-300 focus:outline-none focus:ring-1 sm:focus:ring-2 ${
                      errors.businessEmail 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-white/30 focus:ring-yellow-400'
                    }`}
                    placeholder="Ingresa el correo electrónico del negocio"
                  />
                  {errors.businessEmail && (
                    <p className="text-white text-xs mt-1">
                      {!formData.businessEmail.trim() 
                        ? '(Este campo es requerido)' 
                        : '(Formato de correo inválido)'}
                    </p>
                  )}
                </div>

                {/* Fifth Row: Nombre del Responsable del Negocio */}
                <div>
                  <label htmlFor="businessOwner" className="block text-xs sm:text-sm font-medium text-gray-200 mb-1">
                    Nombre del Responsable del Negocio
                  </label>
                  <input
                    type="text"
                    id="businessOwner"
                    name="businessOwner"
                    value={formData.businessOwner}
                    onChange={handleInputChange}
                    className={`w-full px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 bg-white/20 border rounded-lg text-xs sm:text-sm md:text-base text-white placeholder-gray-300 focus:outline-none focus:ring-1 sm:focus:ring-2 ${
                      errors.businessOwner 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-white/30 focus:ring-yellow-400'
                    }`}
                    placeholder="Ingresa el nombre del responsable del negocio"
                  />
                  {errors.businessOwner && <p className="text-white text-xs mt-1">(Este campo es requerido)</p>}
                </div>

                {/* Sixth Row: Característica del Negocio (replacing horarios) */}
                <div>
                  <label htmlFor="businessFeature" className="block text-xs sm:text-sm font-medium text-gray-200 mb-1">
                    Característica del Negocio
                  </label>
                  <textarea
                    id="businessFeature"
                    name="businessFeature"
                    value={formData.businessFeature}
                    onChange={handleInputChange}
                    className={`w-full px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 bg-white/20 border rounded-lg text-xs sm:text-sm md:text-base text-white placeholder-gray-300 focus:outline-none focus:ring-1 sm:focus:ring-2 ${
                      errors.businessFeature 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-white/30 focus:ring-yellow-400'
                    } min-h-[100px]`}
                    placeholder="Describe una característica distintiva de tu negocio"
                  />
                  {errors.businessFeature && <p className="text-white text-xs mt-1">(Este campo es requerido)</p>}
                </div>

                {/* Auto-fill and Next/Previous buttons */}
                <div className="flex justify-between items-center mt-4 sm:mt-6 md:mt-8">
                  <button
                    type="button"
                    onClick={handleAutoFill}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-white/20 text-gray-200 rounded-lg hover:bg-white/30 transition-colors border border-white/30"
                  >
                    Autocompletar
                  </button>
                  <div className="flex gap-2 sm:gap-3">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-3 py-1.5 sm:px-6 sm:py-2 text-xs sm:text-sm bg-white/20 text-gray-200 rounded-lg hover:bg-white/30 transition-colors border border-white/30"
                    >
                      Anterior
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-3 py-1.5 sm:px-6 sm:py-2 text-xs sm:text-sm bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 font-bold rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all shadow-md sm:shadow-lg"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-lg sm:text-xl font-semibold text-white mb-6">Términos y Condiciones</h2>
                
                <div className="bg-white/5 rounded-lg p-4 space-y-4 text-xs sm:text-sm text-gray-200">
                  <p className="mb-4">
                    Al registrarse en nuestra plataforma, usted acepta los siguientes términos y condiciones:
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="text-yellow-400 mt-1">•</span>
                      <p><strong className="text-white">Solo Vitrinas:</strong> Nuestra página es únicamente una plataforma de exhibición de productos (vitrinas) y no realizamos ventas directas de productos.</p>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <span className="text-yellow-400 mt-1">•</span>
                      <p><strong className="text-white">No Responsables:</strong> No somos responsables de los productos exhibidos ni de su calidad, precios o disponibilidad.</p>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <span className="text-yellow-400 mt-1">•</span>
                      <p><strong className="text-white">Datos Fidedignos:</strong> Usted se compromete a proporcionar información veraz y actualizada de su negocio y productos.</p>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <span className="text-yellow-400 mt-1">•</span>
                      <p><strong className="text-white">Imágenes Gratuitas:</strong> Tendrá la posibilidad gratuita de subir hasta 7 imágenes que serán distribuidas en las secciones que más le acomoden.</p>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <span className="text-yellow-400 mt-1">•</span>
                      <p><strong className="text-white">Uso Responsable:</strong> Se prohíbe el uso indebido de la plataforma y la publicación de contenido inapropiado.</p>
                    </div>
                  </div>
                  
                  <p className="mt-4 pt-4 border-t border-white/10">
                    Al aceptar estos términos, usted podrá acceder a su panel de administración para comenzar a subir sus imágenes y gestionar su vitrina.
                  </p>
                </div>
                
                {/* Confirm and Previous buttons */}
                <div className="flex justify-between items-center mt-6">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-3 py-1.5 sm:px-6 sm:py-2 text-xs sm:text-sm bg-white/20 text-gray-200 rounded-lg hover:bg-white/30 transition-colors border border-white/30"
                  >
                    Anterior
                  </button>
                  <button
                    type="button"
                    onClick={handleAccept}
                    className="px-4 py-1.5 sm:px-6 sm:py-2 text-xs sm:text-sm bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-md sm:shadow-lg"
                  >
                    Acepto los Términos
                  </button>
                </div>
              </div>
            )}

            {/* Welcome Popup */}
            {showWelcomePopup && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-xl sm:rounded-2xl border border-white/20 p-6 sm:p-8 max-w-md w-full shadow-2xl">
                  <div className="text-center">
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">¡Bienvenido a Solo a un CLICK!</h2>
                    <p className="text-gray-200 mb-6">
                      Su registro se ha completado exitosamente. Ahora puede ingresar a su panel de administración para comenzar a subir sus imágenes y gestionar su vitrina.
                    </p>
                    <button
                      onClick={closeWelcomePopup}
                      className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 font-bold rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all shadow-lg"
                    >
                      Ir al Panel de Administración
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}