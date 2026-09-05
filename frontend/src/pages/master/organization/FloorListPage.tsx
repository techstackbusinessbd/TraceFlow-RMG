import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { organizationService } from '../../../services/organizationService';
import type { Floor } from '../../../types/organization';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { TableActionButton } from '../../../components/common/TableActionButton';
import { DataTable, type ColumnDef } from '../../../components/common/DataTable';
import { PageHeader } from '../../../components/common/PageHeader';
import { FilterToolbar } from '../../../components/common/FilterToolbar';
import { UI_TOKENS } from '../../../config/designTokens';

export const FloorListPage: React.FC = () => {
  const navigate = useNavigate();
  const [floors, setFloors] = useState<Floor[]>([]);
  const [buildings, setBuildings] = useState<{ id: string; name: string; code: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [perPage, setPerPage] = useState<number>(15);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    organizationService.getActiveBuildings().then(setBuildings).catch(console.error);
  }, []);

  const fetchFloors = async () => {
    setIsLoading(true);
    try {
      const data = await organizationService.getFloors({
        search: search || undefined,
        building_id: selectedBuilding || undefined,
      });
      setFloors(data.data || []);
    } catch (err) {
      console.error('Failed to fetch floors', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFloors();
  }, [selectedBuilding]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFloors();
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedBuilding('');
    organizationService.getFloors().then((d) => setFloors(d.data || []));
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove floor "${name}"?`)) {
      return;
    }
    setDeleteError(null);
    try {
      await organizationService.deleteFloor(id);
      fetchFloors();
    } catch (err: any) {
      if (err.response?.status === 422) {
        setDeleteError(err.response.data.message);
      } else {
        setDeleteError('Failed to remove floor. Ensure no production lines are assigned to it.');
      }
    }
  };

  const columns: ColumnDef<Floor>[] = useMemo(
    () => [
      {
        key: 'sort_order',
        header: 'Serial / Level',
        sortable: true,
        render: (f) => (
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            #{f.sort_order}
          </span>
        ),
      },
      {
        key: 'name',
        header: 'Floor Name & Designation',
        sortable: true,
        render: (f) => (
          <div>
            <span className="font-semibold text-slate-900 dark:text-white">{f.name}</span>
            <div className="text-[11px] text-slate-400 font-normal">
              Floor Level: {f.floor_number}
            </div>
          </div>
        ),
      },
      {
        key: 'code',
        header: 'Code',
        sortable: true,
        render: (f) => (
          <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {f.code}
          </span>
        ),
      },
      {
        key: 'building',
        header: 'Facility & Plant',
        render: (f) => (
          <div>
            <div className="font-medium text-slate-900 dark:text-slate-200">
              {f.building?.name || 'N/A'} ({f.building?.code || ''})
            </div>
            <div className="text-[11px] text-slate-400">
              {f.building?.factory_unit?.name || ''}
            </div>
          </div>
        ),
      },
      {
        key: 'production_lines_count',
        header: 'Lines Assigned',
        render: (f) => (
          <Badge variant="neutral">
            {f.production_lines_count !== undefined ? `${f.production_lines_count} Lines` : '0 Lines'}
          </Badge>
        ),
      },
      {
        key: 'is_active',
        header: 'Status',
        render: (f) => (
          <Badge variant={f.is_active ? 'success' : 'danger'}>
            {f.is_active ? 'Active' : 'Inactive'}
          </Badge>
        ),
      },
      {
        key: 'actions',
        header: 'Actions',
        align: 'right',
        render: (f) => (
          <div className="flex items-center justify-end gap-1.5">
            <TableActionButton
              icon={<Edit className="w-3.5 h-3.5" />}
              title="Edit Floor"
              variant="base"
              onClick={() => navigate(`/master-data/floors/${f.id}/edit`)}
            />
            <TableActionButton
              icon={<Trash2 className="w-3.5 h-3.5" />}
              title="Delete Floor"
              variant="danger"
              onClick={() => handleDelete(f.id, f.name)}
            />
          </div>
        ),
      },
    ],
    [navigate]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Floors & Layouts"
        badge={<Badge variant="neutral">{floors.length} Floors</Badge>}
        actions={
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => navigate('/master-data/floors/create')}
          >
            Add Floor
          </Button>
        }
      />

      {deleteError && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-md">
          {deleteError}
        </div>
      )}

      <FilterToolbar
        onSubmit={handleSearchSubmit}
        onReset={handleResetFilters}
        sortBy="SORT_ORDER"
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
            placeholder="Search floor name, code, designation..."
            className={`${UI_TOKENS.input.base} pl-9`}
          />
        </div>

        <div className="w-full md:w-56">
          <select
            value={selectedBuilding}
            onChange={(e) => setSelectedBuilding(e.target.value)}
            className={UI_TOKENS.input.select}
          >
            <option value="">All Buildings</option>
            {buildings.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.code})
              </option>
            ))}
          </select>
        </div>
      </FilterToolbar>

      <DataTable<Floor>
        columns={columns}
        data={floors}
        keyExtractor={(f) => f.id}
        isLoading={isLoading}
        emptyMessage="No floors configured. Click 'Add Floor' to register."
        initialSortKey="sort_order"
        defaultPerPage={perPage}
      />
    </div>
  );
};
