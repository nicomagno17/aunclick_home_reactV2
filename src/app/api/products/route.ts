import { NextResponse } from 'next/server'

const mockProducts = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    description: 'El último iPhone con cámara profesional y chip A17 Pro',
    price: 1299900,
    originalPrice: 1499900,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
    category: 'electronica',
    source: 'Apple Store',
    rating: 4.8,
    reviews: 1234,
    inStock: true,
    discount: 13
  },
  {
    id: '2',
    name: 'Zapatillas Nike Air Max',
    description: 'Comodidad y estilo en cada paso con tecnología Air Max',
    price: 89990,
    originalPrice: 119990,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
    category: 'ropa',
    source: 'Nike Store',
    rating: 4.6,
    reviews: 856,
    inStock: true,
    discount: 25
  },
  {
    id: '3',
    name: 'MacBook Pro 16"',
    description: 'Potencia profesional con chip M3 Pro para creadores',
    price: 2499900,
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop',
    category: 'electronica',
    source: 'Apple Store',
    rating: 4.9,
    reviews: 567,
    inStock: true
  },
  {
    id: '4',
    name: 'Set de Cocina Antiadherente',
    description: 'Juego de ollas y sartenes de 5 piezas con revestimiento cerámico',
    price: 59990,
    originalPrice: 79990,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
    category: 'hogar',
    source: 'CocinaPro',
    rating: 4.4,
    reviews: 234,
    inStock: true,
    discount: 25
  },
  {
    id: '5',
    name: 'Balón de Fútbol Profesional',
    description: 'Balón oficial FIFA para partidos profesionales',
    price: 45990,
    image: 'https://images.unsplash.com/photo-1551628894-9de2df9111e1?w=400&h=400&fit=crop',
    category: 'deportes',
    source: 'SportsMax',
    rating: 4.7,
    reviews: 189,
    inStock: true
  },
  {
    id: '6',
    name: 'Kit de Maquillaje Profesional',
    description: 'Set completo con 48 sombras, blushes y labiales',
    price: 34990,
    originalPrice: 49990,
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
    category: 'belleza',
    source: 'BeautyPlus',
    rating: 4.5,
    reviews: 445,
    inStock: true,
    discount: 30
  },
  {
    id: '7',
    name: 'Lego Technic Bugatti',
    description: 'Set de construcción con 3599 piezas para coleccionistas',
    price: 399990,
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=400&fit=crop',
    category: 'juguetes',
    source: 'Lego Store',
    rating: 4.9,
    reviews: 123,
    inStock: false
  },
  {
    id: '8',
    name: 'El Señor de los Anillos - Edición Especial',
    description: 'Trilogía completa en caja coleccionista con extras',
    price: 59990,
    originalPrice: 79990,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop',
    category: 'libros',
    source: 'Librería Central',
    rating: 4.8,
    reviews: 89,
    inStock: true,
    discount: 25
  },
  {
    id: '9',
    name: 'GPS para Automóvil Garmin',
    description: 'Navegador GPS con pantalla de 7" y actualizaciones gratuitas',
    price: 129990,
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop',
    category: 'automotriz',
    source: 'AutoTech',
    rating: 4.3,
    reviews: 167,
    inStock: true
  },
  {
    id: '10',
    name: 'Vitaminas Complejas',
    description: 'Suplemento multivitamínico con minerales esenciales',
    price: 19990,
    originalPrice: 29990,
    image: 'https://images.unsplash.com/photo-1607619056574-7b4d1983444f?w=400&h=400&fit=crop',
    category: 'salud',
    source: 'FarmaciaPlus',
    rating: 4.2,
    reviews: 298,
    inStock: true,
    discount: 33
  },
  {
    id: '11',
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Smartphone premium con cámara de 200MP y S Pen incluido',
    price: 1199900,
    originalPrice: 1399900,
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop',
    category: 'electronica',
    source: 'Samsung Store',
    rating: 4.7,
    reviews: 892,
    inStock: true,
    discount: 14
  },
  {
    id: '12',
    name: 'Adidas Ultraboost 22',
    description: 'Zapatillas running con tecnología Boost máxima energía',
    price: 119990,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
    category: 'ropa',
    source: 'Adidas Store',
    rating: 4.6,
    reviews: 634,
    inStock: true
  }
]

export async function GET() {
  try {
    // Simular un pequeño retraso para mostrar el estado de carga
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return NextResponse.json(mockProducts)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}