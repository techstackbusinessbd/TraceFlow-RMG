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
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Mail,
  User as UserIcon,
  SlidersHorizontal,
  KeyRound
} from 'lucide-react';
import { userService, type UserItem, type Role } from '../../../services/userService';

export const UserListPage: React.FC = () => {
  const navigate = useNavigate();
  const [, startTransition] = useTransition();

  const [users, setUsers] = useState<UserItem[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filters and Sorting State
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('emp_id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [perPage, setPerPage] = useState<number>(15);
  const [page, setPage] = useState<number>(1);

  const [pagination, setPagination] = useState({
    total: 0,
    per_page: 15,
    current_page: 1,
    last_page: 1,
    from: 0,
    to: 0,
  });

  const fetchUsers = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const [userData, rolesData] = await Promise.all([
        userService.getUsers({
          search: searchTerm.trim() || undefined,
          role: selectedRole || undefined,
          department: selectedDept || undefined,
          is_active: selectedStatus !== '' ? selectedStatus : undefined,
          sort_by: sortBy,
          sort_direction: sortDirection,
          page,
          per_page: perPage,
        }),
        userService.getRoles(),
      ]);

      setUsers(userData.data);
      setPagination({
        total: userData.pagination.total,
        per_page: userData.pagination.per_page,
        current_page: userData.pagination.current_page,
        last_page: userData.pagination.last_page,
        from: userData.pagination.from ?? 0,
        to: userData.pagination.to ?? 0,
      });
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
  }, [page, perPage, selectedRole, selectedDept, selectedStatus, sortBy, sortDirection]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedRole('');
    setSelectedDept('');
    setSelectedStatus('');
    setSortBy('emp_id');
    setSortDirection('asc');
    setPerPage(15);
    setPage(1);
    startTransition(() => {
      fetchUsers();
    });
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
    setPage(1);
  };

  const renderSortHeader = (columnKey: string, label: string, extraClasses = '') => {
    const isSorted = sortBy === columnKey;
    return (
      <th
        onClick={() => handleSort(columnKey)}
        className={`py-3.5 px-4 cursor-pointer select-none group hover:bg-slate-100 transition-colors ${extraClasses}`}
        title={`Click to sort by ${label}`}
      >
        <div className="flex items-center gap-1.5 font-semibold text-xs text-slate-700 uppercase tracking-wider">
          <span>{label}</span>
          <span className="shrink-0">
            {isSorted ? (
              sortDirection === 'asc' ? (
                <ArrowUp className="w-3.5 h-3.5 text-blue-600 font-bold" />
              ) : (
                <ArrowDown className="w-3.5 h-3.5 text-blue-600 font-bold" />
              )
            ) : (
              <ArrowUpDown className="w-3 h-3 text-slate-300 group-hover:text-slate-500 transition-colors" />
            )}
          </span>
        </div>
      </th>
    );
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getRoleBadgeClasses = (role: string) => {
    if (role === 'Super Admin') return 'bg-purple-100 text-purple-900 border-purple-300';
    if (role === 'IT Admin') return 'bg-blue-100 text-blue-900 border-blue-300';
    if (role === 'CEO' || role === 'Managing Director') return 'bg-slate-800 text-white border-slate-800';
    if (role.includes('Quality') || role.includes('QA')) return 'bg-emerald-100 text-emerald-900 border-emerald-300';
    if (role.includes('Cutting')) return 'bg-amber-100 text-amber-900 border-amber-300';
    if (role.includes('Sewing')) return 'bg-sky-100 text-sky-900 border-sky-300';
    return 'bg-slate-100 text-slate-800 border-slate-300';
  };

  const getAvatarBadgeBg = (role: string) => {
    if (role === 'Super Admin') return 'bg-purple-700 text-white';
    if (role === 'IT Admin') return 'bg-blue-600 text-white';
    if (role === 'CEO' || role === 'Managing Director') return 'bg-slate-900 text-white';
    if (role.includes('Quality') || role.includes('QA')) return 'bg-emerald-700 text-white';
    if (role.includes('Cutting')) return 'bg-amber-700 text-white';
    if (role.includes('Sewing')) return 'bg-sky-700 text-white';
    return 'bg-slate-700 text-white';
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
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Enterprise User Directory</h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
              {pagination.total} Registered Accounts
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage factory operators, line supervisors, quality inspectors, and executive administration accounts.
          </p>
        </div>

        {/* Top Action Buttons (Flat Solid Colors - STRICT) */}
        <div className="flex items-center gap-3">
          <Link
            to="/admin/users/archived"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Archive className="w-4 h-4 text-slate-500" />
            <span>Archived Users</span>
          </Link>

          <Link
            to="/admin/users/create"
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-2xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New User</span>
          </Link>
        </div>
      </div>

      {/* Error Notice */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center justify-between">
          <span>{errorMessage}</span>
          <button type="button" onClick={() => setErrorMessage(null)} className="text-red-700 font-bold">✕</button>
        </div>
      )}

      {/* ==================================================================== */}
      {/* ENTERPRISE FILTER TOOLBAR */}
      {/* ==================================================================== */}
      <div className="bg-white border border-slate-200 shadow-xs p-4 space-y-3">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Universal Text Search */}
          <div className="relative md:col-span-4">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Employee ID, Name, Username, or Email..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Role Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-sm border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
            >
              <option value="">All Roles</option>
              {roles.map((r) => (
                <option key={r.id} value={r.name}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-sm border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
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

          {/* Status Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-sm border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
            >
              <option value="">All Statuses</option>
              <option value="true">Active Only</option>
              <option value="false">Inactive Only</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="md:col-span-2 flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Filter
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              title="Reset all filters"
              className="px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Quick Toolbar Subline */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span>
              Sorted by: <strong className="text-slate-800">{sortBy.toUpperCase()}</strong> ({sortDirection.toUpperCase()})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span>Show per page:</span>
            <select
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setPage(1);
              }}
              className="px-2 py-1 text-xs border border-slate-300 bg-white text-slate-800 font-medium focus:outline-none"
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* USERS DATA TABLE (PIXEL-PERFECT PROPORTIONS & SORTING) */}
      {/* ==================================================================== */}
      <div className="bg-white border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed">
            {/* Table Header with Explicit Widths */}
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {renderSortHeader('emp_id', 'Employee ID', 'w-40')}
                {renderSortHeader('name', 'User Details', 'w-[320px]')}
                <th className="py-3.5 px-4 w-44 font-semibold text-xs text-slate-700 uppercase tracking-wider">
                  Primary Role
                </th>
                {renderSortHeader('department', 'Department & Role', 'w-56')}
                {renderSortHeader('is_active', 'Status', 'w-32')}
                <th className="py-3.5 px-4 w-36 text-center font-semibold text-xs text-slate-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400">
                    <div className="inline-flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent animate-spin"></div>
                      <span className="text-xs font-medium">Loading enterprise directory records...</span>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-500">
                    <UserIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-800">No users found matching your criteria.</p>
                    <p className="text-xs text-slate-400 mt-1">Try resetting the search terms or department filters.</p>
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="mt-3 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors"
                    >
                      Reset All Filters
                    </button>
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const primaryRole = user.roles?.[0]?.name || 'No Role';
                  const isSuperAdmin = user.roles?.some((r) => r.name === 'Super Admin') || primaryRole === 'Super Admin';
                  const initials = getInitials(user.name);

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/90 transition-colors group">
                      {/* Employee ID */}
                      <td className="py-3.5 px-4 align-middle">
                        <span className="inline-block font-mono text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-800 border border-slate-300 shadow-2xs tracking-wide">
                          {user.emp_id}
                        </span>
                      </td>

                      {/* User Details with Avatar Initials */}
                      <td className="py-3.5 px-4 align-middle">
                        <div className="flex items-center gap-3">
                          {/* Initials Avatar Capsule */}
                          <div className={`w-9 h-9 shrink-0 flex items-center justify-center font-bold text-xs shadow-2xs select-none ${getAvatarBadgeBg(primaryRole)}`}>
                            {initials}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-slate-900 text-sm truncate leading-tight group-hover:text-blue-600 transition-colors">
                              {user.name}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 truncate">
                              <span className="font-mono text-blue-700 font-medium">@{user.username}</span>
                              {user.email && (
                                <>
                                  <span className="text-slate-300">•</span>
                                  <span className="flex items-center gap-1 text-slate-500 truncate" title={user.email}>
                                    <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                                    <span className="truncate">{user.email}</span>
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Primary Role */}
                      <td className="py-3.5 px-4 align-middle">
                        <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold border ${getRoleBadgeClasses(primaryRole)}`}>
                          {primaryRole === 'Super Admin' && (
                            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-purple-700 shrink-0" />
                          )}
                          <span>{primaryRole}</span>
                        </span>
                      </td>

                      {/* Department & Designation */}
                      <td className="py-3.5 px-4 align-middle">
                        <div className="text-slate-900 font-semibold text-xs truncate">
                          {user.department || 'General Plant Operations'}
                        </div>
                        <div className="text-slate-500 text-xs truncate mt-0.5">
                          {user.designation || 'Factory Staff'}
                        </div>
                      </td>

                      {/* Active Status */}
                      <td className="py-3.5 px-4 align-middle">
                        {user.is_active ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 border border-emerald-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Active</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 border border-slate-300">
                            <XCircle className="w-3.5 h-3.5 text-slate-400" />
                            <span>Inactive</span>
                          </span>
                        )}
                      </td>

                      {/* Row Actions (Fixed-Grid Alignment) */}
                      <td className="py-3.5 px-4 text-center align-middle">
                        <div className="inline-flex items-center justify-center gap-1.5">
                          {/* Custom Privileges Button */}
                          <button
                            type="button"
                            onClick={() => navigate(`/admin/users/${user.id}/permissions`)}
                            className="p-1.5 text-slate-600 hover:text-purple-700 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 transition-colors"
                            title="Manage User Custom Privileges"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Button */}
                          <button
                            type="button"
                            onClick={() => navigate(`/admin/users/${user.id}/edit`)}
                            className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition-colors"
                            title="Edit User Profile"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Button */}
                          {!isSuperAdmin ? (
                            <button
                              type="button"
                              onClick={() => navigate(`/admin/users/${user.id}/delete`)}
                              className="p-1.5 text-slate-600 hover:text-red-700 hover:bg-red-50 border border-slate-200 hover:border-red-300 transition-colors"
                              title="Soft Delete / Archive User"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <div className="w-[29px] h-[29px]" title="Super Admin is permanently protected" />
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

        {/* ==================================================================== */}
        {/* COMPREHENSIVE PAGINATION FOOTER */}
        {/* ==================================================================== */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 gap-3">
          <div>
            Showing{' '}
            <strong className="text-slate-900 font-semibold">
              {pagination.total > 0 ? (page - 1) * perPage + 1 : 0}
            </strong>{' '}
            to{' '}
            <strong className="text-slate-900 font-semibold">
              {Math.min(page * perPage, pagination.total)}
            </strong>{' '}
            of <strong className="text-slate-900 font-semibold">{pagination.total}</strong> total users
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={page <= 1 || isLoading}
              onClick={() => setPage(page - 1)}
              className="inline-flex items-center gap-1 px-3 py-1.5 font-medium text-slate-700 bg-white border border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Previous
            </button>

            <span className="px-3 py-1.5 font-semibold text-slate-800 bg-slate-100 border border-slate-300">
              Page {page} of {Math.max(pagination.last_page, 1)}
            </span>

            <button
              type="button"
              disabled={page >= pagination.last_page || isLoading}
              onClick={() => setPage(page + 1)}
              className="inline-flex items-center gap-1 px-3 py-1.5 font-medium text-slate-700 bg-white border border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors shadow-2xs"
            >
              Next
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
