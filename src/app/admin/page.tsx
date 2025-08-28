"use client"

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Clock, Calendar, Mail, Phone, MessageCircle, Users, Store, HelpCircle, Shield, Cookie, RefreshCw, FileText, X, MapPin } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AdminProductCarousel } from '@/components/admin/admin-product-carousel'

export default function AdminPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSection, setSelectedSection] = useState('')
  const [opcionesProducto, setOpcionesProducto] = useState({
    tallasCalzado: false,
    tallasRopa: false,
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
    tallasCalzado: [] as string[],
    tallasRopa: [] as string[],
    genero: '',
    medidas: '',
    unidadMedida: 'cm',
    precioActual: '',
    precioAnterior: ''
  })

  // Estados para almacenar los productos agregados en cada sección
  const [productos, setProductos] = useState({
    destacados: [],
    ofertas: [],
    novedades: [],
    tendencias: [],
    'no-te-lo-pierdas': [],
    liquidaciones: []
  })

  // Estado para la imagen cargada
  const [imagenProducto, setImagenProducto] = useState<string | null>(null)
  
  // Estado para el popup de información del producto
  const [selectedProducto, setSelectedProducto] = useState<any | null>(null)
  
  // Estado para información del negocio
  const [businessInfo, setBusinessInfo] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    whatsapp: '',
    email: '',
    responsable: '',
    horarios: {
      lunesViernes: { inicio: '', fin: '' },
      sabado: { inicio: '', fin: '' },
      domingo: { inicio: '', fin: '' }
    }
  })
  
  const openModal = (section: string) => {
    setSelectedSection(section)
    // Limpiar todos los campos al abrir el modal
    setProductoData({
      tipoNegocio: '',
      categoria: '',
      subcategoria: '',
      nombre: '',
      tallasCalzado: [],
      tallasRopa: [],
      genero: '',
      medidas: '',
      unidadMedida: 'cm',
      precioActual: '',
      precioAnterior: ''
    })
    setDescripcion('')
    setImagenProducto(null)
    setOpcionesProducto({
      tallasCalzado: false,
      tallasRopa: false,
      genero: false,
      medidas: false
    })
    setIsModalOpen(true)
  }

  // Función para manejar cambios en los campos del formulario
  const handleProductoDataChange = (field: string, value: string) => {
    setProductoData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Función para manejar cambios en la información del negocio
  const handleBusinessInfoChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child, subfield] = field.split('.')
      setBusinessInfo(prev => {
        const newInfo = { ...prev }
        if (parent === 'horarios') {
          newInfo.horarios = {
            ...prev.horarios,
            [child]: {
              ...prev.horarios[child as keyof typeof prev.horarios],
              [subfield]: value
            }
          }
        }
        return newInfo
      })
    } else {
      setBusinessInfo(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  // Función para manejar selección múltiple de tallas
  const handleTallaToggle = (tipo: 'tallasCalzado' | 'tallasRopa', talla: string) => {
    setProductoData(prev => {
      const currentTallas = prev[tipo]
      const isSelected = currentTallas.includes(talla)
      
      if (isSelected) {
        // Remover talla si ya está seleccionada
        return {
          ...prev,
          [tipo]: currentTallas.filter(t => t !== talla)
        }
      } else {
        // Agregar talla si no está seleccionada
        return {
          ...prev,
          [tipo]: [...currentTallas, talla]
        }
      }
    })
  }

  // Función de autollenado para información del negocio
  const autollenarNegocio = () => {
    setBusinessInfo({
      nombre: 'Tienda Digital Premium',
      direccion: 'Av. Principal 1234, Centro Comercial Plaza Norte, Local 15',
      telefono: '+1 234 567 8900',
      whatsapp: '+1 234 567 8901',
      email: 'contacto@tiendadigital.com',
      responsable: 'María José García Martínez',
      horarios: {
        lunesViernes: { inicio: '09:00', fin: '19:00' },
        sabado: { inicio: '10:00', fin: '18:00' },
        domingo: { inicio: '11:00', fin: '16:00' }
      }
    })
  }

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
      tallasCalzado: ejemplo.tallas === 'No aplica' ? [] : ejemplo.categoria === 'ropa' && ejemplo.subcategoria === 'calzado' ? ejemplo.tallas.split(', ') : [],
      tallasRopa: ejemplo.tallas === 'No aplica' ? [] : ejemplo.categoria === 'ropa' && ejemplo.subcategoria !== 'calzado' ? ejemplo.tallas.split(', ') : [],
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
      tallasCalzado: ejemplo.tallas !== 'No aplica' && ejemplo.categoria === 'ropa' && ejemplo.subcategoria === 'calzado',
      tallasRopa: ejemplo.tallas !== 'No aplica' && ejemplo.categoria === 'ropa' && ejemplo.subcategoria !== 'calzado',
      genero: ejemplo.genero !== 'generico',
      medidas: ejemplo.medidas !== ''
    })
  }

  // Función para agregar un producto
  const agregarProducto = () => {
    if (!productoData.nombre || !imagenProducto) {
      alert('Por favor completa al menos el nombre del producto y carga una imagen')
      return
    }

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
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow w-44 h-64">
        {/* Parte superior con imagen - ocupa todo el espacio */}
        <div className="h-40 bg-white overflow-hidden">
          <img 
            src={producto.imagen} 
            alt={producto.nombre}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Parte inferior con información - ultra compacta */}
        <div className="p-1.5 pb-1">
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
            onClick={() => setSelectedProducto(producto)}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white py-0.5 px-1 rounded transition-colors text-[9px] font-medium mt-1"
          >
            +Información
          </button>
        </div>
      </div>
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
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-400">Ingresa los datos básicos del negocio</p>
              <Button 
                onClick={autollenarNegocio}
                className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 text-sm"
              >
                Auto Llenar Datos
              </Button>
            </div>
            
            {/* Formulario único */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="entidad-nombre" className="text-gray-300">Nombre del Negocio</Label>
                  <Input 
                    id="entidad-nombre" 
                    placeholder="Ingresa el nombre del negocio"
                    value={businessInfo.nombre}
                    onChange={(e) => handleBusinessInfoChange('nombre', e.target.value)}
                    className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                
                <div>
                  <Label htmlFor="entidad-direccion" className="text-gray-300">Dirección</Label>
                  <Input 
                    id="entidad-direccion" 
                    placeholder="Ingresa la dirección completa"
                    value={businessInfo.direccion}
                    onChange={(e) => handleBusinessInfoChange('direccion', e.target.value)}
                    className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                
                {/* Teléfono y WhatsApp en la misma fila */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="entidad-telefono" className="text-gray-300">Teléfono</Label>
                    <Input 
                      id="entidad-telefono" 
                      placeholder="Ingresa el número"
                      value={businessInfo.telefono}
                      onChange={(e) => handleBusinessInfoChange('telefono', e.target.value)}
                      className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="entidad-whatsapp" className="text-gray-300">WhatsApp</Label>
                    <Input 
                      id="entidad-whatsapp" 
                      placeholder="Ingresa el número"
                      value={businessInfo.whatsapp}
                      onChange={(e) => handleBusinessInfoChange('whatsapp', e.target.value)}
                      className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="entidad-email" className="text-gray-300">Email</Label>
                  <Input 
                    id="entidad-email" 
                    type="email"
                    placeholder="Ingresa el correo electrónico"
                    value={businessInfo.email}
                    onChange={(e) => handleBusinessInfoChange('email', e.target.value)}
                    className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="entidad-responsable" className="text-gray-300">Nombre del Responsable del Negocio</Label>
                  <Input 
                    id="entidad-responsable" 
                    placeholder="Ingresa el nombre del responsable del negocio"
                    value={businessInfo.responsable}
                    onChange={(e) => handleBusinessInfoChange('responsable', e.target.value)}
                    className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                
                {/* Sección de Horarios */}
                <div>
                  <Label className="text-gray-300 flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4" />
                    Horarios de Atención
                  </Label>
                  
                  <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 space-y-3">
                    {/* Lunes a Viernes */}
                    <div className="flex items-center gap-3">
                      <Label className="text-gray-400 text-sm w-32">Lunes a Viernes</Label>
                      <div className="flex items-center gap-2 flex-1">
                        <Input 
                          id="horario-lv-inicio"
                          type="time"
                          value={businessInfo.horarios.lunesViernes.inicio}
                          onChange={(e) => handleBusinessInfoChange('horarios.lunesViernes.inicio', e.target.value)}
                          className="bg-gray-600 border-gray-500 text-white placeholder-gray-400 w-24"
                        />
                        <span className="text-gray-400">a</span>
                        <Input 
                          id="horario-lv-fin"
                          type="time"
                          value={businessInfo.horarios.lunesViernes.fin}
                          onChange={(e) => handleBusinessInfoChange('horarios.lunesViernes.fin', e.target.value)}
                          className="bg-gray-600 border-gray-500 text-white placeholder-gray-400 w-24"
                        />
                      </div>
                    </div>
                    
                    {/* Sábado */}
                    <div className="flex items-center gap-3">
                      <Label className="text-gray-400 text-sm w-32">Sábado</Label>
                      <div className="flex items-center gap-2 flex-1">
                        <Input 
                          id="horario-sabado-inicio"
                          type="time"
                          value={businessInfo.horarios.sabado.inicio}
                          onChange={(e) => handleBusinessInfoChange('horarios.sabado.inicio', e.target.value)}
                          className="bg-gray-600 border-gray-500 text-white placeholder-gray-400 w-24"
                        />
                        <span className="text-gray-400">a</span>
                        <Input 
                          id="horario-sabado-fin"
                          type="time"
                          value={businessInfo.horarios.sabado.fin}
                          onChange={(e) => handleBusinessInfoChange('horarios.sabado.fin', e.target.value)}
                          className="bg-gray-600 border-gray-500 text-white placeholder-gray-400 w-24"
                        />
                      </div>
                    </div>
                    
                    {/* Domingo */}
                    <div className="flex items-center gap-3">
                      <Label className="text-gray-400 text-sm w-32">Domingo</Label>
                      <div className="flex items-center gap-2 flex-1">
                        <Input 
                          id="horario-domingo-inicio"
                          type="time"
                          value={businessInfo.horarios.domingo.inicio}
                          onChange={(e) => handleBusinessInfoChange('horarios.domingo.inicio', e.target.value)}
                          className="bg-gray-600 border-gray-500 text-white placeholder-gray-400 w-24"
                        />
                        <span className="text-gray-400">a</span>
                        <Input 
                          id="horario-domingo-fin"
                          type="time"
                          value={businessInfo.horarios.domingo.fin}
                          onChange={(e) => handleBusinessInfoChange('horarios.domingo.fin', e.target.value)}
                          className="bg-gray-600 border-gray-500 text-white placeholder-gray-400 w-24"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
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
              tallasCalzado: [],
              tallasRopa: [],
              genero: '',
              medidas: '',
              unidadMedida: 'cm',
              precioActual: '',
              precioAnterior: ''
            })
            setDescripcion('')
            setImagenProducto(null)
            setOpcionesProducto({
              tallasCalzado: false,
              tallasRopa: false,
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
                <div className="flex flex-wrap gap-3">
                  {/* Opción Género - PRIMERA */}
                  <div className="flex items-center space-x-1">
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
                        className={`flex items-center justify-center w-3.5 h-3.5 border-2 rounded-full cursor-pointer transition-colors ${
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
                          <div className="w-1 h-1 bg-white rounded-full"></div>
                        )}
                      </label>
                    </div>
                    <label htmlFor="opcion-genero" className="text-gray-300 cursor-pointer text-xs">
                      Género
                    </label>
                  </div>

                  {/* Opción Medidas - SEGUNDA */}
                  <div className="flex items-center space-x-1">
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
                        className={`flex items-center justify-center w-3.5 h-3.5 border-2 rounded-full cursor-pointer transition-colors ${
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
                          <div className="w-1 h-1 bg-white rounded-full"></div>
                        )}
                      </label>
                    </div>
                    <label htmlFor="opcion-medidas" className="text-gray-300 cursor-pointer text-xs">
                      Medidas
                    </label>
                  </div>

                  {/* Opción Talla de Calzado - TERCERA */}
                  <div className="flex items-center space-x-1">
                    <div className="relative">
                      <input
                        type="checkbox"
                        id="opcion-tallas-calzado"
                        className="sr-only"
                        checked={opcionesProducto.tallasCalzado}
                        onChange={() => toggleOpcion('tallasCalzado')}
                      />
                      <label 
                        htmlFor="opcion-tallas-calzado"
                        className={`flex items-center justify-center w-3.5 h-3.5 border-2 rounded-full cursor-pointer transition-colors ${
                          opcionesProducto.tallasCalzado 
                            ? 'bg-blue-500 border-blue-500' 
                            : 'border-gray-400 hover:border-gray-300'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          toggleOpcion('tallasCalzado');
                        }}
                      >
                        {opcionesProducto.tallasCalzado && (
                          <div className="w-1 h-1 bg-white rounded-full"></div>
                        )}
                      </label>
                    </div>
                    <label htmlFor="opcion-tallas-calzado" className="text-gray-300 cursor-pointer text-xs">
                      Talla Calzado
                    </label>
                  </div>

                  {/* Opción Talla de Ropa - CUARTA */}
                  <div className="flex items-center space-x-1">
                    <div className="relative">
                      <input
                        type="checkbox"
                        id="opcion-tallas-ropa"
                        className="sr-only"
                        checked={opcionesProducto.tallasRopa}
                        onChange={() => toggleOpcion('tallasRopa')}
                      />
                      <label 
                        htmlFor="opcion-tallas-ropa"
                        className={`flex items-center justify-center w-3.5 h-3.5 border-2 rounded-full cursor-pointer transition-colors ${
                          opcionesProducto.tallasRopa 
                            ? 'bg-blue-500 border-blue-500' 
                            : 'border-gray-400 hover:border-gray-300'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          toggleOpcion('tallasRopa');
                        }}
                      >
                        {opcionesProducto.tallasRopa && (
                          <div className="w-1 h-1 bg-white rounded-full"></div>
                        )}
                      </label>
                    </div>
                    <label htmlFor="opcion-tallas-ropa" className="text-gray-300 cursor-pointer text-xs">
                      Talla Ropa
                    </label>
                  </div>
                </div>

                {/* Campos dinámicos según opciones seleccionadas */}
                <div className="mt-6">
                  <div className="space-y-4">
                    {/* Campos de Género y Medidas - EN LA MISMA FILA */}
                    {(opcionesProducto.genero || opcionesProducto.medidas) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Campo de Género */}
                        {opcionesProducto.genero && (
                          <div>
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
                          <div>
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
                                <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-16">
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
                    )}

                    {/* Campo de Tallas de Calzado - TERCERO */}
                    {opcionesProducto.tallasCalzado && (
                      <div>
                        <Label className="text-gray-300 mb-2 block">
                          Tallas de Calzado (selecciona todas las que apliquen)
                        </Label>
                        <div className="grid grid-cols-12 gap-1 p-2 bg-gray-700 rounded-lg border border-gray-600">
                          {['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'].map((talla) => (
                            <button
                              key={talla}
                              type="button"
                              onClick={() => handleTallaToggle('tallasCalzado', talla)}
                              className={`px-1 py-0.5 text-xs rounded transition-colors text-center ${
                                productoData.tallasCalzado.includes(talla)
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                              }`}
                            >
                              {talla}
                            </button>
                          ))}
                        </div>
                        {productoData.tallasCalzado.length > 0 && (
                          <p className="text-xs text-gray-400 mt-1">
                            Seleccionadas: {productoData.tallasCalzado.join(', ')}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Campo de Tallas de Ropa - CUARTO */}
                    {opcionesProducto.tallasRopa && (
                      <div>
                        <Label className="text-gray-300 mb-2 block">
                          Tallas de Ropa (selecciona todas las que apliquen)
                        </Label>
                        <div className="grid grid-cols-8 gap-1 p-2 bg-gray-700 rounded-lg border border-gray-600">
                          {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'T.Única'].map((talla) => (
                            <button
                              key={talla}
                              type="button"
                              onClick={() => handleTallaToggle('tallasRopa', talla === 'T.Única' ? 'Talla Única' : talla)}
                              className={`px-1 py-0.5 text-xs rounded transition-colors text-center ${
                                productoData.tallasRopa.includes(talla === 'T.Única' ? 'Talla Única' : talla)
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                              }`}
                            >
                              {talla}
                            </button>
                          ))}
                        </div>
                        {productoData.tallasRopa.length > 0 && (
                          <p className="text-xs text-gray-400 mt-1">
                            Seleccionadas: {productoData.tallasRopa.join(', ')}
                          </p>
                        )}
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
          <TabsList className="grid grid-cols-6 w-full max-w-4xl mx-auto px-6 mb-8 bg-gray-800 border border-gray-700 rounded-lg p-1">
            <TabsTrigger 
              value="destacados" 
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
            >
              Destacados
            </TabsTrigger>
            <TabsTrigger 
              value="ofertas" 
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
            >
              Ofertas
            </TabsTrigger>
            <TabsTrigger 
              value="novedades" 
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
            >
              Novedades
            </TabsTrigger>
            <TabsTrigger 
              value="tendencias" 
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
            >
              Tendencias
            </TabsTrigger>
            <TabsTrigger 
              value="no-te-lo-pierdas" 
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
            >
              ¡No te lo Pierdas!
            </TabsTrigger>
            <TabsTrigger 
              value="liquidaciones" 
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
            >
              Liquidaciones
            </TabsTrigger>
          </TabsList>

          {/* Contenido de cada pestaña de productos */}
          <div className="px-6">
            {/* Tab Destacados */}
            <TabsContent value="destacados" className="space-y-4">
              <AdminProductCarousel
                titulo="Sección: Destacados"
                descripcion="Los productos más populares del momento"
                productos={productos.destacados}
                onAgregarProducto={() => openModal('destacados')}
                textoBotonAgregar="Añadir productos a la sección Destacados"
                ProductoCard={ProductoCard}
              />
            </TabsContent>

            {/* Tab Ofertas */}
            <TabsContent value="ofertas" className="space-y-4">
              <AdminProductCarousel
                titulo="Sección: Ofertas"
                descripcion="Descuentos exclusivos por tiempo limitado"
                productos={productos.ofertas}
                onAgregarProducto={() => openModal('ofertas')}
                textoBotonAgregar="Añadir productos con descuento a la sección Ofertas"
                ProductoCard={ProductoCard}
              />
            </TabsContent>

            {/* Tab Novedades */}
            <TabsContent value="novedades" className="space-y-4">
              <AdminProductCarousel
                titulo="Sección: Novedades"
                descripcion="Los últimos lanzamientos del mercado"
                productos={productos.novedades}
                onAgregarProducto={() => openModal('novedades')}
                textoBotonAgregar="Añadir productos nuevos a la sección Novedades"
                ProductoCard={ProductoCard}
              />
            </TabsContent>

            {/* Tab Tendencias */}
            <TabsContent value="tendencias" className="space-y-4">
              <AdminProductCarousel
                titulo="Sección: Tendencias"
                descripcion="Lo más buscado y deseado actualmente"
                productos={productos.tendencias}
                onAgregarProducto={() => openModal('tendencias')}
                textoBotonAgregar="Añadir productos populares a la sección Tendencias"
                ProductoCard={ProductoCard}
              />
            </TabsContent>

            {/* Tab ¡No te lo Pierdas! */}
            <TabsContent value="no-te-lo-pierdas" className="space-y-4">
              <AdminProductCarousel
                titulo="Sección: ¡No te lo Pierdas!"
                descripcion="Oportunidades únicas que no puedes dejar pasar"
                productos={productos['no-te-lo-pierdas']}
                onAgregarProducto={() => openModal('no-te-lo-pierdas')}
                textoBotonAgregar="Añadir productos especiales a la sección ¡No te lo Pierdas!"
                ProductoCard={ProductoCard}
              />
            </TabsContent>

            {/* Tab Liquidaciones */}
            <TabsContent value="liquidaciones" className="space-y-4">
              <AdminProductCarousel
                titulo="Sección: Liquidaciones"
                descripcion="Precios increíbles en productos seleccionados"
                productos={productos.liquidaciones}
                onAgregarProducto={() => openModal('liquidaciones')}
                textoBotonAgregar="Añadir productos en liquidación a la sección Liquidaciones"
                ProductoCard={ProductoCard}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Separador entre secciones */}
      <div className="border-t border-gray-700 my-8"></div>

      {/* Sección: Analytics Dashboard */}
      <div className="px-6 py-8">
        <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
        <p className="text-gray-400">Estadísticas y métricas del rendimiento</p>
      </div>

      {/* Container Analytics */}
      <div className="px-6 mb-8 relative">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 blur-[2px]">
          {/* Fila Superior - 3 Columnas */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {/* Columna 1 - 4 KPIs en 2 filas */}
            <div className="space-y-4">
              {/* Primera fila de KPIs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Visualizaciones Hoy</h3>
                  <p className="text-2xl font-bold text-white">1.2K</p>
                  <p className="text-xs text-green-400">+15% vs ayer</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Visitantes</h3>
                  <p className="text-2xl font-bold text-white">850</p>
                  <p className="text-xs text-blue-400">+8% vs ayer</p>
                </div>
              </div>
              
              {/* Segunda fila de KPIs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Interacciones</h3>
                  <p className="text-2xl font-bold text-white">156</p>
                  <p className="text-xs text-green-400">+12% vs ayer</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Consultas</h3>
                  <p className="text-2xl font-bold text-white">43</p>
                  <p className="text-xs text-green-400">+5% vs ayer</p>
                </div>
              </div>
            </div>

            {/* Columna 2 - KPI con Gráfico de Barras Verticales */}
            <div className="bg-gray-700 rounded-lg p-4 flex flex-col">
              <h3 className="text-sm font-medium text-white mb-2">Visualizaciones del Mes</h3>
              
              {/* Container del gráfico que ocupa todo el espacio disponible */}
              <div className="flex-1 flex flex-col justify-end">
                <div className="flex items-end justify-center space-x-2 h-32">
                  {/* Barra Semana 1 */}
                  <div className="flex flex-col items-center h-full justify-end">
                    <div className="bg-blue-500 w-16 rounded-t-sm flex items-end justify-center pb-1" style={{height: '60%'}}>
                      <span className="text-white text-xs font-semibold">230</span>
                    </div>
                    <span className="text-xs text-gray-300 mt-2">S1</span>
                  </div>
                  
                  {/* Barra Semana 2 */}
                  <div className="flex flex-col items-center h-full justify-end">
                    <div className="bg-green-500 w-16 rounded-t-sm flex items-end justify-center pb-1" style={{height: '80%'}}>
                      <span className="text-white text-xs font-semibold">310</span>
                    </div>
                    <span className="text-xs text-gray-300 mt-2">S2</span>
                  </div>
                  
                  {/* Barra Semana 3 */}
                  <div className="flex flex-col items-center h-full justify-end">
                    <div className="bg-purple-500 w-16 rounded-t-sm flex items-end justify-center pb-1" style={{height: '100%'}}>
                      <span className="text-white text-xs font-semibold">380</span>
                    </div>
                    <span className="text-xs text-gray-300 mt-2">S3</span>
                  </div>
                  
                  {/* Barra Semana 4 */}
                  <div className="flex flex-col items-center h-full justify-end">
                    <div className="bg-orange-500 w-16 rounded-t-sm flex items-end justify-center pb-1" style={{height: '70%'}}>
                      <span className="text-white text-xs font-semibold">280</span>
                    </div>
                    <span className="text-xs text-gray-300 mt-2">S4</span>
                  </div>
                </div>
                
                {/* Información en la parte inferior */}
                <div className="text-center mt-3">
                  <span className="text-xs text-green-400">+22% vs mes anterior</span>
                </div>
              </div>
            </div>

            {/* Columna 3 - 4 KPIs en 2 filas (datos distintos) */}
            <div className="space-y-4">
              {/* Primera fila de KPIs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Productos Mostrados</h3>
                  <p className="text-2xl font-bold text-white">{Object.values(productos).flat().length}</p>
                  <p className="text-xs text-blue-400">de 7 máximo</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Negocios Registrados</h3>
                  <p className="text-2xl font-bold text-white">28</p>
                  <p className="text-xs text-green-400">+3 esta semana</p>
                </div>
              </div>
              
              {/* Segunda fila de KPIs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Tiempo Promedio</h3>
                  <p className="text-2xl font-bold text-white">2.5m</p>
                  <p className="text-xs text-yellow-400">en vitrina</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Alcance</h3>
                  <p className="text-2xl font-bold text-white">68%</p>
                  <p className="text-xs text-green-400">+5% vs ayer</p>
                </div>
              </div>
            </div>
          </div>

          {/* Fila Inferior - 3 Columnas */}
          <div className="grid grid-cols-3 gap-6">
            {/* Columna 1 - 3 KPIs de Pestañas (primeras 3) */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-700 border border-gray-600 rounded-lg p-3 text-center flex flex-col justify-center">
                <h3 className="text-xs font-medium text-gray-300 mb-2">Destacados</h3>
                <p className="text-2xl font-bold text-white">{productos.destacados.length}</p>
              </div>
              <div className="bg-gray-700 border border-gray-600 rounded-lg p-3 text-center flex flex-col justify-center">
                <h3 className="text-xs font-medium text-gray-300 mb-2">Ofertas</h3>
                <p className="text-2xl font-bold text-white">{productos.ofertas.length}</p>
              </div>
              <div className="bg-gray-700 border border-gray-600 rounded-lg p-3 text-center flex flex-col justify-center">
                <h3 className="text-xs font-medium text-gray-300 mb-2">Novedades</h3>
                <p className="text-2xl font-bold text-white">{productos.novedades.length}</p>
              </div>
            </div>

            {/* Columna 2 - 3 KPIs de Pestañas (siguientes 3) */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-700 border border-gray-600 rounded-lg p-3 text-center flex flex-col justify-center">
                <h3 className="text-xs font-medium text-gray-300 mb-2">Tendencias</h3>
                <p className="text-2xl font-bold text-white">{productos.tendencias.length}</p>
              </div>
              <div className="bg-gray-700 border border-gray-600 rounded-lg p-3 text-center flex flex-col justify-center">
                <h3 className="text-xs font-medium text-gray-300 mb-2">No te lo Pierdas</h3>
                <p className="text-2xl font-bold text-white">{productos['no-te-lo-pierdas'].length}</p>
              </div>
              <div className="bg-gray-700 border border-gray-600 rounded-lg p-3 text-center flex flex-col justify-center">
                <h3 className="text-xs font-medium text-gray-300 mb-2">Liquidaciones</h3>
                <p className="text-2xl font-bold text-white">{productos.liquidaciones.length}</p>
              </div>
            </div>

            {/* Columna 3 - KPI Ancho Total de Productos */}
            <div className="bg-gray-700 rounded-lg p-3">
              <h3 className="text-sm font-medium text-white mb-2">Total de Productos</h3>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-300">Progreso</span>
                  <span className="text-gray-300">{Object.values(productos).flat().length} / 7</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-300" 
                    style={{width: `${Math.min((Object.values(productos).flat().length / 7) * 100, 100)}%`}}
                  ></div>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {Math.round((Object.values(productos).flat().length / 7) * 100)}% completado
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Overlay Message */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="bg-white border-2 border-gray-400 rounded-lg px-4 py-4 shadow-lg text-center max-w-xs">
            <h3 className="text-lg font-bold text-gray-800 mb-2">¡Próximamente!</h3>
            <p className="text-sm text-gray-600">Panel de análisis avanzado para monitorear el rendimiento y visualización de tus productos en tiempo real.</p>
          </div>
        </div>
      </div>

      {/* Popup de Información del Producto */}
      <Dialog open={selectedProducto !== null} onOpenChange={(open) => !open && setSelectedProducto(null)}>
        <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700 text-white">
          {/* Botón cerrar */}
          <button
            onClick={() => setSelectedProducto(null)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-10"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-white" />
            <span className="sr-only">Cerrar</span>
          </button>

          {selectedProducto && (
            <div className="grid grid-cols-2 gap-6 p-6">
              {/* Columna Izquierda - Imagen y Info del Negocio (50%) */}
              <div className="col-span-1 space-y-4">
                {/* Imagen del Producto */}
                <div className="aspect-square bg-white rounded-lg overflow-hidden">
                  <img
                    src={selectedProducto.imagen}
                    alt={selectedProducto.nombre}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Información del Negocio - SIN TÍTULO */}
                <div className="bg-gray-700 rounded-lg p-4 space-y-3">
                  {/* Iconos de Contacto Clickeables en una sola línea */}
                  {(businessInfo.telefono || businessInfo.whatsapp || businessInfo.email || businessInfo.direccion) && (
                    <div className="flex gap-3 justify-center">
                      {/* Icono de Teléfono Clickeable */}
                      {businessInfo.telefono && (
                        <a 
                          href={`tel:${businessInfo.telefono}`}
                          className="flex items-center justify-center w-8 h-8 bg-blue-600 hover:bg-blue-500 rounded-full transition-colors cursor-pointer"
                          title={`Llamar a ${businessInfo.telefono}`}
                        >
                          <Phone className="w-4 h-4 text-white" />
                        </a>
                      )}
                      
                      {/* Icono de WhatsApp Clickeable */}
                      {businessInfo.whatsapp && (
                        <a 
                          href={`https://wa.me/${businessInfo.whatsapp.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-8 h-8 bg-green-600 hover:bg-green-500 rounded-full transition-colors cursor-pointer"
                          title={`Enviar WhatsApp a ${businessInfo.whatsapp}`}
                        >
                          <MessageCircle className="w-4 h-4 text-white" />
                        </a>
                      )}
                      
                      {/* Icono de Email Clickeable */}
                      {businessInfo.email && (
                        <a 
                          href={`mailto:${businessInfo.email}`}
                          className="flex items-center justify-center w-8 h-8 bg-purple-600 hover:bg-purple-500 rounded-full transition-colors cursor-pointer"
                          title={`Enviar email a ${businessInfo.email}`}
                        >
                          <Mail className="w-4 h-4 text-white" />
                        </a>
                      )}
                      
                      {/* Icono de Ubicación Clickeable */}
                      {businessInfo.direccion && (
                        <a 
                          href={`https://www.mapcity.com/search?q=${encodeURIComponent(businessInfo.direccion)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-8 h-8 bg-red-600 hover:bg-red-500 rounded-full transition-colors cursor-pointer"
                          title={`Ver ubicación: ${businessInfo.direccion}`}
                        >
                          <MapPin className="w-4 h-4 text-white" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Columna Derecha - Información (50%) */}
              <div className="col-span-1 space-y-2">
                {/* Nombre del Negocio - ARRIBA DEL PRODUCTO CON SUBRAYADO */}
                {businessInfo.nombre && (
                  <h3 className="text-sm font-medium text-gray-300 underline decoration-gray-500">
                    {businessInfo.nombre}
                  </h3>
                )}

                {/* Título del producto */}
                <h2 className="text-lg font-bold text-white leading-tight mb-1">
                  {selectedProducto.nombre}
                </h2>

                {/* Categoría y Subcategoría - más pequeño y más cerca */}
                <div className="flex items-center gap-2 text-[10px] text-gray-400 mb-2">
                  <span>{getCategoriaLabel(selectedProducto.categoria)}</span>
                  <span>/</span>
                  <span>{getSubcategoriaLabel(selectedProducto.subcategoria)}</span>
                </div>

                {/* Descripción - más pequeña y líneas más juntas */}
                <div className="mb-2">
                  <p className="text-gray-300 text-xs leading-snug text-justify">
                    {selectedProducto.descripcion || 'Sin descripción disponible.'}
                  </p>
                </div>

                {/* Precios - más pequeños */}
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-base font-bold text-purple-400">
                    ${selectedProducto.precioActual}
                  </span>
                  {selectedProducto.precioAnterior && (
                    <span className="text-xs text-gray-400 line-through">
                      ${selectedProducto.precioAnterior}
                    </span>
                  )}
                </div>

                {/* Información adicional del producto - sin título y más pequeña */}
                <div className="space-y-2 pt-2 border-t border-gray-700">
                  <div className="space-y-1 text-xs">
                    {/* Tallas de Calzado */}
                    {selectedProducto.tallasCalzado && selectedProducto.tallasCalzado.length > 0 && (
                      <div className="flex items-start gap-2">
                        <span className="text-gray-400 min-w-[80px]">Tallas Calzado:</span>
                        <span className="text-gray-300 text-[10px]">{selectedProducto.tallasCalzado.join(', ')}</span>
                      </div>
                    )}
                    
                    {/* Tallas de Ropa */}
                    {selectedProducto.tallasRopa && selectedProducto.tallasRopa.length > 0 && (
                      <div className="flex items-start gap-2">
                        <span className="text-gray-400 min-w-[80px]">Tallas Ropa:</span>
                        <span className="text-gray-300 text-[10px]">{selectedProducto.tallasRopa.join(', ')}</span>
                      </div>
                    )}
                    
                    {/* Género */}
                    {selectedProducto.genero && selectedProducto.genero !== 'generico' && (
                      <div className="flex items-start gap-2">
                        <span className="text-gray-400 min-w-[60px]">Género:</span>
                        <span className="text-gray-300 capitalize">{selectedProducto.genero}</span>
                      </div>
                    )}
                    
                    {/* Medidas */}
                    {selectedProducto.medidas && (
                      <div className="flex items-start gap-2">
                        <span className="text-gray-400 min-w-[60px]">Medidas:</span>
                        <span className="text-gray-300">
                          {selectedProducto.medidas} {selectedProducto.unidadMedida || 'cm'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Horarios de Atención - Movidos a la columna derecha */}
                {(businessInfo.horarios.lunesViernes.inicio || businessInfo.horarios.sabado.inicio || businessInfo.horarios.domingo.inicio) && (
                  <div className="mt-3">
                    <h5 className="text-xs font-medium text-gray-400 mb-2">Horarios:</h5>
                    <div className="flex gap-6 text-xs">
                      {businessInfo.horarios.lunesViernes.inicio && businessInfo.horarios.lunesViernes.fin && (
                        <div className="text-center">
                          <div className="text-gray-300 font-medium text-[10px] mb-1">L-V</div>
                          <div className="flex gap-1 text-gray-400 text-[9px]">
                            <span>{businessInfo.horarios.lunesViernes.inicio}</span>
                            <span>{businessInfo.horarios.lunesViernes.fin}</span>
                          </div>
                        </div>
                      )}
                      {businessInfo.horarios.sabado.inicio && businessInfo.horarios.sabado.fin && (
                        <div className="text-center">
                          <div className="text-gray-300 font-medium text-[10px] mb-1">S</div>
                          <div className="flex gap-1 text-gray-400 text-[9px]">
                            <span>{businessInfo.horarios.sabado.inicio}</span>
                            <span>{businessInfo.horarios.sabado.fin}</span>
                          </div>
                        </div>
                      )}
                      {businessInfo.horarios.domingo.inicio && businessInfo.horarios.domingo.fin && (
                        <div className="text-center">
                          <div className="text-gray-300 font-medium text-[10px] mb-1">D</div>
                          <div className="flex gap-1 text-gray-400 text-[9px]">
                            <span>{businessInfo.horarios.domingo.inicio}</span>
                            <span>{businessInfo.horarios.domingo.fin}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer */}
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

              {/* Columna 2 - Avisos Legales (intercambiado con Contacto) */}
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

              {/* Columna 4 - Contacto (intercambiado con Avisos Legales) */}
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
    </div>
  )
}