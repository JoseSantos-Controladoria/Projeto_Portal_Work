import api from './api';

export type TableName = 
  | 'company' 
  | 'customer' 
  | 'group' 
  | 'profile' 
  | 'report' 
  | 'user' 
  | 'workspace';

export interface PaginationParams {
  page?: number;
  pagesize?: number;
  orderby?: string;
}

export interface FilterParams {
  [key: string]: string | number | boolean | undefined;
}

export const crudService = {
  getAll: async <T>(
    table: TableName, 
    pagination?: PaginationParams,
    filters?: FilterParams
  ) => {
    const params = new URLSearchParams();
    params.append('tablename', table);

    if (pagination?.page) params.append('page', pagination.page.toString());
    if (pagination?.pagesize) params.append('pagesize', pagination.pagesize.toString());
    if (pagination?.orderby) params.append('orderby', pagination.orderby);

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          const operator = typeof value === 'string' ? '[like]' : '[equal]';
          params.append(key, `${operator}${value}`);
        }
      });
    }

    const response = await api.get('/basictable', { params });
    return response.data; 
  },


  create: async <T>(table: TableName, data: Partial<T>) => {

    const response = await api.post(`/basictable?tablename=${table}`, data);
    return response.data;
  },


  update: async <T>(table: TableName, id: number | string, data: Partial<T>) => {

    const payload = { ...data, id };
    const response = await api.patch(`/basictable?tablename=${table}`, payload);
    return response.data;
  },


  delete: async (table: TableName, id: number | string) => {

    const response = await api.delete(`/basictable?tablename=${table}`, {
      data: { id }
    });
    return response.data;
  }
};