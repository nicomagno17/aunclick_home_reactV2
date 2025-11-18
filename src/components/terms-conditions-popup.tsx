'use client'

import { X } from 'lucide-react'
import { useEffect } from 'react'

interface TermsConditionsPopupProps {
  isOpen: boolean
  onClose: () => void
}

export function TermsConditionsPopup({ isOpen, onClose }: TermsConditionsPopupProps) {
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
              📋 Términos y Condiciones
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
                Bienvenido a Solo a un Click
              </h3>
              <p className="text-xs md:text-sm leading-snug md:leading-relaxed text-justify">
                Al acceder y utilizar <span className="font-semibold text-yellow-300">Solo a un Click</span>, aceptas los siguientes términos y condiciones. Por favor, léelos cuidadosamente antes de usar nuestra plataforma.
              </p>
            </section>

            {/* Naturaleza de la Plataforma */}
            <section className="bg-purple-800/40 rounded-lg p-2 md:p-4 border border-yellow-400/30">
              <h3 className="text-base md:text-xl font-bold text-yellow-300 mb-1 md:mb-3">
                1. Naturaleza de la Plataforma
              </h3>
              <div className="space-y-2 text-xs md:text-sm">
                <p className="leading-snug md:leading-relaxed">
                  <span className="font-semibold text-yellow-300">Solo a un Click</span> es una <strong>plataforma de vitrina digital</strong> que conecta negocios locales con consumidores. Nuestra función es exclusivamente exhibir productos y servicios.
                </p>
                <div className="space-y-1">
                  <div className="flex gap-2">
                    <span className="text-yellow-300">•</span>
                    <p className="leading-snug md:leading-relaxed text-justify">NO procesamos pagos de productos o servicios exhibidos.</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-yellow-300">•</span>
                    <p className="leading-snug md:leading-relaxed text-justify">NO somos responsables de las transacciones entre compradores y vendedores.</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-yellow-300">•</span>
                    <p className="leading-snug md:leading-relaxed text-justify">Los productos y servicios publicados son responsabilidad exclusiva de la tienda que los ofrece.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Planes de Suscripción */}
            <section>
              <h3 className="text-base md:text-xl font-bold text-yellow-300 mb-1 md:mb-3">
                2. Planes de Suscripción
              </h3>
              <p className="text-xs md:text-sm leading-snug md:leading-relaxed mb-2 md:mb-3">
                Ofrecemos tres planes de suscripción para que elijas el que mejor se adapte a las necesidades de tu negocio:
              </p>

              <div className="bg-purple-800/30 rounded-lg p-2 md:p-4 border border-yellow-400/30">
                <div className="space-y-2 text-xs md:text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🆓</span>
                    <p className="text-purple-100 leading-snug md:leading-relaxed">
                      <strong className="text-green-300">Plan Gratuito</strong>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⭐</span>
                    <p className="text-purple-100 leading-snug md:leading-relaxed">
                      <strong className="text-blue-300">Plan Normal</strong>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">👑</span>
                    <p className="text-purple-100 leading-snug md:leading-relaxed">
                      <strong className="text-yellow-300">Plan Premium</strong>
                      <span className="ml-2 bg-yellow-400/20 rounded px-2 py-0.5 text-[10px] md:text-xs font-bold text-yellow-300">PRIMER MES GRATIS</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-800/60 to-purple-700/60 rounded-lg p-2 md:p-3 border border-yellow-400/50 mt-2 md:mt-3">
                <p className="text-xs md:text-sm text-yellow-100 leading-snug md:leading-relaxed text-justify">
                  <strong className="text-yellow-300">📋 Detalles completos de los planes:</strong> Las características, beneficios y límites de cada plan están disponibles en la <strong>página principal de la plataforma</strong> y en la <strong>página de registro</strong>.
                </p>
              </div>
            </section>

            {/* Promoción Primer Mes Gratis - Plan Premium */}
            <section className="bg-gradient-to-r from-yellow-900/40 to-yellow-800/40 rounded-lg p-2 md:p-4 border-2 border-yellow-400/50">
              <h3 className="text-base md:text-xl font-bold text-yellow-300 mb-1 md:mb-3 flex items-center gap-2">
                <span className="text-xl">🎁</span> 3. Promoción: Primer Mes Gratis - Plan Premium
              </h3>
              <div className="space-y-2 text-xs md:text-sm">
                <p className="text-yellow-100 leading-snug md:leading-relaxed">
                  Todos los nuevos usuarios pueden disfrutar del <strong>Plan Premium completamente gratis durante el primer mes</strong>.
                </p>

                <div className="bg-purple-900/40 rounded p-2 md:p-3 border border-yellow-400/30 mt-2">
                  <p className="font-semibold text-yellow-200 mb-1">⚠️ Condiciones Importantes:</p>
                  <div className="space-y-1">
                    <div className="flex gap-2">
                      <span className="text-yellow-300">1.</span>
                      <p className="text-yellow-100 leading-snug md:leading-relaxed">
                        <strong>Registro de tarjeta obligatorio:</strong> Para acceder al mes gratuito, debes registrar una tarjeta de débito o crédito.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-yellow-300">2.</span>
                      <p className="text-yellow-100 leading-snug md:leading-relaxed">
                        <strong>Responsabilidad del usuario:</strong> Al cumplir el mes de gratuidad, es tu <u>exclusiva responsabilidad</u> cambiar tu plan a Normal o Gratuito si no deseas continuar con el Plan Premium.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-yellow-300">3.</span>
                      <p className="text-yellow-100 leading-snug md:leading-relaxed">
                        <strong>Renovación automática:</strong> Si NO cambias de plan antes de que termine el mes gratuito, se realizará automáticamente el cobro del Plan Premium y se mantendrá activo por un mes más.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-yellow-300">4.</span>
                      <p className="text-yellow-100 leading-snug md:leading-relaxed">
                        <strong>Sin reembolsos:</strong> Una vez realizado el cobro automático, no se realizarán reembolsos del mes en curso.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Métodos de Pago y Facturación */}
            <section>
              <h3 className="text-base md:text-xl font-bold text-yellow-300 mb-1 md:mb-3">
                4. Métodos de Pago y Facturación
              </h3>
              <div className="space-y-2 text-xs md:text-sm">
                <p className="leading-snug md:leading-relaxed">
                  Aceptamos los siguientes métodos de pago para los planes Normal y Premium:
                </p>
                <div className="bg-purple-800/30 rounded p-2 md:p-3">
                  <div className="space-y-1">
                    <div className="flex gap-2">
                      <span className="text-yellow-300">💳</span>
                      <p className="leading-snug md:leading-relaxed text-justify">
                        <strong className="text-yellow-200">Tarjeta de Débito:</strong> Cobro automático mensual desde la fecha de inscripción.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-yellow-300">💳</span>
                      <p className="leading-snug md:leading-relaxed text-justify">
                        <strong className="text-yellow-200">Tarjeta de Crédito:</strong> Cobro automático mensual desde la fecha de inscripción.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-yellow-300">🏦</span>
                      <p className="leading-snug md:leading-relaxed text-justify">
                        <strong className="text-yellow-200">Transferencia Bancaria:</strong> Pago manual mensual (requiere confirmación).
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-900/30 rounded p-2 md:p-3 border border-yellow-400/30 mt-2">
                  <p className="text-yellow-100 leading-snug md:leading-relaxed">
                    <strong>⏰ Ciclo de facturación:</strong> Los cobros automáticos se realizan mensualmente desde la fecha exacta de tu inscripción al plan. Por ejemplo, si te inscribes el día 15, el cobro se realizará cada día 15 de cada mes.
                  </p>
                </div>
              </div>
            </section>

            {/* Cambios y Bajas de Plan */}
            <section className="bg-red-900/30 rounded-lg p-2 md:p-4 border-2 border-red-400/50">
              <h3 className="text-base md:text-xl font-bold text-red-300 mb-1 md:mb-3 flex items-center gap-2">
                <span className="text-xl">⬇️</span> 5. Cambios y Bajas de Plan
              </h3>
              <div className="space-y-2 text-xs md:text-sm">
                <p className="text-red-100 leading-snug md:leading-relaxed">
                  Puedes cambiar de plan en cualquier momento desde tu panel de administración. <strong>Lee cuidadosamente las consecuencias de bajar de plan:</strong>
                </p>

                <div className="bg-purple-900/40 rounded p-2 md:p-3 border border-red-400/30 mt-2">
                  <p className="font-semibold text-red-200 mb-1">🔽 Al bajar de plan (Ej: Premium → Normal, Normal → Gratuito):</p>
                  <div className="space-y-1.5">
                    <div className="flex gap-2">
                      <span className="text-red-300">1.</span>
                      <div>
                        <p className="text-red-100 leading-snug md:leading-relaxed text-justify">
                          <strong>Bloqueo inmediato de funciones:</strong> El sistema bloqueará automáticamente todas las funciones del panel de administración que NO estén disponibles en tu nuevo plan.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-red-300">2.</span>
                      <div>
                        <p className="text-red-100 leading-snug md:leading-relaxed text-justify">
                          <strong>Eliminación de publicaciones excedentes:</strong> Si tienes más productos publicados que el límite de tu nuevo plan, el sistema eliminará automáticamente de la vista pública las publicaciones que excedan el límite permitido.
                        </p>
                        <p className="text-red-200/80 text-[10px] md:text-xs mt-0.5 italic">
                          Ejemplo: Si bajas de Premium (50 productos) a Normal (20 productos) y tienes 45 productos publicados, se ocultarán 25 productos automáticamente.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-red-300">3.</span>
                      <div>
                        <p className="text-red-100 leading-snug md:leading-relaxed text-justify">
                          <strong>Sin reversión automática:</strong> Los productos eliminados de la vista pública NO se restaurarán automáticamente si vuelves a subir de plan. Deberás republicarlos manualmente.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-red-300">4.</span>
                      <div>
                        <p className="text-red-100 leading-snug md:leading-relaxed text-justify">
                          <strong>Reducción de visibilidad:</strong> Tu tienda pasará a tener la visibilidad correspondiente al nuevo plan (Alta → Media → Baja).
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-900/30 rounded p-2 md:p-3 border border-yellow-400/30 mt-2">
                  <p className="text-yellow-100 leading-snug md:leading-relaxed">
                    <strong>💡 Recomendación:</strong> Antes de cambiar a un plan inferior, revisa tu número actual de productos publicados y ajusta manualmente tus publicaciones para evitar pérdidas inesperadas de visibilidad.
                  </p>
                </div>
              </div>
            </section>

            {/* Responsabilidades del Usuario */}
            <section>
              <h3 className="text-base md:text-xl font-bold text-yellow-300 mb-1 md:mb-3">
                6. Responsabilidades del Usuario
              </h3>
              <div className="space-y-2 text-xs md:text-sm">
                <p className="leading-snug md:leading-relaxed">Como usuario de la plataforma, te comprometes a:</p>
                <div className="space-y-1">
                  <div className="flex gap-2">
                    <span className="text-yellow-300">✓</span>
                    <p className="leading-snug md:leading-relaxed text-justify">Proporcionar información veraz y actualizada sobre tus productos y servicios.</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-yellow-300">✓</span>
                    <p className="leading-snug md:leading-relaxed text-justify">No publicar contenido ilegal, ofensivo, engañoso o que viole derechos de terceros.</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-yellow-300">✓</span>
                    <p className="leading-snug md:leading-relaxed text-justify">Mantener actualizada tu información de pago para evitar interrupciones del servicio.</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-yellow-300">✓</span>
                    <p className="leading-snug md:leading-relaxed text-justify">Gestionar activamente tus cambios de plan antes de las fechas de renovación.</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-yellow-300">✓</span>
                    <p className="leading-snug md:leading-relaxed text-justify">Cumplir con todas las leyes aplicables en la venta de tus productos o servicios.</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-yellow-300">✓</span>
                    <p className="leading-snug md:leading-relaxed text-justify">Ser responsable de todas las transacciones realizadas con tus clientes.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Suspensión y Cancelación */}
            <section className="bg-purple-800/40 rounded-lg p-2 md:p-4 border border-yellow-400/30">
              <h3 className="text-base md:text-xl font-bold text-yellow-300 mb-1 md:mb-3">
                7. Suspensión y Cancelación de Cuenta
              </h3>
              <div className="space-y-2 text-xs md:text-sm">
                <p className="leading-snug md:leading-relaxed">
                  Nos reservamos el derecho de suspender o cancelar cuentas que:
                </p>
                <div className="space-y-1">
                  <div className="flex gap-2">
                    <span className="text-red-400">•</span>
                    <p className="leading-snug md:leading-relaxed text-justify">Violen estos términos y condiciones.</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-red-400">•</span>
                    <p className="leading-snug md:leading-relaxed text-justify">Publiquen contenido fraudulento o ilegal.</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-red-400">•</span>
                    <p className="leading-snug md:leading-relaxed text-justify">Tengan pagos pendientes o rechazados por más de 30 días (planes pagados).</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-red-400">•</span>
                    <p className="leading-snug md:leading-relaxed text-justify">Realicen actividades que pongan en riesgo la plataforma o a otros usuarios.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Limitación de Responsabilidad */}
            <section>
              <h3 className="text-base md:text-xl font-bold text-yellow-300 mb-1 md:mb-3">
                8. Limitación de Responsabilidad
              </h3>
              <div className="space-y-2 text-xs md:text-sm">
                <div className="flex gap-2">
                  <span className="text-yellow-300">•</span>
                  <p className="leading-snug md:leading-relaxed text-justify">Solo a un Click NO es responsable de disputas, fraudes o problemas entre compradores y vendedores.</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-yellow-300">•</span>
                  <p className="leading-snug md:leading-relaxed text-justify">No garantizamos ventas, tráfico o resultados específicos al usar la plataforma.</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-yellow-300">•</span>
                  <p className="leading-snug md:leading-relaxed text-justify">No somos responsables de interrupciones temporales del servicio por mantenimiento o causas de fuerza mayor.</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-yellow-300">•</span>
                  <p className="leading-snug md:leading-relaxed text-justify">Cada vendedor es responsable de la calidad, legalidad y entrega de sus productos/servicios.</p>
                </div>
              </div>
            </section>

            {/* Modificaciones a los Términos */}
            <section className="bg-purple-800/40 rounded-lg p-2 md:p-4 border border-yellow-400/30">
              <h3 className="text-base md:text-xl font-bold text-yellow-300 mb-1 md:mb-3">
                9. Modificaciones a los Términos
              </h3>
              <p className="text-xs md:text-sm leading-snug md:leading-relaxed text-justify">
                Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento. Los cambios significativos serán notificados por correo electrónico y/o mediante un aviso en la plataforma. El uso continuado de la plataforma después de la notificación constituye la aceptación de los nuevos términos.
              </p>
            </section>

            {/* Ley Aplicable */}
            <section>
              <h3 className="text-base md:text-xl font-bold text-yellow-300 mb-1 md:mb-3">
                10. Ley Aplicable y Jurisdicción
              </h3>
              <p className="text-xs md:text-sm leading-snug md:leading-relaxed text-justify">
                Estos términos y condiciones se rigen por las leyes de la República de Chile. Cualquier disputa será resuelta en los tribunales competentes de Chile.
              </p>
            </section>

            {/* Contacto */}
            <section className="bg-gradient-to-r from-purple-800/60 to-purple-700/60 rounded-lg p-2 md:p-4 border border-yellow-400/50">
              <h3 className="text-base md:text-xl font-bold text-yellow-300 mb-1 md:mb-3">
                Contacto
              </h3>
              <p className="text-xs md:text-sm leading-relaxed mb-2">
                Para consultas sobre estos términos y condiciones:
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
                Al usar Solo a un Click, aceptas estos términos y condiciones en su totalidad.
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
            Acepto los Términos y Condiciones
          </button>
        </div>
      </div>
    </div>
  )
}
