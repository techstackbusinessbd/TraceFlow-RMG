import React, { useEffect, useState, useTransition } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  KeyRound, 
  Search, 
  ShieldCheck, 
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Sparkles,
  SlidersHorizontal,
  Users,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { userService, type UserItem, type Role } from '../../../services/userService';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { alertService } from '../../../services/alertService';

export const UserPrivilegesOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [, startTransition] = useTransition();

  const [users, setUsers] = useState<UserItem[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters & Sorting
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<string>('');
  const [overrideFilter, setOverrideFilter] = useState<string>(''); // '', 'true', 'false'
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
    try {
      const [userData, rolesData] = await Promise.all([
        userService.getUsers({
          search: searchTerm.trim() || undefined,
          role: selectedRole || undefined,
          department: selectedDept || undefined,
          has_overrides: overrideFilter !== '' ? overrideFilter : undefined,
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
      alertService.error('Directory Error', errorObj.response?.data?.detail || 'Failed to load privilege accounts directory.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, perPage, selectedRole, selectedDept, overrideFilter, sortBy, sortDirection]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedRole('');
    setSelectedDept('');
    setOverrideFilter('');
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

  // Quick Stats
  const usersWithOverridesCount = users.filter((u) => (u.permissions?.length ?? 0) > 0).length;

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
            <Link to="/admin/platform-overview" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Platform</Link>
            <span>/</span>
            <span className="text-slate-500 dark:text-slate-400">Access Control</span>
            <span>/</span>
            <span className="text-slate-800 dark:text-slate-200 font-semibold">Custom User Privileges</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Custom User Privileges Directory</h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-purple-100 dark:bg-purple-950/80 text-purple-900 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded-md">
              Direct Overrides Governance
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Audit and configure staff accounts that possess individual permissions supplementing or overriding standard role assignments.
          </p>
        </div>

        {/* Quick Navigation Links */}
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            icon={<Users className="w-4 h-4 text-slate-500 dark:text-slate-400" />}
            onClick={() => navigate('/admin/users')}
          >
            User Accounts
          </Button>

          <Button
            variant="primary"
            icon={<ShieldCheck className="w-4 h-4" />}
            onClick={() => navigate('/admin/roles')}
          >
            Role Permissions
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md p-4 shadow-xs">
          <div className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500">Total Registered Staff</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{pagination.total}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Active factory accounts</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md p-4 shadow-xs">
          <div className="text-xs font-bold uppercase text-blue-600 dark:text-blue-400">With Custom Overrides</div>
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-400 mt-1">{usersWithOverridesCount}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Accounts with direct user privileges</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md p-4 shadow-xs">
          <div className="text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400">Standard Role Defaults</div>
          <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">
            {Math.max(pagination.total - usersWithOverridesCount, 0)}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">100% role-governed access</div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* FILTER TOOLBAR */}
      {/* ==================================================================== */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-xs p-4 space-y-3">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Universal Text Search */}
          <div className="relative md:col-span-4">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Employee ID, Name, or Username..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          {/* Privilege Status Filter */}
          <div className="md:col-span-3">
            <select
              value={overrideFilter}
              onChange={(e) => {
                setOverrideFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 font-medium"
            >
              <option value="">All Privilege Types</option>
              <option value="true">With Direct Overrides Only</option>
              <option value="false">Standard Role Defaults Only</option>
            </select>
          </div>

          {/* Role Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 font-medium"
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
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 font-medium"
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

          {/* Action Buttons */}
          <div className="md:col-span-1 flex items-center gap-1.5">
            <Button
              type="submit"
              variant="primary"
              className="w-full"
            >
              Filter
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleResetFilters}
              title="Reset all filters"
              icon={<RotateCcw className="w-4 h-4" />}
            />
          </div>
        </form>

        {/* Quick Toolbar Subline */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span>
              Sorted by: <strong className="text-slate-800 dark:text-slate-200">{sortBy.toUpperCase()}</strong> ({sortDirection.toUpperCase()})
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
              className="px-2 py-1 text-xs border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium focus:outline-none"
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
      {/* PRIVILEGES OVERVIEW TABLE */}
      {/* ==================================================================== */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800">
                {renderSortHeader('emp_id', 'Employee ID', 'w-36')}
                {renderSortHeader('name', 'User Identity', 'w-[280px]')}
                <th className="py-3.5 px-4 w-40 font-semibold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Assigned Role
                </th>
                <th className="py-3.5 px-4 w-auto font-semibold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Direct Privilege Status
                </th>
                <th className="py-3.5 px-4 w-52 text-right font-semibold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm text-slate-700 dark:text-slate-300">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-slate-400 dark:text-slate-500">
                    <div className="inline-flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent animate-spin rounded-full"></div>
                      <span className="text-xs font-medium">Loading user privileges records...</span>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-slate-500 dark:text-slate-400">
                    <KeyRound className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                    <p className="font-semibold text-slate-800 dark:text-slate-200">No user privilege records found.</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Try changing your search terms or filter criteria.</p>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleResetFilters}
                      className="mt-3"
                    >
                      Reset Filters
                    </Button>
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const primaryRole = user.roles?.[0]?.name || 'No Role';
                  const directPerms = user.permissions || [];
                  const hasDirectOverrides = directPerms.length > 0;
                  const initials = getInitials(user.name);

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/90 dark:hover:bg-slate-800/50 transition-colors group">
                      {/* Employee ID */}
                      <td className="py-3.5 px-4 align-middle">
                        <Badge variant="neutral" className="font-mono">
                          {user.emp_id}
                        </Badge>
                      </td>

                      {/* User Identity */}
                      <td className="py-3.5 px-4 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-slate-800 text-white font-bold text-xs flex items-center justify-center rounded-md shrink-0">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate">{user.name}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">@{user.username}</div>
                          </div>
                        </div>
                      </td>

                      {/* Assigned Role */}
                      <td className="py-3.5 px-4 align-middle">
                        <Badge variant="neutral" icon={<Lock className="w-3 h-3 text-slate-500 dark:text-slate-400" />}>
                          {primaryRole}
                        </Badge>
                      </td>

                      {/* Direct Privilege Status */}
                      <td className="py-3.5 px-4 align-middle">
                        {hasDirectOverrides ? (
                          <div className="space-y-1">
                            <Badge variant="info" icon={<Sparkles className="w-3 h-3 text-blue-600 dark:text-blue-400" />}>
                              {directPerms.length} Direct Custom Privilege(s)
                            </Badge>
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate max-w-md">
                              {directPerms.map((p) => p.name).join(', ')}
                            </div>
                          </div>
                        ) : (
                          <Badge variant="neutral" icon={<CheckCircle2 className="w-3 h-3 text-slate-400 dark:text-slate-500" />}>
                            Standard Role Defaults (0 Overrides)
                          </Badge>
                        )}
                      </td>

                      {/* Action Button */}
                      <td className="py-3.5 px-4 text-right align-middle">
                        <Button
                          variant="primary"
                          size="sm"
                          icon={<KeyRound className="w-3.5 h-3.5" />}
                          onClick={() => navigate(`/admin/privileges/${user.username || user.id}`)}
                        >
                          Configure Privileges
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 gap-3 select-none">
          <div>
            Showing{' '}
            <strong className="text-slate-900 dark:text-slate-100 font-semibold">
              {pagination.total > 0 ? (page - 1) * perPage + 1 : 0}
            </strong>{' '}
            to{' '}
            <strong className="text-slate-900 dark:text-slate-100 font-semibold">
              {Math.min(page * perPage, pagination.total)}
            </strong>{' '}
            of <strong className="text-slate-900 dark:text-slate-100 font-semibold">{pagination.total}</strong> staff accounts
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="secondary"
              size="sm"
              disabled={page <= 1 || isLoading}
              onClick={() => setPage(page - 1)}
              icon={<ChevronLeft className="w-3.5 h-3.5" />}
            >
              Previous
            </Button>

            <span className="px-3 py-1.5 font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md">
              Page {page} of {Math.max(pagination.last_page, 1)}
            </span>

            <Button
              variant="secondary"
              size="sm"
              disabled={page >= pagination.last_page || isLoading}
              onClick={() => setPage(page + 1)}
              icon={<ChevronRight className="w-3.5 h-3.5" />}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
