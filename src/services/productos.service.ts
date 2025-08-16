import { BaseService } from './base-service';

export interface Producto {
  id?: number;
  negocio_id: number;
  categoria_id: number;
  nombre: string;
  slug: string;
  descripcion?: string;
  descripcion_corta?: string;
  precio: number;
  moneda: string;
  sku?: string;
  stock_disponible?: number;
  maneja_stock: boolean;
  stock_minimo?: number;
  dimensiones?: string; // JSON
  estado: 'borrador' | 'activo' | 'inactivo' | 'agotado' | 'eliminado';
  destacado: boolean;
  permite_personalizacion: boolean;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  atributos?: string; // JSON
  opciones_personalizacion?: string; // JSON
  metadata?: string; // JSON
  fecha_disponibilidad?: Date;
  created_at?: Date;
  updated_at?: Date;
}

class ProductosService extends BaseService<Producto> {
  constructor() {
    super('/api/productos');
  }

  // Método específico para crear producto con validaciones adicionales
  async create(data: Partial<Producto>): Promise<Producto> {
    // Convertir string IDs a números si es necesario
    if (typeof data.negocio_id === 'string') {
      data.negocio_id = parseInt(data.negocio_id);
    }
    if (typeof data.categoria_id === 'string') {
      data.categoria_id = parseInt(data.categoria_id);
    }
    
    // Convertir booleanos a valores que la BD espera
    if (data.maneja_stock !== undefined) {
      data.maneja_stock = !!data.maneja_stock; // Asegurar que sea boolean
    }
    if (data.destacado !== undefined) {
      data.destacado = !!data.destacado; // Asegurar que sea boolean
    }
    if (data.permite_personalizacion !== undefined) {
      data.permite_personalizacion = !!data.permite_personalizacion; // Asegurar que sea boolean
    }
    
    console.log('Datos procesados antes de enviar:', data);
    return super.create(data);
  }
}

export const productosService = new ProductosService();