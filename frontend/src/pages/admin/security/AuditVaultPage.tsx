import React, { useEffect, useState, useTransition } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Search,
  RotateCcw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileCode2,
  X,
  History,
  AlertOctagon,
  Globe
} from 'lucide-react';
import { auditVaultService, type AuditVaultItem } from '../../../services/auditVaultService';
import { Button } from '../../../components/common/Button';
import { Badge, type BadgeVariant } from '../../../components/common/Badge';
import { alertService } from '../../../services/alertService';

export const AuditVaultPage: React.FC = () => {
  const [, startTransition] = useTransition();

  const [logs, setLogs] = useState<AuditVaultItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedLog, setSelectedLog] = useState<AuditVaultItem | null>(null);

  // Filters & State
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [selectedEntity, setSelectedEntity] = useState<string>('');
  const [perPage, setPerPage] = useState<number>(15);
  const [page, setPage] = useState<number>(1);

  const [pagination, setPagination] = useState({
    total: 0,
    per_page: 15,
    current_page: 1,
    last_page: 1,
    from: 0,
    to: 0,
  });

  const [metrics, setMetrics] = useState({
    total_logs: 0,
    auth_events: 0,
    mutation_events: 0,
    purge_events: 0,
  });

  const [availableActions, setAvailableActions] = useState<string[]>([]);
  const [availableEntities, setAvailableEntities] = useState<string[]>([]);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await auditVaultService.getLogs({
        search: searchTerm.trim() || undefined,
        action: selectedAction || undefined,
        entity_type: selectedEntity || undefined,
        page,
        per_page: perPage,
      });

      setLogs(res.data);
      setPagination({
        total: res.pagination.total,
        per_page: res.pagination.per_page,
        current_page: res.pagination.current_page,
        last_page: res.pagination.last_page,
        from: res.pagination.from ?? 0,
        to: res.pagination.to ?? 0,
      });
      setMetrics(res.metrics);
      if (res.filters.actions.length > 0) setAvailableActions(res.filters.actions);
      if (res.filters.entity_types.length > 0) setAvailableEntities(res.filters.entity_types);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { detail?: string } } };
      alertService.error('Audit Vault Error', errorObj.response?.data?.detail || 'Failed to query immutable audit vault.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, perPage, selectedAction, selectedEntity]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchLogs();
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedAction('');
    setSelectedEntity('');
    setPerPage(15);
    setPage(1);
    setSelectedLog(null);
    startTransition(() => {
      fetchLogs();
    });
  };

  const getActionBadgeVariant = (action: string): BadgeVariant => {
    switch (action.toUpperCase()) {
      case 'LOGIN':
        return 'info';
      case 'CREATE':
        return 'success';
      case 'UPDATE':
        return 'warning';
      case 'DELETE':
        return 'danger';
      case 'PERMANENT_PURGE':
        return 'root';
      case 'UNLOCK':
        return 'info';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
            <Link to="/admin/platform-overview" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Platform</Link>
            <span>/</span>
            <span className="text-slate-500 dark:text-slate-400">Security & Logs</span>
            <span>/</span>
            <span className="text-slate-800 dark:text-slate-200 font-semibold">Audit Vault</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
              <span>Immutable WORM Audit Vault</span>
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-md">
              Write-Once Read-Many Protected
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Cryptographically sealed and database-trigger protected audit trail for zero-tamper governance.
          </p>
        </div>

        {/* Quick Nav Link */}
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            icon={<History className="w-4 h-4" />}
            onClick={() => fetchLogs()}
          >
            Refresh Vault
          </Button>

          <Link to="/admin/users/archived">
            <Button variant="subtle" icon={<AlertOctagon className="w-4 h-4" />}>
              Purge Console
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md p-4 shadow-xs">
          <div className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500">Total WORM Records</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{metrics.total_logs}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Non-modifiable audit entries</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md p-4 shadow-xs">
          <div className="text-xs font-bold uppercase text-blue-600 dark:text-blue-400">Authentication Events</div>
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-400 mt-1">{metrics.auth_events}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Staff logins & credential checks</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md p-4 shadow-xs">
          <div className="text-xs font-bold uppercase text-amber-600 dark:text-amber-400">Data Mutations</div>
          <div className="text-2xl font-bold text-amber-700 dark:text-amber-400 mt-1">{metrics.mutation_events}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Create, update & delete operations</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md p-4 shadow-xs">
          <div className="text-xs font-bold uppercase text-rose-600 dark:text-rose-400">Permanent Purges</div>
          <div className="text-2xl font-bold text-rose-700 dark:text-rose-400 mt-1">{metrics.purge_events}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Tier-2 permanent deletions</div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* INLINE EVENT INSPECTOR DRAWER (No Modals Rule) */}
      {/* ==================================================================== */}
      {selectedLog && (
        <div className="bg-white dark:bg-slate-900 border-2 border-blue-600 rounded-md shadow-lg p-6 space-y-4 text-slate-900 dark:text-slate-100 transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-950/80 rounded-md text-blue-600 dark:text-blue-400">
                <FileCode2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Event Inspector • UUID: {selectedLog.id}
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mt-0.5">
                  <span>{selectedLog.action} on {selectedLog.entity_type}</span>
                  <Badge variant={getActionBadgeVariant(selectedLog.action)} className="text-xs">
                    {selectedLog.action}
                  </Badge>
                </h3>
              </div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              icon={<X className="w-4 h-4" />}
              onClick={() => setSelectedLog(null)}
            >
              Close Inspector
            </Button>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs bg-slate-50 dark:bg-slate-800/60 p-4 rounded-md border border-slate-200 dark:border-slate-700">
            <div>
              <span className="text-slate-400 block mb-0.5">Timestamp (UTC)</span>
              <strong className="font-mono text-slate-800 dark:text-slate-200">{selectedLog.created_at}</strong>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Operator ID / Name</span>
              <strong className="text-slate-800 dark:text-slate-200">
                {selectedLog.user?.name ? `${selectedLog.user.name} (${selectedLog.emp_id || 'N/A'})` : selectedLog.emp_id || 'System'}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Entity Target Key</span>
              <strong className="font-mono text-slate-800 dark:text-slate-200 truncate block" title={selectedLog.entity_id}>
                {selectedLog.entity_id}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Client IP Address</span>
              <strong className="font-mono text-slate-800 dark:text-slate-200">{selectedLog.ip_address || '127.0.0.1'}</strong>
            </div>
          </div>

          {/* Old vs New Values JSON Diff View */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Previous State */}
            <div className="space-y-1.5">
              <div className="text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>Previous State (Old Values)</span>
              </div>
              <pre className="p-3 bg-slate-900 text-slate-200 text-xs font-mono rounded-md overflow-x-auto max-h-60 border border-slate-800">
                {selectedLog.old_values ? JSON.stringify(selectedLog.old_values, null, 2) : '// No previous state recorded'}
              </pre>
            </div>

            {/* Mutated State */}
            <div className="space-y-1.5">
              <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Committed State (New Values)</span>
              </div>
              <pre className="p-3 bg-slate-900 text-slate-200 text-xs font-mono rounded-md overflow-x-auto max-h-60 border border-slate-800">
                {selectedLog.new_values ? JSON.stringify(selectedLog.new_values, null, 2) : '// No new values recorded'}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* FILTER TOOLBAR */}
      {/* ==================================================================== */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-xs p-4 space-y-3">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Universal Text Search */}
          <div className="relative md:col-span-5">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Employee ID, Entity ID, or IP..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          {/* Action Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedAction}
              onChange={(e) => {
                setSelectedAction(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 font-medium"
            >
              <option value="">All Actions</option>
              {availableActions.map((act) => (
                <option key={act} value={act}>
                  {act}
                </option>
              ))}
            </select>
          </div>

          {/* Entity Type Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedEntity}
              onChange={(e) => {
                setSelectedEntity(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 font-medium"
            >
              <option value="">All Entities</option>
              {availableEntities.map((ent) => (
                <option key={ent} value={ent}>
                  {ent}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="md:col-span-1 flex items-center gap-1.5">
            <Button
              type="submit"
              variant="primary"
              className="w-full"
            >
              Filter
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleResetFilters}
              title="Reset all filters"
              icon={<RotateCcw className="w-4 h-4" />}
            />
          </div>
        </form>

        {/* Subline */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span>Chronological order: <strong>LATEST FIRST (DESC)</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <span>Show per page:</span>
            <select
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setPage(1);
              }}
              className="px-2 py-1 text-xs border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium focus:outline-none"
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* AUDIT LOGS DATA TABLE */}
      {/* ==================================================================== */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800">
                <th className="py-3.5 px-4 w-44 font-semibold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Timestamp (UTC)
                </th>
                <th className="py-3.5 px-4 w-36 font-semibold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Action
                </th>
                <th className="py-3.5 px-4 w-36 font-semibold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Entity
                </th>
                <th className="py-3.5 px-4 w-48 font-semibold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Operator Identity
                </th>
                <th className="py-3.5 px-4 w-36 font-semibold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Client IP
                </th>
                <th className="py-3.5 px-4 w-36 text-right font-semibold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Inspection
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm text-slate-700 dark:text-slate-300">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400 dark:text-slate-500">
                    <div className="inline-flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent animate-spin rounded-full"></div>
                      <span className="text-xs font-medium">Verifying immutable audit ledger...</span>
                    </div>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-500 dark:text-slate-400">
                    <ShieldCheck className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                    <p className="font-semibold text-slate-800 dark:text-slate-200">No audit log records found.</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Try adjusting your search query or filter settings.</p>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleResetFilters}
                      className="mt-3"
                    >
                      Reset Filters
                    </Button>
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const isSelected = selectedLog?.id === log.id;
                  const formattedDate = new Date(log.created_at).toLocaleString();

                  return (
                    <tr
                      key={log.id}
                      className={`hover:bg-slate-50/90 dark:hover:bg-slate-800/50 transition-colors group ${
                        isSelected ? 'bg-blue-50/60 dark:bg-blue-950/40' : ''
                      }`}
                    >
                      {/* Timestamp */}
                      <td className="py-3.5 px-4 align-middle font-mono text-xs text-slate-600 dark:text-slate-400">
                        {formattedDate}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 align-middle">
                        <Badge variant={getActionBadgeVariant(log.action)}>
                          {log.action}
                        </Badge>
                      </td>

                      {/* Entity */}
                      <td className="py-3.5 px-4 align-middle">
                        <span className="font-medium text-slate-900 dark:text-slate-100 text-xs">
                          {log.entity_type}
                        </span>
                      </td>

                      {/* Operator Identity */}
                      <td className="py-3.5 px-4 align-middle">
                        <div className="truncate">
                          <span className="font-bold text-slate-900 dark:text-slate-100 text-xs block truncate">
                            {log.user?.name || log.emp_id || 'System Process'}
                          </span>
                          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                            {log.emp_id ? `ID: ${log.emp_id}` : 'Internal'}
                          </span>
                        </div>
                      </td>

                      {/* Client IP */}
                      <td className="py-3.5 px-4 align-middle font-mono text-xs text-slate-500 dark:text-slate-400">
                        <span className="inline-flex items-center gap-1">
                          <Globe className="w-3 h-3 text-slate-400" />
                          <span>{log.ip_address || '127.0.0.1'}</span>
                        </span>
                      </td>

                      {/* Action Button */}
                      <td className="py-3.5 px-4 text-right align-middle">
                        <Button
                          variant={isSelected ? 'primary' : 'secondary'}
                          size="sm"
                          icon={<Eye className="w-3.5 h-3.5" />}
                          onClick={() => setSelectedLog(isSelected ? null : log)}
                        >
                          {isSelected ? 'Viewing' : 'Inspect'}
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 gap-3 select-none">
          <div>
            Showing{' '}
            <strong className="text-slate-900 dark:text-slate-100 font-semibold">
              {pagination.total > 0 ? (page - 1) * perPage + 1 : 0}
            </strong>{' '}
            to{' '}
            <strong className="text-slate-900 dark:text-slate-100 font-semibold">
              {Math.min(page * perPage, pagination.total)}
            </strong>{' '}
            of <strong className="text-slate-900 dark:text-slate-100 font-semibold">{pagination.total}</strong> WORM log entries
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="secondary"
              size="sm"
              disabled={page <= 1 || isLoading}
              onClick={() => setPage(page - 1)}
              icon={<ChevronLeft className="w-3.5 h-3.5" />}
            >
              Previous
            </Button>

            <span className="px-3 py-1.5 font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md">
              Page {page} of {Math.max(pagination.last_page, 1)}
            </span>

            <Button
              variant="secondary"
              size="sm"
              disabled={page >= pagination.last_page || isLoading}
              onClick={() => setPage(page + 1)}
              icon={<ChevronRight className="w-3.5 h-3.5" />}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
