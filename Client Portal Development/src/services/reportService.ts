import { crudService, PaginationParams } from './crudService';

export interface Report {
  id: number;
  workspace_id: number;
  title: string;
  description: string;
  embedded_url: string;
  active: boolean;
  last_update?: string;
}

export const reportService = {
  // 1. Listar
  getAll: async (pagination?: PaginationParams) => {
    return await crudService.getAll<Report>('report', pagination);
  },

  // 2. Dados Auxiliares (ESSA FUNÇÃO É A QUE ESTAVA FALTANDO/COM ERRO)
  getAuxiliaryData: async () => {
    try {
      const workspaces = await crudService.getAll('workspace');
      return { workspaces: workspaces.items || [] };
    } catch (error) {
      console.error("Erro workspaces:", error);
      return { workspaces: [] };
    }
  },

  // 3. Salvar
  save: async (data: Partial<Report>) => {
    if (data.id) {
      await crudService.update('report', data.id, data);
    } else {
      await crudService.create('report', data);
    }
  },

  // 4. Deletar
  delete: async (id: number) => {
    return await crudService.delete('report', id);
  }
};