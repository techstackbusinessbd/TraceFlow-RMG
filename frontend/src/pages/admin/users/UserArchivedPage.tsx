import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Archive, 
  RotateCcw, 
  Trash2, 
  CheckCircle2 
} from 'lucide-react';
import { userService, type UserItem } from '../../../services/userService';
import { useAuthStore } from '../../../store/authStore';

export const UserArchivedPage: React.FC = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuthStore();
  const isSuperAdmin = authUser?.roles?.includes('Super Admin');

  const [archivedUsers, setArchivedUsers] = useState<UserItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [restoringId, setRestoringId] = useState<string | null>(null);

  const fetchArchivedUsers = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await userService.getArchivedUsers();
      setArchivedUsers(response.data);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { detail?: string } } };
      setErrorMessage(errorObj.response?.data?.detail || 'Failed to load archived accounts.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArchivedUsers();
  }, []);

  const handleRestore = async (id: string) => {
    setRestoringId(id);
    setActionSuccess(null);
    setErrorMessage(null);

    try {
      const res = await userService.restoreUser(id);
      setActionSuccess(res.message || 'User account restored successfully.');
      await fetchArchivedUsers();
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { detail?: string } } };
      setErrorMessage(errorObj.response?.data?.detail || 'Failed to restore user account.');
    } finally {
      setRestoringId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation & Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <Link
            to="/admin/users"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Active Users Directory
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Archived User Accounts</h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-slate-200 text-slate-800">
              Trash Repository
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Deactivated accounts preserved for historical audit compliance. Accounts can be restored or purged.
          </p>
        </div>
      </div>

      {/* Success Alert */}
      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{actionSuccess}</span>
          </div>
          <button type="button" onClick={() => setActionSuccess(null)} className="text-emerald-700 font-bold">✕</button>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center justify-between">
          <span>{errorMessage}</span>
          <button type="button" onClick={() => setErrorMessage(null)} className="text-red-700 font-bold">✕</button>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Employee ID</th>
                <th className="py-3 px-4">User Details</th>
                <th className="py-3 px-4">Former Role</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Deactivation Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="inline-flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent animate-spin"></div>
                      <span>Loading archived repository...</span>
                    </div>
                  </td>
                </tr>
              ) : archivedUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <Archive className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-medium">No archived or deactivated users found.</p>
                    <p className="text-xs text-slate-400 mt-1">The trash repository is completely empty.</p>
                  </td>
                </tr>
              ) : (
                archivedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Employee ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-600 text-xs">
                      <span className="px-2 py-1 bg-slate-100 border border-slate-200">
                        {user.emp_id}
                      </span>
                    </td>

                    {/* User Info */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{user.name}</div>
                      <div className="text-xs text-slate-400 font-mono">@{user.username}</div>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                        {user.roles?.[0]?.name || 'Former Staff'}
                      </span>
                    </td>

                    {/* Department */}
                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      {user.department || 'N/A'}
                    </td>

                    {/* Deactivation Date */}
                    <td className="py-3.5 px-4 text-xs text-slate-500 font-mono">
                      {user.deleted_at ? new Date(user.deleted_at).toLocaleString() : 'Archived'}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        {/* Restore Button */}
                        <button
                          type="button"
                          disabled={restoringId === user.id}
                          onClick={() => handleRestore(user.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                          title="Restore this account"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          {restoringId === user.id ? 'Restoring...' : 'Restore'}
                        </button>

                        {/* Super Admin Permanent Purge Button */}
                        {isSuperAdmin && (
                          <button
                            type="button"
                            onClick={() => navigate(`/admin/users/${user.id}/permanent-delete`)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 transition-colors"
                            title="Super Admin Permanent Force Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Purge
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
