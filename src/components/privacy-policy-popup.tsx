'use client'

import { X } from 'lucide-react'
import { useEffect } from 'react'

interface PrivacyPolicyPopupProps {
  isOpen: boolean
  onClose: () => void
}

export function PrivacyPolicyPopup({ isOpen, onClose }: PrivacyPolicyPopupProps) {
  // Cerrar con tecla ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden' // Prevenir scroll del body
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center p-4 bg-black/60 backdrop-blur-sm md:items-start items-start md:pt-24 pt-20"
      onClick={onClose}
    >
      {/* Popup Container */}
      <div
        className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] md:max-h-[85vh] max-h-[calc(100vh-100px)] overflow-hidden border-2 border-yellow-400/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con gradiente */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-900 via-purple-700 to-purple-600 px-4 md:px-6 py-3 md:py-4 border-b-2 border-yellow-400 shadow-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-lg md:text-2xl font-bold text-yellow-300 flex items-center gap-2">
              🔒 Políticas de Privacidad
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 md:p-2 hover:bg-purple-800 rounded-full transition-colors group"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5 md:w-6 md:h-6 text-yellow-300 group-hover:text-yellow-400" />
            </button>
          </div>
        </div>

        {/* Contenido con scroll */}
        <div className="overflow-y-auto max-h-[calc(85vh-80px)] px-4 md:px-6 py-3 md:py-6">
          <div className="space-y-2 md:space-y-6 text-purple-50">

            {/* Introducción */}
            <section>
              <h3 className="text-base md:text-xl font-bold text-yellow-300 mb-1 md:mb-3">
                Compromiso con tu Privacidad
              </h3>
              <p className="text-xs md:text-sm leading-snug md:leading-relaxed text-justify">
                En <span className="font-semibold text-yellow-300">Solo a un Click</span>, nos comprometemos a proteger tu privacidad y garantizar la seguridad de tus datos personales. Esta política describe cómo recopilamos, usamos y protegemos tu información de acuerdo con la legislación chilena vigente.
              </p>
            </section>

            {/* Marco Legal */}
            <section className="bg-purple-800/40 rounded-lg p-2 md:p-4 border border-yellow-400/30">
              <h3 className="text-base md:text-xl font-bold text-yellow-300 mb-1 md:mb-3">
                Marco Legal Chileno
              </h3>
              <div className="space-y-1 md:space-y-3 text-xs md:text-sm">
                <div>
                  <p className="font-semibold text-yellow-200">📜 Ley N° 19.628 - Protección de Datos Personales</p>
                  <p className="text-purple-100 mt-0.5 md:mt-1 leading-snug md:leading-relaxed text-justify">
                    Cumplimos estrictamente con la Ley sobre Protección de la Vida Privada, garantizando el tratamiento adecuado de tus datos personales y tu derecho a la privacidad.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-yellow-200">🛡️ Ley N° 21.096 - Derechos del Consumidor Digital</p>
                  <p className="text-purple-100 mt-0.5 md:mt-1 leading-snug md:leading-relaxed text-justify">
                    Respetamos tus derechos como consumidor en plataformas digitales, asegurando transparencia en el tratamiento de tu información.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-yellow-200">⚖️ Ley N° 19.496 - Protección de los Derechos de los Consumidores</p>
                  <p className="text-purple-100 mt-0.5 md:mt-1 leading-snug md:leading-relaxed text-justify">
                    Nos adherimos a las normativas de protección del consumidor, garantizando información clara y veraz.
                  </p>
                </div>
              </div>
            </section>

            {/* Información que Recopilamos */}
            <section>
              <h3 className="text-base md:text-xl font-bold text-yellow-300 mb-1 md:mb-3">
                Información que Recopilamos
              </h3>
              <div className="space-y-2 text-xs md:text-sm">
                <div className="flex gap-2">
                  <span className="text-yellow-300">•</span>
                  <p className="leading-snug md:leading-relaxed text-justify"><strong>Datos de Navegación:</strong> Información sobre tu uso de la plataforma, páginas visitadas y productos consultados.</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-yellow-300">•</span>
                  <p className="leading-snug md:leading-relaxed text-justify"><strong>Datos de Contacto:</strong> Información que proporcionas voluntariamente al contactar negocios a través de nuestra plataforma.</p>
                </div>
              </div>
            </section>

            {/* Uso de la Información */}
            <section>
              <h3 className="text-base md:text-xl font-bold text-yellow-300 mb-1 md:mb-3">
                Uso de tu Información
              </h3>
              <div className="space-y-2 text-xs md:text-sm">
                <div className="flex gap-2">
                  <span className="text-yellow-300">✓</span>
                  <p className="leading-snug md:leading-relaxed text-justify">Facilitar la conexión entre consumidores y negocios locales.</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-yellow-300">✓</span>
                  <p className="leading-snug md:leading-relaxed text-justify">Mejorar nuestros servicios y experiencia de usuario.</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-yellow-300">✓</span>
                  <p className="leading-snug md:leading-relaxed text-justify">Enviar comunicaciones relevantes (solo con tu consentimiento).</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-yellow-300">✓</span>
                  <p className="leading-snug md:leading-relaxed text-justify">Cumplir con obligaciones legales y regulatorias.</p>
                </div>
              </div>
            </section>

            {/* Tus Derechos */}
            <section className="bg-purple-800/40 rounded-lg p-2 md:p-4 border border-yellow-400/30">
              <h3 className="text-base md:text-xl font-bold text-yellow-300 mb-1 md:mb-3">
                Tus Derechos (Art. 12 Ley N° 19.628)
              </h3>
              <div className="space-y-2 text-xs md:text-sm">
                <div className="flex gap-2">
                  <span className="text-yellow-300">🔍</span>
                  <p className="leading-snug md:leading-relaxed text-justify"><strong>Derecho de Acceso:</strong> Solicitar información sobre los datos que tenemos sobre ti.</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-yellow-300">✏️</span>
                  <p className="leading-snug md:leading-relaxed text-justify"><strong>Derecho de Rectificación:</strong> Corregir datos inexactos o incompletos.</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-yellow-300">🗑️</span>
                  <p className="leading-snug md:leading-relaxed text-justify"><strong>Derecho de Cancelación:</strong> Solicitar la eliminación de tus datos personales.</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-yellow-300">🚫</span>
                  <p className="leading-snug md:leading-relaxed text-justify"><strong>Derecho de Oposición:</strong> Oponerte al tratamiento de tus datos en ciertos casos.</p>
                </div>
              </div>
            </section>

            {/* Seguridad */}
            <section>
              <h3 className="text-base md:text-xl font-bold text-yellow-300 mb-1 md:mb-3">
                Seguridad de tus Datos
              </h3>
              <p className="text-xs md:text-sm leading-snug md:leading-relaxed text-justify">
                Implementamos medidas técnicas y organizativas apropiadas para proteger tus datos personales contra acceso no autorizado, pérdida, destrucción o alteración. Utilizamos encriptación SSL/TLS y seguimos las mejores prácticas de la industria.
              </p>
            </section>

            {/* Compartir Información */}
            <section>
              <h3 className="text-base md:text-xl font-bold text-yellow-300 mb-1 md:mb-3">
                Compartir Información
              </h3>
              <p className="text-xs md:text-sm leading-snug md:leading-relaxed text-justify">
                <span className="font-semibold text-yellow-300">Solo a un Click</span> es una plataforma de exhibición. No compartimos tu información personal con terceros, excepto:
              </p>
              <div className="space-y-2 mt-2 text-xs md:text-sm">
                <div className="flex gap-2">
                  <span className="text-yellow-300">•</span>
                  <p className="leading-snug md:leading-relaxed text-justify">Cuando tú decides contactar directamente a un negocio publicado.</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-yellow-300">•</span>
                  <p className="leading-snug md:leading-relaxed text-justify">Cuando sea requerido por ley o autoridad competente.</p>
                </div>
              </div>
            </section>

            {/* Contacto */}
            <section className="bg-gradient-to-r from-purple-800/60 to-purple-700/60 rounded-lg p-2 md:p-4 border border-yellow-400/50">
              <h3 className="text-base md:text-xl font-bold text-yellow-300 mb-1 md:mb-3">
                Contacto y Consultas
              </h3>
              <p className="text-xs md:text-sm leading-relaxed mb-2">
                Para ejercer tus derechos o consultas sobre privacidad, contáctanos:
              </p>
              <div className="space-y-1 text-xs md:text-sm">
                <p className="flex items-center gap-2">
                  <span className="text-yellow-300">📧</span>
                  <span className="font-semibold">Email:</span> soloaunclick@gmail.com
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-yellow-300">🏢</span>
                  <span className="font-semibold">Plataforma:</span> Solo a un Click - Chile
                </p>
              </div>
            </section>

            {/* Actualización */}
            <section className="text-center pt-2 md:pt-4 border-t border-yellow-400/30">
              <p className="text-[10px] md:text-xs text-purple-200">
                <strong>Última actualización:</strong> Enero 2025
              </p>
              <p className="text-[10px] md:text-xs text-purple-200 mt-1">
                Nos reservamos el derecho de actualizar esta política. Te notificaremos de cambios significativos.
              </p>
            </section>
          </div>
        </div>

        {/* Footer del popup */}
        <div className="sticky bottom-0 bg-gradient-to-r from-purple-900 via-purple-700 to-purple-600 px-4 md:px-6 py-3 md:py-4 border-t-2 border-yellow-400">
          <button
            onClick={onClose}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-bold py-2 md:py-3 px-4 rounded-lg transition-colors text-xs md:text-sm shadow-lg"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  )
}
