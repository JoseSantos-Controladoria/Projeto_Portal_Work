import { cn } from "@/app/components/ui/utils";
import { Button } from "@/app/components/ui/button";
import { 
  LogOut, 
  LayoutGrid, // Mantive apenas para os menus internos
  BarChart3,
  Users,
  Building2,
  ScrollText,
  Briefcase,
  FilePlus,
  ShieldCheck
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export type SidebarView = 'reports' | 'register_report' | 'workspaces' | 'clients' | 'users' | 'logs';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: SidebarView) => void;
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const { logout, user } = useAuth();

  const handleNavigation = (view: SidebarView) => {
    onViewChange(view);
  };

  const NavItem = ({ id, label, icon: Icon }: { id: SidebarView, label: string, icon: any }) => {
    const isActive = activeView === id;
    return (
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start mb-1 transition-all duration-200 h-10",
          isActive 
            ? "bg-blue-600 text-white hover:bg-blue-700 hover:text-white shadow-md shadow-blue-900/20" 
            : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
        )}
        onClick={() => handleNavigation(id)}
      >
        <Icon className={cn("w-4 h-4 mr-3", isActive ? "text-white" : "text-slate-500")} />
        <span className="text-sm font-medium">{label}</span>
      </Button>
    );
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen transition-all duration-300 shadow-xl z-50 border-r border-slate-800">
      
{/* --- HEADER COM LOGO --- */}
<div className="p-6 flex items-center gap-3 border-b border-slate-800/50">
  
  <div className="relative w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden shadow-lg shadow-blue-900/20">
    {/* ATUALIZADO AQUI: */}
    <img 
      src="/images/work-on.png"  // O caminho começa com / (que representa a pasta public)
      alt="Logo Work On" 
      className="w-8 h-8 object-contain" 
    />
  </div>

  <div>
    <h2 className="font-bold text-white tracking-tight leading-tight">Portal Work</h2>
    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
      Work On • BI
    </p>
  </div>
</div>

      {/* Navegação Principal */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto custom-scrollbar space-y-8">
        
        {/* GRUPO 1: OPERACIONAL */}
        <div>
          <p className="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
            <BarChart3 className="w-3 h-3" />
            Operacional
          </p>
          <div className="space-y-1">
            <NavItem id="reports" label="Meus Relatórios" icon={LayoutGrid} />
          </div>
        </div>

        {/* GRUPO 2: CONFIGURAÇÕES */}
        <div>
          <p className="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
            <ShieldCheck className="w-3 h-3" />
            Configurações
          </p>
          <div className="space-y-1">
            <NavItem id="register_report" label="Cadastro de Relatório" icon={FilePlus} />
            <NavItem id="workspaces" label="Workspaces Power BI" icon={Briefcase} />
            <NavItem id="clients" label="Clientes e Grupos" icon={Building2} />
            <NavItem id="users" label="Gerenciar Usuários" icon={Users} />
            <NavItem id="logs" label="Logs de Acesso" icon={ScrollText} />
          </div>
        </div>

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
              {user?.role === 'admin' ? 'Administrador' : 'Analista'}
            </p>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start text-slate-400 hover:text-red-400 hover:bg-red-950/10 transition-colors h-9"
          onClick={logout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          <span className="text-sm">Sair do Sistema</span>
        </Button>
      </div>
    </aside>
  );
}