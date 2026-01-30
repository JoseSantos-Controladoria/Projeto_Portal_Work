import api from './api';
import { crudService, PaginationParams } from './crudService';
import { toast } from "sonner";

export interface Group {
  id: number;
  name: string;
  customer_id: number;
  customer?: string; // Nome do cliente vindo do join do Back-end
  active: boolean;
  qty_users?: number; // Contagem vinda do Back-end
  last_update?: string;
}

export const groupService = {
  // 1. Listar Grupos
  getAll: async (pagination?: PaginationParams) => {
    try {
      // O back-end já traz qty_users e customer_name no join
      const response = await crudService.getAll<Group>('group', pagination);
      return response;
    } catch (error) {
      console.error("Erro ao listar grupos:", error);
      throw error;
    }
  },

  // 2. Buscar Dados Auxiliares (Lista de Clientes e Todos Usuários para o Modal)
  getAuxiliaryData: async () => {
    try {
      const [customers, users] = await Promise.all([
        crudService.getAll('customer'), // Para o Select de Clientes
        crudService.getAll('user')      // Para a lista de seleção de membros
      ]);

      return {
        customers: customers.items || [],
        users: users.items || []
      };
    } catch (error) {
      console.error("Erro ao carregar dados auxiliares:", error);
      return { customers: [], users: [] };
    }
  },

  // 3. Buscar Usuários de um Grupo Específico (Edição)
  getUsersByGroup: async (groupId: number) => {
    try {
      // Rota provável baseada no padrão do seu controller usergroup
      const response = await api.get(`/usersbygroup/${groupId}`);
      return response.data.users || [];
    } catch (error) {
      console.error(`Erro ao buscar usuários do grupo ${groupId}`, error);
      return [];
    }
  },

  // 4. Salvar Grupo (Cria/Edita Grupo + Vincula Usuários)
  save: async (groupData: Partial<Group>, selectedUserIds: number[]) => {
    let groupId = groupData.id;
    let isNewGroup = !groupId;

    try {
      // A. Salva os dados do Grupo
      if (groupId) {
        await crudService.update('group', groupId, groupData);
      } else {
        const res = await crudService.create('group', groupData);
        groupId = res.id;
      }
    } catch (error) {
      console.error("Erro CRÍTICO ao salvar grupo:", error);
      throw error;
    }

    // B. Salva os Membros (Vínculo)
    if (groupId) {
      try {
        // Se for novo e não tiver usuários selecionados, pula
        if (isNewGroup && (!selectedUserIds || selectedUserIds.length === 0)) {
           return groupId;
        }

        // Endpoint createUsersbyGroup (usergroup.controller.js)
        await api.post('/usersbygroup', {
          groupid: groupId,
          users: selectedUserIds,
          action: 'DELETE_EXISTING_USERS' // Substitui a lista antiga pela nova
        });
      } catch (memberError) {
        console.error("Aviso: Grupo salvo, mas falha ao vincular usuários:", memberError);
        toast.warning("Grupo salvo, mas houve erro ao vincular os membros.");
      }
    }

    return groupId;
  },

  // 5. Deletar
  delete: async (id: number) => {
    return await crudService.delete('group', id);
  }
};