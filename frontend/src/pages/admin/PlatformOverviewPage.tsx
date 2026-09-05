import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Database,
  Cpu,
  Activity,
  Server,
  RefreshCw,
  CheckCircle2,
  Users,
  Lock,
  ArrowRight,
  Tablet,
  FileCheck,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { PageHeader } from '../../components/common/PageHeader';
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
      {/* Mandatory Standard Page Header */}
      <PageHeader
        title="System Dashboard"
        badge={
          <Badge variant={health?.status === 'healthy' ? 'success' : 'warning'}>
            {health?.status === 'healthy' ? 'System Operational' : 'Connecting'}
          </Badge>
        }
        actions={
          <Button
            variant="secondary"
            onClick={fetchHealth}
            isLoading={isLoading}
            icon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
          >
            Refresh Telemetry
          </Button>
        }
      />

      {/* KPI Cards Grid with Crisp Top Accent Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Core Backend */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-t-4 border-t-blue-600 rounded-xl p-5 shadow-xs transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">
              Core Backend
            </span>
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
              <Server className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              TraceFlow RMG Core API
            </span>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Laravel 13 (PHP 8.5)</span>
            </div>
          </div>
        </div>

        {/* Card 2: Database Engine */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-t-4 border-t-indigo-600 rounded-xl p-5 shadow-xs transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">
              Database Engine
            </span>
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              PostgreSQL 17
            </span>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
              <span
                className={`w-2 h-2 rounded-full ${
                  health?.database?.status === 'connected' ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              ></span>
              <span className="font-mono text-xs">
                Status: {health?.database?.status || 'connecting...'}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Cache & Queues */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-t-4 border-t-rose-600 rounded-xl p-5 shadow-xs transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">
              Cache & Queues
            </span>
            <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              Redis 7
            </span>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
              <span
                className={`w-2 h-2 rounded-full ${
                  health?.cache_and_queue?.status === 'connected' ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              ></span>
              <span className="font-mono text-xs">
                Status: {health?.cache_and_queue?.status || 'connecting...'}
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Security Vault */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-t-4 border-t-emerald-600 rounded-xl p-5 shadow-xs transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">
              Security Vault
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              WORM Active
            </span>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Immutable Triggers Enforced</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Launchpad Navigation Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/admin/users"
          className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 transition-colors group shadow-xs"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Users & Roles</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">21 Enterprise Roles</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>

        <Link
          to="/admin/audit-vault"
          className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors group shadow-xs"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">WORM Audit Vault</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Tamper-Proof Ledger</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>

        <Link
          to="/admin/devices"
          className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors group shadow-xs"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                <Tablet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Tablet Fleet</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Floor Kiosk & Scanners</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>

        <Link
          to="/master-data/organization"
          className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-amber-500 dark:hover:border-amber-500 transition-colors group shadow-xs"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Master Library</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Organization, Buyers, Standards</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>
      </div>

      {/* Core Architectural Pillars Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
          Enterprise Operational Architecture Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                4 Core Operational Domains (Dynamics 365 Architecture)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Commercial, Manufacturing, Supply Chain, and Governance separated into distinct high-focus workspaces.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                Global Omni-Search Command Palette (Ctrl + K)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Instant keyboard shortcut navigation across all 15 modules and sub-pages.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                STRICT No Modals Policy
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                All forms, details, creation flows, and reports load as full screen dedicated pages with breadcrumbs.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                Pure Server-Side Validation Standard
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Forms use &lt;form noValidate&gt; with RFC 7807 422 JSON validation. Zero browser popups.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
