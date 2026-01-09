'use client'

import { X } from 'lucide-react'
import { useEffect } from 'react'

interface AboutUsPopupProps {
  isOpen: boolean
  onClose: () => void
}

export function AboutUsPopup({ isOpen, onClose }: AboutUsPopupProps) {
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
              👥 Sobre Nosotros
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

            {/* Nuestra Historia */}
            <section>
              <h3 className="text-base md:text-xl font-bold text-yellow-300 mb-1 md:mb-3">
                Nuestra Historia
              </h3>
              <p className="text-xs md:text-sm leading-snug md:leading-relaxed mb-2 md:mb-3">
                Somos <span className="font-semibold text-yellow-300">dos hermanos informáticos</span> apasionados por el desarrollo tecnológico y el comercio local. Nos enamoramos de la hermosa comuna de <span className="font-semibold text-yellow-300">Villarrica</span>, en la Región de La Araucanía, Chile, con su majestuoso volcán, su lago cristalino y una comunidad vibrante llena de emprendedores talentosos.
              </p>
              <p className="text-xs md:text-sm leading-snug md:leading-relaxed text-justify">
                La tecnología siempre nos apasionó por su poder para conectar personas y generar oportunidades. Estudiamos informática con el sueño de poder crear algo que fortaleciera a las comunidades locales, y fue así como nació <span className="font-semibold text-yellow-300">Solo a un Click</span>, una plataforma dedicada a impulsar el comercio de Villarrica.
              </p>
            </section>

            {/* Nuestra Misión */}
            <section className="bg-purple-800/40 rounded-lg p-2 md:p-4 border border-yellow-400/30">
              <h3 className="text-base md:text-xl font-bold text-yellow-300 mb-1 md:mb-3 flex items-center gap-2">
                <span className="text-xl">🎯</span> Nuestra Misión
              </h3>
              <p className="text-xs md:text-sm leading-snug md:leading-relaxed mb-2">
                Creemos firmemente en el <strong className="text-yellow-300">comercio local</strong> y en el talento de los emprendedores de Villarrica. Sabemos que cada negocio local representa el esfuerzo, los sueños y la dedicación de familias como la nuestra.
              </p>
              <p className="text-xs md:text-sm leading-snug md:leading-relaxed text-justify">
                Por eso creamos esta plataforma: para darle visibilidad a los negocios locales, conectarlos con la comunidad y ayudarlos a crecer en la era digital. Queremos que cada emprendedor de nuestra comuna tenga las mismas oportunidades que las grandes empresas, <strong className="text-yellow-300">sin barreras tecnológicas ni costos prohibitivos</strong>.
              </p>
            </section>

            {/* Por qué Villarrica */}
            <section>
              <h3 className="text-base md:text-xl font-bold text-yellow-300 mb-1 md:mb-3 flex items-center gap-2">
                <span className="text-xl">❤️</span> ¿Por qué Villarrica?
              </h3>
              <div className="space-y-2 text-xs md:text-sm">
                <p className="leading-snug md:leading-relaxed text-justify">
                  Villarrica es nuestro hogar, nuestra inspiración y el corazón de este proyecto. Esta comuna tiene un potencial enorme:
                </p>
                <div className="space-y-1.5">
                  <div className="flex gap-2">
                    <span className="text-yellow-300">•</span>
                    <p className="leading-snug md:leading-relaxed text-justify">
                      <strong className="text-yellow-200">Emprendedores talentosos:</strong> Conocemos de primera mano la calidad de los productos y servicios que se ofrecen aquí.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-yellow-300">•</span>
                    <p className="leading-snug md:leading-relaxed text-justify">
                      <strong className="text-yellow-200">Comunidad unida:</strong> Los villarriquenses apoyamos lo nuestro, preferimos consumir local.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-yellow-300">•</span>
                    <p className="leading-snug md:leading-relaxed text-justify">
                      <strong className="text-yellow-200">Atractivo turístico:</strong> Miles de visitantes llegan cada año buscando experiencias auténticas y productos locales.
                    </p>
                  </div>
                </div>
                <p className="leading-snug md:leading-relaxed mt-2">
                  Creemos que Villarrica merece una plataforma digital moderna que potencie todo este valor. Una vitrina donde cada negocio pueda brillar y donde cada cliente encuentre exactamente lo que busca, <strong className="text-yellow-300">a solo un click</strong>.
                </p>
              </div>
            </section>

            {/* Nuestro Compromiso */}
            <section className="bg-gradient-to-r from-purple-800/60 to-purple-700/60 rounded-lg p-2 md:p-4 border border-yellow-400/50">
              <h3 className="text-base md:text-xl font-bold text-yellow-300 mb-1 md:mb-3 flex items-center gap-2">
                <span className="text-xl">🤝</span> Nuestro Compromiso
              </h3>
              <div className="space-y-2 text-xs md:text-sm">
                <p className="leading-snug md:leading-relaxed text-justify">
                  Nos comprometemos a:
                </p>
                <div className="space-y-1.5">
                  <div className="flex gap-2">
                    <span className="text-yellow-300">✓</span>
                    <p className="leading-snug md:leading-relaxed text-justify">
                      <strong>Mantener la plataforma accesible:</strong> Planes gratuitos y de bajo costo para que todos puedan participar.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-yellow-300">✓</span>
                    <p className="leading-snug md:leading-relaxed text-justify">
                      <strong>Mejorar constantemente:</strong> Escuchamos a nuestra comunidad e implementamos mejoras continuamente.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-yellow-300">✓</span>
                    <p className="leading-snug md:leading-relaxed text-justify">
                      <strong>Apoyar el crecimiento local:</strong> Cada negocio que crece en la plataforma es una victoria para Villarrica.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-yellow-300">✓</span>
                    <p className="leading-snug md:leading-relaxed text-justify">
                      <strong>Promover la economía circular:</strong> Conectar compradores y vendedores locales fortalece nuestra economía.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-yellow-300">✓</span>
                    <p className="leading-snug md:leading-relaxed text-justify">
                      <strong>Transparencia y honestidad:</strong> Operamos con claridad en nuestras políticas y servicios.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Lo que hacemos */}
            <section>
              <h3 className="text-base md:text-xl font-bold text-yellow-300 mb-1 md:mb-3">
                ¿Qué Hacemos?
              </h3>
              <p className="text-xs md:text-sm leading-snug md:leading-relaxed mb-2">
                <span className="font-semibold text-yellow-300">Solo a un Click</span> es una <strong>plataforma de vitrina digital</strong> diseñada específicamente para el comercio local de Villarrica. Brindamos a los comercios la oportunidad de tener su propia página web profesional <strong className="text-yellow-300">sin necesidad de pagar costos enormes</strong>, donde pueden visualizar y promocionar:
              </p>

              <div className="bg-yellow-900/30 rounded-lg p-2 md:p-3 border border-yellow-400/40 mb-2 md:mb-3">
                <p className="text-xs md:text-sm leading-snug md:leading-relaxed text-yellow-100 text-justify">
                  <strong className="text-yellow-300">✨ Productos • Arriendos • Servicios</strong> y mucho más, con <strong>decenas de opciones de categorías</strong> para que cada negocio encuentre su espacio perfecto.
                </p>
              </div>

              <div className="bg-purple-800/30 rounded-lg p-2 md:p-3 border border-purple-600/50 mb-2 md:mb-3">
                <h4 className="text-sm md:text-base font-bold text-yellow-300 mb-1.5 md:mb-2">Lo que Ofrecemos:</h4>
                <div className="space-y-1.5 text-xs md:text-sm">
                  <div className="flex gap-2">
                    <span className="text-yellow-300">🏪</span>
                    <p className="leading-snug md:leading-relaxed text-justify">
                      <strong className="text-yellow-200">Página web para tu negocio:</strong> Cada emprendedor puede tener su propia tienda de exhibición profesional.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-yellow-300">📦</span>
                    <p className="leading-snug md:leading-relaxed text-justify">
                      <strong className="text-yellow-200">Múltiples categorías:</strong> Productos, servicios, arriendos y decenas de opciones más para exhibir tu oferta.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-yellow-300">🔍</span>
                    <p className="leading-snug md:leading-relaxed text-justify">
                      <strong className="text-yellow-200">Visibilidad garantizada:</strong> Los clientes pueden descubrir fácilmente lo que ofreces.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-yellow-300">💬</span>
                    <p className="leading-snug md:leading-relaxed text-justify">
                      <strong className="text-yellow-200">Conexión directa:</strong> Facilitamos el contacto entre vendedores y compradores.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-yellow-300">📱</span>
                    <p className="leading-snug md:leading-relaxed text-justify">
                      <strong className="text-yellow-200">Acceso desde cualquier dispositivo:</strong> Podrás ver y manejar tus productos tanto desde móviles como desde computadoras. Plataforma fácil de usar, sin conocimientos técnicos previos.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-yellow-300">🎨</span>
                    <p className="leading-snug md:leading-relaxed text-justify">
                      <strong className="text-yellow-200">Diseño profesional:</strong> Cada negocio luce moderno y atractivo para los clientes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-800/60 to-blue-900/60 rounded-lg p-2 md:p-3 border border-blue-400/40">
                <h4 className="text-sm md:text-base font-bold text-yellow-300 mb-1.5 md:mb-2 flex items-center gap-2">
                  <span className="text-lg">💎</span> Planes Flexibles
                </h4>
                <p className="text-xs md:text-sm leading-snug md:leading-relaxed text-purple-100 text-justify">
                  Ofrecemos opciones de planes <strong className="text-yellow-300">desde el gratuito hasta el premium</strong>, adaptados a la necesidad y capacidad económica de cada persona. Queremos que todos tengan acceso, sin importar su presupuesto.
                </p>
                <div className="mt-1.5 md:mt-2 flex flex-wrap gap-1.5 text-[10px] md:text-xs">
                  <span className="bg-green-600/30 text-green-200 px-2 py-0.5 rounded border border-green-400/40">🆓 Plan Gratuito</span>
                  <span className="bg-blue-600/30 text-blue-200 px-2 py-0.5 rounded border border-blue-400/40">⭐ Plan Normal</span>
                  <span className="bg-yellow-600/30 text-yellow-200 px-2 py-0.5 rounded border border-yellow-400/40">👑 Plan Premium</span>
                </div>
              </div>
            </section>

            {/* Únete a Nosotros */}
            <section className="bg-gradient-to-br from-yellow-900/40 via-yellow-800/40 to-orange-900/40 rounded-lg p-2 md:p-4 border-2 border-yellow-400/50">
              <h3 className="text-base md:text-xl font-bold text-yellow-300 mb-1 md:mb-3 flex items-center gap-2">
                <span className="text-xl">🚀</span> Únete a Nuestra Visión
              </h3>
              <p className="text-xs md:text-sm leading-snug md:leading-relaxed mb-2 text-yellow-100">
                Si eres un emprendedor, comerciante o prestador de servicios de Villarrica, te invitamos a ser parte de esta comunidad digital. Juntos podemos hacer que nuestra comuna sea un referente en comercio local conectado.
              </p>
              <p className="text-xs md:text-sm leading-snug md:leading-relaxed text-yellow-100">
                Si eres un cliente, te invitamos a descubrir la increíble variedad de productos y servicios que ofrece nuestra tierra. <strong className="text-yellow-300">Cada compra local es un voto de confianza en nuestra comunidad</strong>.
              </p>
            </section>

            {/* Agradecimiento */}
            <section className="text-center bg-purple-800/40 rounded-lg p-2 md:p-4 border border-yellow-400/30">
              <h3 className="text-base md:text-xl font-bold text-yellow-300 mb-1 md:mb-2">
                Gracias por Confiar en Nosotros
              </h3>
              <p className="text-xs md:text-sm leading-snug md:leading-relaxed text-purple-100">
                Este proyecto nació del amor por nuestra tierra y del deseo de verla prosperar. Cada negocio que se suma, cada producto que se vende, cada conexión que se crea, nos llena de orgullo y nos motiva a seguir mejorando.
              </p>
              <p className="text-xs md:text-sm leading-snug md:leading-relaxed text-yellow-200 mt-2 font-semibold">
                Villarrica, esto es por ti y para ti. 💙
              </p>
            </section>

            {/* Contacto */}
            <section className="bg-gradient-to-r from-purple-800/60 to-purple-700/60 rounded-lg p-2 md:p-4 border border-yellow-400/50">
              <h3 className="text-base md:text-xl font-bold text-yellow-300 mb-1 md:mb-3">
                Contáctanos
              </h3>
              <p className="text-xs md:text-sm leading-relaxed mb-2">
                ¿Tienes preguntas, sugerencias o quieres saber más sobre nosotros? ¡Nos encantaría escucharte!
              </p>
              <div className="space-y-1 text-xs md:text-sm">
                <p className="flex items-center gap-2">
                  <span className="text-yellow-300">📧</span>
                  <span className="font-semibold">Email:</span> soloaunclick@gmail.com
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-yellow-300">📍</span>
                  <span className="font-semibold">Ubicación:</span> Villarrica, Región de La Araucanía, Chile
                </p>
              </div>
            </section>

            {/* Actualización */}
            <section className="text-center pt-2 md:pt-4 border-t border-yellow-400/30">
              <p className="text-[10px] md:text-xs text-purple-200 italic">
                "Dos hermanos, una visión: conectar a Villarrica con el futuro digital"
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
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
