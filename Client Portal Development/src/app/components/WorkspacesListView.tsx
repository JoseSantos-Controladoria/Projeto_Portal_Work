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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";

import { WorkspaceRegistrationModal } from "./WorkspaceRegistrationModal";

// Interface Simplificada
interface WorkspaceData {
  id: string;
  name: string;
  url: string;
}

const MOCK_WORKSPACES: WorkspaceData[] = [
  { 
    id: '1', 
    name: 'Comercial Sell-out', 
    url: 'https://app.powerbi.com/groups/89b2-33a1/list'
  },
  { 
    id: '2', 
    name: 'Executivo & Diretoria', 
    url: 'https://app.powerbi.com/groups/77a1-22b3/list'
  },
  { 
    id: '3', 
    name: 'Vendas Varejo', 
    url: 'https://app.powerbi.com/groups/55c3-11e2/list'
  },
  { 
    id: '4', 
    name: 'Trade Marketing', 
    url: 'https://app.powerbi.com/groups/33d4-55f6/list'
  },
];

export function WorkspacesListView() {
  const [inputName, setInputName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredWorkspaces = MOCK_WORKSPACES.filter(ws => 
    ws.name.toLowerCase().includes(inputName.toLowerCase())
  );

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

      {/* Filtros Simplificados */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Buscar workspace por nome..." 
            className="pl-9"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
          />
        </div>
        
        {inputName && (
           <Button variant="ghost" size="icon" onClick={() => setInputName("")} className="text-slate-500 hover:text-red-500">
             <XCircle className="w-5 h-5" />
           </Button>
        )}
      </div>

      {/* Tabela Simplificada */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="w-[300px]">Nome do Workspace</TableHead>
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
                      
                      <span className="text-xs text-slate-400 font-mono truncate max-w-[300px]">
                        {ws.url}
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
                <TableCell colSpan={3} className="h-32 text-center text-slate-500">
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