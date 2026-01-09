'use client'

import { X, Phone, MessageCircle, Mail, MapPin, Store } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { Product } from '@/types/product'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { VisuallyHidden } from '@/components/ui/visually-hidden'

interface ProductInfoPopupProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export function ProductInfoPopup({ product, isOpen, onClose }: ProductInfoPopupProps) {
  const router = useRouter()
  const pathname = usePathname()

  if (!product) return null

  // Función para navegar a la página de la tienda
  const handleStoreClick = () => {
    // Obtener posición de scroll actual
    const scrollY = window.scrollY

    // Crear un ID único para la tienda basado en el nombre (en el futuro será el ID real)
    const storeId = product.source?.toLowerCase().replace(/\s+/g, '-') || 'tienda'

    // Construir URL con parámetros para preservar estado
    const params = new URLSearchParams()
    params.append('fromPopup', 'true')
    params.append('productId', product.id)
    params.append('scrollY', scrollY.toString())

    // Navegar a la página de la tienda
    router.push(`/tienda/${storeId}?${params.toString()}`)
  }

  // Función para obtener la etiqueta de categoría (simulación)
  const getCategoriaLabel = (categoriaValue: string) => {
    const categories = {
      'electronics': 'Electrónica',
      'clothing': 'Ropa y Accesorios',
      'home': 'Hogar y Decoración',
      'sports': 'Deportes',
      'books': 'Libros',
      'productos': 'Productos',
      'servicios': 'Servicios',
      'arriendos': 'Arriendos'
    }
    return categories[categoriaValue as keyof typeof categories] || categoriaValue
  }

  // Función para obtener la etiqueta de subcategoría (simulación)
  const getSubcategoriaLabel = (subcategoriaValue: string) => {
    const subcategories = {
      'smartphones': 'Smartphones',
      'laptops': 'Laptops',
      'tablets': 'Tablets',
      'audio': 'Audio',
      'gaming': 'Gaming',
      'hombre': 'Hombre',
      'mujer': 'Mujer',
      'niños': 'Niños',
      'calzado': 'Calzado',
      'accesorios': 'Accesorios'
    }
    return subcategories[subcategoriaValue as keyof typeof subcategories] || subcategoriaValue
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-4xl w-[92vw] md:w-full max-h-[80vh] md:max-h-[90vh] overflow-y-auto bg-white text-gray-700 md:p-6 p-3 shadow-md"
        showCloseButton={false}
      >
        {/* Título oculto para accesibilidad */}
        <VisuallyHidden>
          <DialogTitle>{product.name}</DialogTitle>
        </VisuallyHidden>

        {/* TEMPORALMENTE OCULTO - Icono de Tienda - Parte superior izquierda */}
        <button
          onClick={handleStoreClick}
          className="absolute left-2 top-2 md:left-4 md:top-4 z-10 group hidden"
          title={`Ir a la tienda: ${product.source || 'Tienda'}`}
        >
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-2 md:p-2.5 rounded-full shadow-lg transition-all group-hover:scale-110 group-hover:shadow-xl cursor-pointer">
            <Store className="h-4 w-4 md:h-5 md:w-5 text-yellow-300" />
          </div>
        </button>

        {/* Botón cerrar - Movido a la parte inferior derecha */}
        <button
          onClick={onClose}
          className="absolute right-2 bottom-2 md:right-4 md:bottom-4 rounded-full bg-red-500 hover:bg-red-600 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 z-10 p-1.5 shadow-lg"
        >
          <X className="h-4 w-4 text-white" />
          <span className="sr-only">Cerrar</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 md:p-6 p-1">
          {/* Columna Izquierda - Imagen y Info del Negocio (50%) */}
          <div className="col-span-1 space-y-2 md:space-y-4">
            {/* Contenedor de Imagen e Iconos - Layout diferente para móvil */}
            <div className="flex md:block gap-2">
              {/* Imagen del Producto */}
              <div className="flex-1 aspect-square max-h-[35vh] md:max-h-none bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain md:object-cover"
                />
              </div>

              {/* Iconos de Contacto en columna vertical - Solo móvil */}
              <div className="md:hidden flex flex-col gap-2 justify-center">
                {/* Icono de Teléfono Clickeable */}
                <a
                  href={`tel:+1234567890`}
                  className="flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-500 rounded-full transition-colors cursor-pointer shadow-md"
                  title={`Llamar a +1234567890`}
                >
                  <Phone className="w-4 h-4 text-white" />
                </a>

                {/* Icono de WhatsApp Clickeable */}
                <a
                  href={`https://wa.me/1234567890`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 bg-green-600 hover:bg-green-500 rounded-full transition-colors cursor-pointer shadow-md"
                  title={`Enviar WhatsApp a +1234567890`}
                >
                  <MessageCircle className="w-4 h-4 text-white" />
                </a>

                {/* Icono de Email Clickeable */}
                <a
                  href={`mailto:contacto@tienda.com`}
                  className="flex items-center justify-center w-10 h-10 bg-purple-600 hover:bg-purple-500 rounded-full transition-colors cursor-pointer shadow-md"
                  title={`Enviar email a contacto@tienda.com`}
                >
                  <Mail className="w-4 h-4 text-white" />
                </a>

                {/* Icono de Ubicación Clickeable */}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=Negocio+Local`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 bg-red-600 hover:bg-red-500 rounded-full transition-colors cursor-pointer shadow-md"
                  title={`Ver ubicación: Negocio Local`}
                >
                  <MapPin className="w-4 h-4 text-white" />
                </a>
              </div>
            </div>

            {/* Iconos de Contacto para Desktop - en línea horizontal */}
            <div className="hidden md:block bg-white rounded-lg md:p-4 p-2 space-y-2 md:space-y-3 shadow-sm border border-gray-100">
              <div className="flex gap-2 md:gap-3 justify-center">
                {/* Icono de Teléfono Clickeable */}
                <a
                  href={`tel:+1234567890`}
                  className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 bg-blue-600 hover:bg-blue-500 rounded-full transition-colors cursor-pointer"
                  title={`Llamar a +1234567890`}
                >
                  <Phone className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                </a>

                {/* Icono de WhatsApp Clickeable */}
                <a
                  href={`https://wa.me/1234567890`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 bg-green-600 hover:bg-green-500 rounded-full transition-colors cursor-pointer"
                  title={`Enviar WhatsApp a +1234567890`}
                >
                  <MessageCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                </a>

                {/* Icono de Email Clickeable */}
                <a
                  href={`mailto:contacto@tienda.com`}
                  className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 bg-purple-600 hover:bg-purple-500 rounded-full transition-colors cursor-pointer"
                  title={`Enviar email a contacto@tienda.com`}
                >
                  <Mail className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                </a>

                {/* Icono de Ubicación Clickeable */}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=Negocio+Local`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 bg-red-600 hover:bg-red-500 rounded-full transition-colors cursor-pointer"
                  title={`Ver ubicación: Negocio Local`}
                >
                  <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                </a>
              </div>
            </div>

            {/* Información en 2 columnas para modo responsive */}
            <div className="md:hidden grid grid-cols-2 gap-2 p-1">
              {/* Columna Izquierda - Información principal */}
              <div className="space-y-1.5 p-1">
                {/* Nombre del Negocio - ARRIBA DEL PRODUCTO CON SUBRAYADO */}
                <h3 className="text-[0.65rem] font-medium text-gray-500 underline decoration-gray-300">
                  {product.source || 'Tienda Ejemplo'}
                </h3>

                {/* Título del producto - más chico */}
                <h2 className="text-xs font-bold text-gray-700 leading-tight">
                  {product.name}
                </h2>

                {/* Categoría y Subcategoría */}
                <div className="flex items-center gap-0.5 text-[8px] text-gray-500">
                  <span className="truncate max-w-[35%]">{getCategoriaLabel(product.category)}</span>
                  <span className="mx-0.5">/</span>
                  <span className="truncate max-w-[35%]">{getSubcategoriaLabel(product.category)}</span>
                </div>

                {/* Descripción - más pequeña */}
                <div>
                  <p className="text-gray-600 text-[0.55rem] leading-tight text-justify line-clamp-3">
                    {product.description || 'Sin descripción disponible.'}
                  </p>
                </div>

                {/* Precios */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-purple-600">
                    ${product.price.toLocaleString('es-CL')}
                  </span>
                  {product.originalPrice && (
                    <span className="text-[0.55rem] text-gray-500 line-through">
                      ${product.originalPrice.toLocaleString('es-CL')}
                    </span>
                  )}
                </div>
              </div>

              {/* Columna Derecha - Horarios y características */}
              <div className="space-y-2 p-1">
                {/* Horarios de Atención */}
                <div>
                  <h5 className="text-[0.6rem] font-medium text-gray-500 mb-0.5">Horarios:</h5>
                  <div className="flex flex-col gap-0.5 text-[0.55rem]">
                    <div className="flex justify-between">
                      <span className="text-gray-600">L-V:</span>
                      <span className="text-gray-500">09:00-18:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">S:</span>
                      <span className="text-gray-500">10:00-14:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">D:</span>
                      <span className="text-gray-500">Cerrado</span>
                    </div>
                  </div>
                </div>

                {/* Información adicional del producto */}
                <div className="space-y-0.5 text-[0.55rem]">
                  {/* Características ficticias */}
                  <div className="flex items-start gap-0.5">
                    <span className="text-gray-500">Tallas:</span>
                    <span className="text-gray-600">S, M, L, XL</span>
                  </div>

                  <div className="flex items-start gap-0.5">
                    <span className="text-gray-500">Género:</span>
                    <span className="text-gray-600 capitalize">Unisex</span>
                  </div>

                  <div className="flex items-start gap-0.5">
                    <span className="text-gray-500">Medidas:</span>
                    <span className="text-gray-600">20 x 15 x 10 cm</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha - Información (50%) - Solo visible en desktop */}
          <div className="hidden md:block col-span-1 space-y-2 md:p-2 p-1">
            {/* Nombre del Negocio - ARRIBA DEL PRODUCTO CON SUBRAYADO */}
            <h3 className="text-xs md:text-sm font-medium text-gray-500 underline decoration-gray-300">
              {product.source || 'Tienda Ejemplo'}
            </h3>

            {/* Título del producto */}
            <h2 className="text-base md:text-lg font-bold text-gray-700 leading-tight mb-1">
              {product.name}
            </h2>

            {/* Categoría y Subcategoría - más pequeño y más cerca */}
            <div className="flex items-center gap-2 text-[10px] text-gray-500 mb-2">
              <span className="truncate max-w-[35%]">{getCategoriaLabel(product.category)}</span>
              <span className="mx-0.5">/</span>
              <span className="truncate max-w-[35%]">{getSubcategoriaLabel(product.category)}</span>
            </div>

            {/* Descripción - más pequeña y líneas más juntas */}
            <div className="mb-2">
              <p className="text-gray-600 text-[0.65rem] md:text-xs leading-snug text-justify">
                {product.description || 'Sin descripción disponible.'}
              </p>
            </div>

            {/* Precios - más pequeños */}
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm md:text-base font-bold text-purple-600">
                ${product.price.toLocaleString('es-CL')}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-gray-500 line-through">
                  ${product.originalPrice.toLocaleString('es-CL')}
                </span>
              )}
            </div>

            {/* Información adicional del producto - sin título y más pequeña */}
            <div className="space-y-2 pt-2 border-t border-gray-200">
              <div className="space-y-1 text-xs">
                {/* Características ficticias */}
                <div className="flex items-start gap-2">
                  <span className="text-gray-500 min-w-[80px]">Tallas:</span>
                  <span className="text-gray-600 text-[10px]">S, M, L, XL</span>
                </div>
                
                <div className="flex items-start gap-2">
                  <span className="text-gray-500 min-w-[80px]">Género:</span>
                  <span className="text-gray-600 capitalize">Unisex</span>
                </div>
                
                <div className="flex items-start gap-2">
                  <span className="text-gray-500 min-w-[80px]">Medidas:</span>
                  <span className="text-gray-600">20 x 15 x 10 cm</span>
                </div>
              </div>
            </div>

            {/* Horarios de Atención - Movidos a la columna derecha */}
            <div className="mt-3">
              <h5 className="text-xs font-medium text-gray-500 mb-2">Horarios:</h5>
              <div className="flex gap-6 text-xs">
                <div className="text-center">
                  <div className="text-gray-600 font-medium text-[10px] mb-1">L-V</div>
                  <div className="flex gap-1 text-gray-500 text-[9px]">
                    <span>09:00</span>
                    <span>18:00</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-600 font-medium text-[10px] mb-1">S</div>
                  <div className="flex gap-1 text-gray-500 text-[9px]">
                    <span>10:00</span>
                    <span>14:00</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-600 font-medium text-[10px] mb-1">D</div>
                  <div className="flex gap-1 text-gray-500 text-[9px]">
                    <span>Cerrado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}