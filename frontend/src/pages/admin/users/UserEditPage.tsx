import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { userService, type Role } from '../../../services/userService';

export const UserEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});

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
      setGlobalError(null);
      try {
        const [rolesList, userData] = await Promise.all([
          userService.getRoles(),
          userService.getUser(id),
        ]);

        setRoles(rolesList);
        setFormData({
          emp_id: userData.emp_id,
          username: userData.username,
          name: userData.name,
          email: userData.email || '',
          password: '',
          phone: userData.phone || '',
          department: userData.department || 'Information Technology',
          designation: userData.designation || '',
          role: userData.roles?.[0]?.name || (rolesList[0]?.name ?? ''),
          is_active: userData.is_active,
        });
      } catch {
        setGlobalError('Failed to load user profile details.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setIsSubmitting(true);
    setGlobalError(null);
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
        setGlobalError(errorObj.response.data.detail || 'Validation failed. Please correct the highlighted errors.');
      } else {
        setGlobalError(errorObj.response?.data?.detail || 'An unexpected error occurred while saving user changes.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center text-slate-500">
        <div className="inline-flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent animate-spin"></div>
          <span>Loading user profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header & Back Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <Link
            to="/admin/users"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Users Directory
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Edit User Account</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Modify profile details, department assignments, and system role privileges.
          </p>
        </div>
      </div>

      {/* Global Error Banner */}
      {globalError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>{globalError}</div>
        </div>
      )}

      {/* Main Edit Form (Strict noValidate) */}
      <div className="bg-white border border-slate-200 shadow-xs p-6">
        <form noValidate onSubmit={handleSubmit} className="space-y-6">
          {/* Identity Section */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 pb-2 border-b border-slate-100">
              1. Factory & Login Identity
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Employee ID */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Employee ID
                </label>
                <input
                  type="text"
                  name="emp_id"
                  value={formData.emp_id}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 text-sm border font-mono ${
                    serverErrors.emp_id ? 'border-red-500 bg-red-50/30' : 'border-slate-300'
                  } focus:outline-none focus:border-blue-600`}
                />
                {serverErrors.emp_id && (
                  <p className="text-xs text-red-600 font-medium mt-1">{serverErrors.emp_id[0]}</p>
                )}
              </div>

              {/* Username */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 text-sm border font-mono ${
                    serverErrors.username ? 'border-red-500 bg-red-50/30' : 'border-slate-300'
                  } focus:outline-none focus:border-blue-600`}
                />
                {serverErrors.username && (
                  <p className="text-xs text-red-600 font-medium mt-1">{serverErrors.username[0]}</p>
                )}
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Legal Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 text-sm border ${
                    serverErrors.name ? 'border-red-500 bg-red-50/30' : 'border-slate-300'
                  } focus:outline-none focus:border-blue-600`}
                />
                {serverErrors.name && (
                  <p className="text-xs text-red-600 font-medium mt-1">{serverErrors.name[0]}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Corporate Email (Optional)
                </label>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Leave empty if user has no corporate email"
                  className={`w-full px-3 py-2 text-sm border ${
                    serverErrors.email ? 'border-red-500 bg-red-50/30' : 'border-slate-300'
                  } focus:outline-none focus:border-blue-600`}
                />
                {serverErrors.email && (
                  <p className="text-xs text-red-600 font-medium mt-1">{serverErrors.email[0]}</p>
                )}
              </div>

              {/* Password (Optional for Edit) */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reset Password (Leave blank to keep existing password)
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter new password only if changing"
                  className={`w-full px-3 py-2 text-sm border ${
                    serverErrors.password ? 'border-red-500 bg-red-50/30' : 'border-slate-300'
                  } focus:outline-none focus:border-blue-600`}
                />
                {serverErrors.password && (
                  <p className="text-xs text-red-600 font-medium mt-1">{serverErrors.password[0]}</p>
                )}
              </div>
            </div>
          </div>

          {/* Role & Dept Section */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 pb-2 border-b border-slate-100">
              2. System Role & Department
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {/* Role */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  System Role Privilege
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-slate-300 bg-white focus:outline-none focus:border-blue-600"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.name}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Department
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-slate-300 bg-white focus:outline-none focus:border-blue-600"
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Designation / Job Title
                </label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-slate-300 focus:outline-none focus:border-blue-600"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-slate-300 focus:outline-none focus:border-blue-600"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-0"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-slate-800 cursor-pointer">
                  Account is active
                </label>
              </div>
            </div>
          </div>

          {/* Form Actions (Flat Solid Colors - STRICT) */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Link
              to="/admin/users"
              className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
