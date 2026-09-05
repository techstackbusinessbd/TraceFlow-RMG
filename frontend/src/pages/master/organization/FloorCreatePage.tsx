import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Save, ArrowLeft, Sparkles, RefreshCw } from 'lucide-react';
import { organizationService } from '../../../services/organizationService';
import { Button } from '../../../components/common/Button';
import { PageHeader } from '../../../components/common/PageHeader';
import { UI_TOKENS } from '../../../config/designTokens';

export const FloorCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState<{ id: string; name: string; code: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const [formData, setFormData] = useState({
    building_id: '',
    name: '',
    floor_number: '1st Floor',
    code: '',
    sort_order: 1,
    area_sqft: '',
    is_active: true,
  });

  const fetchNextCode = async (bldgId?: string) => {
    setIsGeneratingCode(true);
    try {
      const code = await organizationService.getNextFloorCode(bldgId || formData.building_id || undefined);
      setFormData((prev) => ({ ...prev, code }));
    } catch {
      setFormData((prev) => ({ ...prev, code: 'FL-01' }));
    } finally {
      setIsGeneratingCode(false);
    }
  };

  useEffect(() => {
    organizationService.getActiveBuildings().then((data) => {
      setBuildings(data);
      if (data.length > 0) {
        const firstBldgId = data[0].id;
        setFormData((prev) => ({ ...prev, building_id: firstBldgId }));
        fetchNextCode(firstBldgId);
      }
    }).catch(console.error);
  }, []);

  const handleBuildingChange = (bldgId: string) => {
    setFormData((prev) => ({ ...prev, building_id: bldgId }));
    fetchNextCode(bldgId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      await organizationService.createFloor({
        ...formData,
        area_sqft: formData.area_sqft ? parseInt(formData.area_sqft as string) : undefined,
      });
      navigate('/master-data/floors');
    } catch (err: any) {
      if (err.response?.status === 422 && err.response.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        alert(err.response?.data?.message || 'Failed to create floor');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Add Building Floor"
        actions={
          <>
            <Button
              variant="secondary"
              icon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => navigate('/master-data/floors')}
            >
              Back to Floors
            </Button>
            <Button
              variant="primary"
              icon={<Save className="w-4 h-4" />}
              isLoading={isSubmitting}
              type="submit"
              form="floor-form"
            >
              Save Floor
            </Button>
          </>
        }
      />

      <form id="floor-form" onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-8 space-y-5">
            <div className={UI_TOKENS.card.base}>
              <div className={UI_TOKENS.card.header}>
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Floor Architecture & Hierarchy
                  </span>
                </div>
              </div>

              <div className={`${UI_TOKENS.card.body} space-y-4`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Building */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Facility Building <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.building_id}
                      onChange={(e) => handleBuildingChange(e.target.value)}
                      className={UI_TOKENS.input.select}
                    >
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

                  {/* Auto-Generated Floor Tracking Code */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Floor Code <span className="text-rose-500">*</span>
                      </label>
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                          <Sparkles className="w-2.5 h-2.5" /> Auto-Generated
                        </span>
                        <button
                          type="button"
                          onClick={() => fetchNextCode()}
                          title="Regenerate Next Floor Code"
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
                      className={`${UI_TOKENS.input.base} font-mono font-semibold bg-slate-50 dark:bg-slate-800/60 ${errors.code ? 'border-rose-500 bg-rose-50/20' : ''}`}
                      placeholder="Auto-generating (e.g. FL-01)..."
                    />
                    {errors.code && (
                      <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                        {errors.code[0]}
                      </p>
                    )}
                  </div>

                  {/* Floor Level Label */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Floor Level / Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.floor_number}
                      onChange={(e) => setFormData({ ...formData, floor_number: e.target.value })}
                      className={`${UI_TOKENS.input.base} ${errors.floor_number ? 'border-rose-500 bg-rose-50/20' : ''}`}
                      placeholder="e.g. Ground Floor, 1st Floor, 2nd Floor"
                    />
                    {errors.floor_number && (
                      <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                        {errors.floor_number[0]}
                      </p>
                    )}
                  </div>

                  {/* Strict Serial Sort Order */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Serial / Vertical Sort Order <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.sort_order}
                      onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                      className={`${UI_TOKENS.input.base} font-mono ${errors.sort_order ? 'border-rose-500 bg-rose-50/20' : ''}`}
                      placeholder="e.g. 1 (Ground), 2 (1st), 3 (2nd)..."
                    />
                    <p className="mt-1 text-[11px] text-slate-400">
                      Maintains sequential order (1, 2, 3...) when displaying floors in dropdowns & views.
                    </p>
                    {errors.sort_order && (
                      <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                        {errors.sort_order[0]}
                      </p>
                    )}
                  </div>

                  {/* Floor Display Name */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Floor Designation / Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`${UI_TOKENS.input.base} ${errors.name ? 'border-rose-500 bg-rose-50/20' : ''}`}
                      placeholder="e.g. 2nd Floor - Main Sewing & Assembly Section"
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                        {errors.name[0]}
                      </p>
                    )}
                  </div>

                  {/* Floor Area */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Floor Area (Sq. Ft.)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.area_sqft}
                      onChange={(e) => setFormData({ ...formData, area_sqft: e.target.value })}
                      className={UI_TOKENS.input.base}
                      placeholder="e.g. 12500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-5">
            <div className={UI_TOKENS.card.base}>
              <div className={UI_TOKENS.card.header}>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Status & Activation
                </span>
              </div>
              <div className={UI_TOKENS.card.body}>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300"
                  />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Active Floor Section
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
