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

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  isLoading?: boolean;
  emptyMessage?: string;
  initialSortKey?: string;
  initialSortDir?: 'asc' | 'desc';
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
  initialSortKey,
  initialSortDir = 'asc',
  defaultPerPage = 10,
  perPageOptions = [10, 25, 50],
  className = '',
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | undefined>(initialSortKey);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>(initialSortDir);
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(defaultPerPage);

  // Sorting Handler
  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(1);
  };

  // Sorted Data Memo
  const sortedData = useMemo(() => {
    if (!sortKey) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const strA = String(aVal).toLowerCase();
      const strB = String(bVal).toLowerCase();
      return sortDir === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
    });
  }, [data, sortKey, sortDir]);

  // Pagination Slice Memo
  const totalRecords = sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / perPage));
  const currentPage = Math.min(page, totalPages);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return sortedData.slice(start, start + perPage);
  }, [sortedData, currentPage, perPage]);

  const startRecord = totalRecords === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const endRecord = Math.min(currentPage * perPage, totalRecords);

  return (
    <div className={`${UI_TOKENS.table.wrapper} ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse table-fixed">
          {/* Table Header */}
          <thead>
            <tr className={UI_TOKENS.table.headerRow}>
              {columns.map((col) => {
                const isSorted = sortKey === col.key;
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
                        className={`inline-flex items-center gap-1.5 hover:text-slate-900 transition-colors focus:outline-none ${
                          alignClass === 'text-center'
                            ? 'mx-auto justify-center'
                            : alignClass === 'text-right'
                            ? 'ml-auto justify-end'
                            : 'justify-start'
                        }`}
                      >
                        <span>{col.header}</span>
                        {isSorted ? (
                          sortDir === 'asc' ? (
                            <ArrowUp className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          ) : (
                            <ArrowDown className="w-3.5 h-3.5 text-blue-600 shrink-0" />
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
          <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="py-16 text-center text-slate-400">
                  <div className="inline-flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent animate-spin rounded-full" />
                    <span className="text-xs font-semibold">Loading data records...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-16 text-center text-slate-500">
                  <Inbox className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="font-bold text-slate-800 text-sm">{emptyMessage}</p>
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => (
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

      {/* Pagination Footer Toolbar */}
      {!isLoading && totalRecords > 0 && (
        <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-slate-600 select-none">
          {/* Records Counter */}
          <div className="flex items-center gap-4">
            <span>
              Showing <strong className="text-slate-900 font-semibold">{startRecord}</strong> to{' '}
              <strong className="text-slate-900 font-semibold">{endRecord}</strong> of{' '}
              <strong className="text-slate-900 font-semibold">{totalRecords}</strong> records
            </span>

            {/* Per Page Selector */}
            <div className="flex items-center gap-1.5">
              <span>Show:</span>
              <select
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setPage(1);
                }}
                className="px-2 py-1 border border-slate-300 rounded-md bg-white text-slate-800 font-medium focus:outline-none focus:border-blue-600"
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
            <span className="text-slate-500 mr-1">
              Page <strong className="text-slate-900 font-semibold">{currentPage}</strong> of{' '}
              <strong className="text-slate-900 font-semibold">{totalPages}</strong>
            </span>

            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              icon={<ChevronLeft className="w-3.5 h-3.5" />}
            >
              Previous
            </Button>

            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
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
