import { useState } from "react";
import { 
  Users, 
  Building2, 
  AlignLeft, 
  CheckCircle2, 
  Loader2,
  Tag,
  Search,
  UserPlus,
  Check,
  LayoutGrid
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
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Badge } from "@/app/components/ui/badge";

const MOCK_AVAILABLE_USERS = [
  { id: 'u1', name: 'Roberto Almeida', email: 'roberto@Sherwin-Williams.com', role: 'Analista', avatar: 'https://github.com/shadcn.png' },
  { id: 'u2', name: 'Fernanda Costa', email: 'fernanda@pg.com', role: 'Gerente', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
  { id: 'u3', name: 'Juliana Silva', email: 'juliana@semptcl.com', role: 'Analista', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
  { id: 'u4', name: 'Ricardo Oliveira', email: 'ricardo@Sherwin-Williams.com', role: 'Diretor', avatar: '' },
  { id: 'u5', name: 'Amanda Souza', email: 'amanda@workon.com', role: 'Admin', avatar: '' },
  { id: 'u6', name: 'Carlos Lima', email: 'carlos@pg.com', role: 'Analista', avatar: '' },
  { id: 'u7', name: 'Ana Paula', email: 'ana@semptcl.com', role: 'Gerente', avatar: '' },
];

interface GroupRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GroupRegistrationModal({ isOpen, onClose }: GroupRegistrationModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    clientName: "",
    type: "",
    description: ""
  });

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [userSearch, setUserSearch] = useState("");

  const toggleUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const filteredUsers = MOCK_AVAILABLE_USERS.filter(user => 
    user.name.toLowerCase().includes(userSearch.toLowerCase()) || 
    user.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Novo Grupo:", { ...formData, members: selectedUsers });
    setIsLoading(false);
    onClose();
    setSelectedUsers([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* Modal Widescreen (900px) */}
      <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden gap-0">
        
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <LayoutGrid className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-slate-900">Novo Grupo de Acesso</DialogTitle>
              <p className="text-sm text-slate-500 mt-1">Configure os dados do grupo e selecione os participantes.</p>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-12 h-[550px]">
            
            {/* COLUNA ESQUERDA: Configurações (5/12) */}
            <div className="md:col-span-5 p-6 border-r border-slate-100 space-y-6 overflow-y-auto">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-500" /> Dados do Grupo
                </h3>
                
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome do Grupo</Label>
                    <Input 
                      id="name" 
                      placeholder="Ex: Diretoria Executiva" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="client">Cliente</Label>
                    <Select 
                      value={formData.clientName} 
                      onValueChange={(val) => setFormData({...formData, clientName: val})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sherwin-Williams">Sherwin-Williams</SelectItem>
                        <SelectItem value="P&G">P&G</SelectItem>
                        <SelectItem value="SEMP TCL">SEMP TCL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo</Label>
                    <Select 
                      value={formData.type} 
                      onValueChange={(val) => setFormData({...formData, type: val})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Categoria..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Departamental">Departamental</SelectItem>
                        <SelectItem value="Projeto">Projeto Específico</SelectItem>
                        <SelectItem value="Geográfico">Regional / Geográfico</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="desc">Descrição</Label>
                    <Textarea 
                      id="desc" 
                      placeholder="Quem deve estar neste grupo?" 
                      className="resize-none h-32 text-sm"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* COLUNA DIREITA: Membros (7/12) */}
            <div className="md:col-span-7 p-6 bg-slate-50/30 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-slate-500" /> Adicionar Membros
                </h3>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                  {selectedUsers.length} selecionado(s)
                </Badge>
              </div>

              {/* Busca */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  placeholder="Buscar usuário por nome ou email..." 
                  className="pl-9 bg-white"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
              </div>

              {/* Lista com Scroll Ocupando o Resto da Altura */}
              <div className="flex-1 border border-slate-200 rounded-lg bg-white overflow-hidden flex flex-col">
                <div className="overflow-y-auto custom-scrollbar flex-1 p-1">
                  {filteredUsers.length > 0 ? (
                    <div className="space-y-1">
                      {filteredUsers.map((user) => {
                        const isSelected = selectedUsers.includes(user.id);
                        return (
                          <div 
                            key={user.id} 
                            className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-all border ${
                              isSelected 
                                ? 'bg-emerald-50 border-emerald-200 shadow-sm' 
                                : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-100'
                            }`}
                            onClick={() => toggleUser(user.id)}
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9 border border-slate-100">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback className="text-xs bg-slate-100 text-slate-600 font-bold">
                                  {user.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className={`text-sm font-medium ${isSelected ? 'text-emerald-900' : 'text-slate-700'}`}>
                                  {user.name}
                                </p>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-slate-500">{user.email}</span>
                                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                                    {user.role}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                              isSelected 
                                ? 'bg-emerald-500 border-emerald-500 scale-100' 
                                : 'border-slate-300 bg-white group-hover:border-slate-400'
                            }`}>
                              {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                      <Search className="w-8 h-8 mb-2 opacity-20" />
                      <p className="text-sm">Nenhum usuário encontrado</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 border-t border-slate-100 bg-slate-50/30">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading} className="hover:bg-slate-200">
              Cancelar
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 min-w-[150px]" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Criar Grupo
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}