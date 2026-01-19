import { useState } from "react";
import { 
  Search, 
  ArrowLeft,
  MoreVertical,
  BarChart3,
  Users
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/app/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";

interface ClientData {
  id: string;
  name: string;
  description: string;
  logoColor: string; 
  groups: string[];
  activeReports: number;
}

const MOCK_CLIENTS: ClientData[] = [
  { 
    id: '1', 
    name: 'Sherwin-Williams', 
    description: 'Produtos para construção, com foco na produção, distribuição e venda de tintas.',
    logoColor: 'bg-slate-500', 
    groups: ['Comercial', 'Trade Marketing', 'Farmas'],
    activeReports: 12
  },
  { 
    id: '2', 
    name: 'SEMP TCL', 
    description: 'Pioneira em eletrônicos e uma das maiores fabricantes de TVs.',
    logoColor: 'bg-red-600', 
    groups: ['Vendas Varejo', 'Produto', 'Marketing'],
    activeReports: 8
  },
  { 
    id: '3', 
    name: 'P&G', 
    description: 'Multinacional de bens de consumo (Procter & Gamble).',
    logoColor: 'bg-blue-700', 
    groups: ['Gerência', 'Campo - Norte/Nordeste', 'Merchandising'],
    activeReports: 15
  },
];

interface ClientsListProps {
  onBack: () => void;
}

export function ClientsList({ onBack }: ClientsListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClients = MOCK_CLIENTS.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Carteira de Clientes</h1>
            <p className="text-slate-500 text-sm">Visualize os ambientes de cada cliente</p>
          </div>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar cliente..."
            className="pl-9 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Grid de Cards */}
      {filteredClients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <Card 
              key={client.id} 
              className="border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow"
            >
              <div className={`h-2 w-full ${client.logoColor}`} />
              
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm ${client.logoColor}`}>
                    {client.name.substring(0, 4)}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      {/* Botão de menu continua funcional para gestão (editar/excluir) */}
                      <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-slate-400 hover:text-slate-600">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        Editar Cliente
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        Desativar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                {/* Título agora é estático (sem cor azul no hover) */}
                <CardTitle className="text-lg font-bold text-slate-800">
                  {client.name}
                </CardTitle>
                <CardDescription className="line-clamp-2 h-10 mt-1">
                  {client.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1 pb-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <BarChart3 className="w-4 h-4 text-slate-400" />
                    <span className="font-medium">{client.activeReports}</span> Relatórios ativos
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <Users className="w-3 h-3" />
                      Grupos Vinculados
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {client.groups.map((group, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-slate-100 text-slate-600 font-normal">
                          {group}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>

              {/* REMOVIDO: CardFooter com "Acessar Dashboards" */}
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-200">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-slate-900">Nenhum cliente encontrado</h3>
          <p className="text-slate-500">Tente buscar por outro termo.</p>
        </div>
      )}
    </div>
  );
}