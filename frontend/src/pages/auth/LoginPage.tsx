import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Shield, Lock, User as UserIcon, Eye, EyeOff, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import apiClient from '../../services/apiClient';
import { useAuthStore } from '../../store/authStore';
import { resolveLandingPath } from '../../routes/RoleLandingEngine';
import { ThemeToggle } from '../../components/common/ThemeToggle';

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

      // Smart Redirect
      const redirectTo = searchParams.get('redirect_to');
      if (redirectTo && redirectTo.startsWith('/')) {
        navigate(decodeURIComponent(redirectTo), { replace: true });
      } else {
        const targetPath = resolveLandingPath(user.roles || [], user.default_dashboard_path);
        navigate(targetPath, { replace: true });
      }
    } catch (err: any) {
      if (err.response?.status === 422) {
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden bg-dot-matrix transition-colors">
      {/* Soft Ambient Aurora Shimmer */}
      <div className="ambient-aurora"></div>

      {/* Top Right Utility Bar */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-2.5">
        <ThemeToggle />
      </div>

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6 relative z-10">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white mb-3 shadow-md">
          <Shield className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          TraceFlow RMG
        </h1>
        <div className="mt-1 flex items-center justify-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span>Garment Traceability Platform</span>
          <span>•</span>
          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            v3.0 Live
          </span>
        </div>
      </div>

      {/* Main Login Card with Solid Blue Top Accent Bar */}
      <div className="w-full max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/90 dark:border-slate-800 border-t-4 border-t-blue-600 rounded-xl p-8 shadow-xl dark:shadow-2xl relative z-10 transition-all">
        {/* Card Header */}
        <div className="mb-6 flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Sign In
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Enter your credentials to continue
            </p>
          </div>
          <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            Enterprise Portal
          </span>
        </div>

        {/* General Error Banner */}
        {generalError && (
          <div className="mb-5 p-3.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-lg flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <p className="text-xs text-rose-700 dark:text-rose-400 font-medium leading-relaxed">
              {generalError}
            </p>
          </div>
        )}

        {/* Pure Server Validation Form (noValidate enabled) */}
        <form noValidate onSubmit={handleSubmit} className="space-y-4">
          {/* Field 1: Tri-Identifier */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Employee ID, Username, or Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                <UserIcon className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="EMP-0001 or admin@traceflow.com"
                className={`w-full bg-slate-50/50 dark:bg-slate-950/60 border ${
                  fieldErrors.identifier
                    ? 'border-rose-500 ring-1 ring-rose-500'
                    : 'border-slate-300 dark:border-slate-700 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'
                } rounded-lg pl-9 pr-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all`}
              />
            </div>
            {/* Pure Server Validation Error */}
            {fieldErrors.identifier && (
              <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                {fieldErrors.identifier[0]}
              </p>
            )}
          </div>

          {/* Field 2: Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className={`w-full bg-slate-50/50 dark:bg-slate-950/60 border ${
                  fieldErrors.password
                    ? 'border-rose-500 ring-1 ring-rose-500'
                    : 'border-slate-300 dark:border-slate-700 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'
                } rounded-lg pl-9 pr-10 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {/* Pure Server Validation Error */}
            {fieldErrors.password && (
              <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                {fieldErrors.password[0]}
              </p>
            )}
          </div>

          {/* Progressive Inline 2FA Step (No Modals) */}
          {showTwoFactor && (
            <div className="p-3.5 bg-blue-50/50 dark:bg-slate-950/80 border border-blue-200 dark:border-blue-800 rounded-lg space-y-1.5">
              <label className="block text-xs font-semibold text-blue-700 dark:text-blue-400">
                Authenticator 6-Digit PIN
              </label>
              <input
                type="text"
                maxLength={6}
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                placeholder="123456"
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-center text-lg tracking-widest font-mono text-slate-900 dark:text-slate-100 focus:border-blue-600 focus:outline-none"
              />
              {fieldErrors.two_factor_code && (
                <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                  {fieldErrors.two_factor_code[0]}
                </p>
              )}
            </div>
          )}

          {/* Crisp Flat Blue Button - ZERO GRADIENTS RULE */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-solid-blue py-2.5 mt-3 text-sm justify-center shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span>Signing in...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </form>

        {/* Footer Security Badges */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>WORM Vault Active</span>
          </span>
          <span className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
            PostgreSQL 17 • Redis 7
          </span>
        </div>
      </div>
    </div>
  );
};
