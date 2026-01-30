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
  // 1. Listar Relatórios
  getAll: async (pagination?: PaginationParams) => {
    try {
      return await crudService.getAll<Report>('report', pagination);
    } catch (error) {
      console.error("Erro ao listar relatórios:", error);
      throw error;
    }
  },

  // 2. Buscar Dados Auxiliares (Workspaces para o Select)
  // ESSA É A FUNÇÃO QUE ESTAVA FALTANDO OU COM ERRO
  getAuxiliaryData: async () => {
    try {
      // Busca a lista de workspaces para preencher o select
      const workspaces = await crudService.getAll('workspace');
      return {
        workspaces: workspaces.items || []
      };
    } catch (error) {
      console.error("Erro ao carregar workspaces:", error);
      return { workspaces: [] };
    }
  },

  // 3. Salvar (Criar ou Editar)
  save: async (data: Partial<Report>) => {
    try {
      if (data.id) {
        await crudService.update('report', data.id, data);
      } else {
        await crudService.create('report', data);
      }
    } catch (error) {
      console.error("Erro ao salvar relatório:", error);
      throw error;
    }
  },

  // 4. Deletar
  delete: async (id: number) => {
    return await crudService.delete('report', id);
  }
};