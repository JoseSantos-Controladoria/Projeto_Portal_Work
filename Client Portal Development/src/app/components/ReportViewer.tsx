import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { ArrowLeft, Maximize2, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';
import { Dashboard } from '@/types';

interface ReportViewerProps {
  dashboardId: string;
  dashboard?: Dashboard | null;
  onBack: () => void;
}

export function ReportViewer({ dashboardId, dashboard: dashboardProp, onBack }: ReportViewerProps) {
  const dashboard = dashboardProp;
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!dashboard) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Relatório não encontrado</h2>
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    );
  }

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

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleFullscreen = () => {
    const iframe = document.querySelector('iframe');
    if (iframe) {
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header Minimalista */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-2 hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <div className="h-6 w-px bg-slate-300" />
          <div>
            <h2 className="font-semibold text-slate-900">{dashboard.title}</h2>
            <p className="text-xs text-slate-500">
              Atualizado {getTimeAgo(dashboard.last_updated || dashboard.created_at || new Date().toISOString())}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            PowerBI Embed
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2 hover:bg-slate-100"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFullscreen}
            className="gap-2 hover:bg-slate-100"
          >
            <Maximize2 className="w-4 h-4" />
            Tela Cheia
          </Button>
        </div>
      </div>

      {/* Área do Iframe */}
      <div className="flex-1 relative">
        {/* Placeholder com informações sobre o PowerBI */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="max-w-2xl w-full mx-auto p-8 text-center">
            <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-100">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Maximize2 className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                Visualização do PowerBI
              </h3>
              <p className="text-slate-600 mb-4">
                Este é o espaço onde seu relatório do PowerBI será incorporado.
              </p>
              <div className="bg-slate-50 rounded-lg p-4 mb-4 text-left">
                <p className="text-sm font-medium text-slate-700 mb-2">
                  <strong>URL do Embed configurado:</strong>
                </p>
                <code className="text-xs text-slate-600 break-all block bg-white p-3 rounded border border-slate-200">
                  {dashboard.embed_url}
                </code>
              </div>
              <p className="text-sm text-slate-500 mb-6">
                Em produção, substitua a URL acima pela URL real do seu relatório PowerBI.
                O iframe abaixo carregará automaticamente o relatório.
              </p>
              <div className="text-left bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-xs font-medium text-blue-900 mb-2">
                  💡 Como obter a URL de embed do PowerBI:
                </p>
                <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Acesse seu relatório no Power BI Service</li>
                  <li>Clique em "Arquivo" → "Inserir relatório" → "Site ou portal"</li>
                  <li>Copie a URL de incorporação gerada</li>
                  <li>Cole a URL no formulário "Adicionar Novo Relatório"</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Iframe Real */}
        <iframe
          src={dashboard.embed_url}
          className="w-full h-full border-0"
          allowFullScreen
          title={dashboard.title}
        />
      </div>
    </div>
  );
}