import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Sparkles, RefreshCw, Split, Gauge, Layers, Users, Building2 } from 'lucide-react';
import { organizationService } from '../../../services/organizationService';
import type { Building, FactoryUnit, Floor, ProductionLine } from '../../../types/organization';
import { alertService } from '../../../services/alertService';
import { Button } from '../../../components/common/Button';
import { PageHeader } from '../../../components/common/PageHeader';
import { Badge } from '../../../components/common/Badge';
import { UI_TOKENS } from '../../../config/designTokens';

export const ProductionLineCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [units, setUnits] = useState<FactoryUnit[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const [formData, setFormData] = useState<{
    factory_unit_id: string;
    building_id: string;
    floor_id: string;
    name: string;
    code: string;
    section_type: ProductionLine['section_type'];
    floor_no: string;
    operator_capacity: number;
    target_efficiency_percentage: number;
    is_active: boolean;
  }>({
    factory_unit_id: '',
    building_id: '',
    floor_id: '',
    name: '',
    code: '',
    section_type: 'Sewing',
    floor_no: '',
    operator_capacity: 35,
    target_efficiency_percentage: 75.00,
    is_active: true,
  });

  const fetchNextCode = async (unitId?: string, section?: string) => {
    setIsGeneratingCode(true);
    try {
      const code = await organizationService.getNextLineCode({
        factory_unit_id: unitId || formData.factory_unit_id || undefined,
        section_type: section || formData.section_type || undefined,
      });
      setFormData((prev) => ({ ...prev, code }));
    } catch {
      const prefix = (section || formData.section_type) === 'Sewing' ? 'L' : 'SEC';
      setFormData((prev) => ({ ...prev, code: `${prefix}-01` }));
    } finally {
      setIsGeneratingCode(false);
    }
  };

  // Initial load: Fetch Factory Units
  useEffect(() => {
    organizationService.getActiveUnits().then((data) => {
      setUnits(data as any);
      if (data.length > 0) {
        const firstUnitId = data[0].id;
        setFormData((prev) => ({ ...prev, factory_unit_id: firstUnitId }));
        fetchNextCode(firstUnitId, 'Sewing');
        loadBuildings(firstUnitId);
      }
    }).catch(console.error);
  }, []);

  // Cascading Step 1: Load Buildings for selected factory unit
  const loadBuildings = async (unitId: string) => {
    try {
      const bldgs = await organizationService.getActiveBuildings(unitId);
      setBuildings(bldgs);
      if (bldgs.length > 0) {
        const firstBldgId = bldgs[0].id;
        setFormData((prev) => ({ ...prev, building_id: firstBldgId }));
        loadFloors(firstBldgId);
      } else {
        setBuildings([]);
        setFloors([]);
        setFormData((prev) => ({ ...prev, building_id: '', floor_id: '', floor_no: '' }));
      }
    } catch (err) {
      console.error('Failed to load buildings', err);
    }
  };

  // Cascading Step 2: Load Floors for selected building (strictly sorted by sort_order serial)
  const loadFloors = async (bldgId: string) => {
    try {
      const flrs = await organizationService.getActiveFloors({ building_id: bldgId });
      setFloors(flrs);
      if (flrs.length > 0) {
        const firstFloor = flrs[0];
        setFormData((prev) => ({
          ...prev,
          floor_id: firstFloor.id,
          floor_no: firstFloor.floor_number || firstFloor.name,
        }));
      } else {
        setFloors([]);
        setFormData((prev) => ({ ...prev, floor_id: '', floor_no: '' }));
      }
    } catch (err) {
      console.error('Failed to load floors', err);
    }
  };

  const handleUnitChange = (unitId: string) => {
    setFormData((prev) => ({ ...prev, factory_unit_id: unitId }));
    fetchNextCode(unitId, formData.section_type);
    loadBuildings(unitId);
  };

  const handleBuildingChange = (bldgId: string) => {
    setFormData((prev) => ({ ...prev, building_id: bldgId }));
    loadFloors(bldgId);
  };

  const handleFloorChange = (floorId: string) => {
    const selectedFloor = floors.find((f) => f.id === floorId);
    setFormData((prev) => ({
      ...prev,
      floor_id: floorId,
      floor_no: selectedFloor ? (selectedFloor.floor_number || selectedFloor.name) : prev.floor_no,
    }));
  };

  const handleSectionChange = (section: ProductionLine['section_type']) => {
    setFormData((prev) => ({ ...prev, section_type: section }));
    fetchNextCode(formData.factory_unit_id, section);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrors({});

    try {
      await organizationService.createProductionLine({
        ...formData,
        building_id: formData.building_id || undefined,
        floor_id: formData.floor_id || undefined,
      });
      alertService.success('Line Created', `Production line "${formData.name}" established successfully.`);
      navigate('/master-data/lines');
    } catch (err: any) {
      if (err.response?.status === 422 && err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        alertService.error('Creation Failed', err.response?.data?.message || 'Failed to create production line.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const selectedUnit = units.find((u) => u.id === formData.factory_unit_id);
  const selectedBuilding = buildings.find((b) => b.id === formData.building_id);
  const selectedFloor = floors.find((f) => f.id === formData.floor_id);

  return (
    <div className="space-y-5">
      {/* Mandatory Golden Standard Page Header */}
      <PageHeader
        title="Establish Production Line"
        actions={
          <>
            <Button
              variant="secondary"
              icon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => navigate('/master-data/lines')}
            >
              Back to Directory
            </Button>
            <Button
              variant="primary"
              icon={<Save className="w-4 h-4" />}
              isLoading={isSaving}
              type="submit"
              form="line-create-form"
            >
              Deploy Line
            </Button>
          </>
        }
      />

      {/* Pure Server-Side Form with 2-Column Standard Enterprise Layout */}
      <form id="line-create-form" onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Main Form Sections (8 Cols) */}
          <div className="lg:col-span-8 space-y-5">
            {/* Card 1: Facility Mapping & Hierarchy */}
            <div className={UI_TOKENS.card.base}>
              <div className={UI_TOKENS.card.header}>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Facility & Floor Mapping (Factory &gt; Building &gt; Floor)
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">Sequential Location Binding</span>
              </div>

              <div className={`${UI_TOKENS.card.body} space-y-4`}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Step 1: Target Factory Plant */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      1. Factory Plant <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.factory_unit_id}
                      onChange={(e) => handleUnitChange(e.target.value)}
                      className={UI_TOKENS.input.select}
                    >
                      {units.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.code})
                        </option>
                      ))}
                    </select>
                    {errors.factory_unit_id && (
                      <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                        {errors.factory_unit_id[0]}
                      </p>
                    )}
                  </div>

                  {/* Step 2: Target Building */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      2. Facility Building
                    </label>
                    <select
                      value={formData.building_id}
                      onChange={(e) => handleBuildingChange(e.target.value)}
                      className={UI_TOKENS.input.select}
                    >
                      {buildings.length === 0 ? (
                        <option value="">No buildings found</option>
                      ) : (
                        buildings.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name} ({b.code})
                          </option>
                        ))
                      )}
                    </select>
                    {errors.building_id && (
                      <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                        {errors.building_id[0]}
                      </p>
                    )}
                  </div>

                  {/* Step 3: Target Floor (Strict Serial Ordered) */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      3. Floor (Serial Ordered)
                    </label>
                    <select
                      value={formData.floor_id}
                      onChange={(e) => handleFloorChange(e.target.value)}
                      className={UI_TOKENS.input.select}
                    >
                      {floors.length === 0 ? (
                        <option value="">No floors found</option>
                      ) : (
                        floors.map((f) => (
                          <option key={f.id} value={f.id}>
                            #{f.sort_order} - {f.floor_number} ({f.name})
                          </option>
                        ))
                      )}
                    </select>
                    {errors.floor_id && (
                      <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                        {errors.floor_id[0]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Line Specifications & Benchmarks */}
            <div className={UI_TOKENS.card.base}>
              <div className={UI_TOKENS.card.header}>
                <div className="flex items-center gap-2">
                  <Split className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Line Architecture & Capacity
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">Operational Details</span>
              </div>

              <div className={`${UI_TOKENS.card.body} space-y-4`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Line Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Line Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`${UI_TOKENS.input.base} ${errors.name ? 'border-rose-500 bg-rose-50/20' : ''}`}
                      placeholder="e.g. Line 01 (Woven Bottoms)"
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                        {errors.name[0]}
                      </p>
                    )}
                  </div>

                  {/* Line Tracking Code */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Line Tracking Code <span className="text-rose-500">*</span>
                      </label>
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                          <Sparkles className="w-2.5 h-2.5" /> Auto-Generated
                        </span>
                        <button
                          type="button"
                          onClick={() => fetchNextCode()}
                          title="Regenerate Next Line Code"
                          disabled={isGeneratingCode}
                          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        >
                          <RefreshCw className={`w-3 h-3 ${isGeneratingCode ? 'animate-spin text-blue-600' : ''}`} />
                        </button>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      className={`${UI_TOKENS.input.base} font-mono font-semibold bg-slate-50 dark:bg-slate-800/60`}
                      placeholder="Auto-generating code (e.g. L-01)..."
                    />
                    {errors.code && (
                      <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                        {errors.code[0]}
                      </p>
                    )}
                  </div>

                  {/* Section Type */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Section / Department <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.section_type}
                      onChange={(e) => handleSectionChange(e.target.value as any)}
                      className={UI_TOKENS.input.select}
                    >
                      <option value="Cutting">Cutting Room Floor</option>
                      <option value="Sewing">Sewing Assembly Line</option>
                      <option value="Embroidery">Embroidery Station / Line</option>
                      <option value="Printing">Printing Station / Table</option>
                      <option value="Finishing">Finishing & Ironing Line</option>
                      <option value="Washing">Washing Plant Line</option>
                      <option value="QC">End-Line QC Inspection Gate</option>
                      <option value="Packing">Packing & Carton Sealing</option>
                    </select>
                    {errors.section_type && (
                      <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                        {errors.section_type[0]}
                      </p>
                    )}
                  </div>

                  {/* Floor Placement Note / Detail */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Specific Bay / Wing Note
                    </label>
                    <input
                      type="text"
                      value={formData.floor_no}
                      onChange={(e) => setFormData({ ...formData, floor_no: e.target.value })}
                      className={UI_TOKENS.input.base}
                      placeholder="e.g. East Wing, Column C-4"
                    />
                  </div>

                  {/* Operator Capacity */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Active Machine / Operator Capacity <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.operator_capacity}
                      onChange={(e) => setFormData({ ...formData, operator_capacity: parseInt(e.target.value) || 0 })}
                      className={`${UI_TOKENS.input.base} ${errors.operator_capacity ? 'border-rose-500 bg-rose-50/20' : ''}`}
                    />
                    {errors.operator_capacity && (
                      <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                        {errors.operator_capacity[0]}
                      </p>
                    )}
                  </div>

                  {/* Benchmark Efficiency */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Standard Benchmark Efficiency (%) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="10"
                      max="100"
                      value={formData.target_efficiency_percentage}
                      onChange={(e) => setFormData({ ...formData, target_efficiency_percentage: parseFloat(e.target.value) || 0 })}
                      className={`${UI_TOKENS.input.base} ${errors.target_efficiency_percentage ? 'border-rose-500 bg-rose-50/20' : ''}`}
                    />
                    {errors.target_efficiency_percentage && (
                      <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                        {errors.target_efficiency_percentage[0]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Summary Sidebar (4 Cols) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Live Line Identifier Card */}
            <div className={UI_TOKENS.card.base}>
              <div className="p-5 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3 shadow-sm">
                  <Split className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {formData.name || 'Unnamed Production Line'}
                </h4>
                <p className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                  Code: {formData.code || 'PENDING'}
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <Badge variant="neutral">{formData.section_type}</Badge>
                  {formData.is_active ? (
                    <Badge variant="success">Active</Badge>
                  ) : (
                    <Badge variant="danger">Inactive</Badge>
                  )}
                </div>
              </div>

              {/* Activation Toggle */}
              <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    Active Production Stream
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Enables batch allocation and live tracker
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 cursor-pointer"
                />
              </div>

              {/* Hierarchy Summary */}
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 text-xs space-y-2">
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> Plant</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedUnit?.name || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> Building</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedBuilding?.name || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> Floor Level</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedFloor ? `#${selectedFloor.sort_order} - ${selectedFloor.floor_number}` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Operators</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{formData.operator_capacity} Stations</span>
                </div>
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1.5"><Gauge className="w-3.5 h-3.5" /> Target Eff.</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{formData.target_efficiency_percentage}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
