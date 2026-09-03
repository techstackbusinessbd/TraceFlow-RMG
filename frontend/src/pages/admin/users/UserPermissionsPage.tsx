import React, { useEffect, useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Lock, 
  Sparkles, 
  Users, 
  Database, 
  ShoppingBag, 
  Scissors, 
  Activity, 
  CheckCircle2, 
  PackageCheck,
  FileText,
  RotateCcw,
  KeyRound
} from 'lucide-react';
import { userService, type UserPermissionsData } from '../../../services/userService';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { alertService } from '../../../services/alertService';

interface MatrixRow {
  id: string;
  resourceName: string;
  description: string;
  viewKey?: string;
  createKey?: string;
  editKey?: string;
  deleteKey?: string;
  specialKeys?: Array<{
    key: string;
    label: string;
    description: string;
    risk: 'neutral' | 'warning' | 'danger';
  }>;
}

export const UserPermissionsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [permissionsData, setPermissionsData] = useState<UserPermissionsData | null>(null);
  const [manifest, setManifest] = useState<Record<string, Record<string, string>>>({});
  const [directPermissions, setDirectPermissions] = useState<Set<string>>(new Set());
  const [initialDirectPermissions, setInitialDirectPermissions] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Active Selected Module in Master-Detail layout
  const [activeModule, setActiveModule] = useState<string>('User & Access Management');

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
        setInitialDirectPermissions(new Set(userData.direct_permissions));

        const moduleNames = Object.keys(manifestData);
        if (moduleNames.length > 0) {
          setActiveModule(moduleNames[0]);
        }
      } catch (err: unknown) {
        const errorObj = err as { response?: { data?: { detail?: string } } };
        alertService.error('Load Error', errorObj.response?.data?.detail || 'Failed to load user privileges matrix.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  const rolePermissionsSet = useMemo(() => {
    return new Set(permissionsData?.role_permissions || []);
  }, [permissionsData]);

  const hasUnsavedChanges = useMemo(() => {
    if (directPermissions.size !== initialDirectPermissions.size) return true;
    for (const p of directPermissions) {
      if (!initialDirectPermissions.has(p)) return true;
    }
    return false;
  }, [directPermissions, initialDirectPermissions]);

  const toggleDirectPermission = (permKey: string) => {
    // If the permission is already inherited by the role, we don't need a direct grant
    if (rolePermissionsSet.has(permKey)) return;

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

    try {
      const updated = await userService.updateUserPermissions(id, Array.from(directPermissions));
      setPermissionsData((prev) =>
        prev
          ? {
              ...prev,
              direct_permissions: updated.direct_permissions,
              all_permissions: updated.all_permissions,
            }
          : null
      );
      setDirectPermissions(new Set(updated.direct_permissions));
      setInitialDirectPermissions(new Set(updated.direct_permissions));
      alertService.success('Privileges Saved', 'User custom privileges have been updated and synced successfully.');
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { detail?: string } } };
      alertService.error('Save Failed', errorObj.response?.data?.detail || 'Failed to save custom privileges.');
    } finally {
      setIsSaving(false);
    }
  };

  // Module Stats
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
        if (isInherited) inherited++;
        if (isDirect && !isInherited) direct++;
        if (isInherited || isDirect) effective++;
      });

      stats[modName] = { total, direct, inherited, effective };
    });
    return stats;
  }, [manifest, rolePermissionsSet, directPermissions]);

  const getModuleIcon = (modName: string) => {
    switch (modName) {
      case 'User & Access Management':
        return <Users className="w-4 h-4 shrink-0" />;
      case 'Master Data Management':
        return <Database className="w-4 h-4 shrink-0" />;
      case 'Order Management & Planning':
        return <ShoppingBag className="w-4 h-4 shrink-0" />;
      case 'Cutting & QR Bundling':
        return <Scissors className="w-4 h-4 shrink-0" />;
      case 'Sewing Floor Tracking':
        return <Activity className="w-4 h-4 shrink-0" />;
      case 'Quality Control (QC)':
        return <CheckCircle2 className="w-4 h-4 shrink-0" />;
      case 'Finishing, Packing & Export':
        return <PackageCheck className="w-4 h-4 shrink-0" />;
      default:
        return <FileText className="w-4 h-4 shrink-0" />;
    }
  };

  // Matrix Row Structure
  const getModuleRows = (modName: string): MatrixRow[] => {
    switch (modName) {
      case 'User & Access Management':
        return [
          {
            id: 'users',
            resourceName: 'User Directory & Profiles',
            description: 'Employee login credentials, factory designations, and account status',
            viewKey: 'users.view',
            createKey: 'users.create',
            editKey: 'users.edit',
            deleteKey: 'users.delete',
            specialKeys: [
              {
                key: 'users.restore',
                label: 'Restore Account',
                description: 'Restore deactivated or archived users',
                risk: 'warning',
              },
              {
                key: 'users.force_delete',
                label: 'Purge Account',
                description: 'Permanent hard delete (Super Admin only)',
                risk: 'danger',
              },
            ],
          },
          {
            id: 'roles',
            resourceName: 'Roles & Authority Boundaries',
            description: 'Role catalog, custom roles, and module authorization matrices',
            viewKey: 'roles.view',
            createKey: 'roles.create',
            editKey: 'roles.edit',
            deleteKey: 'roles.delete',
          },
          {
            id: 'audit',
            resourceName: 'Forensic Audit Vault',
            description: 'Enterprise immutable WORM audit logs and security telemetry',
            viewKey: 'audit.view',
          },
        ];

      case 'Master Data Management':
        return [
          {
            id: 'master_data',
            resourceName: 'Core Garment Registry',
            description: 'Buyer accounts, brand styles, colorways, size matrices, and sewing line IDs',
            viewKey: 'master_data.view',
            createKey: 'master_data.create',
            editKey: 'master_data.edit',
            deleteKey: 'master_data.delete',
          },
        ];

      case 'Order Management & Planning':
        return [
          {
            id: 'orders',
            resourceName: 'Buyer Purchase Orders (PO)',
            description: 'Order quantities, export delivery schedules, and style mappings',
            viewKey: 'orders.view',
            createKey: 'orders.create',
            editKey: 'orders.edit',
            deleteKey: 'orders.delete',
          },
          {
            id: 'planning',
            resourceName: 'Line Allocation & Capacity Plans',
            description: 'Sewing line allocations, target daily output, and production scheduling',
            viewKey: 'planning.view',
            editKey: 'planning.edit',
          },
        ];

      case 'Cutting & QR Bundling':
        return [
          {
            id: 'cutting',
            resourceName: 'Spreading, Lays & Marker Plans',
            description: 'Fabric roll consumption, cutting orders, and marker lay efficiency',
            viewKey: 'cutting.view',
            createKey: 'cutting.create',
            specialKeys: [
              {
                key: 'cutting.bundle_generate',
                label: 'Generate QR Bundles',
                description: 'Generate and print single-piece QR bundle tickets',
                risk: 'neutral',
              },
            ],
          },
        ];

      case 'Sewing Floor Tracking':
        return [
          {
            id: 'sewing',
            resourceName: 'Real-time Bundle Flow Tracking',
            description: 'Monitor sewing line throughput, real-time pace, and workstation bottlenecks',
            viewKey: 'sewing.view',
            specialKeys: [
              {
                key: 'sewing.line_in',
                label: 'Scan Line-In',
                description: 'Scan bundle tickets entering sewing lines',
                risk: 'neutral',
              },
              {
                key: 'sewing.line_out',
                label: 'Scan Line-Out',
                description: 'Scan completed garments departing sewing lines',
                risk: 'neutral',
              },
            ],
          },
        ];

      case 'Quality Control (QC)':
        return [
          {
            id: 'qc',
            resourceName: 'Garment Inspection & Defect DHU',
            description: 'End-line quality boards, DHU analytics, and garment defect classification',
            viewKey: 'qc.view',
            specialKeys: [
              {
                key: 'qc.inspect',
                label: '100% Inspection',
                description: 'Perform 100% garment quality inspection scan',
                risk: 'neutral',
              },
              {
                key: 'qc.defect_log',
                label: 'Log Defect & Alteration',
                description: 'Record specific defect points and route garment to alteration line',
                risk: 'warning',
              },
            ],
          },
        ];

      case 'Finishing, Packing & Export':
        return [
          {
            id: 'finishing_packing',
            resourceName: 'Finishing, Cartons & Shipments',
            description: 'Iron and wash verification, carton scanning, and export invoice stuffing',
            viewKey: 'finishing.view',
            specialKeys: [
              {
                key: 'packing.view',
                label: 'View Packing Lists',
                description: 'View master carton packaging records',
                risk: 'neutral',
              },
              {
                key: 'packing.carton_scan',
                label: 'Carton Scan',
                description: 'Scan inspected garments into shipping cartons',
                risk: 'neutral',
              },
              {
                key: 'commercial.export',
                label: 'Export Clearance',
                description: 'Approve final container stuffing and export commercial invoices',
                risk: 'danger',
              },
            ],
          },
        ];

      default:
        return [];
    }
  };

  if (isLoading || !permissionsData) {
    return (
      <div className="py-24 text-center text-slate-500">
        <div className="inline-flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent animate-spin rounded-full" />
          <span className="text-sm font-semibold">Loading user privileges matrix...</span>
        </div>
      </div>
    );
  }

  const { user } = permissionsData;
  const currentRows = getModuleRows(activeModule);
  const currentStats = moduleStats[activeModule] || { total: 0, direct: 0, inherited: 0, effective: 0 };

  const renderCellStatus = (permKey?: string) => {
    if (!permKey) {
      return <span className="text-slate-300 font-mono text-xs select-none">—</span>;
    }

    const isInherited = rolePermissionsSet.has(permKey);
    const isDirect = directPermissions.has(permKey);

    if (isInherited) {
      return (
        <div
          title={`${permKey} is inherited from role (${user.roles[0] || 'Role'})`}
          className="w-7 h-7 mx-auto rounded-md inline-flex items-center justify-center bg-slate-100 border border-slate-300 text-slate-700 font-bold shadow-2xs select-none"
        >
          <Lock className="w-3.5 h-3.5 text-slate-600" />
        </div>
      );
    }

    if (isDirect) {
      return (
        <button
          type="button"
          title={`Click to remove direct override: ${permKey}`}
          onClick={() => toggleDirectPermission(permKey)}
          className="w-7 h-7 mx-auto rounded-md inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors shadow-2xs"
        >
          <Sparkles className="w-3.5 h-3.5" />
        </button>
      );
    }

    return (
      <button
        type="button"
        title={`Click to grant direct override: ${permKey}`}
        onClick={() => toggleDirectPermission(permKey)}
        className="w-7 h-7 mx-auto rounded-md inline-flex items-center justify-center bg-white hover:bg-slate-100 border border-slate-300 text-slate-300 hover:text-slate-600 transition-colors"
      >
        <span className="text-xs font-mono">+</span>
      </button>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
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
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              User Privileges: {user.name}
            </h1>
            <Badge variant="neutral" className="font-mono text-xs">
              @{user.username}
            </Badge>
            {user.roles.map((r) => (
              <Badge key={r} variant="info">
                Role: {r}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Configure direct user privilege overrides beyond the baseline inherited from their primary role.
          </p>
        </div>

        {/* Header Action Controls */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={handleResetToRoleDefaults}
            disabled={directPermissions.size === 0}
          >
            Reset to Role
          </Button>
          <Button
            variant="primary"
            icon={<Save className="w-4 h-4" />}
            isLoading={isSaving}
            onClick={handleSave}
          >
            Save Privileges
          </Button>
        </div>
      </div>

      {/* KPI Metrics Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Role Inherited
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">
              {rolePermissionsSet.size}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Locked baseline from role</div>
          </div>
          <div className="w-10 h-10 rounded-md bg-slate-100 flex items-center justify-center text-slate-600">
            <Lock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Direct Overrides
            </span>
            <div className="text-2xl font-bold text-blue-600 mt-1 font-mono">
              {directPermissions.size}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Explicit user-only gates</div>
          </div>
          <div className="w-10 h-10 rounded-md bg-blue-50 flex items-center justify-center text-blue-600">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Effective
            </span>
            <div className="text-2xl font-bold text-emerald-600 mt-1 font-mono">
              {new Set([...rolePermissionsSet, ...directPermissions]).size}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Active operational gates</div>
          </div>
          <div className="w-10 h-10 rounded-md bg-emerald-50 flex items-center justify-center text-emerald-600">
            <KeyRound className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* MASTER-DETAIL WORKSPACE: LEFT MODULE LIST + RIGHT MATRIX TABLE        */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ------------------------------------------------------------------ */}
        {/* LEFT COLUMN: SYSTEM MODULES LIST                                  */}
        {/* ------------------------------------------------------------------ */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-md shadow-2xs overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              System Modules ({Object.keys(manifest).length})
            </span>
            <span className="text-[11px] font-mono font-semibold text-slate-500">
              {new Set([...rolePermissionsSet, ...directPermissions]).size} Effective
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {Object.keys(manifest).map((modName) => {
              const isActive = activeModule === modName;
              const stats = moduleStats[modName] || { total: 0, direct: 0, inherited: 0, effective: 0 };
              const isFull = stats.effective === stats.total && stats.total > 0;

              return (
                <button
                  key={modName}
                  type="button"
                  onClick={() => setActiveModule(modName)}
                  className={`w-full text-left px-4 py-3.5 transition-colors flex items-center justify-between gap-3 ${
                    isActive
                      ? 'bg-slate-900 text-white font-bold'
                      : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={isActive ? 'text-blue-400' : 'text-slate-400'}>
                      {getModuleIcon(modName)}
                    </div>
                    <span className="text-sm truncate">{modName}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {stats.direct > 0 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-800 rounded-sm">
                        +{stats.direct}
                      </span>
                    )}
                    <Badge
                      variant={isActive ? 'root' : isFull ? 'success' : 'neutral'}
                      className="text-[11px] font-mono"
                    >
                      {stats.effective}/{stats.total}
                    </Badge>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* RIGHT COLUMN: ENTERPRISE PERMISSION MATRIX TABLE                   */}
        {/* ------------------------------------------------------------------ */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-md shadow-2xs overflow-hidden">
          
          {/* Module Toolbar & Legend */}
          <div className="bg-slate-50 border-b border-slate-200 px-5 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                <span className="text-blue-600">{getModuleIcon(activeModule)}</span>
                <span>{activeModule}</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Effective: {currentStats.effective} of {currentStats.total} gates ({currentStats.inherited} inherited, {currentStats.direct} direct overrides)
              </p>
            </div>

            {/* Visual Legend */}
            <div className="flex items-center gap-3 text-xs text-slate-600 shrink-0">
              <span className="inline-flex items-center gap-1">
                <Lock className="w-3 h-3 text-slate-500" />
                <span>Role Inherited</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-600" />
                <span>Direct Grant</span>
              </span>
            </div>
          </div>

          {/* Matrix Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-fixed">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-xs text-slate-700 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4 w-[240px]">Business Resource</th>
                  <th className="py-3 px-2 w-20 text-center">View</th>
                  <th className="py-3 px-2 w-20 text-center">Create</th>
                  <th className="py-3 px-2 w-20 text-center">Edit</th>
                  <th className="py-3 px-2 w-20 text-center">Delete</th>
                  <th className="py-3 px-4 w-60">Advanced Operations</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
                {currentRows.map((row) => {
                  return (
                    <tr key={row.id} className="hover:bg-slate-50/80 transition-colors group">
                      
                      {/* 1. Resource & Description */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="font-bold text-slate-900 text-sm">{row.resourceName}</div>
                        <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">{row.description}</div>
                      </td>

                      {/* 2. VIEW Action */}
                      <td className="py-3.5 px-2 text-center align-middle">
                        {renderCellStatus(row.viewKey)}
                      </td>

                      {/* 3. CREATE Action */}
                      <td className="py-3.5 px-2 text-center align-middle">
                        {renderCellStatus(row.createKey)}
                      </td>

                      {/* 4. EDIT Action */}
                      <td className="py-3.5 px-2 text-center align-middle">
                        {renderCellStatus(row.editKey)}
                      </td>

                      {/* 5. DELETE Action */}
                      <td className="py-3.5 px-2 text-center align-middle">
                        {renderCellStatus(row.deleteKey)}
                      </td>

                      {/* 6. Special / Advanced Actions */}
                      <td className="py-3.5 px-4 align-middle">
                        {row.specialKeys && row.specialKeys.length > 0 ? (
                          <div className="flex flex-col gap-1.5">
                            {row.specialKeys.map((sp) => {
                              const isInherited = rolePermissionsSet.has(sp.key);
                              const isDirect = directPermissions.has(sp.key);

                              return (
                                <button
                                  key={sp.key}
                                  type="button"
                                  disabled={isInherited}
                                  onClick={() => toggleDirectPermission(sp.key)}
                                  className={`px-2.5 py-1 text-xs font-semibold rounded-md border text-left transition-colors flex items-center justify-between gap-2 ${
                                    isInherited
                                      ? 'bg-slate-100 text-slate-700 border-slate-300 opacity-90 cursor-default'
                                      : isDirect
                                      ? 'bg-blue-50 text-blue-800 border-blue-300 shadow-2xs'
                                      : 'bg-white hover:bg-slate-50 text-slate-500 border-slate-200'
                                  }`}
                                  title={sp.description}
                                >
                                  <span className="truncate">{sp.label}</span>
                                  <span className="shrink-0">
                                    {isInherited ? (
                                      <Lock className="w-3 h-3 text-slate-500" />
                                    ) : isDirect ? (
                                      <Sparkles className="w-3 h-3 text-blue-600" />
                                    ) : (
                                      <span className="text-[10px] text-slate-400 font-mono">+</span>
                                    )}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs italic">Standard CRUD only</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Floating Sticky Save Dock */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 backdrop-blur-sm text-white px-5 py-3 rounded-lg shadow-xl border border-slate-700 flex items-center gap-5 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center gap-2.5 text-xs font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
            <span>Unsaved privilege override changes detected</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setDirectPermissions(new Set(initialDirectPermissions))}
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
              Save Privileges
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
