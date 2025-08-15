import { BaseService } from './base-service';

export interface CategoriaProducto {
  id: number;
  nombre: string;
  slug: string;
  descripcion?: string;
  parent_id?: number;
  nivel: number;
  activo: boolean;
  orden: number;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

class CategoriasProductosService extends BaseService<CategoriaProducto> {
  constructor() {
    super('/categorias-productos');
  }
}

export const categoriasProductosService = new CategoriasProductosService();