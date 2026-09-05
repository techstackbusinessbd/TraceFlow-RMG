import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Save, ArrowLeft, Sparkles, RefreshCw } from 'lucide-react';
import { organizationService } from '../../../services/organizationService';
import { Button } from '../../../components/common/Button';
import { PageHeader } from '../../../components/common/PageHeader';
import { UI_TOKENS } from '../../../config/designTokens';

export const BuildingCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [units, setUnits] = useState<{ id: string; name: string; code: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const [formData, setFormData] = useState({
    factory_unit_id: '',
    name: '',
    code: '',
    total_floors: 3,
    description: '',
    is_active: true,
  });

  const fetchNextCode = async (unitId?: string) => {
    setIsGeneratingCode(true);
    try {
      const code = await organizationService.getNextBuildingCode(unitId || formData.factory_unit_id || undefined);
      setFormData((prev) => ({ ...prev, code }));
    } catch {
      setFormData((prev) => ({ ...prev, code: 'BLD-01' }));
    } finally {
      setIsGeneratingCode(false);
    }
  };

  useEffect(() => {
    organizationService.getActiveUnits().then((data) => {
      setUnits(data);
      if (data.length > 0) {
        const firstUnitId = data[0].id;
        setFormData((prev) => ({ ...prev, factory_unit_id: firstUnitId }));
        fetchNextCode(firstUnitId);
      }
    }).catch(console.error);
  }, []);

  const handleUnitChange = (unitId: string) => {
    setFormData((prev) => ({ ...prev, factory_unit_id: unitId }));
    fetchNextCode(unitId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      await organizationService.createBuilding(formData);
      navigate('/master-data/buildings');
    } catch (err: any) {
      if (err.response?.status === 422 && err.response.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        alert(err.response?.data?.message || 'Failed to create building');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Add Facility Building"
        actions={
          <>
            <Button
              variant="secondary"
              icon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => navigate('/master-data/buildings')}
            >
              Back to Buildings
            </Button>
            <Button
              variant="primary"
              icon={<Save className="w-4 h-4" />}
              isLoading={isSubmitting}
              type="submit"
              form="building-form"
            >
              Save Building
            </Button>
          </>
        }
      />

      <form id="building-form" onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-8 space-y-5">
            <div className={UI_TOKENS.card.base}>
              <div className={UI_TOKENS.card.header}>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Building Specifications
                  </span>
                </div>
              </div>

              <div className={`${UI_TOKENS.card.body} space-y-4`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Factory Unit */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Parent Factory Unit <span className="text-rose-500">*</span>
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

                  {/* Auto-Generated Building Tracking Code */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Building Code <span className="text-rose-500">*</span>
                      </label>
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                          <Sparkles className="w-2.5 h-2.5" /> Auto-Generated
                        </span>
                        <button
                          type="button"
                          onClick={() => fetchNextCode()}
                          title="Regenerate Next Building Code"
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
                      placeholder="Auto-generating (e.g. BLD-01)..."
                    />
                    {errors.code && (
                      <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                        {errors.code[0]}
                      </p>
                    )}
                  </div>

                  {/* Building Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Building Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`${UI_TOKENS.input.base} ${errors.name ? 'border-rose-500 bg-rose-50/20' : ''}`}
                      placeholder="e.g. Main Production Building"
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                        {errors.name[0]}
                      </p>
                    )}
                  </div>

                  {/* Total Floors */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Total Floor Count <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={formData.total_floors}
                      onChange={(e) => setFormData({ ...formData, total_floors: parseInt(e.target.value) || 1 })}
                      className={`${UI_TOKENS.input.base} ${errors.total_floors ? 'border-rose-500 bg-rose-50/20' : ''}`}
                    />
                    {errors.total_floors && (
                      <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                        {errors.total_floors[0]}
                      </p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Description / Purpose
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={UI_TOKENS.input.base}
                    placeholder="e.g. Multi-tier sewing plant, washing bay on ground floor..."
                  />
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
                    Active Facility Building
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
