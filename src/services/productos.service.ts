import { BaseService } from './base-service';

export interface Producto {
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
  dimensiones?: Record<string, number>;
  estado: 'borrador' | 'activo' | 'inactivo' | 'agotado' | 'eliminado';
  destacado: boolean;
  permite_personalizacion: boolean;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  atributos?: Record<string, any>;
  opciones_personalizacion?: Record<string, any>;
  metadata?: Record<string, any>;
  fecha_disponibilidad?: string;
  imagenes: { url: string, esPrincipal: boolean }[];
  created_at?: string;
  updated_at?: string;
}

class ProductosService extends BaseService<Producto> {
  constructor() {
    super('/productos');
  }
}

export const productosService = new ProductosService();