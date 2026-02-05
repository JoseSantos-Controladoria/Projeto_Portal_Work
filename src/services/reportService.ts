// src/services/reportService.ts
import api from './api'; 
import { crudService, PaginationParams } from './crudService';

export interface Report {
  id: number;
  workspace_id: number;
  customer_id?: number;
  title: string;
  description: string;
  embedded_url: string;
  active: boolean;
  last_update?: string;
}

export const reportService = {
  // 1. Listar (Admin)
  getAll: async (pagination?: PaginationParams) => {
    return await crudService.getAll<Report>('report', pagination);
  },

  // ✅ NOVO: Buscar relatório por ID (Para o Editar funcionar)
  getById: async (id: number) => {
    try {
      const response = await crudService.getAll<Report>('report', undefined, { id: id });
      
      if (response.items && response.items.length > 0) {
        return response.items[0];
      }
      throw new Error("Relatório não encontrado.");
    } catch (error) {
      console.error(`❌ [ReportService] Erro ao buscar relatório ${id}:`, error);
      throw error;
    }
  },

  // 2. Dados Auxiliares
  getAuxiliaryData: async () => {
    try {
      const workspaces = await crudService.getAll('workspace');
      return { workspaces: workspaces.items || [] };
    } catch (error) {
      console.error("Erro workspaces:", error);
      return { workspaces: [] };
    }
  },

  // 3. Salvar (COM RETURN PARA PEGAR O ID)
  save: async (data: Partial<Report>) => {
    if (data.id) {
      return await crudService.update('report', data.id, data);
    } else {
      return await crudService.create('report', data);
    }
  },

  // 4. Deletar
  delete: async (id: number) => {
    return await crudService.delete('report', id);
  },

  // 5. Meus Relatórios (Visão do Cliente/Usuário)
  getMyReports: async (userId: number | string) => {
    try {
      const response = await api.get(`/myreports/${userId}`);
      return response.data.items || [];
    } catch (error) {
      console.error("Erro ao buscar meus relatórios:", error);
      return [];
    }
  },

  // 6. Buscar Grupos vinculados a um Relatório (para Edição)
  getReportGroups: async (reportId: number) => {
    try {
      const response = await api.get(`/groupsbyreport/${reportId}`);
      return response.data.groups || [];
    } catch (error) {
      console.error("Erro ao buscar grupos do relatório:", error);
      return [];
    }
  },

  // 7. Salvar Vínculo de Grupos
  saveGroups: async (reportId: number, groupIds: number[]) => {
    await api.post('/groupsbyreport', {
      reportid: reportId,
      groups: groupIds,
      action: 'DELETE_EXISTING_GROUPS' 
    });
  }  
};