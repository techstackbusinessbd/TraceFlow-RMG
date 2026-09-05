import React, { useState, useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import { UI_TOKENS } from '../../config/designTokens';
import { Button } from './Button';

export interface ColumnDef<T> {
  key: string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  perPage: number;
  onPageChange: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
}

export interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  isLoading?: boolean;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  emptyAction?: React.ReactNode;
  
  // Client-side sort options (ignored if onSort is provided)
  initialSortKey?: string;
  initialSortDir?: 'asc' | 'desc';
  
  // Server-side sort options
  sortKey?: string;
  sortDir?: 'asc' | 'desc';
  onSort?: (key: string, dir: 'asc' | 'desc') => void;

  // Pagination (supports client-side or controlled server-side)
  serverPagination?: PaginationState;
  defaultPerPage?: number;
  perPageOptions?: number[];
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  emptyMessage = 'No matching records found.',
  emptyIcon,
  emptyAction,
  initialSortKey,
  initialSortDir = 'asc',
  sortKey: controlledSortKey,
  sortDir: controlledSortDir,
  onSort,
  serverPagination,
  defaultPerPage = 15,
  perPageOptions = [10, 15, 25, 50, 100],
  className = '',
}: DataTableProps<T>) {
  // Client-side sort state (used if onSort not provided)
  const [internalSortKey, setInternalSortKey] = useState<string | undefined>(initialSortKey);
  const [internalSortDir, setInternalSortDir] = useState<'asc' | 'desc'>(initialSortDir);
  
  // Client-side pagination state (used if serverPagination not provided)
  const [internalPage, setInternalPage] = useState<number>(1);
  const [internalPerPage, setInternalPerPage] = useState<number>(defaultPerPage);

  const activeSortKey = onSort ? controlledSortKey : internalSortKey;
  const activeSortDir = onSort ? (controlledSortDir || 'asc') : internalSortDir;

  // Sorting Handler
  const handleSort = (key: string) => {
    const nextDir = activeSortKey === key && activeSortDir === 'asc' ? 'desc' : 'asc';
    if (onSort) {
      onSort(key, nextDir);
    } else {
      setInternalSortKey(key);
      setInternalSortDir(nextDir);
      setInternalPage(1);
    }
  };

  // Client-side Sorted Data Memo (skipped if serverPagination exists)
  const sortedData = useMemo(() => {
    if (serverPagination || !activeSortKey) return data;

    return [...data].sort((a, b) => {
      const aVal = a[activeSortKey];
      const bVal = b[activeSortKey];

      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return activeSortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const strA = String(aVal).toLowerCase();
      const strB = String(bVal).toLowerCase();
      return activeSortDir === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
    });
  }, [data, activeSortKey, activeSortDir, serverPagination]);

  // Client vs Server Pagination Calculations
  const isServer = !!serverPagination;
  const totalRecords = isServer ? serverPagination.totalRecords : sortedData.length;
  const perPage = isServer ? serverPagination.perPage : internalPerPage;
  const totalPages = isServer ? serverPagination.totalPages : Math.max(1, Math.ceil(totalRecords / perPage));
  const currentPage = isServer ? serverPagination.currentPage : Math.min(internalPage, totalPages);

  const displayData = useMemo(() => {
    if (isServer) {
      return data;
    }
    const start = (currentPage - 1) * perPage;
    return sortedData.slice(start, start + perPage);
  }, [isServer, data, sortedData, currentPage, perPage]);

  const startRecord = totalRecords === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const endRecord = Math.min(currentPage * perPage, totalRecords);

  const handlePageChange = (newPage: number) => {
    if (isServer) {
      serverPagination.onPageChange(newPage);
    } else {
      setInternalPage(newPage);
    }
  };

  const handlePerPageChange = (newPerPage: number) => {
    if (isServer && serverPagination.onPerPageChange) {
      serverPagination.onPerPageChange(newPerPage);
    } else {
      setInternalPerPage(newPerPage);
      setInternalPage(1);
    }
  };

  return (
    <div className={`${UI_TOKENS.table.wrapper} ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse table-fixed">
          {/* Table Header */}
          <thead>
            <tr className={UI_TOKENS.table.headerRow}>
              {columns.map((col) => {
                const isSorted = activeSortKey === col.key;
                const alignClass =
                  col.align === 'center'
                    ? 'text-center'
                    : col.align === 'right'
                    ? 'text-right'
                    : 'text-left';

                return (
                  <th
                    key={col.key}
                    style={col.width ? { width: col.width } : undefined}
                    className={`${UI_TOKENS.table.th} ${alignClass} ${col.width || ''}`}
                  >
                    {col.sortable ? (
                      <button
                        type="button"
                        onClick={() => handleSort(col.key)}
                        className={`inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors focus:outline-none ${
                          alignClass === 'text-center'
                            ? 'mx-auto justify-center'
                            : alignClass === 'text-right'
                            ? 'ml-auto justify-end'
                            : 'justify-start'
                        }`}
                      >
                        <span>{col.header}</span>
                        {isSorted ? (
                          activeSortDir === 'asc' ? (
                            <ArrowUp className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                          ) : (
                            <ArrowDown className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                          )
                        ) : (
                          <ArrowUpDown className="w-3 h-3 text-slate-400 shrink-0 opacity-60 hover:opacity-100" />
                        )}
                      </button>
                    ) : (
                      <span>{col.header}</span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm text-slate-700 dark:text-slate-300">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="py-16 text-center text-slate-400">
                  <div className="inline-flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent animate-spin rounded-full" />
                    <span className="text-xs font-semibold">Loading data records...</span>
                  </div>
                </td>
              </tr>
            ) : displayData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-16 text-center text-slate-500 dark:text-slate-400">
                  {emptyIcon || <Inbox className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />}
                  <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">{emptyMessage}</p>
                  {emptyAction && <div className="mt-3">{emptyAction}</div>}
                </td>
              </tr>
            ) : (
              displayData.map((item) => (
                <tr key={keyExtractor(item)} className={UI_TOKENS.table.tr}>
                  {columns.map((col) => {
                    const alignClass =
                      col.align === 'center'
                        ? 'text-center'
                        : col.align === 'right'
                        ? 'text-right'
                        : 'text-left';

                    return (
                      <td
                        key={col.key}
                        className={`${UI_TOKENS.table.td} ${alignClass}`}
                      >
                        {col.render ? col.render(item) : String(item[col.key] ?? '—')}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Unified Pagination Footer Toolbar */}
      {!isLoading && (
        <div className="bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-slate-600 dark:text-slate-400 select-none">
          {/* Records Counter */}
          <div className="flex items-center gap-4">
            <span>
              Showing <strong className="text-slate-900 dark:text-slate-100 font-semibold">{startRecord}</strong> to{' '}
              <strong className="text-slate-900 dark:text-slate-100 font-semibold">{endRecord}</strong> of{' '}
              <strong className="text-slate-900 dark:text-slate-100 font-semibold">{totalRecords}</strong> records
            </span>

            {/* Per Page Selector */}
            <div className="flex items-center gap-1.5">
              <span>Show:</span>
              <select
                value={perPage}
                onChange={(e) => handlePerPageChange(Number(e.target.value))}
                className="px-2 py-1 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:border-blue-600"
              >
                {perPageOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Page Navigator */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 dark:text-slate-400 mr-1">
              Page <strong className="text-slate-900 dark:text-slate-100 font-semibold">{currentPage}</strong> of{' '}
              <strong className="text-slate-900 dark:text-slate-100 font-semibold">{totalPages}</strong>
            </span>

            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => handlePageChange(currentPage - 1)}
              icon={<ChevronLeft className="w-3.5 h-3.5" />}
            >
              Previous
            </Button>

            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              icon={<ChevronRight className="w-3.5 h-3.5" />}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
