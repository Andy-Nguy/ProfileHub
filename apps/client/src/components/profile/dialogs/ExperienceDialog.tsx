import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseDialog } from './BaseDialog';
import { FloatingField, FloatingTextarea } from '../../shared/FloatingField';
import { Button } from '../../shared/Button';
import { toast } from 'sonner';
import { profileAPI } from '../../../services/profile.service';
import { getErrorMessage } from '../../../services/api.service';
import { EmploymentType, IExperience } from '@profilehub/types';
import { companiesAPI } from '../../../services/companies.service';
import { OrganizationField, AutocompleteEntity } from '../OrganizationField';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  experienceId?: string | null;
  initialData?: IExperience;
  onSuccess: () => void;
}

function toDateInputValue(value: string | Date | null | undefined) {
  if (!value) return '';
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return value.split('T')[0];
}

export const ExperienceDialog: React.FC<Props> = ({ isOpen, onClose, experienceId, initialData, onSuccess }) => {
  const { t } = useTranslation(['profile', 'common']);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    companyId: null as string | null,
    location: '',
    employmentType: EmploymentType.FULL_TIME,
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: '',
  });
  const [loading, setLoading] = useState(false);

  // Company selection & creation states
  const [selectedCompanyDetails, setSelectedCompanyDetails] = useState<AutocompleteEntity | null>(null);
  const [isCreatingNewCompany, setIsCreatingNewCompany] = useState(false);
  const [newCompanyDomain, setNewCompanyDomain] = useState('');
  const [newCompanyLogo, setNewCompanyLogo] = useState<File | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          title: initialData.title || '',
          company: initialData.company || '',
          companyId: initialData.companyId || null,
          location: initialData.location || '',
          employmentType: initialData.employmentType || EmploymentType.FULL_TIME,
          startDate: toDateInputValue(initialData.startDate),
          endDate: toDateInputValue(initialData.endDate),
          isCurrent: initialData.isCurrent || false,
          description: initialData.description || '',
        });
        setSelectedCompanyDetails(
          initialData.companyDetails
            ? {
                id: initialData.companyDetails.id,
                name: initialData.companyDetails.name,
                subtitle: initialData.companyDetails.domain,
                logoUrl: initialData.companyDetails.logoUrl,
              }
            : null,
        );
      } else {
        setFormData({
          title: '', company: '', companyId: null, location: '', employmentType: EmploymentType.FULL_TIME,
          startDate: '', endDate: '', isCurrent: false, description: '',
        });
        setSelectedCompanyDetails(null);
        setIsCreatingNewCompany(false);
        setNewCompanyDomain('');
        setNewCompanyLogo(null);
      }
    }
  }, [isOpen, initialData]);

  const handleSearchCompanies = useCallback(async (query: string): Promise<AutocompleteEntity[]> => {
    const results = await companiesAPI.searchCompanies(query);
    return results.map((comp) => ({
      id: comp.id,
      name: comp.name,
      subtitle: comp.domain,
      logoUrl: comp.logoUrl,
    }));
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      let finalCompanyId = formData.companyId;

      if (isCreatingNewCompany && formData.company.trim() && !finalCompanyId) {
        const created = await companiesAPI.createCompany({
          name: formData.company.trim(),
          domain: newCompanyDomain.trim() || undefined,
          file: newCompanyLogo || undefined,
        });
        finalCompanyId = created.id;
      }

      const payload = {
        ...formData,
        company: formData.company.trim(),
        companyId: finalCompanyId,
        startDate: new Date(formData.startDate),
        endDate: !formData.isCurrent && formData.endDate ? new Date(formData.endDate) : null,
      };

      if (experienceId) {
        await profileAPI.updateExperience(experienceId, payload);
      } else {
        await profileAPI.addExperience(payload);
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!experienceId) return;
    if (!window.confirm(t('dialogs.experience.confirmDelete'))) return;

    setLoading(true);
    try {
      await profileAPI.deleteExperience(experienceId);
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseDialog isOpen={isOpen} onClose={onClose} title={experienceId ? t('dialogs.experience.editTitle') : t('dialogs.experience.addTitle')}>
      <div className="space-y-4">
        <FloatingField id="title" label={t('dialogs.experience.jobTitle')} value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
        
        {/* Company Autocomplete & Logo Upload Field */}
        <OrganizationField
          id="company"
          label={t('dialogs.experience.companyName')}
          entityTypeLabel={t('dialogs.experience.entityCompany')}
          value={formData.company}
          selectedEntity={selectedCompanyDetails}
          onSelectEntity={(entity) => {
            setSelectedCompanyDetails(entity);
            setFormData(prev => ({ ...prev, company: entity.name, companyId: entity.id || null }));
            setIsCreatingNewCompany(false);
          }}
          onChangeText={(val) => {
            setFormData(prev => ({ ...prev, company: val, companyId: null }));
            setSelectedCompanyDetails(null);
            if (!val) {
              setIsCreatingNewCompany(false);
            }
          }}
          onSearch={handleSearchCompanies}
          isCreatingNew={isCreatingNewCompany}
          onToggleCreatingNew={setIsCreatingNewCompany}
          newLogoFile={newCompanyLogo}
          onChangeNewLogoFile={setNewCompanyLogo}
          extraNewFields={
            <FloatingField
              id="newCompanyDomain"
              label={t('dialogs.experience.companyDomain')}
              value={newCompanyDomain}
              onChange={e => setNewCompanyDomain(e.target.value)}
            />
          }
        />

        <FloatingField id="location" label={t('dialogs.experience.location')} value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />

        <div className="flex gap-4 items-center">
          <label className="text-sm font-medium text-on-surface-variant w-1/3">{t('dialogs.experience.employmentType')}</label>
          <select
            value={formData.employmentType}
            onChange={e => setFormData({ ...formData, employmentType: e.target.value as EmploymentType })}
            className="flex-1 bg-transparent border border-outline rounded-lg p-3 text-on-surface focus:border-primary outline-none"
          >
            <option value={EmploymentType.FULL_TIME}>{t('dialogs.experience.employmentTypes.fullTime')}</option>
            <option value={EmploymentType.PART_TIME}>{t('dialogs.experience.employmentTypes.partTime')}</option>
            <option value={EmploymentType.CONTRACT}>{t('dialogs.experience.employmentTypes.contract')}</option>
            <option value={EmploymentType.INTERNSHIP}>{t('dialogs.experience.employmentTypes.internship')}</option>
            <option value={EmploymentType.FREELANCE}>{t('dialogs.experience.employmentTypes.freelance')}</option>
            <option value={EmploymentType.VOLUNTEER}>{t('dialogs.experience.employmentTypes.volunteer')}</option>
          </select>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium text-on-surface-variant block mb-1">{t('dialogs.experience.startDate')}</label>
            <input type="date" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} className="w-full bg-transparent border border-outline rounded-lg p-3 text-on-surface focus:border-primary outline-none" />
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium text-on-surface-variant block mb-1">{t('dialogs.experience.endDate')}</label>
            <input type="date" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} disabled={formData.isCurrent} className="w-full bg-transparent border border-outline rounded-lg p-3 text-on-surface focus:border-primary outline-none disabled:opacity-50" />
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer pt-2">
          <input type="checkbox" checked={formData.isCurrent} onChange={e => setFormData({ ...formData, isCurrent: e.target.checked })} className="w-5 h-5 rounded border-outline text-primary focus:ring-primary" />
          <span className="text-on-surface text-sm">{t('dialogs.experience.currentRole')}</span>
        </label>

        <FloatingTextarea id="description" label={t('dialogs.experience.description')} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={4} />

        <div className="flex justify-between pt-4 border-t border-outline-variant mt-4">
          {experienceId ? (
            <Button className="text-error border border-error hover:bg-error/10 font-label-lg text-label-lg py-2.5 px-6 rounded-full transition-colors" onClick={handleDelete} isLoading={loading}>{t('common:delete')}</Button>
          ) : <div></div>}
          <div className="flex gap-3">
            <Button className="border border-outline-variant text-primary font-label-lg text-label-lg py-2.5 px-6 rounded-full hover:bg-surface-container-low transition-colors" onClick={onClose} disabled={loading}>{t('common:cancel')}</Button>
            <Button onClick={handleSave} isLoading={loading}>{t('common:save')}</Button>
          </div>
        </div>
      </div>
    </BaseDialog>
  );
};
