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
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { ThemeToggle } from '../common/ThemeToggle';
import { OmniSearchPalette } from '../common/OmniSearchPalette';
import { SidebarThemeSelector } from '../common/SidebarThemeSelector';
import {
  ENTERPRISE_DOMAINS_CONFIG,
  type EnterpriseDomain,
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
  const [isDomainMenuOpen, setIsDomainMenuOpen] = useState(false);

  // 3rd Level Hierarchy Accordion State
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

    return (
      ENTERPRISE_DOMAINS_CONFIG.find((d) => d.id === 'governance') ||
      ENTERPRISE_DOMAINS_CONFIG[0]
    );
  }, [location.pathname]);

  // Auto-expand parent module and submodule for current route
  useEffect(() => {
    const currentPath = location.pathname;
    const newMods: Record<string, boolean> = { ...expandedModules };
    const newSubs: Record<string, boolean> = { ...expandedSubmodules };

    for (const domain of ENTERPRISE_DOMAINS_CONFIG) {
      for (const mod of domain.modules) {
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
    }
    setExpandedModules(newMods);
    setExpandedSubmodules(newSubs);
  }, [location.pathname]);

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

  const getModuleIcon = (modId: string, className: string = 'w-3.5 h-3.5') => {
    switch (modId) {
      case 'orders':
        return <FileSpreadsheet className={className} />;
      case 'commercial-export':
        return <TrendingUp className={className} />;
      case 'master-partners':
        return <Building2 className={className} />;
      case 'planning':
        return <Calendar className={className} />;
      case 'cutting':
        return <Scissors className={className} />;
      case 'printing':
        return <Printer className={className} />;
      case 'embroidery':
        return <Sparkles className={className} />;
      case 'subcontract':
        return <Truck className={className} />;
      case 'sewing':
        return <Activity className={className} />;
      case 'washing':
        return <Droplet className={className} />;
      case 'finishing':
        return <CheckSquare className={className} />;
      case 'packing':
        return <Package className={className} />;
      case 'fabric-warehouse':
        return <Layers className={className} />;
      case 'system-admin':
        return <Shield className={className} />;
      case 'quality-control':
        return <CheckCheck className={className} />;
      case 'plant-master':
        return <Sliders className={className} />;
      default:
        return <Folder className={className} />;
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
            items.push({ label: sub.title });
            items.push({ label: leaf.title, path: leaf.path });
            return items;
          }
        }
      }
    }

    return items;
  }, [activeDomain, location.pathname]);

  // Dynamic Sidebar Theme Classes
  const sidebarStyles = useMemo(() => {
    switch (sidebarTheme) {
      case 'navy':
        return {
          aside: 'bg-[#0f172a] border-r border-[#1e293b] text-slate-100',
          domainBtn:
            'bg-[#1e293b] hover:bg-[#273549] border-[#334155] text-slate-200',
          domainIconBox: 'bg-[#0f172a] text-blue-400 border border-[#334155]',
          domainFlyout: 'bg-[#0f172a] border-[#334155] text-slate-200',
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
          domainBtn:
            'bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700 border-slate-300 dark:border-zinc-700 text-slate-800 dark:text-slate-200',
          domainIconBox:
            'bg-slate-50 dark:bg-zinc-900 text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-zinc-700',
          domainFlyout:
            'bg-white dark:bg-zinc-850 border-slate-300 dark:border-zinc-700 text-slate-800 dark:text-slate-200',
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
          domainBtn:
            'bg-[#131d31] hover:bg-[#1a2843] border-[#223352] text-indigo-200',
          domainIconBox: 'bg-[#0c1322] text-indigo-400 border border-[#223352]',
          domainFlyout: 'bg-[#0c1322] border-[#223352] text-slate-200',
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
          2. MAIN WORKSPACE CONTAINER (3-Level Sidebar + Workspace Viewport)
         ───────────────────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (3-Level Hierarchical Tree) */}
        <aside
          className={`${
            isCollapsed ? 'w-16' : 'w-64'
          } ${sidebarStyles.aside} flex flex-col shrink-0 transition-all duration-200 z-20 select-none`}
        >
          {/* Top Domain Switcher Area */}
          <div className="p-3 border-b border-black/10 dark:border-white/10 relative">
            <button
              type="button"
              onClick={() => setIsDomainMenuOpen(!isDomainMenuOpen)}
              className={`w-full p-2 rounded-lg border transition-all flex items-center ${
                isCollapsed ? 'justify-center' : 'justify-between'
              } ${sidebarStyles.domainBtn}`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <div className={`p-1 rounded shadow-xs shrink-0 ${sidebarStyles.domainIconBox}`}>
                  {getDomainIcon(activeDomain.iconName, 'w-4 h-4')}
                </div>
                {!isCollapsed && (
                  <div className="text-left truncate">
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-60 block leading-tight">
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
                  className={`w-3.5 h-3.5 opacity-60 transition-transform ${
                    isDomainMenuOpen ? 'rotate-180 text-blue-400' : ''
                  }`}
                />
              )}
            </button>

            {/* Domain Selection Flyout Menu */}
            {isDomainMenuOpen && (
              <div
                className={`absolute top-full left-2 right-2 mt-1 rounded-xl shadow-2xl z-50 p-1.5 space-y-1 border ${sidebarStyles.domainFlyout}`}
              >
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider opacity-60">
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
                          : 'hover:bg-white/10 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <span
                        className={`p-1 rounded mt-0.5 shrink-0 ${
                          isActive ? 'bg-blue-700 text-white' : 'bg-black/20'
                        }`}
                      >
                        {getDomainIcon(dom.iconName, 'w-3.5 h-3.5')}
                      </span>
                      <div className="truncate">
                        <div className="font-semibold">{dom.title}</div>
                        <div className="text-[10px] leading-tight line-clamp-1 opacity-70">
                          {dom.shortTitle}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ─────────────────────────────────────────────────────────────────
              3-LEVEL HIERARCHICAL ACCORDION TREE MENU
             ───────────────────────────────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto px-2 py-3 space-y-2">
            {activeDomain.modules.map((mod) => {
              // Level 1: Module State
              const isModExpanded = !!expandedModules[mod.id];

              return (
                <div key={mod.id} className="space-y-1">
                  {/* Level 1: Module Header Row */}
                  {!isCollapsed ? (
                    <button
                      type="button"
                      onClick={() => toggleModule(mod.id)}
                      className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-bold transition-colors ${sidebarStyles.level1Btn}`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="p-1 rounded bg-black/10 dark:bg-white/5 shrink-0">
                          {getModuleIcon(mod.id)}
                        </span>
                        <span className="truncate">{mod.title}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 ml-1">
                        <span className="font-mono text-[9px] opacity-50">{mod.code}</span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 opacity-60 transition-transform ${
                            isModExpanded ? '' : '-rotate-90'
                          }`}
                        />
                      </div>
                    </button>
                  ) : (
                    /* Collapsed Icon Mode (No Naked Dots!) */
                    (() => {
                      const isModActive = mod.submodules.some((sub) =>
                        sub.children.some(
                          (leaf) =>
                            location.pathname === leaf.path ||
                            (leaf.path !== '/' && location.pathname.startsWith(leaf.path))
                        )
                      );

                      return (
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
                            {getModuleIcon(mod.id, 'w-5 h-5')}
                          </button>

                          {/* Floating Flyout Menu on Hover in Collapsed Mode */}
                          <div className="absolute left-full ml-3 top-0 hidden group-hover:block z-50 min-w-[220px] bg-slate-900 border border-slate-700 rounded-xl p-2.5 shadow-2xl text-left select-none animate-in fade-in zoom-in-95 duration-100">
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
                      );
                    })()
                  )}

                  {/* Level 2 & 3: Rendered if Level 1 is Expanded */}
                  {!isCollapsed && isModExpanded && (
                    <div className={`ml-2 pl-2 space-y-1.5 ${sidebarStyles.treeLine}`}>
                      {mod.submodules.map((sub) => {
                        // Level 2: Submodule State
                        const isSubExpanded = !!expandedSubmodules[sub.id];

                        return (
                          <div key={sub.id} className="space-y-1">
                            {/* Level 2: Sub-category / Process Group Header */}
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

                            {/* Level 3: Actionable Pages / Direct Screens */}
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
        <main className="flex-1 flex flex-col overflow-y-auto bg-slate-100/60 dark:bg-slate-950 relative">
          {/* Top 3-Level Breadcrumb Bar */}
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
