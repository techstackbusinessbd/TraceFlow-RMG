import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Shield, Lock, User as UserIcon, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';
import apiClient from '../../services/apiClient';
import { useAuthStore } from '../../store/authStore';
import { resolveLandingPath } from '../../routes/RoleLandingEngine';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [showTwoFactor, setShowTwoFactor] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError(null);
    setIsLoading(true);

    try {
      const payload: Record<string, string> = {
        identifier: identifier.trim(),
        password,
      };

      if (showTwoFactor && twoFactorCode) {
        payload.two_factor_code = twoFactorCode.trim();
      }

      const response = await apiClient.post('/v1/auth/login', payload);

      if (response.data.requires_two_factor) {
        setShowTwoFactor(true);
        setIsLoading(false);
        return;
      }

      const { token, user } = response.data;
      setAuth(token, user);

      // Smart Redirect: Check explicit redirect_to query or resolve via Role Precedence
      const redirectTo = searchParams.get('redirect_to');
      if (redirectTo && redirectTo.startsWith('/')) {
        navigate(decodeURIComponent(redirectTo), { replace: true });
      } else {
        const targetPath = resolveLandingPath(user.roles || [], user.default_dashboard_path);
        navigate(targetPath, { replace: true });
      }
    } catch (err: any) {
      if (err.response?.status === 422) {
        // Pure Server-Side Validation Errors
        setFieldErrors(err.response.data.errors || {});
      } else if (err.response?.status === 401) {
        setGeneralError(err.response.data.detail || 'Invalid credentials provided.');
      } else if (err.response?.status === 403) {
        setGeneralError(err.response.data.detail || 'Account deactivated.');
      } else {
        setGeneralError('Unable to connect to the backend server. Please check your network.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-500 mb-4">
          <Shield className="w-8 h-8 text-blue-500" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-100 sm:text-3xl">
          TraceFlow RMG
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Precision Fabric-to-Freight Garment Traceability & ERP
        </p>
      </div>

      {/* Main Login Card - STRICT NO MODALS */}
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-200">
            Sign In to Enterprise Workspace
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Universal access point for Executives, Planners, QA & Floor Operators
          </p>
        </div>

        {/* General Error Banner */}
        {generalError && (
          <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <p className="text-xs text-rose-400 font-medium leading-relaxed">
              {generalError}
            </p>
          </div>
        )}

        {/* Pure Server Validation Form (noValidate enabled) */}
        <form noValidate onSubmit={handleSubmit} className="space-y-5">
          {/* Field 1: Tri-Identifier */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Employee ID, Username, or Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <UserIcon className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. EMP-0001, super.admin, or admin@traceflow.com"
                className={`w-full bg-slate-950 border ${
                  fieldErrors.identifier ? 'border-rose-500' : 'border-slate-800 focus:border-blue-500'
                } rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-colors`}
              />
            </div>
            {/* Pure Server Validation Error */}
            {fieldErrors.identifier && (
              <p className="mt-1.5 text-xs text-rose-400 font-medium">
                {fieldErrors.identifier[0]}
              </p>
            )}
          </div>

          {/* Field 2: Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-slate-300">
                Password
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className={`w-full bg-slate-950 border ${
                  fieldErrors.password ? 'border-rose-500' : 'border-slate-800 focus:border-blue-500'
                } rounded-lg pl-10 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-colors`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {/* Pure Server Validation Error */}
            {fieldErrors.password && (
              <p className="mt-1.5 text-xs text-rose-400 font-medium">
                {fieldErrors.password[0]}
              </p>
            )}
          </div>

          {/* Progressive Inline 2FA Step (No Modals) */}
          {showTwoFactor && (
            <div className="p-4 bg-slate-950/80 border border-blue-500/30 rounded-lg space-y-2">
              <label className="block text-xs font-medium text-blue-400">
                Google Authenticator 6-Digit PIN
              </label>
              <input
                type="text"
                maxLength={6}
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                placeholder="123456"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-center text-lg tracking-widest font-mono text-slate-100 placeholder-slate-600 focus:border-blue-500 focus:outline-none"
              />
              {fieldErrors.two_factor_code && (
                <p className="text-xs text-rose-400 font-medium">
                  {fieldErrors.two_factor_code[0]}
                </p>
              )}
            </div>
          )}

          {/* Crisp Flat Blue Button - ZERO GRADIENTS RULE */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-solid-blue py-3 mt-2 text-sm justify-center shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Workspace</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </form>

        {/* Footer Security Badges */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>WORM Security Vault Active</span>
          <span>PostgreSQL 17 • Redis 7</span>
        </div>
      </div>
    </div>
  );
};
