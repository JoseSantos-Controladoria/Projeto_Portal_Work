import { useState } from "react";
import { 
  Users, 
  Shield, 
  Building2, 
  Search,
  UserPlus,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Checkbox } from "@/app/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";

interface GroupRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock de usuários
const USERS_AVAILABLE = [
  { id: '1', name: 'Roberto Almeida', email: 'roberto@workon.com', avatar: '' },
  { id: '2', name: 'Fernanda Costa', email: 'fernanda@instore.com', avatar: '' },
  { id: '3', name: 'Juliana Silva', email: 'juliana@haleon.com', avatar: '' },
  { id: '4', name: 'Ricardo Oliveira', email: 'ricardo@pg.com', avatar: '' },
  { id: '5', name: 'Carlos System', email: 'admin@portal.com', avatar: '' },
  { id: '6', name: 'Ana Souza', email: 'ana@sherwin.com', avatar: '' },
  { id: '7', name: 'Marcos Paulo', email: 'marcos@semptcl.com', avatar: '' },
  { id: '8', name: 'Patrícia Gomes', email: 'patricia@workon.com', avatar: '' },
  { id: '9', name: 'Lucas Fernandes', email: 'lucas@instore.com', avatar: '' },
  { id: '10', name: 'Isabela Santos', email: 'isabela@haleon.com', avatar: '' },
  { id: '11', name: 'Gustavo Lima', email: 'gustavo@pg.com', avatar: '' }, 
  { id: '12', name: 'Mariana Ribeiro', email: 'mariana@sherwin.com', avatar: '' },

];

export function GroupRegistrationModal({ isOpen, onClose }: GroupRegistrationModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    client: "",
    role: "Visualizador",
    status: "active"
  });

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [userSearch, setUserSearch] = useState("");

  const handleSave = () => {
    console.log("Criando Grupo:", { ...formData, members: selectedUsers });
    onClose();
    setFormData({ name: "", client: "", role: "Visualizador", status: "active" });
    setSelectedUsers([]);
    setUserSearch("");
  };

  const toggleUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const filteredUsers = USERS_AVAILABLE.filter(user => 
    user.name.toLowerCase().includes(userSearch.toLowerCase()) || 
    user.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] bg-white overflow-hidden">
        <DialogHeader className="px-2">
          <DialogTitle className="text-xl">Novo Grupo de Acesso</DialogTitle>
          <DialogDescription>
            Preencha os detalhes do grupo à esquerda e selecione os membros à direita.
          </DialogDescription>
        </DialogHeader>

        {/* LAYOUT DE 2 COLUNAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4 px-2">
          
          {/*OLUNA ESQUERDA*/}
          <div className="space-y-5 bg-slate-50 p-5 rounded-xl border border-slate-100 h-full">
            <div>
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Dados do Grupo
              </h3>
              
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-slate-700">Nome do Grupo</Label>
                  <Input 
                    id="name" 
                    className="bg-white"
                    placeholder="Ex: Comercial - Liderança" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="grid gap-2">
                  <Label className="text-slate-700">Cliente Vinculado</Label>
                  <Select value={formData.client} onValueChange={(val) => setFormData({...formData, client: val})}>
                    <SelectTrigger className="bg-white">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        <SelectValue placeholder="Selecione..." />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sherwin-Williams">Sherwin-Williams</SelectItem>
                      <SelectItem value="HALEON">HALEON</SelectItem>
                      <SelectItem value="P&G">P&G</SelectItem>
                      <SelectItem value="SEMP TCL">SEMP TCL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-slate-700">Permissão Padrão</Label>
                    <Select value={formData.role} onValueChange={(val) => setFormData({...formData, role: val})}>
                      <SelectTrigger className="bg-white">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Shield className="w-4 h-4 text-slate-400" />
                          <SelectValue />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Editor">Editor</SelectItem>
                        <SelectItem value="Visualizador">Visualizador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-slate-700">Status Inicial</Label>
                    <Select value={formData.status} onValueChange={(val) => setFormData({...formData, status: val})}>
                      <SelectTrigger className="bg-white">
                        <div className="flex items-center gap-2 text-slate-600">
                          <CheckCircle2 className="w-4 h-4 text-slate-400" />
                          <SelectValue />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="inactive">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* COLUNA DIREITA*/}
          <div className="space-y-4 flex flex-col h-full">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-600" />
                Adicionar Membros
              </h3>
              <span className="text-xs text-emerald-700 font-medium bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                {selectedUsers.length} selecionado(s)
              </span>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Buscar usuário..." 
                className="pl-9"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
            </div>

            {/* Lista de Usuários  */}
            <div className="border rounded-xl h-[350px] overflow-y-auto p-2 space-y-1 bg-white shadow-sm">
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <div 
                    key={user.id} 
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer border group ${
                      selectedUsers.includes(user.id) 
                        ? 'bg-blue-50/80 border-blue-200' 
                        : 'border-transparent hover:bg-slate-50'
                    }`}
                    onClick={() => toggleUser(user.id)}
                  >
                    <Checkbox 
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={() => toggleUser(user.id)}
                      className="data-[state=checked]:bg-blue-600 border-slate-300"
                    />
                    
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar className="w-9 h-9 border-2 border-white shadow-sm">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="text-xs bg-slate-200 text-slate-600 font-bold">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className={`text-sm font-semibold ${selectedUsers.includes(user.id) ? 'text-blue-700' : 'text-slate-700'}`}>
                          {user.name}
                        </span>
                        <span className="text-xs text-slate-500 group-hover:text-slate-600">{user.email}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3 my-auto py-10">
                  <div className="p-4 bg-slate-50 rounded-full">
                    <UserPlus className="w-8 h-8 opacity-50" />
                  </div>
                  <p className="text-sm font-medium">Nenhum usuário encontrado.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="px-2 mt-4">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">Cancelar</Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto" onClick={handleSave}>
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Confirmar Criação do Grupo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}