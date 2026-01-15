import { useState } from "react";
import { 
  Search, 
  Plus, 
  Pencil, 
  Trash2, 
  Download, 
  Filter,
  XCircle,
  FileBarChart,
  ExternalLink,
  MoreHorizontal
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";

// Import do Modal
import { ReportRegistrationModal } from "./ReportRegistrationModal";

// Interface Local
interface ReportData {
  id: string;
  title: string;
  client: string;
  workspace: string;
  type: 'Power BI' | 'Excel' | 'PDF';
  tags: string[];
  lastUpdate: string;
  status: 'active' | 'inactive';
}

// Dados Mockados
const MOCK_REPORTS: ReportData[] = [
  { 
    id: '1', 
    title: 'Performance de Sell-out - Farma', 
    client: 'HALEON', 
    workspace: 'Comercial Sell-out',
    type: 'Power BI',
    tags: ['Vendas', 'Farma'], 
    lastUpdate: '15/01/2026',
    status: 'active'
  },
  { 
    id: '2', 
    title: 'Ruptura e Estoque Diário', 
    client: 'HALEON', 
    workspace: 'Logística & Supply',
    type: 'Power BI',
    tags: ['Logística'], 
    lastUpdate: '14/01/2026',
    status: 'active'
  },
  { 
    id: '3', 
    title: 'Trade Marketing - Cabelos', 
    client: 'P&G', 
    workspace: 'Trade Marketing',
    type: 'Power BI',
    tags: ['Trade', 'Hair Care'], 
    lastUpdate: '10/01/2026',
    status: 'active'
  },
  { 
    id: '4', 
    title: 'Vendas Varejo - Eletrônicos', 
    client: 'SEMP TCL', 
    workspace: 'Vendas Varejo',
    type: 'Power BI',
    tags: ['Varejo', 'TVs'], 
    lastUpdate: '12/01/2026',
    status: 'inactive'
  },
];

export function ReportsManagementView() {
  const [inputClient, setInputClient] = useState<string>("all");
  const [inputSearch, setInputSearch] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({ client: "all", search: "" });
  
  // Estado para controlar o Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = () => {
    setAppliedFilters({ client: inputClient, search: inputSearch });
  };

  const handleClear = () => {
    setInputClient("all");
    setInputSearch("");
    setAppliedFilters({ client: "all", search: "" });
  };

  const filteredReports = MOCK_REPORTS.filter(report => {
    const matchesClient = appliedFilters.client === "all" || report.client === appliedFilters.client;
    const matchesSearch = report.title.toLowerCase().includes(appliedFilters.search.toLowerCase()) ||
                          report.workspace.toLowerCase().includes(appliedFilters.search.toLowerCase());
    return matchesClient && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            Gestão de Relatórios
          </h1>
          <p className="text-slate-500 text-sm">Cadastre, edite e gerencie os relatórios disponíveis no portal.</p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none">
            <Download className="w-4 h-4 mr-2" />
            Exportar Lista
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 flex-1 md:flex-none"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Relatório
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        <div className="md:col-span-4 space-y-2">
          <label className="text-sm font-medium text-slate-700">Filtrar por Cliente</label>
          <Select value={inputClient} onValueChange={setInputClient}>
            <SelectTrigger>
              <SelectValue placeholder="Todos os clientes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Clientes</SelectItem>
              <SelectItem value="HALEON">HALEON</SelectItem>
              <SelectItem value="P&G">P&G</SelectItem>
              <SelectItem value="SEMP TCL">SEMP TCL</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-6 space-y-2">
          <label className="text-sm font-medium text-slate-700">Buscar Relatório</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Nome do relatório ou workspace..." 
              className="pl-9"
              value={inputSearch}
              onChange={(e) => setInputSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
        </div>

        <div className="md:col-span-2 flex gap-2">
          <Button className="w-full bg-slate-900 hover:bg-slate-800" onClick={handleSearch}>
            <Filter className="w-4 h-4 mr-2" />
            Filtrar
          </Button>
          {(inputClient !== 'all' || inputSearch !== '') && (
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
              <TableHead className="w-[300px]">Nome do Relatório</TableHead>
              <TableHead>Cliente & Workspace</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <TableRow key={report.id} className="hover:bg-slate-50/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <FileBarChart className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">{report.title}</div>
                        <div className="text-xs text-slate-400">Atualizado: {report.lastUpdate}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge variant="outline" className="w-fit text-slate-600 border-slate-300">
                        {report.client}
                      </Badge>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        Workspace: <span className="font-medium text-slate-700">{report.workspace}</span>
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {report.tags.map(tag => (
                        <span key={tag} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {report.status === 'active' ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                        Ativo
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
                        Inativo
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Pencil className="mr-2 h-4 w-4" /> Editar Configurações
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ExternalLink className="mr-2 h-4 w-4" /> Testar Link
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" /> Excluir Relatório
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                  Nenhum relatório encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Componente Modal */}
      <ReportRegistrationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}