import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Shield, 
  ShieldCheck, 
  Users, 
  Sliders, 
  Plus,
  Search,
  LayoutGrid,
  Table as TableIcon,
  RotateCcw,
  KeyRound,
  Layers,
} from 'lucide-react';
import { userService, type Role } from '../../../services/userService';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { UI_TOKENS } from '../../../config/designTokens';

export const RoleListPage: React.FC = () => {
  const navigate = useNavigate();

  const [roles, setRoles] = useState<Role[]>([]);
  const [totalSystemPerms, setTotalSystemPerms] = useState<number>(34);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // New Role Form State
  const [showCreateCard, setShowCreateCard] = useState<boolean>(false);
  const [newRoleName, setNewRoleName] = useState<string>('');
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const fetchRolesData = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const [rolesData, manifestData] = await Promise.all([
        userService.getRoles(),
        userService.getSystemManifest().catch(() => ({})),
      ]);
      setRoles(rolesData);

      // Count total distinct permissions in system manifest
      let permCount = 0;
      Object.values(manifestData).forEach((mod) => {
        permCount += Object.keys(mod).length;
      });
      if (permCount > 0) {
        setTotalSystemPerms(permCount);
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { detail?: string } } };
      setErrorMessage(errorObj.response?.data?.detail || 'Failed to load system roles registry.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRolesData();
  }, []);

  // Category classifier helper
  const getRoleCategory = (roleName: string): { label: string; key: string; badge: 'info' | 'neutral' | 'root' | 'success' | 'warning' } => {
    if (roleName === 'Super Admin') return { label: 'Root Security', key: 'SECURITY', badge: 'root' };
    if (roleName === 'IT Admin') return { label: 'System Admin', key: 'SECURITY', badge: 'info' };
    if (['CEO', 'CFO', 'Chairman', 'Managing Director', 'General Manager', 'Platform Owner'].includes(roleName)) {
      return { label: 'Executive', key: 'EXECUTIVE', badge: 'neutral' };
    }
    if (['Head of QA', 'Quality Manager', 'Floor Inspector'].includes(roleName)) {
      return { label: 'Quality Assurance', key: 'QUALITY', badge: 'success' };
    }
    if (['Cutting Master', 'Sewing Supervisor', 'Floor Operator', 'Floor TV Device', 'Plant Head', 'Fabric Store Manager', 'Warehouse Head'].includes(roleName)) {
      return { label: 'Floor Operations', key: 'OPERATIONS', badge: 'warning' };
    }
    if (['Planning Manager', 'IE Manager', 'Commercial Manager'].includes(roleName)) {
      return { label: 'Planning & Trade', key: 'PLANNING', badge: 'info' };
    }
    return { label: 'Custom Operations', key: 'CUSTOM', badge: 'neutral' };
  };

  // Filtered Roles
  const filteredRoles = useMemo(() => {
    return roles.filter((role) => {
      const matchesSearch =
        role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (role.slug && role.slug.toLowerCase().includes(searchQuery.toLowerCase()));

      const category = getRoleCategory(role.name).key;
      const matchesCategory = selectedCategory === 'ALL' || category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [roles, searchQuery, selectedCategory]);

  // Aggregate Metrics for Top KPI Console
  const metrics = useMemo(() => {
    const totalRoles = roles.length;
    let totalAssignedUsers = 0;
    roles.forEach((r) => {
      totalAssignedUsers += r.users_count || 0;
    });
    const rootRoles = roles.filter((r) => r.name === 'Super Admin' || r.name === 'IT Admin').length;

    return { totalRoles, totalAssignedUsers, rootRoles };
  }, [roles]);

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) {
      setCreateError('Role name cannot be blank.');
      return;
    }

    setIsCreating(true);
    setCreateError(null);

    try {
      await userService.createRole(newRoleName.trim(), []);
      setNewRoleName('');
      setShowCreateCard(false);
      await fetchRolesData();
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { detail?: string; errors?: { name?: string[] } } } };
      setCreateError(errorObj.response?.data?.errors?.name?.[0] || errorObj.response?.data?.detail || 'Failed to create role.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <Link
            to="/admin/users"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Users Directory
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Roles & Permissions Management</h1>
            <Badge variant="neutral" className="font-mono text-xs">
              {roles.length} Registered
            </Badge>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Configure system role boundaries, module privileges, and granular operational authorization matrix.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setShowCreateCard(!showCreateCard)}
          >
            {showCreateCard ? 'Hide Form' : 'Create Custom Role'}
          </Button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* EXECUTIVE KPI SUMMARY DOCK */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total System Roles</span>
            <Shield className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{metrics.totalRoles}</div>
          <div className="text-xs text-slate-500 mt-1">Hierarchical authorization profiles</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Assigned Staff</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{metrics.totalAssignedUsers}</div>
          <div className="text-xs text-slate-500 mt-1">Users mapped to active roles</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Root & Admins</span>
            <KeyRound className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-950 mt-2">{metrics.rootRoles}</div>
          <div className="text-xs text-slate-500 mt-1">1 Singleton Root + Multi-Admins</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">System Permissions</span>
            <Layers className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{totalSystemPerms}</div>
          <div className="text-xs text-slate-500 mt-1">Granular gate tokens configured</div>
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-sm font-semibold rounded-md">
          {errorMessage}
        </div>
      )}

      {/* Inline Creation Drawer (No Modals Rule) */}
      {showCreateCard && (
        <div className="p-5 bg-white border-2 border-blue-600 rounded-md shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Shield className="w-4 h-4 text-blue-600" />
            <span>Create New System Role</span>
          </div>

          {createError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-md">
              {createError}
            </div>
          )}

          <form noValidate onSubmit={handleCreateRole} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <input
              type="text"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              placeholder="e.g. Fabric QA Specialist, Industrial Engineering Executive"
              className={UI_TOKENS.input.base}
            />
            <div className="flex items-center gap-2 shrink-0">
              <Button type="submit" variant="primary" isLoading={isCreating}>
                Save Role
              </Button>
              <Button type="button" variant="secondary" onClick={() => setShowCreateCard(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TOOLBAR & CATEGORY FILTER BAR */}
      {/* ==================================================================== */}
      <div className="bg-white border border-slate-200 rounded-md shadow-2xs p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Live Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search roles by title (e.g. QA, Inspector, CEO)..."
              className="w-full pl-9 pr-8 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:border-blue-600 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            )}
          </div>

          {/* View Mode Switch (Table vs Compact Cards) */}
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-slate-300 rounded-md overflow-hidden">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-colors ${
                  viewMode === 'table'
                    ? 'bg-slate-800 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-50'
                }`}
                title="Data Table View (Recommended)"
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Table</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border-l border-slate-300 transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-slate-800 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-50'
                }`}
                title="Compact Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Cards</span>
              </button>
            </div>

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md"
                title="Reset search"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-100">
          {[
            { key: 'ALL', label: 'All Roles' },
            { key: 'SECURITY', label: 'Admin & Security' },
            { key: 'EXECUTIVE', label: 'Executive & C-Suite' },
            { key: 'OPERATIONS', label: 'Floor Operations' },
            { key: 'QUALITY', label: 'Quality Assurance' },
            { key: 'PLANNING', label: 'Planning & Trade' },
          ].map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                selectedCategory === cat.key
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 1. TABLE VIEW (EXECUTIVE GRADE DATA TABLE - ZERO REPETITIVE SEA) */}
      {/* ==================================================================== */}
      {viewMode === 'table' ? (
        <div className="bg-white border border-slate-200 rounded-md shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-fixed">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-700 font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-[280px]">Role Title & Slug</th>
                  <th className="py-3.5 px-4 w-44">Category</th>
                  <th className="py-3.5 px-4 w-36">Active Staff</th>
                  <th className="py-3.5 px-4 w-64">Permission Coverage</th>
                  <th className="py-3.5 px-4 w-40">Authority Scope</th>
                  <th className="py-3.5 px-4 w-52 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-slate-400">
                      <div className="inline-flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent animate-spin" />
                        <span className="text-xs font-semibold">Loading system roles registry...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredRoles.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-slate-500">
                      <Shield className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="font-bold text-slate-800">No matching system roles found.</p>
                      <p className="text-xs text-slate-400 mt-1">Try changing your search query or department filter.</p>
                    </td>
                  </tr>
                ) : (
                  filteredRoles.map((role) => {
                    const isSuperAdmin = role.name === 'Super Admin';
                    const isITAdmin = role.name === 'IT Admin';
                    const permCount = role.permissions?.length || 0;
                    const percent = isSuperAdmin
                      ? 100
                      : Math.min(100, Math.round((permCount / totalSystemPerms) * 100));
                    const cat = getRoleCategory(role.name);

                    return (
                      <tr key={role.id} className="hover:bg-slate-50/90 transition-colors group">
                        {/* Role Title & Slug */}
                        <td className="py-3.5 px-4 align-middle">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${
                                isSuperAdmin
                                  ? 'bg-purple-100 text-purple-800'
                                  : isITAdmin
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              <ShieldCheck className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-slate-900 text-sm truncate flex items-center gap-1.5">
                                <span>{role.name}</span>
                                {isSuperAdmin && (
                                  <span className="px-1.5 py-0.2 text-[9px] font-bold bg-purple-100 text-purple-800 rounded-sm border border-purple-300">
                                    Root
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-slate-400 font-mono mt-0.5 truncate">
                                slug: {role.slug || role.id}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-4 align-middle">
                          <Badge variant={cat.badge}>{cat.label}</Badge>
                        </td>

                        {/* Active Staff */}
                        <td className="py-3.5 px-4 align-middle">
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                            <span>
                              {role.users_count ?? 0} {role.users_count === 1 ? 'User' : 'Users'}
                            </span>
                          </span>
                        </td>

                        {/* Permission Coverage Progress Bar */}
                        <td className="py-3.5 px-4 align-middle">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs font-medium text-slate-600">
                              <span>
                                {isSuperAdmin ? 'Full Wildcard Access' : `${permCount} of ${totalSystemPerms} gates`}
                              </span>
                              <span className="font-bold font-mono text-slate-800">{percent}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-full transition-all duration-300 ${
                                  isSuperAdmin
                                    ? 'bg-purple-600'
                                    : percent > 75
                                    ? 'bg-blue-600'
                                    : percent > 30
                                    ? 'bg-amber-500'
                                    : 'bg-slate-400'
                                }`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Authority Scope */}
                        <td className="py-3.5 px-4 align-middle">
                          {isSuperAdmin ? (
                            <Badge variant="root">Singleton Root</Badge>
                          ) : isITAdmin ? (
                            <Badge variant="info">Multi-Admin</Badge>
                          ) : (
                            <Badge variant="neutral">Departmental</Badge>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right align-middle">
                          <div className="inline-flex items-center justify-end gap-2">
                            <Button
                              variant="primary"
                              size="sm"
                              icon={<Sliders className="w-3.5 h-3.5" />}
                              onClick={() => navigate(`/admin/roles/${role.slug || role.id}/permissions`)}
                            >
                              Configure Matrix
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ==================================================================== */
        /* 2. COMPACT CARDS VIEW (CLEAN, MUTED, ELEGANT PROPORTIONS)            */
        /* ==================================================================== */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRoles.map((role) => {
            const isSuperAdmin = role.name === 'Super Admin';
            const permCount = role.permissions?.length || 0;
            const percent = isSuperAdmin
              ? 100
              : Math.min(100, Math.round((permCount / totalSystemPerms) * 100));
            const cat = getRoleCategory(role.name);

            return (
              <div
                key={role.id}
                className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs hover:border-slate-300 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                        <ShieldCheck className={`w-4 h-4 ${isSuperAdmin ? 'text-purple-600' : 'text-blue-600'}`} />
                        <span>{role.name}</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">
                        {role.slug || role.id}
                      </span>
                    </div>
                    <Badge variant={cat.badge}>{cat.label}</Badge>
                  </div>

                  <div className="mt-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Assigned Users:</span>
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        {role.users_count ?? 0}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1 pt-1">
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>Access Level:</span>
                        <span className="font-bold font-mono text-slate-800">{percent}% ({permCount}/{totalSystemPerms})</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full ${
                            isSuperAdmin ? 'bg-purple-600' : 'bg-blue-600'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-4 border-t border-slate-100">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full justify-center"
                    icon={<Sliders className="w-3.5 h-3.5" />}
                    onClick={() => navigate(`/admin/roles/${role.slug || role.id}/permissions`)}
                  >
                    Configure Permissions
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
