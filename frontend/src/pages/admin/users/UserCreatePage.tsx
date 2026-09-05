import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  UserPlus, 
  Fingerprint, 
  Briefcase, 
  ShieldCheck, 
  KeyRound, 
  Mail, 
  Phone, 
  Building,
  User,
  CheckCircle2,
  Eye,
  EyeOff,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { userService, type Role } from '../../../services/userService';
import { alertService } from '../../../services/alertService';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { PageHeader } from '../../../components/common/PageHeader';
import { UI_TOKENS } from '../../../config/designTokens';

type TabKey = 'identity' | 'placement' | 'security';

export const UserCreatePage: React.FC = () => {
  const navigate = useNavigate();

  const [roles, setRoles] = useState<Role[]>([]);
  const [activeTab, setActiveTab] = useState<TabKey>('identity');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState({
    emp_id: '',
    username: '',
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    department: 'Information Technology',
    designation: '',
    role: '',
    is_active: true,
  });

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const data = await userService.getRoles();
        setRoles(data);
        const defaultRole = data.find((r) => r.name === 'IT Admin') || data.find((r) => r.name !== 'Super Admin') || data[0];
        if (defaultRole) {
          setFormData((prev) => ({ ...prev, role: defaultRole.name }));
        }
      } catch {
        alertService.error('Loading Error', 'Failed to load system roles list.');
      }
    };
    loadRoles();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
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

  // Determine which tabs have errors
  const tabErrors = useMemo(() => {
    const errors: Record<TabKey, number> = { identity: 0, placement: 0, security: 0 };
    if (
      serverErrors.emp_id ||
      serverErrors.username ||
      serverErrors.name ||
      serverErrors.email ||
      serverErrors.password ||
      serverErrors.password_confirmation
    ) {
      errors.identity = [
        serverErrors.emp_id,
        serverErrors.username,
        serverErrors.name,
        serverErrors.email,
        serverErrors.password,
        serverErrors.password_confirmation,
      ].filter(Boolean).length;
    }
    if (serverErrors.department || serverErrors.designation || serverErrors.phone) {
      errors.placement = [serverErrors.department, serverErrors.designation, serverErrors.phone].filter(Boolean).length;
    }
    if (serverErrors.role || serverErrors.is_active) {
      errors.security = [serverErrors.role, serverErrors.is_active].filter(Boolean).length;
    }
    return errors;
  }, [serverErrors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setServerErrors({});

    try {
      await userService.createUser(formData);
      alertService.success('Created', 'User account successfully registered.');
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
        
        // Auto-switch to first tab containing error
        const errKeys = Object.keys(errorObj.response.data.errors);
        if (errKeys.some(k => ['emp_id', 'username', 'name', 'email', 'password'].includes(k))) {
          setActiveTab('identity');
        } else if (errKeys.some(k => ['department', 'designation', 'phone'].includes(k))) {
          setActiveTab('placement');
        } else if (errKeys.some(k => ['role', 'is_active'].includes(k))) {
          setActiveTab('security');
        }

        alertService.error(
          'Validation Error',
          errorObj.response.data.detail || 'Validation failed. Please correct the highlighted errors.'
        );
      } else {
        alertService.error(
          'Creation Error',
          errorObj.response?.data?.detail || 'An unexpected error occurred while creating the account.'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Mandatory Standard Page Header */}
      <PageHeader
        title="Create User Account"
        badge={
          <Badge variant="info">
            Step Navigation
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
              icon={<UserPlus className="w-4 h-4" />}
              isLoading={isSubmitting}
              onClick={handleSubmit}
            >
              Register Account
            </Button>
          </>
        }
      />

      {/* ── Enterprise Tab Navigation Bar ── */}
      <div className={UI_TOKENS.tab.container}>
        <button
          type="button"
          onClick={() => setActiveTab('identity')}
          className={activeTab === 'identity' ? UI_TOKENS.tab.itemActive : UI_TOKENS.tab.itemInactive}
        >
          <Fingerprint className="w-3.5 h-3.5" />
          <span>1. Identity & Login</span>
          {tabErrors.identity > 0 && (
            <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
              {tabErrors.identity}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('placement')}
          className={activeTab === 'placement' ? UI_TOKENS.tab.itemActive : UI_TOKENS.tab.itemInactive}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>2. Department Placement</span>
          {tabErrors.placement > 0 && (
            <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
              {tabErrors.placement}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={activeTab === 'security' ? UI_TOKENS.tab.itemActive : UI_TOKENS.tab.itemInactive}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>3. Role & Account State</span>
          {tabErrors.security > 0 && (
            <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
              {tabErrors.security}
            </span>
          )}
        </button>
      </div>

      {/* ── Main Tabbed Form Body ── */}
      <form noValidate onSubmit={handleSubmit}>
        <div className={UI_TOKENS.card.base}>
          
          {/* TAB 1: IDENTITY & LOGIN */}
          {activeTab === 'identity' && (
            <div className="p-6 space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    Primary Identity & Credentials
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Badge number, full legal name, and login authentication secret.
                  </p>
                </div>
                <Badge variant="neutral">Step 1 of 3</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Employee ID */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Employee ID <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Fingerprint className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      name="emp_id"
                      value={formData.emp_id}
                      onChange={handleChange}
                      placeholder="e.g. EMP-10492"
                      className={`${UI_TOKENS.input.base} pl-8.5 font-mono ${
                        serverErrors.emp_id ? 'border-rose-500 bg-rose-50/20' : ''
                      }`}
                    />
                  </div>
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
                  <div className="relative">
                    <span className="text-xs font-mono font-bold text-slate-400 absolute left-3 top-2.5">@</span>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="e.g. supervisor_01"
                      className={`${UI_TOKENS.input.base} pl-7 font-mono ${
                        serverErrors.username ? 'border-rose-500 bg-rose-50/20' : ''
                      }`}
                    />
                  </div>
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
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Mohammad Rafiqul Islam"
                      className={`${UI_TOKENS.input.base} pl-8.5 ${
                        serverErrors.name ? 'border-rose-500 bg-rose-50/20' : ''
                      }`}
                    />
                  </div>
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
                      placeholder="e.g. rafiqul@traceflow.com"
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

              {/* Password & Confirm Password */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Initial Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Initial Security Password <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] font-medium text-slate-400">
                      {formData.password.length >= 8 ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Ready (8+ chars)
                        </span>
                      ) : (
                        'Min 8 chars'
                      )}
                    </span>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter strong 8+ character secret..."
                      className={`${UI_TOKENS.input.base} pl-8.5 pr-10 ${
                        serverErrors.password ? 'border-rose-500 bg-rose-50/20' : ''
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {serverErrors.password && (
                    <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-1">
                      {serverErrors.password[0]}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Confirm Security Password <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] font-medium text-slate-400">
                      {formData.password_confirmation && formData.password === formData.password_confirmation ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Matched
                        </span>
                      ) : (
                        formData.password_confirmation && 'Must match password'
                      )}
                    </span>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="password_confirmation"
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      placeholder="Re-type password to confirm..."
                      className={`${UI_TOKENS.input.base} pl-8.5 pr-10 ${
                        serverErrors.password_confirmation ? 'border-rose-500 bg-rose-50/20' : ''
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                      title={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {serverErrors.password_confirmation && (
                    <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-1">
                      {serverErrors.password_confirmation[0]}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DEPARTMENT & DESIGNATION */}
          {activeTab === 'placement' && (
            <div className="p-6 space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    Organization & Department Placement
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Assign the operational department, job title, and direct contact details.
                  </p>
                </div>
                <Badge variant="neutral">Step 2 of 3</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Department */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Operational Department <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Building className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className={`${UI_TOKENS.input.select} pl-8.5`}
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
                </div>

                {/* Designation */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Designation / Job Title
                  </label>
                  <div className="relative">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      placeholder="e.g. Senior Line Supervisor"
                      className={`${UI_TOKENS.input.base} pl-8.5`}
                    />
                  </div>
                </div>

                {/* Mobile Number */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Contact Mobile Number (Optional)
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
          )}

          {/* TAB 3: SYSTEM ROLE & ACCOUNT STATUS */}
          {activeTab === 'security' && (
            <div className="p-6 space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    System Role Privileges & Account State
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Define access permission boundaries and activation state.
                  </p>
                </div>
                <Badge variant="neutral">Step 3 of 3</Badge>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    System Role Privilege <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className={`${UI_TOKENS.input.select} pl-8.5 ${
                        serverErrors.role ? 'border-rose-500 bg-rose-50/20' : ''
                      }`}
                    >
                      {roles.map((r) => {
                        const isSuperAdmin = r.name === 'Super Admin';
                        return (
                          <option 
                            key={r.id} 
                            value={r.name}
                            disabled={isSuperAdmin}
                            className={isSuperAdmin ? 'text-slate-400 bg-slate-100 dark:bg-slate-800' : ''}
                          >
                            {r.name} {isSuperAdmin ? '(Singleton: Root Protected)' : ''}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {serverErrors.role ? (
                    <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-1">
                      {serverErrors.role[0]}
                    </p>
                  ) : (
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5">
                      For administrator privileges, choose <strong>IT Admin</strong> (supports multiple administrators).
                    </p>
                  )}
                </div>

                {/* Account Active State Checkbox */}
                <div className="p-4 rounded-md bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      id="is_active_tab"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-0 cursor-pointer"
                    />
                    <div>
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                        Activate Account Immediately
                      </span>
                      <span className="text-[11px] text-slate-400 block">
                        Allows user to immediately sign in to floor tablets and web workstations
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* ── Fixed Footer Controls with Previous, Next, and Submit ── */}
          <div className="p-4 bg-slate-50/80 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              {activeTab !== 'identity' ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  icon={<ChevronLeft className="w-3.5 h-3.5" />}
                  onClick={() => {
                    if (activeTab === 'placement') setActiveTab('identity');
                    if (activeTab === 'security') setActiveTab('placement');
                  }}
                >
                  Previous
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate('/admin/users')}
                >
                  Cancel
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              {activeTab !== 'security' ? (
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  iconRight={<ChevronRight className="w-3.5 h-3.5" />}
                  onClick={() => {
                    if (activeTab === 'identity') setActiveTab('placement');
                    if (activeTab === 'placement') setActiveTab('security');
                  }}
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  icon={<UserPlus className="w-4 h-4" />}
                  isLoading={isSubmitting}
                >
                  Register Account
                </Button>
              )}
            </div>
          </div>

        </div>
      </form>
    </div>
  );
};
