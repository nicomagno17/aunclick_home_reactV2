'use client'

import { X } from 'lucide-react'
import { useEffect } from 'react'

interface SecurityPolicyPopupProps {
  isOpen: boolean
  onClose: () => void
}

export function SecurityPolicyPopup({ isOpen, onClose }: SecurityPolicyPopupProps) {
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
              🛡️ Política de Seguridad
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
                Tu Seguridad es Nuestra Prioridad
              </h3>
              <p className="text-xs md:text-sm leading-snug md:leading-relaxed text-justify">
                En <span className="font-semibold text-yellow-300">Solo a un Click</span>, implementamos las mejores prácticas de seguridad para proteger tu información y garantizar una experiencia segura en nuestra plataforma. Conoce las medidas que tomamos para mantener tus datos protegidos.
              </p>
            </section>

            {/* Marco Legal */}
            <section className="bg-purple-800/40 rounded-lg p-2 md:p-4 border border-yellow-400/30">
              <h3 className="text-base md:text-xl font-bold text-yellow-300 mb-1 md:mb-3">
                Cumplimiento Normativo
              </h3>
              <div className="space-y-1 md:space-y-3 text-xs md:text-sm">
                <div>
                  <p className="font-semibold text-yellow-200">📜 Ley N° 19.628 - Protección de Datos</p>
                  <p className="text-purple-100 mt-0.5 md:mt-1 leading-snug md:leading-relaxed text-justify">
                    Cumplimos con todas las disposiciones de la ley chilena de protección de datos personales, garantizando el manejo seguro de tu información.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-yellow-200">🔐 Ley N° 19.223 - Delitos Informáticos</p>
                  <p className="text-purple-100 mt-0.5 md:mt-1 leading-snug md:leading-relaxed text-justify">
                    Implementamos medidas de seguridad para prevenir accesos no autorizados y proteger la integridad de nuestros sistemas.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-yellow-200">⚖️ Estándares Internacionales</p>
                  <p className="text-purple-100 mt-0.5 md:mt-1 leading-snug md:leading-relaxed text-justify">
                    Seguimos las mejores prácticas internacionales de seguridad para ofrecer la máxima protección a nuestros usuarios.
                  </p>
                </div>
              </div>
            </section>

            {/* Medidas de Seguridad Técnicas */}
            <section>
              <h3 className="text-base md:text-xl font-bold text-yellow-300 mb-1 md:mb-3">
                Medidas de Seguridad Técnicas
              </h3>

              <div className="space-y-1.5 md:space-y-4">
                {/* Encriptación */}
                <div className="bg-purple-800/30 rounded-lg p-2 md:p-4 border border-purple-600/50">
                  <h4 className="font-bold text-yellow-200 mb-1 md:mb-2 text-sm md:text-base flex items-center gap-2">
                    <span className="text-lg">🔒</span> Encriptación de Datos
                  </h4>
                  <p className="text-xs md:text-sm text-purple-100 mb-1 md:mb-2 leading-snug md:leading-relaxed">
                    Toda la información sensible se transmite mediante protocolos seguros.
                  </p>
                  <div className="space-y-1 text-xs md:text-sm">
                    <div className="flex gap-2">
                      <span className="text-yellow-300">•</span>
                      <p className="text-purple-100 leading-snug md:leading-normal text-justify">Certificados SSL/TLS para conexiones seguras</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-yellow-300">•</span>
                      <p className="text-purple-100 leading-snug md:leading-normal text-justify">Encriptación end-to-end en transferencias de datos</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-yellow-300">•</span>
                      <p className="text-purple-100 leading-snug md:leading-normal text-justify">Protección de contraseñas con algoritmos avanzados</p>
                    </div>
                  </div>
                </div>

                {/* Protección de Infraestructura */}
                <div className="bg-purple-800/30 rounded-lg p-2 md:p-4 border border-purple-600/50">
                  <h4 className="font-bold text-yellow-200 mb-1 md:mb-2 text-sm md:text-base flex items-center gap-2">
                    <span className="text-lg">🏰</span> Protección de Infraestructura
                  </h4>
                  <p className="text-xs md:text-sm text-purple-100 mb-1 md:mb-2 leading-snug md:leading-relaxed">
                    Nuestra infraestructura tecnológica está protegida contra amenazas.
                  </p>
                  <div className="space-y-1 text-xs md:text-sm">
                    <div className="flex gap-2">
                      <span className="text-yellow-300">•</span>
                      <p className="text-purple-100 leading-snug md:leading-normal text-justify">Firewall de aplicaciones web (WAF)</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-yellow-300">•</span>
                      <p className="text-purple-100 leading-snug md:leading-normal text-justify">Protección contra ataques DDoS</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-yellow-300">•</span>
                      <p className="text-purple-100 leading-snug md:leading-normal text-justify">Monitoreo continuo de seguridad 24/7</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-yellow-300">•</span>
                      <p className="text-purple-100 leading-snug md:leading-normal text-justify">Copias de seguridad automáticas y periódicas</p>
                    </div>
                  </div>
                </div>

                {/* Autenticación y Control de Acceso */}
                <div className="bg-purple-800/30 rounded-lg p-2 md:p-4 border border-purple-600/50">
                  <h4 className="font-bold text-yellow-200 mb-1 md:mb-2 text-sm md:text-base flex items-center gap-2">
                    <span className="text-lg">🔑</span> Autenticación y Control de Acceso
                  </h4>
                  <p className="text-xs md:text-sm text-purple-100 mb-1 md:mb-2 leading-snug md:leading-relaxed">
                    Implementamos múltiples capas de seguridad para el acceso a cuentas.
                  </p>
                  <div className="space-y-1 text-xs md:text-sm">
                    <div className="flex gap-2">
                      <span className="text-yellow-300">•</span>
                      <p className="text-purple-100 leading-snug md:leading-normal text-justify">Autenticación segura de usuarios</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-yellow-300">•</span>
                      <p className="text-purple-100 leading-snug md:leading-normal text-justify">Gestión de sesiones con tiempo de expiración</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-yellow-300">•</span>
                      <p className="text-purple-100 leading-snug md:leading-normal text-justify">Verificación de identidad en acciones sensibles</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-yellow-300">•</span>
                      <p className="text-purple-100 leading-snug md:leading-normal text-justify">Control de permisos por rol de usuario</p>
                    </div>
                  </div>
                </div>

                {/* Prevención de Vulnerabilidades */}
                <div className="bg-purple-800/30 rounded-lg p-2 md:p-4 border border-purple-600/50">
                  <h4 className="font-bold text-yellow-200 mb-1 md:mb-2 text-sm md:text-base flex items-center gap-2">
                    <span className="text-lg">🛡️</span> Prevención de Vulnerabilidades
                  </h4>
                  <p className="text-xs md:text-sm text-purple-100 mb-1 md:mb-2 leading-snug md:leading-relaxed">
                    Protegemos nuestra plataforma contra las vulnerabilidades más comunes.
                  </p>
                  <div className="space-y-1 text-xs md:text-sm">
                    <div className="flex gap-2">
                      <span className="text-yellow-300">•</span>
                      <p className="text-purple-100 leading-snug md:leading-normal text-justify">Protección contra inyección SQL</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-yellow-300">•</span>
                      <p className="text-purple-100 leading-snug md:leading-normal text-justify">Prevención de Cross-Site Scripting (XSS)</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-yellow-300">•</span>
                      <p className="text-purple-100 leading-snug md:leading-normal text-justify">Prevención de Cross-Site Request Forgery (CSRF)</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-yellow-300">•</span>
                      <p className="text-purple-100 leading-snug md:leading-normal text-justify">Auditorías de seguridad periódicas</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Responsabilidades del Usuario */}
            <section className="bg-purple-800/40 rounded-lg p-2 md:p-4 border border-yellow-400/30">
              <h3 className="text-base md:text-xl font-bold text-yellow-300 mb-1 md:mb-3">
                Tu Responsabilidad como Usuario
              </h3>
              <div className="space-y-2 text-xs md:text-sm">
                <div className="flex gap-2">
                  <span className="text-yellow-300">✓</span>
                  <p className="leading-snug md:leading-relaxed text-justify"><strong>Contraseñas Seguras:</strong> Utiliza contraseñas fuertes con combinación de letras, números y símbolos.</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-yellow-300">✓</span>
                  <p className="leading-snug md:leading-relaxed text-justify"><strong>No Compartas tu Cuenta:</strong> Tu cuenta es personal e intransferible. No compartas tus credenciales.</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-yellow-300">✓</span>
                  <p className="leading-snug md:leading-relaxed text-justify"><strong>Cierra Sesión:</strong> Siempre cierra tu sesión cuando uses dispositivos compartidos o públicos.</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-yellow-300">✓</span>
                  <p className="leading-snug md:leading-relaxed text-justify"><strong>Actualiza tu Software:</strong> Mantén actualizado tu navegador y sistema operativo para mayor seguridad.</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-yellow-300">✓</span>
                  <p className="leading-snug md:leading-relaxed text-justify"><strong>Sospecha de Phishing:</strong> Nunca ingreses tus datos en enlaces sospechosos o correos no solicitados.</p>
                </div>
              </div>
            </section>

            {/* Importante: Somos una Plataforma de Exhibición */}
            <section className="bg-red-900/40 rounded-lg p-2 md:p-4 border-2 border-red-400/50">
              <h3 className="text-base md:text-xl font-bold text-red-300 mb-1 md:mb-3 flex items-center gap-2">
                <span className="text-xl">⚠️</span> Importante: Compra Segura
              </h3>
              <div className="space-y-2 text-xs md:text-sm">
                <p className="text-red-100 leading-snug md:leading-relaxed">
                  <span className="font-semibold text-yellow-300">Solo a un Click</span> es una plataforma de exhibición. <strong>NO procesamos pagos</strong> ni somos responsables de las transacciones entre compradores y vendedores.
                </p>
                <div className="mt-2 md:mt-3 space-y-1.5">
                  <div className="flex gap-2">
                    <span className="text-red-300">🚨</span>
                    <p className="text-red-100 leading-snug md:leading-relaxed text-justify"><strong>Verifica al Vendedor:</strong> Antes de realizar cualquier transacción, investiga y verifica la reputación del vendedor.</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-red-300">🚨</span>
                    <p className="text-red-100 leading-snug md:leading-relaxed text-justify"><strong>No Transfieras sin Ver:</strong> Nunca realices pagos anticipados sin verificar el producto o servicio.</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-red-300">🚨</span>
                    <p className="text-red-100 leading-snug md:leading-relaxed text-justify"><strong>Lugares Seguros:</strong> Acuerda entregas en lugares públicos y seguros durante el día.</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-red-300">🚨</span>
                    <p className="text-red-100 leading-snug md:leading-relaxed text-justify"><strong>Desconfía de Ofertas:</strong> Si una oferta parece demasiado buena para ser verdad, probablemente lo sea.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Reporte de Incidentes */}
            <section>
              <h3 className="text-base md:text-xl font-bold text-yellow-300 mb-1 md:mb-3">
                Reporta Incidentes de Seguridad
              </h3>
              <p className="text-xs md:text-sm leading-snug md:leading-relaxed mb-2">
                Si detectas alguna actividad sospechosa, vulnerabilidad de seguridad o comportamiento irregular en nuestra plataforma, por favor repórtalo inmediatamente:
              </p>
              <div className="space-y-1 text-xs md:text-sm">
                <div className="flex gap-2">
                  <span className="text-yellow-300">•</span>
                  <p className="leading-snug md:leading-relaxed text-justify">Envía un correo a <span className="font-semibold text-yellow-300">soloaunclick@gmail.com</span> con el asunto "REPORTE DE SEGURIDAD"</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-yellow-300">•</span>
                  <p className="leading-snug md:leading-relaxed text-justify">Describe detalladamente el incidente y, si es posible, incluye capturas de pantalla</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-yellow-300">•</span>
                  <p className="leading-snug md:leading-relaxed text-justify">Nuestro equipo investigará y responderá a la brevedad</p>
                </div>
              </div>
            </section>

            {/* Monitoreo y Mejora Continua */}
            <section>
              <h3 className="text-base md:text-xl font-bold text-yellow-300 mb-1 md:mb-3">
                Monitoreo y Mejora Continua
              </h3>
              <p className="text-xs md:text-sm leading-snug md:leading-relaxed text-justify">
                En <span className="font-semibold text-yellow-300">Solo a un Click</span> monitoreamos constantemente nuestra plataforma para detectar y responder rápidamente a cualquier amenaza de seguridad. Actualizamos regularmente nuestros sistemas y protocolos para mantenernos a la vanguardia en protección de datos.
              </p>
            </section>

            {/* Contacto */}
            <section className="bg-gradient-to-r from-purple-800/60 to-purple-700/60 rounded-lg p-2 md:p-4 border border-yellow-400/50">
              <h3 className="text-base md:text-xl font-bold text-yellow-300 mb-1 md:mb-3">
                Contacto de Seguridad
              </h3>
              <p className="text-xs md:text-sm leading-relaxed mb-2">
                Para consultas relacionadas con la seguridad de tu cuenta o de la plataforma:
              </p>
              <div className="space-y-1 text-xs md:text-sm">
                <p className="flex items-center gap-2">
                  <span className="text-yellow-300">📧</span>
                  <span className="font-semibold">Email de Seguridad:</span> soloaunclick@gmail.com
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
                Esta política de seguridad puede ser actualizada periódicamente para reflejar mejoras en nuestros sistemas.
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
            Entendido y Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
