import React from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import { Button } from './Button';
import { UI_TOKENS } from '../../config/designTokens';

export interface FilterToolbarProps {
  /** Callback fired when the filter form is submitted */
  onSubmit: (e: React.FormEvent) => void;
  /** Callback fired when the reset button is clicked */
  onReset: () => void;
  /** Filter inputs/selects rendered in the main row */
  children: React.ReactNode;
  /** Currently active sort field name, e.g. 'NAME' */
  sortBy?: string;
  /** Currently active sort direction, e.g. 'ASC' | 'DESC' */
  sortDirection?: 'asc' | 'desc' | 'ASC' | 'DESC';
  /** Number of items per page */
  perPage?: number;
  /** Callback when per-page selection changes */
  onPerPageChange?: (perPage: number) => void;
  /** Custom options for per-page dropdown */
  perPageOptions?: number[];
  /** Optional custom left content for the subline instead of default sort text */
  sublineLeft?: React.ReactNode;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  onSubmit,
  onReset,
  children,
  sortBy,
  sortDirection = 'asc',
  perPage = 15,
  onPerPageChange,
  perPageOptions = [10, 15, 25, 50],
  sublineLeft,
}) => {
  return (
    <div className={UI_TOKENS.filter.container}>
      {/* Top Filter Controls Row */}
      <form onSubmit={onSubmit} className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Filter Inputs Slot */}
        <div className="flex-1 flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {children}
        </div>

        {/* Unified Filter & Reset Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <Button type="submit" variant="primary" className="px-5">
            Filter
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onReset}
            title="Reset all filters"
            icon={<RotateCcw className="w-4 h-4" />}
          />
        </div>
      </form>

      {/* Standard Subline: Sort Display & Per-page Selector */}
      <div className={UI_TOKENS.filter.subline}>
        {sublineLeft ? (
          sublineLeft
        ) : (
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span>
              Sorted by:{' '}
              <strong className="text-slate-800 dark:text-slate-200">
                {sortBy ? sortBy.toUpperCase() : 'DEFAULT'}
              </strong>{' '}
              ({sortDirection ? sortDirection.toUpperCase() : 'ASC'})
            </span>
          </div>
        )}

        {onPerPageChange && (
          <div className="flex items-center gap-2">
            <span>Show per page:</span>
            <select
              value={perPage}
              onChange={(e) => onPerPageChange(Number(e.target.value))}
              className="px-2 py-1 text-xs border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium focus:outline-none"
            >
              {perPageOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};
