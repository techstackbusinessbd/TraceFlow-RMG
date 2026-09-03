import React, { useEffect, useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Shield, 
  ShieldCheck, 
  Save, 
  CheckSquare, 
  Square, 
  CheckCircle2, 
  Search, 
  RotateCcw,
  SlidersHorizontal,
  KeyRound,
  Lock,
  Sparkles,
  Info
} from 'lucide-react';
import { userService, type UserPermissionsData } from '../../../services/userService';

type StatusFilter = 'all' | 'direct' | 'inherited' | 'ungranted';

export const UserPermissionsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [permissionsData, setPermissionsData] = useState<UserPermissionsData | null>(null);
  const [manifest, setManifest] = useState<Record<string, Record<string, string>>>({});
  const [directPermissions, setDirectPermissions] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filters State
  const [selectedModule, setSelectedModule] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      setIsLoading(true);
      try {
        const [userData, manifestData] = await Promise.all([
          userService.getUserPermissions(id),
          userService.getSystemManifest(),
        ]);

        setPermissionsData(userData);
        setManifest(manifestData);
        setDirectPermissions(new Set(userData.direct_permissions));
      } catch (err: unknown) {
        const errorObj = err as { response?: { data?: { detail?: string } } };
        setErrorMessage(errorObj.response?.data?.detail || 'Failed to load user privileges matrix.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  const rolePermissionsSet = useMemo(() => {
    return new Set(permissionsData?.role_permissions || []);
  }, [permissionsData]);

  const toggleDirectPermission = (permKey: string) => {
    setDirectPermissions((prev) => {
      const next = new Set(prev);
      if (next.has(permKey)) {
        next.delete(permKey);
      } else {
        next.add(permKey);
      }
      return next;
    });
  };

  const handleResetToRoleDefaults = () => {
    setDirectPermissions(new Set());
  };

  const handleSave = async () => {
    if (!id) return;
    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const updated = await userService.updateUserPermissions(id, Array.from(directPermissions));
      setPermissionsData((prev) => prev ? {
        ...prev,
        direct_permissions: updated.direct_permissions,
        all_permissions: updated.all_permissions,
      } : null);
      setDirectPermissions(new Set(updated.direct_permissions));
      setSuccessMessage('User custom privileges updated and synced successfully.');
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { detail?: string } } };
      setErrorMessage(errorObj.response?.data?.detail || 'Failed to save custom privileges.');
    } finally {
      setIsSaving(false);
    }
  };

  // Module stats
  const moduleStats = useMemo(() => {
    const stats: Record<string, { total: number; direct: number; inherited: number; effective: number }> = {};
    Object.entries(manifest).forEach(([modName, perms]) => {
      const total = Object.keys(perms).length;
      let direct = 0;
      let inherited = 0;
      let effective = 0;

      Object.keys(perms).forEach((k) => {
        const isInherited = rolePermissionsSet.has(k);
        const isDirect = directPermissions.has(k);
        if (isDirect) direct++;
        if (isInherited) inherited++;
        if (isDirect || isInherited) effective++;
      });

      stats[modName] = { total, direct, inherited, effective };
    });
    return stats;
  }, [manifest, rolePermissionsSet, directPermissions]);

  // Filtered manifest
  const filteredManifest = useMemo(() => {
    const result: Record<string, Record<string, string>> = {};
    const query = searchQuery.trim().toLowerCase();

    Object.entries(manifest).forEach(([modName, perms]) => {
      if (selectedModule !== 'ALL' && selectedModule !== modName) {
        return;
      }

      const matchingPerms: Record<string, string> = {};
      Object.entries(perms).forEach(([permKey, permDesc]) => {
        const isInherited = rolePermissionsSet.has(permKey);
        const isDirect = directPermissions.has(permKey);
        const isEffective = isInherited || isDirect;

        if (statusFilter === 'direct' && !isDirect) return;
        if (statusFilter === 'inherited' && !isInherited) return;
        if (statusFilter === 'ungranted' && isEffective) return;

        if (query) {
          const matchKey = permKey.toLowerCase().includes(query);
          const matchDesc = permDesc.toLowerCase().includes(query);
          if (!matchKey && !matchDesc) return;
        }

        matchingPerms[permKey] = permDesc;
      });

      if (Object.keys(matchingPerms).length > 0) {
        result[modName] = matchingPerms;
      }
    });

    return result;
  }, [manifest, selectedModule, searchQuery, statusFilter, rolePermissionsSet, directPermissions]);

  const totalVisibleCount = useMemo(() => {
    return Object.values(filteredManifest).reduce((acc, curr) => acc + Object.keys(curr).length, 0);
  }, [filteredManifest]);

  const handleResetFilters = () => {
    setSelectedModule('ALL');
    setSearchQuery('');
    setStatusFilter('all');
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center text-slate-500">
        <div className="inline-flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent animate-spin"></div>
          <span>Loading user privileges matrix...</span>
        </div>
      </div>
    );
  }

  if (!permissionsData) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white border border-slate-200 text-center space-y-4">
        <h2 className="text-lg font-bold text-slate-900">User Record Not Found</h2>
        <Link to="/admin/users" className="text-blue-600 font-semibold hover:underline">
          Return to User Directory
        </Link>
      </div>
    );
  }

  const { user } = permissionsData;
  const isSuperAdminUser = user.roles?.includes('Super Admin');
  const allModulesList = Object.keys(manifest);
  const totalEffectiveCount = new Set([...directPermissions, ...rolePermissionsSet]).size;

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <Link to="/admin/privileges" className="hover:text-blue-600 transition-colors">User Privileges</Link>
            <span>/</span>
            <span className="text-slate-800">{user.name}</span>
            <span>/</span>
            <span className="text-slate-800 font-semibold">Custom Privileges</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Manage Custom Privileges: {user.name}
            </h1>
            <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-800 border border-slate-300">
              {user.emp_id}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Grant individual user-level permissions that supplement or override the user's assigned role privileges.
          </p>
        </div>

        {/* Action Buttons (Flat Solid Colors - STRICT) */}
        <div className="flex items-center gap-3">
          <Link
            to="/admin/privileges"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to User Privileges</span>
          </Link>
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-6 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-2xs"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving Changes...' : 'Save Privileges'}
          </button>
        </div>
      </div>

      {/* Success Alert */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
          <button type="button" onClick={() => setSuccessMessage(null)} className="text-emerald-700 font-bold">✕</button>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center justify-between">
          <span>{errorMessage}</span>
          <button type="button" onClick={() => setErrorMessage(null)} className="text-red-700 font-bold">✕</button>
        </div>
      )}

      {/* User Identity & Scope Overview Card */}
      <div className="bg-white border border-slate-200 shadow-xs p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-800 text-white font-bold text-base flex items-center justify-center shrink-0">
              <KeyRound className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-base">{user.name}</span>
                <span className="text-xs text-blue-600 font-mono">@{user.username}</span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                  Role: {user.roles.join(', ') || 'No Assigned Role'}
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                <span>{user.department || 'General Plant'}</span> • <span>{user.designation || 'Staff'}</span>
              </div>
            </div>
          </div>

          {/* Metric Badges */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <div className="p-2.5 bg-slate-50 border border-slate-200 text-slate-700">
              <div className="text-[10px] uppercase font-bold text-slate-400">Role Inherited</div>
              <div className="text-base font-bold text-slate-900">{rolePermissionsSet.size}</div>
            </div>

            <div className="p-2.5 bg-blue-50 border border-blue-200 text-blue-900">
              <div className="text-[10px] uppercase font-bold text-blue-500">Direct Overrides</div>
              <div className="text-base font-bold text-blue-700">{directPermissions.size}</div>
            </div>

            <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-900">
              <div className="text-[10px] uppercase font-bold text-emerald-600">Total Effective</div>
              <div className="text-base font-bold text-emerald-700">{totalEffectiveCount}</div>
            </div>

            <button
              type="button"
              onClick={handleResetToRoleDefaults}
              className="px-3 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors self-end"
              title="Remove all direct permissions so user has only role permissions"
            >
              Reset to Role Defaults
            </button>
          </div>
        </div>

        {/* Explainability Note */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-start gap-2 text-xs text-slate-500 leading-relaxed">
          <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <span>
            <strong>Role Permissions</strong> (marked with lock badge) are granted through the user's role and cannot be unchecked here. 
            Checking any additional item grants a <strong>Direct User Privilege</strong> specifically to this user account.
          </span>
        </div>
      </div>

      {/* Super Admin Notice */}
      {isSuperAdminUser && (
        <div className="p-4 bg-purple-50 border border-purple-200 text-purple-900 text-xs flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold">Root Super Administrator Notice:</div>
            <p className="mt-0.5 leading-relaxed">
              This account possesses root application bypass privileges. Custom grants take effect in the RBAC table, but system gates ensure Super Admin always has full access.
            </p>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODULE-WISE FILTER CONSOLE */}
      {/* ==================================================================== */}
      <div className="bg-white border border-slate-200 shadow-xs p-4 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
            <SlidersHorizontal className="w-4 h-4 text-blue-600" />
            <span>Filter Privileges Matrix</span>
          </div>

          <div className="flex items-center gap-3 flex-wrap text-xs">
            {/* Status Filter Buttons */}
            <div className="flex items-center border border-slate-300 overflow-hidden">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 font-medium transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-slate-800 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                All Privileges
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('direct')}
                className={`px-3 py-1.5 font-medium border-l border-slate-300 transition-colors ${
                  statusFilter === 'direct'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                Direct Only ({directPermissions.size})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('inherited')}
                className={`px-3 py-1.5 font-medium border-l border-slate-300 transition-colors ${
                  statusFilter === 'inherited'
                    ? 'bg-slate-700 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                Role Inherited ({rolePermissionsSet.size})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('ungranted')}
                className={`px-3 py-1.5 font-medium border-l border-slate-300 transition-colors ${
                  statusFilter === 'ungranted'
                    ? 'bg-slate-600 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                Ungranted
              </button>
            </div>

            {/* Reset Button */}
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          </div>
        </div>

        {/* Search & Module Dropdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search permission slug or description..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
            >
              <option value="ALL">All Modules ({allModulesList.length})</option>
              {allModulesList.map((modName) => {
                const stat = moduleStats[modName];
                return (
                  <option key={modName} value={modName}>
                    {modName} ({stat ? `${stat.effective}/${stat.total}` : ''})
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Horizontal Module Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-thin">
          <button
            type="button"
            onClick={() => setSelectedModule('ALL')}
            className={`px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors border ${
              selectedModule === 'ALL'
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
            }`}
          >
            All Modules ({allModulesList.length})
          </button>

          {allModulesList.map((modName) => {
            const isSelected = selectedModule === modName;
            const stat = moduleStats[modName];

            return (
              <button
                key={modName}
                type="button"
                onClick={() => setSelectedModule(modName)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span>{modName}</span>
                <span className={`px-1.5 py-0.2 text-[10px] ${
                  isSelected
                    ? 'bg-blue-800 text-blue-100'
                    : stat && stat.direct > 0
                    ? 'bg-blue-100 text-blue-800 font-bold'
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  {stat ? `${stat.effective}/${stat.total}` : ''}
                </span>
              </button>
            );
          })}
        </div>

        {/* Counter Info */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>
            Showing <strong className="text-slate-800">{totalVisibleCount}</strong> permissions across{' '}
            <strong className="text-slate-800">{Object.keys(filteredManifest).length}</strong> active module(s)
          </span>
          {searchQuery && (
            <span className="text-blue-600 font-medium">Filtered by: "{searchQuery}"</span>
          )}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* PRIVILEGES MATRIX CARDS */}
      {/* ==================================================================== */}
      {Object.keys(filteredManifest).length === 0 ? (
        <div className="bg-white border border-slate-200 p-12 text-center space-y-3">
          <Search className="w-8 h-8 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No matching privileges found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            No permissions match your filter criteria. Try resetting your search terms.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(filteredManifest).map(([moduleName, permissions]) => {
            const permEntries = Object.entries(permissions);
            const stat = moduleStats[moduleName];

            return (
              <div key={moduleName} className="bg-white border border-slate-200 shadow-xs overflow-hidden">
                {/* Module Header */}
                <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Shield className="w-4 h-4 text-slate-600" />
                    <span className="font-bold text-slate-900 text-sm">{moduleName}</span>
                    <span className="text-xs text-slate-500 font-medium">
                      ({stat ? `${stat.effective} active of ${stat.total}` : `${permEntries.length} permissions`})
                    </span>
                  </div>
                </div>

                {/* Privileges Grid */}
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {permEntries.map(([permKey, permDesc]) => {
                    const isInherited = rolePermissionsSet.has(permKey);
                    const isDirect = directPermissions.has(permKey);

                    return (
                      <div
                        key={permKey}
                        onClick={() => {
                          if (!isInherited) {
                            toggleDirectPermission(permKey);
                          }
                        }}
                        className={`p-3.5 border flex items-start gap-3 transition-colors select-none ${
                          isInherited
                            ? 'border-slate-200 bg-slate-50/70 cursor-default opacity-85'
                            : isDirect
                            ? 'border-blue-400 bg-blue-50/50 cursor-pointer'
                            : 'border-slate-200 hover:bg-slate-50/80 cursor-pointer'
                        }`}
                      >
                        {/* Checkbox / Lock Icon */}
                        <div className="mt-0.5 shrink-0">
                          {isInherited ? (
                            <span title="Inherited from role (locked)">
                              <Lock className="w-4 h-4 text-slate-400" />
                            </span>
                          ) : isDirect ? (
                            <CheckSquare className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-300" />
                          )}
                        </div>

                        {/* Details */}
                        <div className="text-xs flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono font-bold text-slate-900">{permKey}</span>

                            {/* Badge */}
                            {isInherited ? (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 text-[9px] font-semibold bg-slate-200 text-slate-700">
                                <Lock className="w-2.5 h-2.5" />
                                Role Inherited
                              </span>
                            ) : isDirect ? (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider bg-blue-600 text-white">
                                <Sparkles className="w-2.5 h-2.5" />
                                Direct Privilege
                              </span>
                            ) : null}
                          </div>

                          <div className="text-slate-600 mt-1 leading-relaxed">{permDesc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
