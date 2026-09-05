import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Layers, Edit, Trash2 } from "lucide-react";
import { organizationService } from "../../../services/organizationService";
import type { FactoryUnit } from "../../../types/organization";
import { Button } from "../../../components/common/Button";
import { Badge } from "../../../components/common/Badge";
import { TableActionButton } from "../../../components/common/TableActionButton";
import {
  DataTable,
  type ColumnDef,
} from "../../../components/common/DataTable";
import { PageHeader } from "../../../components/common/PageHeader";
import { FilterToolbar } from "../../../components/common/FilterToolbar";
import { UI_TOKENS } from "../../../config/designTokens";

export const FactoryUnitListPage: React.FC = () => {
  const navigate = useNavigate();
  const [units, setUnits] = useState<FactoryUnit[]>([]);
  const [companies, setCompanies] = useState<
    { id: string; name: string; code: string; currency: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedPremises, setSelectedPremises] = useState("");
  const [perPage, setPerPage] = useState<number>(10);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    organizationService
      .getActiveCompanies()
      .then(setCompanies)
      .catch(console.error);
  }, []);

  const fetchUnits = async () => {
    setIsLoading(true);
    try {
      const data = await organizationService.getFactoryUnits({
        search: search || undefined,
        company_id: selectedCompany || undefined,
        premises_type: selectedPremises || undefined,
      });
      setUnits(data.data || []);
    } catch (err) {
      console.error("Failed to fetch factory units", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, [selectedCompany, selectedPremises]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUnits();
  };

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCompany("");
    setSelectedPremises("");
    organizationService.getFactoryUnits().then((d) => setUnits(d.data || []));
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove ${name}?`)) {
      return;
    }
    setDeleteError(null);
    try {
      await organizationService.deleteFactoryUnit(id);
      fetchUnits();
    } catch (err: any) {
      if (err.response?.status === 422) {
        setDeleteError(err.response.data.message);
      } else {
        setDeleteError(
          "Failed to remove plant. Ensure no production lines are assigned to it.",
        );
      }
    }
  };

  const columns: ColumnDef<FactoryUnit>[] = useMemo(
    () => [
      {
        key: "name",
        header: "Plant Name",
        sortable: true,
        render: (u) => (
          <div>
            <span className="font-semibold text-slate-900 dark:text-white">
              {u.name}
            </span>
            <div className="text-[11px] text-slate-400 font-normal">
              {u.city || u.address || "Address N/A"}
            </div>
          </div>
        ),
      },
      {
        key: "code",
        header: "Code",
        width: "w-28",
        sortable: true,
        render: (u) => (
          <span className="font-mono text-slate-600 dark:text-slate-300">
            {u.code}
          </span>
        ),
      },
      {
        key: "company",
        header: "Operating Company",
        width: "w-48",
        render: (u) => (
          <span className="font-medium text-slate-700 dark:text-slate-200">
            {u.company?.name || "Unassigned"}
          </span>
        ),
      },
      {
        key: "premises_type",
        header: "Type & Floors",
        width: "w-36",
        sortable: true,
        render: (u) => (
          <div>
            <div className="font-semibold text-slate-800 dark:text-slate-200">
              {u.premises_type}
            </div>
            <div className="text-[11px] text-slate-400">
              {u.total_floors} Floor(s)
            </div>
          </div>
        ),
      },
      {
        key: "production_lines_count",
        header: "Lines & Gates",
        width: "w-32",
        sortable: true,
        render: (u) => (
          <Badge variant="info" icon={<Layers className="w-3 h-3 text-blue-500" />}>
            {u.production_lines_count ?? 0} Lines
          </Badge>
        ),
      },
      {
        key: "compliance_grade",
        header: "Compliance",
        width: "w-28",
        render: (u) =>
          u.compliance_grade ? (
            <Badge variant="success">
              {u.compliance_grade}
            </Badge>
          ) : (
            <span className="text-slate-400">N/A</span>
          ),
      },
      {
        key: "is_active",
        header: "Status",
        width: "w-24",
        render: (u) =>
          u.is_active ? (
            <Badge variant="success">Active</Badge>
          ) : (
            <Badge variant="danger">Inactive</Badge>
          ),
      },
      {
        key: "actions",
        header: "Actions",
        width: "w-28",
        align: "right",
        render: (u) => (
          <div className="flex items-center justify-end gap-1.5">
            <TableActionButton
              variant="primary"
              icon={<Edit className="w-3.5 h-3.5" />}
              onClick={() => navigate(`/master-data/units/${u.id}/edit`)}
              title="Edit Plant"
            />
            <TableActionButton
              variant="danger"
              icon={<Trash2 className="w-3.5 h-3.5" />}
              onClick={() => handleDelete(u.id, u.name)}
              title="Delete Plant"
            />
          </div>
        ),
      },
    ],
    [navigate],
  );

  return (
    <div className="space-y-6">
      {/* Reusable Standard Page Header */}
      <PageHeader
        title="Factory Plants"
        badge={
          <Badge variant="neutral">
            {units.length} Plants
          </Badge>
        }
        actions={
          <Button
            variant="primary"
            onClick={() => navigate("/master-data/units/create")}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Factory Plant
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
            placeholder="Search plant name, code, or city..."
            className={`${UI_TOKENS.input.base} pl-9`}
          />
        </div>

        <div className="w-full md:w-56">
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className={UI_TOKENS.input.select}
          >
            <option value="">All Sister Companies</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.code})
              </option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-56">
          <select
            value={selectedPremises}
            onChange={(e) => setSelectedPremises(e.target.value)}
            className={UI_TOKENS.input.select}
          >
            <option value="">All Facility Types</option>
            <option value="Woven">Woven Garments</option>
            <option value="Knit">Knitwear</option>
            <option value="Denim">Denim / Heavy Fabric</option>
            <option value="Washing">Industrial Laundry / Wash</option>
            <option value="Printing">Printing Plant (Screen/Rotary/Digital)</option>
            <option value="Embroidery">Computerized Embroidery Plant</option>
            <option value="Composite">Composite Full-Vertical</option>
            <option value="Central Warehouse">Central Raw Material Warehouse</option>
          </select>
        </div>
      </FilterToolbar>

      {/* Centralized Design DataTable */}
      <DataTable<FactoryUnit>
        columns={columns}
        data={units}
        keyExtractor={(u) => u.id}
        isLoading={isLoading}
        emptyMessage="No factory plants found. Click 'Add Factory Plant' to configure."
        initialSortKey="name"
        defaultPerPage={perPage}
      />
    </div>
  );
};
