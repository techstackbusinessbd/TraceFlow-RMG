import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Users, TrendingUp, Edit, Trash2 } from 'lucide-react';
import { organizationService } from '../../../services/organizationService';
import type { FactoryUnit, ProductionLine } from '../../../types/organization';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { TableActionButton } from '../../../components/common/TableActionButton';
import { DataTable, type ColumnDef } from '../../../components/common/DataTable';
import { PageHeader } from '../../../components/common/PageHeader';
import { UI_TOKENS } from '../../../config/designTokens';

import { FilterToolbar } from '../../../components/common/FilterToolbar';

export const ProductionLineListPage: React.FC = () => {
  const navigate = useNavigate();
  const [lines, setLines] = useState<ProductionLine[]>([]);
  const [units, setUnits] = useState<FactoryUnit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [perPage, setPerPage] = useState<number>(10);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    organizationService.getActiveUnits().then((data) => setUnits(data as any)).catch(console.error);
  }, []);

  const fetchLines = async () => {
    setIsLoading(true);
    try {
      const data = await organizationService.getProductionLines({
        search: search || undefined,
        factory_unit_id: selectedUnit || undefined,
        section_type: selectedSection || undefined,
      });
      setLines(data.data || []);
    } catch (err) {
      console.error('Failed to fetch lines', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLines();
  }, [selectedUnit, selectedSection]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLines();
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedUnit('');
    setSelectedSection('');
    organizationService.getProductionLines().then((d) => setLines(d.data || []));
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove line/section ${name}?`)) {
      return;
    }
    setDeleteError(null);
    try {
      await organizationService.deleteProductionLine(id);
      fetchLines();
    } catch (err: any) {
      setDeleteError('Failed to remove production line.');
    }
  };

  const columns: ColumnDef<ProductionLine>[] = useMemo(
    () => [
      {
        key: 'name',
        header: 'Line / Section Name',
        sortable: true,
        render: (l) => (
          <span className="font-semibold text-slate-900 dark:text-white">
            {l.name}
          </span>
        ),
      },
      {
        key: 'code',
        header: 'Code',
        width: 'w-28',
        sortable: true,
        render: (l) => (
          <span className="font-mono text-slate-600 dark:text-slate-300">
            {l.code}
          </span>
        ),
      },
      {
        key: 'factory_unit',
        header: 'Plant & Company',
        width: 'w-48',
        render: (l) => (
          <div>
            <div className="font-medium text-slate-800 dark:text-slate-200">{l.factory_unit?.name || 'Unassigned'}</div>
            <div className="text-[11px] text-slate-400">{l.factory_unit?.company?.name || ''}</div>
          </div>
        ),
      },
      {
        key: 'section_type',
        header: 'Section Type',
        width: 'w-32',
        sortable: true,
        render: (l) => (
          <Badge variant="info">
            {l.section_type}
          </Badge>
        ),
      },
      {
        key: 'floor_no',
        header: 'Building & Floor',
        width: 'w-44',
        sortable: true,
        render: (l) => (
          <div>
            <div className="font-medium text-slate-800 dark:text-slate-200">
              {l.floor ? `#${l.floor.sort_order} - ${l.floor.floor_number}` : (l.floor_no || 'Unassigned')}
            </div>
            {l.building && (
              <div className="text-[11px] text-slate-400">
                {l.building.name} ({l.building.code})
              </div>
            )}
          </div>
        ),
      },
      {
        key: 'operator_capacity',
        header: 'Capacity',
        width: 'w-32',
        sortable: true,
        render: (l) => (
          <span className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-200 font-medium">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            {l.operator_capacity} Operators
          </span>
        ),
      },
      {
        key: 'target_efficiency_percentage',
        header: 'Efficiency',
        width: 'w-28',
        sortable: true,
        render: (l) => (
          <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            {Number(l.target_efficiency_percentage).toFixed(0)}%
          </span>
        ),
      },
      {
        key: 'is_active',
        header: 'Status',
        width: 'w-24',
        render: (l) => (
          l.is_active ? <Badge variant="success">Active</Badge> : <Badge variant="danger">Inactive</Badge>
        ),
      },
      {
        key: 'actions',
        header: 'Actions',
        width: 'w-28',
        align: 'right',
        render: (l) => (
          <div className="flex items-center justify-end gap-1.5">
            <TableActionButton
              variant="primary"
              icon={<Edit className="w-3.5 h-3.5" />}
              onClick={() => navigate(`/master-data/lines/${l.id}/edit`)}
              title="Edit Line"
            />
            <TableActionButton
              variant="danger"
              icon={<Trash2 className="w-3.5 h-3.5" />}
              onClick={() => handleDelete(l.id, l.name)}
              title="Delete Line"
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
        title="Production Lines & Sections"
        badge={
          <Badge variant="neutral">
            {lines.length} Lines
          </Badge>
        }
        actions={
          <Button
            variant="primary"
            onClick={() => navigate('/master-data/lines/create')}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Line / Section
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
            placeholder="Search line name, code, or floor..."
            className={`${UI_TOKENS.input.base} pl-9`}
          />
        </div>

        <div className="w-full md:w-56">
          <select
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            className={UI_TOKENS.input.select}
          >
            <option value="">All Factory Plants</option>
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.code})
              </option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-56">
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className={UI_TOKENS.input.select}
          >
            <option value="">All Section Types</option>
            <option value="Cutting">Cutting Room Floor</option>
            <option value="Sewing">Sewing Assembly Line</option>
            <option value="Embroidery">Embroidery Station / Line</option>
            <option value="Printing">Printing Station / Table</option>
            <option value="Finishing">Finishing & Ironing Line</option>
            <option value="Washing">Washing Plant Line</option>
            <option value="QC">End-Line QC Inspection Gate</option>
            <option value="Packing">Carton Packing Line</option>
          </select>
        </div>
      </FilterToolbar>

      {/* Centralized Design DataTable */}
      <DataTable<ProductionLine>
        columns={columns}
        data={lines}
        keyExtractor={(l) => l.id}
        isLoading={isLoading}
        emptyMessage="No production lines found. Click 'Add Line / Section' to create one."
        initialSortKey="name"
        defaultPerPage={perPage}
      />
    </div>
  );
};
