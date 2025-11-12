import { BaseService } from './base-service';

export interface CategoriaNegocio {
  id: number;
  nombre: string;
  slug: string;
  descripcion?: string;
  icono?: string;
  color_hex: string;
  parent_id?: number;
  nivel: number;
  activo: boolean;
  orden: number;
  created_at?: string;
  updated_at?: string;
}

class CategoriasNegociosService extends BaseService<CategoriaNegocio> {
  constructor() {
    super('/categorias-negocios');
  }
}

export const categoriasNegociosService = new CategoriasNegociosService();