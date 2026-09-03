import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  ArrowLeft, 
  Home, 
  Mail, 
  Lock, 
  User, 
  Building2, 
  KeyRound,
  FileCode2
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { alertService } from '../../services/alertService';

export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  // Extract navigation state if passed via ProtectedRoute
  const state = location.state as { attemptedPath?: string; requiredRole?: string } | null;
  const attemptedPath = state?.attemptedPath || location.pathname;
  const requiredRole = state?.requiredRole;

  const handleContactAdmin = () => {
    alertService.info(
      'Access Request Logged',
      'An authorization review notification has been forwarded to the IT Security Administrator (admin@traceflow.com).'
    );
  };

  const handleGoHome = () => {
    const targetPath = user?.default_dashboard_path || '/admin/platform-overview';
    navigate(targetPath);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl overflow-hidden">
        {/* Top Warning Banner */}
        <div className="bg-rose-600 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-700/80 rounded-md">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Access Restricted • 403 Forbidden</h1>
              <p className="text-xs text-rose-100 font-medium">Enterprise Security Policy Gate</p>
            </div>
          </div>
          <Badge variant="danger" className="bg-rose-700 border-rose-500 text-white font-mono text-xs">
            SEC-403-UNAUTHORIZED
          </Badge>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Authorization Required
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Your user account is authenticated, but does not possess the requisite clearance or assigned role permissions to access this screen. This event has been recorded in the immutable WORM security audit log.
            </p>
          </div>

          {/* User & Attempt Details Box */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-md p-5 space-y-4 text-xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pb-2 border-b border-slate-200 dark:border-slate-700">
              <KeyRound className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Session Identity & Security Context</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* User Identity */}
              <div className="flex items-start gap-2.5">
                <User className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-slate-500 dark:text-slate-400 font-medium">Authenticated User</div>
                  <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    {user?.name || 'Unknown User'}
                  </div>
                  <div className="font-mono text-slate-500 dark:text-slate-400 text-[11px]">
                    ID: {user?.emp_id || 'N/A'} • @{user?.username || 'anonymous'}
                  </div>
                </div>
              </div>

              {/* Assigned Role */}
              <div className="flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-slate-500 dark:text-slate-400 font-medium">Assigned Primary Role</div>
                  <div className="mt-0.5">
                    <Badge variant="root" className="font-semibold">
                      {user?.primary_role || 'No Role Assigned'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Department */}
              <div className="flex items-start gap-2.5">
                <Building2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-slate-500 dark:text-slate-400 font-medium">Department</div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    {user?.department || 'Executive & Enterprise Operations'}
                  </div>
                </div>
              </div>

              {/* Target Path */}
              <div className="flex items-start gap-2.5">
                <FileCode2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-slate-500 dark:text-slate-400 font-medium">Attempted Resource</div>
                  <div className="font-mono font-semibold text-rose-600 dark:text-rose-400 truncate max-w-[200px]" title={attemptedPath}>
                    {attemptedPath}
                  </div>
                  {requiredRole && (
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Requires Role: <strong className="text-slate-700 dark:text-slate-300">{requiredRole}</strong>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Navigation Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            <Button
              variant="secondary"
              icon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>

            <div className="flex items-center gap-3">
              <Button
                variant="subtle"
                icon={<Mail className="w-4 h-4" />}
                onClick={handleContactAdmin}
              >
                Request Clearance
              </Button>

              <Button
                variant="primary"
                icon={<Home className="w-4 h-4" />}
                onClick={handleGoHome}
              >
                Return to Dashboard
              </Button>
            </div>
          </div>
        </div>

        {/* Footer Security Notice */}
        <div className="px-6 py-3 bg-slate-100 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>TraceFlow RMG Precision Access Control System</span>
          <span className="font-mono">IP Logged • WORM Protected</span>
        </div>
      </div>
    </div>
  );
};
