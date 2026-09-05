import React, { useEffect, useState, useTransition, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  KeyRound, 
  Search, 
  ShieldCheck, 
  RotateCcw,
  Sparkles, 
  SlidersHorizontal, 
  Users, 
  CheckCircle2, 
  Lock 
} from 'lucide-react';
import { userService, type UserItem, type Role } from '../../../services/userService';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { PageHeader } from '../../../components/common/PageHeader';
import { DataTable, type ColumnDef } from '../../../components/common/DataTable';
import { UI_TOKENS } from '../../../config/designTokens';
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


  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const columns: ColumnDef<UserItem>[] = useMemo(
    () => [
      {
        key: 'emp_id',
        header: 'Employee ID',
        width: 'w-36',
        sortable: true,
        render: (user) => (
          <Badge variant="neutral" className="font-mono">
            {user.emp_id}
          </Badge>
        ),
      },
      {
        key: 'name',
        header: 'User Identity',
        width: 'w-[280px]',
        sortable: true,
        render: (user) => {
          const initials = getInitials(user.name);
          return (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-800 text-white font-bold text-xs flex items-center justify-center rounded-md shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <div className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate">{user.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">@{user.username}</div>
              </div>
            </div>
          );
        },
      },
      {
        key: 'assigned_role',
        header: 'Assigned Role',
        width: 'w-40',
        render: (user) => {
          const primaryRole = user.roles?.[0]?.name || 'No Role';
          return (
            <Badge variant="neutral" icon={<Lock className="w-3 h-3 text-slate-500 dark:text-slate-400" />}>
              {primaryRole}
            </Badge>
          );
        },
      },
      {
        key: 'direct_privileges',
        header: 'Direct Privilege Status',
        width: 'w-auto',
        render: (user) => {
          const directPerms = user.permissions || [];
          const hasDirectOverrides = directPerms.length > 0;

          return hasDirectOverrides ? (
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
          );
        },
      },
      {
        key: 'actions',
        header: 'Actions',
        width: 'w-52',
        align: 'right',
        render: (user) => (
          <Button
            variant="primary"
            size="sm"
            icon={<KeyRound className="w-3.5 h-3.5" />}
            onClick={() => navigate(`/admin/privileges/${user.username || user.id}`)}
          >
            Configure Privileges
          </Button>
        ),
      },
    ],
    [navigate]
  );

  // Quick Stats
  const usersWithOverridesCount = users.filter((u) => (u.permissions?.length ?? 0) > 0).length;

  return (
    <div className="space-y-6">
      {/* Mandatory Golden Standard Page Header */}
      <PageHeader
        title="Custom Privileges"
        badge={
          <Badge variant="neutral">
            {pagination.total} Users
          </Badge>
        }
        actions={
          <>
            <Button
              variant="secondary"
              icon={<Users className="w-4 h-4" />}
              onClick={() => navigate('/admin/users')}
            >
              Users Directory
            </Button>
            <Button
              variant="primary"
              icon={<ShieldCheck className="w-4 h-4" />}
              onClick={() => navigate('/admin/roles')}
            >
              Role Permissions
            </Button>
          </>
        }
      />

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
      {/* Mandatory Enterprise Filter Toolbar */}
      <div className={UI_TOKENS.filter.container}>
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Universal Text Search */}
          <div className="relative md:col-span-4">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Employee ID, Name, or Username..."
              className={`${UI_TOKENS.input.base} pl-9`}
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
              className={UI_TOKENS.input.select}
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
              className={UI_TOKENS.input.select}
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
          <div className="md:col-span-1">
            <select
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                setPage(1);
              }}
              className={UI_TOKENS.input.select}
            >
              <option value="">All Depts</option>
              <option value="Information Technology">IT</option>
              <option value="Executive Office">Executive</option>
              <option value="Quality Assurance">QA</option>
              <option value="Cutting & Marker">Cutting</option>
              <option value="Sewing Floor">Sewing</option>
              <option value="Finishing & Packing">Finishing</option>
              <option value="Store & Warehouse">Store</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="md:col-span-2 flex items-center gap-2">
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
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
        <div className={UI_TOKENS.filter.subline}>
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
              {[10, 15, 25, 50].map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* CENTRALIZED DESIGN DATATABLE */}
      <DataTable<UserItem>
        columns={columns}
        data={users}
        keyExtractor={(u) => u.id}
        isLoading={isLoading}
        emptyMessage="No user privilege records found."
        emptyIcon={<KeyRound className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />}
        emptyAction={
          <Button variant="secondary" size="sm" onClick={handleResetFilters}>
            Reset Filters
          </Button>
        }
        sortKey={sortBy}
        sortDir={sortDirection}
        onSort={(key, dir) => {
          setSortBy(key);
          setSortDirection(dir);
          setPage(1);
        }}
        serverPagination={{
          currentPage: page,
          totalPages: Math.max(pagination.last_page, 1),
          totalRecords: pagination.total,
          perPage: perPage,
          onPageChange: (newPage) => setPage(newPage),
          onPerPageChange: (newPerPage) => {
            setPerPage(newPerPage);
            setPage(1);
          },
        }}
      />
    </div>
  );
};
