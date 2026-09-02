import React from 'react';
import { useLocation } from 'react-router-dom';
import { Layers, Clock, Terminal } from 'lucide-react';

interface ModulePlaceholderPageProps {
  title?: string;
  moduleCode?: string;
  description?: string;
}

export const ModulePlaceholderPage: React.FC<ModulePlaceholderPageProps> = ({
  title,
  moduleCode,
  description,
}) => {
  const location = useLocation();

  const displayTitle = title || location.pathname.split('/').pop()?.replace(/-/g, ' ').toUpperCase() || 'Feature Module';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-5 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
          <span>{moduleCode || 'ACTIVE ROUTE'}</span>
          <span>•</span>
          <span>TraceFlow Enterprise Portal</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight capitalize">
          {displayTitle}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          {description || 'Dedicated enterprise full-screen workspace. Ready for data capture and operations.'}
        </p>
      </div>

      {/* Main Container Card (STRICT NO MODALS) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center space-y-4 shadow-sm transition-colors">
        <div className="inline-flex p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-700/60">
          <Layers className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-200">
          Full-Screen Dedicated Workspace Loaded
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
          This view complies with the <strong>STRICT No Modals Rule</strong>. Sub-views, creation forms, and audit details will render directly inside this dedicated view.
        </p>

        <div className="pt-4 flex items-center justify-center gap-6 text-xs text-slate-500 font-mono">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Path: {location.pathname}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
            <span>PostgreSQL 17 Ready</span>
          </span>
        </div>
      </div>
    </div>
  );
};
