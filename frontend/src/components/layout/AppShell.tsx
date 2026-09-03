import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Shield,
  Archive,
  ChevronDown,
  Search,
  LogOut,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Wifi,
  Folder,
  FolderOpen,
  FileSpreadsheet,
  Scissors,
  Layers,
  Calendar,
  Truck,
  Printer,
  Sparkles,
  Activity,
  Droplet,
  CheckSquare,
  Package,
  Building2,
  Sliders,
  Library,
  CheckCheck,
  TrendingUp,
  Lock,
  LayoutDashboard,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { ThemeToggle } from '../common/ThemeToggle';
import { OmniSearchPalette } from '../common/OmniSearchPalette';
import { SidebarThemeSelector } from '../common/SidebarThemeSelector';
import {
  ALL_SYSTEM_MODULES,
  type EnterpriseModule,
} from '../../config/navigationData';

export const AppShell: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { sidebarTheme } = useThemeStore();

  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('traceflow_sidebar_collapsed') === 'true';
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user profile dropdown on outside click or escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isUserMenuOpen]);

  // Close user dropdown on route change
  useEffect(() => {
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  // Accordion State: Track open submodule IDs
  const [expandedSubmodules, setExpandedSubmodules] = useState<Record<string, boolean>>({});

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

  // Determine Active Module based on current route
  const activeModule = useMemo<EnterpriseModule>(() => {
    const currentPath = location.pathname;
    for (const mod of ALL_SYSTEM_MODULES) {
      for (const sub of mod.submodules) {
        for (const leaf of sub.children) {
          if (currentPath === leaf.path || (leaf.path !== '/' && currentPath.startsWith(leaf.path))) {
            return mod;
          }
        }
      }
    }
    // Fallback: system-admin or first module
    return ALL_SYSTEM_MODULES.find((m) => m.id === 'system-admin') || ALL_SYSTEM_MODULES[0];
  }, [location.pathname]);

  // Collect all leaf paths for the active module to compute most specific route match
  const allLeafPaths = useMemo(() => {
    const paths: string[] = [];
    for (const sub of activeModule.submodules) {
      for (const leaf of sub.children) {
        paths.push(leaf.path);
      }
    }
    return paths;
  }, [activeModule]);

  // Determine if a leaf item is the active route (supporting longest prefix match)
  const isLeafActive = (leafPath: string) => {
    const current = location.pathname;
    if (current === leafPath) return true;
    if (!current.startsWith(leafPath + '/')) return false;

    // Check if there is another leaf path with a longer/more specific match
    const hasMoreSpecific = allLeafPaths.some(
      (p) => p !== leafPath && p.length > leafPath.length && (current === p || current.startsWith(p + '/'))
    );
    return !hasMoreSpecific;
  };

  // Auto-expand ONLY the submodule containing the current active route
  useEffect(() => {
    const newSubs: Record<string, boolean> = {};

    for (const sub of activeModule.submodules) {
      let subHasActiveRoute = false;
      for (const leaf of sub.children) {
        if (isLeafActive(leaf.path)) {
          subHasActiveRoute = true;
          break;
        }
      }
      if (subHasActiveRoute) {
        newSubs[sub.id] = true;
      }
    }
    setExpandedSubmodules(newSubs);
  }, [location.pathname, activeModule, allLeafPaths]);

  const toggleSubmodule = (subId: string) => {
    setExpandedSubmodules((prev) => ({
      ...prev,
      [subId]: !prev[subId],
    }));
  };

  const toggleSidebarCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('traceflow_sidebar_collapsed', String(next));
      return next;
    });
  };

  const handleModuleClick = (mod: EnterpriseModule) => {
    navigate(mod.defaultPath);
  };

  const handleSignOut = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const getModuleIcon = (iconName: string, className: string = 'w-3.5 h-3.5') => {
    switch (iconName) {
      case 'FileSpreadsheet':
        return <FileSpreadsheet className={className} />;
      case 'TrendingUp':
        return <TrendingUp className={className} />;
      case 'Building2':
        return <Building2 className={className} />;
      case 'Layers':
        return <Layers className={className} />;
      case 'Archive':
        return <Archive className={className} />;
      case 'Calendar':
        return <Calendar className={className} />;
      case 'Scissors':
        return <Scissors className={className} />;
      case 'Printer':
        return <Printer className={className} />;
      case 'Sparkles':
        return <Sparkles className={className} />;
      case 'Truck':
        return <Truck className={className} />;
      case 'Activity':
        return <Activity className={className} />;
      case 'Droplet':
        return <Droplet className={className} />;
      case 'CheckSquare':
        return <CheckSquare className={className} />;
      case 'Package':
        return <Package className={className} />;
      case 'CheckCheck':
        return <CheckCheck className={className} />;
      case 'Sliders':
        return <Sliders className={className} />;
      case 'Library':
        return <Library className={className} />;
      case 'Lock':
        return <Lock className={className} />;
      case 'Shield':
      default:
        return <Shield className={className} />;
    }
  };

  // Breadcrumb item resolution
  const breadcrumbItems = useMemo(() => {
    const items: { label: string; path?: string }[] = [{ label: 'TraceFlow', path: '/admin/platform-overview' }];

    for (const mod of ALL_SYSTEM_MODULES) {
      if (mod.standaloneItems) {
        for (const item of mod.standaloneItems) {
          if (location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))) {
            items.push({ label: mod.title, path: mod.defaultPath });
            items.push({ label: item.title, path: item.path });
            return items;
          }
        }
      }
      for (const sub of mod.submodules) {
        for (const leaf of sub.children) {
          if (isLeafActive(leaf.path)) {
            items.push({ label: mod.title, path: mod.defaultPath });
            items.push({ label: sub.title });
            items.push({ label: leaf.title, path: leaf.path });
            return items;
          }
        }
      }
    }

    return items;
  }, [location.pathname, isLeafActive]);

  // Dynamic Sidebar Theme Classes
  const sidebarStyles = useMemo(() => {
    switch (sidebarTheme) {
      case 'navy':
        return {
          aside: 'bg-[#0f172a] border-r border-[#1e293b] text-slate-100',
          moduleHeader: 'text-slate-200 border-b border-slate-800/80',
          level2Btn: 'text-slate-300 hover:text-white hover:bg-slate-800/60',
          level3Inactive: 'text-slate-400 hover:text-white hover:bg-slate-800/70',
          activeLink: 'bg-slate-800/90 text-white font-semibold border-l-2 border-blue-500 shadow-2xs',
          footer: 'border-t border-[#1e293b] bg-[#0b1323] text-slate-400',
          collapseBtn: 'hover:bg-[#1e293b] text-slate-400 hover:text-white',
          treeLine: 'border-l border-slate-700/60',
        };
      case 'gray':
        return {
          aside:
            'bg-slate-100/90 dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-slate-100',
          moduleHeader: 'text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-zinc-800',
          level2Btn:
            'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-zinc-800',
          level3Inactive:
            'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-zinc-800',
          activeLink: 'bg-slate-200/90 dark:bg-zinc-800 text-blue-600 dark:text-blue-400 font-semibold border-l-2 border-blue-600 shadow-2xs',
          footer:
            'border-t border-slate-200 dark:border-zinc-800 bg-slate-200/50 dark:bg-zinc-950/40 text-slate-600 dark:text-slate-400',
          collapseBtn:
            'hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-600 dark:text-slate-300',
          treeLine: 'border-l border-slate-300 dark:border-zinc-700',
        };
      case 'indigo':
      default:
        return {
          aside: 'bg-[#0c1322] border-r border-[#1a2336] text-slate-100',
          moduleHeader: 'text-indigo-200 border-b border-indigo-950/60',
          level2Btn: 'text-slate-200 hover:text-white hover:bg-indigo-950/50',
          level3Inactive: 'text-slate-400 hover:text-white hover:bg-indigo-950/50',
          activeLink: 'bg-[#151f33] text-white font-semibold border-l-2 border-blue-500 shadow-2xs',
          footer: 'border-t border-[#1a2336] bg-[#080d19] text-slate-400',
          collapseBtn: 'hover:bg-[#131d31] text-slate-400 hover:text-white',
          treeLine: 'border-l border-indigo-900/60',
        };
    }
  }, [sidebarTheme]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors select-none">
      {/* Omni-Search Modal Command Palette */}
      <OmniSearchPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* ─────────────────────────────────────────────────────────────────────────
          1. TOP NAVIGATION BAR (Brand Logo + Omni Search + Profile)
         ───────────────────────────────────────────────────────────────────────── */}
      <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between z-30 shrink-0 select-none transition-colors">
        {/* Left: Brand Identity */}
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
              <span>Search POs, styles, bundles, rolls, or screens...</span>
            </div>
            <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded font-mono text-[10px] text-slate-400">
              Ctrl + K
            </kbd>
          </button>
        </div>

        {/* Right Utility & Profile Controls */}
        <div className="flex items-center gap-2">
          {/* Live WebSocket Reverb Indicator */}
          <div
            title="Real-Time WebSocket Engine Connected"
            className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-400 select-none"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <Wifi className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span className="font-mono text-[10px]">Live</span>
          </div>

          {/* Theme Switcher */}
          <ThemeToggle />

          {/* User Profile Capsule with Interactive Dropdown */}
          <div ref={userMenuRef} className="relative pl-2 border-l border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors select-none"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block leading-tight">
                  {user?.name || 'Administrator'}
                </span>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold block leading-tight">
                  {user?.primary_role || 'Super Admin'}
                </span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                  isUserMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Profile Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {user?.name || 'System Administrator'}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {user?.email || 'admin@traceflow.com'}
                  </p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold border border-blue-200 dark:border-blue-900/50">
                      {user?.emp_id || 'EMP-0001'}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                      {user?.primary_role || 'Super Admin'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5 shrink-0" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────────────────
          2. HORIZONTAL MODULE MENU BAR (ALL 15 SYSTEM MODULES DIRECTLY UNDER LOGO)
         ───────────────────────────────────────────────────────────────────────── */}
      <nav className="h-11 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 flex items-center gap-1.5 overflow-x-auto shrink-0 z-20 transition-colors scrollbar-none">
        {ALL_SYSTEM_MODULES.map((mod) => {
          const isModActive = mod.id === activeModule.id;

          return (
            <button
              key={mod.id}
              type="button"
              onClick={() => handleModuleClick(mod)}
              title={`${mod.code}: ${mod.title}`}
              className={`h-8 px-3 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 select-none ${
                isModActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/80'
              }`}
            >
              <span>{getModuleIcon(mod.iconName, 'w-3.5 h-3.5')}</span>
              <span>{mod.shortTitle}</span>
            </button>
          );
        })}
      </nav>

      {/* ─────────────────────────────────────────────────────────────────────────
          3. MAIN WORKSPACE CONTAINER (Sidebar with Active Module's Child Items)
         ───────────────────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (Renders ONLY the active module's child items) */}
        <aside
          className={`${
            isCollapsed ? 'w-16' : 'w-64'
          } ${sidebarStyles.aside} flex flex-col shrink-0 transition-all duration-200 z-20 select-none`}
        >
          {/* Active Module Header */}
          <div className="px-3 py-2.5 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
            {!isCollapsed ? (
              <div className="flex items-center gap-2 truncate">
                <span className="p-1.5 rounded-lg bg-blue-600 text-white shadow-xs">
                  {getModuleIcon(activeModule.iconName, 'w-4 h-4')}
                </span>
                <div className="truncate">
                  <span className="text-xs font-bold block leading-tight truncate text-slate-100">
                    {activeModule.title}
                  </span>
                  <span className="font-mono text-[9px] text-blue-400 dark:text-blue-300 font-semibold block leading-tight mt-0.5">
                    {activeModule.code} Workspace
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-full flex justify-center text-blue-400 py-1" title={`${activeModule.code}: ${activeModule.title}`}>
                <span className="p-1.5 rounded-lg bg-blue-600 text-white shadow-xs">
                  {getModuleIcon(activeModule.iconName, 'w-4 h-4')}
                </span>
              </div>
            )}
          </div>

          {/* Child Items of Active Module */}
          <div className="flex-1 overflow-y-auto px-2 py-3 space-y-2">
            {/* Direct Top-Level Standalone Links (e.g. Dashboard) */}
            {activeModule.standaloneItems && activeModule.standaloneItems.length > 0 && (
              <div className="space-y-1 pb-2 mb-2 border-b border-black/10 dark:border-white/10">
                {activeModule.standaloneItems.map((item) => {
                  const isActive =
                    location.pathname === item.path ||
                    (item.path !== '/' && location.pathname.startsWith(item.path));

                  return !isCollapsed ? (
                    <Link
                      key={item.id}
                      to={item.path}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-semibold transition-all ${
                        isActive
                          ? sidebarStyles.activeLink
                          : sidebarStyles.level3Inactive
                      }`}
                    >
                      <LayoutDashboard className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                      <span className="truncate">{item.title}</span>
                    </Link>
                  ) : (
                    <Link
                      key={item.id}
                      to={item.path}
                      title={item.title}
                      className={`flex justify-center p-2 rounded-md transition-colors ${
                        isActive
                          ? 'bg-slate-800 text-blue-400 shadow-2xs border border-slate-700/60'
                          : 'text-slate-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                    </Link>
                  );
                })}
              </div>
            )}

            {activeModule.submodules.map((sub) => {
              const isSubExpanded = Boolean(expandedSubmodules[sub.id]);

              return (
                <div key={sub.id} className="space-y-1">
                  {/* Level 2: Process Sub-Category Header */}
                  {!isCollapsed ? (
                    <button
                      type="button"
                      onClick={() => toggleSubmodule(sub.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider transition-colors ${sidebarStyles.level2Btn}`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        {isSubExpanded ? (
                          <FolderOpen className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                        ) : (
                          <Folder className="w-3.5 h-3.5 shrink-0 opacity-60" />
                        )}
                        <span className="truncate">{sub.title}</span>
                      </div>
                      <ChevronRight
                        className={`w-3.5 h-3.5 opacity-60 transition-transform ${
                          isSubExpanded ? 'rotate-90' : ''
                        }`}
                      />
                    </button>
                  ) : null}

                  {/* Level 3: Actionable Screens */}
                  {(isCollapsed || isSubExpanded) && (
                    <div className={!isCollapsed ? `ml-3 pl-2.5 space-y-0.5 ${sidebarStyles.treeLine}` : 'space-y-1'}>
                      {sub.children.map((leaf) => {
                        const isActive = isLeafActive(leaf.path);

                        return !isCollapsed ? (
                          <Link
                            key={leaf.id}
                            to={leaf.path}
                            className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-colors ${
                              isActive
                                ? sidebarStyles.activeLink
                                : sidebarStyles.level3Inactive
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                isActive ? 'bg-white' : 'bg-slate-400 opacity-60'
                              }`}
                            ></span>
                            <span className="truncate">{leaf.title}</span>
                          </Link>
                        ) : (
                          /* Collapsed Leaf Item */
                          <Link
                            key={leaf.id}
                            to={leaf.path}
                            title={leaf.title}
                            className={`flex justify-center p-2 rounded-lg transition-colors ${
                              isActive
                                ? 'bg-blue-600 text-white'
                                : 'text-slate-400 hover:text-white hover:bg-white/10'
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : 'bg-slate-400'}`}></span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Sidebar Footer: Theme Swatches + Collapse Toggle */}
          <div className={`p-2.5 ${sidebarStyles.footer} flex items-center justify-between`}>
            {/* 3 Sidebar Palettes Switcher */}
            <SidebarThemeSelector isCollapsed={isCollapsed} />

            {/* Collapse / Expand Button */}
            <button
              type="button"
              onClick={toggleSidebarCollapse}
              className={`p-1.5 rounded transition-colors flex items-center gap-1.5 ${sidebarStyles.collapseBtn}`}
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? (
                <PanelLeftOpen className="w-4 h-4" />
              ) : (
                <>
                  <PanelLeftClose className="w-4 h-4" />
                  <span className="text-[11px] font-medium">Collapse</span>
                </>
              )}
            </button>
          </div>
        </aside>

        {/* Main Dedicated Workspace Viewport */}
        <main className="flex-1 flex flex-col overflow-hidden bg-slate-100/60 dark:bg-slate-950 relative">
          {/* Top Breadcrumb Bar (Pinned) */}
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
          <div className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
