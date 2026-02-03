import { useEffect } from "react";
import { 
  ArrowLeft, 
  Maximize2, 
  MoreHorizontal, 
  RefreshCw, 
  ExternalLink 
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Dashboard } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { logService } from "@/services/logService";

interface ReportViewerProps {
  dashboardId: string;
  dashboard?: Dashboard | any; // Flexibilizando o tipo para aceitar dados do banco
  onBack: () => void;
}

export function ReportViewer({ dashboard, onBack }: ReportViewerProps) {
  const { user } = useAuth();

  // ✅ GATILHO DE LOG: Registra o acesso assim que o componente monta ou muda de relatório
  useEffect(() => {
    // Só registra se tivermos Usuário e ID do Relatório válidos
    if (user?.id && dashboard?.id) {
       // Converte ID para numero (banco espera int) e dispara o log
       // 'OPEN REPORT' é a ação padrão de visualização
       logService.logAction(user.id, 'OPEN REPORT', Number(dashboard.id));
    }
  }, [dashboard?.id, user?.id]);

  if (!dashboard) return null;

  // Compatibilidade: Tenta pegar 'embedUrl' (frontend/mock) ou 'embedded_url' (backend)
  const reportUrl = dashboard.embedUrl || dashboard.embedded_url || "";

  return (
    <div className="flex flex-col h-full bg-slate-50">
      
      {/* Header do Relatório */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-slate-100">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Button>
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">
              {dashboard.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Atualizado {dashboard.last_update || "Recentemente"}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-medium border border-blue-100">
                {dashboard.type || "Relatório"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {reportUrl && (
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden md:flex gap-2 text-slate-600"
              onClick={() => window.open(reportUrl, '_blank')}
            >
              <ExternalLink className="w-4 h-4" />
              Abrir Nova Aba
            </Button>
          )}
          
          <div className="h-6 w-px bg-slate-200 mx-1 hidden md:block" />
          
          <Button variant="ghost" size="icon" title="Atualizar" onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 text-slate-500" />
          </Button>
          <Button variant="ghost" size="icon" title="Tela Cheia">
            <Maximize2 className="w-4 h-4 text-slate-500" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="w-4 h-4 text-slate-500" />
          </Button>
        </div>
      </div>

      {/* Área do Conteúdo (Iframe) */}
      <div className="flex-1 p-6 overflow-hidden flex flex-col items-center justify-center relative">
        
        {/* Iframe do PowerBI */}
        {reportUrl ? (
          <div className="w-full h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative flex-1 min-h-[600px]">
            <iframe 
              title={dashboard.title}
              src={reportUrl} 
              className="w-full h-full border-0 min-h-[600px]"
              allowFullScreen={true}
            />
          </div>
        ) : (
          /* Placeholder de Erro / Configuração */
          <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8 text-center border border-slate-100">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Maximize2 className="w-8 h-8 text-blue-600" />
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Visualização indisponível
            </h3>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              Este relatório ainda não possui uma URL de incorporação (embed) configurada no sistema.
            </p>

            <div className="bg-slate-50 rounded-lg p-4 text-left border border-slate-100">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 block">
                Dados Técnicos
              </label>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-1 border-b border-slate-200 border-dashed">
                  <span className="text-slate-500">ID do Relatório:</span>
                  <span className="font-mono text-slate-700">{dashboard.id}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 border-dashed">
                  <span className="text-slate-500">Workspace:</span>
                  <span className="text-slate-700">{dashboard.workspace_name || "Padrão"}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Status:</span>
                  <span className="text-slate-700">{dashboard.active ? "Ativo" : "Inativo"}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}