# 📊 TradeData Manager - Guia de Uso

## Bem-vindo ao TradeData Manager!

Uma plataforma SaaS profissional para agências de Trade Marketing gerenciarem e compartilharem dashboards do Power BI com seus clientes de forma segura e organizada.

---

## 🎯 Visão Geral

O TradeData Manager possui **dois fluxos distintos** baseados no tipo de usuário:

### 👨‍💼 Fluxo do Administrador (Agência)
- Gerenciar múltiplos clientes
- Adicionar/remover relatórios para cada cliente
- Visualizar todos os dashboards

### 👤 Fluxo do Cliente
- Visualizar apenas seus próprios relatórios
- Acesso em tela cheia aos dashboards do Power BI
- Interface limpa e intuitiva

---

## 🔐 Acesso ao Sistema

### Credenciais de Demonstração

**Administrador (Agência):**
```
Email: admin@tradedata.com
Senha: admin123
```

**Cliente - Supermercados Brasil:**
```
Email: carlos@supermercados.com
Senha: cliente123
```

**Cliente - Rede Atacado:**
```
Email: ana@atacado.com
Senha: cliente123
```

**Cliente - Magazine Varejo:**
```
Email: joao@magazine.com
Senha: cliente123
```

---

## 📱 Para Administradores

### 1️⃣ Gerenciar Clientes

Após fazer login como administrador:

1. **Visualizar Clientes**
   - A tela inicial mostra todos os clientes em cards
   - Cada card exibe: logo, nome e quantidade de relatórios

2. **Adicionar Novo Cliente**
   - Clique em "Novo Cliente"
   - Preencha: Nome da empresa e URL do logo (opcional)
   - Clique em "Criar Cliente"

3. **Acessar Dashboard de um Cliente**
   - Clique no card do cliente
   - Você verá todos os relatórios desse cliente

### 2️⃣ Gerenciar Relatórios

Dentro da página de um cliente:

1. **Adicionar Novo Relatório**
   - Clique no botão azul "Adicionar Novo Relatório"
   - Preencha os campos:
     - **Título**: Nome do relatório (ex: "Performance de Vendas")
     - **Descrição**: Descrição detalhada (ex: "Dados atualizados a cada 24h")
     - **URL do Embed**: URL de incorporação do Power BI
     - **Ícone**: Selecione um ícone visual para o card
   - Clique em "Criar Relatório"

2. **Visualizar Relatório**
   - Clique em "Visualizar" no card do relatório
   - O relatório abre em tela cheia

3. **Excluir Relatório**
   - Clique no ícone de lixeira (🗑️) no card
   - Confirme a exclusão

---

## 👥 Para Clientes

### Acessar Seus Relatórios

1. **Login**
   - Faça login com seu email e senha
   - Você será direcionado para sua home

2. **Visualizar Relatórios**
   - Todos os seus relatórios aparecem em cards
   - Cada card mostra:
     - Ícone personalizado
     - Título do relatório
     - Descrição
     - Data da última atualização

3. **Abrir Relatório**
   - Clique no botão "Visualizar Relatório"
   - O dashboard do Power BI abre em tela cheia
   - Use "Voltar" para retornar à lista

4. **Controles do Visualizador**
   - **Voltar**: Retorna à lista de relatórios
   - **Atualizar**: Recarrega o iframe
   - **Tela Cheia**: Expande o relatório (tecla F11)

---

## 🎨 Recursos de Design

### Paleta de Cores
- **Sidebar**: `#0F172A` (Slate 900 escuro)
- **Fundo**: `#F8FAFC` (Slate 50 claro)
- **Botões Primários**: `#2563EB` (Blue 600)
- **Hover**: `#1D4ED8` (Blue 700)

### Componentes Modernos
- Cards com sombra suave (`shadow-sm`)
- Bordas arredondadas (`rounded-xl`)
- Ícones do Lucide React
- Transições suaves em hover
- Layout responsivo

---

## 🔧 Como Obter URL de Embed do Power BI

Para adicionar um relatório do Power BI:

1. Acesse seu relatório no **Power BI Service**
2. Clique em **"Arquivo"** → **"Inserir relatório"** → **"Site ou portal"**
3. Copie a URL de incorporação gerada
4. Cole a URL no campo "URL do Embed" ao criar o relatório

**Exemplo de URL:**
```
https://app.powerbi.com/view?r=eyJrIjoiZXhhbXBsZSIsInQiOiJleGFtcGxlIn0%3D
```

---

## 📊 Estrutura de Dados

O sistema trabalha com 3 entidades principais:

### Clientes
- ID único
- Nome da empresa
- URL do logo
- Data de criação

### Usuários
- ID único
- Email (para login)
- Nome completo
- Tipo (admin ou client)
- Cliente associado (se for client)

### Dashboards
- ID único
- Título
- Descrição
- URL do embed
- Ícone
- Cliente associado
- Data da última atualização

---

## 🚀 Próximos Passos

### Implementar com Supabase

Para transformar em uma aplicação completa com backend:

1. Consulte o arquivo `SUPABASE_SCHEMA.md`
2. Crie as tabelas no Supabase
3. Configure Row Level Security (RLS)
4. Substitua os contextos mock pelos serviços Supabase
5. Implemente upload de logos no Supabase Storage

### Melhorias Sugeridas

- [ ] Filtro de busca nos relatórios
- [ ] Ordenação personalizada dos cards
- [ ] Analytics de uso (tempo de visualização)
- [ ] Notificações quando novos relatórios são adicionados
- [ ] Favoritos
- [ ] Comentários nos relatórios
- [ ] Histórico de acessos
- [ ] Dark mode
- [ ] Export de PDFs dos dashboards

---

## 🛡️ Segurança

### Boas Práticas Implementadas

✅ **Controle de acesso baseado em roles**
- Admins veem tudo
- Clientes veem apenas seus dados

✅ **Validação de formulários**
- Campos obrigatórios validados
- Feedback visual de erros

✅ **URLs seguras**
- Apenas URLs do Power BI são aceitas

### Recomendações para Produção

⚠️ **Não use em produção sem Supabase**
- Dados são simulados (mock)
- Sem persistência real
- Sem criptografia de senhas

⚠️ **Não armazene dados sensíveis**
- O Figma Make não é destinado para PII
- Use Supabase para dados reais

---

## 💡 Dicas de Uso

### Para Administradores

1. **Organize clientes por segmento**
   - Use nomes claros e descritivos
   - Adicione logos para fácil identificação

2. **Mantenha descrições atualizadas**
   - Informe a frequência de atualização dos dados
   - Explique o que cada relatório mostra

3. **Escolha ícones relevantes**
   - TrendingUp: Performance, crescimento
   - DollarSign: Vendas, ROI
   - Store: PDV, execução
   - MapPin: Distribuição, cobertura

### Para Clientes

1. **Adicione aos favoritos**
   - Marque este site nos favoritos do navegador
   - Acesso rápido aos seus relatórios

2. **Use tela cheia**
   - Melhor experiência de visualização
   - Mais espaço para análise de dados

3. **Verifique atualizações**
   - Badge mostra quando foi atualizado
   - Relatórios são atualizados automaticamente pelo Power BI

---

## 📞 Suporte

Para dúvidas ou sugestões sobre o sistema:

- 📧 Email: admin@tradedata.com
- 📱 WhatsApp: (11) 99999-9999
- 🌐 Site: www.tradedata.com.br

---

## 📝 Notas da Versão

**Versão 1.0 - Janeiro 2026**

✨ Funcionalidades lançadas:
- Autenticação de usuários (admin e client)
- Gerenciamento de clientes
- CRUD de dashboards
- Visualização em tela cheia
- Design system profissional
- Interface responsiva
- Cards interativos com preview
- Seletor de ícones
- Timestamps automáticos

---

**Desenvolvido com ❤️ para Agências de Trade Marketing**
