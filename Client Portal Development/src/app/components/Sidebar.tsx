import { cn } from "@/app/components/ui/utils";
import { Button } from "@/app/components/ui/button";
import { 
  LogOut, 
  Settings,
  LayoutGrid,
  BarChart3,
  Users,
  Building2,
  ScrollText,
  Briefcase
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Definindo os IDs das novas views
export type SidebarView = 'reports' | 'workspaces' | 'clients' | 'users' | 'logs' | 'settings';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: SidebarView) => void;
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const { logout, user } = useAuth();

  const menuItems = [
    { id: 'reports', label: 'Relatórios', icon: BarChart3 },
    { id: 'workspaces', label: 'Workspaces', icon: Briefcase },
    { id: 'clients', label: 'Clientes e Grupos', icon: Building2 },
    { id: 'users', label: 'Usuários', icon: Users },
    { id: 'logs', label: 'Logs de Acesso', icon: ScrollText },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen transition-all duration-300 shadow-xl z-50">
      {/* Header / Logo */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-800/50">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20">
          <LayoutGrid className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="font-bold text-white tracking-tight">Portal Work On</h2>
          <p className="text-xs text-slate-500 font-medium">Portal para o BI</p>
        </div>
      </div>

      {/* Navegação Principal */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
        <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Menu Principal
        </p>
        
        {menuItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "w-full justify-start mb-1 transition-all duration-200",
                isActive 
                  ? "bg-blue-600 text-white hover:bg-blue-700 hover:text-white shadow-md shadow-blue-900/20" 
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              )}
              onClick={() => onViewChange(item.id as SidebarView)}
            >
              <item.icon className={cn("w-5 h-5 mr-3", isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300")} />
              {item.label}
            </Button>
          );
        })}
      </nav>

      {/* Footer / User Profile */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/30">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-8 h-8 rounded-full bg-blue-900/50 border border-blue-700/30 flex items-center justify-center text-xs font-bold text-blue-400">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.name || 'Usuário'}
            </p>
            <p className="text-xs text-slate-500 truncate">
              {user?.email}
            </p>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start text-slate-400 hover:text-red-400 hover:bg-red-950/10 transition-colors"
          onClick={logout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sair do Sistema
        </Button>
      </div>
    </aside>
  );
}