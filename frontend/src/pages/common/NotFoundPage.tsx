import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FileQuestion, 
  ArrowLeft, 
  Home, 
  Compass,
  FileSearch
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  const handleGoHome = () => {
    const targetPath = user?.default_dashboard_path || '/admin/platform-overview';
    navigate(targetPath);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl overflow-hidden">
        {/* Top Header Strip */}
        <div className="bg-slate-800 dark:bg-slate-800/90 px-6 py-4 flex items-center justify-between text-white border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-700 rounded-md">
              <FileQuestion className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">404 • Resource Not Located</h1>
              <p className="text-xs text-slate-300 font-medium">TraceFlow RMG Routing Layer</p>
            </div>
          </div>
          <Badge variant="neutral" className="bg-slate-700 border-slate-600 text-slate-200 font-mono text-xs">
            ERR-404-NOT-FOUND
          </Badge>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Page or Endpoint Does Not Exist
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              The screen or module route you requested cannot be found on this platform. The link may be obsolete, moved during a version upgrade, or mistyped.
            </p>
          </div>

          {/* Path Details Box */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-md p-4 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium">
              <Compass className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Requested URI Target</span>
            </div>
            <div className="font-mono text-sm font-semibold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 p-2.5 border border-slate-200 dark:border-slate-700 rounded break-all">
              {location.pathname}{location.search}
            </div>
          </div>

          {/* Quick Guidance Tip */}
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <FileSearch className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>
              Tip: Press <kbd className="px-1.5 py-0.5 text-[11px] font-mono bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-700 dark:text-slate-300">Ctrl + K</kbd> to open the Universal Navigation Search.
            </span>
          </div>

          {/* Action Navigation Controls */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <Button
              variant="secondary"
              icon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => navigate(-1)}
            >
              Go Back
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

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-100 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>TraceFlow RMG Precision ERP</span>
          <span className="font-mono">Router Check: OK</span>
        </div>
      </div>
    </div>
  );
};
