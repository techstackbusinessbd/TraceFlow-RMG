import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Building2, MapPin, Layers, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';
import { organizationService } from '../../../services/organizationService';
import type { FactoryUnit, Company } from '../../../types/organization';
import { alertService } from '../../../services/alertService';
import { Button } from '../../../components/common/Button';
import { PageHeader } from '../../../components/common/PageHeader';
import { Badge } from '../../../components/common/Badge';
import { UI_TOKENS } from '../../../config/designTokens';

export const FactoryUnitEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [unit, setUnit] = useState<FactoryUnit | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const [formData, setFormData] = useState<{
    company_id: string;
    name: string;
    code: string;
    premises_type: FactoryUnit['premises_type'];
    city: string;
    address: string;
    total_floors: number;
    compliance_grade: string;
    is_active: boolean;
  }>({
    company_id: '',
    name: '',
    code: '',
    premises_type: 'Woven',
    city: '',
    address: '',
    total_floors: 1,
    compliance_grade: 'A',
    is_active: true,
  });

  useEffect(() => {
    organizationService.getActiveCompanies().then((data) => {
      setCompanies(data as any);
    }).catch(console.error);

    if (id) {
      fetchUnit(id);
    }
  }, [id]);

  const fetchUnit = async (unitId: string) => {
    setIsLoading(true);
    try {
      const data = await organizationService.getFactoryUnit(unitId);
      setUnit(data);
      setFormData({
        company_id: data.company_id || '',
        name: data.name || '',
        code: data.code || '',
        premises_type: data.premises_type || 'Woven',
        city: data.city || '',
        address: data.address || '',
        total_floors: data.total_floors || 1,
        compliance_grade: data.compliance_grade || 'A',
        is_active: data.is_active,
      });
    } catch (err) {
      console.error('Failed to load factory plant details', err);
      alertService.error('Entity Not Found', 'Could not locate factory plant profile.');
      navigate('/master-data/units');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setIsSaving(true);
    setErrors({});

    try {
      await organizationService.updateFactoryUnit(id, formData);
      alertService.success('Plant Updated', `Factory unit "${formData.name}" saved successfully.`);
      navigate('/master-data/units');
    } catch (err: any) {
      if (err.response?.status === 422 && err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        alertService.error('Update Failed', err.response?.data?.message || 'Failed to update factory plant.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Loading factory plant profile...</p>
      </div>
    );
  }

  const selectedCompany = companies.find((c) => c.id === formData.company_id) || unit?.company;

  return (
    <div className="space-y-5">
      {/* Mandatory Golden Standard Page Header */}
      <PageHeader
        title={`Edit Factory Plant: ${unit?.name || ''}`}
        badge={<Badge variant="neutral">{formData.code || 'Unit'}</Badge>}
        actions={
          <>
            <Button
              type="button"
              variant="secondary"
              icon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => navigate('/master-data/units')}
            >
              Factory Plants
            </Button>
            <Button
              type="button"
              variant="primary"
              icon={<Save className="w-4 h-4" />}
              isLoading={isSaving}
              onClick={handleSubmit}
            >
              Save Changes
            </Button>
          </>
        }
      />

      {/* Pure Server-Side Form with 2-Column Standard Enterprise Layout */}
      <form id="unit-edit-form" onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Main Form Sections (8 Cols) */}
          <div className="lg:col-span-8 space-y-5">
            {/* Card 1: Plant Specifications */}
            <div className={UI_TOKENS.card.base}>
              <div className={UI_TOKENS.card.header}>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Plant Identity & Specifications
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">Physical Infrastructure & Scope</span>
              </div>

              <div className={`${UI_TOKENS.card.body} space-y-4`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Parent Sister Company */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Parent Sister Company <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.company_id}
                      onChange={(e) => setFormData({ ...formData, company_id: e.target.value })}
                      className={UI_TOKENS.input.select}
                    >
                      {companies.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.code})
                        </option>
                      ))}
                    </select>
                    {errors.company_id && (
                      <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                        {errors.company_id[0]}
                      </p>
                    )}
                  </div>

                  {/* Factory Unit Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Factory Unit Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`${UI_TOKENS.input.base} ${errors.name ? 'border-rose-500 bg-rose-50/20' : ''}`}
                      placeholder="e.g. Unit-01 Sewing Plant"
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                        {errors.name[0]}
                      </p>
                    )}
                  </div>

                  {/* Unit Code */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Unit Code <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      className={`${UI_TOKENS.input.base} font-mono ${errors.code ? 'border-rose-500 bg-rose-50/20' : ''}`}
                      placeholder="e.g. U-01"
                    />
                    {errors.code && (
                      <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                        {errors.code[0]}
                      </p>
                    )}
                  </div>

                  {/* Premises Type */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Premises Type <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.premises_type}
                      onChange={(e) => setFormData({ ...formData, premises_type: e.target.value as any })}
                      className={UI_TOKENS.input.select}
                    >
                      <option value="Woven">Woven Garments</option>
                      <option value="Knit">Knitwear</option>
                      <option value="Denim">Denim / Heavy Fabric</option>
                      <option value="Washing">Industrial Laundry / Wash</option>
                      <option value="Printing">Printing Plant (Screen/Rotary/Digital)</option>
                      <option value="Embroidery">Computerized Embroidery Plant</option>
                      <option value="Composite">Composite Full-Vertical</option>
                      <option value="Central Warehouse">Central Raw Material Warehouse</option>
                    </select>
                    {errors.premises_type && (
                      <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                        {errors.premises_type[0]}
                      </p>
                    )}
                  </div>

                  {/* City / Industrial Zone */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      City / Industrial Zone <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className={`${UI_TOKENS.input.base} ${errors.city ? 'border-rose-500 bg-rose-50/20' : ''}`}
                      placeholder="e.g. Gazipur, Konabari"
                    />
                    {errors.city && (
                      <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                        {errors.city[0]}
                      </p>
                    )}
                  </div>

                  {/* Building Floor Count */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Building Floor Count <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.total_floors}
                      onChange={(e) => setFormData({ ...formData, total_floors: parseInt(e.target.value) || 1 })}
                      className={UI_TOKENS.input.base}
                    />
                    {errors.total_floors && (
                      <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                        {errors.total_floors[0]}
                      </p>
                    )}
                  </div>

                  {/* Compliance Rating / Accord Grade */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Compliance Rating / Accord Grade
                    </label>
                    <select
                      value={formData.compliance_grade}
                      onChange={(e) => setFormData({ ...formData, compliance_grade: e.target.value })}
                      className={UI_TOKENS.input.select}
                    >
                      <option value="A">Grade A (Green/Platinum Certified)</option>
                      <option value="B">Grade B (Remediated / Fully Approved)</option>
                      <option value="C">Grade C (Conditional Audit Pass)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Physical Location & Address */}
            <div className={UI_TOKENS.card.base}>
              <div className={UI_TOKENS.card.header}>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Location & Postal Details
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">Geographical Site Address</span>
              </div>

              <div className={UI_TOKENS.card.body}>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Physical Location & Road Address
                </label>
                <textarea
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street, Plot, Sector, Post Code..."
                  className={UI_TOKENS.input.base}
                />
              </div>
            </div>
          </div>

          {/* Context Sidebar (4 Cols) */}
          <div className="lg:col-span-4 space-y-5 sticky top-4">
            {/* Live Plant Profile Card */}
            <div className={UI_TOKENS.card.base}>
              <div className="p-5 flex flex-col items-center text-center border-b border-slate-100 dark:border-slate-800">
                <div className="w-16 h-16 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-lg mb-3 shadow-2xs">
                  <Building2 className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {formData.name || 'Factory Unit'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  Code: {formData.code || 'U-00'}
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5 justify-center">
                  <Badge variant="neutral">
                    {formData.premises_type}
                  </Badge>
                  {formData.is_active ? (
                    <Badge variant="success" icon={<CheckCircle2 className="w-3 h-3" />}>
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="danger" icon={<XCircle className="w-3 h-3" />}>
                      Inactive
                    </Badge>
                  )}
                </div>
              </div>

              {/* Status Toggle Card */}
              <div className="p-4 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    id="is_active_toggle"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                      Active Operating Plant
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      Enables line allocation and traceability scans
                    </span>
                  </div>
                </label>
              </div>

              {/* Operational Metadata */}
              <div className="p-4 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" /> Company
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-right truncate max-w-[160px]">
                    {selectedCompany?.name || 'Unassigned'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" /> Total Floors
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {formData.total_floors} Floor(s)
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> Compliance
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Grade {formData.compliance_grade || 'A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

