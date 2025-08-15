import { BaseService } from './base-service';

export interface Ubicacion {
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

class UbicacionesService extends BaseService<Ubicacion> {
  constructor() {
    super('/ubicaciones');
  }
}

export const ubicacionesService = new UbicacionesService();