import { supabase } from '@/lib/supabase';
import { Dashboard, Document, Announcement, Profile, Company } from '@/types';

// Dashboards
export async function getDashboards(companyId?: string): Promise<Dashboard[]> {
  let query = supabase.from('dashboards').select('*').order('created_at', { ascending: false });
  
  if (companyId) {
    query = query.eq('company_id', companyId);
  }

  const { data, error } = await query;
  if (error) throw error;
  
  return (data || []).map((d: any) => ({
    id: d.id,
    title: d.title,
    description: d.description,
    embed_url: d.embed_url,
    company_id: d.company_id,
    created_at: d.created_at,
    updated_at: d.updated_at,
    last_updated: d.updated_at || d.created_at,
  }));
}

export async function createDashboard(dashboard: Omit<Dashboard, 'id' | 'created_at' | 'updated_at'>): Promise<Dashboard> {
  const { data, error } = await supabase
    .from('dashboards')
    .insert({
      title: dashboard.title,
      description: dashboard.description,
      embed_url: dashboard.embed_url,
      company_id: dashboard.company_id,
    })
    .select()
    .single();

  if (error) throw error;
  
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    embed_url: data.embed_url,
    company_id: data.company_id,
    created_at: data.created_at,
    updated_at: data.updated_at,
    last_updated: data.updated_at || data.created_at,
  };
}

export async function deleteDashboard(dashboardId: string): Promise<void> {
  const { error } = await supabase
    .from('dashboards')
    .delete()
    .eq('id', dashboardId);

  if (error) throw error;
}

// Documents
export async function getDocuments(companyId?: string): Promise<Document[]> {
  let query = supabase.from('documents').select('*').order('created_at', { ascending: false });
  
  if (companyId) {
    query = query.eq('company_id', companyId);
  }

  const { data, error } = await query;
  if (error) throw error;
  
  return (data || []).map((d: any) => ({
    id: d.id,
    company_id: d.company_id,
    file_url: d.file_url,
    file_type: d.file_type,
    file_name: d.file_name,
    file_size: d.file_size,
    created_at: d.created_at,
    updated_at: d.updated_at,
  }));
}

export async function uploadDocument(
  file: File,
  companyId: string
): Promise<Document> {
  // Upload para Supabase Storage
  const fileExt = file.name.split('.').pop();
  const fileName = `${companyId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
  
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('documents')
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  // Obter URL pública
  const { data: { publicUrl } } = supabase.storage
    .from('documents')
    .getPublicUrl(fileName);

  // Criar registro no banco
  const { data, error } = await supabase
    .from('documents')
    .insert({
      company_id: companyId,
      file_url: publicUrl,
      file_type: file.type,
      file_name: file.name,
      file_size: file.size,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    company_id: data.company_id,
    file_url: data.file_url,
    file_type: data.file_type,
    file_name: data.file_name,
    file_size: data.file_size,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}

export async function deleteDocument(documentId: string): Promise<void> {
  // Buscar documento para obter o caminho do arquivo
  const { data: doc, error: fetchError } = await supabase
    .from('documents')
    .select('file_url')
    .eq('id', documentId)
    .single();

  if (fetchError) throw fetchError;

  // Extrair caminho do arquivo da URL
  const urlParts = doc.file_url.split('/');
  const filePath = urlParts.slice(urlParts.indexOf('documents') + 1).join('/');

  // Deletar do storage
  const { error: storageError } = await supabase.storage
    .from('documents')
    .remove([filePath]);

  if (storageError) throw storageError;

  // Deletar registro
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', documentId);

  if (error) throw error;
}

// Announcements
export async function getAnnouncements(companyId?: string): Promise<Announcement[]> {
  let query = supabase
    .from('announcements')
    .select('*')
    .eq('active', true)
    .order('date', { ascending: false });

  if (companyId) {
    query = query.or(`company_id.is.null,company_id.eq.${companyId}`);
  } else {
    query = query.is('company_id', null);
  }

  const { data, error } = await query;
  if (error) throw error;
  
  return (data || []).map((a: any) => ({
    id: a.id,
    message: a.message,
    date: a.date,
    active: a.active,
    company_id: a.company_id,
    created_at: a.created_at,
    updated_at: a.updated_at,
  }));
}

export async function createAnnouncement(
  announcement: { message: string; company_id?: string }
): Promise<Announcement> {
  const { data, error } = await supabase
    .from('announcements')
    .insert({
      message: announcement.message,
      company_id: announcement.company_id || null,
      date: new Date().toISOString(),
      active: true,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    message: data.message,
    date: data.date,
    active: data.active,
    company_id: data.company_id,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}

// Profiles/Users
export async function getProfiles(companyId?: string): Promise<Profile[]> {
  let query = supabase.from('profiles').select('*').order('created_at', { ascending: false });
  
  if (companyId) {
    query = query.eq('company_id', companyId);
  }

  const { data, error } = await query;
  if (error) throw error;
  
  return (data || []).map((p: any) => ({
    id: p.id,
    user_id: p.user_id,
    company_id: p.company_id,
    name: p.name,
    email: p.email,
    role: p.role,
    created_at: p.created_at,
    updated_at: p.updated_at,
  }));
}

export async function createUser(
  userData: { email: string; name: string; role: 'admin' | 'client'; company_id?: string }
): Promise<Profile> {
  // Criar usuário no Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: userData.email,
    password: Math.random().toString(36).slice(-12), // Senha temporária
    email_confirm: true,
  });

  if (authError) throw authError;

  // Criar perfil
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      user_id: authData.user.id,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      company_id: userData.company_id || null,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    user_id: data.user_id,
    company_id: data.company_id,
    name: data.name,
    email: data.email,
    role: data.role,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}

export async function deleteUser(userId: string): Promise<void> {
  // Buscar perfil para obter user_id
  const { data: profile, error: fetchError } = await supabase
    .from('profiles')
    .select('user_id')
    .eq('id', userId)
    .single();

  if (fetchError) throw fetchError;

  // Deletar do Auth (requer admin)
  const { error: authError } = await supabase.auth.admin.deleteUser(profile.user_id);
  if (authError) throw authError;

  // Deletar perfil
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId);

  if (error) throw error;
}

// Companies
export async function getCompanies(): Promise<Company[]> {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  
  return (data || []).map((c: any) => ({
    id: c.id,
    name: c.name,
    logo: c.logo,
    created_at: c.created_at,
    updated_at: c.updated_at,
  }));
}
