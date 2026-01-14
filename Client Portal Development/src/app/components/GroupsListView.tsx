import { useState } from "react";
import { 
  Search, 
  Plus, 
  Pencil, 
  Trash2, 
  Download, 
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Badge } from "@/app/components/ui/badge";

// Interface local para tipagem dos grupos
interface GroupData {
  id: string;
  companyName: string;
  clientName: string;
  groupName: string;
  lastModified: string;
}

// Dados Mockados
const MOCK_GROUPS: GroupData[] = [
  { id: '1', companyName: 'WORK ON', clientName: 'HALEON', groupName: 'EQUIPE COMERCIAL', lastModified: '14/01/2026 10:30' },
  { id: '2', companyName: 'WORK ON', clientName: 'HALEON', groupName: 'CAMPO - SUPERVISORES', lastModified: '13/01/2026 15:45' },
  { id: '3', companyName: 'WORK ON', clientName: 'P&G', groupName: 'TRADE MARKETING', lastModified: '12/01/2026 09:20' },
  { id: '4', companyName: 'WORK ON', clientName: 'SEMP TCL', groupName: 'DIRETORIA', lastModified: '10/01/2026 14:10' },
  { id: '5', companyName: 'WORK ON', clientName: 'SEMP TCL', groupName: 'GERENTES REGIONAIS', lastModified: '10/01/2026 11:00' },
];

interface GroupsListViewProps {
  onBack: () => void;
}

export function GroupsListView({ onBack }: GroupsListViewProps) {
  // 1. Estados dos Campos (O que o usuário está digitando/selecionando)
  const [inputClient, setInputClient] = useState<string>("all");
  const [inputGroupText, setInputGroupText] = useState("");

  // 2. Estado dos Filtros Aplicados (O que realmente filtra a lista)
  const [appliedFilters, setAppliedFilters] = useState({
    client: "all",
    groupText: ""
  });

  // 3. Função de Busca (Disparada pelo Botão ou Enter)
  const handleSearch = () => {
    setAppliedFilters({
      client: inputClient,
      groupText: inputGroupText
    });
  };

  // 4. Função de Limpeza
  const handleClear = () => {
    setInputClient("all");
    setInputGroupText("");
    setAppliedFilters({ client: "all", groupText: "" });
  };

  // 5. Lógica de Filtragem (Baseada nos Filtros Aplicados)
  const filteredGroups = MOCK_GROUPS.filter(group => {
    const matchesClient = appliedFilters.client === "all" || group.clientName === appliedFilters.client;
    const matchesGroup = group.groupName.toLowerCase().includes(appliedFilters.groupText.toLowerCase());
    return matchesClient && matchesGroup;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Grupos de Acesso</h1>
            <p className="text-slate-500 text-sm">Gerencie permissões e distribuição de relatórios</p>
          </div>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 flex-1 md:flex-none">
            <Plus className="w-4 h-4 mr-2" />
            Novo Grupo
          </Button>
        </div>
      </div>

      {/* Área de Filtros Funcional */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        <div className="md:col-span-4 space-y-2">
          <label className="text-sm font-medium text-slate-700">Cliente</label>
          <Select value={inputClient} onValueChange={setInputClient}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um cliente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Clientes</SelectItem>
              <SelectItem value="HALEON">HALEON</SelectItem>
              <SelectItem value="UNILEVER">P&G</SelectItem>
              <SelectItem value="NESTLÉ">SEMP TCL</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-5 space-y-2">
          <label className="text-sm font-medium text-slate-700">Grupo</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Buscar por nome do grupo..." 
              className="pl-9"
              value={inputGroupText}
              onChange={(e) => setInputGroupText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
        </div>

        <div className="md:col-span-3 flex gap-2">
          <Button 
            className="flex-1 bg-slate-900 text-slate-50 hover:bg-slate-800"
            onClick={handleSearch}
          >
            <Filter className="w-4 h-4 mr-2" />
            Pesquisar
          </Button>
          
          {(inputClient !== 'all' || inputGroupText !== '') && (
             <Button 
               variant="ghost" 
               size="icon" 
               className="text-slate-500 hover:text-red-500"
               onClick={handleClear}
               title="Limpar filtros"
             >
               <XCircle className="w-5 h-5" />
             </Button>
          )}
        </div>
      </div>

      {/* Tabela de Listagem */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="w-[200px]">Empresa</TableHead>
              <TableHead className="w-[200px]">Cliente</TableHead>
              <TableHead>Grupo de Relatórios</TableHead>
              <TableHead className="w-[180px]">Última Alteração</TableHead>
              <TableHead className="w-[100px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGroups.length > 0 ? (
              filteredGroups.map((group) => (
                <TableRow key={group.id} className="hover:bg-slate-50/50">
                  <TableCell className="font-medium text-slate-600">
                    {group.companyName}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100">
                      {group.clientName}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-slate-800">
                    {group.groupName}
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm">
                    {group.lastModified}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-500">
                    <Search className="w-8 h-8 mb-2 opacity-20" />
                    <p>Nenhum grupo encontrado.</p>
                    <p className="text-xs opacity-70 mt-1">Tente ajustar os filtros de pesquisa.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Paginação (Visual) */}
        <div className="flex items-center justify-between px-4 py-4 border-t border-slate-200 bg-slate-50/30">
          <div className="text-sm text-slate-500">
            Mostrando <strong>{filteredGroups.length}</strong> resultados
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8" disabled>
              <ChevronsLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" disabled>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-1 px-2">
              <span className="text-sm font-medium bg-blue-600 text-white px-2 py-0.5 rounded">1</span>
              <span className="text-sm text-slate-500 px-2">de 1</span>
            </div>
            <Button variant="outline" size="icon" className="h-8 w-8" disabled>
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" disabled>
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}