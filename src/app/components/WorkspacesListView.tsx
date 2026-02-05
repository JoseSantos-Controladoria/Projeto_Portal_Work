import { useState, useEffect } from "react";
import { 
  Search, Plus, Pencil, Trash2,
  Layout, Loader2, ExternalLink
} from "lucide-react"; 
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/app/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/app/components/ui/pagination";
import { toast } from "sonner"; 

import { WorkspaceRegistrationModal } from "./WorkspaceRegistrationModal";
import { workspaceService, Workspace } from "@/services/workspaceService";

export function WorkspacesListView() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [filterSearch, setFilterSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Workspace | null>(null);

  // Estados para Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const fetchData = async () => {
    setLoading(true);
    try {
      // Busca todos os Workspaces (limite alto) para paginar no Frontend
      const wsData = await workspaceService.getAll({ page: 1, pagesize: 1000, orderby: 'name' });
      setWorkspaces(wsData.items || []);
    } catch (error) {
      toast.error("Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Reseta para página 1 ao filtrar
  useEffect(() => {
    setCurrentPage(1);
  }, [filterSearch]);

  const handleEdit = (item: Workspace) => {
    setEditingItem(item); 
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Excluir este workspace?")) return;
    try {
      await workspaceService.delete(id);
      toast.success("Workspace removido.");
      fetchData();
    } catch (error) {
      toast.error("Erro ao excluir.");
    }
  };

  // Lógica de Filtro
  const filteredItems = workspaces.filter(ws => {
    return (ws.name?.toLowerCase() || '').includes(filterSearch.toLowerCase());
  });

  // Lógica de Paginação
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            Workspaces
          </h1>
          <p className="text-slate-500 text-sm">Gerencie as áreas de trabalho dos relatórios.</p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleNew}>
            <Plus className="w-4 h-4 mr-2" /> Novo Workspace
          </Button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Buscar workspace por nome..." 
            className="pl-9"
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="w-[50%]">Nome do Workspace</TableHead>
              <TableHead className="w-[40%]">Link</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="h-32 text-center">
                  <div className="flex justify-center gap-2"><Loader2 className="animate-spin" /> Carregando...</div>
                </TableCell>
              </TableRow>
            ) : currentItems.length > 0 ? (
              currentItems.map((item) => (
                <TableRow key={item.id} className="hover:bg-slate-50/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <Layout className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-slate-900">{item.name}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    {item.url ? (
                        <a href={item.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm text-blue-600 hover:underline truncate max-w-[300px]">
                            <ExternalLink className="w-3 h-3" /> {item.url}
                        </a>
                    ) : (
                        <span className="text-slate-400 text-sm">-</span>
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => handleEdit(item)}
                            title="Editar"
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                        
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(item.id)}
                            title="Excluir"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                  </TableCell> 
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-32 text-center text-slate-500">
                  Nenhum workspace encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* --- PAGINAÇÃO (Visível se houver dados) --- */}
        {!loading && filteredItems.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-center">
            <Pagination>
              <PaginationContent>
                
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => { 
                      e.preventDefault(); 
                      if (currentPage > 1) setCurrentPage(currentPage - 1); 
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === pageNum}
                      onClick={(e) => { 
                        e.preventDefault(); 
                        setCurrentPage(pageNum); 
                      }}
                      className="cursor-pointer"
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => { 
                      e.preventDefault(); 
                      if (currentPage < totalPages) setCurrentPage(currentPage + 1); 
                    }}
                    className={currentPage === totalPages || totalPages === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>

              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      <WorkspaceRegistrationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        workspaceIdToEdit={editingItem?.id}
        initialData={editingItem}
        onSuccess={fetchData}
      />
    </div>
  );
}