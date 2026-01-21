import { useState, useRef } from "react";
import { 
  Upload, 
  User, 
  Mail, 
  Building, 
  Shield,
  CheckCircle2,
  Loader2,
  Camera,
  Users // Ícone para Grupos
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Checkbox } from "@/app/components/ui/checkbox"; // Usando Checkbox para múltipla seleção
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
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";

interface UserRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Grupos Mockados para Seleção
const MOCK_GROUPS = [
  'Comercial Sell-out',
  'Trade Marketing',
  'Logística & Supply',
  'Vendas Varejo',
  'Diretoria Executiva',
  'Marketing Digital'
];

export function UserRegistrationModal({ isOpen, onClose }: UserRegistrationModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    internalCompany: "",
    role: "",
    status: true
  });
  
  // Estado para múltiplos grupos
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

  // Função para alternar grupos
  const toggleGroup = (group: string) => {
    setSelectedGroups(prev => 
      prev.includes(group) 
        ? prev.filter(g => g !== group) 
        : [...prev, group]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Novo Usuário:", { ...formData, groups: selectedGroups, avatarPreview });
    setIsLoading(false);
    onClose();
    // Limpar form
    setSelectedGroups([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Novo Usuário
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-2">
          
          {/* 1. Avatar e Identificação Básica */}
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* Upload Avatar */}
            <div className="flex flex-col items-center gap-2">
              <div 
                className="relative w-24 h-24 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-slate-50 transition-all overflow-hidden group"
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
                {avatarPreview ? (
                  <Avatar className="w-full h-full">
                    <AvatarImage src={avatarPreview} className="object-cover" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                ) : (
                  <Camera className="w-8 h-8 text-slate-300 group-hover:text-blue-500" />
                )}
                
                {/* Overlay de Hover */}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Upload className="w-5 h-5 text-white" />
                </div>
              </div>
              <span className="text-xs text-slate-500 font-medium">Foto de Perfil</span>
            </div>

            {/* Campos Nome e Email */}
            <div className="flex-1 space-y-4 w-full">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input 
                  id="name" 
                  placeholder="Ex: João da Silva" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail Corporativo</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input 
                    id="email" 
                    type="email" 
                    className="pl-9" 
                    placeholder="joao@empresa.com" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Empresa e Perfil */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Building className="w-3.5 h-3.5 text-slate-500" /> Empresa (Org)
              </Label>
              <Select 
                value={formData.internalCompany} 
                onValueChange={(val) => setFormData({...formData, internalCompany: val})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Work On">Work On</SelectItem>
                  <SelectItem value="InStore">InStore</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* MUDANÇA: 'Nível de Acesso' -> 'Perfil de Acesso' */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-slate-500" /> Perfil de Acesso
              </Label>
              <Select 
                value={formData.role} 
                onValueChange={(val) => setFormData({...formData, role: val})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Defina o perfil..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Administrador</SelectItem>
                  <SelectItem value="Analista">Analista</SelectItem>
                  <SelectItem value="Cliente">Cliente (Visualizador)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 3. MUDANÇA: Seleção de Grupos (Múltipla) */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-slate-500" /> Grupos Associados
            </Label>
            
            <div className="border rounded-md p-3 h-32 overflow-y-auto bg-slate-50/50 space-y-2">
              {MOCK_GROUPS.map(group => (
                 <div 
                   key={group} 
                   className="flex items-center space-x-2 p-2 rounded hover:bg-white hover:shadow-sm transition-all cursor-pointer"
                   onClick={() => toggleGroup(group)}
                 >
                    <Checkbox 
                      id={group} 
                      checked={selectedGroups.includes(group)} 
                      onCheckedChange={() => toggleGroup(group)}
                      className="data-[state=checked]:bg-blue-600 border-slate-300"
                    />
                    <label 
                      htmlFor={group} 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-slate-700"
                    >
                      {group}
                    </label>
                 </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-500 text-right">
              {selectedGroups.length} grupo(s) selecionado(s).
            </p>
          </div>

          {/* 4. Status */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-700">Acesso Ativo?</span>
              <span className="text-xs text-slate-500">Usuário poderá fazer login.</span>
            </div>
            <Switch 
              checked={formData.status}
              onCheckedChange={(checked) => setFormData({...formData, status: checked})}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 min-w-[140px]" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Criar Usuário
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}