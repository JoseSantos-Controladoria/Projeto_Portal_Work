import { useState } from "react";
import { Dashboard } from "@/types";
import { 
  Search, 
  Plus, 
  BarChart3, 
  ArrowUpRight, 
  Clock 
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DashboardsViewProps {
  dashboards: Dashboard[];
  onViewReport: (id: string) => void;
  onAddDashboard?: (dashboard: any) => Promise<void>;
}

export function DashboardsView({ dashboards, onViewReport, onAddDashboard }: DashboardsViewProps) {
  // 1. Estado local para armazenar o termo de busca
  const [searchTerm, setSearchTerm] = useState("");

  // 2. Lógica de filtragem (Case Insensitive)
  // Filtramos se o termo existe no Título OU na Descrição
  const filteredDashboards = dashboards.filter(dashboard => 
    dashboard.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dashboard.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header com Busca */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#2563EB]" />
            Dashboards
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Visualize os indicadores de performance da sua empresa.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Input de Busca com Ícone */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar por nome ou descrição..."
              className="pl-9 bg-slate-50 border-slate-200 focus:bg-white transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Botão de Adicionar (Apenas Admin) */}
          {onAddDashboard && (
            <Button 
              className="bg-[#2563EB] hover:bg-[#1d4ed8] shadow-md shadow-blue-500/20"
              onClick={() => {
                // Aqui abriremos o modal no futuro
                alert("Feature de Adicionar Dashboard em breve!");
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo
            </Button>
          )}
        </div>
      </div>

      {/* Grid de Resultados */}
      {filteredDashboards.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredDashboards.map((dashboard) => (
            <Card 
              key={dashboard.id} 
              className="group hover:shadow-lg transition-all duration-300 border-slate-200 cursor-pointer overflow-hidden"
              onClick={() => onViewReport(dashboard.id)}
            >
              <div className="h-2 bg-[#2563EB] w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                    Power BI
                  </Badge>
                </div>
                <CardTitle className="text-lg font-bold text-slate-800 leading-tight group-hover:text-[#2563EB] transition-colors">
                  {dashboard.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 text-sm mt-1">
                  {dashboard.description}
                </CardDescription>
              </CardHeader>
              
              <CardFooter className="pt-0 flex items-center justify-between text-xs text-slate-400 border-t border-slate-50 mt-4 p-4 bg-slate-50/50">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Atualizado {format(new Date(dashboard.last_updated), "d 'de' MMM", { locale: ptBR })}</span>
                </div>
                <div className="flex items-center gap-1 text-[#2563EB] font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                  Abrir Relatório
                  <ArrowUpRight className="w-3 h-3" />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        /* Estado Vazio (Zero Results) */
        <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <div className="mx-auto h-12 w-12 text-slate-300 mb-4">
            <Search className="h-full w-full" />
          </div>
          <h3 className="text-lg font-medium text-slate-900">Nenhum relatório encontrado</h3>
          <p className="text-slate-500 max-w-sm mx-auto mt-2">
            Não encontramos resultados para "{searchTerm}". Tente buscar por outros termos.
          </p>
          <Button 
            variant="link" 
            className="mt-4 text-[#2563EB]"
            onClick={() => setSearchTerm("")}
          >
            Limpar busca
          </Button>
        </div>
      )}
    </div>
  );
}
