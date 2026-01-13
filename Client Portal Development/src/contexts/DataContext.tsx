import React, { createContext, useContext, useState, useEffect } from 'react';
import { Dashboard, Document, Announcement, Profile, Company } from '@/types';
import { useAuth } from './AuthContext';
import { mockDashboards, mockClients } from '@/data/mockData';

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

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  
  // Estado local para armazenar os dados durante a sessão
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar dados iniciais (Mocks)
  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      
      // Simulando delay de API
      setTimeout(() => {
        // Carrega dashboards iniciais do mock
        setDashboards(mockDashboards);
        
        // Converte mockClients para o tipo Company (ajuste de tipagem se necessário)
        // Precisamos garantir que a tipagem bata, aqui faço um cast forçado seguro para o contexto
        setCompanies(mockClients as unknown as Company[]);
        
        // Inicializa outros arrays vazios ou com dados mockados futuros
        setDocuments([]);
        setAnnouncements([]);
        setProfiles([]);
        
        setLoading(false);
      }, 500);
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const addDashboard = async (dashboardData: Omit<Dashboard, 'id' | 'created_at' | 'updated_at'>) => {
    const newDashboard: Dashboard = {
      ...dashboardData,
      id: `dash-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_updated: new Date().toISOString()
    };
    setDashboards(prev => [...prev, newDashboard]);
  };

  const uploadDocument = async (file: File, companyId: string) => {
    const newDocument: Document = {
      id: `doc-${Date.now()}`,
      company_id: companyId,
      file_url: URL.createObjectURL(file), // URL temporária local
      file_type: file.type,
      file_name: file.name,
      file_size: file.size,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setDocuments(prev => [newDocument, ...prev]);
  };

  const deleteDocument = async (documentId: string) => {
    setDocuments(prev => prev.filter(d => d.id !== documentId));
  };

  const addAnnouncement = async (data: { message: string; company_id?: string }) => {
    const newAnnouncement: Announcement = {
      id: `ann-${Date.now()}`,
      message: data.message,
      date: new Date().toISOString(),
      active: true,
      company_id: data.company_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setAnnouncements(prev => [newAnnouncement, ...prev]);
  };

  const addUser = async (userData: { email: string; name: string; role: 'admin' | 'client'; company_id?: string }) => {
    const newProfile: Profile = {
      id: `profile-${Date.now()}`,
      user_id: `user-${Date.now()}`,
      company_id: userData.company_id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setProfiles(prev => [...prev, newProfile]);
  };

  const deleteUser = async (userId: string) => {
    setProfiles(prev => prev.filter(p => p.id !== userId));
  };

  const getUnreadAnnouncementsCount = (companyId?: string): number => {
    return announcements.filter(a => 
      a.active && (!a.company_id || a.company_id === companyId)
    ).length;
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