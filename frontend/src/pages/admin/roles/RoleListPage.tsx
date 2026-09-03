import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Shield, 
  ShieldCheck, 
  Users, 
  Sliders, 
  Plus 
} from 'lucide-react';
import { userService, type Role } from '../../../services/userService';

export const RoleListPage: React.FC = () => {
  const navigate = useNavigate();

  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // New Role Form State
  const [showCreateCard, setShowCreateCard] = useState<boolean>(false);
  const [newRoleName, setNewRoleName] = useState<string>('');
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const fetchRoles = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await userService.getRoles();
      setRoles(data);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { detail?: string } } };
      setErrorMessage(errorObj.response?.data?.detail || 'Failed to load system roles.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

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
      await fetchRoles();
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
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Roles & Permissions Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Configure system role boundaries, module privileges, and granular operational permissions.
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setShowCreateCard(!showCreateCard)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {showCreateCard ? 'Hide Form' : 'Create Custom Role'}
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
          {errorMessage}
        </div>
      )}

      {/* Inline Creation Card (No Modals - Dedicated In-Page Panel) */}
      {showCreateCard && (
        <div className="p-5 bg-white border-2 border-blue-600 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Shield className="w-4 h-4 text-blue-600" />
            <span>Create New System Role</span>
          </div>

          {createError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {createError}
            </div>
          )}

          <form noValidate onSubmit={handleCreateRole} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <input
              type="text"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              placeholder="e.g. Fabric QA Specialist"
              className="flex-1 px-3 py-2 text-sm border border-slate-300 focus:outline-none focus:border-blue-600"
            />
            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={isCreating}
                className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isCreating ? 'Saving...' : 'Save Role'}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateCard(false)}
                className="px-3 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full py-16 text-center text-slate-400">
            <div className="inline-flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent animate-spin"></div>
              <span>Loading system roles registry...</span>
            </div>
          </div>
        ) : roles.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500">
            No system roles found.
          </div>
        ) : (
          roles.map((role) => {
            const isSuperAdmin = role.name === 'Super Admin';
            const permCount = role.permissions?.length || 0;

            return (
              <div
                key={role.id}
                className={`bg-white border p-5 shadow-xs flex flex-col justify-between ${
                  isSuperAdmin ? 'border-purple-300 bg-purple-50/20' : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-bold text-slate-900 text-base flex items-center gap-2">
                      <ShieldCheck className={`w-4 h-4 ${isSuperAdmin ? 'text-purple-600' : 'text-blue-600'}`} />
                      {role.name}
                    </span>
                    {isSuperAdmin ? (
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-200" title="Strictly one active user allowed">
                        Singleton (1 User)
                      </span>
                    ) : role.name === 'IT Admin' ? (
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200" title="Supports multiple administrators">
                        Multi-User Admin
                      </span>
                    ) : null}
                  </div>

                  <div className="space-y-1 text-xs text-slate-500 mt-3">
                    <div className="flex items-center justify-between">
                      <span>Assigned Active Users:</span>
                      <span className="font-semibold text-slate-800 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        {role.users_count ?? 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Granted Permissions:</span>
                      <span className="font-semibold text-slate-800">
                        {isSuperAdmin ? 'All Privileges (*)' : `${permCount} permissions`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Configure Action Button */}
                <div className="pt-4 mt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => navigate(`/admin/roles/${role.slug || role.id}/permissions`)}
                    className={`w-full py-2 px-3 text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                      isSuperAdmin
                        ? 'bg-purple-700 hover:bg-purple-800 text-white'
                        : 'bg-slate-800 hover:bg-slate-900 text-white'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    Configure Permissions Matrix
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
