import React, { useEffect, useState } from 'react';
import { Save, Globe, Mail, Phone, MapPin } from 'lucide-react';
import { organizationService } from '../../../services/organizationService';
import type { Organization } from '../../../types/organization';
import { alertService } from '../../../services/alertService';
import { Button } from '../../../components/common/Button';
import { PageHeader } from '../../../components/common/PageHeader';
import { Badge } from '../../../components/common/Badge';
import { UI_TOKENS } from '../../../config/designTokens';

export const OrganizationOverviewPage: React.FC = () => {
  const [, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    registration_no: '',
    country: 'Bangladesh',
    address: '',
    contact_email: '',
    contact_phone: '',
    website: '',
  });

  useEffect(() => {
    fetchOrganization();
  }, []);

  const fetchOrganization = async () => {
    setIsLoading(true);
    try {
      const data = await organizationService.getOrganization();
      setOrganization(data);
      setFormData({
        name: data.name || '',
        code: data.code || '',
        registration_no: data.registration_no || '',
        country: data.country || 'Bangladesh',
        address: data.address || '',
        contact_email: data.contact_email || '',
        contact_phone: data.contact_phone || '',
        website: data.website || '',
      });
    } catch (err: any) {
      console.error('Failed to load organization profile', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrors({});

    try {
      const updated = await organizationService.updateOrganization(formData);
      setOrganization(updated);
      alertService.success('Organization Updated', 'Profile details saved successfully.');
    } catch (err: any) {
      if (err.response?.status === 422 && err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        alertService.error('Update Failed', err.response?.data?.message || 'Failed to update organization profile.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent animate-spin rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mandatory Golden Standard Page Header */}
      <PageHeader
        title="Group Organization Profile"
        badge={<Badge variant="neutral">Parent Entity</Badge>}
        actions={
          <Button
            type="button"
            variant="primary"
            isLoading={isSaving}
            icon={<Save className="w-4 h-4" />}
            onClick={handleSubmit}
          >
            Save Changes
          </Button>
        }
      />

      {/* Pure Server-Side Validated Form */}
      <form id="org-profile-form" onSubmit={handleSubmit} noValidate className="space-y-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md p-6 shadow-2xs space-y-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 pb-2">
            Corporate Identity
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Group / Holding Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={UI_TOKENS.input.base}
                placeholder="e.g. Apex Apparel Global Group"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                  {errors.name[0]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Enterprise Code *
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className={UI_TOKENS.input.base}
                placeholder="e.g. APEX-GRP"
              />
              {errors.code && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                  {errors.code[0]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Incorporation / Registration No
              </label>
              <input
                type="text"
                value={formData.registration_no}
                onChange={(e) => setFormData({ ...formData, registration_no: e.target.value })}
                className={UI_TOKENS.input.base}
                placeholder="e.g. C-78901/2012"
              />
              {errors.registration_no && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                  {errors.registration_no[0]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Country *
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className={UI_TOKENS.input.base}
                placeholder="e.g. Bangladesh"
              />
              {errors.country && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                  {errors.country[0]}
                </p>
              )}
            </div>
          </div>

          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 pb-2 pt-4">
            Contact & Headquarters
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Corporate Email
              </label>
              <input
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                className={UI_TOKENS.input.base}
                placeholder="corporate@example.com"
              />
              {errors.contact_email && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                  {errors.contact_email[0]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> Contact Phone
              </label>
              <input
                type="text"
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                className={UI_TOKENS.input.base}
                placeholder="+880-2-8901234"
              />
              {errors.contact_phone && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                  {errors.contact_phone[0]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" /> Official Website
              </label>
              <input
                type="text"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className={UI_TOKENS.input.base}
                placeholder="https://example.com"
              />
              {errors.website && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                  {errors.website[0]}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Registered Headquarters Address
            </label>
            <textarea
              rows={3}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className={UI_TOKENS.input.base}
              placeholder="Plot, Road, Sector, City, Postal Code"
            />
            {errors.address && (
              <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                {errors.address[0]}
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
