import React, { useState, useEffect, useCallback } from 'react';
import { BaseDialog } from './BaseDialog';
import { FloatingField, FloatingTextarea } from '../../shared/FloatingField';
import { Button } from '../../shared/Button';
import { toast } from 'sonner';
import { profileAPI } from '../../../services/profile.service';
import { getErrorMessage } from '../../../services/api.service';
import { IEducation } from '@profilehub/types';
import { educationAPI } from '../../../services/education.service';
import { OrganizationField, AutocompleteEntity } from '../OrganizationField';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  educationId?: string | null;
  initialData?: IEducation;
  onSuccess: () => void;
}

function toDateInputValue(value: string | Date | null | undefined) {
  if (!value) return '';
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return value.split('T')[0];
}

export const EducationDialog: React.FC<Props> = ({ isOpen, onClose, educationId, initialData, onSuccess }) => {
  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: '',
  });
  const [loading, setLoading] = useState(false);

  // Institution selection & creation states
  const [selectedInstitution, setSelectedInstitution] = useState<AutocompleteEntity | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newInstitutionLogo, setNewInstitutionLogo] = useState<File | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          institution: initialData.institution || '',
          degree: initialData.degree || '',
          fieldOfStudy: initialData.fieldOfStudy || '',
          startDate: toDateInputValue(initialData.startDate),
          endDate: toDateInputValue(initialData.endDate),
          isCurrent: initialData.isCurrent || false,
          description: initialData.description || '',
        });
        setSelectedInstitution(
          initialData.institution
            ? {
                name: initialData.institution,
                logoUrl: initialData.institutionLogoUrl,
              }
            : null,
        );
      } else {
        setFormData({
          institution: '', degree: '', fieldOfStudy: '',
          startDate: '', endDate: '', isCurrent: false, description: '',
        });
        setSelectedInstitution(null);
        setIsCreatingNew(false);
        setNewInstitutionLogo(null);
      }
    }
  }, [isOpen, initialData]);

  const handleSearchEducation = useCallback(async (query: string): Promise<AutocompleteEntity[]> => {
    const results = await educationAPI.searchEducation(query);
    return results.map((inst) => ({
      name: inst.institution,
      logoUrl: inst.institutionLogoUrl,
    }));
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      let institutionLogoUrl: string | null = selectedInstitution?.logoUrl || null;

      if (isCreatingNew && newInstitutionLogo && formData.institution.trim()) {
        const res = await educationAPI.uploadInstitutionLogo(
          formData.institution.trim(),
          newInstitutionLogo,
        );
        institutionLogoUrl = res.institutionLogoUrl;
      }

      const payload = {
        ...formData,
        institution: formData.institution.trim(),
        institutionLogoUrl,
        startDate: new Date(formData.startDate),
        endDate: !formData.isCurrent && formData.endDate ? new Date(formData.endDate) : null,
      };

      if (educationId) {
        await profileAPI.updateEducation(educationId, payload);
      } else {
        await profileAPI.addEducation(payload);
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
    if (!educationId) return;
    if (!window.confirm('Are you sure you want to delete this education?')) return;

    setLoading(true);
    try {
      await profileAPI.deleteEducation(educationId);
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseDialog isOpen={isOpen} onClose={onClose} title={educationId ? 'Edit Education' : 'Add Education'}>
      <div className="space-y-4">
        {/* Institution Autocomplete & Logo Upload Field */}
        <OrganizationField
          id="institution"
          label="School / Institution *"
          entityTypeLabel="Institution"
          value={formData.institution}
          selectedEntity={selectedInstitution}
          onSelectEntity={(entity) => {
            setSelectedInstitution(entity);
            setFormData(prev => ({ ...prev, institution: entity.name }));
            setIsCreatingNew(false);
          }}
          onChangeText={(val) => {
            setFormData(prev => ({ ...prev, institution: val }));
            setSelectedInstitution(null);
            if (!val) {
              setIsCreatingNew(false);
            }
          }}
          onSearch={handleSearchEducation}
          isCreatingNew={isCreatingNew}
          onToggleCreatingNew={setIsCreatingNew}
          newLogoFile={newInstitutionLogo}
          onChangeNewLogoFile={setNewInstitutionLogo}
        />

        <FloatingField id="degree" label="Degree (e.g. Bachelor's)" value={formData.degree} onChange={e => setFormData({ ...formData, degree: e.target.value })} />
        <FloatingField id="fieldOfStudy" label="Field of Study" value={formData.fieldOfStudy} onChange={e => setFormData({ ...formData, fieldOfStudy: e.target.value })} />

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium text-on-surface-variant block mb-1">Start Date *</label>
            <input type="date" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} className="w-full bg-transparent border border-outline rounded-lg p-3 text-on-surface focus:border-primary outline-none" />
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium text-on-surface-variant block mb-1">End Date</label>
            <input type="date" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} disabled={formData.isCurrent} className="w-full bg-transparent border border-outline rounded-lg p-3 text-on-surface focus:border-primary outline-none disabled:opacity-50" />
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer pt-2">
          <input type="checkbox" checked={formData.isCurrent} onChange={e => setFormData({ ...formData, isCurrent: e.target.checked })} className="w-5 h-5 rounded border-outline text-primary focus:ring-primary" />
          <span className="text-on-surface text-sm">I am currently studying here</span>
        </label>

        <FloatingTextarea id="description" label="Description / Activities" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={4} />

        <div className="flex justify-between pt-4 border-t border-outline-variant mt-4">
          {educationId ? (
            <Button className="text-error border border-error hover:bg-error/10 font-label-lg text-label-lg py-2.5 px-6 rounded-full transition-colors" onClick={handleDelete} isLoading={loading}>Delete</Button>
          ) : <div></div>}
          <div className="flex gap-3">
            <Button className="border border-outline-variant text-primary font-label-lg text-label-lg py-2.5 px-6 rounded-full hover:bg-surface-container-low transition-colors" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button onClick={handleSave} isLoading={loading}>Save</Button>
          </div>
        </div>
      </div>
    </BaseDialog>
  );
};
