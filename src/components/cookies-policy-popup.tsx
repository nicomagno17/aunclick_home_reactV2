'use client'

import { X } from 'lucide-react'
import { useEffect } from 'react'

interface CookiesPolicyPopupProps {
  isOpen: boolean
  onClose: () => void
}

export function CookiesPolicyPopup({ isOpen, onClose }: CookiesPolicyPopupProps) {
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
              🍪 Política de Cookies
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
                ¿Qué son las Cookies?
              </h3>
              <p className="text-xs md:text-sm leading-snug md:leading-relaxed text-justify">
                Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web. En <span className="font-semibold text-yellow-300">Solo a un Click</span>, utilizamos cookies para mejorar tu experiencia de navegación, recordar tus preferencias y analizar el uso de nuestra plataforma.
              </p>
            </section>

            {/* Marco Legal */}
            <section className="bg-purple-800/40 rounded-lg p-2 md:p-4 border border-yellow-400/30">
              <h3 className="text-base md:text-xl font-bold text-yellow-300 mb-1 md:mb-3">
                Marco Legal
              </h3>
              <div className="space-y-2 text-xs md:text-sm">
                <div>
                  <p className="font-semibold text-yellow-200">📜 Ley N° 19.628 - Protección de Datos Personales</p>
                  <p className="text-purple-100 mt-0.5 md:mt-1 leading-snug md:leading-relaxed text-justify">
                    El uso de cookies está regulado por la ley chilena de protección de datos, garantizando la transparencia en el tratamiento de tu información.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-yellow-200">🌐 Reglamento General de Protección de Datos (GDPR)</p>
                  <p className="text-purple-100 mt-0.5 md:mt-1 leading-snug md:leading-relaxed text-justify">
                    Aunque somos una empresa chilena, seguimos estándares internacionales de privacidad para proteger mejor tus datos.
                  </p>
                </div>
              </div>
            </section>

            {/* Tipos de Cookies que Utilizamos */}
            <section>
              <h3 className="text-base md:text-xl font-bold text-yellow-300 mb-1 md:mb-3">
                Tipos de Cookies que Utilizamos
              </h3>

              <div className="space-y-1.5 md:space-y-4">
                {/* Cookies Técnicas */}
                <div className="bg-purple-800/30 rounded-lg p-2 md:p-4 border border-purple-600/50">
                  <h4 className="font-bold text-yellow-200 mb-1 md:mb-2 text-sm md:text-base flex items-center gap-2">
                    <span className="text-lg">⚙️</span> Cookies Técnicas (Esenciales)
                  </h4>
                  <p className="text-xs md:text-sm text-purple-100 mb-1 md:mb-2 leading-snug md:leading-relaxed">
                    Son necesarias para el funcionamiento básico de la plataforma. No se pueden desactivar.
                  </p>
                  <div className="space-y-1 text-xs md:text-sm">
                    <div className="flex gap-2">
                      <span className="text-yellow-300">•</span>
                      <p className="text-purple-100 leading-snug md:leading-normal text-justify">Mantener tu sesión activa</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-yellow-300">•</span>
                      <p className="text-purple-100 leading-snug md:leading-normal text-justify">Recordar tus preferencias de navegación</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-yellow-300">•</span>
                      <p className="text-purple-100 leading-snug md:leading-normal text-justify">Garantizar la seguridad de la plataforma</p>
                    </div>
                  </div>
                </div>

                {/* Cookies de Rendimiento */}
                <div className="bg-purple-800/30 rounded-lg p-2 md:p-4 border border-purple-600/50">
                  <h4 className="font-bold text-yellow-200 mb-1 md:mb-2 text-sm md:text-base flex items-center gap-2">
                    <span className="text-lg">📊</span> Cookies de Rendimiento y Análisis
                  </h4>
                  <p className="text-xs md:text-sm text-purple-100 mb-1 md:mb-2 leading-snug md:leading-relaxed">
                    Nos ayudan a entender cómo los usuarios interactúan con nuestra plataforma.
                  </p>
                  <div className="space-y-1 text-xs md:text-sm">
                    <div className="flex gap-2">
                      <span className="text-yellow-300">•</span>
                      <p className="text-purple-100 leading-snug md:leading-normal text-justify">Analizar el tráfico del sitio web</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-yellow-300">•</span>
                      <p className="text-purple-100 leading-snug md:leading-normal text-justify">Identificar páginas más visitadas</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-yellow-300">•</span>
                      <p className="text-purple-100 leading-snug md:leading-normal text-justify">Mejorar la experiencia del usuario</p>
                    </div>
                  </div>
                </div>

                {/* Cookies Funcionales */}
                <div className="bg-purple-800/30 rounded-lg p-2 md:p-4 border border-purple-600/50">
                  <h4 className="font-bold text-yellow-200 mb-1 md:mb-2 text-sm md:text-base flex items-center gap-2">
                    <span className="text-lg">🎯</span> Cookies Funcionales
                  </h4>
                  <p className="text-xs md:text-sm text-purple-100 mb-1 md:mb-2 leading-snug md:leading-relaxed">
                    Permiten funcionalidades mejoradas y personalización.
                  </p>
                  <div className="space-y-1 text-xs md:text-sm">
                    <div className="flex gap-2">
                      <span className="text-yellow-300">•</span>
                      <p className="text-purple-100 leading-snug md:leading-normal text-justify">Recordar productos que has visto</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-yellow-300">•</span>
                      <p className="text-purple-100 leading-snug md:leading-normal text-justify">Guardar tus preferencias de búsqueda</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-yellow-300">•</span>
                      <p className="text-purple-100 leading-snug md:leading-normal text-justify">Personalizar contenido según tus intereses</p>
                    </div>
                  </div>
                </div>

                {/* Cookies de Terceros */}
                <div className="bg-purple-800/30 rounded-lg p-2 md:p-4 border border-purple-600/50">
                  <h4 className="font-bold text-yellow-200 mb-1 md:mb-2 text-sm md:text-base flex items-center gap-2">
                    <span className="text-lg">🔗</span> Cookies de Terceros
                  </h4>
                  <p className="text-xs md:text-sm text-purple-100 mb-1 md:mb-2 leading-snug md:leading-relaxed">
                    Algunas herramientas que utilizamos pueden instalar sus propias cookies.
                  </p>
                  <div className="space-y-1 text-xs md:text-sm">
                    <div className="flex gap-2">
                      <span className="text-yellow-300">•</span>
                      <p className="text-purple-100 leading-snug md:leading-normal text-justify">Google Analytics (análisis de tráfico)</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-yellow-300">•</span>
                      <p className="text-purple-100 leading-snug md:leading-normal text-justify">Servicios de mapas y geolocalización</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-yellow-300">•</span>
                      <p className="text-purple-100 leading-snug md:leading-normal text-justify">Plataformas de comunicación (WhatsApp, Email)</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Duración de las Cookies */}
            <section className="bg-purple-800/40 rounded-lg p-2 md:p-4 border border-yellow-400/30">
              <h3 className="text-base md:text-xl font-bold text-yellow-300 mb-1 md:mb-3">
                Duración de las Cookies
              </h3>
              <div className="space-y-2 text-xs md:text-sm">
                <div>
                  <p className="font-semibold text-yellow-200">⏱️ Cookies de Sesión</p>
                  <p className="text-purple-100 mt-0.5 md:mt-1 leading-snug md:leading-relaxed text-justify">
                    Se eliminan automáticamente cuando cierras tu navegador. Se utilizan para funciones temporales durante tu visita.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-yellow-200">📅 Cookies Persistentes</p>
                  <p className="text-purple-100 mt-0.5 md:mt-1 leading-snug md:leading-relaxed text-justify">
                    Permanecen en tu dispositivo durante un tiempo definido (generalmente hasta 12 meses) para recordar tus preferencias entre visitas.
                  </p>
                </div>
              </div>
            </section>

            {/* Gestión y Control */}
            <section>
              <h3 className="text-base md:text-xl font-bold text-yellow-300 mb-1 md:mb-3">
                Cómo Gestionar las Cookies
              </h3>
              <p className="text-xs md:text-sm leading-snug md:leading-relaxed mb-2 md:mb-3">
                Tienes control total sobre las cookies. Puedes gestionarlas de las siguientes formas:
              </p>
              <div className="space-y-2 text-xs md:text-sm">
                <div className="flex gap-2">
                  <span className="text-yellow-300">🌐</span>
                  <div>
                    <p className="font-semibold text-yellow-200">Configuración del Navegador</p>
                    <p className="text-purple-100 leading-snug md:leading-relaxed">
                      Todos los navegadores permiten bloquear o eliminar cookies desde su configuración. Ten en cuenta que esto puede afectar la funcionalidad del sitio.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="text-yellow-300">🔧</span>
                  <div>
                    <p className="font-semibold text-yellow-200">Herramientas de Terceros</p>
                    <p className="text-purple-100 leading-snug md:leading-relaxed">
                      Puedes usar extensiones de navegador o herramientas específicas para gestionar cookies de forma más granular.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="text-yellow-300">❌</span>
                  <div>
                    <p className="font-semibold text-yellow-200">Eliminar Cookies</p>
                    <p className="text-purple-100 leading-snug md:leading-relaxed">
                      Puedes eliminar todas las cookies almacenadas en cualquier momento desde la configuración de tu navegador.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Guías por Navegador */}
            <section className="bg-purple-800/30 rounded-lg p-2 md:p-4 border border-purple-600/50">
              <h3 className="text-base md:text-xl font-bold text-yellow-300 mb-1 md:mb-3">
                Guías por Navegador
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs md:text-sm">
                <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-purple-100 hover:text-yellow-300 transition-colors">
                  <span className="text-yellow-300">→</span>
                  <span>Google Chrome</span>
                </a>
                <a href="https://support.mozilla.org/es/kb/cookies-informacion-que-los-sitios-web-guardan-en-" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-purple-100 hover:text-yellow-300 transition-colors">
                  <span className="text-yellow-300">→</span>
                  <span>Mozilla Firefox</span>
                </a>
                <a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-purple-100 hover:text-yellow-300 transition-colors">
                  <span className="text-yellow-300">→</span>
                  <span>Microsoft Edge</span>
                </a>
                <a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-purple-100 hover:text-yellow-300 transition-colors">
                  <span className="text-yellow-300">→</span>
                  <span>Safari (macOS/iOS)</span>
                </a>
              </div>
            </section>

            {/* Consentimiento */}
            <section>
              <h3 className="text-base md:text-xl font-bold text-yellow-300 mb-1 md:mb-3">
                Tu Consentimiento
              </h3>
              <p className="text-xs md:text-sm leading-snug md:leading-relaxed text-justify">
                Al continuar navegando en <span className="font-semibold text-yellow-300">Solo a un Click</span>, aceptas el uso de cookies según esta política. Las cookies esenciales se utilizan automáticamente para el funcionamiento del sitio, mientras que puedes rechazar las cookies opcionales ajustando la configuración de tu navegador.
              </p>
            </section>

            {/* Contacto */}
            <section className="bg-gradient-to-r from-purple-800/60 to-purple-700/60 rounded-lg p-2 md:p-4 border border-yellow-400/50">
              <h3 className="text-base md:text-xl font-bold text-yellow-300 mb-1 md:mb-3">
                ¿Tienes Preguntas?
              </h3>
              <p className="text-xs md:text-sm leading-relaxed mb-2">
                Si tienes dudas sobre nuestra política de cookies, contáctanos:
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
                Esta política puede ser actualizada periódicamente. Te recomendamos revisarla regularmente.
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
            Aceptar y Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
