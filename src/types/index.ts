export type UserRole = 'admin' | 'client';

export interface User {
  id: string;
  email: string;
  password?: string; // Opcional quando vem do Supabase Auth
  name: string;
  role: UserRole;
  company_id?: string; // Vinculado à company_id conforme especificação
  createdAt: string;
  updated_at?: string;
}

export interface Company {
  id: string;
  name: string;
  logo?: string; // URL do logo
  created_at: string;
  updated_at?: string;
}

export interface Client {
  id: string;
  name: string;
  logoUrl?: string;
  createdAt: string;
}

export interface Dashboard {
  id: string;
  title: string;
  description?: string;
  embed_url: string; // URL do iframe do PowerBI
  company_id: string; // Vinculado à company_id
  created_at: string;
  updated_at?: string;
  last_updated?: string; // Para compatibilidade
}

export interface Document {
  id: string;
  company_id: string;
  file_url: string; // URL do arquivo no Supabase Storage
  file_type: string; // PDF, PPT, XLS, etc.
  file_name: string;
  file_size?: number;
  created_at: string;
  updated_at?: string;
}

export interface Announcement {
  id: string;
  message: string;
  date: string;
  active: boolean;
  company_id?: string; // NULL para comunicados globais, específico para comunicados por empresa
  created_at: string;
  updated_at?: string;
}

export interface Profile {
  id: string;
  user_id: string; // Referência ao auth.users
  company_id?: string; // NULL para admins
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at?: string;
}

export interface GroupSummary {
  group_id: number;
  group_name: string;
}

export interface CustomerDashboard {
  customer_id: number;
  customer_name: string;
  qty_report: number | string; // O PostgreSQL retorna count/sum como string as vezes
  groups: GroupSummary[];
}