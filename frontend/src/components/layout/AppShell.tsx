import React, { useMemo } from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Shield,
  Database,
  ShoppingBag,
  CalendarRange,
  Scissors,
  Palette,
  Sparkles,
  Truck,
  Layers,
  CheckCircle2,
  Droplets,
  CheckSquare,
  Package,
  Archive,
  BarChart3,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { MAIN_MODULES_CONFIG, type MainModuleItem } from '../../config/navigationData';
import { useAuthStore } from '../../store/authStore';
import { ThemeToggle } from '../common/ThemeToggle';

// Map icon names to Lucide icons
const ICON_MAP: Record<string, React.ElementType> = {
  Shield,
  Database,
  ShoppingBag,
  CalendarRange,
  Scissors,
  Palette,
  Sparkles,
  Truck,
  Layers,
  CheckCircle2,
  Droplets,
  CheckSquare,
  Package,
  Archive,
  BarChart3,
};

export const AppShell: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  // Determine active module based on current pathname
  const activeModule: MainModuleItem = useMemo(() => {
    const currentPath = location.pathname;
    const found = MAIN_MODULES_CONFIG.find((m) => {
      if (currentPath.startsWith(`/${m.id}`)) return true;
      return m.submodules.some((sub) =>
        sub.children.some((child) => currentPath.startsWith(child.path))
      );
    });
    return found || MAIN_MODULES_CONFIG[0];
  }, [location.pathname]);

  const handleModuleClick = (moduleItem: MainModuleItem) => {
    navigate(moduleItem.defaultPath);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Find active leaf item for breadcrumbs
  const activeLeafItem = useMemo(() => {
    for (const sub of activeModule.submodules) {
      for (const child of sub.children) {
        if (location.pathname === child.path) {
          return { group: sub.title, item: child.title };
        }
      }
    }
    return null;
  }, [activeModule, location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col text-slate-900 dark:text-slate-100 transition-colors">
      {/* 1. TOPBAR: Brand & 15 Horizontal Modules */}
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 justify-between gap-4 sticky top-0 z-50 transition-colors shadow-sm">
        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-md">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white block leading-none">
              TraceFlow RMG
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              Precision Garment Traceability
            </span>
          </div>
        </div>

        {/* 15 Horizontal Module Selectors */}
        <nav className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none max-w-5xl">
          {MAIN_MODULES_CONFIG.map((mod) => {
            const Icon = ICON_MAP[mod.iconName] || Shield;
            const isActive = activeModule.id === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => handleModuleClick(mod)}
                title={mod.title}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{mod.shortTitle}</span>
              </button>
            );
          })}
        </nav>

        {/* Theme Toggle, User Info & Crisp Solid Red Logout Button */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Light / Dark Mode Toggle Button */}
          <ThemeToggle />

          <div className="text-right hidden sm:block">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block leading-tight">
              {user?.name || 'Administrator'}
            </span>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono font-medium">
              {user?.primary_role || 'Super Admin'}
            </span>
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="btn-solid-red text-xs py-1.5 px-3"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* 2. BODY CONTAINER: Sidebar + Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* CONTEXTUAL 2-LEVEL LEFT SIDEBAR */}
        <aside className="w-64 bg-white dark:bg-slate-900/90 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto transition-colors">
          {/* Active Module Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              <span>{activeModule.code}</span>
              <span>•</span>
              <span className="truncate">{activeModule.title}</span>
            </div>
          </div>

          {/* Submodule Groups & Leaf Links */}
          <div className="p-3 space-y-6 flex-1">
            {activeModule.submodules.map((group) => (
              <div key={group.id} className="space-y-1">
                {/* Level 1: Category Header */}
                <h3 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 mb-2">
                  {group.title}
                </h3>
                {/* Level 2: Direct Page Links */}
                <div className="space-y-0.5">
                  {group.children.map((item) => {
                    const isItemActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.id}
                        to={item.path}
                        className={`flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium transition-colors ${
                          isItemActive
                            ? 'bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-semibold border-l-2 border-blue-600 dark:border-blue-500 shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <span className="truncate">{item.title}</span>
                        {item.badge && (
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded font-mono">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* System Footer Bar */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 flex items-center justify-between bg-slate-50/50 dark:bg-transparent">
            <span>PostgreSQL 17 • Redis 7</span>
            <span className="text-emerald-600 dark:text-emerald-500 font-semibold">Live System</span>
          </div>
        </aside>

        {/* 3. MAIN CONTENT VIEWPORT (STRICT NO MODALS) */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-slate-50 dark:bg-slate-950 transition-colors">
          {/* Breadcrumb Navigation Bar */}
          <div className="h-10 border-b border-slate-200 dark:border-slate-800/80 bg-slate-100/60 dark:bg-slate-900/40 flex items-center px-6 text-xs text-slate-500 dark:text-slate-400 shrink-0">
            <span className="text-slate-400 dark:text-slate-500">TraceFlow</span>
            <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-slate-400 dark:text-slate-600" />
            <span className="text-slate-700 dark:text-slate-300 font-medium">{activeModule.title}</span>
            {activeLeafItem && (
              <>
                <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-slate-400 dark:text-slate-600" />
                <span className="text-slate-500 dark:text-slate-400">{activeLeafItem.group}</span>
                <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-slate-400 dark:text-slate-600" />
                <span className="text-blue-600 dark:text-blue-400 font-semibold">{activeLeafItem.item}</span>
              </>
            )}
          </div>

          {/* Dedicated Full-Screen Page Container */}
          <div className="flex-1 p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
