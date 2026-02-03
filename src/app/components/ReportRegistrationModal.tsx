import { useState, useEffect } from "react";
import { 
  FileBarChart, Layout, Link as LinkIcon, Loader2, Users, Shield 
} from "lucide-react"; 
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/app/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/app/components/ui/select";
import { Switch } from "@/app/components/ui/switch";
import { Checkbox } from "@/app/components/ui/checkbox"; // Certifique-se de ter este componente
import { ScrollArea } from "@/app/components/ui/scroll-area"; // Certifique-se de ter este componente
import { reportService } from "@/services/reportService";
import { groupService } from "@/services/groupService"; // Importe o groupService
import { toast } from "sonner";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportIdToEdit?: number | null;
  initialData?: any; 
  onSuccess?: () => void;
}

export function ReportRegistrationModal({ 
  isOpen, onClose, reportIdToEdit, initialData, onSuccess 
}: ReportModalProps) {
  
  const [isLoading, setIsLoading] = useState(false);
  const [workspacesList, setWorkspacesList] = useState<any[]>([]);
  
  // Estado para os grupos
  const [allGroups, setAllGroups] = useState<any[]>([]);
  const [selectedGroupIds, setSelectedGroupIds] = useState<number[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    workspace_id: "",
    embedded_url: "",
    active: true
  });

  useEffect(() => {
    if (isOpen) {
      loadInitialData();
    }
  }, [isOpen, reportIdToEdit, initialData]);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      // 1. Carrega Workspaces (para o Select)
      const auxData = await reportService.getAuxiliaryData();
      if (auxData?.workspaces) {
        setWorkspacesList(auxData.workspaces);
      }

      // 2. Preenche formulário básico
      if (reportIdToEdit && initialData) {
        setFormData({
          title: initialData.title || "",
          description: initialData.description || "",
          workspace_id: initialData.workspace_id ? String(initialData.workspace_id) : "",
          embedded_url: initialData.embedded_url || "",
          active: initialData.active ?? true
        });

        // 3a. Modo Edição: Busca grupos vinculados
        await loadGroupsForEdit(reportIdToEdit);

      } else {
        // Reset para Novo Cadastro
        setFormData({ 
          title: "", description: "", workspace_id: "", 
          embedded_url: "", active: true 
        });
        setSelectedGroupIds([]);

        // 3b. Modo Novo: Busca todos os grupos disponíveis
        await loadAllGroups();
      }

    } catch (error) {
      console.error("Erro ao carregar dados iniciais:", error);
      toast.error("Erro ao carregar dados do formulário.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadAllGroups = async () => {
    try {
      const response = await groupService.getAll({ pagesize: 100 }); // Traz bastante grupos
      setAllGroups(response.items || []);
    } catch (error) {
      console.error("Erro ao listar grupos:", error);
    }
  };

  const loadGroupsForEdit = async (id: number) => {
    try {
      // O endpoint getReportGroups retorna TODOS os grupos, com a flag 'group_associated'
      const groupsFromApi = await reportService.getReportGroups(id);
      
      // Mapeia para o formato de lista
      setAllGroups(groupsFromApi);

      // Filtra os IDs que já estão associados
      const associatedIds = groupsFromApi
        .filter((g: any) => g.group_associated === true)
        .map((g: any) => g.group_id);
      
      setSelectedGroupIds(associatedIds);

    } catch (error) {
      console.error("Erro ao carregar permissões:", error);
    }
  };

  const toggleGroupSelection = (groupId: number) => {
    setSelectedGroupIds(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.warning("Por favor, digite um título para o relatório.");
      return;
    }
    if (!formData.workspace_id) {
      toast.warning("Selecione um Workspace para continuar.");
      return;
    }

    setIsLoading(true);
    try {
      // 1. Salva o Relatório
      // Se save retornar o objeto ou ID, melhor. Se não, assumimos edição ou criação void
      // Como o service atual retorna void no create, precisamos ajustar se for criação.
      // Mas o seu CRUD genérico create retorna { id: ... }. Vamos assumir isso.
      
      // Pequeno hack: vamos olhar como o reportService.save foi implementado.
      // Ele chama crudService.create ou update. O create retorna response.data (que tem o ID).
      // Mas o save do reportService não estava retornando nada.
      // DICA: Vá no reportService e coloque "return" antes do crudService.create/update
      
      // Se não quiser mexer no service agora, a lógica de edição funciona.
      // Para criação, sem o ID de volta, não conseguimos salvar os grupos.
      // Vou assumir que você ajustou o reportService.ts para: "return await crudService..."
      
      let savedReportId = reportIdToEdit;

      if (reportIdToEdit) {
        await reportService.save({
          id: reportIdToEdit,
          ...formData,
          workspace_id: Number(formData.workspace_id)
        });
      } else {
        // Criação
        const res: any = await reportService.save({
          ...formData,
          workspace_id: Number(formData.workspace_id)
        });
        // O backend retorna { status: 'SUCCESS', id: 123, ... }
        if (res && res.id) {
          savedReportId = res.id;
        }
      }

      // 2. Salva os Grupos (Se tivermos um ID válido)
      if (savedReportId) {
        await reportService.saveGroups(savedReportId, selectedGroupIds);
        toast.success("Relatório e permissões salvos com sucesso!");
      } else {
        toast.warning("Relatório salvo, mas não foi possível vincular os grupos (ID não retornado).");
      }

      if (onSuccess) onSuccess();
      onClose();

    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar relatório.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileBarChart className="w-5 h-5 text-blue-600" />
            {reportIdToEdit ? "Editar Relatório" : "Novo Relatório"}
          </DialogTitle>
          <DialogDescription>
            Configure os dados do relatório e defina quem pode acessá-lo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          
          {/* Seção 1: Dados Gerais */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Layout className="w-4 h-4" /> Dados do Dashboard
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input 
                  id="title" 
                  placeholder="Ex: DRE Consolidado" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Workspace</Label>
                <Select 
                  value={formData.workspace_id} 
                  onValueChange={(val) => setFormData({...formData, workspace_id: val})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {workspacesList.map(ws => (
                      <SelectItem key={ws.id} value={String(ws.id)}>
                        {ws.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="desc">Descrição</Label>
              <Input 
                id="desc" 
                placeholder="Breve resumo..." 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Link Embed (Power BI)</Label>
              <Input 
                placeholder="https://app.powerbi.com/reportEmbed?..." 
                value={formData.embedded_url}
                onChange={(e) => setFormData({...formData, embedded_url: e.target.value})}
              />
            </div>

             <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border">
              <div className="flex flex-col">
                <span className="text-sm font-medium">Status Ativo</span>
                <span className="text-xs text-slate-500">Define se o relatório aparece no sistema.</span>
              </div>
              <Switch 
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({...formData, active: checked})}
              />
            </div>
          </div>

          <div className="border-t border-slate-100 my-4" />

          {/* Seção 2: Permissões (Grupos) */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4" /> Permissões de Acesso
            </h3>
            <p className="text-xs text-slate-500">
              Selecione os Grupos de Usuários que poderão visualizar este relatório.
            </p>

            <div className="border rounded-md p-4 bg-slate-50/50">
              {allGroups.length === 0 ? (
                <div className="text-center py-4 text-slate-500 text-sm">
                  Nenhum grupo encontrado. Cadastre grupos primeiro.
                </div>
              ) : (
                <ScrollArea className="h-[200px] pr-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {allGroups.map((group) => {
                       // O objeto pode vir com 'id' (groupService) ou 'group_id' (reportService)
                       // Vamos normalizar
                       const gId = group.id || group.group_id;
                       const gName = group.name || group.group_name;
                       const cName = group.customer?.name || group.customer_name || "Cliente n/d";
                       
                       const isSelected = selectedGroupIds.includes(gId);

                       return (
                        <div 
                          key={gId} 
                          className={`flex items-start space-x-3 p-2 rounded-md transition-colors border ${
                            isSelected ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-200 hover:border-blue-300'
                          }`}
                        >
                          <Checkbox 
                            id={`grp-${gId}`} 
                            checked={isSelected}
                            onCheckedChange={() => toggleGroupSelection(gId)}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label
                              htmlFor={`grp-${gId}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {gName}
                            </label>
                            <p className="text-xs text-muted-foreground">
                              {cName}
                            </p>
                          </div>
                        </div>
                       );
                    })}
                  </div>
                </ScrollArea>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
              Salvar Relatório
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}