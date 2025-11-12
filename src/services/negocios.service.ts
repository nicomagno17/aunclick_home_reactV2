import { BaseService } from './base-service';

export interface Negocio {
  id: number;
  propietario_id: number;
  categoria_id: number;
  ubicacion_id: number;
  plan_id: number;
  nombre: string;
  slug: string;
  descripcion?: string;
  descripcion_corta?: string;
  telefono_principal?: string;
  telefono_secundario?: string;
  email?: string;
  sitio_web?: string;
  whatsapp?: string;
  redes_sociales?: Record<string, string>;
  logo_url?: string;
  banner_url?: string;
  galeria_imagenes?: string[];
  estado: 'borrador' | 'activo' | 'inactivo' | 'suspendido' | 'eliminado';
  verificado: boolean;
  destacado: boolean;
  permite_pedidos: boolean;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  configuracion?: Record<string, any>;
  metadata?: Record<string, any>;
  suscripcion_inicio?: string;
  suscripcion_fin?: string;
  created_at?: string;
  updated_at?: string;
}

class NegociosService extends BaseService<Negocio> {
  constructor() {
    super('/negocios');
  }
}

export const negociosService = new NegociosService();