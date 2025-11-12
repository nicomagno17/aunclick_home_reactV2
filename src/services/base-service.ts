// Base service con métodos CRUD genéricos
import api from './api';

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface QueryParams extends PaginationParams {
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
  [key: string]: any;
}

export class BaseService<T = any> {
  private endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  // Obtener todos los registros (con paginación y filtros)
  async getAll(params?: QueryParams): Promise<{ data: T[], total: number }> {
    const response = await api.get<{ data: T[], total: number }>(this.endpoint, { params });
    return response.data;
  }

  // Obtener un registro por ID
  async getById(id: number | string): Promise<T> {
    const response = await api.get<T>(`${this.endpoint}/${id}`);
    return response.data;
  }

  // Crear un nuevo registro
  async create(data: Partial<T>): Promise<T> {
    const response = await api.post<T>(this.endpoint, data);
    return response.data;
  }

  // Actualizar un registro existente
  async update(id: number | string, data: Partial<T>): Promise<T> {
    const response = await api.put<T>(`${this.endpoint}/${id}`, data);
    return response.data;
  }

  // Eliminar un registro
  async delete(id: number | string): Promise<void> {
    await api.delete(`${this.endpoint}/${id}`);
  }
}