import { useState } from "react";
import { 
  Search, 
  Plus, 
  Pencil, 
  Trash2, 
  Filter, 
  FileBarChart, 
  ExternalLink,
  MoreHorizontal,
  Eye,
  CheckCircle2,
  XCircle,
  FileText,
  FileSpreadsheet
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";

interface ReportData {
  id: string;
  title: string;
  client: string;
  workspace: string;
  type: string;
  tags: string[];
  lastUpdate: string;
  status: 'active' | 'inactive';
  url: string; 
}

const MOCK_REPORTS: ReportData[] = [
  { 
    id: '1', 
    title: 'Resumo', 
    client: 'Sherwin-Williams', 
    workspace: 'Comercial Sell-out',
    type: 'Power BI',
    tags: ['Vendas', 'Farma'], 
    lastUpdate: '15/01/2026',
    status: 'active',
    url: 'https://app.powerbi.com/groups/me/reports/mock1'
  },
  { 
    id: '2', 
    title: 'Status Day (Produtividade)', 
    client: 'Sherwin-Williams', 
    workspace: 'Logística & Supply',
    type: 'Power BI',
    tags: ['Logística'], 
    lastUpdate: '14/01/2026',
    status: 'active',
    url: 'https://app.powerbi.com/groups/me/reports/mock2'
  },
  { 
    id: '3', 
    title: 'Ruptura', 
    client: 'Sherwin-Williams', 
    workspace: 'Trade Marketing',
    type: 'Power BI',
    tags: ['Trade', 'Hair Care'], 
    lastUpdate: '10/01/2026',
    status: 'active',
    url: 'https://app.powerbi.com/groups/me/reports/mock3'
  },
  { 
    id: '4', 
    title: 'Preços', 
    client: 'Sherwin-Williams', 
    workspace: 'Vendas Varejo',
    type: 'Power BI',
    tags: ['Varejo', 'TVs'], 
    lastUpdate: '12/01/2026',
    status: 'inactive',
    url: 'https://app.powerbi.com/groups/me/reports/mock4'
  },
  { 
    id: '5', 
    title: 'Ponto Extra',
    client: 'Sherwin-Williams',
    workspace: 'Análises de Mercado',
    type: 'Excel',
    tags: ['Mercado', 'Eletrodomésticos'],
    lastUpdate: '08/01/2026',
    status: 'active',
    url: 'https://office.live.com/start/Excel.aspx'
  },
  { 
    id: '6', 
    title: 'Share',
    client: 'Sherwin-Williams',
    workspace: 'Marketing Digital',
    type: 'PDF',
    tags: ['Marketing', 'Campanhas'],
    lastUpdate: '11/01/2026',
    status: 'active',
    url: '#'
  },
  { 
    id: '7', 
    title: 'Sellout', 
    client: 'Sherwin-Williams', 
    workspace: 'Comercial Sell-out',
    type: 'Power BI',
    tags: ['Vendas', 'Farma'], 
    lastUpdate: '15/01/2026',
    status: 'active',
    url: 'https://app.powerbi.com/groups/me/reports/mock7'
  }, 
];

export function ReportsManagementView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClient, setFilterClient] = useState("all");

  const filteredReports = MOCK_REPORTS.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          report.workspace.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClient = filterClient === "all" || report.client === filterClient;
    return matchesSearch && matchesClient;
  });

  const getIconByType = (type: string) => {
    if (type === 'Excel') return <FileSpreadsheet className="w-4 h-4 text-green-600" />;
    if (type === 'PDF') return <FileText className="w-4 h-4 text-red-600" />;
    return <FileBarChart className="w-4 h-4 text-amber-600" />;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            Gestão de Relatórios
          </h1>
          <p className="text-slate-500 text-sm">Cadastre, edite e gerencie os dashboards disponíveis.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20">
          <Plus className="w-4 h-4 mr-2" />
          Novo Relatório
        </Button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        <div className="md:col-span-5 space-y-2">
          <label className="text-sm font-medium text-slate-700">Buscar Relatório</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Título ou workspace..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="md:col-span-4 space-y-2">
          <label className="text-sm font-medium text-slate-700">Cliente</label>
          <Select value={filterClient} onValueChange={setFilterClient}>
            <SelectTrigger>
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="Sherwin-Williams">Sherwin-Williams</SelectItem>
              {/* Mantendo compatibilidade caso entrem outros */}
              <SelectItem value="HALEON">HALEON</SelectItem> 
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="w-[300px]">Título</TableHead>
              <TableHead>Workspace</TableHead>
              <TableHead>Tags</TableHead>
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
                    <div className="p-2 bg-slate-100 rounded-lg border border-slate-200">
                      {getIconByType(report.type)}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-800 block">{report.title}</span>
                      <span className="text-xs text-slate-500">{report.client} • {report.type}</span>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <span className="text-sm text-slate-600">{report.workspace}</span>
                </TableCell>

                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {report.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="bg-slate-100 text-slate-600 border-slate-200 text-[10px] h-5">
                        {tag}
                      </Badge>
                    ))}
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
                            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => window.open(report.url, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Abrir Link</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Opções</DropdownMenuLabel>
                        <DropdownMenuItem><Pencil className="w-4 h-4 mr-2" /> Editar</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600"><Trash2 className="w-4 h-4 mr-2" /> Excluir</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}