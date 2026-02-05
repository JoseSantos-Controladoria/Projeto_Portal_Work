import { useEffect } from "react";
import { ArrowLeft, Maximize2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Dashboard } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { logService } from "@/services/logService";

interface ReportViewerProps {
  dashboardId: string;
  dashboard?: Dashboard | any; 
  onBack: () => void;
}

export function ReportViewer({ dashboard, onBack }: ReportViewerProps) {
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id && dashboard?.id) {
       logService.logAction(user.id, 'OPEN REPORT', Number(dashboard.id));
    }
  }, [dashboard?.id, user?.id]);

  if (!dashboard) return null;

  const reportUrl = dashboard.embedUrl || dashboard.embedded_url || "";

  return (
    <div className="flex flex-col h-full bg-slate-50">
      
      {/* Header do Relatório */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack} 
            className="hover:bg-slate-100 -ml-2 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-slate-800 leading-none">
              {dashboard.title}
            </h2>
            <span className="text-xs text-slate-500 mt-1 font-medium">
               {dashboard.workspace_name || "Workspace Padrão"} • {dashboard.type || "Relatório Power BI"}
            </span>
          </div>
        </div>
        <div></div>
      </div>

      {/* Área do Conteúdo (Iframe Ampliado) */}
      <div className="flex-1 p-2 md:p-4 overflow-hidden flex flex-col items-center justify-center relative bg-slate-100">
        
        {/* Iframe do PowerBI */}
        {reportUrl ? (
          <div className="w-full h-[85vh] bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden relative">
            <iframe 
              title={dashboard.title}
              src={reportUrl} 
              className="w-full h-full border-0"
              allowFullScreen={true}
            />
          </div>
        ) : (
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