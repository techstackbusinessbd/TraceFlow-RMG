import React, { useEffect, useState, useTransition, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserPlus, 
  Archive, 
  Search, 
  ShieldCheck, 
  Shield,
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  RotateCcw,
  Mail, 
  User as UserIcon, 
  SlidersHorizontal, 
  KeyRound, 
  Lock, 
  Unlock, 
} from 'lucide-react';
import { userService, type UserItem, type Role } from '../../../services/userService';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { TableActionButton } from '../../../components/common/TableActionButton';
import { DataTable, type ColumnDef } from '../../../components/common/DataTable';
import { PageHeader } from '../../../components/common/PageHeader';
import { UI_TOKENS } from '../../../config/designTokens';
import { alertService } from '../../../services/alertService';

export const UserListPage: React.FC = () => {
  const navigate = useNavigate();
  const [, startTransition] = useTransition();

  const [users, setUsers] = useState<UserItem[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [unlockingUserId, setUnlockingUserId] = useState<string | null>(null);

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
      alertService.error('Directory Error', errorObj.response?.data?.detail || 'Failed to load user directory.');
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

  const handleUnlockUser = async (user: UserItem) => {
    try {
      setUnlockingUserId(user.id);
      const res = await userService.unlockUser(user.id);
      alertService.success('Account Unlocked', res.message || `Account for ${user.name} (${user.username}) has been unlocked successfully.`);
      fetchUsers();
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { detail?: string } } };
      alertService.error('Unlock Failed', errorObj.response?.data?.detail || 'Failed to unlock user account. Please try again.');
    } finally {
      setUnlockingUserId(null);
    }
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
        width: 'w-40',
        sortable: true,
        render: (user) => (
          <Badge variant="neutral" className="font-mono">
            {user.emp_id}
          </Badge>
        ),
      },
      {
        key: 'name',
        header: 'User Details',
        width: 'w-[320px]',
        sortable: true,
        render: (user) => {
          const isSuperAdmin = user.roles?.some((r) => r.name === 'Super Admin');
          const initials = getInitials(user.name);

          return (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-800 text-white font-bold text-xs flex items-center justify-center rounded-md shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <div className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate flex items-center gap-1.5">
                  <span>{user.name}</span>
                  {isSuperAdmin && (
                    <span className="px-1.5 py-0.2 bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 text-[10px] font-bold rounded-sm border border-purple-300 dark:border-purple-800">
                      Root
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                  <span className="font-mono">@{user.username}</span>
                  {user.email && (
                    <span className="inline-flex items-center gap-1 text-slate-400 dark:text-slate-500 truncate">
                      <Mail className="w-3 h-3 shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        key: 'primary_role',
        header: 'Primary Role',
        width: 'w-44',
        render: (user) => {
          const primaryRole = user.roles?.[0]?.name || 'Standard User';
          const isSuperAdmin = user.roles?.some((r) => r.name === 'Super Admin');

          return isSuperAdmin ? (
            <Badge variant="root" icon={<ShieldCheck className="w-3.5 h-3.5 text-purple-700 dark:text-purple-300 shrink-0" />}>
              {primaryRole}
            </Badge>
          ) : (
            <Badge variant="neutral">
              {primaryRole}
            </Badge>
          );
        },
      },
      {
        key: 'department',
        header: 'Department & Designation',
        width: 'w-56',
        sortable: true,
        render: (user) => (
          <div>
            <div className="text-slate-900 dark:text-slate-100 font-semibold text-xs truncate">
              {user.department || 'General Plant Operations'}
            </div>
            <div className="text-slate-500 dark:text-slate-400 text-xs truncate mt-0.5">
              {user.designation || 'Factory Staff'}
            </div>
          </div>
        ),
      },
      {
        key: 'is_active',
        header: 'Status',
        width: 'w-32',
        sortable: true,
        render: (user) => (
          user.is_locked ? (
            <Badge variant="danger" icon={<Lock className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />}>
              Locked
            </Badge>
          ) : user.is_active ? (
            <Badge variant="success" icon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />}>
              Active
            </Badge>
          ) : (
            <Badge variant="neutral" icon={<XCircle className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />}>
              Inactive
            </Badge>
          )
        ),
      },
      {
        key: 'actions',
        header: 'Actions',
        width: 'w-48',
        align: 'center',
        render: (user) => {
          const isSuperAdmin = user.roles?.some((r) => r.name === 'Super Admin');

          return (
            <div className="inline-flex items-center justify-center gap-1.5">
              {user.is_locked && (
                <TableActionButton
                  variant="warning"
                  icon={<Unlock className="w-3.5 h-3.5" />}
                  title="Unlock Account (Reset Failed Login Attempts)"
                  disabled={unlockingUserId === user.id}
                  onClick={() => handleUnlockUser(user)}
                />
              )}

              <TableActionButton
                variant="purple"
                icon={<Shield className="w-3.5 h-3.5" />}
                title="Manage User Custom Privileges & Overrides"
                onClick={() => navigate(`/admin/privileges/${user.username || user.id}`)}
              />

              <TableActionButton
                variant="base"
                icon={<Edit3 className="w-3.5 h-3.5" />}
                title="Edit User Profile"
                onClick={() => navigate(`/admin/users/${user.id}/edit`)}
              />

              <TableActionButton
                variant="warning"
                icon={<KeyRound className="w-3.5 h-3.5" />}
                title="Reset User Password"
                onClick={() => navigate(`/admin/users/${user.id}/reset-password`)}
              />

              {!isSuperAdmin ? (
                <TableActionButton
                  variant="danger"
                  icon={<Trash2 className="w-3.5 h-3.5" />}
                  title="Soft Delete / Archive User"
                  onClick={() => navigate(`/admin/users/${user.id}/delete`)}
                />
              ) : (
                <div className="w-8 h-8" title="Super Admin is permanently protected" />
              )}
            </div>
          );
        },
      },
    ],
    [unlockingUserId, navigate]
  );

  return (
    <div className="space-y-6">
      {/* Reusable Standard Page Header */}
      <PageHeader
        title="User Directory"
        badge={
          <Badge variant="neutral">
            {pagination.total} Users
          </Badge>
        }
        actions={
          <>
            <Button
              variant="secondary"
              icon={<Archive className="w-4 h-4 text-slate-500" />}
              onClick={() => navigate('/admin/users/archived')}
            >
              Archived Users
            </Button>

            <Button
              variant="primary"
              icon={<UserPlus className="w-4 h-4" />}
              onClick={() => navigate('/admin/users/create')}
            >
              Add New User
            </Button>
          </>
        }
      />

      {/* ==================================================================== */}
      {/* ENTERPRISE FILTER TOOLBAR */}
      {/* ==================================================================== */}
      <div className={UI_TOKENS.filter.container}>
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Universal Text Search */}
          <div className="relative md:col-span-4">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Employee ID, Name, Username, or Email..."
              className={`${UI_TOKENS.input.base} pl-9`}
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
          <div className="md:col-span-2">
            <select
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                setPage(1);
              }}
              className={UI_TOKENS.input.select}
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
              className={UI_TOKENS.input.select}
            >
              <option value="">All Statuses</option>
              <option value="true">Active Only</option>
              <option value="false">Inactive Only</option>
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
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
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
        emptyMessage="No users found matching your criteria."
        emptyIcon={<UserIcon className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />}
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
