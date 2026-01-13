import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Profile } from '@/types';
import { supabase } from '@/lib/supabase';
import { mockUsers } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Modo de desenvolvimento: usar mock se Supabase não estiver configurado
const USE_MOCK = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (USE_MOCK) {
      // Modo mock: verificar localStorage
      const savedUser = localStorage.getItem('tradedata_user');
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
        } catch (e) {
          console.error('Erro ao parsear usuário do localStorage:', e);
        }
      }
      setLoading(false);
      return;
    }

    // Modo Supabase: verificar sessão
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        loadUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        await loadUserProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      if (data) {
        const profileData: Profile = {
          id: data.id,
          user_id: data.user_id,
          company_id: data.company_id,
          name: data.name,
          email: data.email,
          role: data.role,
          created_at: data.created_at,
          updated_at: data.updated_at,
        };

        setProfile(profileData);
        
        // Converter Profile para User (compatibilidade)
        const userData: User = {
          id: profileData.user_id,
          email: profileData.email,
          name: profileData.name,
          role: profileData.role,
          company_id: profileData.company_id,
          createdAt: profileData.created_at,
        };
        setUser(userData);
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    if (USE_MOCK) {
      // Modo mock
      const foundUser = mockUsers.find(
        (u) => u.email === email && u.password === password
      );

      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('tradedata_user', JSON.stringify(foundUser));
        return true;
      }
      return false;
    }

    // Modo Supabase
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        await loadUserProfile(data.user.id);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    if (USE_MOCK) {
      setUser(null);
      setProfile(null);
      localStorage.removeItem('tradedata_user');
      return;
    }

    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        login,
        logout,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
