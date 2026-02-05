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
      // VOLTAMOS PARA 'user' (SINGULAR)
      const response = await crudService.getAll<User>('user', pagination);
      return response;
    } catch (error) {
      console.error("❌ [UserService] Erro ao listar usuários:", error);
      throw error; 
    }
  },

  // 2. Buscar por ID
  getById: async (id: string | number) => {
    try {
      // VOLTAMOS PARA 'user' (SINGULAR)
      const response = await crudService.getAll<User>('user', undefined, { id: id });
      
      if (response.items && response.items.length > 0) {
        return response.items[0]; 
      }
      
      throw new Error("Usuário não encontrado.");
    } catch (error) {
      console.error(`❌ [UserService] Erro ao buscar usuário ${id}:`, error);
      throw error;
    }
  },

  // 3. Auxiliares
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

  getUserGroups: async (userId: string | number) => {
    try {
      const response = await api.get(`/groupsbyuser/${userId}`);
      return response.data.groups || []; 
    } catch (error) {
      console.error(`Erro ao buscar grupos do user ${userId}`, error);
      return [];
    }
  },

  // 4. Salvar (Lógica complexa com grupos)
  save: async (userData: Partial<User>, selectedGroupIds: number[]) => {
    let userId = userData.id;
    let isNewUser = !userId;

    try {
      if (userId) {
        // VOLTAMOS PARA 'user' (SINGULAR)
        await crudService.update('user', userId, userData);
      } else {
        const payload = { ...userData, password: userData.password || '123456' };
        // VOLTAMOS PARA 'user' (SINGULAR)
        const res = await crudService.create('user', payload);
        userId = res.id;
      }
    } catch (error: any) {
      console.error("Erro CRÍTICO ao salvar usuário:", error);
      throw error;
    }

    if (userId) {
      try {
        if (isNewUser && (!selectedGroupIds || selectedGroupIds.length === 0)) {
           return userId;
        }
        if (selectedGroupIds) { 
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

  // 5. Update Simples (Para Tela de Perfil)
  update: async (id: string | number, data: Partial<User>) => {
    // VOLTAMOS PARA 'user' (SINGULAR)
    return await crudService.update('user', id, data);
  },

  // 6. Deletar
  delete: async (id: string | number) => {
    // VOLTAMOS PARA 'user' (SINGULAR)
    return await crudService.delete('user', id);
  }
};