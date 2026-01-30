import { crudService, PaginationParams } from './crudService';

export interface Workspace {
  id: number;
  name: string;
  url: string;
  last_update?: string;
}

export const workspaceService = {
  // 1. Listar Workspaces
  getAll: async (pagination?: PaginationParams) => {
    try {
      return await crudService.getAll<Workspace>('workspace', pagination);
    } catch (error) {
      console.error("Erro ao listar workspaces:", error);
      throw error;
    }
  },

  // 2. Salvar (Criar ou Editar)
  save: async (data: Partial<Workspace>) => {
    try {
      if (data.id) {
        await crudService.update('workspace', data.id, data);
      } else {
        await crudService.create('workspace', data);
      }
    } catch (error) {
      console.error("Erro ao salvar workspace:", error);
      throw error;
    }
  },

  // 3. Deletar (Hard Delete, já que não temos 'active')
  delete: async (id: number) => {
    return await crudService.delete('workspace', id);
  }
};