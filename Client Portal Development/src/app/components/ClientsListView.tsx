import { useState } from "react";
import { 
  Building2, 
  Users, 
  ArrowLeft,
  BarChart3,
  Clock,
  ArrowUpRight
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

// Tipagem para as views internas
type InternalView = 'selection' | 'clients_list' | 'groups_list' | 'client_details';

export function ClientsListView() {
  const [currentView, setCurrentView] = useState<InternalView>('selection');
  const [selectedClient, setSelectedClient] = useState<any>(null);

  // Função chamada ao clicar em um card de cliente na lista
  const handleClientSelect = (client: any) => {
    setSelectedClient(client);
    setCurrentView('client_details');
  };

  // --- RENDERIZAÇÃO DAS VIEWS ---

  // 1. VIEW: Lista de Grupos (Chama o componente que você já tem pronto)
  if (currentView === 'groups_list') {
    return <GroupsListView onBack={() => setCurrentView('selection')} />;
  }

  // 2. VIEW: Lista de Clientes (Chama o componente ClientsList)
  if (currentView === 'clients_list') {
    return (
      <ClientsList 
        onBack={() => setCurrentView('selection')} 
        onSelectClient={handleClientSelect}
      />
    );
  }

  // 3. VIEW: Detalhes do Cliente (Lista de Dashboards do Cliente)
  if (currentView === 'client_details' && selectedClient) {
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
              <p className="text-slate-500 text-sm">Visualizando relatórios disponíveis</p>
            </div>
          </div>
        </div>

        {/* Mock de Dashboards deste cliente */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
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
                  Relatório de Vendas {selectedClient.name} 0{i}
                </CardTitle>
                <CardDescription>
                  Análise detalhada de sell-out e performance por região.
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

  // 4. VIEW PADRÃO: Tela de Seleção Inicial (Cards de Escolha)
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
              Gerencie empresas, contratos e configurações individuais.
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