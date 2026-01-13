import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { 
  TrendingUp, 
  ExternalLink,
  Plus,
  X
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Dashboard } from '@/types';

interface DashboardsViewProps {
  dashboards: Dashboard[];
  onViewReport: (dashboardId: string) => void;
  onAddDashboard?: (dashboard: Omit<Dashboard, 'id' | 'created_at' | 'updated_at'>) => void;
}

export function DashboardsView({ dashboards, onViewReport, onAddDashboard }: DashboardsViewProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newDashboard, setNewDashboard] = useState({
    title: '',
    description: '',
    embed_url: '',
    company_id: '',
  });

  const getTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: ptBR,
      });
    } catch {
      return 'Data indisponível';
    }
  };

  const handleAddDashboard = () => {
    if (!newDashboard.title || !newDashboard.embed_url) {
      return;
    }
    onAddDashboard?.({
      title: newDashboard.title,
      description: newDashboard.description,
      embed_url: newDashboard.embed_url,
      company_id: newDashboard.company_id || user?.company_id || '',
    });
    setNewDashboard({ title: '', description: '', embed_url: '', company_id: '' });
    setIsDialogOpen(false);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Dashboards
          </h1>
          <p className="text-slate-600 text-lg">
            {isAdmin ? 'Gerencie e visualize todos os relatórios' : 'Acesse seus relatórios de trade marketing'}
          </p>
        </div>
        {isAdmin && onAddDashboard && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#2563EB] hover:bg-[#1d4ed8]">
                <Plus className="w-4 h-4 mr-2" />
                Novo Relatório
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Relatório</DialogTitle>
                <DialogDescription>
                  Configure um novo dashboard do Power BI para um cliente.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Performance de Vendas - Janeiro"
                    value={newDashboard.title}
                    onChange={(e) => setNewDashboard({ ...newDashboard, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva o conteúdo deste relatório..."
                    value={newDashboard.description}
                    onChange={(e) => setNewDashboard({ ...newDashboard, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="embed_url">URL do Iframe (Power BI) *</Label>
                  <Input
                    id="embed_url"
                    placeholder="https://app.powerbi.com/view?r=..."
                    value={newDashboard.embed_url}
                    onChange={(e) => setNewDashboard({ ...newDashboard, embed_url: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company_id">ID da Empresa (opcional)</Label>
                  <Input
                    id="company_id"
                    placeholder="Deixe vazio para empresa atual"
                    value={newDashboard.company_id}
                    onChange={(e) => setNewDashboard({ ...newDashboard, company_id: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  className="bg-[#2563EB] hover:bg-[#1d4ed8]"
                  onClick={handleAddDashboard}
                  disabled={!newDashboard.title || !newDashboard.embed_url}
                >
                  Adicionar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Grid de Dashboards */}
      {dashboards.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <TrendingUp className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-600 mb-2">
              Nenhum relatório disponível
            </h3>
            <p className="text-slate-500">
              {isAdmin 
                ? 'Comece adicionando um novo relatório usando o botão acima.'
                : 'Entre em contato com seu gerente de conta para solicitar acesso aos relatórios.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboards.map((dashboard) => {
            const createdDate = dashboard.created_at || dashboard.last_updated || new Date().toISOString();
            
            return (
              <Card
                key={dashboard.id}
                className="group hover:shadow-lg transition-all duration-200 border-2 hover:border-[#2563EB]/30 cursor-pointer rounded-xl shadow-sm"
                onClick={() => onViewReport(dashboard.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-12 h-12 bg-[#2563EB]/10 rounded-xl flex items-center justify-center group-hover:bg-[#2563EB] transition-colors">
                      <TrendingUp className="w-6 h-6 text-[#2563EB] group-hover:text-white transition-colors" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {getTimeAgo(createdDate)}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl group-hover:text-[#2563EB] transition-colors">
                    {dashboard.title}
                  </CardTitle>
                  {dashboard.description && (
                    <CardDescription className="line-clamp-2 min-h-[40px]">
                      {dashboard.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] group-hover:shadow-md transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewReport(dashboard.id);
                    }}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visualizar Relatório
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
