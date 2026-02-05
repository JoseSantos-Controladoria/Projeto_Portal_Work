import { useState, useEffect } from "react";
import { 
  Search, 
  ArrowLeft,
  BarChart3,
  Users,
  Building2,
  Loader2
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/app/components/ui/card";
import { customerService } from "@/services/customerService";
import { CustomerDashboard } from "@/types";
import { toast } from "sonner";

interface ClientsListProps {
  onBack: () => void;
  onSelectClient: (client: any) => void;
}

export function ClientsList({ onBack }: ClientsListProps) {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<CustomerDashboard[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await customerService.getDashboardCustomers();
      setCustomers(data);
    } catch (error) {
      toast.error("Erro ao carregar lista de clientes.");
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(client => 
    client.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Carteira de Clientes</h1>
            <p className="text-slate-500 text-sm">Visão geral da estrutura e acessos</p>
          </div>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar cliente..."
            className="pl-9 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Grid de Cards */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-500">
          <Loader2 className="h-10 w-10 animate-spin text-slate-400" />
          <p>Carregando carteira...</p>
        </div>
      ) : filteredCustomers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((client) => {
            const activeReports = Number(client.qty_report);

            return (
              <Card 
                key={client.customer_id} 
                className="group border-slate-200 overflow-hidden flex flex-col bg-white hover:shadow-md transition-shadow cursor-default"
              >
                {/* Faixa Superior Padronizada (Azul) */}
                <div className="h-1.5 w-full bg-blue-600" />
                
                <CardHeader className="pb-3 pt-5">
                  <div className="flex justify-between items-start">
                    {/* Nome do Cliente em Destaque (Sem ID) */}
                    <CardTitle className="text-xl font-bold text-slate-800">
                        {client.customer_name}
                    </CardTitle>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 pb-4">
                  <div className="space-y-4">
                    
                    {/* Lista de Grupos */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        <Users className="w-3 h-3" />
                        Grupos de Acesso
                      </div>
                      <div className="flex flex-wrap gap-2 min-h-[32px]">
                        {client.groups.length > 0 ? (
                           client.groups.slice(0, 4).map((group) => (
                            <Badge key={group.group_id} variant="secondary" className="bg-slate-100 text-slate-600 font-normal border border-slate-100">
                              {group.group_name}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-slate-400 italic">Nenhum grupo vinculado</span>
                        )}
                        {client.groups.length > 4 && (
                            <Badge variant="outline" className="text-xs text-slate-400 border-dashed">
                              +{client.groups.length - 4}
                            </Badge>
                        )}
                      </div>
                    </div>

                    {/* Métricas */}
                    <div className="flex items-center gap-2 text-sm text-slate-500 pt-2">
                      <BarChart3 className="w-4 h-4 text-slate-400" />
                      <span className="font-medium text-slate-700">{activeReports}</span> 
                      <span className="text-slate-400">relatórios disponíveis</span>
                    </div>

                  </div>
                </CardContent>

                {/* Footer Visual (Sem ação de clique) */}
                <CardFooter className="bg-slate-50 py-3 px-6 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      Monitoramento
                    </span>
                    {/* Ícone de status estático */}
                    <div className="flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span className="text-xs text-emerald-600 font-medium">Ativo</span>
                    </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-200">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-slate-900">Nenhum cliente encontrado</h3>
          <p className="text-slate-500">
            {searchTerm ? "Tente buscar por outro termo." : "Nenhum registro disponível."}
          </p>
        </div>
      )}
    </div>
  );
}