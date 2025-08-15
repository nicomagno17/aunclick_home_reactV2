import { BaseService } from './base-service';

export interface PlanSuscripcion {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  moneda: string;
  periodo: string;
  caracteristicas: string;
  limite_productos?: number;
  limite_imagenes_producto?: number;
  nivel_destacado?: number;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}

class PlanesSuscripcionService extends BaseService<PlanSuscripcion> {
  constructor() {
    super('/planes-suscripcion');
  }
}

export const planesSuscripcionService = new PlanesSuscripcionService();