import { useState } from "react";
import { 
  Building2, 
  Users, 
  ArrowLeft,
  BarChart3,
  Clock,
  ArrowUpRight,
  Briefcase,
  FolderOpen,
  Layout
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";

// Importando os componentes das telas específicas
import { GroupsListView } from "./GroupsListView";
import { ClientsList } from "./ClientsList";

// --- DADOS MOCKADOS DOS WORKSPACES ---
// Em um cenário real, isso viria do backend baseado no ID do cliente
const MOCK_WORKSPACES: Record<string, any[]> = {
  'HALEON': [
    { id: 'w1', name: 'Executivo & Diretoria', reports: 4, type: 'Strategic' },
    { id: 'w2', name: 'Comercial Sell-out', reports: 8, type: 'Sales' },
    { id: 'w3', name: 'Logística & Supply', reports: 3, type: 'Operations' },
  ],
  'SEMP TCL': [
    { id: 'w4', name: 'Vendas Varejo', reports: 5, type: 'Sales' },
    { id: 'w5', name: 'Marketing Digital', reports: 2, type: 'Marketing' },
  ],
  'P&G': [
    { id: 'w6', name: 'Trade Marketing', reports: 12, type: 'Trade' },
    { id: 'w7', name: 'Performance Regional', reports: 6, type: 'Sales' },
    { id: 'w8', name: 'Auditoria de Campo', reports: 3, type: 'Field' },
  ]
};

// Tipagem para as views internas
type InternalView = 'selection' | 'clients_list' | 'groups_list' | 'client_workspaces' | 'workspace_dashboards';

export function ClientsListView() {
  const [currentView, setCurrentView] = useState<InternalView>('selection');
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [selectedWorkspace, setSelectedWorkspace] = useState<any>(null);

  // 1. Selecionou Cliente -> Vai para Lista de Workspaces
  const handleClientSelect = (client: any) => {
    setSelectedClient(client);
    setCurrentView('client_workspaces');
  };

  // 2. Selecionou Workspace -> Vai para Lista de Dashboards
  const handleWorkspaceSelect = (workspace: any) => {
    setSelectedWorkspace(workspace);
    setCurrentView('workspace_dashboards');
  };

  // --- RENDERIZAÇÃO DAS VIEWS ---

  // VIEW A: Lista de Grupos
  if (currentView === 'groups_list') {
    return <GroupsListView onBack={() => setCurrentView('selection')} />;
  }

  // VIEW B: Lista de Clientes
  if (currentView === 'clients_list') {
    return (
      <ClientsList 
        onBack={() => setCurrentView('selection')} 
        onSelectClient={handleClientSelect}
      />
    );
  }

  // VIEW C: Workspaces do Cliente (NOVA CAMADA)
  if (currentView === 'client_workspaces' && selectedClient) {
    const workspaces = MOCK_WORKSPACES[selectedClient.name] || [];

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
        <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setCurrentView('clients_list')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm ${selectedClient.logoColor || 'bg-blue-600'}`}>
              {selectedClient.name.substring(0, 2)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{selectedClient.name}</h1>
              <p className="text-slate-500 text-sm">Selecione um Workspace para visualizar os relatórios</p>
            </div>
          </div>
        </div>

        {/* Grid de Workspaces */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaces.length > 0 ? (
            workspaces.map((workspace) => (
              <Card 
                key={workspace.id} 
                className="group hover:shadow-lg hover:border-blue-300 transition-all duration-300 cursor-pointer border-slate-200"
                onClick={() => handleWorkspaceSelect(workspace)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start mb-2">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <FolderOpen className="w-6 h-6" />
                    </div>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                      {workspace.type}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg text-slate-800">
                    {workspace.name}
                  </CardTitle>
                  <CardDescription>
                    Workspace dedicado
                  </CardDescription>
                </CardHeader>
                <CardFooter className="pt-4 border-t border-slate-50 flex justify-between items-center text-sm">
                  <span className="text-slate-500 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    {workspace.reports} Relatórios
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
                </CardFooter>
              </Card>
            ))
          ) : (
             <div className="col-span-3 text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
               <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
               <p className="text-slate-500">Nenhum workspace configurado para este cliente.</p>
             </div>
          )}
        </div>
      </div>
    );
  }

  // VIEW D: Dashboards do Workspace (FIM DO FLUXO)
  if (currentView === 'workspace_dashboards' && selectedClient && selectedWorkspace) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setCurrentView('client_workspaces')}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
               <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                 <span className="font-semibold text-blue-600">{selectedClient.name}</span>
                 <span>/</span>
                 <span>{selectedWorkspace.name}</span>
               </div>
              <h1 className="text-2xl font-bold text-slate-900">Relatórios Disponíveis</h1>
            </div>
          </div>
        </div>

        {/* Mock de Dashboards deste Workspace */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: selectedWorkspace.reports || 3 }).map((_, i) => (
            <Card key={i} className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-slate-200">
              <div className="h-1 bg-blue-600 w-full" />
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <Badge variant="outline" className="text-xs bg-slate-50">Power BI</Badge>
                </div>
                <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                  {selectedWorkspace.name} - Visão {i + 1}
                </CardTitle>
                <CardDescription>
                  Análise de performance detalhada para tomada de decisão.
                </CardDescription>
              </CardHeader>
              <CardFooter className="pt-0 flex items-center justify-between text-xs text-slate-400 mt-4 p-6 bg-slate-50/50 border-t border-slate-100">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Atualizado hoje</span>
                </div>
                <div className="flex items-center gap-1 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                  Abrir <ArrowUpRight className="w-3 h-3" />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // VIEW PADRÃO: Tela de Seleção Inicial
  return (
    <div className="max-w-5xl mx-auto mt-10 animate-in fade-in zoom-in duration-300">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900">Gerenciamento de Entidades</h2>
        <p className="text-slate-500 mt-2">Selecione o tipo de registro que deseja gerenciar</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 px-4">
        {/* Card: Clientes */}
        <Card 
          className="group cursor-pointer hover:shadow-xl hover:border-blue-500/50 transition-all duration-300 border-2 border-slate-200"
          onClick={() => setCurrentView('clients_list')}
        >
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
              Clientes
            </CardTitle>
            <CardDescription>
              Gerencie empresas, workspaces e relatórios.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center pb-8">
            <span className="text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
              Acessar Clientes &rarr;
            </span>
          </CardContent>
        </Card>

        {/* Card: Grupos de Acesso */}
        <Card 
          className="group cursor-pointer hover:shadow-xl hover:border-emerald-500/50 transition-all duration-300 border-2 border-slate-200"
          onClick={() => setCurrentView('groups_list')}
        >
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Users className="w-8 h-8 text-emerald-600" />
            </div>
            <CardTitle className="text-xl group-hover:text-emerald-600 transition-colors">
              Grupos de Acesso
            </CardTitle>
            <CardDescription>
              Defina permissões e organize usuários em departamentos.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center pb-8">
            <span className="text-sm font-medium text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
              Acessar Grupos &rarr;
            </span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}