import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { organizationService } from '../../../services/organizationService';
import type { Organization } from '../../../types/organization';
import { alertService } from '../../../services/alertService';
import { Button } from '../../../components/common/Button';
import { PageHeader } from '../../../components/common/PageHeader';
import { Badge } from '../../../components/common/Badge';
import { UI_TOKENS } from '../../../config/designTokens';

export const CompanyCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [organization, setOrganization] = useState<Organization | null>(null);
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
    organizationService.getOrganization().then(setOrganization).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organization) return;

    setIsSaving(true);
    setErrors({});

    try {
      await organizationService.createCompany({
        ...formData,
        organization_id: organization.id,
      });
      alertService.success('Company Created', `Sister company "${formData.name}" established successfully.`);
      navigate('/master-data/companies');
    } catch (err: any) {
      if (err.response?.status === 422 && err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        alertService.error('Creation Failed', err.response?.data?.message || 'Failed to create sister company.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Mandatory Golden Standard Page Header */}
      <PageHeader
        title="Create Sister Company"
        badge={<Badge variant="neutral">{organization?.code || 'Group'}</Badge>}
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => navigate('/master-data/companies')}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>
            <Button
              type="button"
              variant="primary"
              isLoading={isSaving}
              icon={<Save className="w-4 h-4" />}
              onClick={handleSubmit}
            >
              Create Company
            </Button>
          </>
        }
      />

      {/* Pure Server-Side Form */}
      <form id="company-create-form" onSubmit={handleSubmit} noValidate className="space-y-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md p-6 shadow-2xs space-y-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 pb-2">
            Company Identity
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Company Legal Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={UI_TOKENS.input.base}
                placeholder="e.g. Apex Woven Apparels Ltd."
              />
              {errors.name && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                  {errors.name[0]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Company Code *
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className={UI_TOKENS.input.base}
                placeholder="e.g. AWA-01"
              />
              {errors.code && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                  {errors.code[0]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                NBR Business Identification No (BIN)
              </label>
              <input
                type="text"
                value={formData.bin_number}
                onChange={(e) => setFormData({ ...formData, bin_number: e.target.value })}
                className={UI_TOKENS.input.base}
                placeholder="e.g. 000123456-0101 (Mushak-6.3)"
              />
              {errors.bin_number && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                  {errors.bin_number[0]}
                </p>
              )}
            </div>

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

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Operating Currency *
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className={UI_TOKENS.input.base}
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

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Status
              </label>
              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300"
                  />
                  Active Operating Entity
                </label>
              </div>
            </div>
          </div>

          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 pb-2 pt-4">
            Contact & Address
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Official Email
              </label>
              <input
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                className={UI_TOKENS.input.base}
                placeholder="info@sistercompany.com"
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
                placeholder="+880-1700-000000"
              />
              {errors.contact_phone && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                  {errors.contact_phone[0]}
                </p>
              )}
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
              placeholder="Registered factory or office address"
            />
          </div>
        </div>
      </form>
    </div>
  );
};
