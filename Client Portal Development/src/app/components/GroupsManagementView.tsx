import { useState, useEffect } from "react";
import { 
  Search, 
  Plus, 
  Pencil, 
  Trash2, 
  MoreHorizontal,
  Users, 
  Building2, 
  Loader2,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/app/components/ui/table";
import { Badge } from "@/app/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, 
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { toast } from "sonner"; 

import { GroupRegistrationModal } from "./GroupRegistrationModal";
import { groupService, Group } from "@/services/groupService";

export function GroupsManagementView() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [filterSearch, setFilterSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      // O endpoint getAll já traz o nome do cliente e a contagem de usuários
      const data = await groupService.getAll({ page: 1, pagesize: 50, orderby: 'name' });
      setGroups(data.items || []);
    } catch (error) {
      console.error("Erro ao carregar grupos:", error);
      toast.error("Erro ao carregar grupos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (id: number) => {
    setSelectedGroupId(id);
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setSelectedGroupId(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem a certeza que deseja excluir este grupo?")) return;
    try {
      await groupService.delete(id);
      toast.success("Grupo removido.");
      fetchData();
    } catch (error) {
      toast.error("Erro ao excluir. Verifique se existem vínculos.");
    }
  };

  // Filtro local (Nome do Grupo ou Nome do Cliente)
  const filteredGroups = groups.filter(group => 
    (group.name?.toLowerCase() || '').includes(filterSearch.toLowerCase()) ||
    (group.customer?.toLowerCase() || '').includes(filterSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header e Ações */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            Gerir Grupos de Acesso
          </h1>
          <p className="text-slate-500 text-sm">Organize os utilizadores por cliente ou departamento.</p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <Button 
            className="bg-blue-600 hover:bg-blue-700 flex-1 md:flex-none"
            onClick={handleNew}
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Grupo
          </Button>
        </div>
      </div>

      {/* Busca Simples */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Pesquisar por nome do grupo ou cliente..." 
            className="pl-9"
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="w-[30%]">Nome do Grupo</TableHead>
              <TableHead className="w-[30%]">Cliente Vinculado</TableHead>
              <TableHead className="w-[15%] text-center">Utilizadores</TableHead>
              <TableHead className="w-[15%] text-center">Estado</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <div className="flex justify-center items-center gap-2">
                    <Loader2 className="animate-spin text-blue-600" /> Carregando...
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredGroups.length > 0 ? (
              filteredGroups.map((group) => (
                <TableRow key={group.id} className="hover:bg-slate-50/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                        <Users className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-slate-900">
                        {group.name}
                      </span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      {group.customer || <span className="text-slate-400 italic">Não vinculado</span>}
                    </div>
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                      {group.qty_users || 0} membro(s)
                    </Badge>
                  </TableCell>

                  <TableCell className="text-center">
                    {group.active ? (
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleEdit(group.id)}>
                            <Pencil className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(group.id)}>
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

      <GroupRegistrationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        groupIdToEdit={selectedGroupId}
        onSuccess={fetchData}
      />
    </div>
  );
}