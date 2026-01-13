import React, { createContext, useContext, useState, useEffect } from 'react';
import { Dashboard, Document, Announcement, Profile, Company } from '@/types';
import { useAuth } from './AuthContext';
import { mockDashboards } from '@/data/mockData';

// Lazy import do supabaseService apenas quando necessário
let supabaseService: typeof import('@/services/supabaseService') | null = null;
const loadSupabaseService = async () => {
  if (!supabaseService) {
    supabaseService = await import('@/services/supabaseService');
  }
  return supabaseService;
};

interface DataContextType {
  dashboards: Dashboard[];
  documents: Document[];
  announcements: Announcement[];
  profiles: Profile[];
  companies: Company[];
  addDashboard: (dashboard: Omit<Dashboard, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  uploadDocument: (file: File, companyId: string) => Promise<void>;
  deleteDocument: (documentId: string) => Promise<void>;
  addAnnouncement: (announcement: { message: string; company_id?: string }) => Promise<void>;
  addUser: (user: { email: string; name: string; role: 'admin' | 'client'; company_id?: string }) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  getUnreadAnnouncementsCount: (companyId?: string) => number;
  loading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Modo de desenvolvimento: usar mock se Supabase não estiver configurado
const USE_MOCK = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar dados quando autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    loadData();
  }, [isAuthenticated, user]);

  const loadData = async () => {
    if (USE_MOCK) {
      // Modo mock: usar dados mockados
      setDashboards(mockDashboards);
      setDocuments([]);
      setAnnouncements([]);
      setProfiles([]);
      setCompanies([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const userCompanyId = user?.company_id;
      const isAdmin = user?.role === 'admin';

      // Carregar serviço Supabase apenas quando necessário
      const service = await loadSupabaseService();

      // Carregar dados em paralelo
      const [dashboardsData, documentsData, announcementsData, profilesData, companiesData] = await Promise.all([
        service.getDashboards(isAdmin ? undefined : userCompanyId),
        service.getDocuments(isAdmin ? undefined : userCompanyId),
        service.getAnnouncements(userCompanyId),
        service.getProfiles(isAdmin ? undefined : userCompanyId),
        isAdmin ? service.getCompanies() : Promise.resolve([]),
      ]);

      setDashboards(dashboardsData);
      setDocuments(documentsData);
      setAnnouncements(announcementsData);
      setProfiles(profilesData);
      setCompanies(companiesData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const addDashboard = async (dashboard: Omit<Dashboard, 'id' | 'created_at' | 'updated_at'>) => {
    if (USE_MOCK) {
      const newDashboard: Dashboard = {
        ...dashboard,
        id: `dash-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_updated: new Date().toISOString(),
      };
      setDashboards([...dashboards, newDashboard]);
      return;
    }

    try {
      const service = await loadSupabaseService();
      const newDashboard = await service.createDashboard(dashboard);
      setDashboards([...dashboards, newDashboard]);
    } catch (error) {
      console.error('Erro ao adicionar dashboard:', error);
      throw error;
    }
  };

  const uploadDocument = async (file: File, companyId: string) => {
    if (USE_MOCK) {
      const newDocument: Document = {
        id: `doc-${Date.now()}`,
        company_id: companyId,
        file_url: URL.createObjectURL(file),
        file_type: file.type,
        file_name: file.name,
        file_size: file.size,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setDocuments([...documents, newDocument]);
      return;
    }

    try {
      const service = await loadSupabaseService();
      const newDocument = await service.uploadDocument(file, companyId);
      setDocuments([newDocument, ...documents]);
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      throw error;
    }
  };

  const deleteDocument = async (documentId: string) => {
    if (USE_MOCK) {
      setDocuments(documents.filter(d => d.id !== documentId));
      return;
    }

    try {
      const service = await loadSupabaseService();
      await service.deleteDocument(documentId);
      setDocuments(documents.filter(d => d.id !== documentId));
    } catch (error) {
      console.error('Erro ao deletar documento:', error);
      throw error;
    }
  };

  const addAnnouncement = async (announcement: { message: string; company_id?: string }) => {
    if (USE_MOCK) {
      const newAnnouncement: Announcement = {
        id: `ann-${Date.now()}`,
        message: announcement.message,
        date: new Date().toISOString(),
        active: true,
        company_id: announcement.company_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setAnnouncements([newAnnouncement, ...announcements]);
      return;
    }

    try {
      const service = await loadSupabaseService();
      const newAnnouncement = await service.createAnnouncement(announcement);
      setAnnouncements([newAnnouncement, ...announcements]);
    } catch (error) {
      console.error('Erro ao adicionar comunicado:', error);
      throw error;
    }
  };

  const addUser = async (user: { email: string; name: string; role: 'admin' | 'client'; company_id?: string }) => {
    if (USE_MOCK) {
      const newProfile: Profile = {
        id: `profile-${Date.now()}`,
        user_id: `user-${Date.now()}`,
        company_id: user.company_id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setProfiles([...profiles, newProfile]);
      return;
    }

    try {
      const service = await loadSupabaseService();
      const newProfile = await service.createUser(user);
      setProfiles([...profiles, newProfile]);
      await loadData(); // Recarregar para atualizar lista
    } catch (error) {
      console.error('Erro ao adicionar usuário:', error);
      throw error;
    }
  };

  const deleteUser = async (userId: string) => {
    if (USE_MOCK) {
      setProfiles(profiles.filter(p => p.id !== userId));
      return;
    }

    try {
      const service = await loadSupabaseService();
      await service.deleteUser(userId);
      setProfiles(profiles.filter(p => p.id !== userId));
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      throw error;
    }
  };

  const getUnreadAnnouncementsCount = (companyId?: string): number => {
    // Por enquanto, retornar todos os anúncios ativos como "não lidos"
    // Em produção, você pode adicionar uma tabela de "read_announcements" para rastrear
    const relevantAnnouncements = announcements.filter(a => 
      a.active && (!a.company_id || a.company_id === companyId)
    );
    return relevantAnnouncements.length;
  };

  return (
    <DataContext.Provider
      value={{
        dashboards,
        documents,
        announcements,
        profiles,
        companies,
        addDashboard,
        uploadDocument,
        deleteDocument,
        addAnnouncement,
        addUser,
        deleteUser,
        getUnreadAnnouncementsCount,
        loading,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
