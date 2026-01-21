import { useState } from "react";
import { 
  Search, 
  Filter, 
  Download, 
  FileText, 
  User, 
  Users, 
  Clock,
  ArrowUpRight,
  XCircle
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
import { Badge } from "@/app/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";

// Interface atualizada conforme a regra de negócio
interface AccessLog {
  id: string;
  timestamp: string;      // Data/Hora
  userName: string;       // Usuário
  userEmail: string;
  userAvatar?: string;
  group: string;          // Grupo
  reportName: string;     // Relatório
  action: 'OPEN REPORT' | 'CLOSE REPORT'; // Ação Específica
}

// DADOS MOCKADOS (Simulando o histórico real)
const MOCK_LOGS: AccessLog[] = [
  { 
    id: '1', 
    timestamp: '21/01/2026 14:45:12', 
    userName: 'Roberto Almeida', 
    userEmail: 'roberto@workon.com', 
    group: 'Diretoria Executiva',
    reportName: 'Performance de Vendas - Janeiro', 
    action: 'OPEN REPORT' 
  },
  { 
    id: '2', 
    timestamp: '21/01/2026 14:30:00', 
    userName: 'Fernanda Costa', 
    userEmail: 'fernanda@pg.com', 
    group: 'Gerentes Regionais',
    reportName: 'Execução no PDV', 
    action: 'OPEN REPORT' 
  },
  { 
    id: '3', 
    timestamp: '21/01/2026 14:15:22', 
    userName: 'Roberto Almeida', 
    userEmail: 'roberto@workon.com', 
    group: 'Diretoria Executiva',
    reportName: 'Ruptura de Estoque', 
    action: 'CLOSE REPORT' 
  },
  { 
    id: '4', 
    timestamp: '21/01/2026 13:50:05', 
    userName: 'Juliana Silva', 
    userEmail: 'juliana@semptcl.com', 
    group: 'Marketing Digital',
    reportName: 'ROI de Campanhas', 
    action: 'OPEN REPORT' 
  },
  { 
    id: '5', 
    timestamp: '21/01/2026 11:20:18', 
    userName: 'Ricardo Oliveira', 
    userEmail: 'ricardo@Sherwin-Williams.com', 
    group: 'Time de Trade',
    reportName: 'Status Day (Produtividade)', 
    action: 'OPEN REPORT' 
  },
  { 
    id: '6', 
    timestamp: '21/01/2026 11:15:00', 
    userName: 'Ricardo Oliveira', 
    userEmail: 'ricardo@Sherwin-Williams.com', 
    group: 'Time de Trade',
    reportName: 'Status Day (Produtividade)', 
    action: 'CLOSE REPORT' 
  },
];

export function AccessLogsView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState("all");

  const filteredLogs = MOCK_LOGS.filter(log => {
    const matchesSearch = 
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.reportName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.group.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesAction = filterAction === "all" || log.action === filterAction;

    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            Logs de Acesso
          </h1>
          <p className="text-slate-500 text-sm">Histórico de visualização de relatórios pelos usuários.</p>
        </div>
        
        <Button variant="outline" className="text-slate-600 gap-2">
          <Download className="w-4 h-4" />
          Exportar CSV
        </Button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Buscar por usuário, grupo ou relatório..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="w-full md:w-56">
          <Select value={filterAction} onValueChange={setFilterAction}>
            <SelectTrigger>
              <div className="flex items-center gap-2 text-slate-600">
                <Filter className="w-4 h-4 text-slate-400" />
                <SelectValue placeholder="Filtrar Ação" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Ações</SelectItem>
              <SelectItem value="OPEN REPORT">OPEN REPORT</SelectItem>
              <SelectItem value="CLOSE REPORT">CLOSE REPORT</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabela de Logs */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50">
              <TableHead className="w-[180px]">Data/Hora</TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead>Grupo</TableHead>
              <TableHead>Relatório Acessado</TableHead>
              <TableHead className="text-right">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <TableRow key={log.id} className="hover:bg-slate-50/50">
                  
                  {/* Data/Hora */}
                  <TableCell>
                    <div className="flex items-center gap-2 text-slate-600 font-mono text-xs">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {log.timestamp}
                    </div>
                  </TableCell>

                  {/* Usuário */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 border border-slate-100">
                        <AvatarImage src={log.userAvatar} />
                        <AvatarFallback className="bg-slate-100 text-slate-600 text-xs font-bold">
                          {log.userName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-700">{log.userName}</span>
                        <span className="text-xs text-slate-500">{log.userEmail}</span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Grupo */}
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Users className="w-4 h-4 text-slate-400" />
                      {log.group}
                    </div>
                  </TableCell>

                  {/* Relatório */}
                  <TableCell>
                    <div className="flex items-center gap-2 font-medium text-slate-700">
                      <FileText className="w-4 h-4 text-blue-500" />
                      {log.reportName}
                    </div>
                  </TableCell>

                  {/* Ação (OPEN/CLOSE) */}
                  <TableCell className="text-right">
                    {log.action === 'OPEN REPORT' ? (
                      <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-100 gap-1.5 pr-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        OPEN REPORT
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-slate-500 border-slate-200 gap-1.5 bg-slate-50 pr-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        CLOSE REPORT
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Search className="w-8 h-8 opacity-20" />
                    <p>Nenhum log encontrado para os filtros atuais.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}