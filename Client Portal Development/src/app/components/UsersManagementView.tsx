import { useState } from "react";
import { 
  Search, 
  Plus, 
  Pencil, 
  Trash2, 
  Download, 
  Filter,
  XCircle,
  MoreHorizontal,
  ShieldAlert,
  ShieldCheck,
  User,
  Building,
  Briefcase
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";

import { UserRegistrationModal } from "./UserRegistrationModal";

interface UserData {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  internalCompany: 'Work On' | 'InStore';
  clientPortfolio: string[];
  role: 'Admin' | 'Analista' | 'Cliente';
  status: 'active' | 'inactive';
  lastLogin: string;
}

const MOCK_USERS: UserData[] = [
  { 
    id: '1', 
    name: 'Roberto Almeida', 
    email: 'roberto.almeida@workon.com', 
    avatarUrl: 'https://github.com/shadcn.png',
    internalCompany: 'Work On', 
    clientPortfolio: ['HALEON', 'P&G'],
    role: 'Analista',
    status: 'active',
    lastLogin: 'Hoje, 09:30'
  },
  { 
    id: '2', 
    name: 'Fernanda Costa', 
    email: 'fernanda.costa@instore.com', 
    internalCompany: 'InStore', 
    clientPortfolio: ['SEMP TCL'],
    role: 'Admin',
    status: 'active',
    lastLogin: 'Ontem, 14:20'
  },
  { 
    id: '3', 
    name: 'Carlos System', 
    email: 'admin@portalwork.com', 
    internalCompany: 'Work On', 
    clientPortfolio: ['Todos'],
    role: 'Admin',
    status: 'active',
    lastLogin: 'Agora'
  },
  { 
    id: '4', 
    name: 'Juliana Silva', 
    email: 'juliana.silva@haleon.com', 
    internalCompany: 'Work On',
    clientPortfolio: ['HALEON'],
    role: 'Cliente',
    status: 'inactive',
    lastLogin: '20/12/2025'
  },
  { 
    id: '5', 
    name: 'Ricardo Oliveira', 
    email: 'ricardo@pg.com', 
    internalCompany: 'InStore', 
    clientPortfolio: ['P&G'],
    role: 'Cliente',
    status: 'active',
    lastLogin: 'Hoje, 11:00'
  },
];

export function UsersManagementView() {
  const [filterCompany, setFilterCompany] = useState<string>("all");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterSearch, setFilterSearch] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClear = () => {
    setFilterCompany("all");
    setFilterRole("all");
    setFilterSearch("");
  };

  const filteredUsers = MOCK_USERS.filter(user => {
    const matchesCompany = filterCompany === "all" || user.internalCompany === filterCompany;
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesSearch = user.name.toLowerCase().includes(filterSearch.toLowerCase()) ||
                          user.email.toLowerCase().includes(filterSearch.toLowerCase());
    return matchesCompany && matchesRole && matchesSearch;
  });

  const renderRoleBadge = (role: string) => {
    switch (role) {
      case 'Admin':
        return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200 gap-1"><ShieldAlert className="w-3 h-3" /> Admin</Badge>;
      case 'Analista':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200 gap-1"><ShieldCheck className="w-3 h-3" /> Analista</Badge>;
      default:
        return <Badge variant="outline" className="text-slate-600 gap-1 bg-slate-50"><User className="w-3 h-3" /> Cliente</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            Gerenciamento de Usuários
          </h1>
          <p className="text-slate-500 text-sm">Controle de acesso, carteiras e permissões.</p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 flex-1 md:flex-none"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Usuário
          </Button>
        </div>
      </div>

      {/* Filtros Funcionais e Reativos */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        
        <div className="md:col-span-3 space-y-2">
          <label className="text-sm font-medium text-slate-700">Empresa (Org)</label>
          <Select value={filterCompany} onValueChange={setFilterCompany}>
            <SelectTrigger>
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="Work On">Work On</SelectItem>
              <SelectItem value="InStore">InStore</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-3 space-y-2">
          <label className="text-sm font-medium text-slate-700">Permissão</label>
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger>
              <SelectValue placeholder="Todos os níveis" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Analista">Analista</SelectItem>
              <SelectItem value="Cliente">Cliente</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-4 space-y-2">
          <label className="text-sm font-medium text-slate-700">Buscar Usuário</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Nome ou e-mail..." 
              className="pl-9"
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="md:col-span-2">
          {(filterCompany !== 'all' || filterRole !== 'all' || filterSearch !== '') ? (
             <Button 
               variant="outline" 
               className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
               onClick={handleClear}
             >
               <XCircle className="w-4 h-4 mr-2" />
               Limpar
             </Button>
          ) : (
            <Button variant="ghost" className="w-full text-slate-400 cursor-default hover:bg-transparent">
              Filtros ativos
            </Button>
          )}
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="w-[300px]">Identificação</TableHead>
              <TableHead>Organização</TableHead>
              <TableHead>Carteira (Clientes)</TableHead>
              <TableHead>Permissão</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-slate-50/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-slate-200">
                        <AvatarImage src={user.avatarUrl} />
                        <AvatarFallback className="bg-blue-100 text-blue-700 font-bold">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-900">{user.name}</span>
                        <span className="text-xs text-slate-500">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <Building className="w-4 h-4 text-slate-400" />
                      {user.internalCompany}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.clientPortfolio.includes('Todos') ? (
                         <Badge variant="secondary" className="bg-slate-800 text-white hover:bg-slate-700">Global</Badge>
                      ) : (
                        user.clientPortfolio.map(client => (
                          <Badge key={client} variant="outline" className="bg-slate-50 text-slate-600 border-slate-300">
                            {client}
                          </Badge>
                        ))
                      )}
                    </div>
                  </TableCell>

                  <TableCell>{renderRoleBadge(user.role)}</TableCell>

                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {user.status === 'active' ? (
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-sm text-slate-600">Ativo</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-slate-300" />
                          <span className="text-sm text-slate-400">Inativo</span>
                        </div>
                      )}
                      <span className="text-[10px] text-slate-400 pl-3.5">Acesso: {user.lastLogin}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem><Pencil className="mr-2 h-4 w-4" /> Editar</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600"><Trash2 className="mr-2 h-4 w-4" /> Excluir</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <UserRegistrationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}