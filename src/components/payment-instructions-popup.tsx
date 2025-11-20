'use client'

import { X, CreditCard } from 'lucide-react'
import { useEffect } from 'react'

interface PaymentInstructionsPopupProps {
  isOpen: boolean
  onClose: () => void
  planName: string
  planPrice: number
}

export function PaymentInstructionsPopup({ isOpen, onClose, planName, planPrice }: PaymentInstructionsPopupProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
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

  const iva = Math.round(planPrice * 0.19)
  const total = planPrice + iva

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border-2 border-purple-500 max-w-md w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-4 py-3 flex items-center justify-between border-b border-purple-400">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-yellow-300" />
            <h2 className="text-base font-bold text-white">Instrucciones de Pago</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-purple-800 rounded-full transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3 max-h-[75vh] overflow-y-auto">
          {/* Plan y Total */}
          <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-3">
            <p className="text-xs text-purple-300 mb-1">Plan Seleccionado</p>
            <p className="text-lg font-bold text-white mb-2">{planName}</p>
            <div className="flex justify-between text-xs text-gray-300 mb-1">
              <span>Valor del Plan:</span>
              <span>${planPrice.toLocaleString('es-CL')}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-300 mb-2 pb-2 border-b border-gray-700">
              <span>IVA (19%):</span>
              <span>${iva.toLocaleString('es-CL')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-white">Total a Transferir:</span>
              <span className="text-xl font-bold text-green-400">${total.toLocaleString('es-CL')}</span>
            </div>
          </div>

          {/* Promoción Trimestral - Solo para Plan Premium */}
          {planPrice === 4990 && (
            <div className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 border-2 border-green-500/60 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🎉</span>
                <p className="text-xs font-bold text-green-300">¡Oferta Especial Trimestral!</p>
              </div>
              <p className="text-xs text-gray-300 mb-2">
                <span className="font-semibold text-green-400">Paga 2 meses, lleva 3</span> - Solo para clientes nuevos
              </p>
              <div className="bg-black/30 rounded p-2 space-y-1">
                <div className="flex justify-between text-xs text-gray-300">
                  <span>2 meses ($4.990 × 2):</span>
                  <span className="font-semibold">${(9980).toLocaleString('es-CL')}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-300 pb-1 border-b border-gray-600">
                  <span>IVA (19%):</span>
                  <span className="font-semibold">${(1896).toLocaleString('es-CL')}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-xs font-semibold text-white">Total Trimestral:</span>
                  <span className="text-base font-bold text-green-400">${(11876).toLocaleString('es-CL')}</span>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 italic mt-2">
                * El 3er mes es completamente gratis
              </p>
            </div>
          )}

          {/* Datos bancarios */}
          <div className="bg-blue-900/20 border border-blue-500/50 rounded-lg p-3">
            <p className="text-xs font-bold text-blue-300 mb-2">Datos para Transferencia</p>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Banco:</span>
                <span className="text-white font-semibold">Banco Estado</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tipo:</span>
                <span className="text-white font-semibold">Cuenta Corriente</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">N° Cuenta:</span>
                <span className="text-white font-semibold">1234567890</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">RUT:</span>
                <span className="text-white font-semibold">12.345.678-9</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Titular:</span>
                <span className="text-white font-semibold">AunClick SpA</span>
              </div>
            </div>
          </div>

          {/* Instrucciones */}
          <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-3">
            <p className="text-xs font-bold text-green-300 mb-1.5">Siguiente Paso</p>
            <p className="text-xs text-gray-300 mb-2">
              Envía el comprobante a: <span className="font-semibold text-white">pagos@aunclick.cl</span>
            </p>
            <p className="text-xs text-gray-300 mb-2">
              <span className="font-semibold text-yellow-300">Importante:</span> Adjunta tu <span className="font-semibold text-white">RUT y nombre completo</span> en el correo.
            </p>
            <p className="text-xs text-gray-300 mb-2">
              Esta información será enviada a tu <span className="font-semibold text-white">correo personal registrado</span>. Tienes <span className="font-semibold text-yellow-300">48 horas</span> para realizar la transferencia, de lo contrario la suscripción en espera será cancelada.
            </p>
            <p className="text-xs text-gray-300">
              Aprobación en <span className="font-semibold text-yellow-300">1-2 horas</span>. Recibirás confirmación por correo y WhatsApp.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-900 px-4 py-3 border-t border-gray-700 flex justify-center">
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-2 px-6 rounded-lg transition-all text-sm"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  )
}
