# TradeData Manager - Estrutura do Banco de Dados Supabase

Este documento descreve a estrutura completa para implementação com Supabase conforme especificação.

## Tabelas

### 1. `companies` (Empresas Clientes)

Armazena as empresas clientes da agência.

```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Campos:**
- `id`: Identificador único da empresa
- `name`: Nome da empresa cliente
- `logo`: URL do logo da empresa (opcional)
- `created_at`: Data de criação
- `updated_at`: Data da última atualização

---

### 2. `profiles` (Perfis de Usuários)

Armazena os perfis dos usuários vinculados ao Supabase Auth.

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'client')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);
```

**Campos:**
- `id`: Identificador único do perfil
- `user_id`: Referência ao usuário no Supabase Auth
- `company_id`: Referência à empresa cliente (NULL para admins)
- `name`: Nome completo do usuário
- `email`: Email do usuário
- `role`: Tipo de usuário ('admin' ou 'client')
- `created_at`: Data de criação
- `updated_at`: Data da última atualização

**Observação:** A autenticação é gerenciada pelo Supabase Auth. Esta tabela armazena informações adicionais do perfil e vincula cada usuário a uma `company_id` para garantir segurança RLS.

---

### 3. `dashboards` (Relatórios do Power BI)

Armazena os dashboards configurados para cada cliente.

```sql
CREATE TABLE dashboards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  embed_url TEXT NOT NULL,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Campos:**
- `id`: Identificador único do dashboard
- `title`: Título do relatório
- `description`: Descrição detalhada do relatório
- `embed_url`: URL de incorporação do Power BI (iframe)
- `company_id`: Referência à empresa proprietária do dashboard
- `created_at`: Data de criação do registro
- `updated_at`: Data da última modificação

---

### 4. `documents` (Arquivos)

Armazena os arquivos (PDFs, PPTs, XLS) disponíveis para cada cliente.

```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Campos:**
- `id`: Identificador único do documento
- `company_id`: Referência à empresa proprietária do arquivo
- `file_url`: URL do arquivo no Supabase Storage
- `file_type`: Tipo do arquivo (PDF, PPT, XLS, etc.)
- `file_name`: Nome original do arquivo
- `file_size`: Tamanho do arquivo em bytes
- `created_at`: Data de criação
- `updated_at`: Data da última atualização

---

### 5. `announcements` (Comunicados/Mural)

Armazena os comunicados globais ou específicos por empresa.

```sql
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  active BOOLEAN DEFAULT true,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Campos:**
- `id`: Identificador único do anúncio
- `message`: Mensagem do comunicado
- `date`: Data do comunicado
- `active`: Se o comunicado está ativo
- `company_id`: Referência à empresa (NULL para comunicados globais)
- `created_at`: Data de criação
- `updated_at`: Data da última atualização

---

## Row Level Security (RLS)

### Habilitar RLS em todas as tabelas

```sql
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
```

### Políticas para `companies`

```sql
-- Admins podem ver todas as empresas
CREATE POLICY "Admins can view all companies"
ON companies FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Clientes podem ver apenas sua própria empresa
CREATE POLICY "Clients can view their own company"
ON companies FOR SELECT
TO authenticated
USING (
  id IN (
    SELECT company_id FROM profiles
    WHERE profiles.user_id = auth.uid()
  )
);

-- Admins podem criar/editar empresas
CREATE POLICY "Admins can manage companies"
ON companies FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'admin'
  )
);
```

### Políticas para `profiles`

```sql
-- Admins podem ver todos os perfis
CREATE POLICY "Admins can view all profiles"
ON profiles FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles AS p
    WHERE p.user_id = auth.uid()
    AND p.role = 'admin'
  )
);

-- Usuários podem ver seu próprio perfil
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Clientes podem ver perfis da sua empresa
CREATE POLICY "Clients can view team profiles"
ON profiles FOR SELECT
TO authenticated
USING (
  company_id IN (
    SELECT company_id FROM profiles
    WHERE profiles.user_id = auth.uid()
  )
);

-- Admins podem gerenciar perfis
CREATE POLICY "Admins can manage profiles"
ON profiles FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles AS p
    WHERE p.user_id = auth.uid()
    AND p.role = 'admin'
  )
);
```

### Políticas para `dashboards`

```sql
-- Admins podem ver todos os dashboards
CREATE POLICY "Admins can view all dashboards"
ON dashboards FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Clientes podem ver apenas dashboards da sua empresa
CREATE POLICY "Clients can view their dashboards"
ON dashboards FOR SELECT
TO authenticated
USING (
  company_id IN (
    SELECT company_id FROM profiles
    WHERE profiles.user_id = auth.uid()
  )
);

-- Admins podem gerenciar dashboards
CREATE POLICY "Admins can manage dashboards"
ON dashboards FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'admin'
  )
);
```

### Políticas para `documents`

```sql
-- Admins podem ver todos os documentos
CREATE POLICY "Admins can view all documents"
ON documents FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Clientes podem ver apenas documentos da sua empresa
CREATE POLICY "Clients can view their documents"
ON documents FOR SELECT
TO authenticated
USING (
  company_id IN (
    SELECT company_id FROM profiles
    WHERE profiles.user_id = auth.uid()
  )
);

-- Admins podem gerenciar documentos
CREATE POLICY "Admins can manage documents"
ON documents FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'admin'
  )
);
```

### Políticas para `announcements`

```sql
-- Admins podem ver todos os anúncios
CREATE POLICY "Admins can view all announcements"
ON announcements FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Clientes podem ver anúncios globais e da sua empresa
CREATE POLICY "Clients can view relevant announcements"
ON announcements FOR SELECT
TO authenticated
USING (
  active = true AND (
    company_id IS NULL OR
    company_id IN (
      SELECT company_id FROM profiles
      WHERE profiles.user_id = auth.uid()
    )
  )
);

-- Admins podem gerenciar anúncios
CREATE POLICY "Admins can manage announcements"
ON announcements FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'admin'
  )
);
```

---

## Índices Recomendados

```sql
-- Índice para busca rápida de perfis por user_id
CREATE INDEX idx_profiles_user_id ON profiles(user_id);

-- Índice para busca rápida de perfis por company_id
CREATE INDEX idx_profiles_company_id ON profiles(company_id);

-- Índice para busca rápida de dashboards por company_id
CREATE INDEX idx_dashboards_company_id ON dashboards(company_id);

-- Índice para busca rápida de documentos por company_id
CREATE INDEX idx_documents_company_id ON documents(company_id);

-- Índice para busca rápida de anúncios por company_id e active
CREATE INDEX idx_announcements_company_active ON announcements(company_id, active) WHERE active = true;
```

---

## Triggers para atualização automática

```sql
-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para todas as tabelas
CREATE TRIGGER update_companies_updated_at
BEFORE UPDATE ON companies
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dashboards_updated_at
BEFORE UPDATE ON dashboards
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
BEFORE UPDATE ON documents
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at
BEFORE UPDATE ON announcements
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

---

## Dados de Exemplo

```sql
-- Inserir empresas de exemplo
INSERT INTO companies (name, logo) VALUES
  ('Supermercados Brasil S.A.', 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=200&h=200&fit=crop'),
  ('Rede Atacado Premium', 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=200&h=200&fit=crop'),
  ('Magazine Varejo Total', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop');

-- Nota: Os usuários serão criados através do Supabase Auth
-- Após criar no Auth, vincular na tabela profiles com company_id apropriado
```

---

## Integração com Supabase Auth

1. **Configurar autenticação por email/senha** no Supabase Dashboard
2. **Criar usuário admin** através do Supabase Auth
3. **Inserir registro na tabela profiles** após criar no Auth:

```sql
INSERT INTO profiles (user_id, email, name, role)
VALUES (
  'auth_user_id_aqui',
  'admin@tradedata.com',
  'Administrador',
  'admin'
);
```

4. **Criar usuários clientes** e vincular ao `company_id` apropriado:

```sql
INSERT INTO profiles (user_id, email, name, role, company_id)
VALUES (
  'auth_user_id_cliente',
  'carlos@supermercados.com',
  'Carlos Silva',
  'client',
  'id_da_empresa_aqui'
);
```

---

## Consultas Úteis

### Listar todos os dashboards de uma empresa específica

```sql
SELECT d.* 
FROM dashboards d
JOIN companies c ON d.company_id = c.id
WHERE c.name = 'Supermercados Brasil S.A.'
ORDER BY d.created_at DESC;
```

### Listar empresas com contagem de dashboards

```sql
SELECT 
  c.id,
  c.name,
  c.logo,
  COUNT(d.id) as dashboard_count
FROM companies c
LEFT JOIN dashboards d ON c.id = d.company_id
GROUP BY c.id, c.name, c.logo
ORDER BY c.name;
```

### Listar perfis por empresa

```sql
SELECT 
  c.name as company_name,
  p.name as user_name,
  p.email,
  p.role
FROM profiles p
LEFT JOIN companies c ON p.company_id = c.id
ORDER BY c.name, p.name;
```

### Listar anúncios não lidos para um usuário

```sql
SELECT a.*
FROM announcements a
WHERE a.active = true
AND (
  a.company_id IS NULL OR
  a.company_id IN (
    SELECT company_id FROM profiles
    WHERE user_id = auth.uid()
  )
)
ORDER BY a.date DESC;
```

---

## Storage (Upload de Arquivos)

Configure buckets no Supabase Storage:

### 1. Bucket `company-logos` (Logos das empresas)

```sql
-- Permitir leitura pública dos logos
CREATE POLICY "Public read access for logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'company-logos');

-- Admins podem fazer upload de logos
CREATE POLICY "Admins can upload logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'company-logos'
  AND EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'admin'
  )
);
```

### 2. Bucket `documents` (Arquivos PDF/PPT/XLS)

```sql
-- Usuários autenticados podem ler arquivos da sua empresa
CREATE POLICY "Users can read their company documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents'
  AND (
    -- Admins podem ver todos
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
    )
    OR
    -- Clientes podem ver arquivos da sua empresa
    (storage.foldername(name))[1] IN (
      SELECT company_id::text FROM profiles
      WHERE profiles.user_id = auth.uid()
    )
  )
);

-- Admins podem fazer upload de documentos
CREATE POLICY "Admins can upload documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documents'
  AND EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Admins podem deletar documentos
CREATE POLICY "Admins can delete documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'documents'
  AND EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'admin'
  )
);
```

**Estrutura de pastas sugerida:**
- `documents/{company_id}/{file_name}` - Organiza arquivos por empresa

---

## Notas de Segurança

1. ✅ **Sempre use RLS** para proteger dados sensíveis
2. ✅ **Valide URLs do Power BI** antes de salvar
3. ✅ **Use HTTPS** para todas as URLs de embed
4. ✅ **Implemente rate limiting** nas APIs
5. ✅ **Registre atividades críticas** (logs de acesso, modificações)
6. ⚠️ **Não armazene senhas** na tabela users (Supabase Auth cuida disso)
7. ⚠️ **Configure backup automático** do banco de dados

---

## Próximos Passos

Após criar as tabelas no Supabase:

1. Instalar o pacote Supabase: `npm install @supabase/supabase-js`
2. Configurar variáveis de ambiente com URL e anon key
3. Substituir contextos mock pelos serviços Supabase
4. Implementar real-time subscriptions para atualizações instantâneas
5. Adicionar analytics de uso dos dashboards
