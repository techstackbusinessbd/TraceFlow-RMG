import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Trash2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { userService, type UserItem } from '../../../services/userService';
import { alertService } from '../../../services/alertService';
import { Button } from '../../../components/common/Button';

export const UserDeletePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<UserItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;

    const loadUser = async () => {
      setIsLoading(true);
      try {
        const data = await userService.getUser(id);
        setUser(data);
      } catch (err: unknown) {
        const errorObj = err as { response?: { data?: { detail?: string } } };
        alertService.error('Loading Error', errorObj.response?.data?.detail || 'Failed to load user information.');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [id]);

  const handleConfirmDelete = async () => {
    if (!id) return;
    setIsDeleting(true);

    try {
      await userService.softDeleteUser(id);
      alertService.success('Deactivated', 'User account successfully moved to archive.');
      navigate('/admin/users');
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { detail?: string } } };
      alertService.error('Deactivation Error', errorObj.response?.data?.detail || 'Failed to deactivate account.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center text-slate-500">
        <div className="inline-flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent animate-spin"></div>
          <span>Loading user profile for review...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white border border-slate-200 text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">User Not Found</h2>
        <p className="text-sm text-slate-500">The requested account record could not be located.</p>
        <Link
          to="/admin/users"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700"
        >
          Return to Users Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back Link */}
      <div>
        <Link
          to="/admin/users"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Users Directory
        </Link>
      </div>

      {/* Confirmation Card */}
      <div className="bg-white border border-red-200 shadow-xs overflow-hidden">
        {/* Warning Banner */}
        <div className="bg-red-50 border-b border-red-200 p-5 flex items-start gap-4">
          <div className="p-2.5 bg-red-600 text-white shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-red-900">Confirm Account Deactivation (Tier-1 Soft Delete)</h1>
            <p className="text-xs text-red-700 mt-1 leading-relaxed">
              You are about to soft-delete this user account. This action revokes all active login sessions and moves the account to the Archived Trash directory.
            </p>
          </div>
        </div>

        {/* User Snapshot Details */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 border border-slate-200 text-sm">
            <div>
              <span className="text-xs text-slate-500 block">Employee ID</span>
              <span className="font-mono font-bold text-slate-900">{user.emp_id}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Username</span>
              <span className="font-mono text-blue-600">@{user.username}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Full Name</span>
              <span className="font-semibold text-slate-900">{user.name}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Assigned Role</span>
              <span className="font-medium text-slate-800">{user.roles?.[0]?.name || 'Standard User'}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Department</span>
              <span className="text-slate-800">{user.department || 'N/A'}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Corporate Email</span>
              <span className="text-slate-800">{user.email || 'None'}</span>
            </div>
          </div>

          {/* Compliance & Audit Guarantee */}
          <div className="p-4 bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-blue-950">
              <span>🛡️ Compliance Preservation:</span>
            </div>
            <p className="text-blue-800 leading-relaxed">
              All historical factory data generated by this user (QC defects, bundle barcodes, order signoffs) will remain 100% intact for buyer audit compliance. This account can be restored at any time by an administrator.
            </p>
          </div>

          {/* Buttons (Centralized Design System - STRICT) */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/admin/users')}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              isLoading={isDeleting}
              onClick={handleConfirmDelete}
              icon={<Trash2 className="w-4 h-4" />}
            >
              Deactivate & Archive Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
