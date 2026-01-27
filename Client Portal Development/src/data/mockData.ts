import { User, Client, Dashboard } from '@/types';

export const mockClients: Client[] = [
  {
    id: 'client-1',
    name: 'HALEON',
    logoUrl: 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=200&h=200&fit=crop',
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'client-2',
    name: 'SEMP TCL',
    logoUrl: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=200&h=200&fit=crop',
    createdAt: '2025-01-02T00:00:00Z',
  },
  {
    id: 'client-3',
    name: 'P&G',
    logoUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop',
    createdAt: '2025-01-03T00:00:00Z',
  },
];


export const mockUsers: User[] = [
  // 1. O Administrador (Vê tudo)
  {
    id: '1',
    name: 'Administrador WorkOn',
    email: 'admin@workongroup.com.br',
    password: '123', // Senha simples para dev
    role: 'admin',
    createdAt: new Date().toISOString(),
  },

  // 2. Usuário HALEON
  {
    id: '2',
    name: 'Gestor Haleon',
    email: 'gestor@haleon.com',
    password: '123',
    role: 'client',
    company_id: 'haleon', // Vínculo mágico
    createdAt: new Date().toISOString(),
  },

  // 3. Usuário P&G
  {
    id: '3',
    name: 'Analista P&G',
    email: 'analista@pg.com',
    password: '123',
    role: 'client',
    company_id: 'pg',
    createdAt: new Date().toISOString(),
  },

  // 4. Usuário SEMP TCL
  {
    id: '4',
    name: 'Diretor Semp TCL',
    email: 'diretor@semptcl.com',
    password: '123',
    role: 'client',
    company_id: 'semptcl',
    createdAt: new Date().toISOString(),
  },

  // 5. Usuário Sherwin-Williams
  {
    id: '5',
    name: 'Coord. Sherwin',
    email: 'coord@sherwin.com',
    password: '123',
    role: 'client',
    company_id: 'sherwin',
    createdAt: new Date().toISOString(),
  }
];


export const mockDashboards: Dashboard[] = [
  {
    id: 'dash-1',
    title: 'Performance de Vendas - Janeiro',
    description: 'Análise detalhada das vendas do mês de janeiro por categoria e região',
    embed_url: 'https://app.powerbi.com/view?r=eyJrIjoiZXhhbXBsZS1rZXktMSIsInQiOiJleGFtcGxlLXRva2VuIn0%3D',
    company_id: 'client-1',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-13T08:00:00Z',
    last_updated: '2026-01-13T08:00:00Z',
  },
  {
    id: 'dash-2',
    title: 'Ruptura de Estoque',
    description: 'Monitoramento em tempo real de rupturas e oportunidades de reposição',
    embed_url: 'https://app.powerbi.com/view?r=eyJrIjoiZXhhbXBsZS1rZXktMiIsInQiOiJleGFtcGxlLXRva2VuIn0%3D',
    company_id: 'client-1',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-13T06:30:00Z',
    last_updated: '2026-01-13T06:30:00Z',
  },
  {
    id: 'dash-3',
    title: 'Market Share Competitivo',
    description: 'Análise comparativa de market share vs principais concorrentes',
    embed_url: 'https://app.powerbi.com/view?r=eyJrIjoiZXhhbXBsZS1rZXktMyIsInQiOiJleGFtcGxlLXRva2VuIn0%3D',
    company_id: 'client-1',
    created_at: '2026-01-05T00:00:00Z',
    updated_at: '2026-01-12T14:00:00Z',
    last_updated: '2026-01-12T14:00:00Z',
  },
  {
    id: 'dash-4',
    title: 'Distribuição Numérica e Ponderada',
    description: 'Indicadores de distribuição por PDV e região',
    embed_url: 'https://app.powerbi.com/view?r=eyJrIjoiZXhhbXBsZS1rZXktNCIsInQiOiJleGFtcGxlLXRva2VuIn0%3D',
    company_id: 'client-2',
    created_at: '2026-01-02T00:00:00Z',
    updated_at: '2026-01-13T09:15:00Z',
    last_updated: '2026-01-13T09:15:00Z',
  },
  {
    id: 'dash-5',
    title: 'ROI de Campanhas Promocionais',
    description: 'Análise de retorno sobre investimento em ações de trade marketing',
    embed_url: 'https://app.powerbi.com/view?r=eyJrIjoiZXhhbXBsZS1rZXktNSIsInQiOiJleGFtcGxlLXRva2VuIn0%3D',
    company_id: 'client-2',
    created_at: '2026-01-02T00:00:00Z',
    updated_at: '2026-01-12T16:45:00Z',
    last_updated: '2026-01-12T16:45:00Z',
  },
  {
    id: 'dash-6',
    title: 'Execução no PDV',
    description: 'Compliance de execução de materiais e ações no ponto de venda',
    embed_url: 'https://app.powerbi.com/view?r=eyJrIjoiZXhhbXBsZS1rZXktNiIsInQiOiJleGFtcGxlLXRva2VuIn0%3D',
    company_id: 'client-3',
    created_at: '2026-01-03T00:00:00Z',
    updated_at: '2026-01-13T07:20:00Z',
    last_updated: '2026-01-13T07:20:00Z',
  },
  {
    id: 'dash-7',
    title: 'Sell-Out vs Sell-In',
    description: 'Comparativo de vendas para o canal vs vendas ao consumidor final',
    embed_url: 'https://app.powerbi.com/view?r=eyJrIjoiZXhhbXBsZS1rZXktNyIsInQiOiJleGFtcGxlLXRva2VuIn0%3D',
    company_id: 'client-3',
    created_at: '2026-01-03T00:00:00Z',
    updated_at: '2026-01-11T18:30:00Z',
    last_updated: '2026-01-11T18:30:00Z',
  },
];