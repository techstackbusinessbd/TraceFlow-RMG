import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Building2, Save, ArrowLeft } from 'lucide-react';
import { organizationService } from '../../../services/organizationService';
import { Button } from '../../../components/common/Button';
import { PageHeader } from '../../../components/common/PageHeader';
import { UI_TOKENS } from '../../../config/designTokens';

export const BuildingEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [units, setUnits] = useState<{ id: string; name: string; code: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const [formData, setFormData] = useState({
    factory_unit_id: '',
    name: '',
    code: '',
    total_floors: 1,
    description: '',
    is_active: true,
  });

  useEffect(() => {
    if (!id) return;
    Promise.all([
      organizationService.getActiveUnits(),
      organizationService.getBuilding(id),
    ])
      .then(([unitsData, buildingData]) => {
        setUnits(unitsData);
        setFormData({
          factory_unit_id: buildingData.factory_unit_id,
          name: buildingData.name,
          code: buildingData.code,
          total_floors: buildingData.total_floors,
          description: buildingData.description || '',
          is_active: buildingData.is_active,
        });
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setIsSubmitting(true);
    setErrors({});

    try {
      await organizationService.updateBuilding(id, formData);
      navigate('/master-data/buildings');
    } catch (err: any) {
      if (err.response?.status === 422 && err.response.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        alert(err.response?.data?.message || 'Failed to update building');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading building data...</div>;
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title={`Edit Building: ${formData.name}`}
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
              form="building-edit-form"
            >
              Save Changes
            </Button>
          </>
        }
      />

      <form id="building-edit-form" onSubmit={handleSubmit} noValidate>
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
                      onChange={(e) => setFormData({ ...formData, factory_unit_id: e.target.value })}
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

                  {/* Building Tracking Code */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Building Code <span className="text-rose-500">*</span>
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
