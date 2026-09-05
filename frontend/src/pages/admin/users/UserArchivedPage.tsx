import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Archive, 
  ArrowLeft, 
  RotateCcw, 
  Trash2, 
} from 'lucide-react';
import { userService, type UserItem } from '../../../services/userService';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { PageHeader } from '../../../components/common/PageHeader';
import { DataTable, type ColumnDef } from '../../../components/common/DataTable';
import { alertService } from '../../../services/alertService';
import { useAuthStore } from '../../../store/authStore';

export const UserArchivedPage: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const isSuperAdmin = currentUser?.roles?.includes('Super Admin');

  const [archivedUsers, setArchivedUsers] = useState<UserItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [restoringId, setRestoringId] = useState<string | null>(null);

  const fetchArchivedUsers = async () => {
    setIsLoading(true);
    try {
      const data = await userService.getArchivedUsers();
      setArchivedUsers(data.data || []);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { detail?: string } } };
      alertService.error('Failed to load archived users', errorObj.response?.data?.detail || 'Unable to retrieve archived accounts.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArchivedUsers();
  }, []);

  const handleRestore = async (id: string) => {
    setRestoringId(id);
    try {
      await userService.restoreUser(id);
      alertService.success('Account Restored', 'The user account has been successfully restored to active directory.');
      await fetchArchivedUsers();
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { detail?: string } } };
      alertService.error('Restore Failed', errorObj.response?.data?.detail || 'Failed to restore user account.');
    } finally {
      setRestoringId(null);
    }
  };

  const columns: ColumnDef<UserItem>[] = useMemo(
    () => [
      {
        key: 'emp_id',
        header: 'Employee ID',
        width: 'w-36',
        sortable: true,
        render: (u) => (
          <Badge variant="neutral" className="font-mono">
            {u.emp_id}
          </Badge>
        ),
      },
      {
        key: 'name',
        header: 'User Details',
        sortable: true,
        render: (u) => (
          <div>
            <div className="font-semibold text-slate-900 dark:text-slate-100">{u.name}</div>
            <div className="text-xs text-slate-400 dark:text-slate-500 font-mono">@{u.username}</div>
          </div>
        ),
      },
      {
        key: 'roles',
        header: 'Former Role',
        width: 'w-40',
        render: (u) => (
          <Badge variant="neutral">
            {u.roles?.[0]?.name || 'Former Staff'}
          </Badge>
        ),
      },
      {
        key: 'department',
        header: 'Department',
        width: 'w-44',
        sortable: true,
        render: (u) => (
          <span className="text-xs text-slate-600 dark:text-slate-400">
            {u.department || 'N/A'}
          </span>
        ),
      },
      {
        key: 'deleted_at',
        header: 'Deactivation Date',
        width: 'w-48',
        sortable: true,
        render: (u) => (
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            {u.deleted_at ? new Date(u.deleted_at).toLocaleString() : 'Archived'}
          </span>
        ),
      },
      {
        key: 'actions',
        header: 'Actions',
        width: 'w-48',
        align: 'right',
        render: (u) => (
          <div className="inline-flex items-center justify-end gap-2">
            <Button
              variant="primary"
              size="sm"
              disabled={restoringId === u.id}
              isLoading={restoringId === u.id}
              onClick={() => handleRestore(u.id)}
              icon={<RotateCcw className="w-3.5 h-3.5" />}
              title="Restore this account"
            >
              Restore
            </Button>

            {isSuperAdmin && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => navigate(`/admin/users/${u.id}/permanent-delete`)}
                icon={<Trash2 className="w-3.5 h-3.5" />}
                title="Super Admin Permanent Force Delete"
              >
                Purge
              </Button>
            )}
          </div>
        ),
      },
    ],
    [restoringId, isSuperAdmin, navigate]
  );

  return (
    <div className="space-y-6">
      {/* Mandatory Standard Page Header */}
      <PageHeader
        title="Archived Accounts"
        badge={
          <Badge variant="neutral">
            {archivedUsers.length} Archived
          </Badge>
        }
        actions={
          <Button
            variant="secondary"
            icon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate('/admin/users')}
          >
            Users Directory
          </Button>
        }
      />

      {/* Centralized Design DataTable */}
      <DataTable<UserItem>
        columns={columns}
        data={archivedUsers}
        keyExtractor={(u) => u.id}
        isLoading={isLoading}
        emptyMessage="No archived or deactivated users found. The trash repository is completely empty."
        emptyIcon={<Archive className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />}
        initialSortKey="deleted_at"
        initialSortDir="desc"
        defaultPerPage={10}
      />
    </div>
  );
};
