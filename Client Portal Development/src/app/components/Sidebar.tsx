import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { 
  BarChart3, 
  LayoutDashboard, 
  LogOut, 
  User,
  FileText,
  Users,
  Megaphone,
  Home
} from 'lucide-react';

export type SidebarView = 
  | 'home' 
  | 'files' 
  | 'team' 
  | 'broadcast';

interface SidebarProps {
  activeView: SidebarView;
  onViewChange: (view: SidebarView) => void;
  unreadAnnouncementsCount?: number;
}

export function Sidebar({ activeView, onViewChange, unreadAnnouncementsCount = 0 }: SidebarProps) {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';

  const getButtonClass = (view: SidebarView) => {
    const baseClass = "w-full justify-start gap-3 text-slate-300 hover:bg-slate-800 hover:text-white";
    const activeClass = "bg-[#2563EB] text-white hover:bg-[#1d4ed8] hover:text-white";
    return activeView === view ? activeClass : baseClass;
  };

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 z-50">
      {/* Logo e Nome */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#2563EB] rounded-lg flex items-center justify-center">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-lg">TradeData</h2>
            <p className="text-xs text-slate-400">Manager</p>
          </div>
        </div>
      </div>

      {/* Perfil do Usuário */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-slate-300" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 capitalize">
              {user?.role === 'admin' ? 'Administrador' : 'Cliente'}
            </p>
          </div>
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {/* HOME */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-3">
            HOME
          </p>
          <Button
            variant="ghost"
            className={getButtonClass('home')}
            onClick={() => onViewChange('home')}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboards
          </Button>
        </div>

        {/* GESTÃO */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-3">
            GESTÃO
          </p>
          <Button
            variant="ghost"
            className={getButtonClass('files')}
            onClick={() => onViewChange('files')}
          >
            <FileText className="w-5 h-5" />
            Arquivos
          </Button>
          <Button
            variant="ghost"
            className={getButtonClass('team')}
            onClick={() => onViewChange('team')}
          >
            <Users className="w-5 h-5" />
            Equipe
          </Button>
        </div>

        {/* COMUNICAÇÃO */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-3">
            COMUNICAÇÃO
          </p>
          <Button
            variant="ghost"
            className={getButtonClass('broadcast')}
            onClick={() => onViewChange('broadcast')}
          >
            <Megaphone className="w-5 h-5" />
            Mural
            {unreadAnnouncementsCount > 0 && (
              <Badge 
                variant="destructive" 
                className="ml-auto h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {unreadAnnouncementsCount > 9 ? '9+' : unreadAnnouncementsCount}
              </Badge>
            )}
          </Button>
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-700">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-slate-300 hover:bg-red-600/10 hover:text-red-400"
          onClick={logout}
        >
          <LogOut className="w-5 h-5" />
          Sair
        </Button>
      </div>
    </div>
  );
}
