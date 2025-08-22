"use client"

import { useState, Fragment, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Mail, Phone, MessageCircle, Users, Store, HelpCircle, Shield, Cookie, RefreshCw, FileText, X } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import AdminFooter from '@/components/admin-footer'

export default function AdminPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSection, setSelectedSection] = useState('')
  const [opcionesProducto, setOpcionesProducto] = useState({
    tallas: false,
    genero: false,
    medidas: false
  })
  const [descripcion, setDescripcion] = useState('')
  
  // Estados para los campos del formulario
  const [productoData, setProductoData] = useState({
    tipoNegocio: '',
    categoria: '',
    subcategoria: '',
    nombre: '',
    tallas: '',
    genero: '',
    medidas: '',
    unidadMedida: 'cm',
    precioActual: '',
    precioAnterior: ''
  })
  
  // Estados adicionales para manejo de tallas
  const [tipoTalla, setTipoTalla] = useState('ropa') // 'ropa' o 'calzado'
  const [tallasSeleccionadas, setTallasSeleccionadas] = useState<string[]>([])

  // Estados para almacenar los productos agregados en cada sección
  const [productos, setProductos] = useState({
    destacados: [],
    ofertas: [],
    novedades: [],
    tendencias: [],
    'no-te-lo-pierdas': [],
    liquidaciones: []
  })

  // Estado para el producto seleccionado para el modal
  const [selectedProducto, setSelectedProducto] = useState<any>(null)
  const [isProductoModalOpen, setIsProductoModalOpen] = useState(false)

  // Estados para los datos del negocio
  const [negocioData, setNegocioData] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    whatsapp: '',
    email: '',
    responsable: '',
    horarioLvInicio: '',
    horarioLvFin: '',
    horarioSabadoInicio: '',
    horarioSabadoFin: '',
    horarioDomingoInicio: '',
    horarioDomingoFin: ''
  })

  // Estado para la imagen cargada
  const [imagenProducto, setImagenProducto] = useState<string | null>(null)
  
  const openModal = (section: string) => {
    setSelectedSection(section)
    // Limpiar todos los campos al abrir el modal
    setProductoData({
      tipoNegocio: '',
      categoria: '',
      subcategoria: '',
      nombre: '',
      tallas: '',
      genero: '',
      medidas: '',
      unidadMedida: 'cm',
      precioActual: '',
      precioAnterior: ''
    })
    setDescripcion('')
    setImagenProducto(null)
    setOpcionesProducto({
      tallas: false,
      genero: false,
      medidas: false
    })
    setTipoTalla('ropa')
    setTallasSeleccionadas([])
    setIsModalOpen(true)
  }

  // Función para abrir el modal de información del producto
  const openProductoModal = (producto: any) => {
    setSelectedProducto(producto)
    setIsProductoModalOpen(true)
  }

  // Función para cerrar el modal de información del producto
  const closeProductoModal = () => {
    setSelectedProducto(null)
    setIsProductoModalOpen(false)
  }

  // Función para manejar cambios en los campos del formulario
  const handleProductoDataChange = (field: string, value: string) => {
    setProductoData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Función para manejar cambios en los campos del negocio
  const handleNegocioDataChange = (field: string, value: string) => {
    setNegocioData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Función para manejar selección de tipo de talla
  const handleTipoTallaChange = (value: string) => {
    setTipoTalla(value)
    setTallasSeleccionadas([]) // Limpiar selección al cambiar tipo
  }

  // Función para manejar selección múltiple de tallas
  const handleTallaSelection = (talla: string) => {
    setTallasSeleccionadas(prev => {
      if (prev.includes(talla)) {
        return prev.filter(t => t !== talla)
      } else {
        return [...prev, talla]
      }
    })
  }

  // Función para actualizar el campo tallas del productoData
  const actualizarTallasProducto = () => {
    const tallasString = tallasSeleccionadas.join(', ')
    setProductoData(prev => ({
      ...prev,
      tallas: tallasString
    }))
  }

  // Efecto para actualizar las tallas del producto cuando cambia la selección
  useEffect(() => {
    if (opcionesProducto.tallas) {
      actualizarTallasProducto()
    }
  }, [tallasSeleccionadas, tipoTalla, opcionesProducto.tallas])

  // Función de autollenado con datos de ejemplo
  const autollenarCampos = () => {
    const ejemplos = {
      destacados: {
        tipoNegocio: 'productos',
        categoria: 'electronica',
        subcategoria: 'smartphones',
        nombre: 'iPhone 15 Pro Max',
        tallas: 'No aplica',
        genero: 'generico',
        medidas: '159.9',
        unidadMedida: 'mm',
        precioActual: '1299.99',
        precioAnterior: '1499.99',
        descripcion: 'El último iPhone con cámara profesional de 48MP y chip A17 Pro. Diseño en titanio con pantalla Super Retina XDR de 6.7 pulgadas.',
        imagen: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop'
      },
      ofertas: {
        tipoNegocio: 'productos',
        categoria: 'ropa',
        subcategoria: 'hombre',
        nombre: 'Camisa Formal Premium',
        tallas: 'L, XL, XXL',
        genero: 'hombre',
        medidas: '',
        unidadMedida: 'cm',
        precioActual: '29.99',
        precioAnterior: '59.99',
        descripcion: 'Camisa formal de algodón premium con corte moderno. Ideal para ocasiones especiales y entorno laboral profesional.',
        imagen: 'https://images.unsplash.com/photo-1596755094512-f2912cd5b9e3?w=400&h=300&fit=crop'
      },
      novedades: {
        tipoNegocio: 'servicios',
        categoria: 'profesionales',
        subcategoria: 'consultoria',
        nombre: 'Consultoría Digital Empresarial',
        tallas: 'No aplica',
        genero: 'generico',
        medidas: '',
        unidadMedida: 'cm',
        precioActual: '150.00',
        precioAnterior: '',
        descripcion: 'Servicio de consultoría para transformación digital de empresas. Incluye análisis, estrategia e implementación de soluciones tecnológicas.',
        imagen: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop'
      },
      tendencias: {
        tipoNegocio: 'arriendos',
        categoria: 'vehiculos',
        subcategoria: 'autos',
        nombre: 'Tesla Model 3 2024',
        tallas: 'No aplica',
        genero: 'generico',
        medidas: '469.4',
        unidadMedida: 'cm',
        precioActual: '89.99',
        precioAnterior: '99.99',
        descripcion: 'Vehículo eléctrico de última generación con autonomía de 500km. Tecnología de punta y experiencia de conducción premium.',
        imagen: 'https://images.unsplash.com/photo-1554224712-d8560f709cbe?w=400&h=300&fit=crop'
      },
      'no-te-lo-pierdas': {
        tipoNegocio: 'productos',
        categoria: 'hogar',
        subcategoria: 'cocina',
        nombre: 'Set de Ollas Premium 6 piezas',
        tallas: 'No aplica',
        genero: 'generico',
        medidas: '',
        unidadMedida: 'cm',
        precioActual: '199.99',
        precioAnterior: '299.99',
        descripcion: 'Juego de ollas de acero inoxidable con distribución de calor uniforme. Incluye tapas de vidrio templado y mangos ergonómicos.',
        imagen: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop'
      },
      liquidaciones: {
        tipoNegocio: 'productos',
        categoria: 'deportes',
        subcategoria: 'fitness',
        nombre: 'Bicicleta Estática Profesional',
        tallas: 'No aplica',
        genero: 'generico',
        medidas: '120',
        unidadMedida: 'cm',
        precioActual: '399.99',
        precioAnterior: '799.99',
        descripcion: 'Bicicleta estática con resistencia magnética, monitor de ritmo cardíaco y programas de entrenamiento personalizados.',
        imagen: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
      }
    }

    const ejemplo = ejemplos[selectedSection as keyof typeof ejemplos] || ejemplos.destacados
    
    setProductoData({
      tipoNegocio: ejemplo.tipoNegocio,
      categoria: ejemplo.categoria,
      subcategoria: ejemplo.subcategoria,
      nombre: ejemplo.nombre,
      tallas: ejemplo.tallas,
      genero: ejemplo.genero,
      medidas: ejemplo.medidas,
      unidadMedida: ejemplo.unidadMedida,
      precioActual: ejemplo.precioActual,
      precioAnterior: ejemplo.precioAnterior
    })
    
    setDescripcion(ejemplo.descripcion)
    setImagenProducto(ejemplo.imagen)
    
    // Activar opciones según el ejemplo
    setOpcionesProducto({
      tallas: ejemplo.tallas !== 'No aplica',
      genero: ejemplo.genero !== 'generico',
      medidas: ejemplo.medidas !== ''
    })
    
    // Configurar tallas según el ejemplo
    if (ejemplo.tallas !== 'No aplica') {
      if (ejemplo.tallas === 'L, XL, XXL') {
        setTipoTalla('ropa')
        setTallasSeleccionadas(['l', 'xl', 'xxl'])
      } else {
        setTipoTalla('ropa')
        setTallasSeleccionadas([])
      }
    } else {
      setTipoTalla('ropa')
      setTallasSeleccionadas([])
    }
  }

  // Función de autollenado para datos del negocio
  const autollenarCamposNegocio = () => {
    const datosEjemplo = {
      nombre: 'Solo a un CLICK',
      direccion: 'Av. Principal 123, Centro, Ciudad',
      telefono: '+1 234 567 890',
      whatsapp: '+1 234 567 891',
      email: 'contacto@soloaunclick.com',
      responsable: 'Juan Pérez',
      horarioLvInicio: '09:00',
      horarioLvFin: '18:00',
      horarioSabadoInicio: '10:00',
      horarioSabadoFin: '14:00',
      horarioDomingoInicio: '',
      horarioDomingoFin: ''
    }
    
    setNegocioData(datosEjemplo)
  }

  // Función para agregar un producto
  const agregarProducto = () => {
    if (!productoData.nombre || !imagenProducto) {
      alert('Por favor completa al menos el nombre del producto y carga una imagen')
      return
    }

    // Actualizar las tallas seleccionadas antes de guardar
    actualizarTallasProducto()

    const nuevoProducto = {
      id: Date.now(), // ID único basado en timestamp
      ...productoData,
      descripcion,
      imagen: imagenProducto
    }

    setProductos(prev => ({
      ...prev,
      [selectedSection]: [...prev[selectedSection as keyof typeof prev], nuevoProducto]
    }))

    // Cerrar el modal y limpiar campos
    setIsModalOpen(false)
    setImagenProducto(null)
  }

  // Función para obtener la etiqueta de categoría
  const getCategoriaLabel = (categoriaValue: string) => {
    const allCategories = [
      ...categories.productos,
      ...categories.servicios,
      ...categories.arriendos
    ]
    const categoria = allCategories.find(cat => cat.value === categoriaValue)
    return categoria ? categoria.label : categoriaValue
  }

  // Función para obtener la etiqueta de subcategoría
  const getSubcategoriaLabel = (subcategoriaValue: string) => {
    const allSubcategories = Object.values(subcategories).flat()
    const subcategoria = allSubcategories.find(sub => sub.value === subcategoriaValue)
    return subcategoria ? subcategoria.label : subcategoriaValue
  }

  // Componente de tarjeta de producto
  const ProductoCard = ({ producto }: { producto: any }) => {
    return (
      <div 
        className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow w-32 h-48 cursor-pointer"
        onClick={() => openProductoModal(producto)}
      >
        {/* Parte superior con imagen - más compacta */}
        <div className="h-32 bg-white flex items-center justify-center p-0.5">
          <img 
            src={producto.imagen} 
            alt={producto.nombre}
            className="max-w-full max-h-full object-contain"
          />
        </div>
        
        {/* Parte inferior con información - ultra compacta */}
        <div className="p-0.5">
          {/* Fila con categoría y subcategoría centradas */}
          <div className="flex items-center justify-center text-[10px] text-gray-400 mb-0.5">
            <span className="text-center truncate max-w-[35%]">{getCategoriaLabel(producto.categoria)}</span>
            <span className="mx-0.5">/</span>
            <span className="text-center truncate max-w-[35%]">{getSubcategoriaLabel(producto.subcategoria)}</span>
          </div>
          
          {/* Nombre del producto */}
          <div className="mb-1">
            <h3 className="text-[10px] font-semibold text-gray-100 leading-tight line-clamp-2 text-center">
              {producto.nombre}
            </h3>
          </div>
          
          {/* Fila con precios */}
          <div className="flex items-center justify-between mb-1">
            {/* Precio actual */}
            <div className="text-purple-400 font-bold text-xs">
              ${producto.precioActual}
            </div>
            
            {/* Precio anterior tachado */}
            {producto.precioAnterior && (
              <div className="relative">
                <span className="text-gray-400 line-through text-[9px]">
                  ${producto.precioAnterior}
                </span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-px bg-red-500"></div>
                </div>
              </div>
            )}
          </div>
          
          {/* Botón +Información */}
          <button 
            className="w-full bg-gray-700 hover:bg-gray-600 text-white py-0.5 px-1 rounded transition-colors text-[9px] font-medium"
            onClick={(e) => {
              e.stopPropagation()
              openProductoModal(producto)
            }}
          >
            +Información
          </button>
        </div>
      </div>
    )
  }

  // Componente modal para mostrar información completa del producto
  const ProductoModal = ({ producto, isOpen, onClose }: { producto: any, isOpen: boolean, onClose: () => void }) => {
    if (!producto) return null

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-gray-900 text-white overflow-hidden">
          {/* Botón de cerrar en la esquina superior derecha */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-50 w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
          
          <div className="flex flex-col md:flex-row h-full">
            {/* Columna izquierda - Dividida en dos filas */}
            <div className="w-full md:w-1/2 flex flex-col h-full">
              {/* Fila superior - Imagen ocupando todo el espacio */}
              <div className="h-1/2 bg-white flex items-center justify-center p-4">
                <img 
                  src={producto.imagen} 
                  alt={producto.nombre}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              
              {/* Fila inferior - Información de contacto y horarios */}
              <div className="h-1/2 bg-gray-800 p-4 flex flex-col space-y-3">
                {/* Teléfono y WhatsApp uno al lado del otro */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 mb-1">Teléfono:</p>
                    <p className="text-white text-sm">+1 234 567 890</p>
                  </div>
                  
                  <div>
                    <p className="text-xs font-semibold text-gray-400 mb-1">WhatsApp:</p>
                    <p className="text-white text-sm">+1 234 567 891</p>
                  </div>
                </div>
                
                {/* Horarios */}
                <div>
                  <p className="text-xs font-semibold text-gray-400 mb-2">Horarios de Atención:</p>
                  <div className="space-y-1 text-white text-xs">
                    <div className="flex justify-between">
                      <span>Lunes a Viernes:</span>
                      <span>09:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sábado:</span>
                      <span>10:00 - 14:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Domingo:</span>
                      <span>Cerrado</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Columna derecha - Información del producto */}
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col space-y-4">
              {/* Nombre del producto centrado */}
              <div className="text-center">
                <h2 className="text-lg md:text-xl font-bold text-white mb-4">
                  {producto.nombre}
                </h2>
              </div>
              
              {/* Categoría y subcategoría centradas con letra pequeña */}
              <div className="text-center">
                <p className="text-sm text-gray-400">
                  {getCategoriaLabel(producto.categoria)} / {getSubcategoriaLabel(producto.subcategoria)}
                </p>
              </div>
              
              {/* Descripción justificada */}
              {producto.descripcion && (
                <div className="text-justify">
                  <p className="text-gray-300 leading-relaxed text-sm">
                    {producto.descripcion}
                  </p>
                </div>
              )}
              
              {/* Información adicional (solo si fue seleccionada) */}
              <div className="space-y-3">
                {/* Tallas (solo si aplica) */}
                {producto.tallas && producto.tallas !== 'No aplica' && (
                  <div>
                    <p className="text-sm font-semibold text-gray-400 mb-1">Tallas disponibles:</p>
                    <p className="text-white text-sm">{producto.tallas}</p>
                  </div>
                )}
                
                {/* Género (solo si aplica) */}
                {producto.genero && producto.genero !== 'generico' && (
                  <div>
                    <p className="text-sm font-semibold text-gray-400 mb-1">Género:</p>
                    <p className="text-white capitalize text-sm">{producto.genero}</p>
                  </div>
                )}
                
                {/* Medidas (solo si aplica) */}
                {producto.medidas && producto.medidas !== '' && (
                  <div>
                    <p className="text-sm font-semibold text-gray-400 mb-1">Medidas:</p>
                    <p className="text-white text-sm">{producto.medidas} {producto.unidadMedida}</p>
                  </div>
                )}
              </div>
              
              {/* Precios */}
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-700">
                {/* Precio actual en morado (izquierda) */}
                <div className="text-purple-400 font-bold text-base">
                  ${producto.precioActual}
                </div>
                
                {/* Precio anterior tachado con línea roja (derecha) */}
                {producto.precioAnterior && (
                  <div className="relative">
                    <span className="text-gray-400 line-through text-sm">
                      ${producto.precioAnterior}
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-px bg-red-500"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const toggleOpcion = (opcion: keyof typeof opcionesProducto) => {
    setOpcionesProducto(prev => ({
      ...prev,
      [opcion]: !prev[opcion]
    }))
  }

  const contarPalabras = (texto: string) => {
    // Eliminar espacios extra y dividir en palabras
    const palabras = texto.trim().split(/\s+/).filter(palabra => palabra.length > 0)
    return palabras.length
  }

  const handleDescripcionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const texto = e.target.value
    const palabras = contarPalabras(texto)
    
    // Limitar a 50 palabras
    if (palabras <= 50) {
      setDescripcion(texto)
    } else {
      // Si excede 50 palabras, cortar el texto
      const palabrasArray = texto.trim().split(/\s+/)
      const textoLimitado = palabrasArray.slice(0, 50).join(' ')
      setDescripcion(textoLimitado)
    }
  }

  // Categorías y subcategorías de ejemplo
  const categories = {
    productos: [
      { value: 'electronica', label: 'Electrónica' },
      { value: 'ropa', label: 'Ropa y Accesorios' },
      { value: 'hogar', label: 'Hogar y Decoración' },
      { value: 'deportes', label: 'Deportes' },
      { value: 'libros', label: 'Libros' }
    ],
    servicios: [
      { value: 'profesionales', label: 'Servicios Profesionales' },
      { value: 'mantenimiento', label: 'Mantenimiento' },
      { value: 'educacion', label: 'Educación' },
      { value: 'salud', label: 'Salud y Bienestar' },
      { value: 'belleza', label: 'Belleza' }
    ],
    arriendos: [
      { value: 'propiedades', label: 'Propiedades' },
      { value: 'vehiculos', label: 'Vehículos' },
      { value: 'equipos', label: 'Equipos' },
      { value: 'espacios', label: 'Espacios' },
      { value: 'herramientas', label: 'Herramientas' }
    ]
  }

  const subcategories = {
    electronica: [
      { value: 'smartphones', label: 'Smartphones' },
      { value: 'laptops', label: 'Laptops' },
      { value: 'tablets', label: 'Tablets' },
      { value: 'audio', label: 'Audio' },
      { value: 'gaming', label: 'Gaming' }
    ],
    ropa: [
      { value: 'hombre', label: 'Hombre' },
      { value: 'mujer', label: 'Mujer' },
      { value: 'niños', label: 'Niños' },
      { value: 'calzado', label: 'Calzado' },
      { value: 'accesorios', label: 'Accesorios' }
    ],
    hogar: [
      { value: 'muebles', label: 'Muebles' },
      { value: 'cocina', label: 'Cocina' },
      { value: 'baño', label: 'Baño' },
      { value: 'decoracion', label: 'Decoración' },
      { value: 'jardin', label: 'Jardín' }
    ],
    deportes: [
      { value: 'futbol', label: 'Fútbol' },
      { value: 'fitness', label: 'Fitness' },
      { value: 'ciclismo', label: 'Ciclismo' },
      { value: 'natacion', label: 'Natación' },
      { value: 'outdoor', label: 'Outdoor' }
    ],
    libros: [
      { value: 'ficcion', label: 'Ficción' },
      { value: 'no-ficcion', label: 'No Ficción' },
      { value: 'academicos', label: 'Académicos' },
      { value: 'infantiles', label: 'Infantiles' },
      { value: 'comics', label: 'Cómics' }
    ],
    profesionales: [
      { value: 'legal', label: 'Legal' },
      { value: 'contable', label: 'Contable' },
      { value: 'consultoria', label: 'Consultoría' },
      { value: 'diseno', label: 'Diseño' },
      { value: 'marketing', label: 'Marketing' }
    ],
    mantenimiento: [
      { value: 'electricidad', label: 'Electricidad' },
      { value: 'plomeria', label: 'Plomería' },
      { value: 'climatizacion', label: 'Climatización' },
      { value: 'pintura', label: 'Pintura' },
      { value: 'limpieza', label: 'Limpieza' }
    ],
    educacion: [
      { value: 'idiomas', label: 'Idiomas' },
      { value: 'musica', label: 'Música' },
      { value: 'arte', label: 'Arte' },
      { value: 'tecnologia', label: 'Tecnología' },
      { value: 'cocina', label: 'Cocina' }
    ],
    salud: [
      { value: 'medicina', label: 'Medicina' },
      { value: 'terapia', label: 'Terapia' },
      { value: 'nutricion', label: 'Nutrición' },
      { value: 'fitness', label: 'Fitness' },
      { value: 'salud-mental', label: 'Salud Mental' }
    ],
    belleza: [
      { value: 'corte', label: 'Corte de Cabello' },
      { value: 'maquillaje', label: 'Maquillaje' },
      { value: 'uñas', label: 'Uñas' },
      { value: 'spa', label: 'Spa' },
      { value: 'depilacion', label: 'Depilación' }
    ],
    propiedades: [
      { value: 'casas', label: 'Casas' },
      { value: 'departamentos', label: 'Departamentos' },
      { value: 'oficinas', label: 'Oficinas' },
      { value: 'locales', label: 'Locales Comerciales' },
      { value: 'terrenos', label: 'Terrenos' }
    ],
    vehiculos: [
      { value: 'autos', label: 'Autos' },
      { value: 'motos', label: 'Motos' },
      { value: 'camiones', label: 'Camiones' },
      { value: 'buses', label: 'Buses' },
      { value: 'maquinaria', label: 'Maquinaria' }
    ],
    equipos: [
      { value: 'construccion', label: 'Construcción' },
      { value: 'oficina', label: 'Oficina' },
      { value: 'eventos', label: 'Eventos' },
      { value: 'audiovisual', label: 'Audiovisual' },
      { value: 'medico', label: 'Médico' }
    ],
    espacios: [
      { value: 'bodegas', label: 'Bodegas' },
      { value: 'salones', label: 'Salones de Eventos' },
      { value: 'estudios', label: 'Estudios' },
      { value: 'garages', label: 'Garages' },
      { value: 'cocheras', label: 'Cocheras' }
    ],
    herramientas: [
      { value: 'jardineria', label: 'Jardinería' },
      { value: 'construccion', label: 'Construcción' },
      { value: 'mecanica', label: 'Mecánica' },
      { value: 'cocina', label: 'Cocina' },
      { value: 'limpieza', label: 'Limpieza' }
    ]
  }

  return (
    <>
      <div className="min-h-screen bg-gray-900">
      {/* Container principal con título y pestañas */}
      <div className="w-full">
        {/* Sección: Datos del Negocio */}
        <div className="px-6 py-8">
          <h1 className="text-3xl font-bold text-white mb-2">Datos del Negocio</h1>
          <p className="text-gray-400">Administra la información del negocio</p>
        </div>

        {/* Formulario */}
        <div className="px-6">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold text-white mb-4">Información General</h2>
            <p className="text-gray-400 mb-6">Ingresa los datos básicos del negocio</p>
            
            {/* Formulario único */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="entidad-nombre" className="text-gray-300">Nombre del Negocio</Label>
                  <Input 
                    id="entidad-nombre" 
                    value={negocioData.nombre}
                    onChange={(e) => handleNegocioDataChange('nombre', e.target.value)}
                    placeholder="Ingresa el nombre del negocio"
                    className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                
                <div>
                  <Label htmlFor="entidad-direccion" className="text-gray-300">Dirección</Label>
                  <Input 
                    id="entidad-direccion" 
                    value={negocioData.direccion}
                    onChange={(e) => handleNegocioDataChange('direccion', e.target.value)}
                    placeholder="Ingresa la dirección completa"
                    className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                
                {/* Teléfono y WhatsApp en la misma fila */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="entidad-telefono" className="text-gray-300 text-sm sm:text-base">Teléfono</Label>
                    <Input 
                      id="entidad-telefono" 
                      value={negocioData.telefono}
                      onChange={(e) => handleNegocioDataChange('telefono', e.target.value)}
                      placeholder="Ingresa el número"
                      className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 text-sm"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="entidad-whatsapp" className="text-gray-300 text-sm sm:text-base">WhatsApp</Label>
                    <Input 
                      id="entidad-whatsapp" 
                      value={negocioData.whatsapp}
                      onChange={(e) => handleNegocioDataChange('whatsapp', e.target.value)}
                      placeholder="Ingresa el número"
                      className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 text-sm"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="entidad-email" className="text-gray-300 text-sm sm:text-base">Email</Label>
                  <Input 
                    id="entidad-email" 
                    type="email"
                    value={negocioData.email}
                    onChange={(e) => handleNegocioDataChange('email', e.target.value)}
                    placeholder="Ingresa el correo electrónico"
                    className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 text-sm"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="entidad-responsable" className="text-gray-300 text-sm sm:text-base">Nombre del Responsable del Negocio</Label>
                  <Input 
                    id="entidad-responsable" 
                    value={negocioData.responsable}
                    onChange={(e) => handleNegocioDataChange('responsable', e.target.value)}
                    placeholder="Ingresa el nombre del responsable del negocio"
                    className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 text-sm"
                  />
                </div>
                
                {/* Sección de Horarios */}
                <div className="mt-6">
                  <Label className="text-gray-300 flex items-center gap-2 mb-4">
                    <Store className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Horarios de Atención</span>
                  </Label>
                  
                  <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 sm:p-6 space-y-4">
                    {/* Lunes a Viernes */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <Label className="text-gray-400 text-sm sm:text-sm w-full sm:w-32">
                        <span className="sm:hidden">L a V</span>
                        <span className="hidden sm:inline">Lunes a Viernes</span>
                      </Label>
                      <div className="flex items-center gap-2 flex-1">
                        <Input 
                          id="horario-lv-inicio"
                          type="time"
                          value={negocioData.horarioLvInicio}
                          onChange={(e) => handleNegocioDataChange('horarioLvInicio', e.target.value)}
                          className="bg-gray-600 border-gray-500 text-white placeholder-gray-400 w-24 sm:w-28 text-sm"
                        />
                        <span className="text-gray-400 text-sm">a</span>
                        <Input 
                          id="horario-lv-fin"
                          type="time"
                          value={negocioData.horarioLvFin}
                          onChange={(e) => handleNegocioDataChange('horarioLvFin', e.target.value)}
                          className="bg-gray-600 border-gray-500 text-white placeholder-gray-400 w-24 sm:w-28 text-sm"
                        />
                      </div>
                    </div>
                    
                    {/* Sábado */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <Label className="text-gray-400 text-sm sm:text-sm w-full sm:w-32">
                        <span className="sm:hidden">Sab</span>
                        <span className="hidden sm:inline">Sábado</span>
                      </Label>
                      <div className="flex items-center gap-2 flex-1">
                        <Input 
                          id="horario-sabado-inicio"
                          type="time"
                          value={negocioData.horarioSabadoInicio}
                          onChange={(e) => handleNegocioDataChange('horarioSabadoInicio', e.target.value)}
                          className="bg-gray-600 border-gray-500 text-white placeholder-gray-400 w-24 sm:w-28 text-sm"
                        />
                        <span className="text-gray-400 text-sm">a</span>
                        <Input 
                          id="horario-sabado-fin"
                          type="time"
                          value={negocioData.horarioSabadoFin}
                          onChange={(e) => handleNegocioDataChange('horarioSabadoFin', e.target.value)}
                          className="bg-gray-600 border-gray-500 text-white placeholder-gray-400 w-24 sm:w-28 text-sm"
                        />
                      </div>
                    </div>
                    
                    {/* Domingo */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <Label className="text-gray-400 text-sm sm:text-sm w-full sm:w-32">
                        <span className="sm:hidden">Dom</span>
                        <span className="hidden sm:inline">Domingo</span>
                      </Label>
                      <div className="flex items-center gap-2 flex-1">
                        <Input 
                          id="horario-domingo-inicio"
                          type="time"
                          value={negocioData.horarioDomingoInicio}
                          onChange={(e) => handleNegocioDataChange('horarioDomingoInicio', e.target.value)}
                          className="bg-gray-600 border-gray-500 text-white placeholder-gray-400 w-24 sm:w-28 text-sm"
                        />
                        <span className="text-gray-400 text-sm">a</span>
                        <Input 
                          id="horario-domingo-fin"
                          type="time"
                          value={negocioData.horarioDomingoFin}
                          onChange={(e) => handleNegocioDataChange('horarioDomingoFin', e.target.value)}
                          className="bg-gray-600 border-gray-500 text-white placeholder-gray-400 w-24 sm:w-28 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-between">
              <Button 
                className="bg-blue-600 hover:bg-blue-500 text-white"
                onClick={autollenarCamposNegocio}
              >
                Autollenar
              </Button>
              <Button className="bg-gray-700 hover:bg-gray-600 text-white">
                Guardar Información
              </Button>
            </div>
          </div>
        </div>

        {/* Modal para agregar producto */}
        <Dialog open={isModalOpen} onOpenChange={(open) => {
          if (!open) {
            // Limpiar todos los campos al cerrar el modal
            setProductoData({
              tipoNegocio: '',
              categoria: '',
              subcategoria: '',
              nombre: '',
              tallas: '',
              genero: '',
              medidas: '',
              unidadMedida: 'cm',
              precioActual: '',
              precioAnterior: ''
            })
            setDescripcion('')
            setImagenProducto(null)
            setOpcionesProducto({
              tallas: false,
              genero: false,
              medidas: false
            })
          }
          setIsModalOpen(open)
        }}>
          <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                Agregar Producto a {selectedSection}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Cargar imagen */}
              <div>
                <Label htmlFor="producto-imagen" className="text-gray-300 mb-2 block">
                  Cargar Imagen (JPG, PNG)
                </Label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 hover:border-gray-500 transition-colors w-64 h-48 mx-auto bg-white">
                  <input
                    id="producto-imagen"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          const container = document.getElementById('imagen-container');
                          if (container && e.target?.result) {
                            const imageUrl = e.target.result as string;
                            setImagenProducto(imageUrl);
                            container.innerHTML = `
                              <img src="${imageUrl}" alt="Producto" class="w-full h-full object-contain" />
                            `;
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <label htmlFor="producto-imagen" className="cursor-pointer h-full flex items-center justify-center">
                    <div id="imagen-container" className="flex flex-col items-center justify-center space-y-2 h-full">
                      <Plus className="w-8 h-8 text-gray-400" />
                      <span className="text-gray-400 text-sm">Haz clic para subir imagen</span>
                      <span className="text-gray-500 text-xs">Formatos: JPG, PNG</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Fila con tres campos: Tipo de Negocio, Categoría, Subcategoría */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Tipo de Negocio */}
                <div>
                  <Label htmlFor="tipo-negocio" className="text-gray-300 mb-2 block">
                    Tipo de Negocio
                  </Label>
                  <Select value={productoData.tipoNegocio} onValueChange={(value) => handleProductoDataChange('tipoNegocio', value)}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-full">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600 w-full">
                      <SelectItem value="productos">Productos</SelectItem>
                      <SelectItem value="servicios">Servicios</SelectItem>
                      <SelectItem value="arriendos">Arriendos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Categoría */}
                <div>
                  <Label htmlFor="categoria" className="text-gray-300 mb-2 block">
                    Categoría
                  </Label>
                  <Select value={productoData.categoria} onValueChange={(value) => handleProductoDataChange('categoria', value)}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-full">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600 w-full">
                      <SelectItem value="electronica">Electrónica</SelectItem>
                      <SelectItem value="ropa">Ropa y Accesorios</SelectItem>
                      <SelectItem value="hogar">Hogar y Decoración</SelectItem>
                      <SelectItem value="deportes">Deportes</SelectItem>
                      <SelectItem value="libros">Libros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Subcategoría */}
                <div>
                  <Label htmlFor="subcategoria" className="text-gray-300 mb-2 block">
                    Subcategoría
                  </Label>
                  <Select value={productoData.subcategoria} onValueChange={(value) => handleProductoDataChange('subcategoria', value)}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-full">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600 w-full">
                      <SelectItem value="smartphones">Smartphones</SelectItem>
                      <SelectItem value="laptops">Laptops</SelectItem>
                      <SelectItem value="tablets">Tablets</SelectItem>
                      <SelectItem value="audio">Audio</SelectItem>
                      <SelectItem value="gaming">Gaming</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Nombre o Título del Producto */}
              <div>
                <Label htmlFor="producto-nombre" className="text-gray-300 mb-2 block">
                  Nombre o Título del Producto
                </Label>
                <Input 
                  id="producto-nombre"
                  value={productoData.nombre}
                  onChange={(e) => handleProductoDataChange('nombre', e.target.value)}
                  placeholder="Ingresa el nombre del producto"
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>

              {/* Opciones de características del producto */}
              <div>
                <Label className="text-gray-300 mb-3 block">
                  Tu producto necesita mostrar:
                </Label>
                <div className="flex flex-wrap gap-6">
                  {/* Opción Tallas */}
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <input
                        type="checkbox"
                        id="opcion-tallas"
                        className="sr-only"
                        checked={opcionesProducto.tallas}
                        onChange={() => toggleOpcion('tallas')}
                      />
                      <label 
                        htmlFor="opcion-tallas"
                        className={`flex items-center justify-center w-5 h-5 border-2 rounded-full cursor-pointer transition-colors ${
                          opcionesProducto.tallas 
                            ? 'bg-blue-500 border-blue-500' 
                            : 'border-gray-400 hover:border-gray-300'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          toggleOpcion('tallas');
                        }}
                      >
                        {opcionesProducto.tallas && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </label>
                    </div>
                    <label htmlFor="opcion-tallas" className="text-gray-300 cursor-pointer">
                      Tallas
                    </label>
                  </div>

                  {/* Opción Género */}
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <input
                        type="checkbox"
                        id="opcion-genero"
                        className="sr-only"
                        checked={opcionesProducto.genero}
                        onChange={() => toggleOpcion('genero')}
                      />
                      <label 
                        htmlFor="opcion-genero"
                        className={`flex items-center justify-center w-5 h-5 border-2 rounded-full cursor-pointer transition-colors ${
                          opcionesProducto.genero 
                            ? 'bg-blue-500 border-blue-500' 
                            : 'border-gray-400 hover:border-gray-300'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          toggleOpcion('genero');
                        }}
                      >
                        {opcionesProducto.genero && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </label>
                    </div>
                    <label htmlFor="opcion-genero" className="text-gray-300 cursor-pointer">
                      Género
                    </label>
                  </div>

                  {/* Opción Medidas */}
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <input
                        type="checkbox"
                        id="opcion-medidas"
                        className="sr-only"
                        checked={opcionesProducto.medidas}
                        onChange={() => toggleOpcion('medidas')}
                      />
                      <label 
                        htmlFor="opcion-medidas"
                        className={`flex items-center justify-center w-5 h-5 border-2 rounded-full cursor-pointer transition-colors ${
                          opcionesProducto.medidas 
                            ? 'bg-blue-500 border-blue-500' 
                            : 'border-gray-400 hover:border-gray-300'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          toggleOpcion('medidas');
                        }}
                      >
                        {opcionesProducto.medidas && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </label>
                    </div>
                    <label htmlFor="opcion-medidas" className="text-gray-300 cursor-pointer">
                      Medidas
                    </label>
                  </div>
                </div>

                {/* Campos dinámicos según opciones seleccionadas */}
                <div className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Campo de Tallas */}
                    {opcionesProducto.tallas && (
                      <div className="md:col-span-3">
                        <Label className="text-gray-300 mb-2 block">
                          Tallas
                        </Label>
                        
                        {/* Selector de tipo de talla */}
                        <div className="mb-4">
                          <Label className="text-gray-400 text-xs inline-block mr-2">Tipo de prenda:</Label>
                          <div className="inline-flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleTipoTallaChange('ropa')}
                              className={`px-3 py-1 rounded transition-colors text-xs ${
                                tipoTalla === 'ropa'
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              }`}
                            >
                              Ropa
                            </button>
                            <button
                              type="button"
                              onClick={() => handleTipoTallaChange('calzado')}
                              className={`px-3 py-1 rounded transition-colors text-xs ${
                                tipoTalla === 'calzado'
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              }`}
                            >
                              Calzado
                            </button>
                          </div>
                        </div>
                        
                        {/* Selección múltiple de tallas */}
                        <div className="space-y-1">
                          <Label className="text-gray-400 text-xs whitespace-nowrap block">Seleccionar tallas disponibles:</Label>
                          <div className="grid grid-flow-col auto-cols-max gap-0.5">
                            {(tipoTalla === 'ropa' ? [
                              { value: 'xs', label: 'XS' },
                              { value: 's', label: 'S' },
                              { value: 'm', label: 'M' },
                              { value: 'l', label: 'L' },
                              { value: 'xl', label: 'XL' },
                              { value: 'xxl', label: 'XXL' },
                              { value: 'xxxl', label: 'XXXL' },
                              { value: 'unica', label: 'Única' }
                            ] : [
                              { value: '35', label: '35' },
                              { value: '36', label: '36' },
                              { value: '37', label: '37' },
                              { value: '38', label: '38' },
                              { value: '39', label: '39' },
                              { value: '40', label: '40' },
                              { value: '41', label: '41' },
                              { value: '42', label: '42' },
                              { value: '43', label: '43' },
                              { value: '44', label: '44' },
                              { value: '45', label: '45' },
                              { value: '46', label: '46' }
                            ]).map((talla) => (
                              <label
                                key={talla.value}
                                className={`flex items-center justify-center px-1.5 py-1 rounded border cursor-pointer transition-colors text-xs whitespace-nowrap ${
                                  tallasSeleccionadas.includes(talla.value)
                                    ? 'bg-purple-600 border-purple-500 text-white'
                                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={tallasSeleccionadas.includes(talla.value)}
                                  onChange={() => handleTallaSelection(talla.value)}
                                  className="sr-only"
                                />
                                {talla.label}
                              </label>
                            ))}
                          </div>
                        </div>
                        
                        {/* Mostrar tallas seleccionadas */}
                        {tallasSeleccionadas.length > 0 && (
                          <div className="mt-3 p-2 bg-gray-800 rounded-lg">
                            <p className="text-gray-400 text-sm mb-1">Tallas seleccionadas:</p>
                            <p className="text-white text-sm font-medium">
                              {tallasSeleccionadas.map(t => 
                                (tipoTalla === 'ropa' ? 
                                  t.toUpperCase() : 
                                  t
                                )
                              ).join(', ')}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Campo de Género */}
                    {opcionesProducto.genero && (
                      <div className="md:col-span-3">
                        <Label htmlFor="genero" className="text-gray-300 mb-2 block">
                          Género
                        </Label>
                        <Select value={productoData.genero} onValueChange={(value) => handleProductoDataChange('genero', value)}>
                          <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-full">
                            <SelectValue placeholder="Seleccionar género" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-700 border-gray-600">
                            <SelectItem value="hombre">Hombre</SelectItem>
                            <SelectItem value="mujer">Mujer</SelectItem>
                            <SelectItem value="niño">Niño</SelectItem>
                            <SelectItem value="niña">Niña</SelectItem>
                            <SelectItem value="generico">Genérico</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Campo de Medidas */}
                    {opcionesProducto.medidas && (
                      <div className="md:col-span-6">
                        <Label className="text-gray-300 mb-2 block">
                          Medidas
                        </Label>
                        <div className="flex items-center gap-2">
                          <Input 
                            id="medidas"
                            type="number"
                            value={productoData.medidas}
                            onChange={(e) => handleProductoDataChange('medidas', e.target.value)}
                            placeholder="0"
                            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 flex-1"
                          />
                          <Select value={productoData.unidadMedida} onValueChange={(value) => handleProductoDataChange('unidadMedida', value)}>
                            <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-20">
                              <SelectValue placeholder="cm" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-700 border-gray-600">
                              <SelectItem value="cm">cm</SelectItem>
                              <SelectItem value="m">m</SelectItem>
                              <SelectItem value="mm">mm</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Campos de Precio */}
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Precio Actual */}
                  <div>
                    <Label htmlFor="precio-actual" className="text-gray-300 mb-2 block">
                      Precio Actual
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                      <Input 
                        id="precio-actual"
                        type="number"
                        value={productoData.precioActual}
                        onChange={(e) => handleProductoDataChange('precioActual', e.target.value)}
                        placeholder="0.00"
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 pl-8"
                      />
                    </div>
                  </div>

                  {/* Precio Anterior */}
                  <div>
                    <Label htmlFor="precio-anterior" className="text-gray-300 mb-2 block">
                      Precio Anterior
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                      <Input 
                        id="precio-anterior"
                        type="number"
                        value={productoData.precioAnterior}
                        onChange={(e) => handleProductoDataChange('precioAnterior', e.target.value)}
                        placeholder="0.00"
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 pl-8"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Campo de Descripción */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="descripcion" className="text-gray-300">
                    Descripción
                  </Label>
                  <span className={`text-sm ${
                    contarPalabras(descripcion) > 45 
                      ? 'text-yellow-400' 
                      : contarPalabras(descripcion) > 48 
                        ? 'text-red-400' 
                        : 'text-gray-400'
                  }`}>
                    {contarPalabras(descripcion)}/50 palabras
                  </span>
                </div>
                <Textarea
                  id="descripcion"
                  value={descripcion}
                  onChange={handleDescripcionChange}
                  placeholder="Escribe una descripción detallada del producto..."
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 resize-none"
                  rows={4}
                />
                <div className="mt-1">
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        contarPalabras(descripcion) > 48 
                          ? 'bg-red-500' 
                          : contarPalabras(descripcion) > 45 
                            ? 'bg-yellow-500' 
                            : 'bg-blue-500'
                      }`}
                      style={{ width: `${(contarPalabras(descripcion) / 50) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex justify-end space-x-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsModalOpen(false)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancelar
                </Button>
                <Button 
                  variant="outline" 
                  onClick={autollenarCampos}
                  className="border-blue-600 text-blue-300 hover:bg-blue-700 hover:text-white"
                >
                  Autollenado
                </Button>
                <Button onClick={agregarProducto} className="bg-gray-700 hover:bg-gray-600 text-white">
                  Agregar Producto
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Separador entre secciones */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Sección: Gestión de Productos */}
        <div className="px-6 py-8">
          <h1 className="text-3xl font-bold text-white mb-2">Gestión de Productos</h1>
          <p className="text-gray-400">Administra las diferentes secciones de productos del marketplace</p>
        </div>

        {/* Pestañas de Productos */}
        <Tabs defaultValue="destacados" className="w-full">
          <TabsList className="grid grid-cols-3 sm:grid-cols-6 w-full max-w-[280px] sm:max-w-5xl mx-auto px-3 sm:px-6 mb-8 bg-gray-800 border border-gray-700 rounded-md p-1.5 gap-0.5 sm:gap-1 h-20 sm:h-10">
            <TabsTrigger 
              value="destacados" 
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300 hover:text-white hover:bg-gray-700 transition-colors text-xs sm:text-base"
            >
              Destacados
            </TabsTrigger>
            <TabsTrigger 
              value="ofertas" 
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300 hover:text-white hover:bg-gray-700 transition-colors text-xs sm:text-base"
            >
              Ofertas
            </TabsTrigger>
            <TabsTrigger 
              value="novedades" 
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300 hover:text-white hover:bg-gray-700 transition-colors text-xs sm:text-base"
            >
              Novedades
            </TabsTrigger>
            <TabsTrigger 
              value="tendencias" 
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300 hover:text-white hover:bg-gray-700 transition-colors text-xs sm:text-base"
            >
              Tendencias
            </TabsTrigger>
            <TabsTrigger 
              value="no-te-lo-pierdas" 
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300 hover:text-white hover:bg-gray-700 transition-colors text-xs sm:text-base"
            >
              ¡No te lo Pierdas!
            </TabsTrigger>
            <TabsTrigger 
              value="liquidaciones" 
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300 hover:text-white hover:bg-gray-700 transition-colors text-xs sm:text-base"
            >
              Liquidaciones
            </TabsTrigger>
          </TabsList>

          {/* Contenido de cada pestaña de productos */}
          <div className="px-6">
            {/* Tab Destacados */}
            <TabsContent value="destacados" className="space-y-4">
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-2">
                <h2 className="text-xl font-semibold text-white mb-4">Sección: Destacados</h2>
                <p className="text-gray-400 mb-6">Los productos más populares del momento</p>
                
                {/* Grid de productos */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-px justify-items-center">
                  {/* Tarjeta con botón agregar - siempre primera */}
                  <div 
                    className="bg-gray-700 border-2 border-dashed border-gray-600 rounded-lg p-1 hover:border-gray-500 transition-colors cursor-pointer w-32 h-48 flex flex-col justify-center"
                    onClick={() => openModal('destacados')}
                  >
                    <div className="flex flex-col items-center justify-center space-y-1 h-full">
                      <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-500 transition-colors">
                        <Plus className="w-3 h-3 text-gray-300" />
                      </div>
                      <p className="text-gray-400 text-[9px] text-center leading-tight">
                        Añadir productos a la sección Destacados
                      </p>
                    </div>
                  </div>
                  
                  {/* Tarjetas de productos existentes */}
                  {productos.destacados.map((producto) => (
                    <ProductoCard key={producto.id} producto={producto} />
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Tab Ofertas */}
            <TabsContent value="ofertas" className="space-y-4">
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-2">
                <h2 className="text-xl font-semibold text-white mb-4">Sección: Ofertas</h2>
                <p className="text-gray-400 mb-6">Descuentos exclusivos por tiempo limitado</p>
                
                {/* Grid de productos */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-px justify-items-center">
                  {/* Tarjeta con botón agregar - siempre primera */}
                  <div 
                    className="bg-gray-700 border-2 border-dashed border-gray-600 rounded-lg p-1 hover:border-gray-500 transition-colors cursor-pointer w-32 h-48 flex flex-col justify-center"
                    onClick={() => openModal('ofertas')}
                  >
                    <div className="flex flex-col items-center justify-center space-y-1 h-full">
                      <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-500 transition-colors">
                        <Plus className="w-3 h-3 text-gray-300" />
                      </div>
                      <p className="text-gray-400 text-[9px] text-center leading-tight">
                        Añadir productos con descuento a la sección Ofertas
                      </p>
                    </div>
                  </div>
                  
                  {/* Tarjetas de productos existentes */}
                  {productos.ofertas.map((producto) => (
                    <ProductoCard key={producto.id} producto={producto} />
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Tab Novedades */}
            <TabsContent value="novedades" className="space-y-4">
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-2">
                <h2 className="text-xl font-semibold text-white mb-4">Sección: Novedades</h2>
                <p className="text-gray-400 mb-6">Los últimos lanzamientos del mercado</p>
                
                {/* Grid de productos */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-px justify-items-center">
                  {/* Tarjeta con botón agregar - siempre primera */}
                  <div 
                    className="bg-gray-700 border-2 border-dashed border-gray-600 rounded-lg p-1 hover:border-gray-500 transition-colors cursor-pointer w-32 h-48 flex flex-col justify-center"
                    onClick={() => openModal('novedades')}
                  >
                    <div className="flex flex-col items-center justify-center space-y-1 h-full">
                      <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-500 transition-colors">
                        <Plus className="w-3 h-3 text-gray-300" />
                      </div>
                      <p className="text-gray-400 text-[9px] text-center leading-tight">
                        Añadir productos nuevos a la sección Novedades
                      </p>
                    </div>
                  </div>
                  
                  {/* Tarjetas de productos existentes */}
                  {productos.novedades.map((producto) => (
                    <ProductoCard key={producto.id} producto={producto} />
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Tab Tendencias */}
            <TabsContent value="tendencias" className="space-y-4">
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-2">
                <h2 className="text-xl font-semibold text-white mb-4">Sección: Tendencias</h2>
                <p className="text-gray-400 mb-6">Lo más buscado y deseado actualmente</p>
                
                {/* Grid de productos */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-px justify-items-center">
                  {/* Tarjeta con botón agregar - siempre primera */}
                  <div 
                    className="bg-gray-700 border-2 border-dashed border-gray-600 rounded-lg p-1 hover:border-gray-500 transition-colors cursor-pointer w-32 h-48 flex flex-col justify-center"
                    onClick={() => openModal('tendencias')}
                  >
                    <div className="flex flex-col items-center justify-center space-y-1 h-full">
                      <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-500 transition-colors">
                        <Plus className="w-3 h-3 text-gray-300" />
                      </div>
                      <p className="text-gray-400 text-[9px] text-center leading-tight">
                        Añadir productos populares a la sección Tendencias
                      </p>
                    </div>
                  </div>
                  
                  {/* Tarjetas de productos existentes */}
                  {productos.tendencias.map((producto) => (
                    <ProductoCard key={producto.id} producto={producto} />
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Tab ¡No te lo Pierdas! */}
            <TabsContent value="no-te-lo-pierdas" className="space-y-4">
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-2">
                <h2 className="text-xl font-semibold text-white mb-4">Sección: ¡No te lo Pierdas!</h2>
                <p className="text-gray-400 mb-6">Oportunidades únicas que no puedes dejar pasar</p>
                
                {/* Grid de productos */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-px justify-items-center">
                  {/* Tarjeta con botón agregar - siempre primera */}
                  <div 
                    className="bg-gray-700 border-2 border-dashed border-gray-600 rounded-lg p-1 hover:border-gray-500 transition-colors cursor-pointer w-32 h-48 flex flex-col justify-center"
                    onClick={() => openModal('no-te-lo-pierdas')}
                  >
                    <div className="flex flex-col items-center justify-center space-y-1 h-full">
                      <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-500 transition-colors">
                        <Plus className="w-3 h-3 text-gray-300" />
                      </div>
                      <p className="text-gray-400 text-[9px] text-center leading-tight">
                        Añadir productos especiales a la sección ¡No te lo Pierdas!
                      </p>
                    </div>
                  </div>
                  
                  {/* Tarjetas de productos existentes */}
                  {productos['no-te-lo-pierdas'].map((producto) => (
                    <ProductoCard key={producto.id} producto={producto} />
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Tab Liquidaciones */}
            <TabsContent value="liquidaciones" className="space-y-4">
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-2">
                <h2 className="text-xl font-semibold text-white mb-4">Sección: Liquidaciones</h2>
                <p className="text-gray-400 mb-6">Precios increíbles en productos seleccionados</p>
                
                {/* Grid de productos */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-px justify-items-center">
                  {/* Tarjeta con botón agregar - siempre primera */}
                  <div 
                    className="bg-gray-700 border-2 border-dashed border-gray-600 rounded-lg p-1 hover:border-gray-500 transition-colors cursor-pointer w-32 h-48 flex flex-col justify-center"
                    onClick={() => openModal('liquidaciones')}
                  >
                    <div className="flex flex-col items-center justify-center space-y-1 h-full">
                      <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-500 transition-colors">
                        <Plus className="w-3 h-3 text-gray-300" />
                      </div>
                      <p className="text-gray-400 text-[9px] text-center leading-tight">
                        Añadir productos en liquidación a la sección Liquidaciones
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Container de KPIs */}
      <div className="w-full px-6 py-12 relative mt-8">
        <h2 className="text-2xl font-bold text-white mb-6">KPIs y Métricas de Productos del trimestre en curso</h2>
        
        {/* Recuadro de advertencia central */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="bg-white border-4 border-red-500 rounded-lg p-8 text-center max-w-md mx-4 shadow-2xl">
            <div className="text-red-600 text-2xl font-bold mb-4">⚠️ Sección No Disponible</div>
            <div className="text-gray-700 text-base">
              Prontamente nuevo contenido de administración para tus productos.
            </div>
          </div>
        </div>

        {/* Manta transparente */}
        <div className="absolute inset-0 bg-black/8 backdrop-blur-[2px] z-10"></div>
        
        {/* Primera Fila - 3 columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 items-stretch">
          
          {/* Columna 1 - 2 filas de 2 KPIs cada una */}
          <div className="space-y-4 h-full flex flex-col">
            {/* Fila 1 - 2 KPIs */}
            <div className="grid grid-cols-2 gap-3 flex-1">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex flex-col justify-center items-center text-center">
                <div className="text-gray-400 text-sm mb-1">Vistas del Mes en Curso</div>
                <div className="text-2xl font-bold text-white">2,847</div>
                <div className="text-green-400 text-xs">+12.5% comparado con el trimestre pasado a la fecha</div>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex flex-col justify-center items-center text-center">
                <div className="text-gray-400 text-sm mb-1">Vistas Acumuladas Mes</div>
                <div className="text-2xl font-bold text-white">45,234</div>
                <div className="text-green-400 text-xs">+8.3% comparado con el trimestre pasado a la fecha</div>
              </div>
            </div>
            
            {/* Fila 2 - 2 KPIs */}
            <div className="grid grid-cols-2 gap-3 flex-1">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex flex-col justify-center items-center text-center">
                <div className="text-gray-400 text-sm mb-1">Productos Activos Mes</div>
                <div className="text-2xl font-bold text-white">24</div>
                <div className="text-green-400 text-xs">+12.5% comparado con el trimestre pasado a la fecha</div>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex flex-col justify-center items-center text-center">
                <div className="text-gray-400 text-sm mb-1">Clicks Mes en Curso</div>
                <div className="text-2xl font-bold text-white">1,456</div>
                <div className="text-green-400 text-xs">+8.7% comparado con el trimestre pasado a la fecha</div>
              </div>
            </div>
          </div>
          
          {/* Columna 2 - KPI grande con gráfico y pestañas */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 h-full flex flex-col">
            <Tabs defaultValue="mensual" className="w-full h-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="mensual" className="text-xs">Mensual</TabsTrigger>
                <TabsTrigger value="trimestral" className="text-xs">Trimestral</TabsTrigger>
                <TabsTrigger value="anual" className="text-xs">Anual</TabsTrigger>
              </TabsList>
              
              <TabsContent value="mensual" className="h-64">
                <div className="text-gray-400 text-sm mb-2">Vistas de Productos Mensuales</div>
                <div className="text-3xl font-bold text-white mb-4">85,420</div>
                {/* Gráfico simulado */}
                <div className="bg-gray-700 rounded h-40 flex items-end justify-around p-2">
                  <div className="bg-purple-500 w-8 h-16 rounded-t"></div>
                  <div className="bg-purple-500 w-8 h-20 rounded-t"></div>
                  <div className="bg-purple-500 w-8 h-12 rounded-t"></div>
                  <div className="bg-purple-500 w-8 h-24 rounded-t"></div>
                  <div className="bg-purple-500 w-8 h-28 rounded-t"></div>
                  <div className="bg-purple-500 w-8 h-32 rounded-t"></div>
                  <div className="bg-purple-500 w-8 h-20 rounded-t"></div>
                </div>
              </TabsContent>
              
              <TabsContent value="trimestral" className="h-64">
                <div className="text-gray-400 text-sm mb-2">Vistas de Productos Trimestrales</div>
                <div className="text-3xl font-bold text-white mb-4">248,750</div>
                {/* Gráfico simulado */}
                <div className="bg-gray-700 rounded h-40 flex items-end justify-around p-2">
                  <div className="bg-blue-500 w-12 h-20 rounded-t"></div>
                  <div className="bg-blue-500 w-12 h-28 rounded-t"></div>
                  <div className="bg-blue-500 w-12 h-32 rounded-t"></div>
                  <div className="bg-blue-500 w-12 h-24 rounded-t"></div>
                </div>
              </TabsContent>
              
              <TabsContent value="anual" className="h-64">
                <div className="text-gray-400 text-sm mb-2">Vistas de Productos Anuales</div>
                <div className="text-3xl font-bold text-white mb-4">1,247,890</div>
                {/* Gráfico simulado */}
                <div className="bg-gray-700 rounded h-40 flex items-end justify-around p-2">
                  <div className="bg-green-500 w-16 h-24 rounded-t"></div>
                  <div className="bg-green-500 w-16 h-32 rounded-t"></div>
                  <div className="bg-green-500 w-16 h-28 rounded-t"></div>
                  <div className="bg-green-500 w-16 h-36 rounded-t"></div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Columna 3 - 2 filas de 2 KPIs cada una (igual que columna 1) */}
          <div className="space-y-4 h-full flex flex-col">
            {/* Fila 1 - 2 KPIs */}
            <div className="grid grid-cols-2 gap-3 flex-1">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex flex-col justify-center items-center text-center">
                <div className="text-gray-400 text-sm mb-1">Destacados del Mes</div>
                <div className="text-2xl font-bold text-white">8</div>
                <div className="text-green-400 text-xs">+25% comparado con el trimestre pasado a la fecha</div>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex flex-col justify-center items-center text-center">
                <div className="text-gray-400 text-sm mb-1">Tasa Interacción Mes</div>
                <div className="text-2xl font-bold text-white">4.2%</div>
                <div className="text-green-400 text-xs">+0.8% comparado con el trimestre pasado a la fecha</div>
              </div>
            </div>
            
            {/* Fila 2 - 2 KPIs */}
            <div className="grid grid-cols-2 gap-3 flex-1">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex flex-col justify-center items-center text-center">
                <div className="text-gray-400 text-sm mb-1">Tiempo Vista Mensual</div>
                <div className="text-2xl font-bold text-white">2:34</div>
                <div className="text-green-400 text-xs">+9.4% comparado con el trimestre pasado a la fecha</div>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex flex-col justify-center items-center text-center">
                <div className="text-gray-400 text-sm mb-1">Conversión Mensual</div>
                <div className="text-2xl font-bold text-white">5.7%</div>
                <div className="text-green-400 text-xs">+1.2% comparado con el trimestre pasado a la fecha</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Segunda Fila - 6 KPIs en una sola fila */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 flex flex-col justify-center items-center text-center">
            <div className="text-gray-400 text-xs mb-1">Ofertas del Mes</div>
            <div className="text-lg font-bold text-white">12</div>
            <div className="text-green-400 text-xs">+25% comparado con el trimestre pasado a la fecha</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 flex flex-col justify-center items-center text-center">
            <div className="text-gray-400 text-xs mb-1">Novedades del Mes</div>
            <div className="text-lg font-bold text-white">6</div>
            <div className="text-green-400 text-xs">+33.3% comparado con el trimestre pasado a la fecha</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 flex flex-col justify-center items-center text-center">
            <div className="text-gray-400 text-xs mb-1">Tendencias del Mes</div>
            <div className="text-lg font-bold text-white">4</div>
            <div className="text-yellow-400 text-xs">0% comparado con el trimestre pasado a la fecha</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 flex flex-col justify-center items-center text-center">
            <div className="text-gray-400 text-xs mb-1">Impresiones Mensuales</div>
            <div className="text-lg font-bold text-white">125K</div>
            <div className="text-green-400 text-xs">+12% comparado con el trimestre pasado a la fecha</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 flex flex-col justify-center items-center text-center">
            <div className="text-gray-400 text-xs mb-1">Alcance Mensual</div>
            <div className="text-lg font-bold text-white">89K</div>
            <div className="text-green-400 text-xs">+13.5% comparado con el trimestre pasado a la fecha</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 flex flex-col justify-center items-center text-center">
            <div className="text-gray-400 text-xs mb-1">Engagement Mensual</div>
            <div className="text-lg font-bold text-white">7.2%</div>
            <div className="text-green-400 text-xs">+0.9% comparado con el trimestre pasado a la fecha</div>
          </div>
        </div>
      </div>
      
      {/* Modal para mostrar información completa del producto */}
      <ProductoModal 
        producto={selectedProducto}
        isOpen={isProductoModalOpen}
        onClose={closeProductoModal}
      />
    </div>
    
    <AdminFooter />
    </>
  )
}