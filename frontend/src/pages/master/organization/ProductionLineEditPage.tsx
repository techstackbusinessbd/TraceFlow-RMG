import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Split, Gauge, Layers, Users, Building2 } from 'lucide-react';
import { organizationService } from '../../../services/organizationService';
import type { Building, FactoryUnit, Floor, ProductionLine } from '../../../types/organization';
import { alertService } from '../../../services/alertService';
import { Button } from '../../../components/common/Button';
import { PageHeader } from '../../../components/common/PageHeader';
import { Badge } from '../../../components/common/Badge';
import { UI_TOKENS } from '../../../config/designTokens';

export const ProductionLineEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [units, setUnits] = useState<FactoryUnit[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
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

  useEffect(() => {
    organizationService.getActiveUnits().then(setUnits as any).catch(console.error);
  }, []);

  useEffect(() => {
    if (id) {
      fetchLine(id);
    }
  }, [id]);

  const fetchLine = async (lineId: string) => {
    setIsLoading(true);
    try {
      const data = await organizationService.getProductionLine(lineId);
      const unitId = data.factory_unit_id || '';
      const bldgId = data.building_id || '';
      const floorId = data.floor_id || '';

      setFormData({
        factory_unit_id: unitId,
        building_id: bldgId,
        floor_id: floorId,
        name: data.name || '',
        code: data.code || '',
        section_type: data.section_type || 'Sewing',
        floor_no: data.floor_no || '',
        operator_capacity: data.operator_capacity || 0,
        target_efficiency_percentage: Number(data.target_efficiency_percentage) || 75.00,
        is_active: data.is_active,
      });

      if (unitId) {
        const bldgs = await organizationService.getActiveBuildings(unitId);
        setBuildings(bldgs);
        if (bldgId) {
          const flrs = await organizationService.getActiveFloors({ building_id: bldgId });
          setFloors(flrs);
        }
      }
    } catch (err) {
      console.error('Failed to load line details', err);
      alertService.error('Entity Not Found', 'Could not locate production line profile.');
      navigate('/master-data/lines');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnitChange = async (unitId: string) => {
    setFormData((prev) => ({ ...prev, factory_unit_id: unitId, building_id: '', floor_id: '' }));
    try {
      const bldgs = await organizationService.getActiveBuildings(unitId);
      setBuildings(bldgs);
      setFloors([]);
    } catch (err) {
      console.error('Failed to load buildings', err);
    }
  };

  const handleBuildingChange = async (bldgId: string) => {
    setFormData((prev) => ({ ...prev, building_id: bldgId, floor_id: '' }));
    try {
      const flrs = await organizationService.getActiveFloors({ building_id: bldgId });
      setFloors(flrs);
      if (flrs.length > 0) {
        setFormData((prev) => ({
          ...prev,
          floor_id: flrs[0].id,
          floor_no: flrs[0].floor_number || flrs[0].name,
        }));
      }
    } catch (err) {
      console.error('Failed to load floors', err);
    }
  };

  const handleFloorChange = (floorId: string) => {
    const selectedFloor = floors.find((f) => f.id === floorId);
    setFormData((prev) => ({
      ...prev,
      floor_id: floorId,
      floor_no: selectedFloor ? (selectedFloor.floor_number || selectedFloor.name) : prev.floor_no,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setIsSaving(true);
    setErrors({});

    try {
      await organizationService.updateProductionLine(id, {
        ...formData,
        building_id: formData.building_id || undefined,
        floor_id: formData.floor_id || undefined,
      });
      alertService.success('Line Updated', `Production line "${formData.name}" saved successfully.`);
      navigate('/master-data/lines');
    } catch (err: any) {
      if (err.response?.status === 422 && err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        alertService.error('Update Failed', err.response?.data?.message || 'Failed to update line.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Loading line configuration...</p>
      </div>
    );
  }

  const selectedUnit = units.find((u) => u.id === formData.factory_unit_id);
  const selectedBuilding = buildings.find((b) => b.id === formData.building_id);
  const selectedFloor = floors.find((f) => f.id === formData.floor_id);

  return (
    <div className="space-y-5">
      <PageHeader
        title={`Edit Production Line: ${formData.name}`}
        badge={<Badge variant="neutral">{formData.code}</Badge>}
        actions={
          <>
            <Button
              variant="secondary"
              icon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => navigate('/master-data/lines')}
            >
              Back to Lines
            </Button>
            <Button
              variant="primary"
              icon={<Save className="w-4 h-4" />}
              isLoading={isSaving}
              type="submit"
              form="line-edit-form"
            >
              Save Changes
            </Button>
          </>
        }
      />

      <form id="line-edit-form" onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-8 space-y-5">
            {/* Card 1: Facility & Floor Mapping */}
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
                      <option value="">-- Unassigned Building --</option>
                      {buildings.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name} ({b.code})
                        </option>
                      ))}
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
                      <option value="">-- Unassigned Floor --</option>
                      {floors.map((f) => (
                        <option key={f.id} value={f.id}>
                          #{f.sort_order} - {f.floor_number} ({f.name})
                        </option>
                      ))}
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

            {/* Card 2: Line Specifications */}
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
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                        {errors.name[0]}
                      </p>
                    )}
                  </div>

                  {/* Line Tracking Code */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Line Tracking Code <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      className={`${UI_TOKENS.input.base} font-mono ${errors.code ? 'border-rose-500 bg-rose-50/20' : ''}`}
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
                      onChange={(e) => setFormData({ ...formData, section_type: e.target.value as any })}
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

                  {/* Specific Bay / Wing Note */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Specific Bay / Wing Note
                    </label>
                    <input
                      type="text"
                      value={formData.floor_no}
                      onChange={(e) => setFormData({ ...formData, floor_no: e.target.value })}
                      className={UI_TOKENS.input.base}
                      placeholder="e.g. 2nd Floor, West Wing"
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
            <div className={UI_TOKENS.card.base}>
              <div className="p-5 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3 shadow-sm">
                  <Split className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {formData.name || 'Unnamed Line'}
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
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedBuilding?.name || 'Unassigned'}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> Floor Level</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedFloor ? `#${selectedFloor.sort_order} - ${selectedFloor.floor_number}` : (formData.floor_no || 'Unassigned')}
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
