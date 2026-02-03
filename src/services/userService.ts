import api from './api';
import { crudService, PaginationParams } from './crudService';
import { toast } from "sonner"; 

export interface User {
  id: string; 
  name: string;
  email: string;
  active: boolean;
  company_id: number;
  profile_id: number;
  perfil?: string; 
  last_update?: string;
  password?: string;
}

export const userService = {
  // 1. Listar Usuários
  getAll: async (pagination?: PaginationParams) => {
    try {
      const response = await crudService.getAll<User>('user', pagination);
      return response;
    } catch (error) {
      console.error("❌ [UserService] Erro ao listar usuários:", error);
      throw error; 
    }
  },

  // 2. Buscar Dados Auxiliares
  getAuxiliaryData: async () => {
    try {
      const [companies, profiles, groups] = await Promise.all([
        crudService.getAll('company'),
        crudService.getAll('profile'),
        crudService.getAll('group')
      ]);

      return {
        companies: companies.items || [],
        profiles: profiles.items || [],
        groups: groups.items || []
      };
    } catch (error) {
      console.error("❌ [UserService] Erro ao carregar auxiliares:", error);
      return { companies: [], profiles: [], groups: [] };
    }
  },

  // 3. Buscar Grupos de um Usuário (CORRIGIDO)
  getUserGroups: async (userId: string | number) => {
    try {
      // 🔴 ANTES: /usergroup/${userId}
      // 🟢 AGORA: /groupsbyuser/${userId} (Conforme definido no back)
      const response = await api.get(`/groupsbyuser/${userId}`);
      return response.data.groups || []; 
    } catch (error) {
      console.error(`Erro ao buscar grupos do user ${userId}`, error);
      return [];
    }
  },

  // 4. Salvar Usuário
  save: async (userData: Partial<User>, selectedGroupIds: number[]) => {
    let userId = userData.id;
    let isNewUser = !userId;

    try {
      // A. Salvar User
      if (userId) {
        await crudService.update('user', userId, userData);
      } else {
        const payload = { ...userData, password: userData.password || '123456' };
        const res = await crudService.create('user', payload);
        userId = res.id;
      }
    } catch (error: any) {
      console.error("Erro CRÍTICO ao salvar usuário:", error);
      throw error;
    }

    // B. Salvar Grupos
    if (userId) {
      try {
        // Se for usuário novo e não escolheu grupos, nem chama a API
        if (isNewUser && (!selectedGroupIds || selectedGroupIds.length === 0)) {
           return userId;
        }

        // Se tiver grupos ou for edição, chama a API
        if (selectedGroupIds) { 
           // 🔴 ANTES: /usergroup
           // 🟢 AGORA: /groupsbyuser (Conforme definido no back)
           await api.post('/groupsbyuser', {
            userid: userId,
            groups: selectedGroupIds,
            action: 'DELETE_EXISTING_GROUPS'
          });
        }
      } catch (groupError) {
        console.error("⚠️ Aviso: Usuário salvo, mas erro ao vincular grupos:", groupError);
        toast.warning("Usuário salvo, mas houve falha ao vincular os grupos.");
      }
    }

    return userId;
  },

  // 5. Deletar
  delete: async (id: string | number) => {
    return await crudService.delete('user', id);
  }
};