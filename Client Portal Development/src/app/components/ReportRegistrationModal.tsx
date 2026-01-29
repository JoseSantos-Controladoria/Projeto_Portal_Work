import { useState } from "react";
import { 
  Link as LinkIcon, 
  CheckCircle2,
  Loader2,
  LayoutTemplate,
  Type,
  Globe,
  Users // Ícone de Grupo
} from "lucide-react"; // Removidos: Upload, Image
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Switch } from "@/app/components/ui/switch";

interface ReportRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReportRegistrationModal({ isOpen, onClose }: ReportRegistrationModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    group: "", 
    workspace: "",
    reportUrl: "",
    status: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Dados:", formData);
    setIsLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden gap-0">
        
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <LayoutTemplate className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-slate-900">Novo Relatório</DialogTitle>
              <p className="text-sm text-slate-500 mt-1">Configure os detalhes do dashboard para publicação.</p>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-5">
            
            {/* Título */}
            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center gap-2">
                <Type className="w-3.5 h-3.5 text-slate-400" /> Título do Dashboard
              </Label>
              <Input 
                id="title" 
                placeholder="Ex: Executivo de Vendas 2026" 
                className="font-medium"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            {/* Grid Grupo + Workspace */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="group" className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-slate-400" /> Grupo de Acesso
                </Label>
                <Select 
                  value={formData.group} 
                  onValueChange={(val) => setFormData({...formData, group: val})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Comercial Sell-out">Comercial Sell-out</SelectItem>
                    <SelectItem value="Trade Marketing">Trade Marketing</SelectItem>
                    <SelectItem value="Logística & Supply">Logística & Supply</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="workspace">Workspace</Label>
                <Select 
                  value={formData.workspace} 
                  onValueChange={(val) => setFormData({...formData, workspace: val})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comercial">Comercial</SelectItem>
                    <SelectItem value="financeiro">Financeiro</SelectItem>
                    <SelectItem value="logistica">Logística</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* URL */}
            <div className="space-y-2">
              <Label htmlFor="url" className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-slate-400" /> Link do Power BI (Embed)
              </Label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  id="url" 
                  className="pl-9 font-mono text-xs text-blue-600" 
                  placeholder="https://app.powerbi.com/..." 
                  value={formData.reportUrl}
                  onChange={(e) => setFormData({...formData, reportUrl: e.target.value})}
                />
              </div>
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="desc">Descrição</Label>
              <Textarea 
                id="desc" 
                placeholder="Breve resumo sobre o conteúdo deste relatório..." 
                className="resize-none h-20 text-sm"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            {/* Status */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-4">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-700">Relatório Ativo</span>
                <span className="text-xs text-slate-500">
                  Visível para os usuários do grupo selecionado.
                </span>
              </div>
              <Switch 
                checked={formData.status}
                onCheckedChange={(checked) => setFormData({...formData, status: checked})}
              />
            </div>

          </div>

          <DialogFooter className="p-6 border-t border-slate-100 bg-slate-50/30">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 min-w-[150px]" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Publicar Relatório
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}