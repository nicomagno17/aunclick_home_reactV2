'use client'

import { X, ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'

interface FaqPopupProps {
  isOpen: boolean
  onClose: () => void
}

export function FaqPopup({ isOpen, onClose }: FaqPopupProps) {
  const [openQuestion, setOpenQuestion] = useState<number | null>(null)

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

  const toggleQuestion = (index: number) => {
    setOpenQuestion(openQuestion === index ? null : index)
  }

  if (!isOpen) return null

  const faqs = [
    {
      question: "¿Qué es Solo a un Click?",
      answer: "Solo a un Click es una plataforma de vitrina digital diseñada específicamente para el comercio local de Villarrica. Permitimos que emprendedores y negocios locales tengan su propia tienda de exhibición profesional en internet sin necesidad de pagar costos enormes. Los comercios pueden mostrar sus productos, servicios, arriendos y mucho más, con decenas de categorías disponibles para elegir."
    },
    {
      question: "¿Cómo puedo registrarme en la plataforma?",
      answer: "Para registrarte, haz clic en 'Registra tu Negocio' en el footer de nuestra página principal. Completa el formulario con los datos de tu negocio (nombre, dirección, contacto, etc.). Una vez registrado, podrás acceder a tu panel de administración donde configurarás tu tienda y comenzarás a subir tus productos o servicios."
    },
    {
      question: "¿Cuánto cuesta usar Solo a un Click?",
      answer: "Ofrecemos tres planes flexibles adaptados a diferentes necesidades: Plan Gratuito ($0) con funciones básicas y publicaciones limitadas; Plan Normal ($2,990 + IVA/mes) con más funciones y mayor capacidad de publicación; y Plan Premium (primer mes gratis) con acceso completo al 100% del panel de administración y máxima visibilidad. Puedes elegir el plan que mejor se ajuste a tu presupuesto y necesidades."
    },
    {
      question: "¿Qué incluye el primer mes gratis del Plan Premium?",
      answer: "El Plan Premium incluye un mes completamente gratuito para que pruebes todas las funcionalidades avanzadas. Sin embargo, debes registrar una tarjeta de débito o crédito. Al finalizar el mes gratuito, es tu responsabilidad cambiar a otro plan si no deseas continuar con Premium. Si no realizas el cambio, se cobrará automáticamente el plan Premium para el siguiente mes."
    },
    {
      question: "¿Cómo subo productos o servicios a mi tienda?",
      answer: "Una vez que hayas iniciado sesión en tu panel de administración, encontrarás una sección de 'Gestión de Productos'. Ahí podrás agregar productos, servicios o arriendos. Para cada publicación puedes subir imágenes, establecer precios, escribir descripciones detalladas y seleccionar la categoría correspondiente. El proceso es muy intuitivo y no requiere conocimientos técnicos."
    },
    {
      question: "¿Puedo manejar mi tienda desde el celular?",
      answer: "Sí, absolutamente. Nuestra plataforma está completamente optimizada para dispositivos móviles. Podrás ver y manejar tus productos, actualizar tu tienda y gestionar tu negocio tanto desde computadoras como desde teléfonos móviles o tablets, con total comodidad desde cualquier lugar."
    },
    {
      question: "¿Cuántas categorías de productos puedo usar?",
      answer: "Ofrecemos decenas de opciones de categorías para que cada negocio encuentre su espacio perfecto. Puedes exhibir productos físicos, servicios profesionales, arriendos de equipos o propiedades, y mucho más. Cada categoría está diseñada para resaltar las características específicas de lo que ofreces."
    },
    {
      question: "¿Cómo me contactan los clientes?",
      answer: "Los clientes pueden contactarte directamente a través de los medios que hayas configurado en tu tienda: teléfono, WhatsApp, email, etc. Solo a un Click facilita la conexión directa entre compradores y vendedores. Nosotros NO procesamos los pagos; solo somos la vitrina que te conecta con tus clientes potenciales."
    },
    {
      question: "¿Ustedes procesan los pagos de las ventas?",
      answer: "No, Solo a un Click es una plataforma de exhibición únicamente. NO procesamos pagos ni somos intermediarios en las transacciones. Tú te encargas directamente de coordinar la venta, el precio, la forma de pago y la entrega con tus clientes. Esto te da total control sobre tu negocio y evitas comisiones por venta."
    },
    {
      question: "¿Qué pasa si bajo de plan?",
      answer: "Si decides cambiar a un plan inferior (por ejemplo, de Premium a Normal, o de Normal a Gratuito), el sistema bloqueará automáticamente las funciones del panel de administración que no estén disponibles en tu nuevo plan. Además, si tienes más productos publicados que el límite del nuevo plan, se ocultarán automáticamente de la vista pública los productos excedentes. Te recomendamos revisar tu inventario antes de cambiar de plan."
    },
    {
      question: "¿Mis datos están seguros?",
      answer: "Sí. Implementamos múltiples medidas de seguridad para proteger tu información: encriptación SSL/TLS en todas las conexiones, protección contra ataques cibernéticos, copias de seguridad automáticas y cumplimiento estricto de la Ley N° 19.628 de Protección de Datos Personales de Chile. Tu información personal y la de tu negocio están completamente protegidas."
    },
    {
      question: "¿Puedo cancelar mi suscripción en cualquier momento?",
      answer: "Sí, puedes cancelar o cambiar tu plan en cualquier momento desde tu panel de administración. No hay contratos de permanencia ni penalizaciones por cancelación. Si tienes un plan pagado, puedes bajarlo a gratuito cuando lo desees. Recuerda que al bajar de plan se aplicarán las limitaciones correspondientes al nuevo plan elegido."
    },
    {
      question: "¿Cobran comisiones por cada venta que hago?",
      answer: "No. A diferencia de otras plataformas, en Solo a un Click NO cobramos comisiones por tus ventas. Tú pagas únicamente la suscripción mensual de tu plan (o usas el plan gratuito), y todas las ventas que realices son 100% tuyas. Esto te permite tener total control sobre tus precios y márgenes de ganancia."
    },
    {
      question: "¿Qué tipo de negocios pueden usar la plataforma?",
      answer: "Cualquier tipo de negocio o emprendimiento de Villarrica es bienvenido: tiendas de ropa, restaurantes, servicios profesionales (plomeros, electricistas, etc.), arriendos de equipos, ventas de productos artesanales, servicios de belleza, y muchos más. Si ofreces productos o servicios en Villarrica, tenemos un espacio para ti."
    },
    {
      question: "¿Necesito conocimientos técnicos para usar la plataforma?",
      answer: "No, para nada. Nuestra plataforma está diseñada para ser intuitiva y fácil de usar. Si sabes usar redes sociales o WhatsApp, podrás manejar tu tienda sin problemas. Además, cada sección del panel de administración tiene botones de ayuda que explican cómo funciona cada función."
    },
    {
      question: "¿Cómo puedo aumentar la visibilidad de mi tienda?",
      answer: "La visibilidad de tu tienda depende del plan que elijas: el Plan Gratuito tiene visibilidad baja, el Plan Normal tiene visibilidad media, y el Plan Premium ofrece visibilidad alta con máxima exposición en la plataforma. Además, mantener tus productos actualizados, con buenas fotos y descripciones completas, ayuda a atraer más clientes."
    },
    {
      question: "¿Puedo tener más de una tienda?",
      answer: "Actualmente, cada cuenta está asociada a un negocio. Si tienes múltiples negocios diferentes, te recomendamos crear cuentas separadas para cada uno, de esta forma cada negocio tendrá su propia identidad y administración independiente."
    },
    {
      question: "¿Qué hago si tengo problemas técnicos o dudas?",
      answer: "Puedes contactarnos directamente por email a soloaunclick@gmail.com. Nuestro equipo está disponible para ayudarte con cualquier problema técnico, duda sobre tu cuenta o sugerencia para mejorar la plataforma. Nos comprometemos a responder en el menor tiempo posible."
    }
  ]

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
              ❓ Preguntas Frecuentes
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
        <div className="overflow-y-auto max-h-[calc(85vh-160px)] md:max-h-[calc(85vh-160px)] px-4 md:px-6 py-3 md:py-6">
          <div className="space-y-2 md:space-y-3 text-purple-50 pb-4">

            {/* Introducción */}
            <section className="mb-3 md:mb-4">
              <p className="text-xs md:text-sm leading-snug md:leading-relaxed text-justify text-purple-100">
                Aquí encontrarás respuestas a las preguntas más frecuentes sobre <span className="font-semibold text-yellow-300">Solo a un Click</span>. Si no encuentras lo que buscas, no dudes en contactarnos.
              </p>
            </section>

            {/* Preguntas y Respuestas */}
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-purple-800/30 rounded-lg border border-purple-600/50 overflow-hidden"
              >
                {/* Pregunta */}
                <button
                  onClick={() => toggleQuestion(index)}
                  className="w-full flex items-center justify-between p-2 md:p-3 hover:bg-purple-700/30 transition-colors duration-200"
                >
                  <h3 className="text-xs md:text-sm font-bold text-yellow-300 text-left pr-2">
                    {index + 1}. {faq.question}
                  </h3>
                  <ChevronDown
                    className={`w-4 h-4 md:w-5 md:h-5 text-yellow-300 flex-shrink-0 transition-transform duration-300 ${
                      openQuestion === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Respuesta */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openQuestion === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="p-2 md:p-3 pt-0 md:pt-0">
                    <p className="text-xs md:text-sm leading-snug md:leading-relaxed text-justify text-purple-100">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Contacto adicional */}
            <section className="bg-gradient-to-r from-purple-800/60 to-purple-700/60 rounded-lg p-2 md:p-4 border border-yellow-400/50 mt-4 md:mt-6">
              <h3 className="text-base md:text-xl font-bold text-yellow-300 mb-1 md:mb-3">
                ¿No encontraste tu respuesta?
              </h3>
              <p className="text-xs md:text-sm leading-snug md:leading-relaxed text-justify mb-2">
                Si tienes alguna otra pregunta que no está en esta lista, estaremos encantados de ayudarte.
              </p>
              <div className="space-y-1 text-xs md:text-sm">
                <p className="flex items-center gap-2">
                  <span className="text-yellow-300">📧</span>
                  <span className="font-semibold">Email:</span> soloaunclick@gmail.com
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-yellow-300">🏢</span>
                  <span className="font-semibold">Plataforma:</span> Solo a un Click - Villarrica, Chile
                </p>
              </div>
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
