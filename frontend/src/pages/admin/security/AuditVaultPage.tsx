import React, { useEffect, useState, useTransition, useMemo } from 'react';
import {
  ShieldCheck,
  Search,
  RotateCcw,
  SlidersHorizontal,
  Eye,
  FileCode2,
  X,
  Globe,
} from 'lucide-react';
import { auditVaultService, type AuditVaultItem } from '../../../services/auditVaultService';
import { Button } from '../../../components/common/Button';
import { Badge, type BadgeVariant } from '../../../components/common/Badge';
import { DataTable, type ColumnDef } from '../../../components/common/DataTable';
import { TableActionButton } from '../../../components/common/TableActionButton';
import { PageHeader } from '../../../components/common/PageHeader';
import { UI_TOKENS } from '../../../config/designTokens';
import { alertService } from '../../../services/alertService';
import { formatDateTime } from '../../../utils/dateUtils';

export const AuditVaultPage: React.FC = () => {
  const [, startTransition] = useTransition();

  const [logs, setLogs] = useState<AuditVaultItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedLog, setSelectedLog] = useState<AuditVaultItem | null>(null);

  // Filters & State
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [selectedEntity, setSelectedEntity] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
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
        sort_by: sortBy,
        sort_direction: sortDirection,
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
  }, [page, perPage, selectedAction, selectedEntity, sortBy, sortDirection]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchLogs();
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedAction('');
    setSelectedEntity('');
    setSortBy('created_at');
    setSortDirection('desc');
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

  const columns: ColumnDef<AuditVaultItem>[] = useMemo(
    () => [
      {
        key: 'created_at',
        header: 'Timestamp (UTC)',
        width: 'w-48',
        sortable: true,
        render: (log) => (
          <span className="font-mono text-xs text-slate-700 dark:text-slate-300">
            {formatDateTime(log.created_at)}
          </span>
        ),
      },
      {
        key: 'action',
        header: 'Action',
        width: 'w-36',
        sortable: true,
        render: (log) => (
          <Badge variant={getActionBadgeVariant(log.action)}>
            {log.action}
          </Badge>
        ),
      },
      {
        key: 'entity_type',
        header: 'Entity',
        width: 'w-36',
        sortable: true,
        render: (log) => (
          <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs">
            {log.entity_type}
          </span>
        ),
      },
      {
        key: 'operator',
        header: 'Operator Identity',
        width: 'w-56',
        sortable: true,
        render: (log) => (
          <div className="truncate">
            <span className="font-bold text-slate-900 dark:text-slate-100 text-xs block truncate">
              {log.user?.name || log.emp_id || 'System Process'}
            </span>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              {log.emp_id ? `ID: ${log.emp_id}` : 'Internal'}
            </span>
          </div>
        ),
      },
      {
        key: 'ip_address',
        header: 'Client IP',
        width: 'w-36',
        render: (log) => (
          <span className="font-mono text-xs text-slate-600 dark:text-slate-400 inline-flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{log.ip_address || '127.0.0.1'}</span>
          </span>
        ),
      },
      {
        key: 'actions',
        header: 'Actions',
        width: 'w-24',
        align: 'center',
        render: (log) => {
          const isSelected = selectedLog?.id === log.id;
          return (
            <div className="inline-flex items-center justify-center">
              <TableActionButton
                variant={isSelected ? 'primary' : 'base'}
                icon={<Eye className="w-3.5 h-3.5" />}
                title={isSelected ? 'Viewing Event Details' : 'Inspect Audit Record Details'}
                onClick={() => setSelectedLog(isSelected ? null : log)}
              />
            </div>
          );
        },
      },
    ],
    [selectedLog]
  );

  return (
    <div className="space-y-6">
      {/* Standard Sleek Page Header */}
      <PageHeader
        title="Audit Vault"
        badge={
          <Badge variant="neutral">
            {pagination.total} Records
          </Badge>
        }
        actions={
          <Button
            variant="secondary"
            icon={<RotateCcw className="w-4 h-4" />}
            onClick={fetchLogs}
          >
            Refresh
          </Button>
        }
      />

      {/* KPI METRICS SUMMARY DOCK */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md p-4 shadow-xs">
          <div className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Total Records</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{metrics.total_logs}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Append-only audit trail</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md p-4 shadow-xs">
          <div className="text-xs font-bold uppercase text-blue-600 dark:text-blue-400">Authentication Events</div>
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-400 mt-1">{metrics.auth_events}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Staff logins & auth checks</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md p-4 shadow-xs">
          <div className="text-xs font-bold uppercase text-amber-600 dark:text-amber-400">Data Mutations</div>
          <div className="text-2xl font-bold text-amber-700 dark:text-amber-400 mt-1">{metrics.mutation_events}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Create, update & deletes</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md p-4 shadow-xs">
          <div className="text-xs font-bold uppercase text-rose-600 dark:text-rose-400">Permanent Purges</div>
          <div className="text-2xl font-bold text-rose-700 dark:text-rose-400 mt-1">{metrics.purge_events}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Tier-2 permanent purges</div>
        </div>
      </div>

      {/* INLINE EVENT INSPECTOR DRAWER (No Modals Rule) */}
      {selectedLog && (
        <div className="bg-white dark:bg-slate-900 border-2 border-blue-500/80 rounded-md shadow-md p-5 animate-in fade-in slide-in-from-top-3 duration-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <FileCode2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Log Inspection: <span className="font-mono text-xs">{selectedLog.id}</span>
              </h3>
            </div>
            <button
              onClick={() => setSelectedLog(null)}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-md"
              title="Close Inspector"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-slate-50 dark:bg-slate-800/60 p-3 rounded-md border border-slate-200 dark:border-slate-700">
            <div>
              <span className="text-slate-400 block mb-0.5">Operator ID</span>
              <strong className="text-slate-800 dark:text-slate-200">{selectedLog.emp_id || 'SYSTEM_DAEMON'}</strong>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Event Action</span>
              <strong className="text-slate-800 dark:text-slate-200">{selectedLog.action}</strong>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Target Entity</span>
              <strong className="text-slate-800 dark:text-slate-200 font-mono">{selectedLog.entity_type} ({selectedLog.entity_id.slice(0, 8)}...)</strong>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Client IP & Agent</span>
              <strong className="font-mono text-slate-800 dark:text-slate-200 block truncate" title={selectedLog.user_agent || 'Unknown'}>
                {selectedLog.ip_address || '127.0.0.1'}
              </strong>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">
                <span>Previous State Snapshot (Pre-Mutation)</span>
              </div>
              <pre className="p-3 bg-slate-900 text-slate-100 rounded-md text-xs font-mono overflow-auto max-h-56 border border-slate-700 leading-relaxed">
                {selectedLog.old_values ? JSON.stringify(selectedLog.old_values, null, 2) : '// Null (Resource Creation Event)'}
              </pre>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">
                <span>New Committed State (Post-Mutation)</span>
              </div>
              <pre className="p-3 bg-slate-900 text-slate-100 rounded-md text-xs font-mono overflow-auto max-h-56 border border-slate-700 leading-relaxed">
                {selectedLog.new_values ? JSON.stringify(selectedLog.new_values, null, 2) : '// Null (Resource Destroyed Event)'}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MANDATORY ENTERPRISE FILTER TOOLBAR (Single Row Layout) */}
      {/* ==================================================================== */}
      <div className={UI_TOKENS.filter.container}>
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Universal Text Search */}
          <div className="relative md:col-span-6">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search audit records by employee ID, entity UUID, client IP, or keyword..."
              className={`${UI_TOKENS.input.base} pl-9`}
            />
          </div>

          {/* Operation Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedAction}
              onChange={(e) => {
                setSelectedAction(e.target.value);
                setPage(1);
              }}
              className={UI_TOKENS.input.select}
            >
              <option value="">All Operations</option>
              {availableActions.map((act) => (
                <option key={act} value={act}>{act}</option>
              ))}
            </select>
          </div>

          {/* Entity Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedEntity}
              onChange={(e) => {
                setSelectedEntity(e.target.value);
                setPage(1);
              }}
              className={UI_TOKENS.input.select}
            >
              <option value="">All Entity Models</option>
              {availableEntities.map((ent) => (
                <option key={ent} value={ent}>{ent}</option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="md:col-span-2 flex items-center gap-2">
            <Button type="submit" variant="primary" className="flex-1">
              Filter
            </Button>
            <Button
              type="button"
              variant="secondary"
              icon={<RotateCcw className="w-4 h-4" />}
              onClick={handleResetFilters}
              title="Reset all filters"
            />
          </div>
        </form>

        {/* Standard Subline: Sort Display & Per-page Selector */}
        <div className={UI_TOKENS.filter.subline}>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span>
              Sorted by: <strong className="text-slate-800 dark:text-slate-200">{sortBy.toUpperCase()}</strong> ({sortDirection.toUpperCase()})
            </span>
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
              {[10, 15, 25, 50].map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* CENTRALIZED DESIGN DATATABLE */}
      <DataTable<AuditVaultItem>
        columns={columns}
        data={logs}
        keyExtractor={(log) => log.id}
        isLoading={isLoading}
        emptyMessage="No audit log records found."
        emptyIcon={<ShieldCheck className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />}
        emptyAction={
          <Button variant="secondary" size="sm" onClick={handleResetFilters}>
            Reset Filters
          </Button>
        }
        sortKey={sortBy}
        sortDir={sortDirection}
        onSort={(key, dir) => {
          setSortBy(key);
          setSortDirection(dir);
          setPage(1);
        }}
        serverPagination={{
          currentPage: page,
          totalPages: Math.max(pagination.last_page, 1),
          totalRecords: pagination.total,
          perPage: perPage,
          onPageChange: (newPage) => setPage(newPage),
          onPerPageChange: (newPerPage) => {
            setPerPage(newPerPage);
            setPage(1);
          },
        }}
      />
    </div>
  );
};
