
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  CheckSquare, 
  AlertOctagon, 
  RefreshCw, 
  Users, 
  Settings,
  LogOut,
  Menu,
  X,
  Database,
  ShieldCheck,
  Cloud,
  Loader2
} from 'lucide-react';
import { AppRoute } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentRoute: AppRoute;
  navigate: (route: AppRoute, preserveData?: boolean) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  isSyncing?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, currentRoute, navigate, isLoggedIn, onLogout, isSyncing }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!isLoggedIn) {
    return <main className="min-h-screen bg-techBlack text-white">{children}</main>;
  }

  const NavItem = ({ route, icon: Icon, label }: { route: AppRoute; icon: any; label: string }) => {
    const active = currentRoute === route;
    return (
      <button
        onClick={() => {
            navigate(route);
            setMobileMenuOpen(false);
        }}
        className={`flex items-center w-full px-4 py-3 mb-1 rounded-lg transition-colors duration-200 ${
          active 
            ? 'bg-brightBlue/10 text-brightBlue border-l-4 border-brightBlue' 
            : 'text-steelGrey hover:bg-obsidianNavy hover:text-white'
        }`}
      >
        <Icon size={20} className="mr-3" />
        <span className="font-bold text-sm tracking-wide">{label}</span>
      </button>
    );
  };

  return (
    <div className="flex h-screen bg-techBlack text-white overflow-hidden font-sans">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-obsidianNavy border-r border-deepDivider transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="h-20 flex items-center px-6 border-b border-deepDivider">
            <div className="flex items-center space-x-2 text-brightBlue">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brightBlue to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">C</div>
              <span className="text-xl font-black tracking-tighter text-white">Complimaxx</span>
            </div>
            <button 
              className="md:hidden ml-auto text-steelGrey"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-8 px-3">
            <div className="mb-4 px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Workspace</div>
            <NavItem route={AppRoute.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
            <NavItem route={AppRoute.PROJECT_WIZARD} icon={FileText} label="Generator" />
            <NavItem route={AppRoute.OUTPUT_VIEWER} icon={FileText} label="My Projects" />
            
            <div className="mt-10 mb-4 px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Management</div>
            <NavItem route={AppRoute.CHECKLIST} icon={CheckSquare} label="Checklists" />
            <NavItem route={AppRoute.GAP_TRACKING} icon={AlertOctagon} label="Gap Tracking" />
            <NavItem route={AppRoute.RENEWAL} icon={RefreshCw} label="Renewal Mode" />
            <NavItem route={AppRoute.TEAM} icon={Users} label="Team" />
          </nav>

          <div className="p-4 border-t border-deepDivider space-y-2">
            <div className={`flex items-center px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${isSyncing ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30' : 'bg-brightBlue/10 text-brightBlue border-brightBlue/20'}`}>
               {isSyncing ? <Loader2 size={14} className="mr-2 animate-spin"/> : <Cloud size={14} className="mr-2"/>}
               {isSyncing ? 'Syncing...' : 'Cloud Connected'}
            </div>

            <button 
              onClick={() => navigate(AppRoute.SETTINGS)}
              className={`flex items-center w-full px-4 py-2 text-xs font-bold transition-colors ${currentRoute === AppRoute.SETTINGS ? 'text-white' : 'text-steelGrey hover:text-white'}`}
            >
              <Settings size={18} className="mr-3" />
              Settings
            </button>
            <button 
                onClick={onLogout}
                className="flex items-center w-full px-4 py-2 mt-2 text-xs font-bold text-riskHigh/80 hover:text-riskHigh transition-colors"
            >
              <LogOut size={18} className="mr-3" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 flex items-center justify-between px-4 border-b border-deepDivider md:hidden bg-obsidianNavy">
           <div className="flex items-center space-x-2 text-brightBlue">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brightBlue to-blue-600 flex items-center justify-center text-white font-bold">C</div>
            </div>
          <button 
            className="text-white p-2"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        </header>

        <main className="flex-1 overflow-auto bg-techBlack p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
             {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
