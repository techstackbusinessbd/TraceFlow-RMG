import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus, AlertCircle } from 'lucide-react';
import { userService, type Role } from '../../../services/userService';

export const UserCreatePage: React.FC = () => {
  const navigate = useNavigate();

  const [roles, setRoles] = useState<Role[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});

  // Form State
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
    const loadRoles = async () => {
      try {
        const data = await userService.getRoles();
        setRoles(data);
        const defaultRole = data.find((r) => r.name === 'IT Admin') || data.find((r) => r.name !== 'Super Admin') || data[0];
        if (defaultRole) {
          setFormData((prev) => ({ ...prev, role: defaultRole.name }));
        }
      } catch {
        setGlobalError('Failed to load system roles list.');
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
    // Clear field-specific server error when user modifies input
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
    setIsSubmitting(true);
    setGlobalError(null);
    setServerErrors({});

    try {
      await userService.createUser(formData);
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
        setGlobalError(errorObj.response?.data?.detail || 'An unexpected error occurred while creating the account.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create User Account</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Register factory personnel with Employee ID, username, role privileges, and department assignment.
          </p>
        </div>
      </div>

      {/* Global Alert */}
      {globalError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>{globalError}</div>
        </div>
      )}

      {/* Main Dedicated Form (Pure Server Validation - noValidate) */}
      <div className="bg-white border border-slate-200 shadow-xs p-6">
        <form noValidate onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Factory Identity */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 pb-2 border-b border-slate-100">
              1. Factory & Login Identity
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Employee ID */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Employee ID (Mandatory)
                </label>
                <input
                  type="text"
                  name="emp_id"
                  value={formData.emp_id}
                  onChange={handleChange}
                  placeholder="e.g. EMP-10492"
                  className={`w-full px-3 py-2 text-sm border font-mono ${
                    serverErrors.emp_id ? 'border-red-500 bg-red-50/30' : 'border-slate-300'
                  } focus:outline-none focus:border-blue-600`}
                />
                {serverErrors.emp_id && (
                  <p className="text-xs text-red-600 font-medium mt-1">{serverErrors.emp_id[0]}</p>
                )}
                <p className="text-xs text-slate-400 mt-1">Official factory badge employee number.</p>
              </div>

              {/* Username */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Username (Mandatory)
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="e.g. cutting_supervisor_01"
                  className={`w-full px-3 py-2 text-sm border font-mono ${
                    serverErrors.username ? 'border-red-500 bg-red-50/30' : 'border-slate-300'
                  } focus:outline-none focus:border-blue-600`}
                />
                {serverErrors.username && (
                  <p className="text-xs text-red-600 font-medium mt-1">{serverErrors.username[0]}</p>
                )}
                <p className="text-xs text-slate-400 mt-1">Unique login identifier without spaces.</p>
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
                  placeholder="e.g. Mohammad Rafiqul Islam"
                  className={`w-full px-3 py-2 text-sm border ${
                    serverErrors.name ? 'border-red-500 bg-red-50/30' : 'border-slate-300'
                  } focus:outline-none focus:border-blue-600`}
                />
                {serverErrors.name && (
                  <p className="text-xs text-red-600 font-medium mt-1">{serverErrors.name[0]}</p>
                )}
              </div>

              {/* Email (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Corporate Email (Optional)
                </label>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. rafiqul@traceflow.com (leave blank if none)"
                  className={`w-full px-3 py-2 text-sm border ${
                    serverErrors.email ? 'border-red-500 bg-red-50/30' : 'border-slate-300'
                  } focus:outline-none focus:border-blue-600`}
                />
                {serverErrors.email && (
                  <p className="text-xs text-red-600 font-medium mt-1">{serverErrors.email[0]}</p>
                )}
                <p className="text-xs text-slate-400 mt-1">Floor staff without corporate email can leave this empty.</p>
              </div>

              {/* Password */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Initial Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 8 characters"
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

          {/* Section 2: Department & Role Assignment */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 pb-2 border-b border-slate-100">
              2. System Role & Department
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {/* Role Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  System Role Privilege
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 text-sm border ${
                    serverErrors.role ? 'border-red-500 bg-red-50/30' : 'border-slate-300'
                  } bg-white focus:outline-none focus:border-blue-600 font-medium`}
                >
                  {roles.map((r) => {
                    const isSuperAdmin = r.name === 'Super Admin';
                    return (
                      <option 
                        key={r.id} 
                        value={r.name}
                        disabled={isSuperAdmin}
                        className={isSuperAdmin ? 'text-slate-400 bg-slate-100' : ''}
                      >
                        {r.name} {isSuperAdmin ? '(Singleton: 1 active account limit)' : ''}
                      </option>
                    );
                  })}
                </select>
                {serverErrors.role ? (
                  <p className="text-xs text-red-600 font-medium mt-1">{serverErrors.role[0]}</p>
                ) : (
                  <p className="text-[11px] text-slate-400 mt-1">
                    For administrator privileges, choose <strong>IT Admin</strong> (supports multiple administrators).
                  </p>
                )}
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
                  placeholder="e.g. Line Supervisor"
                  className="w-full px-3 py-2 text-sm border border-slate-300 focus:outline-none focus:border-blue-600"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Mobile Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +8801700000000"
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
                  Activate account immediately
                </label>
              </div>
            </div>
          </div>

          {/* Form Action Buttons (Flat Solid Colors - STRICT) */}
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
              <UserPlus className="w-4 h-4" />
              {isSubmitting ? 'Creating User...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
