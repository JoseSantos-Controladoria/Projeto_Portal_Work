import api from './api';
import { crudService, PaginationParams } from './crudService';
import { toast } from "sonner"; // Importamos para avisar erros não-criticos

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
      console.log("🔥 [UserService] Usuários encontrados:", response);
      return response;
    } catch (error) {
      console.error("❌ [UserService] Erro ao listar usuários:", error);
      throw error; 
    }
  },

  // 2. Buscar Dados Auxiliares
  getAuxiliaryData: async () => {
    try {
      console.log("🔄 [UserService] Buscando dados auxiliares...");
      
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

  // 3. Buscar Grupos de um Usuário
  getUserGroups: async (userId: string | number) => {
    try {
      const response = await api.get(`/usergroup/${userId}`);
      return response.data.groups || []; 
    } catch (error) {
      console.error(`Erro ao buscar grupos do user ${userId}`, error);
      return [];
    }
  },

  // 4. Salvar Usuário (Blindado)
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
      // Se falhar AQUI, é erro crítico (o usuário não foi salvo)
      console.error("Erro CRÍTICO ao salvar usuário:", error);
      throw error; // Repassa o erro para o modal exibir
    }

    // B. Salvar Grupos (Try/Catch Isolado)
    // Só tentamos salvar se tivermos um ID de usuário válido
    if (userId) {
      try {
        // Otimização: Se for usuário novo e não escolheu grupos, nem chama a API
        if (isNewUser && (!selectedGroupIds || selectedGroupIds.length === 0)) {
           return userId;
        }

        // Se tiver grupos ou for edição (precisa limpar), chama a API
        if (selectedGroupIds) { 
           await api.post('/usergroup', {
            userid: userId,
            groups: selectedGroupIds,
            action: 'DELETE_EXISTING_GROUPS'
          });
        }
      } catch (groupError) {
        // Se falhar AQUI, é erro não-crítico (usuário foi salvo, mas grupos não)
        console.error("⚠️ Aviso: Usuário salvo, mas erro ao vincular grupos:", groupError);
        toast.warning("Usuário salvo, mas houve falha ao vincular os grupos.");
        // NÃO lançamos 'throw groupError' para não travar o fluxo de sucesso
      }
    }

    return userId;
  },

  // 5. Deletar
  delete: async (id: string | number) => {
    return await crudService.delete('user', id);
  }
};