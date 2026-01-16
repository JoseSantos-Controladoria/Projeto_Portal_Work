import { useState } from "react";
import { 
  Search, 
  Plus, 
  Pencil, 
  Trash2, 
  Filter,
  XCircle,
  Layout,
  ExternalLink,
  Copy
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/app/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Badge } from "@/app/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";

import { WorkspaceRegistrationModal } from "./WorkspaceRegistrationModal";

// Interface Atualizada (Sem ID técnico)
interface WorkspaceData {
  id: string;
  name: string;
  clientName: string;
  description: string;
  url: string;
}

// Dados Mockados Atualizados
const MOCK_WORKSPACES: WorkspaceData[] = [
  { 
    id: '1', 
    name: 'Comercial Sell-out', 
    clientName: 'HALEON', 
    description: 'Relatórios de performance de vendas, ruptura e estoque nas principais redes farma.',
    url: 'https://app.powerbi.com/groups/89b2-33a1/list'
  },
  { 
    id: '2', 
    name: 'Executivo & Diretoria', 
    clientName: 'HALEON', 
    description: 'Dashboards consolidados para tomada de decisão estratégica (DRE, P&L).',
    url: 'https://app.powerbi.com/groups/77a1-22b3/list'
  },
  { 
    id: '3', 
    name: 'Vendas Varejo', 
    clientName: 'SEMP TCL', 
    description: 'Monitoramento de sell-out nos grandes varejistas (Magalu, Via, Fast).',
    url: 'https://app.powerbi.com/groups/55c3-11e2/list'
  },
  { 
    id: '4', 
    name: 'Trade Marketing', 
    clientName: 'P&G', 
    description: 'Acompanhamento de execução em loja, planograma e materiais de merchandising.',
    url: 'https://app.powerbi.com/groups/33d4-55f6/list'
  },
];

export function WorkspacesListView() {
  const [inputClient, setInputClient] = useState<string>("all");
  const [inputName, setInputName] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({ client: "all", name: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = () => {
    setAppliedFilters({ client: inputClient, name: inputName });
  };

  const handleClear = () => {
    setInputClient("all");
    setInputName("");
    setAppliedFilters({ client: "all", name: "" });
  };

  const filteredWorkspaces = MOCK_WORKSPACES.filter(ws => {
    const matchesClient = appliedFilters.client === "all" || ws.clientName === appliedFilters.client;
    const matchesName = ws.name.toLowerCase().includes(appliedFilters.name.toLowerCase());
    return matchesClient && matchesName;
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 rounded-lg">
            <Layout className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Workspaces Power BI
            </h1>
            <p className="text-slate-500 text-sm">Gerencie os ambientes e links de acesso.</p>
          </div>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <Button 
            className="bg-amber-600 hover:bg-amber-700 text-white flex-1 md:flex-none"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Workspace
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        <div className="md:col-span-4 space-y-2">
          <label className="text-sm font-medium text-slate-700">Cliente Associado</label>
          <Select value={inputClient} onValueChange={setInputClient}>
            <SelectTrigger>
              <SelectValue placeholder="Todos os clientes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Clientes</SelectItem>
              <SelectItem value="HALEON">HALEON</SelectItem>
              <SelectItem value="SEMP TCL">SEMP TCL</SelectItem>
              <SelectItem value="P&G">P&G</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-5 space-y-2">
          <label className="text-sm font-medium text-slate-700">Nome do Workspace</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Ex: Comercial, Vendas..." 
              className="pl-9"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
        </div>

        <div className="md:col-span-3 flex gap-2">
          <Button className="flex-1 bg-slate-900 hover:bg-slate-800" onClick={handleSearch}>
            <Filter className="w-4 h-4 mr-2" />
            Filtrar
          </Button>
          {(inputClient !== 'all' || inputName !== '') && (
             <Button variant="ghost" size="icon" onClick={handleClear} className="text-slate-500 hover:text-red-500">
               <XCircle className="w-5 h-5" />
             </Button>
          )}
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="w-[250px]">Workspace</TableHead>
              <TableHead className="w-[150px]">Cliente</TableHead>
              <TableHead className="w-[350px]">Descrição</TableHead>
              <TableHead>URL de Acesso</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWorkspaces.length > 0 ? (
              filteredWorkspaces.map((ws) => (
                <TableRow key={ws.id} className="hover:bg-slate-50/50">
                  <TableCell>
                    <div className="font-semibold text-slate-800">{ws.name}</div>
                    {/* ID Removido daqui */}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal text-slate-600 bg-slate-50">
                      {ws.clientName}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-slate-600 line-clamp-2" title={ws.description}>
                      {ws.description}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-slate-400 hover:text-blue-600"
                              onClick={() => window.open(ws.url, '_blank')}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Abrir no Power BI</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-slate-400 hover:text-green-600"
                              onClick={() => copyToClipboard(ws.url)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Copiar Link</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <span className="text-xs text-slate-400 font-mono truncate max-w-[120px]">
                        {ws.url.replace('https://app.powerbi.com/', '')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-orange-600">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                  Nenhum workspace encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <WorkspaceRegistrationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}