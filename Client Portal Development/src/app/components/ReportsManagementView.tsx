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
  Link as LinkIcon
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";

interface ReportData {
  id: string;
  title: string;
  client: string;
  workspace: string;
  lastUpdate: string;
  status: 'active' | 'inactive';
  url: string;
}

const INITIAL_REPORTS: ReportData[] = [
  { 
    id: 'sw1', 
    title: 'Resumo', 
    client: 'Sherwin-Williams', 
    workspace: 'Comercial Sell-out',
    lastUpdate: '15/01/2026',
    status: 'active',
    url: 'https://app.powerbi.com/groups/me/reports/sw1'
  },
  { 
    id: 'sw2', 
    title: 'Status Day (Produtividade)', 
    client: 'Sherwin-Williams', 
    workspace: 'Logística & Supply',
    lastUpdate: '14/01/2026',
    status: 'active',
    url: 'https://app.powerbi.com/groups/me/reports/sw2'
  },
  { 
    id: 'pg1', 
    title: 'Execução em Loja', 
    client: 'P&G', 
    workspace: 'Trade Marketing',
    lastUpdate: '18/01/2026',
    status: 'active',
    url: 'https://app.powerbi.com/groups/me/reports/pg1'
  },
  { 
    id: 'h1', 
    title: 'Performance Sell-out', 
    client: 'HALEON', 
    workspace: 'Comercial Sell-out',
    lastUpdate: '20/01/2026',
    status: 'active',
    url: 'https://app.powerbi.com/groups/me/reports/h1'
  },
];

export function ReportsManagementView() {
  const [reports, setReports] = useState<ReportData[]>(INITIAL_REPORTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClient, setFilterClient] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [newReport, setNewReport] = useState({
    title: "",
    client: "",
    workspace: "",
    url: "",
    status: "active"
  });

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          report.workspace.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClient = filterClient === "all" || report.client === filterClient;
    return matchesSearch && matchesClient;
  });

  const handleSaveReport = () => {
    if (!newReport.title || !newReport.client) return;

    const reportToAdd: ReportData = {
      id: Math.random().toString(36).substr(2, 9),
      title: newReport.title,
      client: newReport.client,
      workspace: newReport.workspace || "Geral",
      lastUpdate: "Hoje",
      status: newReport.status as 'active' | 'inactive', 
      url: newReport.url || "#"
    };

    setReports([reportToAdd, ...reports]);
    setIsModalOpen(false);
    
    setNewReport({ title: "", client: "", workspace: "", url: "", status: "active" }); 
  };

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

      {/* MODAL DE CADASTRO */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white">
          <DialogHeader>
            <DialogTitle>Cadastrar Novo Relatório</DialogTitle>
            <DialogDescription>
              Insira os dados do dashboard Power BI para disponibilizá-lo no portal.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {/* Título */}
            <div className="grid gap-2">
              <Label htmlFor="title">Título do Relatório</Label>
              <Input 
                id="title" 
                placeholder="Ex: Performance Vendas Q1" 
                value={newReport.title}
                onChange={(e) => setNewReport({...newReport, title: e.target.value})}
              />
            </div>
            
            {/* Linha 2: Cliente e Workspace */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Cliente</Label>
                <Select 
                  value={newReport.client} 
                  onValueChange={(val) => setNewReport({...newReport, client: val})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sherwin-Williams">Sherwin-Williams</SelectItem>
                    <SelectItem value="HALEON">HALEON</SelectItem>
                    <SelectItem value="P&G">P&G</SelectItem>
                    <SelectItem value="SEMP TCL">SEMP TCL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="workspace">Workspace / Área</Label>
                <Input 
                  id="workspace" 
                  placeholder="Ex: Comercial" 
                  value={newReport.workspace}
                  onChange={(e) => setNewReport({...newReport, workspace: e.target.value})}
                />
              </div>
            </div>

            {/* Linha 3 (NOVA): Status */}
            <div className="grid gap-2">
              <Label>Status de Visualização</Label>
              <Select 
                value={newReport.status} 
                onValueChange={(val) => setNewReport({...newReport, status: val})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      Ativo (Visível)
                    </div>
                  </SelectItem>
                  <SelectItem value="inactive">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-slate-300" />
                      Inativo (Oculto)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* URL */}
            <div className="grid gap-2">
              <Label htmlFor="url">Link do Power BI (Embed)</Label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  id="url" 
                  className="pl-9" 
                  placeholder="https://app.powerbi.com/..." 
                  value={newReport.url}
                  onChange={(e) => setNewReport({...newReport, url: e.target.value})}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSaveReport}>Salvar Relatório</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
          <Select value={filterClient} onValueChange={setFilterClient}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por Cliente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Clientes</SelectItem>
              <SelectItem value="Sherwin-Williams">Sherwin-Williams</SelectItem>
              <SelectItem value="HALEON">HALEON</SelectItem> 
              <SelectItem value="P&G">P&G</SelectItem> 
              <SelectItem value="SEMP TCL">SEMP TCL</SelectItem> 
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
              <TableHead>Cliente</TableHead>
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

                <TableCell>
                   <Badge variant="outline" className="font-medium text-slate-600 border-slate-200 bg-slate-50">
                     {report.client}
                   </Badge>
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
    </div>
  );
}