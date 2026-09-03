import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Trash2, AlertOctagon, ShieldX, KeyRound } from 'lucide-react';
import { userService, type UserItem } from '../../../services/userService';
import { alertService } from '../../../services/alertService';
import { Button } from '../../../components/common/Button';

export const UserPermanentDeletePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<UserItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPurging, setIsPurging] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

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

  const handlePurgeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setIsPurging(true);
    setPasswordError(null);

    try {
      await userService.forceDeleteUser(id, password);
      alertService.success('Purged', 'Account record permanently purged from database.');
      navigate('/admin/users/archived');
    } catch (err: unknown) {
      const errorObj = err as {
        response?: {
          status?: number;
          data?: {
            title?: string;
            detail?: string;
            errors?: { super_admin_password?: string[] };
          };
        };
      };

      if (errorObj.response?.status === 422 && errorObj.response.data?.errors?.super_admin_password) {
        setPasswordError(errorObj.response.data.errors.super_admin_password[0]);
      } else if (errorObj.response?.status === 409) {
        alertService.error('Referential Block', errorObj.response.data?.detail || 'Referential Integrity Block: Cannot purge user with linked compliance history.');
      } else {
        alertService.error('Authorization Error', errorObj.response?.data?.detail || 'Failed to authorize permanent purge operation.');
      }
    } finally {
      setIsPurging(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center text-slate-500">
        <div className="inline-flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-red-700 border-t-transparent animate-spin"></div>
          <span>Verifying security authorization...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white border border-slate-200 text-center space-y-4">
        <h2 className="text-lg font-bold text-slate-900">User Not Found</h2>
        <Link to="/admin/users/archived" className="text-blue-600 font-semibold hover:underline">
          Return to Archived Accounts
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Breadcrumb */}
      <div>
        <Link
          to="/admin/users/archived"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Archived Accounts
        </Link>
      </div>

      {/* Purge Card */}
      <div className="bg-white border-2 border-red-700 shadow-xs overflow-hidden">
        {/* Critical Header */}
        <div className="bg-red-800 text-white p-5 flex items-start gap-4">
          <div className="p-2.5 bg-red-950 text-red-200 shrink-0">
            <ShieldX className="w-7 h-7 text-white" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-300">
              Tier-2 Governance Directive
            </span>
            <h1 className="text-xl font-bold text-white mt-0.5">
              Permanent Hard Purge (Super Admin Only)
            </h1>
            <p className="text-xs text-red-200 mt-1 leading-relaxed">
              This action permanently deletes the user row from PostgreSQL. This is irreversible and cannot be undone.
            </p>
          </div>
        </div>

        {/* User Summary */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 border border-slate-200 text-sm">
            <div>
              <span className="text-xs text-slate-500 block">Employee ID</span>
              <span className="font-mono font-bold text-slate-900">{user.emp_id}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Username</span>
              <span className="font-mono text-slate-800">@{user.username}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Full Name</span>
              <span className="font-semibold text-slate-900">{user.name}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Department</span>
              <span className="text-slate-800">{user.department || 'General'}</span>
            </div>
          </div>

          {/* Warning Note */}
          <div className="p-4 bg-amber-50 border border-amber-300 text-amber-900 text-xs space-y-1.5">
            <div className="font-bold flex items-center gap-1 text-amber-950">
              <AlertOctagon className="w-4 h-4 text-amber-700" />
              <span>Production & Compliance Safeguard:</span>
            </div>
            <p className="text-amber-800 leading-relaxed">
              If this user has ever logged production records (Cutting Bundles, QC Alterations, Store Receipts, or Purchase Orders), the database will reject the purge to maintain buyer audit integrity.
            </p>
          </div>

          {/* Form (Pure Server Validation - noValidate) */}
          <form noValidate onSubmit={handlePurgeSubmit} className="space-y-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-red-700" />
                Confirm Your Super Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError(null);
                }}
                placeholder="Enter your current Super Admin password"
                className={`w-full px-3 py-2 text-sm border ${
                  passwordError ? 'border-red-500 bg-red-50/30' : 'border-slate-300'
                } focus:outline-none focus:border-red-700`}
              />
              {passwordError && (
                <p className="text-xs text-red-600 font-medium mt-1">{passwordError}</p>
              )}
            </div>

            {/* Action Buttons (Centralized Design System - STRICT) */}
            <div className="flex items-center justify-end gap-3 pt-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/admin/users/archived')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="danger"
                isLoading={isPurging}
                icon={<Trash2 className="w-4 h-4" />}
              >
                Permanently Purge Record
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
