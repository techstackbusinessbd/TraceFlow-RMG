import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Shield, 
  ShieldCheck, 
  Save, 
  CheckSquare, 
  Square, 
  CheckCircle2 
} from 'lucide-react';
import { userService, type Role } from '../../../services/userService';

export const RolePermissionsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [role, setRole] = useState<Role | null>(null);
  const [manifest, setManifest] = useState<Record<string, Record<string, string>>>({});
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
      } catch (err: unknown) {
        const errorObj = err as { response?: { data?: { detail?: string } } };
        setErrorMessage(errorObj.response?.data?.detail || 'Failed to load permissions matrix.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

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
      setSuccessMessage('Permissions matrix updated successfully.');
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { detail?: string } } };
      setErrorMessage(errorObj.response?.data?.detail || 'Failed to save permissions changes.');
    } finally {
      setIsSaving(false);
    }
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
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
              {selectedPermissions.size} Granted
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Check or uncheck functional permissions granted to accounts assigned this role.
          </p>
        </div>

        {/* Save Button (Flat Solid Blue - STRICT) */}
        <div className="flex items-center gap-3">
          <Link
            to="/admin/roles"
            className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-6 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving Matrix...' : 'Save Permissions'}
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

      {/* Module Permissions Matrix */}
      <div className="space-y-6">
        {Object.entries(manifest).map(([moduleName, permissions]) => {
          const permEntries = Object.entries(permissions);

          return (
            <div key={moduleName} className="bg-white border border-slate-200 shadow-xs overflow-hidden">
              {/* Module Group Header */}
              <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-slate-500" />
                  <span className="font-bold text-slate-900 text-sm">{moduleName}</span>
                  <span className="text-xs text-slate-400 font-medium">({permEntries.length} permissions)</span>
                </div>

                {/* Group Select All / Deselect All */}
                <div className="flex items-center gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => toggleModuleAll(permissions, true)}
                    className="text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    Select All
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    type="button"
                    onClick={() => toggleModuleAll(permissions, false)}
                    className="text-slate-500 hover:text-slate-700 font-semibold"
                  >
                    Deselect All
                  </button>
                </div>
              </div>

              {/* Permissions Checkbox Grid */}
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                {permEntries.map(([permKey, permDesc]) => {
                  const isChecked = selectedPermissions.has(permKey);

                  return (
                    <label
                      key={permKey}
                      onClick={() => togglePermission(permKey)}
                      className={`p-3 border flex items-start gap-3 cursor-pointer transition-colors select-none ${
                        isChecked
                          ? 'border-blue-300 bg-blue-50/40'
                          : 'border-slate-200 hover:bg-slate-50/70'
                      }`}
                    >
                      <div className="mt-0.5 text-blue-600 shrink-0">
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300" />
                        )}
                      </div>
                      <div className="text-xs">
                        <div className="font-mono font-bold text-slate-900">{permKey}</div>
                        <div className="text-slate-500 mt-0.5 leading-normal">{permDesc}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
