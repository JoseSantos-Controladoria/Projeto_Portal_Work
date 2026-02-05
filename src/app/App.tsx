import { useState, lazy, Suspense } from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { DataProvider, useData } from "@/contexts/DataContext";
import { LoginPage } from "@/app/components/LoginPage";
import { Sidebar, SidebarView } from "@/app/components/Sidebar";
import { Toaster } from "@/app/components/ui/sonner";

const ClientDashboard = lazy(() => import("@/app/components/ClientDashboard").then(m => ({ default: m.ClientDashboard })));
const DashboardsView = lazy(() => import("@/app/components/DashboardsView").then(m => ({ default: m.DashboardsView })));
const ReportViewer = lazy(() => import("@/app/components/ReportViewer").then(m => ({ default: m.ReportViewer })));
const ClientsListView = lazy(() => import("@/app/components/ClientsListView").then(m => ({ default: m.ClientsListView })));
const WorkspacesListView = lazy(() => import("@/app/components/WorkspacesListView").then(m => ({ default: m.WorkspacesListView })));
const UsersManagementView = lazy(() => import("@/app/components/UsersManagementView").then(m => ({ default: m.UsersManagementView }))); 
const ReportsManagementView = lazy(() => import("@/app/components/ReportsManagementView"));
const AccessLogsView = lazy(() => import("@/app/components/AccessLogsView").then(m => ({ default: m.AccessLogsView })));

function AppContent() {
  const { isAuthenticated, user, loading } = useAuth();
  const { dashboards } = useData(); 
  
  const [activeView, setActiveView] = useState<SidebarView>('reports');
  const [selectedReport, setSelectedReport] = useState<any | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Carregando sistema...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  if (selectedReport) {

    const dashboard = selectedReport || dashboards.find(d => d.id === selectedReport.id) || {
       id: selectedReport.id,
       title: 'Relatório Carregando...',
       embed_url: selectedReport.embedded_url || selectedReport.embedUrl || '',
       company_id: user?.company_id || ''
    };

    return (
      <Suspense fallback={<div className="p-10 text-center">Carregando relatório...</div>}>
        <ReportViewer
          dashboardId={String(selectedReport.id)}
          dashboard={dashboard as any}
          onBack={() => setSelectedReport(null)}
        />
      </Suspense>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
      />
      
      <main className="flex-1 overflow-y-auto bg-slate-50/50">
        <header className="px-8 py-5 bg-white border-b border-slate-100 sticky top-0 z-10 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-800 capitalize">
            {activeView === 'reports' ? 'Relatórios de Performance' : 
             activeView === 'register_report' ? 'Gestão de Relatórios' :
             activeView === 'clients' ? 'Gestão de Clientes e Grupos' : 
             activeView === 'workspaces' ? 'Gestão de Workspaces' :
             activeView === 'logs' ? 'Logs de Auditoria e Segurança' :
             activeView === 'users' ? 'Gerenciamento de Usuários' :
             'Painel'}
          </h1>
        </header>

        <div className="p-8">
          <Suspense fallback={
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          }>
            {/* 1. VISUALIZAÇÃO DE RELATÓRIOS (CORRIGIDO) */}
            {activeView === 'reports' && (
              <ClientDashboard onViewReport={(report) => setSelectedReport(report)} />
            )}

            {/* 2. GESTÃO DE RELATÓRIOS (ADMIN) */}
            {activeView === 'register_report' && (
              <ReportsManagementView />
            )}

            {/* 3. WORKSPACES */}
            {activeView === 'workspaces' && <WorkspacesListView />}

            {/* 4. CLIENTES E GRUPOS */}
            {activeView === 'clients' && <ClientsListView />}
            
            {/* 5. GESTÃO DE USUÁRIOS */}
            {activeView === 'users' && <UsersManagementView />} 

            {/* 6. LOGS DE ACESSO */}
            {activeView === 'logs' && <AccessLogsView />}

          </Suspense>
        </div>
      </main>
      <Toaster position="top-right" />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}