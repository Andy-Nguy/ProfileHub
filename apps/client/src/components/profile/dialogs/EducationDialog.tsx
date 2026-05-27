import React, { useState, useEffect } from 'react';
import { BaseDialog } from './BaseDialog';
import { FloatingField, FloatingTextarea } from '../../shared/FloatingField';
import { Button } from '../../shared/Button';
import { profileAPI } from '../../../services/profile.service';
import { apiClient } from '../../../services/api.service';
import { IEducation } from '@profilehub/types';

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

  // Institution Logo States – mirrors ExperienceDialog's company logo states
  const [institutionLogo, setInstitutionLogo] = useState<File | null>(null);
  const [institutionLogoPreview, setInstitutionLogoPreview] = useState<string | null>(null);
  const [existingLogoUrl, setExistingLogoUrl] = useState<string | null>(null);

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
        setExistingLogoUrl(initialData.institutionLogoUrl || null);
      } else {
        setFormData({
          institution: '', degree: '', fieldOfStudy: '',
          startDate: '', endDate: '', isCurrent: false, description: '',
        });
        setExistingLogoUrl(null);
      }
      setInstitutionLogo(null);
      setInstitutionLogoPreview(null);
    }
  }, [isOpen, initialData]);

  // Handle Logo Preview – identical pattern to ExperienceDialog
  useEffect(() => {
    if (institutionLogo) {
      const objectUrl = URL.createObjectURL(institutionLogo);
      setInstitutionLogoPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setInstitutionLogoPreview(null);
    }
  }, [institutionLogo]);

  // The displayed logo: new file preview takes priority over existing URL
  const displayedLogoSrc = institutionLogoPreview || existingLogoUrl;

  const handleSave = async () => {
    setLoading(true);
    try {
      // Step 1: upload logo first if user picked a new file (mirrors company logo flow)
      let institutionLogoUrl: string | null = existingLogoUrl;
      if (institutionLogo && formData.institution.trim()) {
        const uploadForm = new FormData();
        uploadForm.append('file', institutionLogo);
        const res = await apiClient.post<{ institutionLogoUrl: string }>(
          `/storage/institution-logo?institutionName=${encodeURIComponent(formData.institution.trim())}`,
          uploadForm,
        );
        institutionLogoUrl = res.data.institutionLogoUrl;
      }

      // Step 2: save education entry with the resolved logo URL
      const payload = {
        ...formData,
        institutionLogoUrl,
        startDate: new Date(formData.startDate),
        endDate: !formData.isCurrent && formData.endDate ? new Date(formData.endDate) : null,
      };

      if (educationId) {
        await apiClient.put(`/profiles/me/educations/${educationId}`, payload);
      } else {
        await profileAPI.addEducation(payload);
      }
      onSuccess();
      onClose();
    } catch (e) {
      // Errors are handled by apiClient interceptors / profileAPI
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!educationId) return;
    if (!window.confirm('Are you sure you want to delete this education?')) return;

    setLoading(true);
    try {
      await apiClient.delete(`/profiles/me/educations/${educationId}`);
      onSuccess();
      onClose();
    } catch (e) {
      // Error handled
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseDialog isOpen={isOpen} onClose={onClose} title={educationId ? 'Edit Education' : 'Add Education'}>
      <div className="space-y-4">

        {/* ── Institution Name + Logo Preview ─────────────────────────────
            Matches ExperienceDialog: logo thumb on the LEFT of the name field */}
        <div className="relative">
          <div className="flex gap-2 items-center">
            {/* Logo preview – shows when an existing or newly-selected logo is available */}
            {displayedLogoSrc && (
              <img
                src={displayedLogoSrc}
                alt="Institution Logo"
                className="w-12 h-12 rounded bg-surface border border-outline-variant object-cover flex-shrink-0"
              />
            )}
            <div className="flex-1">
              <FloatingField
                id="institution"
                label="School / Institution *"
                value={formData.institution}
                onChange={e => setFormData({ ...formData, institution: e.target.value })}
              />
            </div>
          </div>

          {/* ── Logo Upload Panel ──────────────────────────────────────────
              Same container style as ExperienceDialog's "Create New Company" panel */}
          <div className="mt-3 p-4 bg-surface-container-low border border-outline-variant rounded-lg space-y-3">
            <div className="text-sm font-semibold text-on-surface">School Logo (Optional)</div>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={e => {
                if (e.target.files && e.target.files[0]) {
                  setInstitutionLogo(e.target.files[0]);
                }
              }}
              className="w-full text-sm text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
            {/* "Remove" link – only shows when there is an existing logo without a new replacement */}
            {existingLogoUrl && !institutionLogoPreview && (
              <button
                type="button"
                onClick={() => setExistingLogoUrl(null)}
                className="text-xs text-error hover:underline"
              >
                Remove current logo
              </button>
            )}
          </div>
        </div>

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
