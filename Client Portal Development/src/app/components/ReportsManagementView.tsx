import { useState } from "react";
import { 
  Search, 
  Plus, 
  Pencil, 
  Trash2, 
  BarChart3, 
  ExternalLink,
  CheckCircle2,
  XCircle,
  Link as LinkIcon,
  Users
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

// IMPORT DO MODAL CORRIGIDO (Lembre-se de importar o arquivo correto)
import { ReportRegistrationModal } from "./ReportRegistrationModal";

interface ReportData {
  id: string;
  title: string;
  group: string; // MUDANÇA: 'client' vira 'group'
  workspace: string;
  lastUpdate: string;
  status: 'active' | 'inactive';
  url: string;
}

const INITIAL_REPORTS: ReportData[] = [
  { 
    id: 'sw1', 
    title: 'Resumo', 
    group: 'Comercial Sell-out', // Exemplo de Grupo
    workspace: 'Comercial Sell-out',
    lastUpdate: '15/01/2026',
    status: 'active',
    url: 'https://app.powerbi.com/groups/me/reports/sw1'
  },
  { 
    id: 'sw2', 
    title: 'Status Day (Produtividade)', 
    group: 'Logística & Supply',
    workspace: 'Logística & Supply',
    lastUpdate: '14/01/2026',
    status: 'active',
    url: 'https://app.powerbi.com/groups/me/reports/sw2'
  },
  { 
    id: 'pg1', 
    title: 'Execução em Loja', 
    group: 'Trade Marketing',
    workspace: 'Trade Marketing',
    lastUpdate: '18/01/2026',
    status: 'active',
    url: 'https://app.powerbi.com/groups/me/reports/pg1'
  },
  { 
    id: 'h1', 
    title: 'Performance Sell-out', 
    group: 'Comercial Sell-out',
    workspace: 'Comercial Sell-out',
    lastUpdate: '20/01/2026',
    status: 'active',
    url: 'https://app.powerbi.com/groups/me/reports/h1'
  },
];

export function ReportsManagementView() {
  const [reports, setReports] = useState<ReportData[]>(INITIAL_REPORTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGroup, setFilterGroup] = useState("all"); // Filtro agora é por Grupo
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          report.workspace.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = filterGroup === "all" || report.group === filterGroup;
    return matchesSearch && matchesGroup;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            Gestão de Relatórios
          </h1>
          <p className="text-slate-500 text-sm">Gerencie os dashboards Power BI do portal.</p>
        </div>
        
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Relatório
        </Button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Buscar por título ou workspace..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="w-full md:w-64">
          <Select value={filterGroup} onValueChange={setFilterGroup}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por Grupo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Grupos</SelectItem>
              <SelectItem value="Comercial Sell-out">Comercial Sell-out</SelectItem>
              <SelectItem value="Logística & Supply">Logística & Supply</SelectItem> 
              <SelectItem value="Trade Marketing">Trade Marketing</SelectItem> 
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="w-[350px]">Título do Relatório</TableHead>
              <TableHead>Workspace</TableHead>
              <TableHead>Grupo</TableHead> {/* Coluna atualizada */}
              <TableHead>Atualização</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReports.map((report) => (
              <TableRow key={report.id} className="hover:bg-slate-50/50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-50 rounded-lg border border-amber-100">
                      <BarChart3 className="w-5 h-5 text-amber-600" />
                    </div>
                    <span className="font-semibold text-slate-800">{report.title}</span>
                  </div>
                </TableCell>

                <TableCell>
                  <span className="text-sm text-slate-600">{report.workspace}</span>
                </TableCell>

                {/* Coluna Grupo */}
                <TableCell>
                   <div className="flex items-center gap-2">
                     <Users className="w-3.5 h-3.5 text-slate-400" />
                     <span className="text-sm text-slate-600">{report.group}</span>
                   </div>
                </TableCell>

                <TableCell>
                  <span className="text-xs font-mono text-slate-500">{report.lastUpdate}</span>
                </TableCell>

                <TableCell>
                  {report.status === 'active' ? (
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Ativo
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200 gap-1">
                      <XCircle className="w-3 h-3" /> Inativo
                    </Badge>
                  )}
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                            onClick={() => window.open(report.url, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Abrir Link</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                      title="Editar"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>

                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ReportRegistrationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}