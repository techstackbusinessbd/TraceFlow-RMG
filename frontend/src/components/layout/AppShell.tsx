import React, { useState, useEffect, useMemo } from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Shield,
  Factory,
  ShoppingBag,
  Archive,
  ChevronDown,
  Search,
  LogOut,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Wifi,
  CheckCircle2,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { ThemeToggle } from '../common/ThemeToggle';
import { OmniSearchPalette } from '../common/OmniSearchPalette';
import {
  ENTERPRISE_DOMAINS_CONFIG,
  type EnterpriseDomain,
} from '../../config/navigationData';

export const AppShell: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('traceflow_sidebar_collapsed') === 'true';
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDomainMenuOpen, setIsDomainMenuOpen] = useState(false);

  // Global Ctrl + K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Determine active domain based on current URL
  const activeDomain: EnterpriseDomain = useMemo(() => {
    const currentPath = location.pathname;

    for (const domain of ENTERPRISE_DOMAINS_CONFIG) {
      for (const mod of domain.modules) {
        for (const sub of mod.submodules) {
          for (const leaf of sub.children) {
            if (currentPath === leaf.path || (leaf.path !== '/' && currentPath.startsWith(leaf.path))) {
              return domain;
            }
          }
        }
      }
    }

    // Default to Governance & Admin for admin overview or fallback
    return (
      ENTERPRISE_DOMAINS_CONFIG.find((d) => d.id === 'governance') ||
      ENTERPRISE_DOMAINS_CONFIG[0]
    );
  }, [location.pathname]);

  const handleDomainSelect = (domain: EnterpriseDomain) => {
    setIsDomainMenuOpen(false);
    navigate(domain.defaultPath);
  };

  const toggleSidebarCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('traceflow_sidebar_collapsed', String(next));
      return next;
    });
  };

  const handleSignOut = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const getDomainIcon = (iconName: string, className: string = 'w-4 h-4') => {
    switch (iconName) {
      case 'ShoppingBag':
        return <ShoppingBag className={className} />;
      case 'Factory':
        return <Factory className={className} />;
      case 'Archive':
        return <Archive className={className} />;
      case 'ShieldCheck':
      default:
        return <Shield className={className} />;
    }
  };

  // Breadcrumb item resolution
  const breadcrumbItems = useMemo(() => {
    const items: { label: string; path?: string }[] = [
      { label: 'TraceFlow', path: activeDomain.defaultPath },
      { label: activeDomain.title },
    ];

    for (const mod of activeDomain.modules) {
      for (const sub of mod.submodules) {
        for (const leaf of sub.children) {
          if (location.pathname === leaf.path || (leaf.path !== '/' && location.pathname.startsWith(leaf.path))) {
            items.push({ label: mod.title });
            items.push({ label: leaf.title, path: leaf.path });
            return items;
          }
        }
      }
    }

    return items;
  }, [activeDomain, location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      {/* Omni-Search Modal Command Palette */}
      <OmniSearchPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* ─────────────────────────────────────────────────────────────────────────
          1. TOP NAVIGATION BAR (Clean, Spacious, Microsoft Dynamics 365 Architecture)
         ───────────────────────────────────────────────────────────────────────── */}
      <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between z-30 shrink-0 select-none transition-colors">
        {/* Left: Brand Logo & Workspace Title */}
        <div className="flex items-center gap-3">
          <Link
            to="/admin/platform-overview"
            className="flex items-center gap-2.5 hover:opacity-90 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white block leading-none">
                TraceFlow RMG
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium block mt-0.5">
                Precision Garment Traceability
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Global Omni-Search Bar (Ctrl + K) */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="w-full h-9 px-3 bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 rounded-lg flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 transition-colors shadow-xs"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search modules, POs, bundles, or screens...</span>
            </div>
            <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded font-mono text-[10px] text-slate-400">
              Ctrl + K
            </kbd>
          </button>
        </div>

        {/* Right Utility & Profile Controls */}
        <div className="flex items-center gap-2.5">
          {/* Live WebSocket Reverb Indicator */}
          <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <Wifi className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span className="font-mono text-[10px]">Reverb Live</span>
          </div>

          {/* Theme Switcher */}
          <ThemeToggle />

          {/* User Profile Capsule */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="hidden xl:block text-left">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block leading-tight truncate max-w-[130px]">
                {user?.name || 'Administrator'}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block leading-tight">
                {user?.primary_role || 'Staff'}
              </span>
            </div>
          </div>

          {/* Sign Out Button - STRICT SOLID COLOR */}
          <button
            type="button"
            onClick={handleSignOut}
            title="Sign Out"
            className="btn-solid-red text-xs py-1.5 px-2.5 ml-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────────────────
          2. MAIN WORKSPACE CONTAINER (Sidebar + Workspace Viewport)
         ───────────────────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (Collapsible & Domain-Driven) */}
        <aside
          className={`${
            isCollapsed ? 'w-16' : 'w-64'
          } bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 transition-all duration-200 z-20 select-none`}
        >
          {/* Top Domain Switcher Area */}
          <div className="p-3 border-b border-slate-200 dark:border-slate-800 relative">
            <button
              type="button"
              onClick={() => setIsDomainMenuOpen(!isDomainMenuOpen)}
              className={`w-full p-2 rounded-lg border transition-all flex items-center ${
                isCollapsed ? 'justify-center' : 'justify-between'
              } ${
                isDomainMenuOpen
                  ? 'bg-blue-50 border-blue-300 dark:bg-blue-950/40 dark:border-blue-700 text-blue-700 dark:text-blue-400'
                  : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <div className="p-1 rounded bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-700 shadow-xs shrink-0">
                  {getDomainIcon(activeDomain.iconName, 'w-4 h-4')}
                </div>
                {!isCollapsed && (
                  <div className="text-left truncate">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 block leading-tight">
                      Domain
                    </span>
                    <span className="text-xs font-bold block truncate leading-tight mt-0.5">
                      {activeDomain.shortTitle}
                    </span>
                  </div>
                )}
              </div>
              {!isCollapsed && (
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                    isDomainMenuOpen ? 'rotate-180 text-blue-600' : ''
                  }`}
                />
              )}
            </button>

            {/* Domain Selection Flyout Menu */}
            {isDomainMenuOpen && (
              <div className="absolute top-full left-2 right-2 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Select Business Domain
                </div>
                {ENTERPRISE_DOMAINS_CONFIG.map((dom) => {
                  const isActive = dom.id === activeDomain.id;
                  return (
                    <button
                      key={dom.id}
                      type="button"
                      onClick={() => handleDomainSelect(dom)}
                      className={`w-full text-left p-2 rounded-lg text-xs flex items-start gap-2.5 transition-colors ${
                        isActive
                          ? 'bg-blue-600 text-white font-semibold shadow-xs'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span
                        className={`p-1 rounded mt-0.5 shrink-0 ${
                          isActive
                            ? 'bg-blue-700 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}
                      >
                        {getDomainIcon(dom.iconName, 'w-3.5 h-3.5')}
                      </span>
                      <div className="truncate">
                        <div className="font-semibold">{dom.title}</div>
                        <div
                          className={`text-[10px] leading-tight line-clamp-1 ${
                            isActive ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'
                          }`}
                        >
                          {dom.shortTitle}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar Menu Items for Selected Domain */}
          <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
            {activeDomain.modules.map((mod) => (
              <div key={mod.id} className="space-y-1">
                {!isCollapsed && (
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center justify-between">
                    <span className="truncate">{mod.title}</span>
                    <span className="font-mono text-[9px] text-slate-400/80">{mod.code}</span>
                  </div>
                )}

                {mod.submodules.map((sub) => (
                  <div key={sub.id} className="space-y-0.5">
                    {sub.children.map((leaf) => {
                      const isActive =
                        location.pathname === leaf.path ||
                        (leaf.path !== '/' && location.pathname.startsWith(leaf.path));

                      return (
                        <Link
                          key={leaf.id}
                          to={leaf.path}
                          title={isCollapsed ? leaf.title : undefined}
                          className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                            isActive
                              ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 font-semibold border-l-2 border-l-blue-600'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                          } ${isCollapsed ? 'justify-center' : ''}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              isActive ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                            }`}
                          ></span>
                          {!isCollapsed && <span className="truncate">{leaf.title}</span>}
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Sidebar Footer: Collapse Toggle + Telemetry Badge */}
          <div className="p-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex items-center justify-between text-[11px] text-slate-500">
            <button
              type="button"
              onClick={toggleSidebarCollapse}
              className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors flex items-center gap-1.5"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? (
                <PanelLeftOpen className="w-4 h-4" />
              ) : (
                <>
                  <PanelLeftClose className="w-4 h-4" />
                  <span className="text-[11px]">Collapse</span>
                </>
              )}
            </button>

            {!isCollapsed && (
              <span className="font-mono text-[9px] text-slate-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span>PostgreSQL 17</span>
              </span>
            )}
          </div>
        </aside>

        {/* Main Dedicated Workspace Viewport */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-slate-100/60 dark:bg-slate-950 relative">
          {/* Top Breadcrumb Bar */}
          <div className="h-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 shrink-0 select-none">
            {breadcrumbItems.map((bc, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />}
                {bc.path ? (
                  <Link
                    to={bc.path}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate"
                  >
                    {bc.label}
                  </Link>
                ) : (
                  <span className="text-slate-800 dark:text-slate-200 font-semibold truncate">
                    {bc.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Child Full-Screen Viewport - STRICT NO MODALS */}
          <div className="flex-1 p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
