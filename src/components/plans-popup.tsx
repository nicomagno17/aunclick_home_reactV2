'use client'

import { X, Check, ChevronRight } from 'lucide-react'
import { useEffect } from 'react'

interface PlansPopupProps {
  isOpen: boolean
  onClose: () => void
}

export function PlansPopup({ isOpen, onClose }: PlansPopupProps) {
  // Cerrar con tecla ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const plans = [
    {
      name: 'Plan Gratuito',
      price: '$0',
      period: '',
      badge: null,
      badgeColor: '',
      recommended: false,
      features: {
        basic: [
          { name: 'Imágenes permitidas', value: '5' },
          { name: 'Carrusel', available: false },
          { name: 'Estadísticas', available: false }
        ],
        visibility: [
          { name: 'Aparece en página principal', available: true },
          { name: 'Buscadores', available: true },
          { name: 'Prioridad de aparición', value: 'Normal', priority: 'normal' }
        ],
        functionality: [
          { name: 'Panel de control', available: true },
          { name: 'Editar información', available: true },
          { name: 'Título', available: true },
          { name: 'Información de la tienda', available: true },
          { name: 'Banner', available: false }
        ]
      }
    },
    {
      name: 'Plan Normal',
      price: '$2.990',
      period: '+ IVA Mensual',
      badge: 'RECOMENDADO',
      badgeColor: 'bg-yellow-400 text-purple-900',
      recommended: true,
      features: {
        basic: [
          { name: 'Imágenes permitidas', value: '25' },
          { name: 'Carrusel', value: '1 Carrusel' },
          { name: 'Estadísticas', available: false }
        ],
        visibility: [
          { name: 'Aparece en página principal', available: true },
          { name: 'Buscadores', available: true },
          { name: 'Prioridad de aparición', value: 'Alta', priority: 'high' }
        ],
        functionality: [
          { name: 'Panel de control', available: true },
          { name: 'Editar información', available: true },
          { name: 'Título', available: true },
          { name: 'Información de la tienda', available: true },
          { name: 'Banner', available: false }
        ]
      }
    },
    {
      name: 'Plan Premium',
      price: '$4.990',
      period: '+ IVA Mensual',
      badge: 'MEJOR OPCIÓN',
      badgeColor: 'bg-orange-400 text-black',
      recommended: false,
      features: {
        basic: [
          { name: 'Imágenes permitidas', value: '100' },
          { name: 'Carrusel', value: '2 Carruseles' },
          { name: 'Estadísticas', available: true }
        ],
        visibility: [
          { name: 'Aparece en página principal', available: true },
          { name: 'Buscadores', available: true },
          { name: 'Prioridad de aparición', value: 'Máxima', priority: 'max' }
        ],
        functionality: [
          { name: 'Panel de control', available: true },
          { name: 'Editar información', available: true },
          { name: 'Título', available: true },
          { name: 'Información de la tienda', available: true },
          { name: 'Banner', available: true }
        ]
      }
    }
  ]

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      {/* Header Sticky */}
      <div className="sticky top-0 z-20 bg-gradient-to-r from-purple-900 via-purple-700 to-purple-600 px-4 md:px-6 py-2 md:py-3 border-b-2 border-yellow-400 shadow-lg">
        <div className="container mx-auto max-w-6xl flex items-center justify-between">
          <h2 className="text-base md:text-xl font-bold text-yellow-300 flex items-center gap-2">
            💎 Planes Disponibles
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 md:p-2 hover:bg-purple-800 rounded-full transition-colors group"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4 md:w-5 md:h-5 text-yellow-300 group-hover:text-yellow-400" />
          </button>
        </div>
      </div>

      {/* Popup Container */}
      <div
        className="container mx-auto max-w-6xl p-4 md:p-6"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Plans Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4 mb-4">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-xl overflow-hidden shadow-xl border-2 ${
                plan.recommended ? 'border-yellow-400' : 'border-purple-300'
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className={`absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${plan.badgeColor} shadow-md z-10`}>
                  {plan.badge}
                </div>
              )}

              {/* Plan Header */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 md:p-4 text-center border-b border-purple-200">
                <h3 className="text-base md:text-lg font-bold text-purple-900 mb-1.5">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1.5 mb-0.5">
                  <span className="text-2xl md:text-3xl font-extrabold text-purple-900">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-[9px] md:text-[10px] text-purple-600 font-medium">{plan.period}</span>
                  )}
                </div>
                <button className="mt-2 w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-1.5 md:py-2 px-3 rounded-lg transition-all shadow-md hover:shadow-lg text-xs md:text-sm">
                  Seleccionar Plan
                </button>
              </div>

              {/* Plan Features */}
              <div className="p-2.5 md:p-3 space-y-2.5">
                {/* Características Básicas */}
                <div>
                  <h4 className="text-xs md:text-sm font-bold text-purple-900 mb-1 pb-1 border-b border-purple-200">
                    Características básicas
                  </h4>
                  <div className="space-y-0.5">
                    {plan.features.basic.map((feature, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[10px] md:text-xs py-0.5 border-b border-gray-100">
                        <span className="text-gray-700">{feature.name}</span>
                        {feature.available !== undefined ? (
                          feature.available ? (
                            <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                          ) : (
                            <X className="w-3 h-3 text-red-500 flex-shrink-0" />
                          )
                        ) : (
                          <span className="font-semibold text-purple-900 text-[10px] md:text-xs">{feature.value}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visibilidad */}
                <div>
                  <h4 className="text-xs md:text-sm font-bold text-purple-900 mb-1 pb-1 border-b border-purple-200">
                    Visibilidad
                  </h4>
                  <div className="space-y-0.5">
                    {plan.features.visibility.map((feature, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[10px] md:text-xs py-0.5 border-b border-gray-100">
                        <span className="text-gray-700">{feature.name}</span>
                        {feature.available !== undefined ? (
                          feature.available ? (
                            <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                          ) : (
                            <X className="w-3 h-3 text-red-500 flex-shrink-0" />
                          )
                        ) : (
                          <span className={`font-semibold text-[10px] md:text-xs ${
                            feature.priority === 'normal' ? 'text-gray-600' :
                            feature.priority === 'high' ? 'text-orange-500' :
                            'text-red-600'
                          }`}>
                            {feature.value}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Funcionalidades */}
                <div>
                  <h4 className="text-xs md:text-sm font-bold text-purple-900 mb-1 pb-1 border-b border-purple-200">
                    Funcionalidades
                  </h4>
                  <div className="space-y-0.5">
                    {plan.features.functionality.map((feature, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[10px] md:text-xs py-0.5 border-b border-gray-100">
                        <span className="text-gray-700">{feature.name}</span>
                        {feature.available ? (
                          <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                        ) : (
                          <X className="w-3 h-3 text-red-500 flex-shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="bg-gradient-to-r from-purple-800/60 to-purple-700/60 rounded-lg p-3 md:p-4 border border-yellow-400/50 mb-4">
          <h3 className="text-sm md:text-base font-bold text-yellow-300 mb-1.5">
            ℹ️ Información Importante
          </h3>
          <ul className="space-y-0.5 text-[10px] md:text-xs text-purple-100">
            <li className="flex items-start gap-1.5">
              <ChevronRight className="w-3 h-3 text-yellow-300 flex-shrink-0 mt-0.5" />
              <span>El Plan Premium incluye el primer mes completamente gratis (requiere tarjeta)</span>
            </li>
            <li className="flex items-start gap-1.5">
              <ChevronRight className="w-3 h-3 text-yellow-300 flex-shrink-0 mt-0.5" />
              <span>Puedes cambiar de plan en cualquier momento desde tu panel de administración</span>
            </li>
            <li className="flex items-start gap-1.5">
              <ChevronRight className="w-3 h-3 text-yellow-300 flex-shrink-0 mt-0.5" />
              <span>No cobramos comisiones por tus ventas, solo la suscripción mensual</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
