import { useState, useRef } from "react";
import { 
  Upload, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  CheckCircle2,
  Loader2,
  LayoutTemplate,
  Type,
  Globe
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
import { Switch } from "@/app/components/ui/switch";

interface ReportRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReportRegistrationModal({ isOpen, onClose }: ReportRegistrationModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    client: "",
    workspace: "",
    reportUrl: "",
    status: true
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Dados:", { ...formData, previewUrl });
    setIsLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* Aumentei a largura para 850px para dar o aspecto retangular "widescreen" */}
      <DialogContent className="sm:max-w-[850px] p-0 overflow-hidden gap-0">
        
        {/* Header Estilizado */}
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
          <div className="grid md:grid-cols-12 h-full">
            
            {/* COLUNA ESQUERDA: Upload de Imagem (Visual) */}
            <div className="md:col-span-5 p-6 bg-slate-50 border-r border-slate-100 flex flex-col gap-4">
              <Label className="text-slate-700 font-semibold">Capa do Relatório</Label>
              <p className="text-xs text-slate-500 -mt-2 mb-2">
                Essa imagem aparecerá nos cards da tela inicial. Use uma captura de tela atraente.
              </p>
              
              <div 
                className={`flex-1 min-h-[250px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group relative overflow-hidden ${
                  previewUrl ? 'border-blue-400 bg-slate-800' : 'border-slate-300 hover:border-blue-400 hover:bg-white bg-slate-100'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageChange}
                />
                
                {previewUrl ? (
                  <>
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-40 transition-opacity duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                        <Upload className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center space-y-3 p-4">
                    <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto text-blue-500 group-hover:scale-110 transition-transform duration-300">
                      <ImageIcon className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700 group-hover:text-blue-600">
                        Clique para enviar
                      </p>
                      <p className="text-xs text-slate-400 mt-1">PNG ou JPG (Max 2MB)</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* COLUNA DIREITA: Formulário (Dados) */}
            <div className="md:col-span-7 p-6 space-y-5">
              
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

              {/* Grid Cliente + Workspace */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client">Cliente</Label>
                  <Select 
                    value={formData.client} 
                    onValueChange={(val) => setFormData({...formData, client: val})}
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
                  <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
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
                  placeholder="Breve resumo sobre os KPIs apresentados..." 
                  className="resize-none h-20 text-sm"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-700">Ativo</span>
                  <span className="text-xs text-slate-500">
                    {formData.status ? 'O relatório estará ativo e aparecerá para os usuários.' : 'O relatório ficará inativo e não aparecerá para os usuários.'}
                  </span>
                </div>
                <Switch 
                  checked={formData.status}
                  onCheckedChange={(checked) => setFormData({...formData, status: checked})}
                />
              </div>

            </div>
          </div>

          <DialogFooter className="p-6 border-t border-slate-100 bg-slate-50/30">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading} className="hover:bg-slate-100">
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