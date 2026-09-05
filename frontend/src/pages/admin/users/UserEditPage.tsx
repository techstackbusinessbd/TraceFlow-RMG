import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  ShieldCheck, 
  Briefcase, 
  KeyRound, 
  Calendar, 
  CheckCircle2, 
  XCircle,
  Clock,
  Building,
  Mail,
  Phone,
  Fingerprint
} from 'lucide-react';
import { userService, type Role, type UserItem } from '../../../services/userService';
import { alertService } from '../../../services/alertService';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { PageHeader } from '../../../components/common/PageHeader';
import { UI_TOKENS } from '../../../config/designTokens';
import { formatDateTime } from '../../../utils/dateUtils';

export const UserEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [roles, setRoles] = useState<Role[]>([]);
  const [originalRole, setOriginalRole] = useState<string>('');
  const [userData, setUserData] = useState<UserItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    emp_id: '',
    username: '',
    name: '',
    email: '',
    password: '',
    phone: '',
    department: 'Information Technology',
    designation: '',
    role: '',
    is_active: true,
  });

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      setIsLoading(true);
      try {
        const [rolesList, user] = await Promise.all([
          userService.getRoles(),
          userService.getUser(id),
        ]);

        const userRole = user.roles?.[0]?.name || (rolesList[0]?.name ?? '');
        setRoles(rolesList);
        setOriginalRole(userRole);
        setUserData(user);
        setFormData({
          emp_id: user.emp_id,
          username: user.username,
          name: user.name,
          email: user.email || '',
          password: '',
          phone: user.phone || '',
          department: user.department || 'Information Technology',
          designation: user.designation || '',
          role: userRole,
          is_active: user.is_active,
        });
      } catch (err: unknown) {
        const errorObj = err as { response?: { data?: { detail?: string } } };
        alertService.error('Loading Error', errorObj.response?.data?.detail || 'Failed to load user information.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setHasUnsavedChanges(true);
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
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
      await userService.updateUser(id, {
        emp_id: formData.emp_id,
        username: formData.username,
        name: formData.name,
        email: formData.email,
        password: formData.password || undefined,
        phone: formData.phone,
        department: formData.department,
        designation: formData.designation,
        role: formData.role,
        is_active: formData.is_active,
      });
      setHasUnsavedChanges(false);
      alertService.success('Updated', 'User account successfully updated.');
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
          errorObj.response.data.detail || 'Please check the highlighted form errors.'
        );
      } else {
        alertService.error(
          'Update Failed',
          errorObj.response?.data?.detail || 'An unexpected error occurred while saving.'
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
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Loading user profile details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Mandatory Standard Page Header */}
      <PageHeader
        title="Edit User Account"
        badge={
          <div className="flex items-center gap-1.5">
            <Badge variant="neutral" className="font-mono">
              {formData.emp_id}
            </Badge>
            {hasUnsavedChanges && (
              <Badge variant="warning">
                Unsaved Changes
              </Badge>
            )}
          </div>
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
              icon={<Save className="w-4 h-4" />}
              isLoading={isSubmitting}
              onClick={handleSubmit}
            >
              Save Changes
            </Button>
          </>
        }
      />

      {/* ── Main 2-Column Premium Enterprise Layout ── */}
      <form noValidate onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* ═════════════════════════════════════════════════════════════ */}
          {/* LEFT SIDE: MAIN FORM SECTIONS (8 COLS) */}
          {/* ═════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-8 space-y-5">
            
            {/* Card 1: Factory & Login Identity */}
            <div className={UI_TOKENS.card.base}>
              <div className={UI_TOKENS.card.header}>
                <div className="flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    1. Factory & Login Identity
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">Core Authentication & ID</span>
              </div>

              <div className={`${UI_TOKENS.card.body} space-y-4`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Employee ID */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Employee ID <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="emp_id"
                      value={formData.emp_id}
                      onChange={handleChange}
                      placeholder="e.g. EMP-0001"
                      className={`${UI_TOKENS.input.base} font-mono ${
                        serverErrors.emp_id ? 'border-rose-500 bg-rose-50/20' : ''
                      }`}
                    />
                    {serverErrors.emp_id && (
                      <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-1">
                        {serverErrors.emp_id[0]}
                      </p>
                    )}
                  </div>

                  {/* Username */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      System Username <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="e.g. super.admin"
                      className={`${UI_TOKENS.input.base} font-mono ${
                        serverErrors.username ? 'border-rose-500 bg-rose-50/20' : ''
                      }`}
                    />
                    {serverErrors.username && (
                      <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-1">
                        {serverErrors.username[0]}
                      </p>
                    )}
                  </div>

                  {/* Full Legal Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Full Legal Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. System IT Administrator"
                      className={`${UI_TOKENS.input.base} ${
                        serverErrors.name ? 'border-rose-500 bg-rose-50/20' : ''
                      }`}
                    />
                    {serverErrors.name && (
                      <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-1">
                        {serverErrors.name[0]}
                      </p>
                    )}
                  </div>

                  {/* Corporate Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Corporate Email (Optional)
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. it.admin@traceflow.com"
                        className={`${UI_TOKENS.input.base} pl-8.5 ${
                          serverErrors.email ? 'border-rose-500 bg-rose-50/20' : ''
                        }`}
                      />
                    </div>
                    {serverErrors.email && (
                      <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-1">
                        {serverErrors.email[0]}
                      </p>
                    )}
                  </div>
                </div>

                {/* Password Management Link */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/60 dark:bg-slate-800/30 p-3.5 rounded-md border border-slate-200 dark:border-slate-700/60">
                  <div className="flex items-start gap-2.5">
                    <KeyRound className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                        Account Password & Access Security
                      </span>
                      <span className="text-[11px] text-slate-400 block">
                        Passwords are managed on a dedicated security page with audit logging and session invalidation.
                      </span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    icon={<KeyRound className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                    onClick={() => navigate(`/admin/users/${id}/reset-password`)}
                  >
                    Reset Password
                  </Button>
                </div>
              </div>
            </div>

            {/* Card 2: Department & Designation */}
            <div className={UI_TOKENS.card.base}>
              <div className={UI_TOKENS.card.header}>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    2. Organization & Department Placement
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">Factory Operations</span>
              </div>

              <div className={`${UI_TOKENS.card.body} space-y-4`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Department */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Operational Department <span className="text-rose-500">*</span>
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className={UI_TOKENS.input.select}
                    >
                      <option value="Information Technology">Information Technology</option>
                      <option value="Executive Office">Executive Office</option>
                      <option value="Quality Assurance">Quality Assurance</option>
                      <option value="Cutting & Marker">Cutting & Marker</option>
                      <option value="Sewing Floor">Sewing Floor</option>
                      <option value="Finishing & Packing">Finishing & Packing</option>
                      <option value="Store & Warehouse">Store & Warehouse</option>
                    </select>
                  </div>

                  {/* Designation */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Designation / Job Title
                    </label>
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      placeholder="e.g. Senior IT Administrator"
                      className={UI_TOKENS.input.base}
                    />
                  </div>

                  {/* Phone */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Direct Mobile Number (Optional)
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g. +8801700000000"
                        className={`${UI_TOKENS.input.base} pl-8.5 font-mono`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: System Role & Privileges */}
            <div className={UI_TOKENS.card.base}>
              <div className={UI_TOKENS.card.header}>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    3. System Privilege & Security Role
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">Access Control</span>
              </div>

              <div className={`${UI_TOKENS.card.body} space-y-3`}>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    System Role Privilege <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    disabled={originalRole === 'Super Admin'}
                    onChange={handleChange}
                    className={`${UI_TOKENS.input.select} ${
                      originalRole === 'Super Admin' ? 'opacity-70 cursor-not-allowed bg-slate-100 dark:bg-slate-800' : ''
                    }`}
                  >
                    {roles.map((r) => {
                      const isSuperAdminRole = r.name === 'Super Admin';
                      const isAllowed = originalRole === 'Super Admin' || !isSuperAdminRole;
                      return (
                        <option 
                          key={r.id} 
                          value={r.name}
                          disabled={!isAllowed}
                          className={!isAllowed ? 'text-slate-400 bg-slate-100' : ''}
                        >
                          {r.name} {!isAllowed ? '(Singleton: 1 account limit)' : ''}
                        </option>
                      );
                    })}
                  </select>

                  {originalRole === 'Super Admin' ? (
                    <p className="text-[11px] text-purple-700 dark:text-purple-400 font-medium mt-1.5 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Super Admin role is root-protected and cannot be demoted or re-assigned.
                    </p>
                  ) : (
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5">
                      Select appropriate operational role to assign factory floor permission bounds.
                    </p>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* ═════════════════════════════════════════════════════════════ */}
          {/* RIGHT SIDE: PROFILE CONTEXT & AUDIT SIDEBAR (4 COLS) */}
          {/* ═════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-4 space-y-5 sticky top-4">
            
            {/* User Live Profile Card */}
            <div className={UI_TOKENS.card.base}>
              <div className="p-5 flex flex-col items-center text-center border-b border-slate-100 dark:border-slate-800">
                <div className="w-16 h-16 rounded-full bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center font-bold text-lg mb-3 shadow-sm border border-slate-200 dark:border-slate-700">
                  {formData.name
                    ? formData.name
                        .split(' ')
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((n) => n[0].toUpperCase())
                        .join('')
                    : 'U'}
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {formData.name || 'User Profile'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  @{formData.username || 'username'}
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5 justify-center">
                  <Badge variant="root">
                    {formData.role || 'Standard User'}
                  </Badge>
                  {formData.is_active ? (
                    <Badge variant="success" icon={<CheckCircle2 className="w-3 h-3" />}>
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="danger" icon={<XCircle className="w-3 h-3" />}>
                      Inactive
                    </Badge>
                  )}
                </div>
              </div>

              {/* Status Toggle in Sidebar */}
              <div className="p-4 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    id="is_active_sidebar"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                      Account Access Active
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      Enables tablet login and dashboard access
                    </span>
                  </div>
                </label>
              </div>

              {/* Account Metadata Telemetry */}
              <div className="p-4 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5" /> Department
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-right truncate max-w-[160px]">
                    {formData.department}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Registered
                  </span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">
                    {userData?.created_at ? formatDateTime(userData.created_at) : 'N/A'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> Security Status
                  </span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {userData?.is_locked ? 'Locked Out' : 'Normal / Unlocked'}
                  </span>
                </div>
              </div>

              {/* Bottom Quick Save Trigger */}
              <div className="p-4 pt-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  icon={<Save className="w-4 h-4" />}
                  isLoading={isSubmitting}
                >
                  Save Changes
                </Button>
              </div>
            </div>

          </div>

        </div>
      </form>
    </div>
  );
};
