import { Mail, Phone, MessageCircle, Users, Store, HelpCircle, Shield, Cookie, RefreshCw, FileText } from 'lucide-react'

export default function AdminFooter() {
  return (
    <footer className="relative text-white py-8 px-6 mt-12 shadow-2xl" style={{ background: 'linear-gradient(90deg, #3b0764 0%, #4c1d95 20%, #6d28d9 40%, var(--yellow-accent) 100%)' }}>
      <div className="container mx-auto">
        {/* Fila superior - 2 filas de 2 columnas en móvil, 4 columnas en desktop */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 mb-8">

          {/* Primera fila en móvil: Logo y Contacto */}
          <div className="grid grid-cols-2 gap-6 md:gap-8 md:col-span-2">

            {/* Columna 1 - Logo y descripción */}
            <div className="text-left">
              <div className="mb-3 md:mb-4">
                <h2 className="text-lg md:text-2xl font-bold text-white mb-0.5">Solo a un</h2>
                <h2 className="text-xl md:text-3xl font-bold text-yellow-300">CLICK</h2>
              </div>
              <p className="text-primary-foreground/80 text-xs md:text-sm leading-relaxed">
                Tu guía completa de comercios, servicios y eventos.
              </p>
              <p className="text-primary-foreground/80 text-xs md:text-sm leading-relaxed">
                Descubre todo lo que tu ciudad tiene para ofrecer.
              </p>
            </div>

            {/* Columna 2 - Avisos Legales */}
            <div className="text-left">
              <h3 className="text-sm md:text-lg font-semibold text-white mb-3 md:mb-4 border-b border-yellow-400/30 pb-2">
                Avisos Legales
              </h3>
              <div className="space-y-1 md:space-y-2">
                <a href="#" className="flex items-center gap-1 md:gap-2 text-primary-foreground/80 text-xs hover:text-yellow-300 transition-colors duration-200">
                  <Shield className="w-3 h-3 md:w-4 md:h-4 text-yellow-300" />
                  Privacidad
                </a>
                <a href="#" className="flex items-center gap-1 md:gap-2 text-primary-foreground/80 text-xs hover:text-yellow-300 transition-colors duration-200">
                  <Cookie className="w-3 h-3 md:w-4 md:h-4 text-yellow-300" />
                  Cookies
                </a>
                <a href="#" className="flex items-center gap-1 md:gap-2 text-primary-foreground/80 text-xs hover:text-yellow-300 transition-colors duration-200">
                  <RefreshCw className="w-3 h-3 md:w-4 md:h-4 text-yellow-300" />
                  Reembolso
                </a>
                <a href="#" className="flex items-center gap-1 md:gap-2 text-primary-foreground/80 text-xs hover:text-yellow-300 transition-colors duration-200">
                  <Shield className="w-3 h-3 md:w-4 md:h-4 text-yellow-300" />
                  Seguridad
                </a>
                <a href="#" className="flex items-center gap-1 md:gap-2 text-primary-foreground/80 text-xs hover:text-yellow-300 transition-colors duration-200">
                  <FileText className="w-3 h-3 md:w-4 md:h-4 text-yellow-300" />
                  Condiciones y términos
                </a>
              </div>
            </div>

          </div>

          {/* Segunda fila en móvil: Información y Contacto */}
          <div className="grid grid-cols-2 gap-6 md:gap-8 md:col-span-2">

            {/* Columna 3 - Información */}
            <div className="text-left">
              <h3 className="text-sm md:text-lg font-semibold text-white mb-3 md:mb-4 border-b border-yellow-400/30 pb-2">
                Información
              </h3>
              <div className="space-y-1 md:space-y-2">
                <a href="#" className="flex items-center gap-1 md:gap-2 text-primary-foreground/80 text-xs hover:text-yellow-300 transition-colors duration-200">
                  <Users className="w-3 h-3 md:w-4 md:h-4 text-yellow-300" />
                  Sobre Nosotros
                </a>
                <a href="#" className="flex items-center gap-1 md:gap-2 text-primary-foreground/80 text-xs hover:text-yellow-300 transition-colors duration-200">
                  <Store className="w-3 h-3 md:w-4 md:h-4 text-yellow-300" />
                  Registra tu Negocio
                </a>
                <a href="#" className="flex items-center gap-1 md:gap-2 text-primary-foreground/80 text-xs hover:text-yellow-300 transition-colors duration-200">
                  <HelpCircle className="w-3 h-3 md:w-4 md:h-4 text-yellow-300" />
                  Preguntas
                </a>
              </div>
            </div>

            {/* Columna 4 - Contacto */}
            <div className="text-left">
              <h3 className="text-sm md:text-lg font-semibold text-white mb-3 md:mb-4 border-b border-yellow-400/30 pb-2">
                Contacto
              </h3>
              <div className="space-y-2 md:space-y-3">
                <div className="flex items-center gap-2 md:gap-3">
                  <Mail className="w-3 h-3 md:w-4 md:h-4 text-yellow-300" />
                  <span className="text-primary-foreground/80 text-xs">soloaunclick@gmail.com</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <Phone className="w-3 h-3 md:w-4 md:h-4 text-yellow-300" />
                  <span className="text-primary-foreground/80 text-xs">+1 234 567 890</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <MessageCircle className="w-3 h-3 md:w-4 md:h-4 text-yellow-300" />
                  <span className="text-primary-foreground/80 text-xs">+1 234 567 891</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fila inferior - Copyright */}
        <div className="border-t border-primary-foreground/20 pt-4 md:pt-6">
          <div className="text-center">
            <p className="text-primary-foreground/90 text-xs md:text-sm mb-1 md:mb-2">
              © 2025 Solo a un CLICK. Todos los derechos reservados.
            </p>
            <p className="text-primary-foreground/70 text-[10px] md:text-xs leading-relaxed max-w-2xl mx-auto">
              Solo a un CLICK es una plataforma de exhibición. Los productos publicados son responsabilidad exclusiva de la tienda que los ofrece.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}