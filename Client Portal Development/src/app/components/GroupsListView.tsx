import { useState } from "react";
import { 
  Search, 
  Plus, 
  Pencil, 
  Trash2, 
  Users, 
  ArrowLeft,
  Filter
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

// Import do Modal (Certifique-se que o arquivo existe na pasta components)
import { GroupRegistrationModal } from "./GroupRegistrationModal";

interface GroupsListViewProps {
  onBack: () => void;
}

// Dados Mockados (Sem o campo 'role')
const MOCK_GROUPS = [
  { 
    id: '1', 
    name: 'Comercial Sell-out', 
    client: 'Sherwin-Williams', 
    users: 12, 
    status: 'active' 
  },
  { 
    id: '2', 
    name: 'Trade Marketing', 
    client: 'Sherwin-Williams', 
    users: 8, 
    status: 'active' 
  },
  { 
    id: '3', 
    name: 'Gerência Regional', 
    client: 'HALEON', 
    users: 5, 
    status: 'active' 
  },
  { 
    id: '4', 
    name: 'Operacional Loja', 
    client: 'SEMP TCL', 
    users: 24, 
    status: 'inactive' 
  },
];

export function GroupsListView({ onBack }: GroupsListViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const filteredGroups = MOCK_GROUPS.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              Grupos de Acesso
            </h1>
            <p className="text-slate-500 text-sm">Gerencie times por cliente.</p>
          </div>
        </div>
        
        <Button 
          onClick={() => setIsRegisterModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Grupo
        </Button>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Buscar grupo ou cliente..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2 text-slate-600">
          <Filter className="w-4 h-4" />
          Filtros
        </Button>
      </div>

      {/* Tabela de Grupos */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50">
              <TableHead className="w-[300px]">Nome do Grupo</TableHead>
              <TableHead>Cliente Vinculado</TableHead>
              <TableHead>Usuários</TableHead>
              {/* REMOVIDO: Coluna Permissão */}
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGroups.length > 0 ? (
              filteredGroups.map((group) => (
                <TableRow key={group.id} className="hover:bg-slate-50/50 group">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                        <Users className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-slate-700">{group.name}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <span className="text-sm text-slate-600">{group.client}</span>
                  </TableCell>

                  <TableCell>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-normal">
                      {group.users} membros
                    </Badge>
                  </TableCell>

                  {/* REMOVIDO: Célula Permissão */}

                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      group.status === 'active' 
                        ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20' 
                        : 'bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-500/10'
                    }`}>
                      {group.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Editar Grupo"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Excluir Grupo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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

      <GroupRegistrationModal 
        isOpen={isRegisterModalOpen} 
        onClose={() => setIsRegisterModalOpen(false)} 
      />

    </div>
  );
}