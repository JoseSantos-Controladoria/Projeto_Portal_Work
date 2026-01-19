import { useState } from "react";
import { 
  ScrollText, 
  Search, 
  Download, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  LogIn,
  FileText,
  Download as DownloadIcon,
  ShieldAlert,
  Calendar,
  User
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
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";

// Tipos de Logs
type LogType = 'login' | 'view_report' | 'export_data' | 'admin_action' | 'failed_login';

interface LogData {
  id: string;
  timestamp: string;
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  action: string;
  details: string;
  type: LogType;
  status: 'success' | 'failure' | 'warning';
  ip: string;
}

const MOCK_LOGS: LogData[] = [
  {
    id: 'log-001',
    timestamp: '16/01/2026 14:30:45',
    user: { name: 'Roberto Almeida', email: 'roberto@Sherwin-Williams.com', avatar: 'https://github.com/shadcn.png' },
    action: 'Visualizou Relatório',
    details: 'Comercial Sell-out (Sherwin-Williams)',
    type: 'view_report',
    status: 'success',
    ip: '192.168.1.45'
  },
  {
    id: 'log-002',
    timestamp: '16/01/2026 14:28:10',
    user: { name: 'Fernanda Costa', email: 'fernanda@pg.com', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
    action: 'Exportou Dados',
    details: 'Base_Vendas_Jan26.xlsx',
    type: 'export_data',
    status: 'success',
    ip: '200.145.89.12'
  },
  {
    id: 'log-003',
    timestamp: '16/01/2026 14:15:00',
    user: { name: 'Usuário Desconhecido', email: 'admin@workon.com', avatar: '' },
    action: 'Tentativa de Login',
    details: 'Senha incorreta (3x)',
    type: 'failed_login',
    status: 'failure',
    ip: '189.45.23.11'
  },
  {
    id: 'log-004',
    timestamp: '16/01/2026 13:50:22',
    user: { name: 'Amanda Souza', email: 'amanda@workon.com', avatar: '' },
    action: 'Criou Usuário',
    details: 'Novo usuário: Carlos Lima',
    type: 'admin_action',
    status: 'success',
    ip: '10.0.0.5'
  },
  {
    id: 'log-005',
    timestamp: '16/01/2026 10:00:01',
    user: { name: 'Roberto Almeida', email: 'roberto@Sherwin-Williams.com', avatar: 'https://github.com/shadcn.png' },
    action: 'Login no Sistema',
    details: 'Autenticação via Token',
    type: 'login',
    status: 'success',
    ip: '192.168.1.45'
  },
  {
    id: 'log-006',
    timestamp: '15/01/2026 18:45:12',
    user: { name: 'Juliana Silva', email: 'juliana@semptcl.com', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
    action: 'Visualizou Relatório',
    details: 'Vendas Varejo (SEMP TCL)',
    type: 'view_report',
    status: 'success',
    ip: '177.34.22.90'
  }
];

export function AccessLogsView() {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLogs = MOCK_LOGS.filter(log => {
    const matchesStatus = filterStatus === "all" || log.status === filterStatus;
    const matchesSearch = 
      log.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const getActionIcon = (type: LogType) => {
    switch (type) {
      case 'login': return <LogIn className="w-4 h-4 text-blue-500" />;
      case 'failed_login': return <ShieldAlert className="w-4 h-4 text-red-500" />;
      case 'view_report': return <FileText className="w-4 h-4 text-emerald-500" />;
      case 'export_data': return <DownloadIcon className="w-4 h-4 text-orange-500" />;
      case 'admin_action': return <User className="w-4 h-4 text-purple-500" />;
      default: return <AlertCircle className="w-4 h-4 text-slate-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1"><CheckCircle2 className="w-3 h-3" /> Sucesso</Badge>;
      case 'failure':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 gap-1"><XCircle className="w-3 h-3" /> Falha</Badge>;
      default:
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 gap-1"><AlertCircle className="w-3 h-3" /> Alerta</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-100 rounded-lg">
            <ScrollText className="w-6 h-6 text-slate-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Logs de Acesso e Auditoria</h1>
            <p className="text-slate-500 text-sm">Histórico completo de atividades e segurança do sistema.</p>
          </div>
        </div>
        
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Exportar CSV
        </Button>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        
        {/* Busca Textual */}
        <div className="md:col-span-5 space-y-2">
          <label className="text-sm font-medium text-slate-700">Buscar no Log</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Nome, email ou detalhe da ação..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Filtro de Status */}
        <div className="md:col-span-3 space-y-2">
          <label className="text-sm font-medium text-slate-700">Status da Ação</label>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="success">Sucesso</SelectItem>
              <SelectItem value="failure">Falhas / Erros</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filtro de Período (Mock Visual) */}
        <div className="md:col-span-3 space-y-2">
          <label className="text-sm font-medium text-slate-700">Período</label>
          <Select defaultValue="7d">
            <SelectTrigger>
              <SelectValue placeholder="Selecionar..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Últimas 24 horas</SelectItem>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Botão de Limpar */}
        <div className="md:col-span-1">
          <Button variant="ghost" size="icon" className="w-full text-slate-400 hover:text-red-500" onClick={() => {setFilterStatus("all"); setSearchTerm("");}}>
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tabela de Logs */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50">
              <TableHead className="w-[180px]">Data e Hora</TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead>Ação</TableHead>
              <TableHead>Detalhes / Recurso</TableHead>
              <TableHead className="w-[140px]">IP</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <TableRow key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="font-mono text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3 opacity-50" />
                      {log.timestamp}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 border border-slate-100">
                        <AvatarImage src={log.user.avatar} />
                        <AvatarFallback className="bg-slate-100 text-xs text-slate-600 font-bold">
                          {log.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-700">{log.user.name}</span>
                        <span className="text-[10px] text-slate-400">{log.user.email}</span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <div className="p-1.5 rounded-md bg-slate-50 border border-slate-100">
                        {getActionIcon(log.type)}
                      </div>
                      {log.action}
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="text-sm text-slate-600 truncate max-w-[200px] block" title={log.details}>
                      {log.details}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span className="font-mono text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                      {log.ip}
                    </span>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end">
                      {getStatusBadge(log.status)}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Search className="w-8 h-8 opacity-20" />
                    <p>Nenhum registro encontrado para estes filtros.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        {/* Footer da Tabela (Paginação Mockada) */}
        <div className="bg-slate-50 border-t border-slate-200 p-3 flex justify-between items-center text-xs text-slate-500">
          <span>Mostrando {filteredLogs.length} registros</span>
          <div className="flex gap-2">
             <Button variant="outline" size="sm" disabled className="h-7 text-xs">Anterior</Button>
             <Button variant="outline" size="sm" className="h-7 text-xs">Próximo</Button>
          </div>
        </div>
      </div>
    </div>
  );
}