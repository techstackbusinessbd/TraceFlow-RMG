import React, { useEffect, useState, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Check, 
  CheckSquare, 
  Square, 
  Eye, 
  Users, 
  Database, 
  ShoppingBag, 
  Scissors, 
  Activity, 
  CheckCircle2, 
  PackageCheck,
  FileText
} from 'lucide-react';
import { userService, type Role } from '../../../services/userService';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';

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

  // Active Selected Module in Master-Detail layout
  const [activeModule, setActiveModule] = useState<string>('User & Access Management');

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

        // Default active module to first available
        const moduleNames = Object.keys(manifestData);
        if (moduleNames.length > 0) {
          setActiveModule(moduleNames[0]);
        }
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

  // Module Stats Calculator (granted vs total per module)
  const moduleStats = useMemo(() => {
    const stats: Record<string, { total: number; granted: number }> = {};
    Object.entries(manifest).forEach(([modName, perms]) => {
      const total = Object.keys(perms).length;
      let granted = 0;
      Object.keys(perms).forEach((key) => {
        if (selectedPermissions.has(key)) granted++;
      });
      stats[modName] = { total, granted };
    });
    return stats;
  }, [manifest, selectedPermissions]);

  // Module Icons mapping
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

  // Module Matrix Rows Definition (Business Entity vs CRUD Actions)
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

  // Quick Preset Actions for Active Module
  const selectAllInActiveModule = () => {
    const activePerms = manifest[activeModule];
    if (!activePerms) return;
    setSelectedPermissions((prev) => {
      const next = new Set(prev);
      Object.keys(activePerms).forEach((key) => next.add(key));
      return next;
    });
  };

  const deselectAllInActiveModule = () => {
    const activePerms = manifest[activeModule];
    if (!activePerms) return;
    setSelectedPermissions((prev) => {
      const next = new Set(prev);
      Object.keys(activePerms).forEach((key) => next.delete(key));
      return next;
    });
  };

  const selectReadOnlyInActiveModule = () => {
    const activePerms = manifest[activeModule];
    if (!activePerms) return;
    setSelectedPermissions((prev) => {
      const next = new Set(prev);
      Object.keys(activePerms).forEach((key) => {
        if (key.endsWith('.view') || key.endsWith('.read')) {
          next.add(key);
        } else {
          next.delete(key);
        }
      });
      return next;
    });
  };

  if (isLoading || !role) {
    return (
      <div className="py-24 text-center text-slate-500">
        <div className="inline-flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent animate-spin" />
          <span className="text-sm font-semibold">Loading system authorization matrix...</span>
        </div>
      </div>
    );
  }

  const isSuperAdmin = role.name === 'Super Admin';
  const currentRows = getModuleRows(activeModule);
  const currentStats = moduleStats[activeModule] || { total: 0, granted: 0 };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
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
              Permissions Matrix: {role.name}
            </h1>
            <Badge variant={isSuperAdmin ? 'root' : 'info'}>
              {selectedPermissions.size} Granted
            </Badge>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Configure module-level access and functional authorization boundaries for this role profile.
          </p>
        </div>

        {/* Header Action Controls */}
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

      {/* Success Alert Banner */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium rounded-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
          <button type="button" onClick={() => setSuccessMessage(null)} className="text-emerald-700 font-bold">✕</button>
        </div>
      )}

      {/* Error Alert Banner */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-sm font-medium rounded-md flex items-center justify-between">
          <span>{errorMessage}</span>
          <button type="button" onClick={() => setErrorMessage(null)} className="text-rose-700 font-bold">✕</button>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MASTER-DETAIL WORKSPACE: LEFT MODULE LIST + RIGHT MATRIX TABLE        */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ------------------------------------------------------------------ */}
        {/* LEFT COLUMN: SYSTEM MODULES NAVIGATION LIST                        */}
        {/* ------------------------------------------------------------------ */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-md shadow-2xs overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              System Modules ({Object.keys(manifest).length})
            </span>
            <span className="text-[11px] font-mono font-semibold text-slate-500">
              {selectedPermissions.size} Total Gates
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {Object.keys(manifest).map((modName) => {
              const isActive = activeModule === modName;
              const stats = moduleStats[modName] || { total: 0, granted: 0 };
              const isFull = stats.granted === stats.total && stats.total > 0;
              const isPartial = stats.granted > 0 && stats.granted < stats.total;

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

                  <Badge
                    variant={
                      isActive
                        ? 'root'
                        : isFull
                        ? 'success'
                        : isPartial
                        ? 'info'
                        : 'neutral'
                    }
                    className="text-[11px] shrink-0 font-mono"
                  >
                    {stats.granted}/{stats.total}
                  </Badge>
                </button>
              );
            })}
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* RIGHT COLUMN: ENTERPRISE PERMISSION MATRIX TABLE                   */}
        {/* ------------------------------------------------------------------ */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-md shadow-2xs overflow-hidden space-y-0">
          
          {/* Module Toolbar & Quick Presets */}
          <div className="bg-slate-50 border-b border-slate-200 px-5 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                <span className="text-blue-600">{getModuleIcon(activeModule)}</span>
                <span>{activeModule}</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Authorized {currentStats.granted} of {currentStats.total} security gates in this module
              </p>
            </div>

            {/* 1-Click Action Presets */}
            <div className="flex items-center gap-1.5 flex-wrap shrink-0">
              <Button
                variant="subtle"
                size="sm"
                icon={<CheckSquare className="w-3.5 h-3.5" />}
                onClick={selectAllInActiveModule}
              >
                All ({currentStats.total})
              </Button>
              <Button
                variant="subtle"
                size="sm"
                icon={<Eye className="w-3.5 h-3.5" />}
                onClick={selectReadOnlyInActiveModule}
              >
                Read-Only
              </Button>
              <Button
                variant="subtle"
                size="sm"
                icon={<Square className="w-3.5 h-3.5" />}
                onClick={deselectAllInActiveModule}
              >
                Clear
              </Button>
            </div>
          </div>

          {/* Clean Dense Enterprise Matrix Table */}
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
                        {row.viewKey ? (
                          <button
                            type="button"
                            title={`Toggle ${row.viewKey}`}
                            onClick={() => togglePermission(row.viewKey!)}
                            className={`w-7 h-7 mx-auto rounded-md inline-flex items-center justify-center transition-colors shadow-2xs ${
                              selectedPermissions.has(row.viewKey)
                                ? 'bg-blue-600 text-white font-bold'
                                : 'bg-white hover:bg-slate-100 border border-slate-300 text-slate-300 hover:text-slate-500'
                            }`}
                          >
                            {selectedPermissions.has(row.viewKey) ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <span className="text-xs font-mono">—</span>
                            )}
                          </button>
                        ) : (
                          <span className="text-slate-300 font-mono text-xs select-none">—</span>
                        )}
                      </td>

                      {/* 3. CREATE Action */}
                      <td className="py-3.5 px-2 text-center align-middle">
                        {row.createKey ? (
                          <button
                            type="button"
                            title={`Toggle ${row.createKey}`}
                            onClick={() => togglePermission(row.createKey!)}
                            className={`w-7 h-7 mx-auto rounded-md inline-flex items-center justify-center transition-colors shadow-2xs ${
                              selectedPermissions.has(row.createKey)
                                ? 'bg-emerald-600 text-white font-bold'
                                : 'bg-white hover:bg-slate-100 border border-slate-300 text-slate-300 hover:text-slate-500'
                            }`}
                          >
                            {selectedPermissions.has(row.createKey) ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <span className="text-xs font-mono">—</span>
                            )}
                          </button>
                        ) : (
                          <span className="text-slate-300 font-mono text-xs select-none">—</span>
                        )}
                      </td>

                      {/* 4. EDIT Action */}
                      <td className="py-3.5 px-2 text-center align-middle">
                        {row.editKey ? (
                          <button
                            type="button"
                            title={`Toggle ${row.editKey}`}
                            onClick={() => togglePermission(row.editKey!)}
                            className={`w-7 h-7 mx-auto rounded-md inline-flex items-center justify-center transition-colors shadow-2xs ${
                              selectedPermissions.has(row.editKey)
                                ? 'bg-amber-500 text-white font-bold'
                                : 'bg-white hover:bg-slate-100 border border-slate-300 text-slate-300 hover:text-slate-500'
                            }`}
                          >
                            {selectedPermissions.has(row.editKey) ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <span className="text-xs font-mono">—</span>
                            )}
                          </button>
                        ) : (
                          <span className="text-slate-300 font-mono text-xs select-none">—</span>
                        )}
                      </td>

                      {/* 5. DELETE Action */}
                      <td className="py-3.5 px-2 text-center align-middle">
                        {row.deleteKey ? (
                          <button
                            type="button"
                            title={`Toggle ${row.deleteKey}`}
                            onClick={() => togglePermission(row.deleteKey!)}
                            className={`w-7 h-7 mx-auto rounded-md inline-flex items-center justify-center transition-colors shadow-2xs ${
                              selectedPermissions.has(row.deleteKey)
                                ? 'bg-rose-600 text-white font-bold'
                                : 'bg-white hover:bg-slate-100 border border-slate-300 text-slate-300 hover:text-slate-500'
                            }`}
                          >
                            {selectedPermissions.has(row.deleteKey) ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <span className="text-xs font-mono">—</span>
                            )}
                          </button>
                        ) : (
                          <span className="text-slate-300 font-mono text-xs select-none">—</span>
                        )}
                      </td>

                      {/* 6. Special / Advanced Action Badges */}
                      <td className="py-3.5 px-4 align-middle">
                        {row.specialKeys && row.specialKeys.length > 0 ? (
                          <div className="flex flex-col gap-1.5">
                            {row.specialKeys.map((sp) => {
                              const isGranted = selectedPermissions.has(sp.key);
                              return (
                                <button
                                  key={sp.key}
                                  type="button"
                                  onClick={() => togglePermission(sp.key)}
                                  className={`px-2.5 py-1 text-xs font-semibold rounded-md border text-left transition-colors flex items-center justify-between gap-2 ${
                                    isGranted
                                      ? sp.risk === 'danger'
                                        ? 'bg-rose-50 text-rose-800 border-rose-300 shadow-2xs'
                                        : sp.risk === 'warning'
                                        ? 'bg-amber-50 text-amber-800 border-amber-300 shadow-2xs'
                                        : 'bg-blue-50 text-blue-800 border-blue-300 shadow-2xs'
                                      : 'bg-white hover:bg-slate-50 text-slate-500 border-slate-200'
                                  }`}
                                  title={sp.description}
                                >
                                  <span className="truncate">{sp.label}</span>
                                  <span
                                    className={`w-4 h-4 rounded-sm flex items-center justify-center text-[10px] font-bold ${
                                      isGranted
                                        ? sp.risk === 'danger'
                                          ? 'bg-rose-600 text-white'
                                          : sp.risk === 'warning'
                                          ? 'bg-amber-600 text-white'
                                          : 'bg-blue-600 text-white'
                                        : 'border border-slate-300 text-transparent'
                                    }`}
                                  >
                                    ✓
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

      {/* ==================================================================== */}
      {/* FLOATING STICKY SAVE DOCK (DISCARD / SAVE ON ACTIVE UNSAVED EDITS)   */}
      {/* ==================================================================== */}
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
