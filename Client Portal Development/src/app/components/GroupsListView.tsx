import { useState } from "react";
import { 
  Search, 
  Plus, 
  Pencil, 
  Trash2, 
  Filter,
  XCircle,
  Users,
  ArrowLeft,
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
import { GroupRegistrationModal } from "./GroupRegistrationModal";

interface GroupsListViewProps {
  onBack: () => void;
}

// Dados Mockados
const MOCK_GROUPS = [
  { id: '1', name: 'Diretoria Executiva', client: 'HALEON', usersCount: 5, type: 'Estratégico' },
  { id: '2', name: 'Gerentes Regionais', client: 'HALEON', usersCount: 12, type: 'Tático' },
  { id: '3', name: 'Time de Trade', client: 'P&G', usersCount: 28, type: 'Operacional' },
  { id: '4', name: 'Marketing Digital', client: 'SEMP TCL', usersCount: 8, type: 'Estratégico' },
];

export function GroupsListView({ onBack }: GroupsListViewProps) {
  const [inputClient, setInputClient] = useState<string>("all");
  const [inputName, setInputName] = useState("");
  
  // Estado do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredGroups = MOCK_GROUPS.filter(g => {
    const matchesClient = inputClient === "all" || g.client === inputClient;
    const matchesName = g.name.toLowerCase().includes(inputName.toLowerCase());
    return matchesClient && matchesName;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
      {/* Header com Botão Voltar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-emerald-600" />
              Grupos de Acesso
            </h1>
            <p className="text-slate-500 text-sm">Organize os usuários em times para facilitar a distribuição de relatórios.</p>
          </div>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <Button 
            className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1 md:flex-none"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Grupo
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

        <div className="md:col-span-8 space-y-2">
          <label className="text-sm font-medium text-slate-700">Buscar Grupo</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Nome do grupo..." 
              className="pl-9"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Nome do Grupo</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-center">Usuários</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGroups.length > 0 ? (
              filteredGroups.map((group) => (
                <TableRow key={group.id} className="hover:bg-slate-50/50">
                  <TableCell className="font-medium text-slate-700">
                    {group.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal text-slate-600 bg-slate-50">
                      {group.client}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {group.type}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
                      {group.usersCount} membros
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Pencil className="mr-2 h-4 w-4" /> Editar Grupo
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" /> Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                  Nenhum grupo encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal de Cadastro */}
      <GroupRegistrationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}