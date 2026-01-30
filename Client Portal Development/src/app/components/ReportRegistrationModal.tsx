import { useState, useEffect } from "react";
import { 
  FileBarChart, Layout, Link as LinkIcon, Loader2 
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
import { reportService } from "@/services/reportService";
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

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    workspace_id: "",
    embedded_url: "",
    active: true
  });

  useEffect(() => {
    if (isOpen) {
      loadWorkspaces();
      if (reportIdToEdit && initialData) {
        setFormData({
          title: initialData.title || "",
          description: initialData.description || "",
          workspace_id: initialData.workspace_id ? String(initialData.workspace_id) : "",
          embedded_url: initialData.embedded_url || "",
          active: initialData.active ?? true
        });
      } else {
        setFormData({ 
          title: "", description: "", workspace_id: "", 
          embedded_url: "", active: true 
        });
      }
    }
  }, [isOpen, reportIdToEdit, initialData]);

  const loadWorkspaces = async () => {
    try {
      console.log("🔄 Iniciando busca de Workspaces..."); // LOG 1
      const data = await reportService.getAuxiliaryData();
      console.log("📦 Dados recebidos do Serviço:", data); // LOG 2
      
      if (data && data.workspaces) {
          console.log("✅ Workspaces encontrados:", data.workspaces.length); // LOG 3
          setWorkspacesList(data.workspaces);
      } else {
          console.warn("⚠️ Array de workspaces veio vazio ou inválido.");
      }
    } catch (error) {
      console.error("❌ Erro fatal ao buscar workspaces:", error);
      toast.error("Não foi possível carregar a lista de Workspaces.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // CORREÇÃO: Validação separada para facilitar o entendimento
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
      await reportService.save({
        id: reportIdToEdit || undefined,
        title: formData.title,
        description: formData.description,
        workspace_id: Number(formData.workspace_id),
        embedded_url: formData.embedded_url,
        active: formData.active
      });

      toast.success(reportIdToEdit ? "Relatório atualizado!" : "Relatório criado!");
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileBarChart className="w-5 h-5 text-blue-600" />
            {reportIdToEdit ? "Editar Relatório" : "Novo Relatório"}
          </DialogTitle>
          <DialogDescription>
            Cadastre os detalhes do dashboard PowerBI ou link externo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título do Relatório</Label>
              <Input 
                id="title" 
                placeholder="Ex: DRE Consolidado" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Workspace (Área)</Label>
              <Select 
                value={formData.workspace_id} 
                onValueChange={(val) => setFormData({...formData, workspace_id: val})}
              >
                <SelectTrigger>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Layout className="w-4 h-4 text-slate-400" />
                    <SelectValue placeholder="Selecione..." />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {workspacesList.length === 0 ? (
                    <SelectItem value="disabled" disabled>Nenhum workspace encontrado</SelectItem>
                  ) : (
                    workspacesList.map(ws => (
                      <SelectItem key={ws.id} value={String(ws.id)}>
                        {ws.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="desc">Descrição (Opcional)</Label>
            <Input 
              id="desc" 
              placeholder="Breve resumo do conteúdo..." 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="space-y-2 border-t pt-4">
            <Label className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4" /> Link do Relatório (Embed)
            </Label>
            <Input 
              placeholder="https://app.powerbi.com/reportEmbed?..." 
              value={formData.embedded_url}
              onChange={(e) => setFormData({...formData, embedded_url: e.target.value})}
            />
          </div>

          <div className="flex items-center justify-between border-t pt-4 mt-2">
            <div className="flex flex-col">
              <span className="text-sm font-medium">Relatório Ativo?</span>
              <span className="text-xs text-slate-500">Se desligado, ninguém visualiza.</span>
            </div>
            <Switch 
              checked={formData.active}
              onCheckedChange={(checked) => setFormData({...formData, active: checked})}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}