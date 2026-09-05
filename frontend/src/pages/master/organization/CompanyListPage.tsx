import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Factory, Edit, Trash2 } from 'lucide-react';
import { organizationService } from '../../../services/organizationService';
import type { Company } from '../../../types/organization';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { TableActionButton } from '../../../components/common/TableActionButton';
import { DataTable, type ColumnDef } from '../../../components/common/DataTable';
import { PageHeader } from '../../../components/common/PageHeader';
import { FilterToolbar } from '../../../components/common/FilterToolbar';
import { UI_TOKENS } from '../../../config/designTokens';

export const CompanyListPage: React.FC = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('');
  const [perPage, setPerPage] = useState<number>(10);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchCompanies = async () => {
    setIsLoading(true);
    try {
      const data = await organizationService.getCompanies({
        search: search || undefined,
        is_active: activeFilter !== '' ? activeFilter : undefined,
      });
      setCompanies(data.data || []);
    } catch (err) {
      console.error('Failed to fetch companies', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [activeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCompanies();
  };

  const handleResetFilters = () => {
    setSearch('');
    setActiveFilter('');
    organizationService.getCompanies().then((d) => setCompanies(d.data || []));
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove ${name}?`)) {
      return;
    }
    setDeleteError(null);
    try {
      await organizationService.deleteCompany(id);
      fetchCompanies();
    } catch (err: any) {
      if (err.response?.status === 422) {
        setDeleteError(err.response.data.message);
      } else {
        setDeleteError('Failed to delete company. Ensure no factory plants are linked.');
      }
    }
  };

  const columns: ColumnDef<Company>[] = useMemo(
    () => [
      {
        key: 'name',
        header: 'Company Name',
        sortable: true,
        render: (c) => (
          <span className="font-semibold text-slate-900 dark:text-white">
            {c.name}
          </span>
        ),
      },
      {
        key: 'code',
        header: 'Code',
        width: 'w-32',
        sortable: true,
        render: (c) => (
          <span className="font-mono text-slate-600 dark:text-slate-300">
            {c.code}
          </span>
        ),
      },
      {
        key: 'bin_number',
        header: 'NBR BIN / TIN',
        width: 'w-48',
        render: (c) => (
          <div>
            <div><span className="font-semibold text-slate-700 dark:text-slate-200">BIN:</span> {c.bin_number || 'N/A'}</div>
            <div className="text-[11px] text-slate-400"><span className="font-semibold">TIN:</span> {c.tin_number || 'N/A'}</div>
          </div>
        ),
      },
      {
        key: 'factory_units_count',
        header: 'Plants Linked',
        width: 'w-36',
        sortable: true,
        render: (c) => (
          <Badge variant="neutral" icon={<Factory className="w-3 h-3 text-slate-500" />}>
            {c.factory_units_count ?? 0} Plants
          </Badge>
        ),
      },
      {
        key: 'currency',
        header: 'Currency',
        width: 'w-28',
        sortable: true,
        render: (c) => (
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {c.currency}
          </span>
        ),
      },
      {
        key: 'is_active',
        header: 'Status',
        width: 'w-28',
        render: (c) => (
          c.is_active ? <Badge variant="success">Active</Badge> : <Badge variant="danger">Inactive</Badge>
        ),
      },
      {
        key: 'actions',
        header: 'Actions',
        width: 'w-28',
        align: 'right',
        render: (c) => (
          <div className="flex items-center justify-end gap-1.5">
            <TableActionButton
              variant="primary"
              icon={<Edit className="w-3.5 h-3.5" />}
              onClick={() => navigate(`/master-data/companies/${c.id}/edit`)}
              title="Edit Company"
            />
            <TableActionButton
              variant="danger"
              icon={<Trash2 className="w-3.5 h-3.5" />}
              onClick={() => handleDelete(c.id, c.name)}
              title="Delete Company"
            />
          </div>
        ),
      },
    ],
    [navigate]
  );

  return (
    <div className="space-y-6">
      {/* Reusable Standard Page Header */}
      <PageHeader
        title="Sister Companies"
        badge={
          <Badge variant="neutral">
            {companies.length} Entities
          </Badge>
        }
        actions={
          <Button
            variant="primary"
            onClick={() => navigate('/master-data/companies/create')}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Sister Company
          </Button>
        }
      />

      {deleteError && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 rounded-md text-sm text-rose-800 dark:text-rose-300">
          {deleteError}
        </div>
      )}

      {/* Enterprise Filter Toolbar */}
      <FilterToolbar
        onSubmit={handleSearchSubmit}
        onReset={handleResetFilters}
        sortBy="NAME"
        sortDirection="asc"
        perPage={perPage}
        onPerPageChange={setPerPage}
      >
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company name, code, or BIN..."
            className={`${UI_TOKENS.input.base} pl-9`}
          />
        </div>
        <div className="w-full md:w-48">
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            className={UI_TOKENS.input.select}
          >
            <option value="">All Statuses</option>
            <option value="true">Active Only</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </FilterToolbar>

      {/* Centralized Design DataTable */}
      <DataTable<Company>
        columns={columns}
        data={companies}
        keyExtractor={(c) => c.id}
        isLoading={isLoading}
        emptyMessage="No sister companies found. Click 'Add Sister Company' to register one."
        initialSortKey="name"
        defaultPerPage={perPage}
      />
    </div>
  );
};
