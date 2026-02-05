import api from './api';

export interface PaginationParams {
  page?: number;
  pagesize?: number;
  orderby?: string;
  [key: string]: any;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pagesize: number;
  total_pages: number;
}

export const buildQueryParams = (params?: PaginationParams): string => {
  if (!params) return '';
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

export const crudService = {
  getAll: async <T>(table: string, pagination?: PaginationParams, filters?: Record<string, any>) => {
    let query = `?tablename=${table}`;

    if (pagination) {
      if (pagination.page) query += `&page=${pagination.page}`;
      if (pagination.pagesize) query += `&pagesize=${pagination.pagesize}`;
      if (pagination.orderby) query += `&orderby=${pagination.orderby}`;
    }

    if (filters) {
      Object.keys(filters).forEach(key => {
        query += `&filters[${key}]=${filters[key]}`;
      });
    }

    const response = await api.get(`/basictable${query}`);
    return response.data as PaginatedResponse<T>;
  },

  getById: async (table: string, id: string | number) => {
    const response = await api.get(`/basictable?tablename=${table}&filters[id]=[equal]${id}`);
    return response.data.items ? response.data.items[0] : null;
  },

  create: async (table: string, data: any) => {
    const response = await api.post(`/basictable?tablename=${table}`, data);
    return response.data;
  },

  // ✅ CORREÇÃO CRÍTICA AQUI
  update: async (table: string, id: string | number, data: any) => {
    // 1. O Backend exige o ID dentro do corpo do objeto (req.body.id)
    const payload = { ...data, id: id };
    
    // 2. O Backend usa a rota PATCH, não PUT
    const response = await api.patch(`/basictable?tablename=${table}`, payload);
    return response.data;
  },

  // Ajuste preventivo também no delete, pois seu backend pede ID no body
  delete: async (table: string, id: string | number) => {
    const response = await api.delete(`/basictable?tablename=${table}`, {
      data: { id: id } // Envia ID no body
    });
    return response.data;
  }
};