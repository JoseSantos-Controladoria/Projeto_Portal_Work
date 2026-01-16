import { useState, useRef } from "react";
import { 
  Upload, 
  User, 
  Mail, 
  Building, 
  Briefcase,
  Shield,
  CheckCircle2,
  Loader2,
  Camera
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
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

export function UserRegistrationModal({ isOpen, onClose }: UserRegistrationModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    internalCompany: "",
    clientPortfolio: "",
    role: "",
    status: true
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Novo Usuário:", { ...formData, avatarPreview });
    setIsLoading(false);
    onClose();
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

          <div className="grid grid-cols-2 gap-4">
            {/* 2. Empresa (Org) */}
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

            {/* 3. Carteira (Cliente) */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5 text-slate-500" /> Carteira Principal
              </Label>
              <Select 
                value={formData.clientPortfolio} 
                onValueChange={(val) => setFormData({...formData, clientPortfolio: val})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cliente..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HALEON">HALEON</SelectItem>
                  <SelectItem value="P&G">P&G</SelectItem>
                  <SelectItem value="SEMP TCL">SEMP TCL</SelectItem>
                  <SelectItem value="Todos">Acesso Global (Todos)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 4. Permissão */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-slate-500" /> Nível de Acesso
              </Label>
              <Select 
                value={formData.role} 
                onValueChange={(val) => setFormData({...formData, role: val})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Defina a permissão..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Administrador</SelectItem>
                  <SelectItem value="Analista">Analista</SelectItem>
                  <SelectItem value="Cliente">Cliente (Visualizador)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 5. Status */}
            <div className="space-y-2 flex flex-col justify-end">
              <div className="flex items-center justify-between border rounded-md p-2 h-10">
                <span className="text-sm text-slate-600 pl-1">Acesso Ativo?</span>
                <Switch 
                  checked={formData.status}
                  onCheckedChange={(checked) => setFormData({...formData, status: checked})}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-slate-100">
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