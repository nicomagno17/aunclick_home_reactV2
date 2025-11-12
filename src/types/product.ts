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
  id: number;
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
  descripcion_corta?: string;
  telefono_principal?: string;
  telefono_secundario?: string;
  whatsapp?: string;
  email?: string;
  sitio_web?: string;
  redes_sociales?: Record<string, string>;
  galeria_imagenes?: string[];
  logo_url?: string;
  banner_url?: string;
  estado: 'borrador' | 'activo' | 'inactivo' | 'suspendido' | 'eliminado';
  verificado: boolean;
  destacado: boolean;
  permite_pedidos: boolean;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  configuracion?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  suscripcion_inicio?: string;
  suscripcion_fin?: string;
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
  pais: string;
  departamento_estado: string;
  ciudad: string;
  zona_barrio?: string;
  direccion_completa?: string;
  codigo_postal?: string;
  latitud?: number;
  longitud?: number;
  timezone: string;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}

// Tipo para planes de suscripción
export interface PlanSuscripcionAPI {
  id: number;
  nombre: string;
  descripcion?: string;
  precio_mensual: number;
  precio_anual?: number;
  descuento_anual: number;
  moneda: string;
  max_negocios: number;
  max_productos_por_negocio: number;
  max_imagenes_por_producto: number;
  caracteristicas?: string[];
  orden_visualizacion: number;
  activo: boolean;
  metadata?: Record<string, unknown>;
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