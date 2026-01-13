import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { 
  TrendingUp, 
  PackageX, 
  PieChart, 
  MapPin, 
  DollarSign, 
  Store, 
  ShoppingCart,
  ExternalLink,
  BarChart3,
  LineChart,
  Users,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const iconMap: Record<string, any> = {
  TrendingUp,
  PackageX,
  PieChart,
  MapPin,
  DollarSign,
  Store,
  ShoppingCart,
  BarChart3,
  LineChart,
  Users,
};

interface ClientDashboardProps {
  onViewReport: (dashboardId: string) => void;
}

export function ClientDashboard({ onViewReport }: ClientDashboardProps) {
  const { user } = useAuth();
  const { clients, getDashboardsByClient } = useData();

  const userClient = clients.find((c) => c.id === user?.clientId);
  const userDashboards = user?.clientId ? getDashboardsByClient(user.clientId) : [];

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

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Bem-vindo, {user?.name}
        </h1>
        {userClient && (
          <p className="text-slate-600 text-lg">{userClient.name}</p>
        )}
        <p className="text-slate-500 mt-1">
          Acesse seus relatórios de trade marketing abaixo
        </p>
      </div>

      {/* Grid de Dashboards */}
      {userDashboards.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <PieChart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-600 mb-2">
              Nenhum relatório disponível
            </h3>
            <p className="text-slate-500">
              Entre em contato com seu gerente de conta para solicitar acesso aos relatórios.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userDashboards.map((dashboard) => {
            const Icon = iconMap[dashboard.icon] || TrendingUp;

            return (
              <Card
                key={dashboard.id}
                className="group hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-200 cursor-pointer rounded-xl shadow-sm"
                onClick={() => onViewReport(dashboard.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                      <Icon className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Atualizado {getTimeAgo(dashboard.lastUpdated)}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                    {dashboard.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 min-h-[40px]">
                    {dashboard.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 group-hover:shadow-md transition-all"
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

      {/* Informações Adicionais */}
      {userDashboards.length > 0 && (
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  Dica: Maximize sua visualização
                </h3>
                <p className="text-sm text-slate-600">
                  Os relatórios são otimizados para tela cheia. Clique no ícone de expansão dentro do relatório para uma melhor experiência de análise.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}