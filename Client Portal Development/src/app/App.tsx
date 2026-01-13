import { useState, lazy, Suspense } from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { DataProvider, useData } from "@/contexts/DataContext";
import { LoginPage } from "@/app/components/LoginPage";
import { Sidebar, SidebarView } from "@/app/components/Sidebar";
import { Toaster } from "@/app/components/ui/sonner";

// Lazy load dos componentes principais para melhor performance
const DashboardsView = lazy(() => import("@/app/components/DashboardsView").then(m => ({ default: m.DashboardsView })));
const FilesView = lazy(() => import("@/app/components/FilesView").then(m => ({ default: m.FilesView })));
const TeamView = lazy(() => import("@/app/components/TeamView").then(m => ({ default: m.TeamView })));
const BroadcastView = lazy(() => import("@/app/components/BroadcastView").then(m => ({ default: m.BroadcastView })));
const ReportViewer = lazy(() => import("@/app/components/ReportViewer").then(m => ({ default: m.ReportViewer })));

function AppContent() {
  const { isAuthenticated, user, loading } = useAuth();
  const { 
    dashboards, 
    documents, 
    announcements, 
    profiles, 
    companies,
    addDashboard,
    uploadDocument,
    deleteDocument,
    addAnnouncement,
    addUser,
    deleteUser,
    getUnreadAnnouncementsCount
  } = useData();
  
  const [activeView, setActiveView] = useState<SidebarView>('home');
  const [selectedDashboardId, setSelectedDashboardId] = useState<string | null>(null);

  // Se está carregando, mostrar loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não está autenticado, mostra tela de login
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Se estiver visualizando um relatório (iframe full screen)
  if (selectedDashboardId) {
    const dashboard = dashboards.find(d => d.id === selectedDashboardId);
    return (
      <Suspense fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto mb-4"></div>
            <p className="text-slate-600">Carregando relatório...</p>
          </div>
        </div>
      }>
        <ReportViewer
          dashboardId={selectedDashboardId}
          dashboard={dashboard}
          onBack={() => setSelectedDashboardId(null)}
        />
      </Suspense>
    );
  }

  // Filtrar dados baseado no role do usuário
  const userCompanyId = user?.company_id;
  const isAdmin = user?.role === 'admin';
  
  const visibleDashboards = isAdmin 
    ? dashboards 
    : dashboards.filter(d => d.company_id === userCompanyId);
  
  const visibleDocuments = isAdmin 
    ? documents 
    : documents.filter(d => d.company_id === userCompanyId);
  
  const visibleAnnouncements = isAdmin
    ? announcements
    : announcements.filter(a => !a.company_id || a.company_id === userCompanyId);

  const unreadCount = getUnreadAnnouncementsCount(userCompanyId);

  // Layout principal com sidebar
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        unreadAnnouncementsCount={unreadCount}
      />
      <main className="flex-1 overflow-y-auto ml-64">
        <Suspense fallback={
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563EB] mx-auto mb-2"></div>
              <p className="text-slate-600 text-sm">Carregando...</p>
            </div>
          </div>
        }>
          {activeView === 'home' && (
            <DashboardsView
              dashboards={visibleDashboards}
              onViewReport={setSelectedDashboardId}
              onAddDashboard={isAdmin ? addDashboard : undefined}
            />
          )}
          {activeView === 'files' && (
            <FilesView
              documents={visibleDocuments}
              onUpload={isAdmin ? uploadDocument : undefined}
              onDelete={isAdmin ? deleteDocument : undefined}
              companies={companies}
            />
          )}
          {activeView === 'team' && (
            <TeamView
              profiles={profiles}
              companies={companies}
              onAddUser={isAdmin ? addUser : undefined}
              onDeleteUser={isAdmin ? deleteUser : undefined}
            />
          )}
          {activeView === 'broadcast' && (
            <BroadcastView
              announcements={visibleAnnouncements}
              companies={companies}
              onAddAnnouncement={isAdmin ? addAnnouncement : undefined}
            />
          )}
        </Suspense>
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
