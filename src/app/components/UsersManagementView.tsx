import { useState, useEffect } from "react";
import { 
  Search, Plus, Pencil, Trash2, MoreHorizontal,
  ShieldAlert, ShieldCheck, User as UserIcon, Building, Loader2 
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/app/components/ui/table";
import { Badge } from "@/app/components/ui/badge";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, 
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { toast } from "sonner"; 

import { UserRegistrationModal } from "./UserRegistrationModal";
import { userService, User } from "@/services/userService";
import { crudService } from "@/services/crudService";

export function UsersManagementView() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Mapa para traduzir company_id em Nome da Empresa
  const [companiesMap, setCompaniesMap] = useState<Record<number, string>>({});

  const [filterSearch, setFilterSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Busca Usuários
      const userData = await userService.getAll({ page: 1, pagesize: 50, orderby: 'name' });
      // Segurança: garante que items é um array, mesmo que venha undefined
      setUsers(userData.items || []);

      // 2. Busca Empresas (apenas para montar o mapa de nomes)
      const companiesData = await crudService.getAll('company');
      const compMap: Record<number, string> = {};
      
      // Segurança: garante que items existe
      if (companiesData && companiesData.items) {
          companiesData.items.forEach((c: any) => { compMap[c.id] = c.name; });
      }
      setCompaniesMap(compMap);

    } catch (error) {
      console.error("Erro ao carregar tabela:", error);
      toast.error("Erro ao carregar usuários.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (id: string) => {
    setSelectedUserId(id);
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setSelectedUserId(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return;
    try {
      await userService.delete(id);
      toast.success("Usuário removido.");
      fetchData();
    } catch (error) {
      toast.error("Erro ao excluir.");
    }
  };

  // Filtro Front-end Seguro
  const filteredUsers = users.filter(user => 
    (user.name?.toLowerCase() || '').includes(filterSearch.toLowerCase()) ||
    (user.email?.toLowerCase() || '').includes(filterSearch.toLowerCase())
  );

  const renderRoleBadge = (roleName?: string) => {
    const role = roleName?.toLowerCase() || 'cliente';
    if (role.includes('admin')) {
        return <Badge className="bg-purple-100 text-purple-700 border-purple-200 gap-1"><ShieldAlert className="w-3 h-3" /> Admin</Badge>;
    }
    if (role.includes('analista')) {
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200 gap-1"><ShieldCheck className="w-3 h-3" /> Analista</Badge>;
    }
    return <Badge variant="outline" className="text-slate-600 gap-1 bg-slate-50"><UserIcon className="w-3 h-3" /> Cliente</Badge>;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header e Ações */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            Gerenciamento de Usuários
          </h1>
          <p className="text-slate-500 text-sm">Controle de acesso, grupos e permissões.</p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <Button 
            className="bg-blue-600 hover:bg-blue-700 flex-1 md:flex-none"
            onClick={handleNew}
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Usuário
          </Button>
        </div>
      </div>

      {/* Busca Simples */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Buscar por nome ou e-mail..." 
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
              <TableHead className="w-[300px]">Usuário</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <div className="flex justify-center items-center gap-2"><Loader2 className="animate-spin" /> Carregando...</div>
                </TableCell>
              </TableRow>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-slate-50/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-slate-200">
                        <AvatarFallback className="bg-blue-100 text-blue-700 font-bold">
                          {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-900">{user.name || 'Sem nome'}</span>
                        <span className="text-xs text-slate-500">{user.email || '-'}</span>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <Building className="w-4 h-4 text-slate-400" />
                      {companiesMap[user.company_id] || `ID: ${user.company_id}` || 'N/A'}
                    </div>
                  </TableCell>

                  <TableCell>{renderRoleBadge(user.perfil)}</TableCell>

                  <TableCell>
                    {user.active ? (
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Ativo</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-slate-100 text-slate-500 border-slate-200">Inativo</Badge>
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
                        <DropdownMenuItem onClick={() => handleEdit(user.id)}>
                            <Pencil className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(user.id)}>
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
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <UserRegistrationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        userIdToEdit={selectedUserId}
        onSuccess={fetchData}
      />
    </div>
  );
}