"use client"

import { useState, useEffect, useRef } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { VisuallyHidden } from '@/components/ui/visually-hidden'
import {
  Clock,
  Calendar,
  Mail,
  Phone,
  MessageCircle,
  Users,
  Store,
  HelpCircle,
  Shield,
  Cookie,
  FileText,
  MapPin,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  BarChart3,
  Image,
  ShoppingBag,
  ArrowLeft,
  Plus,
  X,
  Eye
} from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AdminProductCarousel } from '@/components/admin/admin-product-carousel'
import { CarouselProductForm } from '@/components/admin/carousel-product-form'
import { ProductoCarrusel } from '@/types/product'
import { PrivacyPolicyPopup } from '@/components/privacy-policy-popup'
import { CookiesPolicyPopup } from '@/components/cookies-policy-popup'
import { SecurityPolicyPopup } from '@/components/security-policy-popup'
import { TermsConditionsPopup } from '@/components/terms-conditions-popup'
import { AboutUsPopup } from '@/components/about-us-popup'
import { FaqPopup } from '@/components/faq-popup'



export default function AdminPage() {
  // Estilos para la distorsión del banner - PREMIUM FEATURE (commented for now, will be used later)
  /* const bannerDistortionStyle = `
    .banner-distortion {
      filter: blur(3px) grayscale(70%);
      opacity: 0.5;
      pointer-events: none;
      transition: all 0.3s ease;
    }

    .banner-distortion:hover {
      filter: blur(2px) grayscale(50%);
      opacity: 0.7;
    }
  `; */

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSection, setSelectedSection] = useState('')
  const [activeContainer, setActiveContainer] = useState<string | null>(null)
  const [opcionesProducto, setOpcionesProducto] = useState({
    tallasCalzado: false,
    tallasRopa: false,
    genero: false,
    medidas: false
  })
  const [descripcion, setDescripcion] = useState('')
  const [showStoreTooltip, setShowStoreTooltip] = useState(false)

  // Estados para los campos del formulario
  const [productoData, setProductoData] = useState({
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
  const [productos, setProductos] = useState<Record<string, ProductoCarrusel[]>>({
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
  const [selectedProducto, setSelectedProducto] = useState<ProductoCarrusel | null>(null)

  // Estado para el producto en edición
  const [editingProducto, setEditingProducto] = useState<ProductoCarrusel | null>(null)

  // Estado para el modal de confirmación de eliminación
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [productToDelete, setProductToDelete] = useState<{ producto: ProductoCarrusel, section: string } | null>(null)

  // Estado para el popup de ayuda
  const [showHelpPopup, setShowHelpPopup] = useState(false)
  const [helpContent, setHelpContent] = useState<{ title: string, content: string } | null>(null)

  // Estados para el acordeón del footer móvil
  const [openFooterSection, setOpenFooterSection] = useState<string | null>(null)
  const footerRef = useRef<HTMLDivElement>(null)

  // Estados para los pop-ups de políticas
  const [showPrivacyPopup, setShowPrivacyPopup] = useState(false)
  const [showCookiesPopup, setShowCookiesPopup] = useState(false)
  const [showSecurityPopup, setShowSecurityPopup] = useState(false)
  const [showTermsPopup, setShowTermsPopup] = useState(false)
  const [showAboutUsPopup, setShowAboutUsPopup] = useState(false)
  const [showFaqPopup, setShowFaqPopup] = useState(false)

  // Contenido de ayuda para cada sección
  const helpContentData = {
    'datos-negocio': {
      title: 'Datos del Negocio',
      content: 'En esta sección puedes ingresar toda la información básica de tu negocio que aparecerá en tu página del marketplace. Incluye el nombre de tu negocio, dirección física, teléfonos de contacto, email y horarios de atención. Esta información ayuda a tus clientes a encontrarte y contactarte fácilmente. Todos estos datos son importantes para generar confianza y credibilidad en tu negocio.'
    },
    'gestion-productos': {
      title: 'Gestión de Productos',
      content: 'Aquí puedes organizar y administrar todos los productos de tu negocio en diferentes categorías como Destacados, Ofertas, Novedades, Tendencias, ¡No te lo Pierdas! y Liquidaciones. Cada categoría tiene un propósito específico para mostrar tus productos de manera estratégica. Puedes agregar, editar y eliminar productos, subir imágenes, establecer precios y escribir descripciones detalladas para atraer a tus clientes.'
    },
    'analytics': {
      title: 'Analytics Dashboard',
      content: 'Esta sección te proporcionará estadísticas detalladas sobre el rendimiento de tu negocio en el marketplace. Podrás ver cuántas personas han visto tus productos, cuántas interacciones has recibido, consultas de clientes y el progreso de tu catálogo de productos. Estas métricas te ayudarán a entender qué productos son más populares y cómo mejorar tu presencia en la plataforma.'
    },

    'carruseles': {
      title: 'Gestión de Carruseles',
      content: 'Los carruseles son galerías de imágenes que se muestran de forma rotatoria en tu página del marketplace. Tienes 2 carruseles disponibles: el Carrusel 1 (posiciones 1-8) y el Carrusel 2 (posiciones 9-16). Cada carrusel puede contener hasta 8 imágenes de productos con sus respectivos precios. Estas imágenes ayudan a mostrar la variedad de tu catálogo y atraer la atención visual de los clientes potenciales.'
    },
    'gestion-banner': {
      title: 'Gestión de Banner',
      content: 'Los banners publicitarios te permiten destacar productos especiales o promociones en la página principal de tu negocio. Puedes configurar hasta 2 banners con imágenes atractivas y precios especiales. Estos banners aparecen de forma prominente para captar la atención de los visitantes y dirigir el tráfico hacia tus productos más importantes o ofertas especiales.'
    }
  }

  // Función para abrir popup de ayuda
  const openHelpPopup = (sectionKey: keyof typeof helpContentData) => {
    setHelpContent(helpContentData[sectionKey])
    setShowHelpPopup(true)
  }

  // Función para cerrar popup de ayuda
  const closeHelpPopup = () => {
    setShowHelpPopup(false)
    setHelpContent(null)
  }

  // Función para alternar secciones del footer
  const toggleFooterSection = (section: string) => {
    setOpenFooterSection(openFooterSection === section ? null : section)
  }

  // useEffect para cerrar el acordeón al hacer clic fuera del footer
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (footerRef.current && !footerRef.current.contains(event.target as Node)) {
        setOpenFooterSection(null)
      }
    }

    if (openFooterSection) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openFooterSection])

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

  // Estado para las imágenes de los carruseles
  const [carouselImages, setCarouselImages] = useState({
    carrusel1: Array(8).fill(null), // 8 espacios para el carrusel 1 (índices 1-8)
    carrusel2: Array(8).fill(null)  // 8 espacios para el carrusel 2 (índices 9-16)
  })

  // Estado para los precios de las imágenes de los carruseles
  const [carouselPrices, setCarouselPrices] = useState({
    carrusel1: Array(8).fill(''), // 8 precios para el carrusel 1
    carrusel2: Array(8).fill('')  // 8 precios para el carrusel 2
  })

  // Estado para el enfoque de los inputs de precio
  const [priceFocus, setPriceFocus] = useState({
    carrusel1: Array(8).fill(false), // 8 estados de enfoque para el carrusel 1
    carrusel2: Array(8).fill(false)  // 8 estados de enfoque para el carrusel 2
  })

  // Estado para los datos de productos del carrusel
  const [carouselProductData, setCarouselProductData] = useState({
    carrusel1: Array(8).fill(null), // 8 productos para el carrusel 1
    carrusel2: Array(8).fill(null)  // 8 productos para el carrusel 2
  })

  // Estado para rastrear la tarjeta de carrusel actual
  const [currentCarouselCard, setCurrentCarouselCard] = useState<{
    carruselType: 'carrusel1' | 'carrusel2',
    index: number
  } | null>(null)

  // Estado para los títulos de los carruseles
  const [carouselTitles, setCarouselTitles] = useState({
    carrusel1: '',
    carrusel2: ''
  })

  // Estado para las URLs de imagen de los carruseles
  const [carouselImageUrls, setCarouselImageUrls] = useState({
    carrusel1: '',
    carrusel2: ''
  })

  // Estado para los enlaces de los carruseles
  const [carouselLinks, setCarouselLinks] = useState({
    carrusel1: '',
    carrusel2: ''
  })
  // Estado para las imágenes de los banners
  const [bannerImages, setBannerImages] = useState<(string | null)[]>([
    null, // Banner 1
    null  // Banner 2
  ])

  // Estado para los precios de los banners
  const [bannerPrices, setBannerPrices] = useState({
    banner1: { current: '', previous: '' },
    banner2: { current: '', previous: '' }
  })





  const openModal = (section?: string, carouselInfo?: { carruselType: 'carrusel1' | 'carrusel2', index: number }) => {
    if (carouselInfo) {
      // Modo carrusel
      setCurrentCarouselCard(carouselInfo)
      setSelectedSection('carrusel') // Sección especial para carruseles
    } else if (section) {
      // Modo normal (secciones de productos)
      setSelectedSection(section)
      setCurrentCarouselCard(null)
    }
    setEditingProducto(null)
    // Limpiar todos los campos al abrir el modal
    setProductoData({
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

  // Función para abrir modal en modo edición
  const openEditModal = (producto: ProductoCarrusel, section: string) => {
    setSelectedSection(section)
    setEditingProducto(producto)

    // Pre-llenar todos los campos con los datos existentes
    setProductoData({
      categoria: producto.categoria || '',
      subcategoria: producto.subcategoria || '',
      nombre: producto.nombre || '',
      tallasCalzado: producto.tallasCalzado || [],
      tallasRopa: producto.tallasRopa || [],
      genero: producto.genero || '',
      medidas: producto.medidas || '',
      unidadMedida: producto.unidadMedida || 'cm',
      precioActual: producto.precioActual?.toString() || '0',
      precioAnterior: producto.precioAnterior?.toString() || ''
    })

    setDescripcion(producto.descripcion || '')
    setImagenProducto(producto.imagen || null)

    // Activar opciones según los datos existentes
    setOpcionesProducto({
      tallasCalzado: Boolean(producto.tallasCalzado && producto.tallasCalzado.length > 0),
      tallasRopa: Boolean(producto.tallasRopa && producto.tallasRopa.length > 0),
      genero: Boolean(producto.genero && producto.genero !== 'generico'),
      medidas: Boolean(producto.medidas)
    })

    // Pre-cargar imagen en el contenedor
    if (producto.imagen) {
      setTimeout(() => {
        const container = document.getElementById('imagen-container')
        if (container) {
          container.innerHTML = `
            <img src="${producto.imagen}" alt="Producto" class="w-full h-full object-contain" />
          `
        }
      }, 100)
    }

    setIsModalOpen(true)
  }

  // Función para abrir confirmación de eliminación
  const abrirConfirmacionEliminar = (producto: ProductoCarrusel, section: string) => {
    setProductToDelete({ producto, section })
    setShowDeleteConfirm(true)
  }

  // Función para confirmar eliminación
  const confirmarEliminacion = () => {
    if (productToDelete) {
      setProductos(prev => ({
        ...prev,
        [productToDelete.section]: prev[productToDelete.section as keyof typeof prev].filter((p: ProductoCarrusel) => p.id !== productToDelete.producto.id)
      }))
    }
    setShowDeleteConfirm(false)
    setProductToDelete(null)
  }

  // Función para cancelar eliminación
  const cancelarEliminacion = () => {
    setShowDeleteConfirm(false)
    setProductToDelete(null)
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

  // Función para manejar la carga de imágenes de banners
  const handleBannerImageUpload = (bannerIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setBannerImages(prev => {
            const newImages = [...prev]
            newImages[bannerIndex] = event.target?.result as string
            return newImages
          })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // Función para eliminar una imagen de banner
  const handleDeleteBanner = (bannerIndex: number) => {
    setBannerImages(prev => {
      const newImages = [...prev]
      newImages[bannerIndex] = null
      return newImages
    })

    // Reset prices
    if (bannerIndex === 0) {
      setBannerPrices(prev => ({
        ...prev,
        banner1: { current: '', previous: '' }
      }))
    } else {
      setBannerPrices(prev => ({
        ...prev,
        banner2: { current: '', previous: '' }
      }))
    }
  }

  // Función para guardar los datos del banner (simulación)
  const handleSaveBanner = (bannerIndex: number) => {
    // En una implementación real, aquí se enviarían los datos al servidor
    console.log(`Banner ${bannerIndex + 1} guardado:`, {
      image: bannerImages[bannerIndex],
      prices: bannerIndex === 0 ? bannerPrices.banner1 : bannerPrices.banner2
    })

    // Mostrar mensaje de éxito (en una implementación real)
    alert(`Banner ${bannerIndex + 1} guardado exitosamente`)
  }

  // Función para manejar la carga de imágenes del carrusel
  const handleCarouselImageUpload = (carruselType: 'carrusel1' | 'carrusel2', index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        setCarouselImages(prev => ({
          ...prev,
          [carruselType]: prev[carruselType].map((img, idx) => idx === index ? imageUrl : img)
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  // Función para manejar cambios de precio del carrusel
  const handleCarouselPriceChange = (carruselType: 'carrusel1' | 'carrusel2', index: number, price: string) => {
    setCarouselPrices(prev => ({
      ...prev,
      [carruselType]: prev[carruselType].map((p, idx) => idx === index ? price : p)
    }))
  }

  // Función para manejar el enfoque del input de precio
  const handlePriceFocus = (carruselType: 'carrusel1' | 'carrusel2', index: number) => {
    setPriceFocus(prev => ({
      ...prev,
      [carruselType]: prev[carruselType].map((f, idx) => idx === index ? true : f)
    }))
  }

  // Función para manejar la pérdida de enfoque del input de precio
  const handlePriceBlur = (carruselType: 'carrusel1' | 'carrusel2', index: number) => {
    setPriceFocus(prev => ({
      ...prev,
      [carruselType]: prev[carruselType].map((f, idx) => idx === index ? false : f)
    }))
  }





  // Función para guardar cambios del carrusel
  const handleSaveCarousel = (carruselType: 'carrusel1' | 'carrusel2') => {
    console.log(`Guardando cambios para ${carruselType}:`)
    console.log('Imágenes:', carouselImages[carruselType])
    console.log('Precios:', carouselPrices[carruselType])
    // Aquí iría la lógica para guardar en la base de datos
    alert(`Cambios guardados para ${carruselType === 'carrusel1' ? 'Carrusel 1' : 'Carrusel 2'}`)
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

  // Función para agregar o editar un producto
  const agregarProducto = () => {
    if (!imagenProducto) {
      alert('Por favor carga una imagen para el producto')
      return
    }
    if (!productoData.nombre) {
      alert('Por favor completa el nombre del producto')
      return
    }

    // Si estamos en modo carrusel
    if (currentCarouselCard) {
      const { carruselType, index } = currentCarouselCard

      const productoData_carousel = {
        categoria: productoData.categoria,
        subcategoria: productoData.subcategoria,
        nombre: productoData.nombre,
        precioActual: Number.parseFloat(productoData.precioActual) || 0,
        precioAnterior: productoData.precioAnterior ? Number.parseFloat(productoData.precioAnterior) : undefined,
        imagen: imagenProducto!
      }

      console.log('📦 Guardando producto al carrusel:', {
        carruselType,
        index,
        productoData_carousel
      })

      // Guardar imagen en carouselImages
      setCarouselImages(prev => ({
        ...prev,
        [carruselType]: prev[carruselType].map((img, idx) =>
          idx === index ? imagenProducto : img
        )
      }))

      // Guardar datos del producto en carouselProductData
      setCarouselProductData(prev => {
        const newData = {
          ...prev,
          [carruselType]: prev[carruselType].map((data, idx) =>
            idx === index ? productoData_carousel : data
          )
        }
        console.log('✅ Nuevo estado de carouselProductData:', newData)
        return newData
      })

      setCurrentCarouselCard(null)
      setIsModalOpen(false)
      setImagenProducto(null)
      return
    }

    // Modo normal (productos en secciones)
    if (editingProducto) {
      // Modo edición: actualizar producto existente
      const productoActualizado: ProductoCarrusel = {
        id: editingProducto.id,
        categoria: productoData.categoria,
        subcategoria: productoData.subcategoria,
        nombre: productoData.nombre,
        tallasCalzado: productoData.tallasCalzado,
        tallasRopa: productoData.tallasRopa,
        genero: productoData.genero,
        medidas: productoData.medidas,
        unidadMedida: productoData.unidadMedida,
        precioActual: Number.parseFloat(productoData.precioActual) || 0,
        precioAnterior: productoData.precioAnterior ? Number.parseFloat(productoData.precioAnterior) : undefined,
        descripcion,
        imagen: imagenProducto!
      }

      setProductos(prev => ({
        ...prev,
        [selectedSection]: prev[selectedSection as keyof typeof prev].map((p: any) =>
          p.id === editingProducto.id ? productoActualizado : p
        )
      }))
    } else {
      // Modo agregar: crear nuevo producto
      const nuevoProducto: ProductoCarrusel = {
        id: Date.now(), // ID único basado en timestamp
        categoria: productoData.categoria,
        subcategoria: productoData.subcategoria,
        nombre: productoData.nombre,
        tallasCalzado: productoData.tallasCalzado,
        tallasRopa: productoData.tallasRopa,
        genero: productoData.genero,
        medidas: productoData.medidas,
        unidadMedida: productoData.unidadMedida,
        precioActual: Number.parseFloat(productoData.precioActual) || 0,
        precioAnterior: productoData.precioAnterior ? Number.parseFloat(productoData.precioAnterior) : undefined,
        descripcion,
        imagen: imagenProducto!
      }

      setProductos(prev => ({
        ...prev,
        [selectedSection]: [...prev[selectedSection as keyof typeof prev], nuevoProducto]
      }))
    }

    // Cerrar el modal y limpiar campos
    setIsModalOpen(false)
    setImagenProducto(null)
    setEditingProducto(null)
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
  const ProductoCard = ({ producto, section }: { producto: any, section?: string }) => {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow md:w-44 w-28 md:h-auto h-auto">
        {/* Parte superior con imagen - ocupa todo el espacio */}
        <div className="md:h-40 h-24 bg-white overflow-hidden">
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="w-full h-full object-contain bg-gray-100"
          />
        </div>

        {/* Parte inferior con información - ultra compacta */}
        <div className="md:p-1.5 md:pb-1 p-1 pb-0.5">
          {/* Fila con categoría y subcategoría centradas */}
          <div className="flex items-center justify-center md:text-[10px] text-[8px] text-gray-400 md:mb-0.5 mb-0">
            <span className="text-center truncate max-w-[35%]">{getCategoriaLabel(producto.categoria)}</span>
            <span className="mx-0.5">/</span>
            <span className="text-center truncate max-w-[35%]">{getSubcategoriaLabel(producto.subcategoria)}</span>
          </div>

          {/* Nombre del producto */}
          <div className="md:mb-1 mb-0.5">
            <h3 className="md:text-[10px] text-[8px] font-semibold text-gray-100 leading-tight line-clamp-2 text-center">
              {producto.nombre}
            </h3>
          </div>

          {/* Fila con precios */}
          <div className="flex items-center justify-between md:mb-1 mb-0.5">
            {/* Precio actual */}
            <div className="text-purple-400 font-bold md:text-xs text-[9px]">
              ${producto.precioActual}
            </div>

            {/* Precio anterior tachado */}
            {producto.precioAnterior && (
              <div className="relative">
                <span className="text-gray-400 line-through md:text-[9px] text-[7px]">
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
            className="w-full bg-gray-700 hover:bg-gray-600 text-white md:py-0.5 py-0 md:px-1 px-0.5 rounded transition-colors md:text-[9px] text-[7px] font-medium md:mt-1 mt-0.5 md:mb-1 mb-0.5"
          >
            +Información
          </button>

          {/* Botones de Editar y Eliminar */}
          {section && (
            <div className="flex gap-1">
              <button
                onClick={() => openEditModal(producto, section)}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white md:py-0.5 py-0 md:px-1 px-0.5 rounded transition-colors md:text-[8px] text-[6px] font-medium"
              >
                Editar
              </button>
              <button
                onClick={() => abrirConfirmacionEliminar(producto, section)}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white md:py-0.5 py-0 md:px-1 px-0.5 rounded transition-colors md:text-[8px] text-[6px] font-medium"
              >
                Eliminar
              </button>
            </div>
          )}
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
      {/* Banner Distortion Styles - PREMIUM FEATURE (commented for now, will be used later) */}
      {/* <style dangerouslySetInnerHTML={{ __html: bannerDistortionStyle }} /> */}

      {/* Responsive Menu - Only shows on mobile */}
      <div className="md:hidden block">
        {!activeContainer ? (
          <div className="p-6">
            {/* Removed the "Panel de Administración" title as it's already in the header */}

            {/* Uniform-sized buttons grid */}
            <div className="space-y-4 mb-4">
              {/* First row - 2 buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setActiveContainer('datos-negocio')}
                  className="aspect-square bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg p-4 transition-colors duration-200 flex flex-col items-center justify-center text-center"
                >
                  <Store className="w-8 h-8 text-blue-400 mb-2" />
                  <span className="text-white text-sm font-medium">Datos del Negocio</span>
                </button>

                <button
                  onClick={() => setActiveContainer('gestion-productos')}
                  className="aspect-square bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg p-4 transition-colors duration-200 flex flex-col items-center justify-center text-center"
                >
                  <ShoppingBag className="w-8 h-8 text-green-400 mb-2" />
                  <span className="text-white text-sm font-medium">Gestión de Productos</span>
                </button>
              </div>

              {/* TEMPORALMENTE OCULTO - Second row - 2 buttons */}
              {/* <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setActiveContainer('gestion-banner')}
                  className="aspect-square bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg p-4 transition-colors duration-200 flex flex-col items-center justify-center text-center"
                >
                  <Image className="w-8 h-8 text-yellow-400 mb-2" />
                  <span className="text-white text-sm font-medium">Gestión de Banner</span>
                </button>

                <button
                  onClick={() => setActiveContainer('analytics')}
                  className="aspect-square bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg p-4 transition-colors duration-200 flex flex-col items-center justify-center text-center"
                >
                  <BarChart3 className="w-8 h-8 text-purple-400 mb-2" />
                  <span className="text-white text-sm font-medium">Analytics Dashboard</span>
                </button>
              </div> */}

              {/* TEMPORALMENTE OCULTO - Third row - 1 centered button */}
              {/* <div className="flex justify-center">
                <button
                  onClick={() => setActiveContainer('carruseles')}
                  className="aspect-square bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg p-4 transition-colors duration-200 flex flex-col items-center justify-center text-center w-[calc(50%-0.5rem)]"
                >
                  <Settings className="w-8 h-8 text-orange-400 mb-2" />
                  <span className="text-white text-sm font-medium">Gestión de Carruseles</span>
                </button>
              </div> */}
            </div>
          </div>
        ) : (
          <div className="p-4">
            {/* Back button */}
            <button
              onClick={() => setActiveContainer(null)}
              className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors duration-200 mb-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Volver al menú</span>
            </button>
          </div>
        )}
      </div>

      {/* Container principal con título y pestañas */}
      <div className="w-full">
        {/* Sección: Datos del Negocio */}
        <div className={`px-6 py-8 ${activeContainer === 'datos-negocio' ? 'block' : 'hidden md:block'}`}>
          <div className="flex items-center gap-3">
            <h1 className="text-lg md:text-3xl font-bold text-white mb-2">Datos del Negocio</h1>
            <button
              onClick={() => openHelpPopup('datos-negocio')}
              className="mb-2 w-6 h-6 md:w-8 md:h-8 rounded-full border border-yellow-400 bg-transparent hover:bg-yellow-400/10 transition-colors flex items-center justify-center"
            >
              <span className="text-yellow-400 font-bold text-sm md:text-base">?</span>
            </button>
          </div>
          <p className="text-gray-400 text-xs md:text-base">Administra la información del negocio</p>
        </div>

        {/* Formulario */}
        <div className={`px-6 pb-4 ${activeContainer === 'datos-negocio' ? 'block' : 'hidden md:block'}`}>
          <div className="md:bg-transparent md:border-0 md:rounded-none md:p-0 bg-gray-800 border border-gray-700 rounded-lg p-4 max-w-4xl mx-auto">
            <h2 className="text-base md:text-xl font-semibold text-white mb-4">Información General</h2>
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-400 text-xs md:text-base">Ingresa los datos básicos del negocio</p>
              <Button
                onClick={autollenarNegocio}
                className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 md:text-sm text-xs"
              >
                Auto Llenar Datos
              </Button>
            </div>

            {/* Formulario único */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="entidad-nombre" className="text-gray-300 md:text-sm text-xs">Nombre del Negocio</Label>
                  <Input
                    id="entidad-nombre"
                    placeholder="Ingresa el nombre del negocio"
                    value={businessInfo.nombre}
                    onChange={(e) => handleBusinessInfoChange('nombre', e.target.value)}
                    className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 md:text-sm text-xs"
                  />
                </div>

                <div>
                  <Label htmlFor="entidad-direccion" className="text-gray-300 md:text-sm text-xs">Dirección</Label>
                  <Input
                    id="entidad-direccion"
                    placeholder="Ingresa la dirección completa"
                    value={businessInfo.direccion}
                    onChange={(e) => handleBusinessInfoChange('direccion', e.target.value)}
                    className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 md:text-sm text-xs"
                  />
                </div>

                {/* Teléfono y WhatsApp en la misma fila */}
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="entidad-telefono" className="text-gray-300 md:text-sm text-xs">Teléfono</Label>
                    <Input
                      id="entidad-telefono"
                      placeholder="Ingresa el número"
                      value={businessInfo.telefono}
                      onChange={(e) => handleBusinessInfoChange('telefono', e.target.value)}
                      className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 md:text-sm text-xs"
                    />
                  </div>

                  <div>
                    <Label htmlFor="entidad-whatsapp" className="text-gray-300 md:text-sm text-xs">WhatsApp</Label>
                    <Input
                      id="entidad-whatsapp"
                      placeholder="Ingresa el número"
                      value={businessInfo.whatsapp}
                      onChange={(e) => handleBusinessInfoChange('whatsapp', e.target.value)}
                      className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 md:text-sm text-xs"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="entidad-email" className="text-gray-300 md:text-sm text-xs">Email</Label>
                  <Input
                    id="entidad-email"
                    type="email"
                    placeholder="Ingresa el correo electrónico"
                    value={businessInfo.email}
                    onChange={(e) => handleBusinessInfoChange('email', e.target.value)}
                    className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 md:text-sm text-xs"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="entidad-responsable" className="text-gray-300 md:text-sm text-xs">Nombre del Responsable del Negocio</Label>
                  <Input
                    id="entidad-responsable"
                    placeholder="Ingresa el nombre del responsable del negocio"
                    value={businessInfo.responsable}
                    onChange={(e) => handleBusinessInfoChange('responsable', e.target.value)}
                    className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 md:text-sm text-xs"
                  />
                </div>

                {/* Sección de Horarios */}
                <div>
                  <Label className="text-gray-300 md:text-sm text-xs flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4" />
                    Horarios de Atención
                  </Label>

                  <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 space-y-3">
                    {/* Lunes a Viernes */}
                    <div className="flex items-center gap-3">
                      <Label className="text-gray-400 md:text-sm text-xs md:w-32 w-16 md:block hidden">Lunes a Viernes</Label>
                      {/* Responsive: Mostrar "L a V" en móvil */}
                      <Label className="text-gray-400 text-xs w-16 md:hidden block">L a V</Label>
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          id="horario-lv-inicio"
                          type="time"
                          value={businessInfo.horarios.lunesViernes.inicio}
                          onChange={(e) => handleBusinessInfoChange('horarios.lunesViernes.inicio', e.target.value)}
                          className="bg-gray-600 border-gray-500 text-white placeholder-gray-400 md:w-28 w-20 md:text-sm text-xs [&::-webkit-datetime-edit-ampm-field]:lowercase [&::-webkit-datetime-edit-ampm-field]:text-xs"
                        />
                        <span className="text-gray-400 md:text-sm text-xs">a</span>
                        <Input
                          id="horario-lv-fin"
                          type="time"
                          value={businessInfo.horarios.lunesViernes.fin}
                          onChange={(e) => handleBusinessInfoChange('horarios.lunesViernes.fin', e.target.value)}
                          className="bg-gray-600 border-gray-500 text-white placeholder-gray-400 md:w-28 w-20 md:text-sm text-xs [&::-webkit-datetime-edit-ampm-field]:lowercase [&::-webkit-datetime-edit-ampm-field]:text-xs"
                        />
                      </div>
                    </div>

                    {/* Sábado */}
                    <div className="flex items-center gap-3">
                      <Label className="text-gray-400 md:text-sm text-xs md:w-32 w-16 md:block hidden">Sábado</Label>
                      {/* Responsive: Mostrar "Sab." en móvil */}
                      <Label className="text-gray-400 text-xs w-16 md:hidden block">Sab.</Label>
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          id="horario-sabado-inicio"
                          type="time"
                          value={businessInfo.horarios.sabado.inicio}
                          onChange={(e) => handleBusinessInfoChange('horarios.sabado.inicio', e.target.value)}
                          className="bg-gray-600 border-gray-500 text-white placeholder-gray-400 md:w-28 w-20 md:text-sm text-xs [&::-webkit-datetime-edit-ampm-field]:lowercase [&::-webkit-datetime-edit-ampm-field]:text-xs"
                        />
                        <span className="text-gray-400 md:text-sm text-xs">a</span>
                        <Input
                          id="horario-sabado-fin"
                          type="time"
                          value={businessInfo.horarios.sabado.fin}
                          onChange={(e) => handleBusinessInfoChange('horarios.sabado.fin', e.target.value)}
                          className="bg-gray-600 border-gray-500 text-white placeholder-gray-400 md:w-28 w-20 md:text-sm text-xs [&::-webkit-datetime-edit-ampm-field]:lowercase [&::-webkit-datetime-edit-ampm-field]:text-xs"
                        />
                      </div>
                    </div>

                    {/* Domingo */}
                    <div className="flex items-center gap-3">
                      <Label className="text-gray-400 md:text-sm text-xs md:w-32 w-16 md:block hidden">Domingo</Label>
                      {/* Responsive: Mostrar "Dom." en móvil */}
                      <Label className="text-gray-400 text-xs w-16 md:hidden block">Dom.</Label>
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          id="horario-domingo-inicio"
                          type="time"
                          value={businessInfo.horarios.domingo.inicio}
                          onChange={(e) => handleBusinessInfoChange('horarios.domingo.inicio', e.target.value)}
                          className="bg-gray-600 border-gray-500 text-white placeholder-gray-400 md:w-28 w-20 md:text-sm text-xs [&::-webkit-datetime-edit-ampm-field]:lowercase [&::-webkit-datetime-edit-ampm-field]:text-xs"
                        />
                        <span className="text-gray-400 md:text-sm text-xs">a</span>
                        <Input
                          id="horario-domingo-fin"
                          type="time"
                          value={businessInfo.horarios.domingo.fin}
                          onChange={(e) => handleBusinessInfoChange('horarios.domingo.fin', e.target.value)}
                          className="bg-gray-600 border-gray-500 text-white placeholder-gray-400 md:w-28 w-20 md:text-sm text-xs [&::-webkit-datetime-edit-ampm-field]:lowercase [&::-webkit-datetime-edit-ampm-field]:text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button className="bg-gray-700 hover:bg-gray-600 text-white md:text-sm text-xs md:px-4 px-3 md:py-2 py-1">
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
            setEditingProducto(null)
            setOpcionesProducto({
              tallasCalzado: false,
              tallasRopa: false,
              genero: false,
              medidas: false
            })
          }
          setIsModalOpen(open)
        }}>
          <DialogContent className="bg-gray-800 border-gray-700 text-white md:max-w-2xl max-w-[95vw] md:max-h-[90vh] max-h-[95vh] overflow-y-auto md:m-0 m-2">
            <DialogHeader>
              <DialogTitle className="md:text-xl text-lg font-semibold">
                {editingProducto ? 'Editar Producto' : `Agregar Producto a ${selectedSection}`}
              </DialogTitle>
            </DialogHeader>

            <div className="md:space-y-6 space-y-4">
              {/* Cargar imagen */}
              <div>
                <Label htmlFor="producto-imagen" className="text-gray-300 mb-2 block md:text-sm text-xs">
                  Cargar Imagen (JPG, PNG)
                </Label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg md:p-4 p-2 hover:border-gray-500 transition-colors md:w-64 w-48 md:h-48 h-36 mx-auto bg-white">
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

              {/* Categoría y Subcategoría en la misma fila */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Categoría */}
                <div>
                  <Label htmlFor="categoria" className="text-gray-300 mb-2 block md:text-sm text-xs">
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
                  <Label htmlFor="subcategoria" className="text-gray-300 mb-2 block md:text-sm text-xs">
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
                <Label htmlFor="producto-nombre" className="text-gray-300 mb-2 block md:text-sm text-xs">
                  Nombre o Título del Producto
                </Label>
                <Input
                  id="producto-nombre"
                  value={productoData.nombre}
                  onChange={(e) => handleProductoDataChange('nombre', e.target.value)}
                  placeholder="Ingresa el nombre del producto"
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 md:text-sm text-xs"
                />
              </div>

              {/* Opciones de características del producto */}
              <div>
                <Label className="text-gray-300 mb-3 block md:text-sm text-xs">
                  Tu producto necesita mostrar:
                </Label>
                <div className="grid grid-cols-4 gap-2">
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
                        className={`flex items-center justify-center w-3.5 h-3.5 border-2 rounded-full cursor-pointer transition-colors ${opcionesProducto.genero
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
                    <label htmlFor="opcion-genero" className="text-gray-300 cursor-pointer md:text-xs text-[10px]">
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
                        className={`flex items-center justify-center w-3.5 h-3.5 border-2 rounded-full cursor-pointer transition-colors ${opcionesProducto.medidas
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
                    <label htmlFor="opcion-medidas" className="text-gray-300 cursor-pointer md:text-xs text-[10px]">
                      Medidas
                    </label>
                  </div>

                  {/* Opción Calzado - TERCERA */}
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
                        className={`flex items-center justify-center w-3.5 h-3.5 border-2 rounded-full cursor-pointer transition-colors ${opcionesProducto.tallasCalzado
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
                    <label htmlFor="opcion-tallas-calzado" className="text-gray-300 cursor-pointer md:text-xs text-[10px]">
                      Calzado
                    </label>
                  </div>

                  {/* Opción Ropa - CUARTA */}
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
                        className={`flex items-center justify-center w-3.5 h-3.5 border-2 rounded-full cursor-pointer transition-colors ${opcionesProducto.tallasRopa
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
                    <label htmlFor="opcion-tallas-ropa" className="text-gray-300 cursor-pointer md:text-xs text-[10px]">
                      Ropa
                    </label>
                  </div>
                </div>

                {/* Campos dinámicos según opciones seleccionadas */}
                <div className="mt-6">
                  <div className="space-y-4">
                    {/* Campos de Género y Medidas - EN LA MISMA FILA SOLO EN MODO NORMAL */}
                    {(opcionesProducto.genero || opcionesProducto.medidas) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Campo de Género */}
                        {opcionesProducto.genero && (
                          <div>
                            <Label htmlFor="genero" className="text-gray-300 mb-2 block md:text-sm text-xs">
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
                            <Label className="text-gray-300 mb-2 block md:text-sm text-xs">
                              Medidas
                            </Label>
                            <div className="flex items-center gap-2">
                              <Input
                                id="medidas"
                                type="number"
                                value={productoData.medidas}
                                onChange={(e) => handleProductoDataChange('medidas', e.target.value)}
                                placeholder="0"
                                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 flex-1 md:text-sm text-xs"
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
                              className={`px-1 py-0.5 text-xs rounded transition-colors text-center ${productoData.tallasCalzado.includes(talla)
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
                              className={`px-1 py-0.5 text-xs rounded transition-colors text-center ${productoData.tallasRopa.includes(talla === 'T.Única' ? 'Talla Única' : talla)
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

              {/* Campos de Precio - EN LA MISMA FILA SOLO EN MODO NORMAL */}
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Precio Actual */}
                  <div>
                    <Label htmlFor="precio-actual" className="text-gray-300 mb-2 block md:text-sm text-xs">
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
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 pl-8 md:text-sm text-xs"
                      />
                    </div>
                  </div>

                  {/* Precio Anterior */}
                  <div>
                    <Label htmlFor="precio-anterior" className="text-gray-300 mb-2 block md:text-sm text-xs">
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
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 pl-8 md:text-sm text-xs"
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
                  <span className={`text-sm ${contarPalabras(descripcion) > 45
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
                      className={`h-2 rounded-full transition-all duration-300 ${contarPalabras(descripcion) > 48
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
              <div className="space-y-3 pt-4">
                {/* Primera fila: Botón Auto llenado solo */}
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    onClick={autollenarCampos}
                    className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600 md:text-sm text-xs md:px-4 px-3 md:py-2 py-1.5"
                  >
                    Autollenado
                  </Button>
                </div>

                {/* Segunda fila: Cancelar y Agregar Producto */}
                <div className="flex justify-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsModalOpen(false)
                      setEditingProducto(null)
                    }}
                    className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600 md:text-sm text-xs md:px-4 px-3 md:py-2 py-1.5"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={agregarProducto}
                    className="bg-gray-700 hover:bg-gray-600 text-white md:text-sm text-xs md:px-4 px-3 md:py-2 py-1.5"
                  >
                    {editingProducto ? 'Actualizar Producto' : 'Agregar Producto'}
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Sección: Gestión de Productos */}
        <div className={`px-6 py-8 ${activeContainer === 'gestion-productos' ? 'block' : 'hidden md:block'}`}>
          <div className="flex items-center gap-3">
            <h1 className="text-lg md:text-3xl font-bold text-white mb-2">Gestión de Productos</h1>
            <button
              onClick={() => openHelpPopup('gestion-productos')}
              className="mb-2 w-6 h-6 md:w-8 md:h-8 rounded-full border border-yellow-400 bg-transparent hover:bg-yellow-400/10 transition-colors flex items-center justify-center"
            >
              <span className="text-yellow-400 font-bold text-sm md:text-base">?</span>
            </button>
          </div>
          <p className="text-gray-400 text-xs md:text-base">Administra las diferentes secciones de productos del marketplace</p>
        </div>

        {/* Pestañas de Productos */}
        <Tabs defaultValue="destacados" className={`w-full pb-4 ${activeContainer === 'gestion-productos' ? 'block' : 'hidden md:block'}`}>
          <TabsList className="grid md:grid-cols-6 grid-cols-3 md:w-full w-11/12 md:max-w-4xl max-w-sm mx-auto px-6 mb-8 bg-gray-800 border border-gray-700 rounded-lg p-1 md:h-auto h-auto md:gap-0 gap-y-1">
            <TabsTrigger
              value="destacados"
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300 hover:text-white hover:bg-gray-700 transition-colors md:text-sm text-[10px] md:py-2 py-1 md:px-3 px-1"
            >
              Destacados
            </TabsTrigger>
            <TabsTrigger
              value="ofertas"
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300 hover:text-white hover:bg-gray-700 transition-colors md:text-sm text-[10px] md:py-2 py-1 md:px-3 px-1"
            >
              Ofertas
            </TabsTrigger>
            <TabsTrigger
              value="novedades"
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300 hover:text-white hover:bg-gray-700 transition-colors md:text-sm text-[10px] md:py-2 py-1 md:px-3 px-1"
            >
              Novedades
            </TabsTrigger>
            <TabsTrigger
              value="tendencias"
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300 hover:text-white hover:bg-gray-700 transition-colors md:text-sm text-[10px] md:py-2 py-1 md:px-3 px-1"
            >
              Tendencias
            </TabsTrigger>
            <TabsTrigger
              value="no-te-lo-pierdas"
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300 hover:text-white hover:bg-gray-700 transition-colors md:text-sm text-[10px] md:py-2 py-1 md:px-3 px-1"
            >
              ¡No te lo Pierdas!
            </TabsTrigger>
            <TabsTrigger
              value="liquidaciones"
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300 hover:text-white hover:bg-gray-700 transition-colors md:text-sm text-[10px] md:py-2 py-1 md:px-3 px-1"
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
                ProductoCard={(props) => <ProductoCard {...props} section="destacados" />}
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
                ProductoCard={(props) => <ProductoCard {...props} section="ofertas" />}
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
                ProductoCard={(props) => <ProductoCard {...props} section="novedades" />}
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
                ProductoCard={(props) => <ProductoCard {...props} section="tendencias" />}
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
                ProductoCard={(props) => <ProductoCard {...props} section="no-te-lo-pierdas" />}
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
                ProductoCard={(props) => <ProductoCard {...props} section="liquidaciones" />}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>


      {/* TEMPORALMENTE OCULTO - Sección: Analytics Dashboard */}
      <div className={`px-6 py-8 hidden`}>
        <div className="flex items-center gap-3">
          <h1 className="text-lg md:text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
          <button
            onClick={() => openHelpPopup('analytics')}
            className="mb-2 w-6 h-6 md:w-8 md:h-8 rounded-full border border-yellow-400 bg-transparent hover:bg-yellow-400/10 transition-colors flex items-center justify-center"
          >
            <span className="text-yellow-400 font-bold text-sm md:text-base">?</span>
          </button>
        </div>
        <p className="text-gray-400 text-xs md:text-base">Estadísticas y métricas del rendimiento</p>
      </div>

      {/* TEMPORALMENTE OCULTO - Container Analytics */}
      <div className={`px-6 pb-4 relative hidden`}>
        <div className="md:bg-transparent md:border-0 md:rounded-none md:p-0 bg-gray-800 border border-gray-700 rounded-lg p-4 relative">{/* banner-distortion class removed - PREMIUM FEATURE */}
          {/* Fila Superior - 3 Columnas en desktop, apiladas en mobile */}
          <div className="grid md:grid-cols-3 grid-cols-1 md:gap-6 gap-4 md:mb-8 mb-6">
            {/* Columna 1 - 4 KPIs en 2 filas */}
            <div className="md:space-y-4 space-y-3">
              {/* Primera fila de KPIs */}
              <div className="grid grid-cols-2 md:gap-4 gap-2">
                <div className="bg-gray-700 rounded-lg md:p-4 p-2 text-center">
                  <h3 className="md:text-sm text-xs font-medium text-gray-400 md:mb-2 mb-1">Visualizaciones Hoy</h3>
                  <p className="md:text-2xl text-lg font-bold text-white">1.2K</p>
                  <p className="md:text-xs text-[10px] text-green-400">+15% vs ayer</p>
                </div>
                <div className="bg-gray-700 rounded-lg md:p-4 p-2 text-center">
                  <h3 className="md:text-sm text-xs font-medium text-gray-400 md:mb-2 mb-1">Visitantes</h3>
                  <p className="md:text-2xl text-lg font-bold text-white">850</p>
                  <p className="md:text-xs text-[10px] text-blue-400">+8% vs ayer</p>
                </div>
              </div>

              {/* Segunda fila de KPIs */}
              <div className="grid grid-cols-2 md:gap-4 gap-2">
                <div className="bg-gray-700 rounded-lg md:p-4 p-2 text-center">
                  <h3 className="md:text-sm text-xs font-medium text-gray-400 md:mb-2 mb-1">Interacciones</h3>
                  <p className="md:text-2xl text-lg font-bold text-white">156</p>
                  <p className="md:text-xs text-[10px] text-green-400">+12% vs ayer</p>
                </div>
                <div className="bg-gray-700 rounded-lg md:p-4 p-2 text-center">
                  <h3 className="md:text-sm text-xs font-medium text-gray-400 md:mb-2 mb-1">Consultas</h3>
                  <p className="md:text-2xl text-lg font-bold text-white">43</p>
                  <p className="md:text-xs text-[10px] text-green-400">+5% vs ayer</p>
                </div>
              </div>
            </div>

            {/* Columna 2 - KPI con Gráfico de Barras Verticales */}
            <div className="bg-gray-700 rounded-lg md:p-4 p-3 flex flex-col">
              <h3 className="md:text-sm text-xs font-medium text-white md:mb-2 mb-1">Visualizaciones del Mes</h3>

              {/* Container del gráfico que ocupa todo el espacio disponible */}
              <div className="flex-1 flex flex-col justify-end">
                <div className="flex items-end justify-center md:space-x-2 space-x-1 md:h-32 h-20">
                  {/* Barra Semana 1 */}
                  <div className="flex flex-col items-center h-full justify-end">
                    <div className="bg-blue-500 md:w-16 w-8 rounded-t-sm flex items-end justify-center pb-1" style={{ height: '60%' }}>
                      <span className="text-white md:text-xs text-[8px] font-semibold">230</span>
                    </div>
                    <span className="md:text-xs text-[8px] text-gray-300 mt-1">S1</span>
                  </div>

                  {/* Barra Semana 2 */}
                  <div className="flex flex-col items-center h-full justify-end">
                    <div className="bg-green-500 md:w-16 w-8 rounded-t-sm flex items-end justify-center pb-1" style={{ height: '80%' }}>
                      <span className="text-white md:text-xs text-[8px] font-semibold">310</span>
                    </div>
                    <span className="md:text-xs text-[8px] text-gray-300 mt-1">S2</span>
                  </div>

                  {/* Barra Semana 3 */}
                  <div className="flex flex-col items-center h-full justify-end">
                    <div className="bg-purple-500 md:w-16 w-8 rounded-t-sm flex items-end justify-center pb-1" style={{ height: '100%' }}>
                      <span className="text-white md:text-xs text-[8px] font-semibold">380</span>
                    </div>
                    <span className="md:text-xs text-[8px] text-gray-300 mt-1">S3</span>
                  </div>

                  {/* Barra Semana 4 */}
                  <div className="flex flex-col items-center h-full justify-end">
                    <div className="bg-orange-500 md:w-16 w-8 rounded-t-sm flex items-end justify-center pb-1" style={{ height: '70%' }}>
                      <span className="text-white md:text-xs text-[8px] font-semibold">280</span>
                    </div>
                    <span className="md:text-xs text-[8px] text-gray-300 mt-1">S4</span>
                  </div>
                </div>

                {/* Información en la parte inferior */}
                <div className="text-center md:mt-3 mt-2">
                  <span className="md:text-xs text-[10px] text-green-400">+22% vs mes anterior</span>
                </div>
              </div>
            </div>

            {/* Columna 3 - 4 KPIs en 2 filas (datos distintos) */}
            <div className="md:space-y-4 space-y-3">
              {/* Primera fila de KPIs */}
              <div className="grid grid-cols-2 md:gap-4 gap-2">
                <div className="bg-gray-700 rounded-lg md:p-4 p-2 text-center">
                  <h3 className="md:text-sm text-xs font-medium text-gray-400 md:mb-2 mb-1">Productos Mostrados</h3>
                  <p className="md:text-2xl text-lg font-bold text-white">{Object.values(productos).flat().length}</p>
                  <p className="md:text-xs text-[10px] text-blue-400">de 7 máximo</p>
                </div>
                <div className="bg-gray-700 rounded-lg md:p-4 p-2 text-center">
                  <h3 className="md:text-sm text-xs font-medium text-gray-400 md:mb-2 mb-1">Negocios Registrados</h3>
                  <p className="md:text-2xl text-lg font-bold text-white">28</p>
                  <p className="md:text-xs text-[10px] text-green-400">+3 esta semana</p>
                </div>
              </div>

              {/* Segunda fila de KPIs */}
              <div className="grid grid-cols-2 md:gap-4 gap-2">
                <div className="bg-gray-700 rounded-lg md:p-4 p-2 text-center">
                  <h3 className="md:text-sm text-xs font-medium text-gray-400 md:mb-2 mb-1">Tiempo Promedio</h3>
                  <p className="md:text-2xl text-lg font-bold text-white">2.5m</p>
                  <p className="md:text-xs text-[10px] text-yellow-400">en vitrina</p>
                </div>
                <div className="bg-gray-700 rounded-lg md:p-4 p-2 text-center">
                  <h3 className="md:text-sm text-xs font-medium text-gray-400 md:mb-2 mb-1">Alcance</h3>
                  <p className="md:text-2xl text-lg font-bold text-white">68%</p>
                  <p className="md:text-xs text-[10px] text-green-400">+5% vs ayer</p>
                </div>
              </div>
            </div>
          </div>

          {/* Fila Inferior - 3 Columnas en desktop, 3 filas en mobile */}
          <div className="md:grid md:grid-cols-3 md:gap-6 space-y-4 md:space-y-0">
            {/* Primera fila responsive: 3 KPIs de Pestañas (primeras 3) */}
            <div className="grid grid-cols-3 md:gap-4 gap-2">
              <div className="bg-gray-700 border border-gray-600 rounded-lg md:p-3 p-2 text-center flex flex-col justify-center">
                <h3 className="md:text-xs text-[10px] font-medium text-gray-300 md:mb-2 mb-1">Destacados</h3>
                <p className="md:text-2xl text-lg font-bold text-white">{productos.destacados.length}</p>
              </div>
              <div className="bg-gray-700 border border-gray-600 rounded-lg md:p-3 p-2 text-center flex flex-col justify-center">
                <h3 className="md:text-xs text-[10px] font-medium text-gray-300 md:mb-2 mb-1">Ofertas</h3>
                <p className="md:text-2xl text-lg font-bold text-white">{productos.ofertas.length}</p>
              </div>
              <div className="bg-gray-700 border border-gray-600 rounded-lg md:p-3 p-2 text-center flex flex-col justify-center">
                <h3 className="md:text-xs text-[10px] font-medium text-gray-300 md:mb-2 mb-1">Novedades</h3>
                <p className="md:text-2xl text-lg font-bold text-white">{productos.novedades.length}</p>
              </div>
            </div>

            {/* Segunda fila responsive: 3 KPIs de Pestañas (siguientes 3) */}
            <div className="grid grid-cols-3 md:gap-4 gap-2">
              <div className="bg-gray-700 border border-gray-600 rounded-lg md:p-3 p-2 text-center flex flex-col justify-center">
                <h3 className="md:text-xs text-[10px] font-medium text-gray-300 md:mb-2 mb-1">Tendencias</h3>
                <p className="md:text-2xl text-lg font-bold text-white">{productos.tendencias.length}</p>
              </div>
              <div className="bg-gray-700 border border-gray-600 rounded-lg md:p-3 p-2 text-center flex flex-col justify-center">
                <h3 className="md:text-xs text-[10px] font-medium text-gray-300 md:mb-2 mb-1">No te lo Pierdas</h3>
                <p className="md:text-2xl text-lg font-bold text-white">{productos['no-te-lo-pierdas'].length}</p>
              </div>
              <div className="bg-gray-700 border border-gray-600 rounded-lg md:p-3 p-2 text-center flex flex-col justify-center">
                <h3 className="md:text-xs text-[10px] font-medium text-gray-300 md:mb-2 mb-1">Liquidaciones</h3>
                <p className="md:text-2xl text-lg font-bold text-white">{productos.liquidaciones.length}</p>
              </div>
            </div>

            {/* Tercera fila responsive: KPI Ancho Total de Productos */}
            <div className="bg-gray-700 rounded-lg md:p-3 p-2 text-center">
              <h3 className="md:text-sm text-xs font-medium text-white md:mb-2 mb-1">Total de Productos</h3>
              <div className="md:space-y-1 space-y-0.5">
                <div className="flex justify-between md:text-xs text-[10px]">
                  <span className="text-gray-300">Progreso</span>
                  <span className="text-gray-300">{Object.values(productos).flat().length} / 7</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full md:h-3 h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-blue-500 md:h-3 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((Object.values(productos).flat().length / 7) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="md:text-xs text-[10px] text-gray-400 md:mt-1 mt-0.5">
                  {Math.round((Object.values(productos).flat().length / 7) * 100)}% completado
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay Message - PREMIUM FEATURE (commented for now, will be used later) */}
        {/* <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="bg-white border-2 border-purple-400 rounded-lg md:px-6 px-4 md:py-5 py-4 shadow-lg text-center md:max-w-sm max-w-[300px]">
            <h3 className="md:text-lg text-base font-bold text-gray-800 md:mb-3 mb-2">📊 Analytics Dashboard</h3>
            <p className="md:text-sm text-xs text-gray-700 md:mb-3 mb-2">Panel de análisis avanzado que te permite monitorear en tiempo real el rendimiento de tu negocio: visualizaciones de productos, interacciones de clientes, consultas recibidas y estadísticas detalladas de tus publicaciones.</p>
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg md:py-2 py-1.5 md:px-3 px-2 border border-purple-300">
              <p className="md:text-xs text-[10px] font-semibold text-purple-800">✨ Disponible para clientes Premium</p>
            </div>
          </div>
        </div> */}
      </div>


      {/* Modal de Ayuda */}
      <Dialog open={showHelpPopup} onOpenChange={(open) => {
        if (!open) {
          closeHelpPopup()
        }
      }}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white md:max-w-2xl max-w-[95vw] md:max-h-[80vh] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="relative">
            <button
              onClick={closeHelpPopup}
              className="absolute right-0 top-0 rounded-sm opacity-70 hover:opacity-100 transition-opacity focus:outline-none"
            >
              <X className="h-4 w-4 text-gray-400 hover:text-white" />
              <span className="sr-only">Cerrar</span>
            </button>
            <DialogTitle className="md:text-xl text-lg font-semibold text-yellow-400 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 md:w-6 md:h-6" />
              {helpContent?.title}
            </DialogTitle>
          </DialogHeader>

          <div className="md:mt-4 mt-3">
            <p className="text-gray-300 md:text-base text-sm leading-relaxed text-justify">
              {helpContent?.content}
            </p>
          </div>

          <div className="flex justify-end mt-6">
            <Button
              onClick={closeHelpPopup}
              className="bg-yellow-600 hover:bg-yellow-700 text-white md:px-6 px-4 md:py-2 py-1.5 md:text-sm text-xs"
            >
              Entendido
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* TEMPORALMENTE OCULTO - Sección Gestión de Carruseles */}
      <div className={`px-6 py-8 hidden`}>
        <div className="flex items-center gap-3">
          <h1 className="text-lg md:text-3xl font-bold text-white mb-2">Gestión de Carruseles</h1>
          <button
            onClick={() => openHelpPopup('carruseles')}
            className="mb-2 w-6 h-6 md:w-8 md:h-8 rounded-full border border-yellow-400 bg-transparent hover:bg-yellow-400/10 transition-colors flex items-center justify-center"
          >
            <span className="text-yellow-400 font-bold text-sm md:text-base">?</span>
          </button>
        </div>
        <p className="text-gray-400 text-xs md:text-base">Administra las imágenes de los carruseles principales</p>
      </div>

      {/* TEMPORALMENTE OCULTO - Pestañas de Carruseles */}
      <div className={`px-6 pb-4 relative hidden`}>
        <Tabs defaultValue="carrusel1" className={`w-full ${activeContainer === 'carruseles' ? 'block' : 'hidden md:block'}`}>
          {/* Overlay Message - PREMIUM FEATURE (commented for now, will be used later) */}
          {/* <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="bg-white border-2 border-purple-400 rounded-lg md:px-6 px-4 md:py-5 py-4 shadow-lg text-center md:max-w-sm max-w-[300px]">
              <h3 className="md:text-lg text-base font-bold text-gray-800 md:mb-3 mb-2">🎠 Gestión de Carruseles</h3>
              <p className="md:text-sm text-xs text-gray-700 md:mb-3 mb-2">Sistema avanzado de carruseles que te permite organizar y exhibir tus productos destacados en galerías visuales rotativas en la página principal de tu negocio. Hasta 16 posiciones disponibles en 2 carruseles personalizables.</p>
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg md:py-2 py-1.5 md:px-3 px-2 border border-purple-300">
                <p className="md:text-xs text-[10px] font-semibold text-purple-800">✨ Disponible para clientes Premium</p>
              </div>
            </div>
          </div> */}
          <TabsList className="grid grid-cols-2 w-full md:max-w-md max-w-xs mx-auto md:px-6 px-3 md:mb-8 mb-6 bg-gray-800 border border-gray-700 rounded-lg p-1">
            <TabsTrigger
              value="carrusel1"
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300 hover:text-white hover:bg-gray-700 transition-colors md:text-sm text-xs"
            >
              Carrusel 1
            </TabsTrigger>
            <TabsTrigger
              value="carrusel2"
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300 hover:text-white hover:bg-gray-700 transition-colors md:text-sm text-xs"
            >
              Carrusel 2
            </TabsTrigger>
          </TabsList>

          {/* Contenido de cada pestaña de carruseles */}
          <div className="md:px-6 px-3">
            {/* Tab Carrusel 1 */}
            <TabsContent value="carrusel1" className="space-y-4">
              <div className="bg-gray-800 rounded-lg border border-gray-700 md:p-6 p-4 relative">{/* banner-distortion class removed - PREMIUM FEATURE */}
                <h2 className="text-base md:text-xl font-semibold text-white md:mb-6 mb-4">Carrusel 1 - Imágenes (1-8)</h2>

                {/* Desktop Layout - 4 columns */}
                <div className="hidden md:block">
                  {/* Primera fila - 4 marcos */}
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    {[0, 1, 2, 3].map((index) => (
                      <div key={index} className="relative">
                        {/* Círculo numerado en la esquina superior derecha */}
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold z-10">
                          {index + 1}
                        </div>

                        {/* Marco para imagen */}
                        <div
                          className="aspect-[4/3] bg-gray-700 border-2 border-dashed border-gray-500 rounded-lg hover:border-purple-400 transition-colors cursor-pointer relative overflow-hidden"
                          onClick={() => !carouselImages.carrusel1[index] && openModal(undefined, { carruselType: 'carrusel1', index })}
                        >
                          {carouselImages.carrusel1[index] ? (
                            <>
                              <img
                                src={carouselImages.carrusel1[index]}
                                alt={`Carrusel 1 - Imagen ${index + 1}`}
                                className="w-full h-full object-contain cursor-pointer bg-gray-100"

                              />

                              {/* Botón de configuración en la esquina superior izquierda */}


                              {/* Precio en la esquina inferior derecha (si existe) */}
                              {carouselProductData.carrusel1[index]?.precioActual && (
                                <div className="absolute bottom-1 right-1 bg-black/70 rounded px-2 py-1">
                                  <span className="text-white text-xs font-semibold">
                                    ${carouselProductData.carrusel1[index].precioActual}
                                  </span>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                              <Plus className="w-8 h-8 mb-2" />
                              <span className="text-sm">Agregar producto</span>
                            </div>
                          )}
                        </div>

                        {/* Información del producto debajo de la tarjeta */}
                        {carouselProductData.carrusel1[index] && (() => {
                          console.log(`🎨 Renderizando info del producto en carrusel1[${index}]:`, carouselProductData.carrusel1[index])
                          return (
                            <div className="mt-2 text-xs text-gray-300 space-y-1">
                              <div className="font-medium text-gray-400">
                                {carouselProductData.carrusel1[index].categoria} / {carouselProductData.carrusel1[index].subcategoria}
                              </div>
                              <div className="font-semibold text-white truncate">
                                {carouselProductData.carrusel1[index].nombre}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-green-400 font-bold">
                                  ${carouselProductData.carrusel1[index].precioActual?.toLocaleString('es-CL')}
                                </span>
                                {carouselProductData.carrusel1[index].precioAnterior && (
                                  <span className="text-gray-500 line-through text-[10px]">
                                    ${carouselProductData.carrusel1[index].precioAnterior?.toLocaleString('es-CL')}
                                  </span>
                                )}
                              </div>
                            </div>
                          )
                        })()}
                      </div>
                    ))}
                  </div>

                  {/* Segunda fila - 4 marcos */}
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    {[4, 5, 6, 7].map((index) => (
                      <div key={index} className="relative">
                        {/* Círculo numerado en la esquina superior derecha */}
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold z-10">
                          {index + 1}
                        </div>

                        {/* Marco para imagen */}
                        <div
                          className="aspect-[4/3] bg-gray-700 border-2 border-dashed border-gray-500 rounded-lg hover:border-purple-400 transition-colors cursor-pointer relative overflow-hidden"
                          onClick={() => !carouselImages.carrusel1[index] && openModal(undefined, { carruselType: 'carrusel1', index })}
                        >
                          {carouselImages.carrusel1[index] ? (
                            <>
                              <img
                                src={carouselImages.carrusel1[index]}
                                alt={`Carrusel 1 - Imagen ${index + 1}`}
                                className="w-full h-full object-contain cursor-pointer bg-gray-100"

                              />

                              {/* Botón de configuración en la esquina superior izquierda */}


                              {/* Precio en la esquina inferior derecha (si existe) */}
                              {carouselProductData.carrusel1[index]?.precioActual && (
                                <div className="absolute bottom-1 right-1 bg-black/70 rounded px-2 py-1">
                                  <span className="text-white text-xs font-semibold">
                                    ${carouselProductData.carrusel1[index].precioActual}
                                  </span>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                              <Plus className="w-8 h-8 mb-2" />
                              <span className="text-sm">Agregar producto</span>
                            </div>
                          )}
                        </div>

                        {/* Información del producto debajo de la tarjeta */}
                        {carouselProductData.carrusel1[index] && (() => {
                          console.log(`🎨 Renderizando info del producto en carrusel1[${index}]:`, carouselProductData.carrusel1[index])
                          return (
                            <div className="mt-2 text-xs text-gray-300 space-y-1">
                              <div className="font-medium text-gray-400">
                                {carouselProductData.carrusel1[index].categoria} / {carouselProductData.carrusel1[index].subcategoria}
                              </div>
                              <div className="font-semibold text-white truncate">
                                {carouselProductData.carrusel1[index].nombre}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-green-400 font-bold">
                                  ${carouselProductData.carrusel1[index].precioActual?.toLocaleString('es-CL')}
                                </span>
                                {carouselProductData.carrusel1[index].precioAnterior && (
                                  <span className="text-gray-500 line-through text-[10px]">
                                    ${carouselProductData.carrusel1[index].precioAnterior?.toLocaleString('es-CL')}
                                  </span>
                                )}
                              </div>
                            </div>
                          )
                        })()}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mobile Layout - Responsive mode */}
                <div className="md:hidden block">
                  {/* Primera fila - 2 tarjetas + borde de la tercera */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {[0, 1].map((index) => (
                      <div key={index} className="relative">
                        {/* Círculo numerado en la esquina superior derecha */}
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold z-10">
                          {index + 1}
                        </div>

                        {/* Marco para imagen */}
                        <div
                          className="aspect-[4/3] bg-gray-700 border-2 border-dashed border-gray-500 rounded-lg hover:border-purple-400 transition-colors cursor-pointer relative overflow-hidden"
                          onClick={() => !carouselImages.carrusel1[index] && openModal(undefined, { carruselType: 'carrusel1', index })}
                        >
                          {carouselImages.carrusel1[index] ? (
                            <>
                              <img
                                src={carouselImages.carrusel1[index]}
                                alt={`Carrusel 1 - Imagen ${index + 1}`}
                                className="w-full h-full object-contain cursor-pointer bg-gray-100"

                              />

                              {/* Precio en la esquina inferior derecha (si existe) */}
                              {carouselProductData.carrusel1[index]?.precioActual && (
                                <div className="absolute bottom-1 right-1 bg-black/70 rounded px-2 py-1">
                                  <span className="text-white text-xs font-semibold">
                                    ${carouselProductData.carrusel1[index].precioActual}
                                  </span>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                              <Plus className="w-8 h-8 mb-2" />
                              <span className="text-sm">Agregar producto</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Segunda fila - 2 tarjetas */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {[2, 3].map((index) => (
                      <div key={index} className="relative">
                        {/* Círculo numerado en la esquina superior derecha */}
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold z-10">
                          {index + 1}
                        </div>

                        {/* Marco para imagen */}
                        <div
                          className="aspect-[4/3] bg-gray-700 border-2 border-dashed border-gray-500 rounded-lg hover:border-purple-400 transition-colors cursor-pointer relative overflow-hidden"
                          onClick={() => !carouselImages.carrusel1[index] && openModal(undefined, { carruselType: 'carrusel1', index })}
                        >
                          {carouselImages.carrusel1[index] ? (
                            <>
                              <img
                                src={carouselImages.carrusel1[index]}
                                alt={`Carrusel 1 - Imagen ${index + 1}`}
                                className="w-full h-full object-contain cursor-pointer bg-gray-100"

                              />

                              {/* Botón de configuración en la esquina superior izquierda */}


                              {/* Precio en la esquina inferior derecha (si existe) */}
                              {carouselProductData.carrusel1[index]?.precioActual && (
                                <div className="absolute bottom-1 right-1 bg-black/70 rounded px-2 py-1">
                                  <span className="text-white text-xs font-semibold">
                                    ${carouselProductData.carrusel1[index].precioActual}
                                  </span>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                              <Plus className="w-8 h-8 mb-2" />
                              <span className="text-sm">Agregar producto</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tercera fila - 2 tarjetas */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {[4, 5].map((index) => (
                      <div key={index} className="relative">
                        {/* Círculo numerado en la esquina superior derecha */}
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold z-10">
                          {index + 1}
                        </div>

                        {/* Marco para imagen */}
                        <div
                          className="aspect-[4/3] bg-gray-700 border-2 border-dashed border-gray-500 rounded-lg hover:border-purple-400 transition-colors cursor-pointer relative overflow-hidden"
                          onClick={() => !carouselImages.carrusel1[index] && openModal(undefined, { carruselType: 'carrusel1', index })}
                        >
                          {carouselImages.carrusel1[index] ? (
                            <>
                              <img
                                src={carouselImages.carrusel1[index]}
                                alt={`Carrusel 1 - Imagen ${index + 1}`}
                                className="w-full h-full object-contain cursor-pointer bg-gray-100"

                              />

                              {/* Botón de configuración en la esquina superior izquierda */}


                              {/* Precio en la esquina inferior derecha (si existe) */}
                              {carouselProductData.carrusel1[index]?.precioActual && (
                                <div className="absolute bottom-1 right-1 bg-black/70 rounded px-2 py-1">
                                  <span className="text-white text-xs font-semibold">
                                    ${carouselProductData.carrusel1[index].precioActual}
                                  </span>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                              <Plus className="w-8 h-8 mb-2" />
                              <span className="text-sm">Agregar producto</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Cuarta fila - 2 tarjetas */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {[6, 7].map((index) => (
                      <div key={index} className="relative">
                        {/* Círculo numerado en la esquina superior derecha */}
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold z-10">
                          {index + 1}
                        </div>

                        {/* Marco para imagen */}
                        <div
                          className="aspect-[4/3] bg-gray-700 border-2 border-dashed border-gray-500 rounded-lg hover:border-purple-400 transition-colors cursor-pointer relative overflow-hidden"
                          onClick={() => !carouselImages.carrusel1[index] && openModal(undefined, { carruselType: 'carrusel1', index })}
                        >
                          {carouselImages.carrusel1[index] ? (
                            <>
                              <img
                                src={carouselImages.carrusel1[index]}
                                alt={`Carrusel 1 - Imagen ${index + 1}`}
                                className="w-full h-full object-contain cursor-pointer bg-gray-100"

                              />

                              {/* Botón de configuración en la esquina superior izquierda */}


                              {/* Precio en la esquina inferior derecha (si existe) */}
                              {carouselProductData.carrusel1[index]?.precioActual && (
                                <div className="absolute bottom-1 right-1 bg-black/70 rounded px-2 py-1">
                                  <span className="text-white text-xs font-semibold">
                                    ${carouselProductData.carrusel1[index].precioActual}
                                  </span>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                              <Plus className="w-8 h-8 mb-2" />
                              <span className="text-sm">Agregar producto</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Botón Guardar Cambios */}
                <div className="flex justify-end md:mt-6 mt-4">
                  <Button
                    onClick={() => handleSaveCarousel('carrusel1')}
                    className="bg-purple-600 hover:bg-purple-700 text-white md:px-6 px-4 md:py-2 py-1.5 md:text-sm text-xs"
                  >
                    Guardar Cambios
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Tab Carrusel 2 */}
            <TabsContent value="carrusel2" className="space-y-4">
              <div className="bg-gray-800 rounded-lg border border-gray-700 md:p-6 p-4 relative">{/* banner-distortion class removed - PREMIUM FEATURE */}
                <h2 className="text-base md:text-xl font-semibold text-white md:mb-6 mb-4">Carrusel 2 - Imágenes (9-16)</h2>

                {/* Desktop Layout - 4 columns */}
                <div className="hidden md:block">
                  {/* Primera fila - 4 marcos */}
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    {[0, 1, 2, 3].map((index) => (
                      <div key={index} className="relative">
                        {/* Círculo numerado en la esquina superior derecha */}
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold z-10">
                          {index + 9}
                        </div>

                        {/* Marco para imagen */}
                        <div
                          className="aspect-[4/3] bg-gray-700 border-2 border-dashed border-gray-500 rounded-lg hover:border-purple-400 transition-colors cursor-pointer relative overflow-hidden"
                          onClick={() => !carouselImages.carrusel2[index] && openModal(undefined, { carruselType: 'carrusel2', index })}
                        >
                          {carouselImages.carrusel2[index] ? (
                            <>
                              <img
                                src={carouselImages.carrusel2[index]}
                                alt={`Carrusel 2 - Imagen ${index + 9}`}
                                className="w-full h-full object-contain cursor-pointer bg-gray-100"

                              />

                              {/* Botón de configuración en la esquina superior izquierda */}


                              {/* Precio en la esquina inferior derecha (si existe) */}
                              {carouselProductData.carrusel2[index]?.precioActual && (
                                <div className="absolute bottom-1 right-1 bg-black/70 rounded px-2 py-1">
                                  <span className="text-white text-xs font-semibold">
                                    ${carouselProductData.carrusel2[index].precioActual}
                                  </span>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                              <Plus className="w-8 h-8 mb-2" />
                              <span className="text-sm">Agregar producto</span>
                            </div>
                          )}
                        </div>

                        {/* Información del producto debajo de la tarjeta */}
                        {carouselProductData.carrusel2[index] && (
                          <div className="mt-2 text-xs text-gray-300 space-y-1">
                            <div className="font-medium text-gray-400">
                              {carouselProductData.carrusel2[index].categoria} / {carouselProductData.carrusel2[index].subcategoria}
                            </div>
                            <div className="font-semibold text-white truncate">
                              {carouselProductData.carrusel2[index].nombre}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-green-400 font-bold">
                                ${carouselProductData.carrusel2[index].precioActual?.toLocaleString('es-CL')}
                              </span>
                              {carouselProductData.carrusel2[index].precioAnterior && (
                                <span className="text-gray-500 line-through text-[10px]">
                                  ${carouselProductData.carrusel2[index].precioAnterior?.toLocaleString('es-CL')}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Segunda fila - 4 marcos */}
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    {[4, 5, 6, 7].map((index) => (
                      <div key={index} className="relative">
                        {/* Círculo numerado en la esquina superior derecha */}
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold z-10">
                          {index + 13}
                        </div>

                        {/* Marco para imagen */}
                        <div
                          className="aspect-[4/3] bg-gray-700 border-2 border-dashed border-gray-500 rounded-lg hover:border-purple-400 transition-colors cursor-pointer relative overflow-hidden"
                          onClick={() => !carouselImages.carrusel2[index] && openModal(undefined, { carruselType: 'carrusel2', index })}
                        >
                          {carouselImages.carrusel2[index] ? (
                            <>
                              <img
                                src={carouselImages.carrusel2[index]}
                                alt={`Carrusel 2 - Imagen ${index + 13}`}
                                className="w-full h-full object-contain cursor-pointer bg-gray-100"

                              />

                              {/* Botón de configuración en la esquina superior izquierda */}


                              {/* Precio en la esquina inferior derecha (si existe) */}
                              {carouselProductData.carrusel2[index]?.precioActual && (
                                <div className="absolute bottom-1 right-1 bg-black/70 rounded px-2 py-1">
                                  <span className="text-white text-xs font-semibold">
                                    ${carouselProductData.carrusel2[index].precioActual}
                                  </span>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                              <Plus className="w-8 h-8 mb-2" />
                              <span className="text-sm">Agregar producto</span>
                            </div>
                          )}
                        </div>

                        {/* Información del producto debajo de la tarjeta */}
                        {carouselProductData.carrusel2[index] && (
                          <div className="mt-2 text-xs text-gray-300 space-y-1">
                            <div className="font-medium text-gray-400">
                              {carouselProductData.carrusel2[index].categoria} / {carouselProductData.carrusel2[index].subcategoria}
                            </div>
                            <div className="font-semibold text-white truncate">
                              {carouselProductData.carrusel2[index].nombre}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-green-400 font-bold">
                                ${carouselProductData.carrusel2[index].precioActual?.toLocaleString('es-CL')}
                              </span>
                              {carouselProductData.carrusel2[index].precioAnterior && (
                                <span className="text-gray-500 line-through text-[10px]">
                                  ${carouselProductData.carrusel2[index].precioAnterior?.toLocaleString('es-CL')}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mobile Layout - Responsive mode */}
                <div className="md:hidden block">
                  {/* Primera fila - 2 tarjetas */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {[0, 1].map((index) => (
                      <div key={index} className="relative">
                        {/* Círculo numerado en la esquina superior derecha */}
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold z-10">
                          {index + 9}
                        </div>

                        {/* Marco para imagen */}
                        <div
                          className="aspect-[4/3] bg-gray-700 border-2 border-dashed border-gray-500 rounded-lg hover:border-purple-400 transition-colors cursor-pointer relative overflow-hidden"
                          onClick={() => !carouselImages.carrusel2[index] && openModal(undefined, { carruselType: 'carrusel2', index })}
                        >
                          {carouselImages.carrusel2[index] ? (
                            <>
                              <img
                                src={carouselImages.carrusel2[index]}
                                alt={`Carrusel 2 - Imagen ${index + 9}`}
                                className="w-full h-full object-contain cursor-pointer bg-gray-100"

                              />

                              {/* Botón de configuración en la esquina superior izquierda */}


                              {/* Precio en la esquina inferior derecha (si existe) */}
                              {carouselProductData.carrusel2[index]?.precioActual && (
                                <div className="absolute bottom-1 right-1 bg-black/70 rounded px-2 py-1">
                                  <span className="text-white text-xs font-semibold">
                                    ${carouselProductData.carrusel2[index].precioActual}
                                  </span>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                              <Plus className="w-8 h-8 mb-2" />
                              <span className="text-sm">Agregar producto</span>
                            </div>
                          )}
                        </div>

                        {/* Información del producto debajo de la tarjeta */}
                        {carouselProductData.carrusel2[index] && (
                          <div className="mt-2 text-xs text-gray-300 space-y-1">
                            <div className="font-medium text-gray-400">
                              {carouselProductData.carrusel2[index].categoria} / {carouselProductData.carrusel2[index].subcategoria}
                            </div>
                            <div className="font-semibold text-white truncate">
                              {carouselProductData.carrusel2[index].nombre}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-green-400 font-bold">
                                ${carouselProductData.carrusel2[index].precioActual?.toLocaleString('es-CL')}
                              </span>
                              {carouselProductData.carrusel2[index].precioAnterior && (
                                <span className="text-gray-500 line-through text-[10px]">
                                  ${carouselProductData.carrusel2[index].precioAnterior?.toLocaleString('es-CL')}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Segunda fila - 2 tarjetas */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {[2, 3].map((index) => (
                      <div key={index} className="relative">
                        {/* Círculo numerado en la esquina superior derecha */}
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold z-10">
                          {index + 11}
                        </div>

                        {/* Marco para imagen */}
                        <div
                          className="aspect-[4/3] bg-gray-700 border-2 border-dashed border-gray-500 rounded-lg hover:border-purple-400 transition-colors cursor-pointer relative overflow-hidden"
                          onClick={() => !carouselImages.carrusel2[index] && openModal(undefined, { carruselType: 'carrusel2', index })}
                        >
                          {carouselImages.carrusel2[index] ? (
                            <>
                              <img
                                src={carouselImages.carrusel2[index]}
                                alt={`Carrusel 2 - Imagen ${index + 11}`}
                                className="w-full h-full object-contain cursor-pointer bg-gray-100"

                              />

                              {/* Botón de configuración en la esquina superior izquierda */}


                              {/* Precio en la esquina inferior derecha (si existe) */}
                              {carouselProductData.carrusel2[index]?.precioActual && (
                                <div className="absolute bottom-1 right-1 bg-black/70 rounded px-2 py-1">
                                  <span className="text-white text-xs font-semibold">
                                    ${carouselProductData.carrusel2[index].precioActual}
                                  </span>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                              <Plus className="w-8 h-8 mb-2" />
                              <span className="text-sm">Agregar producto</span>
                            </div>
                          )}
                        </div>

                        {/* Información del producto debajo de la tarjeta */}
                        {carouselProductData.carrusel2[index] && (
                          <div className="mt-2 text-xs text-gray-300 space-y-1">
                            <div className="font-medium text-gray-400">
                              {carouselProductData.carrusel2[index].categoria} / {carouselProductData.carrusel2[index].subcategoria}
                            </div>
                            <div className="font-semibold text-white truncate">
                              {carouselProductData.carrusel2[index].nombre}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-green-400 font-bold">
                                ${carouselProductData.carrusel2[index].precioActual?.toLocaleString('es-CL')}
                              </span>
                              {carouselProductData.carrusel2[index].precioAnterior && (
                                <span className="text-gray-500 line-through text-[10px]">
                                  ${carouselProductData.carrusel2[index].precioAnterior?.toLocaleString('es-CL')}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Tercera fila - 2 tarjetas */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {[4, 5].map((index) => (
                      <div key={index} className="relative">
                        {/* Círculo numerado en la esquina superior derecha */}
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold z-10">
                          {index + 13}
                        </div>

                        {/* Marco para imagen */}
                        <div
                          className="aspect-[4/3] bg-gray-700 border-2 border-dashed border-gray-500 rounded-lg hover:border-purple-400 transition-colors cursor-pointer relative overflow-hidden"
                          onClick={() => !carouselImages.carrusel2[index] && openModal(undefined, { carruselType: 'carrusel2', index })}
                        >
                          {carouselImages.carrusel2[index] ? (
                            <>
                              <img
                                src={carouselImages.carrusel2[index]}
                                alt={`Carrusel 2 - Imagen ${index + 13}`}
                                className="w-full h-full object-contain cursor-pointer bg-gray-100"

                              />

                              {/* Botón de configuración en la esquina superior izquierda */}


                              {/* Precio en la esquina inferior derecha (si existe) */}
                              {carouselProductData.carrusel2[index]?.precioActual && (
                                <div className="absolute bottom-1 right-1 bg-black/70 rounded px-2 py-1">
                                  <span className="text-white text-xs font-semibold">
                                    ${carouselProductData.carrusel2[index].precioActual}
                                  </span>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                              <Plus className="w-8 h-8 mb-2" />
                              <span className="text-sm">Agregar producto</span>
                            </div>
                          )}
                        </div>

                        {/* Información del producto debajo de la tarjeta */}
                        {carouselProductData.carrusel2[index] && (
                          <div className="mt-2 text-xs text-gray-300 space-y-1">
                            <div className="font-medium text-gray-400">
                              {carouselProductData.carrusel2[index].categoria} / {carouselProductData.carrusel2[index].subcategoria}
                            </div>
                            <div className="font-semibold text-white truncate">
                              {carouselProductData.carrusel2[index].nombre}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-green-400 font-bold">
                                ${carouselProductData.carrusel2[index].precioActual?.toLocaleString('es-CL')}
                              </span>
                              {carouselProductData.carrusel2[index].precioAnterior && (
                                <span className="text-gray-500 line-through text-[10px]">
                                  ${carouselProductData.carrusel2[index].precioAnterior?.toLocaleString('es-CL')}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Cuarta fila - 2 tarjetas */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {[6, 7].map((index) => (
                      <div key={index} className="relative">
                        {/* Círculo numerado en la esquina superior derecha */}
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold z-10">
                          {index + 15}
                        </div>

                        {/* Marco para imagen */}
                        <div
                          className="aspect-[4/3] bg-gray-700 border-2 border-dashed border-gray-500 rounded-lg hover:border-purple-400 transition-colors cursor-pointer relative overflow-hidden"
                          onClick={() => !carouselImages.carrusel2[index] && openModal(undefined, { carruselType: 'carrusel2', index })}
                        >
                          {carouselImages.carrusel2[index] ? (
                            <>
                              <img
                                src={carouselImages.carrusel2[index]}
                                alt={`Carrusel 2 - Imagen ${index + 15}`}
                                className="w-full h-full object-contain cursor-pointer bg-gray-100"

                              />



                              {/* Precio en la esquina inferior derecha (si existe) */}
                              {carouselProductData.carrusel2[index]?.precioActual && (
                                <div className="absolute bottom-1 right-1 bg-black/70 rounded px-2 py-1">
                                  <span className="text-white text-xs font-semibold">
                                    ${carouselProductData.carrusel2[index].precioActual}
                                  </span>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                              <Plus className="w-8 h-8 mb-2" />
                              <span className="text-sm">Agregar producto</span>
                            </div>
                          )}
                        </div>

                        {/* Información del producto debajo de la tarjeta */}
                        {carouselProductData.carrusel2[index] && (
                          <div className="mt-2 text-xs text-gray-300 space-y-1">
                            <div className="font-medium text-gray-400">
                              {carouselProductData.carrusel2[index].categoria} / {carouselProductData.carrusel2[index].subcategoria}
                            </div>
                            <div className="font-semibold text-white truncate">
                              {carouselProductData.carrusel2[index].nombre}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-green-400 font-bold">
                                ${carouselProductData.carrusel2[index].precioActual?.toLocaleString('es-CL')}
                              </span>
                              {carouselProductData.carrusel2[index].precioAnterior && (
                                <span className="text-gray-500 line-through text-[10px]">
                                  ${carouselProductData.carrusel2[index].precioAnterior?.toLocaleString('es-CL')}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>



                {/* Botón Guardar Cambios */}
                <div className="flex justify-end md:mt-6 mt-4">
                  <Button
                    onClick={() => handleSaveCarousel('carrusel2')}
                    className="bg-purple-600 hover:bg-purple-700 text-white md:px-6 px-4 md:py-2 py-1.5 md:text-sm text-xs"
                  >
                    Guardar Cambios
                  </Button>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

      </div>

      {/* TEMPORALMENTE OCULTO - Sección: Gestión de Banner */}
      <div className={`px-6 py-8 hidden`}>
        <div className="flex items-center gap-3">
          <h1 className="text-lg md:text-3xl font-bold text-white mb-2">Gestión de Banner</h1>
          <button
            onClick={() => openHelpPopup('gestion-banner')}
            className="mb-2 w-6 h-6 md:w-8 md:h-8 rounded-full border border-yellow-400 bg-transparent hover:bg-yellow-400/10 transition-colors flex items-center justify-center"
          >
            <span className="text-yellow-400 font-bold text-sm md:text-base">?</span>
          </button>
        </div>
        <p className="text-gray-400 text-xs md:text-base">Configuración de banners promocionales</p>
      </div>

      {/* TEMPORALMENTE OCULTO - Container Gestión de Banner */}
      <div className={`px-6 pb-4 hidden relative`}>
        {/* Overlay Message - PREMIUM FEATURE (commented for now, will be used later) */}
        {/* <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="bg-white border-2 border-purple-400 rounded-lg md:px-6 px-4 md:py-5 py-4 shadow-lg text-center md:max-w-sm max-w-[300px]">
            <h3 className="md:text-lg text-base font-bold text-gray-800 md:mb-3 mb-2">🎯 Gestión de Banners</h3>
            <p className="md:text-sm text-xs text-gray-700 md:mb-3 mb-2">Sistema de banners publicitarios que te permite crear y gestionar anuncios visuales prominentes en zonas estratégicas de tu página. Ideal para promocionar ofertas especiales, productos destacados o eventos importantes.</p>
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg md:py-2 py-1.5 md:px-3 px-2 border border-purple-300">
              <p className="md:text-xs text-[10px] font-semibold text-purple-800">✨ Disponible para clientes Premium</p>
            </div>
          </div>
        </div> */}

        <div className="md:bg-transparent md:border-0 md:rounded-none md:p-0 bg-gray-800 border border-gray-700 rounded-lg p-4 relative">{/* banner-distortion class removed - PREMIUM FEATURE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
            {/* Columna 1 - Banner 1 */}
            <div className="relative bg-gray-700 border border-gray-600 rounded-lg p-3 md:p-4">
              {/* Número identificador */}
              <div className="absolute -top-2 -right-2 bg-purple-600 text-white rounded-full w-6 h-6 md:w-8 md:h-8 flex items-center justify-center text-xs md:text-sm font-bold z-10">
                1
              </div>

              {/* Marco rectangular para imagen */}
              <div className="relative bg-gray-700 border-2 border-dashed border-gray-500 rounded-lg h-24 md:h-48 flex items-center justify-center mb-3 md:mb-4 hover:border-purple-400 transition-colors cursor-pointer overflow-hidden">
                {bannerImages[0] ? (
                  <img
                    src={bannerImages[0]}
                    alt="Banner 1"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleBannerImageUpload(0, e)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="text-center">
                      <Plus className="text-xl md:text-4xl text-gray-400 mb-1 md:mb-2" />
                      <p className="text-gray-400 text-xs md:text-sm">Agregar imagen</p>
                    </div>
                  </>
                )}
              </div>

              {/* Precios y botones responsive */}
              <div className="space-y-2 md:space-y-0 md:flex md:items-end md:justify-between">
                {/* Fila de precios */}
                <div className="flex gap-2 md:gap-4 justify-center md:justify-start">
                  <div className="text-center">
                    <label className="block text-xs text-gray-400 mb-1">Precio actual</label>
                    <input
                      type="text"
                      placeholder="$0.00"
                      value={bannerPrices.banner1.current}
                      onChange={(e) => setBannerPrices(prev => ({
                        ...prev,
                        banner1: { ...prev.banner1, current: e.target.value }
                      }))}
                      className="bg-gray-600 border border-gray-500 rounded px-1.5 md:px-3 py-0.5 md:py-2 text-white text-xs md:text-sm w-16 md:w-24 text-center"
                    />
                  </div>
                  <div className="text-center">
                    <label className="block text-xs text-gray-400 mb-1">Precio anterior</label>
                    <input
                      type="text"
                      placeholder="$0.00"
                      value={bannerPrices.banner1.previous}
                      onChange={(e) => setBannerPrices(prev => ({
                        ...prev,
                        banner1: { ...prev.banner1, previous: e.target.value }
                      }))}
                      className="bg-gray-600 border border-gray-500 rounded px-1.5 md:px-3 py-0.5 md:py-2 text-white text-xs md:text-sm w-16 md:w-24 text-center"
                    />
                  </div>
                </div>

                {/* Botones debajo en mobile, a la derecha en desktop */}
                <div className="flex gap-2 justify-center md:justify-end">
                  <button
                    onClick={() => handleDeleteBanner(0)}
                    className="bg-red-600 hover:bg-red-700 text-white px-2 md:px-4 py-1 text-xs md:text-sm rounded transition-colors"
                  >
                    Eliminar
                  </button>
                  <button
                    onClick={() => handleSaveBanner(0)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-2 md:px-4 py-1 text-xs md:text-sm rounded transition-colors"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </div>

            {/* Columna 2 - Banner 2 */}
            <div className="relative bg-gray-700 border border-gray-600 rounded-lg p-3 md:p-4">
              {/* Número identificador */}
              <div className="absolute -top-2 -right-2 bg-purple-600 text-white rounded-full w-6 h-6 md:w-8 md:h-8 flex items-center justify-center text-xs md:text-sm font-bold z-10">
                2
              </div>

              {/* Marco rectangular para imagen */}
              <div className="relative bg-gray-700 border-2 border-dashed border-gray-500 rounded-lg h-24 md:h-48 flex items-center justify-center mb-3 md:mb-4 hover:border-purple-400 transition-colors cursor-pointer overflow-hidden">
                {bannerImages[1] ? (
                  <img
                    src={bannerImages[1]}
                    alt="Banner 2"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleBannerImageUpload(1, e)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="text-center">
                      <Plus className="text-xl md:text-4xl text-gray-400 mb-1 md:mb-2" />
                      <p className="text-gray-400 text-xs md:text-sm">Agregar imagen</p>
                    </div>
                  </>
                )}
              </div>

              {/* Precios y botones responsive */}
              <div className="space-y-2 md:space-y-0 md:flex md:items-end md:justify-between">
                {/* Fila de precios */}
                <div className="flex gap-2 md:gap-4 justify-center md:justify-start">
                  <div className="text-center">
                    <label className="block text-xs text-gray-400 mb-1">Precio actual</label>
                    <input
                      type="text"
                      placeholder="$0.00"
                      value={bannerPrices.banner2.current}
                      onChange={(e) => setBannerPrices(prev => ({
                        ...prev,
                        banner2: { ...prev.banner2, current: e.target.value }
                      }))}
                      className="bg-gray-600 border border-gray-500 rounded px-1.5 md:px-3 py-0.5 md:py-2 text-white text-xs md:text-sm w-16 md:w-24 text-center"
                    />
                  </div>
                  <div className="text-center">
                    <label className="block text-xs text-gray-400 mb-1">Precio anterior</label>
                    <input
                      type="text"
                      placeholder="$0.00"
                      value={bannerPrices.banner2.previous}
                      onChange={(e) => setBannerPrices(prev => ({
                        ...prev,
                        banner2: { ...prev.banner2, previous: e.target.value }
                      }))}
                      className="bg-gray-600 border border-gray-500 rounded px-1.5 md:px-3 py-0.5 md:py-2 text-white text-xs md:text-sm w-16 md:w-24 text-center"
                    />
                  </div>
                </div>

                {/* Botones debajo en mobile, a la derecha en desktop */}
                <div className="flex gap-2 justify-center md:justify-end">
                  <button
                    onClick={() => handleDeleteBanner(1)}
                    className="bg-red-600 hover:bg-red-700 text-white px-2 md:px-4 py-1 text-xs md:text-sm rounded transition-colors"
                  >
                    Eliminar
                  </button>
                  <button
                    onClick={() => handleSaveBanner(1)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-2 md:px-4 py-1 text-xs md:text-sm rounded transition-colors"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popup de Información del Producto */}
      <Dialog open={selectedProducto !== null} onOpenChange={(open) => !open && setSelectedProducto(null)}>
        <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700 text-white md:p-6 p-4">
          {/* Título oculto para accesibilidad */}
          {selectedProducto && (
            <VisuallyHidden>
              <DialogTitle>{selectedProducto.nombre}</DialogTitle>
            </VisuallyHidden>
          )}

          {/* Botón cerrar */}
          <button
            onClick={() => setSelectedProducto(null)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-10"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-white" />
            <span className="sr-only">Cerrar</span>
          </button>

          {selectedProducto && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:p-6 p-2">
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
                <div className="bg-gray-700 rounded-lg md:p-4 p-3 space-y-3">
                  {/* Iconos de Contacto Clickeables en una sola línea */}
                  {(businessInfo.telefono || businessInfo.whatsapp || businessInfo.email || businessInfo.direccion) && (
                    <div className="flex gap-3 justify-center">
                      {/* Icono de Teléfono Clickeable */}
                      {businessInfo.telefono && (
                        <a
                          href={`tel:${businessInfo.telefono}`}
                          className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 bg-blue-600 hover:bg-blue-500 rounded-full transition-colors cursor-pointer"
                          title={`Llamar a ${businessInfo.telefono}`}
                        >
                          <Phone className="w-3 h-3 md:w-4 md:h-4 text-white" />
                        </a>
                      )}

                      {/* Icono de WhatsApp Clickeable */}
                      {businessInfo.whatsapp && (
                        <a
                          href={`https://wa.me/${businessInfo.whatsapp.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 bg-green-600 hover:bg-green-500 rounded-full transition-colors cursor-pointer"
                          title={`Enviar WhatsApp a ${businessInfo.whatsapp}`}
                        >
                          <MessageCircle className="w-3 h-3 md:w-4 md:h-4 text-white" />
                        </a>
                      )}

                      {/* Icono de Email Clickeable */}
                      {businessInfo.email && (
                        <a
                          href={`mailto:${businessInfo.email}`}
                          className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 bg-purple-600 hover:bg-purple-500 rounded-full transition-colors cursor-pointer"
                          title={`Enviar email a ${businessInfo.email}`}
                        >
                          <Mail className="w-3 h-3 md:w-4 md:h-4 text-white" />
                        </a>
                      )}

                      {/* Icono de Ubicación Clickeable */}
                      {businessInfo.direccion && (
                        <a
                          href={`https://www.mapcity.com/search?q=${encodeURIComponent(businessInfo.direccion)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 bg-red-600 hover:bg-red-500 rounded-full transition-colors cursor-pointer"
                          title={`Ver ubicación: ${businessInfo.direccion}`}
                        >
                          <MapPin className="w-3 h-3 md:w-4 md:h-4 text-white" />
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* Información en 2 columnas para modo responsive */}
                <div className="md:hidden grid grid-cols-2 gap-4 md:p-4 p-2">
                  {/* Columna Izquierda - Información principal */}
                  <div className="space-y-2 md:p-2 p-1">
                    {/* Nombre del Negocio - ARRIBA DEL PRODUCTO CON SUBRAYADO */}
                    {businessInfo.nombre && (
                      <h3 className="text-xs font-medium text-gray-300 underline decoration-gray-500">
                        {businessInfo.nombre}
                      </h3>
                    )}

                    {/* Título del producto - más chico */}
                    <h2 className="text-sm font-bold text-white leading-tight">
                      {selectedProducto.nombre}
                    </h2>

                    {/* Categoría y Subcategoría */}
                    <div className="flex items-center gap-1 text-[9px] text-gray-400">
                      <span>{getCategoriaLabel(selectedProducto.categoria)}</span>
                      <span>/</span>
                      <span>{getSubcategoriaLabel(selectedProducto.subcategoria)}</span>
                    </div>

                    {/* Descripción - más pequeña */}
                    <div>
                      <p className="text-gray-300 text-[0.6rem] leading-snug text-justify">
                        {selectedProducto.descripcion || 'Sin descripción disponible.'}
                      </p>
                    </div>

                    {/* Precios */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-purple-400">
                        ${selectedProducto.precioActual}
                      </span>
                      {selectedProducto.precioAnterior && (
                        <span className="text-[0.6rem] text-gray-400 line-through">
                          ${selectedProducto.precioAnterior}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Columna Derecha - Horarios y características */}
                  <div className="space-y-3 md:p-2 p-1">
                    {/* Horarios de Atención */}
                    {(businessInfo.horarios.lunesViernes.inicio || businessInfo.horarios.sabado.inicio || businessInfo.horarios.domingo.inicio) && (
                      <div>
                        <h5 className="text-[0.65rem] font-medium text-gray-400 mb-1">Horarios:</h5>
                        <div className="flex flex-col gap-1 text-[0.6rem]">
                          {businessInfo.horarios.lunesViernes.inicio && businessInfo.horarios.lunesViernes.fin && (
                            <div className="flex justify-between">
                              <span className="text-gray-300">L-V:</span>
                              <span className="text-gray-400">{businessInfo.horarios.lunesViernes.inicio}-{businessInfo.horarios.lunesViernes.fin}</span>
                            </div>
                          )}
                          {businessInfo.horarios.sabado.inicio && businessInfo.horarios.sabado.fin && (
                            <div className="flex justify-between">
                              <span className="text-gray-300">S:</span>
                              <span className="text-gray-400">{businessInfo.horarios.sabado.inicio}-{businessInfo.horarios.sabado.fin}</span>
                            </div>
                          )}
                          {businessInfo.horarios.domingo.inicio && businessInfo.horarios.domingo.fin && (
                            <div className="flex justify-between">
                              <span className="text-gray-300">D:</span>
                              <span className="text-gray-400">{businessInfo.horarios.domingo.inicio}-{businessInfo.horarios.domingo.fin}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Información adicional del producto */}
                    <div className="space-y-1 text-[0.6rem]">
                      {/* Tallas de Calzado */}
                      {selectedProducto.tallasCalzado && selectedProducto.tallasCalzado.length > 0 && (
                        <div className="flex items-start gap-1">
                          <span className="text-gray-400">Tallas Calzado:</span>
                          <span className="text-gray-300">{selectedProducto.tallasCalzado.join(', ')}</span>
                        </div>
                      )}

                      {/* Tallas de Ropa */}
                      {selectedProducto.tallasRopa && selectedProducto.tallasRopa.length > 0 && (
                        <div className="flex items-start gap-1">
                          <span className="text-gray-400">Tallas Ropa:</span>
                          <span className="text-gray-300">{selectedProducto.tallasRopa.join(', ')}</span>
                        </div>
                      )}

                      {/* Género */}
                      {selectedProducto.genero && selectedProducto.genero !== 'generico' && (
                        <div className="flex items-start gap-1">
                          <span className="text-gray-400">Género:</span>
                          <span className="text-gray-300 capitalize">{selectedProducto.genero}</span>
                        </div>
                      )}

                      {/* Medidas */}
                      {selectedProducto.medidas && (
                        <div className="flex items-start gap-1">
                          <span className="text-gray-400">Medidas:</span>
                          <span className="text-gray-300">
                            {selectedProducto.medidas} {selectedProducto.unidadMedida || 'cm'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Columna Derecha - Información (50%) - Solo visible en desktop */}
              <div className="hidden md:block col-span-1 space-y-2 md:p-2 p-1">
                {/* Nombre del Negocio - ARRIBA DEL PRODUCTO CON SUBRAYADO */}
                {businessInfo.nombre && (
                  <h3 className="text-xs md:text-sm font-medium text-gray-300 underline decoration-gray-500">
                    {businessInfo.nombre}
                  </h3>
                )}

                {/* Título del producto */}
                <h2 className="text-base md:text-lg font-bold text-white leading-tight mb-1">
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
                  <p className="text-gray-300 text-[0.65rem] md:text-xs leading-snug text-justify">
                    {selectedProducto.descripcion || 'Sin descripción disponible.'}
                  </p>
                </div>

                {/* Precios - más pequeños */}
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm md:text-base font-bold text-purple-400">
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





      {/* Modal de Confirmación de Eliminación */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white md:max-w-md max-w-[90vw] mx-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-center mb-4">
              Confirmar Eliminación
            </DialogTitle>
          </DialogHeader>

          <div className="text-center space-y-4">
            {/* Ícono de advertencia */}
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>

            {/* Mensaje principal */}
            <div>
              <h3 className="text-lg font-medium text-white mb-2">
                ¿Estás seguro?
              </h3>
              <p className="text-gray-300 text-sm">
                Esta acción eliminará permanentemente el producto:
              </p>
              {productToDelete && (
                <p className="text-purple-400 font-medium mt-2">
                  "{productToDelete.producto.nombre}"
                </p>
              )}
              <p className="text-gray-400 text-xs mt-3">
                Esta acción no se puede deshacer.
              </p>
            </div>

            {/* Botones */}
            <div className="flex gap-3 justify-center pt-4">
              <Button
                variant="outline"
                onClick={cancelarEliminacion}
                className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600 px-6 py-2"
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmarEliminacion}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2"
              >
                Sí, Eliminar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      {/* Original footer - hidden in mobile since we show a copy after the menu */}
      <footer className="relative text-white py-8 px-6 mt-12 shadow-2xl hidden md:block" style={{ background: 'linear-gradient(90deg, #3b0764 0%, #4c1d95 20%, #6d28d9 40%, var(--yellow-accent) 100%)' }}>
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
                  <button
                    onClick={() => setShowPrivacyPopup(true)}
                    className="flex items-center gap-1 md:gap-2 text-primary-foreground/80 text-xs hover:text-yellow-300 transition-colors duration-200"
                  >
                    <Shield className="w-3 h-3 md:w-4 md:h-4 text-yellow-300" />
                    Privacidad
                  </button>
                  <button
                    onClick={() => setShowCookiesPopup(true)}
                    className="flex items-center gap-1 md:gap-2 text-primary-foreground/80 text-xs hover:text-yellow-300 transition-colors duration-200"
                  >
                    <Cookie className="w-3 h-3 md:w-4 md:h-4 text-yellow-300" />
                    Cookies
                  </button>
                  <button
                    onClick={() => setShowSecurityPopup(true)}
                    className="flex items-center gap-1 md:gap-2 text-primary-foreground/80 text-xs hover:text-yellow-300 transition-colors duration-200"
                  >
                    <Shield className="w-3 h-3 md:w-4 md:h-4 text-yellow-300" />
                    Seguridad
                  </button>
                  <button
                    onClick={() => setShowTermsPopup(true)}
                    className="flex items-center gap-1 md:gap-2 text-primary-foreground/80 text-xs hover:text-yellow-300 transition-colors duration-200"
                  >
                    <FileText className="w-3 h-3 md:w-4 md:h-4 text-yellow-300" />
                    Condiciones y términos
                  </button>
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
                  <button
                    onClick={() => setShowAboutUsPopup(true)}
                    className="flex items-center gap-1 md:gap-2 text-primary-foreground/80 text-xs hover:text-yellow-300 transition-colors duration-200"
                  >
                    <Users className="w-3 h-3 md:w-4 md:h-4 text-yellow-300" />
                    Sobre Nosotros
                  </button>
                  <a href="#" className="flex items-center gap-1 md:gap-2 text-primary-foreground/80 text-xs hover:text-yellow-300 transition-colors duration-200">
                    <Store className="w-3 h-3 md:w-4 md:h-4 text-yellow-300" />
                    Registra tu Negocio
                  </a>
                  <button
                    onClick={() => setShowFaqPopup(true)}
                    className="flex items-center gap-1 md:gap-2 text-primary-foreground/80 text-xs hover:text-yellow-300 transition-colors duration-200"
                  >
                    <HelpCircle className="w-3 h-3 md:w-4 md:h-4 text-yellow-300" />
                    Preguntas
                  </button>
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

      {/* Modal de Ayuda */}
      <Dialog open={showHelpPopup} onOpenChange={(open) => {
        if (!open) {
          closeHelpPopup()
        }
      }}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white md:max-w-2xl max-w-[95vw] md:max-h-[80vh] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="md:text-xl text-lg font-semibold text-yellow-400 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 md:w-6 md:h-6" />
              {helpContent?.title}
            </DialogTitle>
          </DialogHeader>

          <div className="md:mt-4 mt-3">
            <p className="text-gray-300 md:text-base text-sm leading-relaxed text-justify">
              {helpContent?.content}
            </p>
          </div>

          <div className="flex justify-end mt-6">
            <Button
              onClick={closeHelpPopup}
              className="bg-yellow-600 hover:bg-yellow-700 text-white md:px-6 px-4 md:py-2 py-1.5 md:text-sm text-xs"
            >
              Entendido
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mobile-only footer - appears at the end */}
      <div ref={footerRef} className="md:hidden block bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-white py-6 px-6">
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
              </div>

              {/* Columna 2 - Avisos Legales (intercambiado con Contacto) */}
              <div className="text-left">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleFooterSection('avisos-legales')}
                >
                  <h3 className="text-sm md:text-lg font-semibold text-white mb-3 md:mb-4 border-b border-yellow-400/30 pb-2 flex-1">
                    Avisos Legales
                  </h3>
                  <ChevronDown
                    className={`w-4 h-4 text-yellow-300 transition-transform duration-300 mb-3 md:mb-4 ${
                      openFooterSection === 'avisos-legales' ? 'rotate-180' : ''
                    }`}
                  />
                </div>
                <div
                  className={`space-y-1 md:space-y-2 overflow-hidden transition-all duration-300 ${
                    openFooterSection === 'avisos-legales' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <button
                    onClick={() => setShowPrivacyPopup(true)}
                    className="flex items-center gap-1 md:gap-2 text-primary-foreground/80 text-xs hover:text-yellow-300 transition-colors duration-200"
                  >
                    <Shield className="w-3 h-3 md:w-4 md:h-4 text-yellow-300" />
                    Privacidad
                  </button>
                  <button
                    onClick={() => setShowCookiesPopup(true)}
                    className="flex items-center gap-1 md:gap-2 text-primary-foreground/80 text-xs hover:text-yellow-300 transition-colors duration-200"
                  >
                    <Cookie className="w-3 h-3 md:w-4 md:h-4 text-yellow-300" />
                    Cookies
                  </button>
                  <button
                    onClick={() => setShowSecurityPopup(true)}
                    className="flex items-center gap-1 md:gap-2 text-primary-foreground/80 text-xs hover:text-yellow-300 transition-colors duration-200"
                  >
                    <Shield className="w-3 h-3 md:w-4 md:h-4 text-yellow-300" />
                    Seguridad
                  </button>
                  <button
                    onClick={() => setShowTermsPopup(true)}
                    className="flex items-center gap-1 md:gap-2 text-primary-foreground/80 text-xs hover:text-yellow-300 transition-colors duration-200"
                  >
                    <FileText className="w-3 h-3 md:w-4 md:h-4 text-yellow-300" />
                    Condiciones y términos
                  </button>
                </div>
              </div>
            </div>

            {/* Segunda fila en móvil: Información y Contacto */}
            <div className="grid grid-cols-2 gap-6 md:gap-8 md:col-span-2">

              {/* Columna 3 - Información */}
              <div className="text-left">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleFooterSection('informacion')}
                >
                  <h3 className="text-sm md:text-lg font-semibold text-white mb-3 md:mb-4 border-b border-yellow-400/30 pb-2 flex-1">
                    Información
                  </h3>
                  <ChevronDown
                    className={`w-4 h-4 text-yellow-300 transition-transform duration-300 mb-3 md:mb-4 ${
                      openFooterSection === 'informacion' ? 'rotate-180' : ''
                    }`}
                  />
                </div>
                <div
                  className={`space-y-1 md:space-y-2 overflow-hidden transition-all duration-300 ${
                    openFooterSection === 'informacion' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <button
                    onClick={() => setShowAboutUsPopup(true)}
                    className="flex items-center gap-1 md:gap-2 text-primary-foreground/80 text-xs hover:text-yellow-300 transition-colors duration-200"
                  >
                    <Users className="w-3 h-3 md:w-4 md:h-4 text-yellow-300" />
                    Sobre Nosotros
                  </button>
                  <a href="#" className="flex items-center gap-1 md:gap-2 text-primary-foreground/80 text-xs hover:text-yellow-300 transition-colors duration-200">
                    <Store className="w-3 h-3 md:w-4 md:h-4 text-yellow-300" />
                    Registra tu Negocio
                  </a>
                  <button
                    onClick={() => setShowFaqPopup(true)}
                    className="flex items-center gap-1 md:gap-2 text-primary-foreground/80 text-xs hover:text-yellow-300 transition-colors duration-200"
                  >
                    <HelpCircle className="w-3 h-3 md:w-4 md:h-4 text-yellow-300" />
                    Preguntas
                  </button>
                </div>
              </div>

              {/* Columna 4 - Contacto (intercambiado con Avisos Legales) */}
              <div className="text-left">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleFooterSection('contacto')}
                >
                  <h3 className="text-sm md:text-lg font-semibold text-white mb-3 md:mb-4 border-b border-yellow-400/30 pb-2 flex-1">
                    Contacto
                  </h3>
                  <ChevronDown
                    className={`w-4 h-4 text-yellow-300 transition-transform duration-300 mb-3 md:mb-4 ${
                      openFooterSection === 'contacto' ? 'rotate-180' : ''
                    }`}
                  />
                </div>
                <div
                  className={`space-y-2 md:space-y-3 overflow-hidden transition-all duration-300 ${
                    openFooterSection === 'contacto' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
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
      </div>

      {/* TEMPORALMENTE OCULTO - Botón flotante para visualizar tienda */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden">
        <div className="relative">
          {/* Tooltip */}
          {showStoreTooltip && (
            <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-gray-800 text-white px-3 py-2 rounded-lg shadow-xl border border-yellow-400/50">
              <span className="text-sm font-medium">Visualiza tu tienda</span>
              {/* Flecha del tooltip */}
              <div className="absolute left-full top-1/2 -translate-y-1/2 -ml-px">
                <div className="border-8 border-transparent border-l-gray-800"></div>
              </div>
            </div>
          )}

          {/* Botón */}
          <button
            onClick={() => {
              // TODO: Aquí deberías usar el ID real de la tienda del usuario
              // Por ahora usaremos 'beautyplus' como ejemplo
              window.open('/tienda/beautyplus', '_blank')
            }}
            onMouseEnter={() => setShowStoreTooltip(true)}
            onMouseLeave={() => setShowStoreTooltip(false)}
            className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700 hover:from-purple-700 hover:via-purple-600 hover:to-purple-800 rounded-full shadow-2xl border-2 border-yellow-400 transition-all duration-300 hover:scale-110 hover:shadow-yellow-400/50"
            aria-label="Visualizar tienda"
          >
            <Store className="w-7 h-7 text-yellow-300" />
          </button>
        </div>
      </div>

      {/* Popup de Políticas de Privacidad */}
      <PrivacyPolicyPopup
        isOpen={showPrivacyPopup}
        onClose={() => setShowPrivacyPopup(false)}
      />

      {/* Popup de Políticas de Cookies */}
      <CookiesPolicyPopup
        isOpen={showCookiesPopup}
        onClose={() => setShowCookiesPopup(false)}
      />

      {/* Popup de Política de Seguridad */}
      <SecurityPolicyPopup
        isOpen={showSecurityPopup}
        onClose={() => setShowSecurityPopup(false)}
      />

      {/* Popup de Términos y Condiciones */}
      <TermsConditionsPopup
        isOpen={showTermsPopup}
        onClose={() => setShowTermsPopup(false)}
      />

      {/* Popup de Sobre Nosotros */}
      <AboutUsPopup
        isOpen={showAboutUsPopup}
        onClose={() => setShowAboutUsPopup(false)}
      />

      {/* Popup de Preguntas Frecuentes */}
      <FaqPopup
        isOpen={showFaqPopup}
        onClose={() => setShowFaqPopup(false)}
      />
    </div>
  )
}