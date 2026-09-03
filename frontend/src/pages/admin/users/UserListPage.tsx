import React, { useEffect, useState, useTransition } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  UserPlus, 
  Archive, 
  Search, 
  ShieldCheck, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  RotateCcw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { userService, type UserItem, type Role } from '../../../services/userService';

export const UserListPage: React.FC = () => {
  const navigate = useNavigate();
  const [, startTransition] = useTransition();

  const [users, setUsers] = useState<UserItem[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [pagination, setPagination] = useState({
    total: 0,
    per_page: 15,
    current_page: 1,
    last_page: 1,
  });

  const fetchUsers = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const [userData, rolesData] = await Promise.all([
        userService.getUsers({
          search: searchTerm || undefined,
          role: selectedRole || undefined,
          department: selectedDept || undefined,
          page,
        }),
        userService.getRoles(),
      ]);

      setUsers(userData.data);
      setPagination(userData.pagination);
      setRoles(rolesData);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { detail?: string } } };
      setErrorMessage(errorObj.response?.data?.detail || 'Failed to load user directory.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, selectedRole, selectedDept]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedRole('');
    setSelectedDept('');
    setPage(1);
    startTransition(() => {
      fetchUsers();
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <Link to="/admin/platform-overview" className="hover:text-blue-600 transition-colors">Platform</Link>
            <span>/</span>
            <span className="text-slate-800">User Management</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Enterprise User Directory</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage factory operators, line supervisors, quality inspectors, and executive administration accounts.
          </p>
        </div>

        {/* Action Buttons (Flat Solid Colors - STRICT) */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            to="/admin/roles"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
            Roles & Permissions
          </Link>

          <Link
            to="/admin/users/archived"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-white bg-slate-700 hover:bg-slate-800 transition-colors"
          >
            <Archive className="w-4 h-4" />
            Archived Trash
          </Link>

          <Link
            to="/admin/users/create"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Add New User
          </Link>
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center justify-between">
          <span>{errorMessage}</span>
          <button 
            type="button" 
            onClick={() => setErrorMessage(null)} 
            className="text-red-500 hover:text-red-800 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 p-4 shadow-xs">
        <form noValidate onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Emp ID, username, name..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Role Filter */}
          <div>
            <select
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-sm border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-blue-600"
            >
              <option value="">All System Roles</option>
              {roles.map((r) => (
                <option key={r.id} value={r.name}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-sm border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-blue-600"
            >
              <option value="">All Departments</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Executive Office">Executive Office</option>
              <option value="Quality Assurance">Quality Assurance</option>
              <option value="Cutting & Marker">Cutting & Marker</option>
              <option value="Sewing Floor">Sewing Floor</option>
              <option value="Finishing & Packing">Finishing & Packing</option>
              <option value="Store & Warehouse">Store & Warehouse</option>
            </select>
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              title="Reset Filters"
              className="px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Users Data Table */}
      <div className="bg-white border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Employee ID</th>
                <th className="py-3 px-4">User Details</th>
                <th className="py-3 px-4">Primary Role</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="inline-flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent animate-spin"></div>
                      <span>Loading enterprise directory...</span>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <p className="font-medium">No users found matching the filter criteria.</p>
                    <p className="text-xs text-slate-400 mt-1">Try resetting the filters or add a new user account.</p>
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const primaryRole = user.roles?.[0]?.name || 'No Role';
                  const isSuperAdmin = user.username === 'super.admin';

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Employee ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-xs">
                        <span className="px-2 py-1 bg-slate-100 border border-slate-200">
                          {user.emp_id}
                        </span>
                      </td>

                      {/* User Details */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{user.name}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-blue-600">@{user.username}</span>
                          {user.email && (
                            <>
                              <span>•</span>
                              <span>{user.email}</span>
                            </>
                          )}
                        </div>
                      </td>

                      {/* Primary Role */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold ${
                          primaryRole === 'Super Admin'
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : primaryRole === 'IT Admin'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {primaryRole}
                        </span>
                      </td>

                      {/* Department & Designation */}
                      <td className="py-3.5 px-4">
                        <div className="text-slate-800 font-medium text-xs">{user.department || 'General Floor'}</div>
                        <div className="text-slate-400 text-xs">{user.designation || 'Staff'}</div>
                      </td>

                      {/* Active Status */}
                      <td className="py-3.5 px-4">
                        {user.is_active ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 border border-slate-200">
                            <XCircle className="w-3.5 h-3.5" />
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* Row Actions (Dedicated Pages - STRICT NO MODALS) */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => navigate(`/admin/users/${user.id}/edit`)}
                            className="p-1.5 text-blue-700 hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-colors"
                            title="Edit User"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {!isSuperAdmin && (
                            <button
                              type="button"
                              onClick={() => navigate(`/admin/users/${user.id}/delete`)}
                              className="p-1.5 text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors"
                              title="Delete / Deactivate User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {pagination.total > 0 && (
          <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500">
            <div>
              Showing <span className="font-semibold text-slate-700">{users.length}</span> of{' '}
              <span className="font-semibold text-slate-700">{pagination.total}</span> total users
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-slate-700 bg-white border border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Previous
              </button>
              <span className="px-2 font-medium text-slate-700">
                Page {page} of {pagination.last_page}
              </span>
              <button
                type="button"
                disabled={page >= pagination.last_page}
                onClick={() => setPage(page + 1)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-slate-700 bg-white border border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
