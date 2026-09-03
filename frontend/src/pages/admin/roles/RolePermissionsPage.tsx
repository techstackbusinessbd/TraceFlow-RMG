import React, { useEffect, useState, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
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
  SlidersHorizontal
} from 'lucide-react';
import { userService, type Role } from '../../../services/userService';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';

type StatusFilter = 'all' | 'granted' | 'ungranted';

export const RolePermissionsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [role, setRole] = useState<Role | null>(null);
  const [manifest, setManifest] = useState<Record<string, Record<string, string>>>({});
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());
  const [initialPermissions, setInitialPermissions] = useState<Set<string>>(new Set());
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
        const [roleData, manifestData] = await Promise.all([
          userService.getRole(id),
          userService.getSystemManifest(),
        ]);

        setRole(roleData);
        setManifest(manifestData);

        const granted = new Set<string>();
        roleData.permissions?.forEach((p) => granted.add(p.name));
        setSelectedPermissions(granted);
        setInitialPermissions(new Set(granted));
      } catch (err: unknown) {
        const errorObj = err as { response?: { data?: { detail?: string } } };
        setErrorMessage(errorObj.response?.data?.detail || 'Failed to load permissions matrix.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  const hasUnsavedChanges = useMemo(() => {
    if (selectedPermissions.size !== initialPermissions.size) return true;
    for (const p of selectedPermissions) {
      if (!initialPermissions.has(p)) return true;
    }
    return false;
  }, [selectedPermissions, initialPermissions]);

  const togglePermission = (permKey: string) => {
    setSelectedPermissions((prev) => {
      const next = new Set(prev);
      if (next.has(permKey)) {
        next.delete(permKey);
      } else {
        next.add(permKey);
      }
      return next;
    });
  };

  const toggleModuleAll = (permissions: Record<string, string>, selectAll: boolean) => {
    setSelectedPermissions((prev) => {
      const next = new Set(prev);
      Object.keys(permissions).forEach((key) => {
        if (selectAll) {
          next.add(key);
        } else {
          next.delete(key);
        }
      });
      return next;
    });
  };

  const handleSave = async () => {
    if (!id) return;
    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      await userService.updateRolePermissions(id, Array.from(selectedPermissions));
      setInitialPermissions(new Set(selectedPermissions));
      setSuccessMessage('Permissions matrix updated successfully.');
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { detail?: string } } };
      setErrorMessage(errorObj.response?.data?.detail || 'Failed to save permissions changes.');
    } finally {
      setIsSaving(false);
    }
  };

  // Compute module stats (granted / total per module)
  const moduleStats = useMemo(() => {
    const stats: Record<string, { total: number; granted: number }> = {};
    Object.entries(manifest).forEach(([modName, perms]) => {
      const total = Object.keys(perms).length;
      let granted = 0;
      Object.keys(perms).forEach((k) => {
        if (selectedPermissions.has(k)) granted++;
      });
      stats[modName] = { total, granted };
    });
    return stats;
  }, [manifest, selectedPermissions]);

  // Filtered manifest calculation
  const filteredManifest = useMemo(() => {
    const result: Record<string, Record<string, string>> = {};
    const query = searchQuery.trim().toLowerCase();

    Object.entries(manifest).forEach(([modName, perms]) => {
      // Module filter check
      if (selectedModule !== 'ALL' && selectedModule !== modName) {
        return;
      }

      const matchingPerms: Record<string, string> = {};
      Object.entries(perms).forEach(([permKey, permDesc]) => {
        const isGranted = selectedPermissions.has(permKey);

        // Status filter check
        if (statusFilter === 'granted' && !isGranted) return;
        if (statusFilter === 'ungranted' && isGranted) return;

        // Search text filter check
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
  }, [manifest, selectedModule, searchQuery, statusFilter, selectedPermissions]);

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
          <span>Loading permissions matrix...</span>
        </div>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white border border-slate-200 text-center space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Role Not Found</h2>
        <Link to="/admin/roles" className="text-blue-600 font-semibold hover:underline">
          Return to Roles List
        </Link>
      </div>
    );
  }

  const isSuperAdmin = role.name === 'Super Admin';
  const allModulesList = Object.keys(manifest);

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <Link
            to="/admin/roles"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Roles Registry
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Configure Permissions: {role.name}
            </h1>
            <Badge variant={isSuperAdmin ? 'root' : 'info'}>
              {selectedPermissions.size} Granted
            </Badge>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Configure module-level access and functional privileges assigned to this system role.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={() => navigate('/admin/roles')}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            icon={<Save className="w-4 h-4" />}
            isLoading={isSaving}
            onClick={handleSave}
          >
            Save Permissions
          </Button>
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

      {/* Super Admin Notice */}
      {isSuperAdmin && (
        <div className="p-4 bg-purple-50 border border-purple-200 text-purple-900 text-xs flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold">Super Admin Wildcard Authority:</div>
            <p className="mt-0.5 leading-relaxed">
              Super Admin possesses root bypass privileges across the entire application. Modifying these checkboxes changes explicit database grants, but system kernel gates ensure Super Admin never gets locked out.
            </p>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODULE-WISE FILTER & SEARCH CONSOLE */}
      {/* ==================================================================== */}
      <div className="bg-white border border-slate-200 shadow-xs p-4 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
            <SlidersHorizontal className="w-4 h-4 text-blue-600" />
            <span>Filter Permissions Matrix</span>
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
                All Status
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('granted')}
                className={`px-3 py-1.5 font-medium border-l border-slate-300 transition-colors ${
                  statusFilter === 'granted'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                Granted Only
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
                Ungranted Only
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
          {/* Text Search Input */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search permission slug (e.g. users.delete) or description..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Module Selector Dropdown */}
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
                    {modName} ({stat ? `${stat.granted}/${stat.total}` : ''})
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Horizontal Module Filter Pills (Clickable Tabs) */}
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
            const isFullyGranted = stat && stat.granted === stat.total;

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
                    : isFullyGranted
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  {stat ? `${stat.granted}/${stat.total}` : ''}
                </span>
              </button>
            );
          })}
        </div>

        {/* Results Info Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>
            Showing <strong className="text-slate-800">{totalVisibleCount}</strong> permissions across{' '}
            <strong className="text-slate-800">{Object.keys(filteredManifest).length}</strong> active module(s)
          </span>
          {searchQuery && (
            <span className="text-blue-600 font-medium">
              Filtered by: "{searchQuery}"
            </span>
          )}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* PERMISSIONS MATRIX CARDS */}
      {/* ==================================================================== */}
      {Object.keys(filteredManifest).length === 0 ? (
        <div className="bg-white border border-slate-200 p-12 text-center space-y-3">
          <Search className="w-8 h-8 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No matching permissions found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            No functional permissions match your selected filter criteria. Try searching for a different keyword or resetting your filters.
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
            const originalModulePerms = manifest[moduleName] || {};
            const stat = moduleStats[moduleName];

            return (
              <div key={moduleName} className="bg-white border border-slate-200 shadow-xs overflow-hidden">
                {/* Module Group Header */}
                <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-blue-50 border border-blue-200 text-blue-700">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 text-sm block sm:inline">{moduleName}</span>
                      <span className="text-xs text-slate-500 font-medium ml-0 sm:ml-2">
                        ({stat ? `${stat.granted} of ${stat.total} granted` : `${permEntries.length} permissions`})
                      </span>
                    </div>
                  </div>

                  {/* Group Select All / Deselect All */}
                  <div className="flex items-center gap-3 text-xs">
                    <button
                      type="button"
                      onClick={() => toggleModuleAll(originalModulePerms, true)}
                      className="text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      Select All in Module
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={() => toggleModuleAll(originalModulePerms, false)}
                      className="text-slate-500 hover:text-slate-700 font-semibold"
                    >
                      Deselect All
                    </button>
                  </div>
                </div>

                {/* Permissions Checkbox Grid */}
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {permEntries.map(([permKey, permDesc]) => {
                    const isChecked = selectedPermissions.has(permKey);

                    const getActionBadge = (key: string) => {
                      if (key.endsWith('.view') || key.endsWith('.read') || key.includes('.overview')) {
                        return <span className="px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 rounded-sm shrink-0">VIEW</span>;
                      }
                      if (key.endsWith('.create') || key.endsWith('.store') || key.includes('.add')) {
                        return <span className="px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-sm shrink-0">CREATE</span>;
                      }
                      if (key.endsWith('.update') || key.endsWith('.edit') || key.includes('.assign')) {
                        return <span className="px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 rounded-sm shrink-0">EDIT</span>;
                      }
                      if (key.endsWith('.delete') || key.endsWith('.destroy') || key.includes('.purge')) {
                        return <span className="px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 rounded-sm shrink-0">DELETE</span>;
                      }
                      return <span className="px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200 rounded-sm shrink-0">ACTION</span>;
                    };

                    return (
                      <label
                        key={permKey}
                        onClick={() => togglePermission(permKey)}
                        className={`p-3.5 border rounded-md flex items-start gap-3 cursor-pointer transition-colors select-none ${
                          isChecked
                            ? 'border-blue-400 bg-blue-50/50'
                            : 'border-slate-200 hover:bg-slate-50/80'
                        }`}
                      >
                        <div className="mt-0.5 text-blue-600 shrink-0">
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-300" />
                          )}
                        </div>
                        <div className="text-xs min-w-0 flex-1">
                          <div className="font-mono font-bold text-slate-900 flex items-center gap-2 flex-wrap">
                            <span className="truncate">{permKey}</span>
                            {getActionBadge(permKey)}
                            {isChecked && (
                              <span className="px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 rounded-sm">
                                Active
                              </span>
                            )}
                          </div>
                          <div className="text-slate-600 mt-1 leading-relaxed">{permDesc}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Sticky Save Dock (Appears when unsaved edits are present) */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 backdrop-blur-sm text-white px-5 py-3 rounded-lg shadow-xl border border-slate-700 flex items-center gap-5 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center gap-2.5 text-xs font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
            <span>Unsaved permissions matrix changes detected</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSelectedPermissions(new Set(initialPermissions))}
            >
              Discard Changes
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Save className="w-3.5 h-3.5" />}
              isLoading={isSaving}
              onClick={handleSave}
            >
              Save Matrix
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
