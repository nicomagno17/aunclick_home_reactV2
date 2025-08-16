import { api } from './api';
import { BaseService } from './base-service';

export interface DashboardStats {
  totalUsuarios: number;
  totalNegocios: number;
  totalProductos: number;
  totalVentas: number;
  // Agrega más estadísticas según sea necesario
}

class DashboardService extends BaseService<DashboardStats> {
  constructor() {
    super('/admin/dashboard/stats');
  }

  async getStats(): Promise<DashboardStats> {
    const response = await api.get<{ stats: DashboardStats }>(this.endpoint);
    return response.data.stats;
  }
}

export const dashboardService = new DashboardService();
