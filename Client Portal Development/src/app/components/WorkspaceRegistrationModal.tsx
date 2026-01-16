import { useState } from "react";
import { 
  Briefcase, 
  Building2, 
  Globe, 
  AlignLeft, 
  CheckCircle2, 
  Loader2 
} from "lucide-react";
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

interface WorkspaceRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WorkspaceRegistrationModal({ isOpen, onClose }: WorkspaceRegistrationModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    clientName: "",
    url: "",
    description: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulação de API
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Novo Workspace:", formData);
    
    setIsLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-amber-600" />
            Novo Workspace
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-2">
          
          {/* Linha 1: Nome e Cliente */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" /> Nome do Workspace
              </Label>
              <Input 
                id="name" 
                placeholder="Ex: Comercial Sell-out" 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="client" className="flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-slate-400" /> Cliente
              </Label>
              <Select 
                value={formData.clientName} 
                onValueChange={(val) => setFormData({...formData, clientName: val})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HALEON">HALEON</SelectItem>
                  <SelectItem value="P&G">P&G</SelectItem>
                  <SelectItem value="SEMP TCL">SEMP TCL</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Linha 2: URL (Agora Full Width para caber links longos) */}
          <div className="space-y-2">
            <Label htmlFor="url" className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-slate-400" /> URL de Acesso
            </Label>
            <Input 
              id="url" 
              placeholder="https://app.powerbi.com/groups/..." 
              className="text-blue-600 font-medium"
              required
              value={formData.url}
              onChange={(e) => setFormData({...formData, url: e.target.value})}
            />
          </div>

          {/* Linha 3: Descrição */}
          <div className="space-y-2">
            <Label htmlFor="desc" className="flex items-center gap-2">
              <AlignLeft className="w-3.5 h-3.5 text-slate-400" /> Descrição do Ambiente
            </Label>
            <Textarea 
              id="desc" 
              placeholder="Descreva o propósito deste workspace, quais áreas ele atende, etc." 
              className="resize-none h-24"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <DialogFooter className="pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-amber-600 hover:bg-amber-700 min-w-[140px]" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Cadastrar
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}