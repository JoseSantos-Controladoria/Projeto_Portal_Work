import { useState, lazy, Suspense } from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { DataProvider, useData } from "@/contexts/DataContext";
import { LoginPage } from "@/app/components/LoginPage";
import { Sidebar, SidebarView } from "@/app/components/Sidebar";
import { Toaster } from "@/app/components/ui/sonner";

// Lazy loading dos componentes
const DashboardsView = lazy(() => import("@/app/components/DashboardsView").then(m => ({ default: m.DashboardsView })));
const ReportViewer = lazy(() => import("@/app/components/ReportViewer").then(m => ({ default: m.ReportViewer })));
// ADICIONADO: Import do ClientsListView
const ClientsListView = lazy(() => import("@/app/components/ClientsListView").then(m => ({ default: m.ClientsListView })));

function AppContent() {
  const { isAuthenticated, user, loading } = useAuth();
  const { dashboards } = useData();
  
  const [activeView, setActiveView] = useState<SidebarView>('reports');
  const [selectedDashboardId, setSelectedDashboardId] = useState<string | null>(null);

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

  if (selectedDashboardId) {
    const dashboard = dashboards.find(d => d.id === selectedDashboardId);
    return (
      <Suspense fallback={<div className="p-10 text-center">Carregando relatório...</div>}>
        <ReportViewer
          dashboardId={selectedDashboardId}
          dashboard={dashboard}
          onBack={() => setSelectedDashboardId(null)}
        />
      </Suspense>
    );
  }

  const userCompanyId = user?.company_id;
  const isAdmin = user?.role === 'admin';
  const visibleDashboards = isAdmin ? dashboards : dashboards.filter(d => d.company_id === userCompanyId);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
      />
      
      <main className="flex-1 overflow-y-auto bg-slate-50/50">
        {/* Header Simples */}
        <header className="px-8 py-5 bg-white border-b border-slate-100 sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-slate-800 capitalize">
            {activeView === 'reports' ? 'Relatórios de Performance' : 
             activeView === 'clients' ? 'Gestão de Clientes e Grupos' : 
             activeView === 'logs' ? 'Logs de Auditoria' :
             activeView}
          </h1>
        </header>

        <div className="p-8">
          <Suspense fallback={
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          }>
            {/* View de Relatórios */}
            {activeView === 'reports' && (
              <DashboardsView
                dashboards={visibleDashboards}
                onViewReport={setSelectedDashboardId}
              />
            )}

            {/* ADICIONADO: View de Clientes e Grupos */}
            {activeView === 'clients' && (
              <ClientsListView />
            )}
            
            {/* Placeholders */}
            {activeView !== 'reports' && activeView !== 'clients' && (
              <div className="flex flex-col items-center justify-center h-96 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl bg-white">
                <p className="text-lg font-medium text-slate-600">Em desenvolvimento</p>
                <p className="text-sm mt-2">Módulo: <span className="font-mono text-blue-600">{activeView}</span></p>
              </div>
            )}
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