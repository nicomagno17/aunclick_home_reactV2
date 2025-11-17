'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Phone, MessageCircle, Mail, MapPin, Clock, Menu } from 'lucide-react'
import { Product, StoreInfo } from '@/types/product'
import { ProductInfoPopup } from '@/components/product-info-popup'
import { StoreCarousel } from '@/components/store-carousel'
import { StoreBanners } from '@/components/store-banners'
import { ProductRow } from '@/components/product-row'
import { CategorySidebar } from '@/components/category-sidebar'

// Mapeo de tiendas para el periodo de pruebas (temporal - vendrá desde DB)
// TODO: Cuando se conecte la BD, obtener esta información desde la API usando el userId de la ruta
const STORES_DATA: Record<string, StoreInfo> = {
  'apple-store': {
    nombre: 'Apple Store',
    logo: 'https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=100&h=100&fit=crop',
    telefono: '+56 9 8765 4321',
    whatsapp: '56987654321',
    email: 'contacto@applestore.cl',
    direccion: 'Av. Providencia 456, Villarrica',
    horarios: {
      'L-V': '10:00 - 20:00',
      'S': '10:00 - 18:00',
      'D': '11:00 - 15:00'
    },
    banner1: {
      imagen: "https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=1200&h=300&fit=crop",
      precioActual: 899990,
      precioAnterior: 1099990
    },
    banner2: {
      imagen: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=300&fit=crop",
      precioActual: 1299990,
      precioAnterior: 1599990
    },
    carousels: [
      {
        products: [
          {
            id: 'apple-featured-1',
            name: 'iPhone 15 Pro',
            price: 1299990,
            originalPrice: 1499990,
            image: 'https://images.unsplash.com/photo-1696446702098-689c696fe90e?w=500',
            category: 'smartphones',
            source: 'Apple Store'
          },
          {
            id: 'apple-featured-2',
            name: 'MacBook Air M2',
            price: 999990,
            originalPrice: 1199990,
            image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500',
            category: 'laptops',
            source: 'Apple Store'
          },
          {
            id: 'apple-featured-3',
            name: 'iPad Pro 12.9"',
            price: 899990,
            originalPrice: 1099990,
            image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500',
            category: 'tablets',
            source: 'Apple Store'
          },
          {
            id: 'apple-featured-4',
            name: 'AirPods Pro',
            price: 249990,
            originalPrice: 299990,
            image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=500',
            category: 'audio',
            source: 'Apple Store'
          },
          {
            id: 'apple-featured-5',
            name: 'Apple Watch Series 9',
            price: 399990,
            originalPrice: 499990,
            image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500',
            category: 'wearables',
            source: 'Apple Store'
          },
          {
            id: 'apple-featured-6',
            name: 'Magic Keyboard',
            price: 149990,
            image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
            category: 'accessories',
            source: 'Apple Store'
          }
        ]
      },
      {
        products: [
          {
            id: 'apple-promo-1',
            name: 'iPhone 14',
            price: 799990,
            originalPrice: 999990,
            image: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=500',
            category: 'smartphones',
            source: 'Apple Store'
          },
          {
            id: 'apple-promo-2',
            name: 'HomePod mini',
            price: 99990,
            originalPrice: 129990,
            image: 'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=500',
            category: 'audio',
            source: 'Apple Store'
          },
          {
            id: 'apple-promo-3',
            name: 'AirTag 4-Pack',
            price: 89990,
            image: 'https://images.unsplash.com/photo-1625869016774-f1936c8f7e79?w=500',
            category: 'accessories',
            source: 'Apple Store'
          },
          {
            id: 'apple-promo-4',
            name: 'MagSafe Charger',
            price: 39990,
            image: 'https://images.unsplash.com/photo-1593642532400-2682810df593?w=500',
            category: 'accessories',
            source: 'Apple Store'
          },
          {
            id: 'apple-promo-5',
            name: 'Apple Pencil 2',
            price: 129990,
            originalPrice: 149990,
            image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=500',
            category: 'accessories',
            source: 'Apple Store'
          },
          {
            id: 'apple-promo-6',
            name: 'Mac Mini M2',
            price: 599990,
            originalPrice: 699990,
            image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500',
            category: 'computers',
            source: 'Apple Store'
          }
        ]
      }
    ]
  },
  'nike-store': {
    nombre: 'Nike Store',
    logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop',
    telefono: '+56 9 7654 3210',
    whatsapp: '56976543210',
    email: 'contacto@nikestore.cl',
    direccion: 'Av. Los Deportes 789, Villarrica',
    horarios: {
      'L-V': '09:00 - 19:00',
      'S': '10:00 - 16:00',
      'D': 'Cerrado'
    },
    banner1: {
      imagen: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&h=300&fit=crop",
      precioActual: 89990,
      precioAnterior: 119990
    },
    banner2: {
      imagen: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1200&h=300&fit=crop",
      precioActual: 129990,
      precioAnterior: 159990
    },
    carousels: [
      {
        products: [
          {
            id: 'nike-featured-1',
            name: 'Air Max 270',
            price: 129990,
            originalPrice: 159990,
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
            category: 'shoes',
            source: 'Nike Store'
          },
          {
            id: 'nike-featured-2',
            name: 'Dri-FIT T-Shirt',
            price: 39990,
            image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
            category: 'clothing',
            source: 'Nike Store'
          },
          {
            id: 'nike-featured-3',
            name: 'Tech Fleece Hoodie',
            price: 89990,
            originalPrice: 109990,
            image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500',
            category: 'clothing',
            source: 'Nike Store'
          },
          {
            id: 'nike-featured-4',
            name: 'Swoosh Sports Bra',
            price: 49990,
            image: 'https://images.unsplash.com/photo-1614252368549-9e8bb22c8a4e?w=500',
            category: 'clothing',
            source: 'Nike Store'
          },
          {
            id: 'nike-featured-5',
            name: 'Pegasus 40',
            price: 149990,
            originalPrice: 179990,
            image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500',
            category: 'shoes',
            source: 'Nike Store'
          },
          {
            id: 'nike-featured-6',
            name: 'Heritage Backpack',
            price: 59990,
            image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
            category: 'accessories',
            source: 'Nike Store'
          }
        ]
      }
    ]
  },
  'samsung-store': {
    nombre: 'Samsung Store',
    logo: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=100&h=100&fit=crop',
    telefono: '+56 9 6543 2109',
    whatsapp: '56965432109',
    email: 'contacto@samsungstore.cl',
    direccion: 'Av. Tecnología 321, Villarrica',
    horarios: {
      'L-V': '10:00 - 20:00',
      'S': '10:00 - 18:00',
      'D': 'Cerrado'
    },
    banner1: {
      imagen: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=1200&h=300&fit=crop",
      precioActual: 1099990,
      precioAnterior: 1399990
    },
    banner2: {
      imagen: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=300&fit=crop",
      precioActual: 799990,
      precioAnterior: 999990
    },
    carousels: [
      {
        products: [
          {
            id: 'samsung-featured-1',
            name: 'Galaxy S24 Ultra',
            price: 1299990,
            originalPrice: 1499990,
            image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500',
            category: 'smartphones',
            source: 'Samsung Store'
          },
          {
            id: 'samsung-featured-2',
            name: 'Galaxy Tab S9',
            price: 899990,
            originalPrice: 1099990,
            image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500',
            category: 'tablets',
            source: 'Samsung Store'
          },
          {
            id: 'samsung-featured-3',
            name: 'Galaxy Buds2 Pro',
            price: 199990,
            originalPrice: 249990,
            image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500',
            category: 'audio',
            source: 'Samsung Store'
          },
          {
            id: 'samsung-featured-4',
            name: 'Galaxy Watch6',
            price: 349990,
            originalPrice: 449990,
            image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500',
            category: 'wearables',
            source: 'Samsung Store'
          },
          {
            id: 'samsung-featured-5',
            name: 'Smart TV 65" QLED',
            price: 1499990,
            originalPrice: 1899990,
            image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500',
            category: 'tv',
            source: 'Samsung Store'
          },
          {
            id: 'samsung-featured-6',
            name: 'Galaxy Book3 Pro',
            price: 1199990,
            image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500',
            category: 'laptops',
            source: 'Samsung Store'
          }
        ]
      }
    ]
  },
  'adidas-store': {
    nombre: 'Adidas Store',
    logo: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100&h=100&fit=crop',
    telefono: '+56 9 5432 1098',
    whatsapp: '56954321098',
    email: 'contacto@adidasstore.cl',
    direccion: 'Av. Deportiva 654, Villarrica',
    horarios: {
      'L-V': '09:00 - 19:00',
      'S': '10:00 - 17:00',
      'D': 'Cerrado'
    },
    banner1: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&h=300&fit=crop",
    banner2: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1200&h=300&fit=crop",
    carousels: []
  },
  'cocinapro': {
    nombre: 'CocinaPro',
    logo: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&h=100&fit=crop',
    telefono: '+56 9 4321 0987',
    whatsapp: '56943210987',
    email: 'contacto@cocinapro.cl',
    direccion: 'Av. Gourmet 147, Villarrica',
    horarios: {
      'L-V': '09:30 - 18:30',
      'S': '10:00 - 14:00',
      'D': 'Cerrado'
    },
    banner1: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=300&fit=crop",
    banner2: "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?w=1200&h=300&fit=crop",
    carousels: []
  },
  'sportsmax': {
    nombre: 'SportsMax',
    logo: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=100&h=100&fit=crop',
    telefono: '+56 9 3210 9876',
    whatsapp: '56932109876',
    email: 'contacto@sportsmax.cl',
    direccion: 'Av. Olímpica 258, Villarrica',
    horarios: {
      'L-V': '09:00 - 19:00',
      'S': '09:00 - 17:00',
      'D': '10:00 - 14:00'
    },
    banner1: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=300&fit=crop",
    banner2: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&h=300&fit=crop",
    carousels: []
  },
  'beautyplus': {
    nombre: 'BeautyPlus',
    logo: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&h=100&fit=crop',
    telefono: '+56 9 2109 8765',
    whatsapp: '56921098765',
    email: 'contacto@beautyplus.cl',
    direccion: 'Av. Belleza 369, Villarrica',
    horarios: {
      'L-V': '10:00 - 20:00',
      'S': '10:00 - 18:00',
      'D': 'Cerrado'
    },
    banner1: {
      imagen: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&h=300&fit=crop",
      precioActual: 45990,
      precioAnterior: 69990
    },
    banner2: {
      imagen: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1200&h=300&fit=crop",
      precioActual: 89990,
      precioAnterior: 119990
    },
    carousels: [
      {
        products: [
          {
            id: 'beauty-featured-1',
            name: 'Tratamiento Facial Hidratante',
            price: 49990,
            originalPrice: 69990,
            image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500',
            category: 'treatments',
            source: 'BeautyPlus'
          },
          {
            id: 'beauty-featured-2',
            name: 'Masaje Relajante 60min',
            price: 59990,
            originalPrice: 79990,
            image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=500',
            category: 'treatments',
            source: 'BeautyPlus'
          },
          {
            id: 'beauty-featured-3',
            name: 'Manicure & Pedicure',
            price: 39990,
            image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500',
            category: 'treatments',
            source: 'BeautyPlus'
          },
          {
            id: 'beauty-featured-4',
            name: 'Corte + Peinado',
            price: 29990,
            originalPrice: 39990,
            image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=500',
            category: 'hair',
            source: 'BeautyPlus'
          },
          {
            id: 'beauty-featured-5',
            name: 'Tratamiento Capilar Keratina',
            price: 89990,
            originalPrice: 119990,
            image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500',
            category: 'hair',
            source: 'BeautyPlus'
          },
          {
            id: 'beauty-featured-6',
            name: 'Depilación Láser',
            price: 79990,
            originalPrice: 99990,
            image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=500',
            category: 'treatments',
            source: 'BeautyPlus'
          }
        ]
      },
      {
        products: [
          {
            id: 'beauty-promo-1',
            name: 'Maquillaje Profesional',
            price: 45990,
            image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500',
            category: 'makeup',
            source: 'BeautyPlus'
          },
          {
            id: 'beauty-promo-2',
            name: 'Extensiones de Pestañas',
            price: 69990,
            originalPrice: 89990,
            image: 'https://images.unsplash.com/photo-1583001931096-959e1e4c8e49?w=500',
            category: 'treatments',
            source: 'BeautyPlus'
          },
          {
            id: 'beauty-promo-3',
            name: 'Mascarilla Facial Oro',
            price: 59990,
            originalPrice: 79990,
            image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500',
            category: 'treatments',
            source: 'BeautyPlus'
          },
          {
            id: 'beauty-promo-4',
            name: 'Diseño de Cejas',
            price: 19990,
            image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500',
            category: 'treatments',
            source: 'BeautyPlus'
          },
          {
            id: 'beauty-promo-5',
            name: 'Alisado Brasileño',
            price: 149990,
            originalPrice: 199990,
            image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=500',
            category: 'hair',
            source: 'BeautyPlus'
          },
          {
            id: 'beauty-promo-6',
            name: 'Limpieza Profunda',
            price: 39990,
            originalPrice: 49990,
            image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=500',
            category: 'treatments',
            source: 'BeautyPlus'
          }
        ]
      }
    ]
  },
  'lego-store': {
    nombre: 'Lego Store',
    logo: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=100&h=100&fit=crop',
    telefono: '+56 9 1098 7654',
    whatsapp: '56910987654',
    email: 'contacto@legostore.cl',
    direccion: 'Av. Creatividad 741, Villarrica',
    horarios: {
      'L-V': '10:00 - 19:00',
      'S': '10:00 - 18:00',
      'D': '11:00 - 15:00'
    },
    banner1: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=1200&h=300&fit=crop",
    banner2: "https://images.unsplash.com/photo-1599508704512-2f19efd1e35f?w=1200&h=300&fit=crop",
    carousels: []
  },
  'libreria-central': {
    nombre: 'Librería Central',
    logo: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100&h=100&fit=crop',
    telefono: '+56 9 0987 6543',
    whatsapp: '56909876543',
    email: 'contacto@libreriacentral.cl',
    direccion: 'Av. Literatura 852, Villarrica',
    horarios: {
      'L-V': '09:00 - 19:00',
      'S': '09:00 - 14:00',
      'D': 'Cerrado'
    },
    banner1: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=1200&h=300&fit=crop",
    banner2: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=300&fit=crop",
    carousels: []
  },
  'autotech': {
    nombre: 'AutoTech',
    logo: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=100&h=100&fit=crop',
    telefono: '+56 9 9876 5432',
    whatsapp: '56998765432',
    email: 'contacto@autotech.cl',
    direccion: 'Av. Automotriz 963, Villarrica',
    horarios: {
      'L-V': '09:00 - 18:00',
      'S': '09:00 - 13:00',
      'D': 'Cerrado'
    },
    banner1: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1200&h=300&fit=crop",
    banner2: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&h=300&fit=crop",
    carousels: []
  },
  'farmaciaplus': {
    nombre: 'FarmaciaPlus',
    logo: 'https://images.unsplash.com/photo-1607619056574-7b4d1983444f?w=100&h=100&fit=crop',
    telefono: '+56 9 8765 4320',
    whatsapp: '56987654320',
    email: 'contacto@farmaciaplus.cl',
    direccion: 'Av. Salud 159, Villarrica',
    horarios: {
      'L-V': '08:00 - 21:00',
      'S': '09:00 - 20:00',
      'D': '10:00 - 18:00'
    },
    banner1: "https://images.unsplash.com/photo-1607619056574-7b4d1983444f?w=1200&h=300&fit=crop",
    banner2: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=1200&h=300&fit=crop",
    carousels: []
  }
}

export default function TiendaPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const tiendaId = params.id as string

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showPopup, setShowPopup] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Obtener información de la tienda desde el mapeo temporal
  const storeData = STORES_DATA[tiendaId]

  // Si no existe la tienda, usar valores por defecto
  const storeInfo = storeData || {
    nombre: 'Tienda',
    logo: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=100&h=100&fit=crop',
    telefono: '+56 9 1234 5678',
    whatsapp: '56912345678',
    email: 'contacto@tienda.cl',
    direccion: 'Av. Principal 123, Villarrica',
    horarios: {
      'L-V': '09:00 - 18:00',
      'S': '10:00 - 14:00',
      'D': 'Cerrado'
    },
    banner1: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=300&fit=crop",
    banner2: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=1200&h=300&fit=crop",
    carousels: []
  }

  // Obtener productos de la tienda
  useEffect(() => {
    fetchStoreProducts()

    // Verificar si viene con un producto seleccionado desde el popup
    const productId = searchParams.get('productId')
    if (productId) {
      setShowPopup(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tiendaId, searchParams])

  const fetchStoreProducts = async () => {
    try {
      // TODO: Cuando se conecte la BD, cambiar esta llamada a:
      // const response = await fetch(`/api/products?negocio_id=${tiendaId}`)
      // o usar el campo userId según cómo se implemente en la BD
      const response = await fetch('/api/products')
      const data = await response.json()

      // Filtrar productos por tienda (temporal - el filtro vendrá desde la API con negocio_id)
      const storeProducts = data.filter((p: Product) => p.source === storeInfo.nombre)
      setProducts(storeProducts)

      // Si hay un productId en los parámetros, seleccionarlo
      const productId = searchParams.get('productId')
      if (productId) {
        const product = storeProducts.find((p: Product) => p.id === productId)
        if (product) {
          setSelectedProduct(product)
        }
      }
    } catch (error) {
      console.error('Error fetching store products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBackClick = () => {
    const scrollPosition = searchParams.get('scrollY')
    const fromPopup = searchParams.get('fromPopup')
    const productId = searchParams.get('productId')

    // Construir la URL de retorno con los parámetros necesarios
    let backUrl = '/'
    const params = new URLSearchParams()

    if (scrollPosition) {
      params.append('scrollY', scrollPosition)
    }
    if (fromPopup === 'true' && productId) {
      params.append('openProductId', productId)
    }

    if (params.toString()) {
      backUrl += `?${params.toString()}`
    }

    router.push(backUrl)
  }

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
    setShowPopup(true)
  }

  const handleClosePopup = () => {
    setShowPopup(false)
  }

  // Extraer categorías únicas con subcategorías
  const extractCategories = () => {
    const categoryMap = new Map<string, Set<string>>()

    products.forEach(product => {
      // TODO: Cuando se conecte la BD, usar product.categoria y product.subcategoria
      // Por ahora usamos product.category como categoría principal
      const category = product.category

      if (!categoryMap.has(category)) {
        categoryMap.set(category, new Set())
      }

      // Por ahora no tenemos subcategorías en el tipo Product actual
      // Cuando se conecte la BD, agregar: categoryMap.get(category)?.add(product.subcategoria)
    })

    return Array.from(categoryMap.entries()).map(([name, subs]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      subcategories: Array.from(subs)
    }))
  }

  const categories = extractCategories()

  // Dividir productos en secciones
  // Sección 1: 5 filas × 5 productos = 25 productos (índices 0-24)
  const section1Products = products.slice(0, 25)
  // Sección 2: 5 filas × 5 productos = 25 productos (índices 25-49)
  const section2Products = products.slice(25, 50)
  // Sección 3: Resto de productos (índice 50+)
  const section3Products = products.slice(50)

  // Dividir secciones en filas de 5 productos
  const createRows = (prods: Product[]) => {
    const rows: Product[][] = []
    for (let i = 0; i < prods.length; i += 5) {
      rows.push(prods.slice(i, i + 5))
    }
    return rows
  }

  const section1Rows = createRows(section1Products)
  const section2Rows = createRows(section2Products)
  const section3Rows = createRows(section3Products)

  return (
    <div className="min-h-screen bg-background">
      {/* Header con botón de volver */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-purple-900 via-purple-700 to-purple-600 shadow-lg border-b-2 border-yellow-400">
        <div className="px-4 md:px-6 py-3 md:py-4">
          {/* Desktop Header */}
          <div className="hidden md:flex items-center gap-4">
            {/* Botón volver */}
            <button
              onClick={handleBackClick}
              className="flex items-center justify-center w-10 h-10 bg-purple-800 hover:bg-purple-900 rounded-full transition-all hover:scale-110 shadow-lg border border-yellow-400"
              aria-label="Volver al inicio"
            >
              <ArrowLeft className="h-6 w-6 text-yellow-300" />
            </button>

            {/* Logo y nombre de la tienda */}
            <div className="flex items-center gap-3 flex-1">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-yellow-400 shadow-lg bg-white">
                <img
                  src={storeInfo.logo}
                  alt={storeInfo.nombre}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-yellow-300">
                  {storeInfo.nombre}
                </h1>
              </div>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="flex md:hidden items-center justify-between">
            {/* Botón volver */}
            <button
              onClick={handleBackClick}
              className="flex items-center justify-center w-9 h-9 bg-purple-800 hover:bg-purple-900 rounded-full transition-all hover:scale-110 shadow-lg border border-yellow-400"
              aria-label="Volver al inicio"
            >
              <ArrowLeft className="h-5 w-5 text-yellow-300" />
            </button>

            {/* Nombre de la tienda centrado */}
            <div className="flex-1 flex justify-center">
              <h1 className="text-lg font-bold text-yellow-300">
                {storeInfo.nombre}
              </h1>
            </div>

            {/* Botón menú hamburguesa */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="flex items-center justify-center w-9 h-9 bg-purple-800 hover:bg-purple-900 rounded-full transition-all hover:scale-110 shadow-lg border border-yellow-400"
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5 text-yellow-300" />
            </button>
          </div>
        </div>
      </header>

      {/* Drawer móvil - aparece desde la izquierda debajo del banner */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden" style={{ top: 'calc(56px + 200px)' }}>
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Drawer */}
          <div className="absolute top-0 left-0 bottom-0 w-auto min-w-[140px] max-w-[200px] bg-white shadow-2xl animate-slide-in-left">
            <CategorySidebar
              categories={categories}
              onClose={() => setIsMobileMenuOpen(false)}
              isMobile={true}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pb-8">
        {/* 2 Banners */}
        <div className="mb-6 md:mb-8 mt-4">
          <StoreBanners
            banner1={storeInfo.banner1}
            banner2={storeInfo.banner2}
            storeName={storeInfo.nombre}
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <div className="md:flex md:gap-4">
            {/* Sidebar de categorías - Solo desktop */}
            <aside className="hidden md:block flex-shrink-0">
              <CategorySidebar categories={categories} />
            </aside>

            {/* Contenido de productos */}
            <div className="flex-1 md:min-w-0">
            {/* Sección 1: Primeras 5 filas de productos (25 productos) */}
            {section1Rows.length > 0 && (
              <section className="mb-8 md:mb-12 px-4 md:px-6">
                <div className="space-y-4 md:space-y-6">
                  {section1Rows.map((row, index) => (
                    <ProductRow
                      key={`section1-row-${index}`}
                      products={row}
                      onProductClick={handleProductClick}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Carrusel 1 del admin (sin título) */}
            {storeInfo.carousels[0] && storeInfo.carousels[0].products.length > 0 && (
              <section className="mb-8 md:mb-12">
                <StoreCarousel
                  products={storeInfo.carousels[0].products}
                  storeName={storeInfo.nombre}
                />
              </section>
            )}

            {/* Sección 2: Segundas 5 filas de productos (25 productos) */}
            {section2Rows.length > 0 && (
              <section className="mb-8 md:mb-12 px-4 md:px-6">
                <div className="space-y-4 md:space-y-6">
                  {section2Rows.map((row, index) => (
                    <ProductRow
                      key={`section2-row-${index}`}
                      products={row}
                      onProductClick={handleProductClick}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Carrusel 2 del admin (sin título) */}
            {storeInfo.carousels[1] && storeInfo.carousels[1].products.length > 0 && (
              <section className="mb-8 md:mb-12">
                <StoreCarousel
                  products={storeInfo.carousels[1].products}
                  storeName={storeInfo.nombre}
                />
              </section>
            )}

            {/* Sección 3: Resto de productos en filas de 5 */}
            {section3Rows.length > 0 && (
              <section className="mb-8 md:mb-12 px-4 md:px-6">
                <div className="space-y-4 md:space-y-6">
                  {section3Rows.map((row, index) => (
                    <ProductRow
                      key={`section3-row-${index}`}
                      products={row}
                      onProductClick={handleProductClick}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Mensaje si no hay productos */}
            {products.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">
                  Esta tienda aún no tiene productos disponibles
                </p>
              </div>
            )}
            </div>
          </div>
        )}
      </main>

      {/* Footer con información del negocio */}
      <footer className="relative text-white py-8 mt-12 shadow-2xl" style={{ background: 'linear-gradient(90deg, #3b0764 0%, #4c1d95 20%, #6d28d9 40%, var(--yellow-accent) 100%)' }}>
        <div className="px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Columna 1 - Contacto */}
            <div>
              <h3 className="text-lg md:text-xl font-bold text-yellow-300 mb-4 border-b border-yellow-400/30 pb-2">
                Contacto
              </h3>
              <div className="space-y-3">
                <a
                  href={`tel:${storeInfo.telefono}`}
                  className="flex items-center gap-3 text-purple-100 hover:text-yellow-300 transition-colors"
                >
                  <div className="bg-blue-600 p-2 rounded-full">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm">{storeInfo.telefono}</span>
                </a>
                <a
                  href={`https://wa.me/${storeInfo.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-purple-100 hover:text-yellow-300 transition-colors"
                >
                  <div className="bg-green-600 p-2 rounded-full">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm">WhatsApp</span>
                </a>
                <a
                  href={`mailto:${storeInfo.email}`}
                  className="flex items-center gap-3 text-purple-100 hover:text-yellow-300 transition-colors"
                >
                  <div className="bg-purple-600 p-2 rounded-full">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm">{storeInfo.email}</span>
                </a>
              </div>
            </div>

            {/* Columna 2 - Dirección */}
            <div>
              <h3 className="text-lg md:text-xl font-bold text-yellow-300 mb-4 border-b border-yellow-400/30 pb-2">
                Ubicación
              </h3>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(storeInfo.direccion)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-purple-100 hover:text-yellow-300 transition-colors"
              >
                <div className="bg-red-600 p-2 rounded-full flex-shrink-0">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm">{storeInfo.direccion}</span>
              </a>
            </div>

            {/* Columna 3 - Horarios */}
            <div>
              <h3 className="text-lg md:text-xl font-bold text-yellow-300 mb-4 border-b border-yellow-400/30 pb-2">
                Horarios de Atención
              </h3>
              <div className="space-y-2">
                {Object.entries(storeInfo.horarios).map(([dia, horario]) => (
                  <div key={dia} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-yellow-300" />
                      <span className="text-purple-100 font-medium">{dia}:</span>
                    </div>
                    <span className="text-purple-100">{horario}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-purple-400/30 mt-6 pt-4 text-center">
            <p className="text-purple-100 text-xs md:text-sm">
              © 2025 {storeInfo.nombre}. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* Popup de producto */}
      {selectedProduct && (
        <ProductInfoPopup
          product={selectedProduct}
          isOpen={showPopup}
          onClose={handleClosePopup}
        />
      )}
    </div>
  )
}
