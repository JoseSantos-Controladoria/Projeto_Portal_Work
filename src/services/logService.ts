import api from './api';

export interface LogEntry {
  id: string;
  created_at: string;
  user_name: string;
  user_email: string;
  group_name?: string;
  report_name?: string;
  action: string;
}

export const logService = {
  // Registrar ação (Disparado pelo ReportViewer)
  logAction: async (userId: string | number, action: string, reportId?: number) => {
    try {
      await api.post('/logs', {
        userid: userId,
        reportid: reportId,
        action: action
      });
    } catch (error) {
      console.error("Erro silencioso ao registrar log:", error);
    }
  },

  // Buscar todos os logs (Para o AccessLogsView)
  getAll: async () => {
    try {
      const response = await api.get('/logs');
      return response.data.items || [];
    } catch (error) {
      console.error("Erro ao buscar logs:", error);
      return [];
    }
  }
};