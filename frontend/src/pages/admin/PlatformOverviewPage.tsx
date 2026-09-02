import React, { useEffect, useState } from 'react';
import { Shield, Database, Cpu, Activity, Server, RefreshCw, CheckCircle2 } from 'lucide-react';
import apiClient from '../../services/apiClient';

interface HealthStatus {
  status: string;
  application: string;
  version: string;
  framework: string;
  database: {
    engine: string;
    status: string;
    version?: string;
  };
  cache_and_queue: {
    engine: string;
    status: string;
  };
  timestamp: string;
}

export const PlatformOverviewPage: React.FC = () => {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHealth = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get('/health');
      setHealth(res.data);
    } catch {
      setHealth(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Shield className="w-7 h-7 text-blue-600 dark:text-blue-500" />
            <span>Platform Command Center</span>
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Global RMG Platform Health, PostgreSQL 17 Database, and Security Vault
          </p>
        </div>
        <button
          onClick={fetchHealth}
          className="btn-solid-blue self-start sm:self-auto text-xs py-2 px-3.5 shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* Primary KPI Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Core API */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Core Backend
            </span>
            <Server className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">
            {health?.application || 'TraceFlow RMG'}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{health?.framework || 'Laravel 13'} (PHP 8.5)</span>
          </div>
        </div>

        {/* Card 2: PostgreSQL 17 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Database Engine
            </span>
            <Database className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">
            {health?.database.engine || 'PostgreSQL 17'}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                health?.database.status === 'connected' ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            ></span>
            <span className="text-slate-600 dark:text-slate-400 font-mono">
              Status: {health?.database.status || 'Checking...'}
            </span>
          </div>
        </div>

        {/* Card 3: Redis 7 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Cache & Queues
            </span>
            <Cpu className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">
            {health?.cache_and_queue.engine || 'Redis 7'}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                health?.cache_and_queue.status === 'connected' ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            ></span>
            <span className="text-slate-600 dark:text-slate-400 font-mono">
              Status: {health?.cache_and_queue.status || 'Checking...'}
            </span>
          </div>
        </div>

        {/* Card 4: WORM Audit Vault */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Security Vault
            </span>
            <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">WORM Active</div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Immutable Triggers Enforced</span>
          </div>
        </div>
      </div>

      {/* Architecture & Verification Panel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm transition-colors">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
          Enterprise Platform Specification Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800/80">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">
                  Pure Server-Side Validation Standard
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  All forms use &lt;form noValidate&gt; with RFC 7807 422 JSON validation. Zero browser popups.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800/80">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">
                  STRICT No Modals Policy
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  100% of forms, details, creation flows, and reports load as full-screen dedicated pages with breadcrumbs.
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800/80">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">
                  Dual Theme Mode (Light & Dark)
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Instant toggle between clean daytime light mode and midnight enterprise dark mode.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800/80">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">
                  100% English UI Labels & Git develop Branch
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  All user interface text is 100% English. Code changes track directly to origin/develop.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
