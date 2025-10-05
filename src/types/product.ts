export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  category: string
  source: string
  rating: number
  reviews: number
  inStock: boolean
  discount?: number
}

// Tipo para productos de carrusel del admin
export interface ProductoCarrusel {
  id: string;
  categoria: string;
  subcategoria: string;
  nombre: string;
  imagen: string;
  precioActual: number;
  precioAnterior?: number;
  tallas?: string;
  genero?: string;
  medidas?: string;
  unidadMedida?: string;
  descripcion?: string;
  tipoNegocio?: string;
  tallasCalzado?: string[];
  tallasRopa?: string[];
}

// Tipo para datos de API de productos (basado en schema de base de datos)
export interface ProductoAPI {
  id: number;
  negocio_id: number;
  categoria_id: number;
  nombre: string;
  slug: string;
  descripcion?: string;
  descripcion_corta?: string;
  precio: number;
  precio_antes?: number;
  moneda: string;
  sku?: string;
  stock_disponible: number;
  maneja_stock: boolean;
  stock_minimo: number;
  peso?: number;
  dimensiones?: string;
  estado: 'borrador' | 'activo' | 'inactivo' | 'agotado' | 'eliminado';
  destacado: boolean;
  permite_personalizacion: boolean;
  imagen?: string;
  negocio_nombre?: string;
  categoria_nombre?: string;
  created_at?: string;
  updated_at?: string;
}

// Tipo para negocios de API
export interface NegocioAPI {
  id: number;
  propietario_id: number;
  categoria_id: number;
  ubicacion_id?: number;
  plan_id?: number;
  nombre: string;
  slug: string;
  descripcion?: string;
  logo_url?: string;
  banner_url?: string;
  telefono?: string;
  email?: string;
  sitio_web?: string;
  estado: 'borrador' | 'activo' | 'inactivo' | 'suspendido';
  verificado: boolean;
  created_at?: string;
  updated_at?: string;
}

// Tipo para categorías
export interface CategoriaAPI {
  id: number;
  nombre: string;
  slug: string;
  descripcion?: string;
  icono?: string;
  activo: boolean;
  orden_visualizacion: number;
}

// Tipo para ubicaciones
export interface UbicacionAPI {
  id: number;
  nombre: string;
  tipo: 'pais' | 'departamento' | 'ciudad' | 'zona';
  padre_id?: number;
  activo: boolean;
}

// Tipo para planes de suscripción
export interface PlanSuscripcionAPI {
  id: number;
  nombre: string;
  descripcion?: string;
  precio_mensual: number;
  precio_anual?: number;
  moneda: string;
  max_negocios: number;
  max_productos_por_negocio: number;
  caracteristicas?: string;
  activo: boolean;
}

// Tipo para resultados de queries
export interface CountResult {
  total: number;
}

export interface InsertResult {
  insertId: number;
  affectedRows: number;
}

// Tipo para usuarios
export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  estado: 'activo' | 'inactivo' | 'suspendido';
  created_at?: string;
  updated_at?: string;
}

// Tipo para imágenes de carrusel
export interface ImageData {
  src: string;
  alt: string;
  title: string;
}

// Tipo para secciones de carrusel
export interface CarouselSection {
  title: string;
  images: ImageData[];
}