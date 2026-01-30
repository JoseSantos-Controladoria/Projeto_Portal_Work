import { useState, useEffect } from "react";
import { 
  User as UserIcon, Mail, Building, Shield, CheckCircle2, Loader2, Users 
} from "lucide-react"; 
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Checkbox } from "@/app/components/ui/checkbox";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription
} from "@/app/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/app/components/ui/select";
import { Switch } from "@/app/components/ui/switch";
import { userService } from "@/services/userService";
import { toast } from "sonner";

interface UserRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userIdToEdit?: string | null;
  onSuccess?: () => void;
}

export function UserRegistrationModal({ isOpen, onClose, userIdToEdit, onSuccess }: UserRegistrationModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Inicializando como arrays vazios
  const [companiesList, setCompaniesList] = useState<any[]>([]);
  const [profilesList, setProfilesList] = useState<any[]>([]);
  const [allGroupsList, setAllGroupsList] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company_id: "",
    profile_id: "",
    active: true
  });
  
  const [selectedGroups, setSelectedGroups] = useState<number[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadAuxiliaryData();
      if (!userIdToEdit) {
        setFormData({ name: "", email: "", company_id: "", profile_id: "", active: true });
        setSelectedGroups([]);
      }
    }
  }, [isOpen, userIdToEdit]);

  const loadAuxiliaryData = async () => {
    setIsLoadingData(true);
    try {
      const data = await userService.getAuxiliaryData();
      setCompaniesList(data.companies);
      setProfilesList(data.profiles);
      setAllGroupsList(data.groups);
      
      if (userIdToEdit) {
        const userGroups = await userService.getUserGroups(userIdToEdit);
        if (userGroups && Array.isArray(userGroups)) {
             const groupIds = userGroups.map((g: any) => g.group_id);
             setSelectedGroups(groupIds);
        }
      }

    } catch (error) {
      console.error("Erro no modal:", error);
      toast.error("Erro ao carregar listas de opções.");
    } finally {
      setIsLoadingData(false);
    }
  };

  // Função isolada para manipular a troca
  const toggleGroup = (groupId: number) => {
    setSelectedGroups(prev => {
      const newGroups = prev.includes(groupId) 
        ? prev.filter(g => g !== groupId) 
        : [...prev, groupId];
      return newGroups;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await userService.save({
        id: userIdToEdit || undefined,
        name: formData.name,
        email: formData.email,
        company_id: Number(formData.company_id),
        profile_id: Number(formData.profile_id),
        active: formData.active
      }, selectedGroups);

      toast.success(userIdToEdit ? "Usuário atualizado!" : "Usuário criado com sucesso!");
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar usuário.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-blue-600" />
            {userIdToEdit ? "Editar Usuário" : "Novo Usuário"}
          </DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para gerenciar o acesso do usuário.
          </DialogDescription>
        </DialogHeader>

        {isLoadingData ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2 text-slate-500">
             <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
             <span className="text-sm">Carregando listas...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 py-2">
            
            {/* Identificação */}
            <div className="space-y-4">
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

            {/* Empresa e Perfil */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Building className="w-3.5 h-3.5 text-slate-500" /> Empresa
                </Label>
                <Select 
                  value={formData.company_id ? String(formData.company_id) : undefined} 
                  onValueChange={(val) => setFormData({...formData, company_id: val})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {companiesList.length === 0 ? (
                       <SelectItem value="disabled" disabled>Nenhuma empresa encontrada</SelectItem>
                    ) : (
                       companiesList.map(comp => (
                         <SelectItem key={comp.id} value={String(comp.id)}>{comp.name}</SelectItem>
                       ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-slate-500" /> Perfil
                </Label>
                <Select 
                  value={formData.profile_id ? String(formData.profile_id) : undefined} 
                  onValueChange={(val) => setFormData({...formData, profile_id: val})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Defina o perfil..." />
                  </SelectTrigger>
                  <SelectContent>
                     {profilesList.length === 0 ? (
                       <SelectItem value="disabled" disabled>Nenhum perfil encontrado</SelectItem>
                    ) : (
                      profilesList.map(prof => (
                        <SelectItem key={prof.id} value={String(prof.id)}>{prof.name}</SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Grupos - CORREÇÃO PRINCIPAL AQUI */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-slate-500" /> Grupos de Acesso
              </Label>
              
              <div className="border rounded-md p-3 h-32 overflow-y-auto bg-slate-50/50 space-y-2">
                {allGroupsList.length === 0 ? (
                    <span className="text-xs text-slate-400 p-2">Nenhum grupo cadastrado.</span>
                ) : (
                   allGroupsList.map(group => (
                    // Alteração: Removi o onClick da DIV e passei apenas para o Checkbox
                    <div 
                      key={group.id} 
                      className="flex items-center space-x-2 p-2 rounded hover:bg-white hover:shadow-sm transition-all"
                    >
                        <Checkbox 
                          id={`group-${group.id}`}
                          checked={selectedGroups.includes(group.id)} 
                          onCheckedChange={() => toggleGroup(group.id)} // Garante a atualização correta
                          className="data-[state=checked]:bg-blue-600 border-slate-300 cursor-pointer"
                        />
                        <label 
                          htmlFor={`group-${group.id}`} // Vincula label ao checkbox
                          className="text-sm font-medium leading-none cursor-pointer text-slate-700 w-full"
                        >
                          {group.name}
                        </label>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-700">Acesso Ativo?</span>
                <span className="text-xs text-slate-500">Usuário poderá fazer login.</span>
              </div>
              <Switch 
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({...formData, active: checked})}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 min-w-[140px]" disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}