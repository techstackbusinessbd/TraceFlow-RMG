import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  KeyRound, 
  ShieldAlert, 
  CheckCircle2, 
  Lock, 
  Info,
  Calendar,
  Building
} from 'lucide-react';
import { userService, type UserItem } from '../../../services/userService';
import { alertService } from '../../../services/alertService';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { PageHeader } from '../../../components/common/PageHeader';
import { UI_TOKENS } from '../../../config/designTokens';
import { formatDateTime } from '../../../utils/dateUtils';

export const UserResetPasswordPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<UserItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});

  const [formData, setFormData] = useState({
    password: '',
    password_confirmation: '',
    reason: '',
  });

  useEffect(() => {
    if (!id) return;

    const loadUser = async () => {
      setIsLoading(true);
      try {
        const userData = await userService.getUser(id);
        setUser(userData);
      } catch (err: unknown) {
        const errorObj = err as { response?: { data?: { detail?: string } } };
        alertService.error('Error', errorObj.response?.data?.detail || 'Failed to load user information.');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (serverErrors[name]) {
      setServerErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setIsSubmitting(true);
    setServerErrors({});

    try {
      const response = await userService.resetPassword(id, {
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        reason: formData.reason || undefined,
      });

      alertService.success('Password Reset', response.message || 'User password has been successfully updated.');
      navigate('/admin/users');
    } catch (err: unknown) {
      const errorObj = err as {
        response?: {
          status?: number;
          data?: {
            title?: string;
            detail?: string;
            errors?: Record<string, string[]>;
          };
        };
      };

      if (errorObj.response?.status === 422 && errorObj.response.data?.errors) {
        setServerErrors(errorObj.response.data.errors);
        alertService.error(
          'Validation Error',
          errorObj.response.data.detail || 'Please check the password requirements.'
        );
      } else {
        alertService.error(
          'Reset Failed',
          errorObj.response?.data?.detail || 'An unexpected error occurred while resetting password.'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Loading user security details...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 text-center">
        <p className="text-slate-500">User not found.</p>
        <Button variant="secondary" className="mt-4" onClick={() => navigate('/admin/users')}>
          Return to Users Directory
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Mandatory Standard Page Header */}
      <PageHeader
        title="Reset User Password"
        badge={
          <Badge variant="neutral" className="font-mono">
            {user.emp_id}
          </Badge>
        }
        actions={
          <>
            <Button
              type="button"
              variant="secondary"
              icon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => navigate('/admin/users')}
            >
              Users Directory
            </Button>
            <Button
              type="button"
              variant="primary"
              icon={<KeyRound className="w-4 h-4" />}
              isLoading={isSubmitting}
              onClick={handleSubmit}
            >
              Confirm Reset
            </Button>
          </>
        }
      />

      {/* ── Main 2-Column Layout ── */}
      <form noValidate onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* Left Side: Password Form Fields (8 Cols) */}
          <div className="lg:col-span-8 space-y-5">
            
            <div className={UI_TOKENS.card.base}>
              <div className={UI_TOKENS.card.header}>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    New Security Credentials
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">Cryptographically Hashed (Argon2ID/Bcrypt)</span>
              </div>

              <div className={`${UI_TOKENS.card.body} space-y-4`}>
                
                {/* Security Advisory Box */}
                <div className="p-3.5 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-300">
                  <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold">Immediate Credential Invalidation Notice</strong>
                    <span>
                      Resetting the password will immediately revoke any existing login sessions for user <strong>@{user.username}</strong> across factory tablets and web portals. If the user was locked out, resetting the password will also automatically unlock the account.
                    </span>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    New Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <KeyRound className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Minimum 8 characters..."
                      className={`${UI_TOKENS.input.base} pl-8.5 ${
                        serverErrors.password ? 'border-rose-500 bg-rose-50/20' : ''
                      }`}
                    />
                  </div>
                  {serverErrors.password && (
                    <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-1">
                      {serverErrors.password[0]}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Confirm New Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <KeyRound className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      name="password_confirmation"
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      placeholder="Re-type new password to confirm..."
                      className={`${UI_TOKENS.input.base} pl-8.5 ${
                        serverErrors.password_confirmation ? 'border-rose-500 bg-rose-50/20' : ''
                      }`}
                    />
                  </div>
                  {serverErrors.password_confirmation && (
                    <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-1">
                      {serverErrors.password_confirmation[0]}
                    </p>
                  )}
                </div>

                {/* Reset Reason */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Administrative Reset Reason (Optional - Logged in WORM Audit Vault)
                  </label>
                  <input
                    type="text"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    placeholder="e.g. Employee forgot credentials, quarterly rotation, security clearance update"
                    className={UI_TOKENS.input.base}
                  />
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                    This reason will be permanently sealed in the immutable audit log for compliance.
                  </p>
                </div>

              </div>
            </div>

          </div>

          {/* Right Side: User Security & Identity Sidebar (4 Cols) */}
          <div className="lg:col-span-4 space-y-5 sticky top-4">
            
            <div className={UI_TOKENS.card.base}>
              <div className="p-5 flex flex-col items-center text-center border-b border-slate-100 dark:border-slate-800">
                <div className="w-16 h-16 rounded-full bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center font-bold text-lg mb-3 shadow-sm border border-slate-200 dark:border-slate-700">
                  {user.name
                    ? user.name
                        .split(' ')
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((n) => n[0].toUpperCase())
                        .join('')
                    : 'U'}
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {user.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  @{user.username}
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5 justify-center">
                  <Badge variant="root">
                    {user.roles?.[0]?.name || 'Standard User'}
                  </Badge>
                  {user.is_active ? (
                    <Badge variant="success" icon={<CheckCircle2 className="w-3 h-3" />}>
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="danger">
                      Inactive
                    </Badge>
                  )}
                </div>
              </div>

              {/* Account Telemetry Info */}
              <div className="p-4 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5" /> Department
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-right truncate max-w-[160px]">
                    {user.department || 'General'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Registered
                  </span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">
                    {formatDateTime(user.created_at)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5" /> Lock Status
                  </span>
                  <span className={`font-semibold ${user.is_locked ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {user.is_locked ? 'Locked' : 'Unlocked'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 pt-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  icon={<KeyRound className="w-4 h-4" />}
                  isLoading={isSubmitting}
                >
                  Confirm Password Reset
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full"
                  onClick={() => navigate(`/admin/users/${user.id}/edit`)}
                >
                  Edit Profile Instead
                </Button>
              </div>
            </div>

          </div>

        </div>
      </form>
    </div>
  );
};
