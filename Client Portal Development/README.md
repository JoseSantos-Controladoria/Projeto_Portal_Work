# TradeData Manager

Um SaaS B2B completo para agências de Trade Marketing gerenciarem e disponibilizarem dashboards e arquivos para seus clientes.

## 🚀 Funcionalidades

### Perfis de Acesso
- **Admin (Agência)**: Acesso total - gerencia todos os clientes, cria usuários, faz upload de arquivos e configura dashboards
- **Cliente (Viewer)**: Acesso restrito - visualiza apenas dados, arquivos e usuários vinculados à sua própria empresa

### Navegação

#### HOME
- **Dashboards**: Visualização de relatórios PowerBI em cards. Ao clicar, abre o embed em tela cheia.

#### GESTÃO
- **Arquivos (Repository)**: 
  - Admin: Upload de PDFs/PPTs/XLS para clientes específicos
  - Cliente: Lista de arquivos disponíveis para download
- **Equipe (Team)**:
  - Admin: Gerencia todos os usuários do sistema
  - Cliente: Visualiza membros da equipe com acesso ao portal

#### COMUNICAÇÃO
- **Mural (Broadcast)**: 
  - Admin: Posta comunicados globais ou específicos por empresa
  - Cliente: Visualiza avisos em timeline. Badge vermelho na sidebar indica avisos não lidos

## 🛠️ Tecnologias

- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **Supabase** para autenticação, banco de dados e storage
- **Tailwind CSS** para estilização
- **Shadcn/UI** para componentes
- **Lucide React** para ícones

## 📦 Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` e adicione suas credenciais do Supabase:
```
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

4. Execute o projeto em desenvolvimento:
```bash
npm run dev
```

## 🗄️ Configuração do Supabase

### 1. Criar as Tabelas

Execute os scripts SQL do arquivo `SUPABASE_SCHEMA.md` no SQL Editor do Supabase Dashboard.

### 2. Configurar Storage

1. Crie os buckets:
   - `company-logos` (público)
   - `documents` (privado)

2. Configure as políticas de acesso conforme descrito em `SUPABASE_SCHEMA.md`

### 3. Criar Usuário Admin

1. No Supabase Dashboard, vá em Authentication → Users
2. Crie um novo usuário com email e senha
3. No SQL Editor, insira o perfil:

```sql
INSERT INTO profiles (user_id, email, name, role)
VALUES (
  'id_do_usuario_criado',
  'admin@tradedata.com',
  'Administrador',
  'admin'
);
```

## 🎨 Design System

- **Cor Principal**: Azul Royal (#2563EB)
- **Fonte**: Inter (sans-serif)
- **Estilo**: Profissional, cards com sombra suave e bordas arredondadas

## 📝 Estrutura de Dados

O sistema utiliza as seguintes tabelas no Supabase:

- `companies`: Empresas clientes
- `profiles`: Perfis de usuários vinculados ao Supabase Auth
- `dashboards`: Relatórios PowerBI configurados
- `documents`: Arquivos (PDF, PPT, XLS) armazenados
- `announcements`: Comunicados globais ou específicos

Todas as tabelas possuem Row Level Security (RLS) configurado para garantir que:
- Admins vejam todos os dados
- Clientes vejam apenas dados da sua própria empresa

## 🔒 Segurança

- Autenticação via Supabase Auth
- Row Level Security (RLS) em todas as tabelas
- Validação de URLs do Power BI
- Políticas de acesso no Storage

## 📚 Documentação Adicional

- `SUPABASE_SCHEMA.md`: Schema completo do banco de dados
- `GUIA_DE_USO.md`: Guia de uso da aplicação

## 🚧 Modo de Desenvolvimento (Mock)

Se as variáveis de ambiente do Supabase não estiverem configuradas, o sistema funciona em modo mock usando dados locais. Isso permite desenvolvimento sem necessidade de configurar o Supabase imediatamente.

## 📄 Licença

Este projeto é privado e proprietário.
