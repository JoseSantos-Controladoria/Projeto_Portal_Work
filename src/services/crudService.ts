// src/services/crudService.ts
import api from './api';

// As tabelas permitidas pelo Back-end (conforme basictable.controller.js)
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

// Interface para filtros flexíveis
export interface FilterParams {
  [key: string]: string | number | boolean | undefined;
}

export const crudService = {
  // LISTAR (GET)
  getAll: async <T>(
    table: TableName, 
    pagination?: PaginationParams,
    filters?: FilterParams
  ) => {
    const params = new URLSearchParams();
    params.append('tablename', table);

    // Adiciona Paginação
    if (pagination?.page) params.append('page', pagination.page.toString());
    if (pagination?.pagesize) params.append('pagesize', pagination.pagesize.toString());
    if (pagination?.orderby) params.append('orderby', pagination.orderby);

    // Adiciona Filtros (Transforma {name: 'abc'} em name=[like]abc)
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          // Lógica simples: se for string usa [like], se for número/bool usa [equal]
          const operator = typeof value === 'string' ? '[like]' : '[equal]';
          params.append(key, `${operator}${value}`);
        }
      });
    }

    const response = await api.get('/basictable', { params });
    return response.data; // Retorna { items: [], responseinfo: {} }
  },

  // CRIAR (POST)
  create: async <T>(table: TableName, data: Partial<T>) => {
    // A rota pede tablename na query string mesmo sendo POST
    const response = await api.post(`/basictable?tablename=${table}`, data);
    return response.data;
  },

  // ATUALIZAR (PATCH)
  update: async <T>(table: TableName, id: number | string, data: Partial<T>) => {
    // O backend espera o ID no corpo ou na query? O controller diz:
    // "if (aFields[nField][0].toUpperCase() == 'ID') { nIDItem = ... }"
    // Então precisamos mandar o ID dentro do body data
    const payload = { ...data, id };
    const response = await api.patch(`/basictable?tablename=${table}`, payload);
    return response.data;
  },

  // DELETAR (DELETE)
  delete: async (table: TableName, id: number | string) => {
    // O controller pega o ID do body: "let nIDItem = req.body?.id"
    // Axios delete com body precisa de uma config específica "data"
    const response = await api.delete(`/basictable?tablename=${table}`, {
      data: { id }
    });
    return response.data;
  }
};