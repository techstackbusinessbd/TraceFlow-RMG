import React, { useState, useEffect, useMemo } from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Shield,
  Factory,
  ShoppingBag,
  ShieldCheck,
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
  CheckCheck,
  TrendingUp,
  Lock,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { ThemeToggle } from '../common/ThemeToggle';
import { OmniSearchPalette } from '../common/OmniSearchPalette';
import { SidebarThemeSelector } from '../common/SidebarThemeSelector';
import {
  ENTERPRISE_NAV_SECTIONS,
  type NavSection,
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

  // Accordion State: Track open module IDs and open submodule IDs
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
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

  // Determine Active Top-Level Module Section based on current route
  const activeSection = useMemo<NavSection>(() => {
    const currentPath = location.pathname;
    for (const sec of ENTERPRISE_NAV_SECTIONS) {
      for (const mod of sec.modules) {
        for (const sub of mod.submodules) {
          for (const leaf of sub.children) {
            if (currentPath === leaf.path || (leaf.path !== '/' && currentPath.startsWith(leaf.path))) {
              return sec;
            }
          }
        }
      }
    }
    // Fallback: Quality & Governance or first section
    return ENTERPRISE_NAV_SECTIONS.find((s) => s.id === 'quality-governance') || ENTERPRISE_NAV_SECTIONS[0];
  }, [location.pathname]);

  // Auto-expand parent module and submodule for current route
  useEffect(() => {
    const currentPath = location.pathname;
    const newMods: Record<string, boolean> = { ...expandedModules };
    const newSubs: Record<string, boolean> = { ...expandedSubmodules };

    for (const mod of activeSection.modules) {
      let modHasActiveRoute = false;
      for (const sub of mod.submodules) {
        let subHasActiveRoute = false;
        for (const leaf of sub.children) {
          if (currentPath === leaf.path || (leaf.path !== '/' && currentPath.startsWith(leaf.path))) {
            modHasActiveRoute = true;
            subHasActiveRoute = true;
          }
        }
        if (subHasActiveRoute) {
          newSubs[sub.id] = true;
        }
      }
      if (modHasActiveRoute) {
        newMods[mod.id] = true;
      }
    }
    setExpandedModules(newMods);
    setExpandedSubmodules(newSubs);
  }, [location.pathname, activeSection]);

  const toggleModule = (modId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [modId]: !prev[modId],
    }));
  };

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

  const handleSectionClick = (sec: NavSection) => {
    const firstLeaf = sec.modules[0]?.submodules[0]?.children[0];
    if (firstLeaf) {
      navigate(firstLeaf.path);
    }
  };

  const handleSignOut = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const getSectionIcon = (secId: string, className: string = 'w-4 h-4') => {
    switch (secId) {
      case 'merchandising-commercial':
        return <ShoppingBag className={className} />;
      case 'supply-chain-warehouse':
        return <Layers className={className} />;
      case 'production-execution':
        return <Factory className={className} />;
      case 'quality-governance':
      default:
        return <ShieldCheck className={className} />;
    }
  };

  const getModuleIcon = (iconName: string, className: string = 'w-4 h-4') => {
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

    for (const sec of ENTERPRISE_NAV_SECTIONS) {
      for (const mod of sec.modules) {
        for (const sub of mod.submodules) {
          for (const leaf of sub.children) {
            if (location.pathname === leaf.path || (leaf.path !== '/' && location.pathname.startsWith(leaf.path))) {
              items.push({ label: sec.title });
              items.push({ label: mod.title });
              items.push({ label: leaf.title, path: leaf.path });
              return items;
            }
          }
        }
      }
    }

    return items;
  }, [location.pathname]);

  // Dynamic Sidebar Theme Classes
  const sidebarStyles = useMemo(() => {
    switch (sidebarTheme) {
      case 'navy':
        return {
          aside: 'bg-[#0f172a] border-r border-[#1e293b] text-slate-100',
          sectionHeader: 'text-slate-400 border-b border-slate-800/80',
          level1Btn: 'text-slate-300 hover:text-white hover:bg-slate-800/80',
          level2Btn: 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50',
          level3Inactive: 'text-slate-400 hover:text-white hover:bg-slate-800/70',
          activeLink: 'bg-blue-600 text-white font-semibold shadow-xs',
          footer: 'border-t border-[#1e293b] bg-[#0b1323] text-slate-400',
          collapseBtn: 'hover:bg-[#1e293b] text-slate-400 hover:text-white',
          treeLine: 'border-l border-slate-700/60',
        };
      case 'gray':
        return {
          aside:
            'bg-slate-100/90 dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-slate-100',
          sectionHeader: 'text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-zinc-800',
          level1Btn:
            'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200/80 dark:hover:bg-zinc-800',
          level2Btn:
            'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-zinc-800/60',
          level3Inactive:
            'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-zinc-800',
          activeLink: 'bg-blue-600 text-white font-semibold shadow-xs',
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
          sectionHeader: 'text-indigo-400/90 border-b border-indigo-950/60',
          level1Btn: 'text-slate-200 hover:text-white hover:bg-indigo-950/60',
          level2Btn: 'text-indigo-300/80 hover:text-indigo-200 hover:bg-indigo-950/40',
          level3Inactive: 'text-slate-400 hover:text-white hover:bg-indigo-950/50',
          activeLink: 'bg-blue-600 text-white font-semibold shadow-xs',
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
          <div className="relative pl-2 border-l border-slate-200 dark:border-slate-800">
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

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-between p-2 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <span>Sign Out of TraceFlow</span>
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Sign Out Icon Button */}
          <button
            type="button"
            onClick={handleSignOut}
            title="Sign Out"
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:border-rose-200 dark:hover:border-rose-900/50 transition-colors flex items-center justify-center ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────────────────
          2. HORIZONTAL MODULE MENU BAR (Directly Below Logo & Header)
         ───────────────────────────────────────────────────────────────────────── */}
      <nav className="h-11 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center gap-2 overflow-x-auto shrink-0 z-20 transition-colors">
        {ENTERPRISE_NAV_SECTIONS.map((sec) => {
          const isSecActive = sec.id === activeSection.id;

          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => handleSectionClick(sec)}
              className={`h-8 px-3 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shrink-0 select-none ${
                isSecActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{getSectionIcon(sec.id, 'w-3.5 h-3.5')}</span>
              <span>{sec.title}</span>
            </button>
          );
        })}
      </nav>

      {/* ─────────────────────────────────────────────────────────────────────────
          3. MAIN WORKSPACE CONTAINER (Sidebar with Child Items + Content Viewport)
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
                <span className="p-1 rounded bg-blue-600/20 text-blue-400">
                  {getSectionIcon(activeSection.id, 'w-3.5 h-3.5')}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider truncate text-slate-200 dark:text-slate-100">
                  {activeSection.title}
                </span>
              </div>
            ) : (
              <div className="w-full flex justify-center text-blue-400 py-1" title={activeSection.title}>
                {getSectionIcon(activeSection.id, 'w-4 h-4')}
              </div>
            )}
          </div>

          {/* Child Items of Active Module */}
          <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1.5">
            {activeSection.modules.map((mod) => {
              const isModExpanded = !!expandedModules[mod.id];
              const isModActive = mod.submodules.some((sub) =>
                sub.children.some(
                  (leaf) =>
                    location.pathname === leaf.path ||
                    (leaf.path !== '/' && location.pathname.startsWith(leaf.path))
                )
              );

              return (
                <div key={mod.id} className="space-y-1">
                  {/* Expanded Mode: Module Accordion Header */}
                  {!isCollapsed ? (
                    <button
                      type="button"
                      onClick={() => toggleModule(mod.id)}
                      title={`${mod.title} (${mod.code})`}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-bold transition-colors ${
                        isModActive
                          ? 'bg-blue-600/15 text-blue-400 dark:text-blue-300 font-semibold'
                          : sidebarStyles.level1Btn
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span
                          className={`p-1 rounded shrink-0 ${
                            isModActive ? 'bg-blue-600 text-white' : 'bg-black/10 dark:bg-white/5'
                          }`}
                        >
                          {getModuleIcon(mod.iconName, 'w-3.5 h-3.5')}
                        </span>
                        <span className="truncate">{mod.title}</span>
                      </div>
                      <ChevronDown
                        className={`w-3.5 h-3.5 opacity-60 shrink-0 ml-1 transition-transform ${
                          isModExpanded ? '' : '-rotate-90'
                        }`}
                      />
                    </button>
                  ) : (
                    /* Collapsed Mode: Prominent Module Icon Button + Flyout */
                    <div className="relative group flex justify-center py-1">
                      <button
                        type="button"
                        onClick={() => {
                          const firstLeaf = mod.submodules[0]?.children[0];
                          if (firstLeaf) navigate(firstLeaf.path);
                        }}
                        title={`${mod.title} (${mod.code})`}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                          isModActive
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'text-slate-400 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {getModuleIcon(mod.iconName, 'w-5 h-5')}
                      </button>

                      {/* Hover Flyout Menu */}
                      <div className="absolute left-full ml-3 top-0 hidden group-hover:block z-50 min-w-[240px] bg-slate-900 border border-slate-700 rounded-xl p-2.5 shadow-2xl text-left select-none animate-in fade-in zoom-in-95 duration-100">
                        <div className="px-2 py-1 text-xs font-bold text-white border-b border-slate-800 flex items-center justify-between">
                          <span>{mod.title}</span>
                          <span className="font-mono text-[9px] text-slate-400">{mod.code}</span>
                        </div>
                        <div className="mt-1.5 space-y-2 max-h-80 overflow-y-auto">
                          {mod.submodules.map((sub) => (
                            <div key={sub.id} className="space-y-0.5">
                              <div className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                <Folder className="w-2.5 h-2.5 text-amber-400" />
                                <span>{sub.title}</span>
                              </div>
                              {sub.children.map((leaf) => {
                                const isLeafActive =
                                  location.pathname === leaf.path ||
                                  (leaf.path !== '/' && location.pathname.startsWith(leaf.path));
                                return (
                                  <Link
                                    key={leaf.id}
                                    to={leaf.path}
                                    className={`block px-2 py-1 rounded text-xs transition-colors ${
                                      isLeafActive
                                        ? 'bg-blue-600 text-white font-semibold'
                                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                    }`}
                                  >
                                    {leaf.title}
                                  </Link>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submodules & Actionable Screens (when Expanded) */}
                  {!isCollapsed && isModExpanded && (
                    <div className={`ml-2 pl-2 space-y-1.5 ${sidebarStyles.treeLine}`}>
                      {mod.submodules.map((sub) => {
                        const isSubExpanded = !!expandedSubmodules[sub.id];

                        return (
                          <div key={sub.id} className="space-y-1">
                            {/* Submodule / Process Header */}
                            <button
                              type="button"
                              onClick={() => toggleSubmodule(sub.id)}
                              className={`w-full flex items-center justify-between px-2 py-1 rounded-md text-[11px] font-semibold transition-colors ${sidebarStyles.level2Btn}`}
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                {isSubExpanded ? (
                                  <FolderOpen className="w-3 h-3 shrink-0 text-amber-400" />
                                ) : (
                                  <Folder className="w-3 h-3 shrink-0 opacity-60" />
                                )}
                                <span className="truncate">{sub.title}</span>
                              </div>
                              <ChevronRight
                                className={`w-3 h-3 opacity-60 transition-transform ${
                                  isSubExpanded ? 'rotate-90' : ''
                                }`}
                              />
                            </button>

                            {/* Actionable Screens */}
                            {isSubExpanded && (
                              <div className={`ml-3 pl-2.5 space-y-0.5 ${sidebarStyles.treeLine}`}>
                                {sub.children.map((leaf) => {
                                  const isActive =
                                    location.pathname === leaf.path ||
                                    (leaf.path !== '/' && location.pathname.startsWith(leaf.path));

                                  return (
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
                                  );
                                })}
                              </div>
                            )}
                          </div>
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
