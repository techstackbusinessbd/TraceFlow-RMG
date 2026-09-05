import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { organizationService } from '../../../services/organizationService';
import type { Building } from '../../../types/organization';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { TableActionButton } from '../../../components/common/TableActionButton';
import { DataTable, type ColumnDef } from '../../../components/common/DataTable';
import { PageHeader } from '../../../components/common/PageHeader';
import { FilterToolbar } from '../../../components/common/FilterToolbar';
import { UI_TOKENS } from '../../../config/designTokens';

export const BuildingListPage: React.FC = () => {
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [units, setUnits] = useState<{ id: string; name: string; code: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [perPage, setPerPage] = useState<number>(10);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    organizationService.getActiveUnits().then(setUnits).catch(console.error);
  }, []);

  const fetchBuildings = async () => {
    setIsLoading(true);
    try {
      const data = await organizationService.getBuildings({
        search: search || undefined,
        factory_unit_id: selectedUnit || undefined,
      });
      setBuildings(data.data || []);
    } catch (err) {
      console.error('Failed to fetch buildings', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBuildings();
  }, [selectedUnit]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBuildings();
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedUnit('');
    organizationService.getBuildings().then((d) => setBuildings(d.data || []));
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove ${name}?`)) {
      return;
    }
    setDeleteError(null);
    try {
      await organizationService.deleteBuilding(id);
      fetchBuildings();
    } catch (err: any) {
      if (err.response?.status === 422) {
        setDeleteError(err.response.data.message);
      } else {
        setDeleteError('Failed to remove building. Ensure no floors or lines are assigned to it.');
      }
    }
  };

  const columns: ColumnDef<Building>[] = useMemo(
    () => [
      {
        key: 'name',
        header: 'Building Name',
        sortable: true,
        render: (b) => (
          <div>
            <span className="font-semibold text-slate-900 dark:text-white">{b.name}</span>
            <div className="text-[11px] text-slate-400 font-normal">
              {b.description || 'No description provided'}
            </div>
          </div>
        ),
      },
      {
        key: 'code',
        header: 'Code',
        sortable: true,
        render: (b) => (
          <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {b.code}
          </span>
        ),
      },
      {
        key: 'factory_unit',
        header: 'Factory Plant',
        render: (b) => (
          <div>
            <div className="font-medium text-slate-900 dark:text-slate-200">
              {b.factory_unit?.name || 'N/A'}
            </div>
            <div className="text-[11px] text-slate-400">
              {b.factory_unit?.company?.name || ''}
            </div>
          </div>
        ),
      },
      {
        key: 'total_floors',
        header: 'Floors Registered',
        sortable: true,
        render: (b) => (
          <Badge variant="neutral">
            {b.floors_count !== undefined ? `${b.floors_count} / ${b.total_floors} Floors` : `${b.total_floors} Floors`}
          </Badge>
        ),
      },
      {
        key: 'is_active',
        header: 'Status',
        render: (b) => (
          <Badge variant={b.is_active ? 'success' : 'danger'}>
            {b.is_active ? 'Active' : 'Inactive'}
          </Badge>
        ),
      },
      {
        key: 'actions',
        header: 'Actions',
        align: 'right',
        render: (b) => (
          <div className="flex items-center justify-end gap-1.5">
            <TableActionButton
              icon={<Edit className="w-3.5 h-3.5" />}
              title="Edit Building"
              variant="base"
              onClick={() => navigate(`/master-data/buildings/${b.id}/edit`)}
            />
            <TableActionButton
              icon={<Trash2 className="w-3.5 h-3.5" />}
              title="Delete Building"
              variant="danger"
              onClick={() => handleDelete(b.id, b.name)}
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
        title="Buildings & Facilities"
        badge={<Badge variant="neutral">{buildings.length} Buildings</Badge>}
        actions={
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => navigate('/master-data/buildings/create')}
          >
            Add Building
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
            placeholder="Search building name, tracking code..."
            className={`${UI_TOKENS.input.base} pl-9`}
          />
        </div>

        <div className="w-full md:w-56">
          <select
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            className={UI_TOKENS.input.select}
          >
            <option value="">All Factory Units</option>
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.code})
              </option>
            ))}
          </select>
        </div>
      </FilterToolbar>

      <DataTable<Building>
        columns={columns}
        data={buildings}
        keyExtractor={(b) => b.id}
        isLoading={isLoading}
        emptyMessage="No buildings configured. Click 'Add Building' to register."
        initialSortKey="name"
        defaultPerPage={perPage}
      />
    </div>
  );
};
