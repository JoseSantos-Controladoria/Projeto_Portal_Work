import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Plus, Building2 } from 'lucide-react';
import { toast } from 'sonner';

interface ClientsListViewProps {
  onSelectClient: (clientId: string) => void;
}

export function ClientsListView({ onSelectClient }: ClientsListViewProps) {
  const { clients, dashboards, addClient } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    logoUrl: '',
  });

  const handleAddClient = () => {
    if (!newClient.name) {
      toast.error('Preencha o nome da empresa');
      return;
    }

    addClient(newClient);
    toast.success('Cliente criado com sucesso!');
    setIsDialogOpen(false);
    setNewClient({ name: '', logoUrl: '' });
  };

  const getClientDashboardCount = (clientId: string) => {
    return dashboards.filter((d) => d.clientId === clientId).length;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Clientes</h1>
          <p className="text-slate-600">
            Gerencie seus clientes e os dashboards de cada empresa
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 shadow-sm">
              <Plus className="w-4 h-4 mr-2" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
              <DialogDescription>
                Adicione uma nova empresa cliente ao sistema
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Nome da Empresa</Label>
                <Input
                  id="clientName"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  placeholder="Ex: Supermercados ABC"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logoUrl">URL do Logo (opcional)</Label>
                <Input
                  id="logoUrl"
                  value={newClient.logoUrl}
                  onChange={(e) => setNewClient({ ...newClient, logoUrl: e.target.value })}
                  placeholder="https://exemplo.com/logo.png"
                />
                <p className="text-xs text-slate-500">
                  Cole a URL da imagem do logo da empresa
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddClient} className="bg-blue-600 hover:bg-blue-700">
                Criar Cliente
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Grid de Clientes */}
      {clients.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-600 mb-2">
              Nenhum cliente cadastrado
            </h3>
            <p className="text-slate-500 mb-6">
              Comece criando seu primeiro cliente para gerenciar dashboards
            </p>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeiro Cliente
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
            <Card
              key={client.id}
              className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-blue-200 rounded-xl shadow-sm"
              onClick={() => onSelectClient(client.id)}
            >
              <CardContent className="p-6">
                {/* Logo */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform">
                    {client.logoUrl ? (
                      <img
                        src={client.logoUrl}
                        alt={client.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Building2 className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                      {client.name}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {getClientDashboardCount(client.id)} relatório(s)
                    </p>
                  </div>
                </div>

                {/* Estatísticas */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Dashboards ativos</span>
                    <span className="font-semibold text-blue-600">
                      {getClientDashboardCount(client.id)}
                    </span>
                  </div>
                </div>

                {/* Hover indicator */}
                <div className="mt-4 flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs text-blue-600 font-medium">
                    Clique para gerenciar →
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
