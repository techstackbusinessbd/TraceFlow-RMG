import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Building, Mail, MapPin, CheckCircle2, XCircle, DollarSign } from 'lucide-react';
import { organizationService } from '../../../services/organizationService';
import type { Company } from '../../../types/organization';
import { alertService } from '../../../services/alertService';
import { Button } from '../../../components/common/Button';
import { PageHeader } from '../../../components/common/PageHeader';
import { Badge } from '../../../components/common/Badge';
import { UI_TOKENS } from '../../../config/designTokens';

export const CompanyEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    bin_number: '',
    tin_number: '',
    trade_license: '',
    currency: 'USD',
    contact_email: '',
    contact_phone: '',
    registered_address: '',
    is_active: true,
  });

  useEffect(() => {
    if (id) {
      fetchCompany(id);
    }
  }, [id]);

  const fetchCompany = async (companyId: string) => {
    setIsLoading(true);
    try {
      const data = await organizationService.getCompany(companyId);
      setCompany(data);
      setFormData({
        name: data.name || '',
        code: data.code || '',
        bin_number: data.bin_number || '',
        tin_number: data.tin_number || '',
        trade_license: data.trade_license || '',
        currency: data.currency || 'USD',
        contact_email: data.contact_email || '',
        contact_phone: data.contact_phone || '',
        registered_address: data.registered_address || '',
        is_active: data.is_active,
      });
    } catch (err) {
      console.error('Failed to load company details', err);
      alertService.error('Entity Not Found', 'Could not locate company profile.');
      navigate('/master-data/companies');
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
      await organizationService.updateCompany(id, formData);
      alertService.success('Company Updated', `Sister company "${formData.name}" saved successfully.`);
      navigate('/master-data/companies');
    } catch (err: any) {
      if (err.response?.status === 422 && err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        alertService.error('Update Failed', err.response?.data?.message || 'Failed to update company.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Loading sister company details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Mandatory Golden Standard Page Header */}
      <PageHeader
        title={`Edit Sister Company: ${company?.name || ''}`}
        badge={<Badge variant="neutral">{formData.code || 'Entity'}</Badge>}
        actions={
          <>
            <Button
              type="button"
              variant="secondary"
              icon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => navigate('/master-data/companies')}
            >
              Sister Companies
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
      <form id="company-edit-form" onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Main Form Sections (8 Cols) */}
          <div className="lg:col-span-8 space-y-5">
            {/* Card 1: Legal & Fiscal Identity */}
            <div className={UI_TOKENS.card.base}>
              <div className={UI_TOKENS.card.header}>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Company Identity & Fiscal Registry
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">Corporate Structure & Regulatory ID</span>
              </div>

              <div className={`${UI_TOKENS.card.body} space-y-4`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Company Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Company Legal Name <span className="text-rose-500">*</span>
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

                  {/* Company Code */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Company Code <span className="text-rose-500">*</span>
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

                  {/* BIN */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      NBR Business Identification No (BIN)
                    </label>
                    <input
                      type="text"
                      value={formData.bin_number}
                      onChange={(e) => setFormData({ ...formData, bin_number: e.target.value })}
                      className={UI_TOKENS.input.base}
                      placeholder="e.g. 000123456-0101"
                    />
                    {errors.bin_number && (
                      <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                        {errors.bin_number[0]}
                      </p>
                    )}
                  </div>

                  {/* TIN */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Tax Identification No (TIN)
                    </label>
                    <input
                      type="text"
                      value={formData.tin_number}
                      onChange={(e) => setFormData({ ...formData, tin_number: e.target.value })}
                      className={UI_TOKENS.input.base}
                      placeholder="e.g. 567890123412"
                    />
                    {errors.tin_number && (
                      <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                        {errors.tin_number[0]}
                      </p>
                    )}
                  </div>

                  {/* Trade License */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Trade License Number
                    </label>
                    <input
                      type="text"
                      value={formData.trade_license}
                      onChange={(e) => setFormData({ ...formData, trade_license: e.target.value })}
                      className={UI_TOKENS.input.base}
                      placeholder="e.g. TRAD/DNCC/012345"
                    />
                  </div>

                  {/* Currency */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Operating Currency <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className={UI_TOKENS.input.select}
                    >
                      <option value="USD">USD ($) - US Dollar</option>
                      <option value="BDT">BDT (৳) - Bangladeshi Taka</option>
                      <option value="EUR">EUR (€) - Euro</option>
                      <option value="GBP">GBP (£) - British Pound</option>
                    </select>
                    {errors.currency && (
                      <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                        {errors.currency[0]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Contact & Registered Address */}
            <div className={UI_TOKENS.card.base}>
              <div className={UI_TOKENS.card.header}>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Communication & Domicile
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">Official Contact & Address</span>
              </div>

              <div className={`${UI_TOKENS.card.body} space-y-4`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Official Email
                    </label>
                    <input
                      type="email"
                      value={formData.contact_email}
                      onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                      className={UI_TOKENS.input.base}
                      placeholder="compliance@company.com"
                    />
                    {errors.contact_email && (
                      <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                        {errors.contact_email[0]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Contact Phone
                    </label>
                    <input
                      type="text"
                      value={formData.contact_phone}
                      onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                      className={UI_TOKENS.input.base}
                      placeholder="+88028881234"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Registered Legal Address
                  </label>
                  <textarea
                    rows={3}
                    value={formData.registered_address}
                    onChange={(e) => setFormData({ ...formData, registered_address: e.target.value })}
                    className={UI_TOKENS.input.base}
                    placeholder="Headquarters corporate address..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Context Sidebar (4 Cols) */}
          <div className="lg:col-span-4 space-y-5 sticky top-4">
            {/* Live Entity Profile Card */}
            <div className={UI_TOKENS.card.base}>
              <div className="p-5 flex flex-col items-center text-center border-b border-slate-100 dark:border-slate-800">
                <div className="w-16 h-16 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-lg mb-3 shadow-2xs">
                  <Building className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {formData.name || 'Sister Company'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  Code: {formData.code || 'CO-00'}
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5 justify-center">
                  <Badge variant="neutral">
                    {formData.currency}
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
                    id="company_active_toggle"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                      Active Operating Entity
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      Enables plant grouping and export billing
                    </span>
                  </div>
                </label>
              </div>

              {/* Operational Metadata */}
              <div className="p-4 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5" /> Currency
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {formData.currency}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> BIN No
                  </span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">
                    {formData.bin_number || 'Not Registered'}
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

