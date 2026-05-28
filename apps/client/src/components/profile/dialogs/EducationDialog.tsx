import React, { useState, useEffect } from 'react';
import { BaseDialog } from './BaseDialog';
import { FloatingField, FloatingTextarea } from '../../shared/FloatingField';
import { Button } from '../../shared/Button';
import { profileAPI } from '../../../services/profile.service';
import { apiClient } from '../../../services/api.service';
import { IEducation } from '@profilehub/types';
import { educationAPI, IEducationSearchResult } from '../../../services/education.service';

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

  // Institution Autocomplete & Logo States – mirrors ExperienceDialog's company autocomplete
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<IEducationSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState<IEducationSearchResult | null>(null);

  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newInstitutionLogo, setNewInstitutionLogo] = useState<File | null>(null);
  const [newInstitutionLogoPreview, setNewInstitutionLogoPreview] = useState<string | null>(null);

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
        setSearchQuery(initialData.institution || '');
        if (initialData.institutionLogoUrl) {
          setSelectedInstitution({
            institution: initialData.institution,
            institutionLogoUrl: initialData.institutionLogoUrl,
          });
        } else {
          setSelectedInstitution(null);
        }
      } else {
        setFormData({
          institution: '', degree: '', fieldOfStudy: '',
          startDate: '', endDate: '', isCurrent: false, description: '',
        });
        setSearchQuery('');
        setSelectedInstitution(null);
        setIsCreatingNew(false);
        setNewInstitutionLogo(null);
        setNewInstitutionLogoPreview(null);
      }
    }
  }, [isOpen, initialData]);

  // Handle Logo Preview
  useEffect(() => {
    if (newInstitutionLogo) {
      const objectUrl = URL.createObjectURL(newInstitutionLogo);
      setNewInstitutionLogoPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setNewInstitutionLogoPreview(null);
    }
  }, [newInstitutionLogo]);

  // Debounced Search – mirrors ExperienceDialog
  useEffect(() => {
    if (!showDropdown || !searchQuery.trim() || selectedInstitution?.institution === searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const results = await educationAPI.searchEducation(searchQuery.trim());
        setSearchResults(results);
      } catch (err) {
        console.error('Failed to search institutions', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, showDropdown, selectedInstitution]);

  const handleInstitutionSelect = (inst: IEducationSearchResult) => {
    setSelectedInstitution(inst);
    setSearchQuery(inst.institution);
    setFormData(prev => ({ ...prev, institution: inst.institution }));
    setShowDropdown(false);
    setIsCreatingNew(false);
  };

  const handleInstitutionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    setFormData(prev => ({ ...prev, institution: val }));
    setSelectedInstitution(null);
    setShowDropdown(true);
    if (!val) {
      setIsCreatingNew(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // If user selected an existing institution with a logo, use it directly
      // If user is creating new with a file upload, upload first
      let institutionLogoUrl: string | null = selectedInstitution?.institutionLogoUrl || null;

      if (isCreatingNew && newInstitutionLogo && searchQuery.trim()) {
        const uploadForm = new FormData();
        uploadForm.append('file', newInstitutionLogo);
        const res = await apiClient.post<{ institutionLogoUrl: string }>(
          `/storage/institution-logo?institutionName=${encodeURIComponent(searchQuery.trim())}`,
          uploadForm,
        );
        institutionLogoUrl = res.data.institutionLogoUrl;
      }

      const payload = {
        ...formData,
        institution: searchQuery.trim(),
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

        {/* ── Institution Autocomplete Field ───────────────────────────────
            Mirrors ExperienceDialog's company autocomplete exactly */}
        <div className="relative">
          <div className="flex gap-2 items-center">
            {(selectedInstitution?.institutionLogoUrl || newInstitutionLogoPreview) && (
              <img
                src={selectedInstitution?.institutionLogoUrl || newInstitutionLogoPreview!}
                alt="Institution Logo"
                className="w-12 h-12 rounded bg-surface border border-outline-variant object-cover"
              />
            )}
            <div className="flex-1 relative">
              <FloatingField
                id="institution"
                label="School / Institution *"
                value={searchQuery}
                onChange={handleInstitutionChange}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              />
              {showDropdown && searchQuery.trim() && (
                <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-surface-container-highest border border-outline-variant rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {isSearching ? (
                    <div className="p-3 text-sm text-on-surface-variant">Searching...</div>
                  ) : searchResults.length > 0 ? (
                    <>
                      {searchResults.map((inst, idx) => (
                        <button
                          key={`${inst.institution}-${idx}`}
                          type="button"
                          className="w-full text-left p-3 hover:bg-surface-variant flex items-center gap-3 transition-colors border-b border-outline-variant/30 last:border-0"
                          onClick={() => handleInstitutionSelect(inst)}
                        >
                          {inst.institutionLogoUrl ? (
                            <img src={inst.institutionLogoUrl} alt={inst.institution} className="w-8 h-8 rounded object-cover" />
                          ) : (
                            <div className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                              {inst.institution.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-on-surface text-sm">{inst.institution}</div>
                          </div>
                        </button>
                      ))}
                      <div className="p-2 border-t border-outline-variant/50">
                        <button
                          type="button"
                          onMouseDown={(e) => { e.preventDefault(); setShowDropdown(false); setIsCreatingNew(true); }}
                          className="w-full text-left p-2 text-sm text-primary font-medium hover:bg-primary/10 rounded"
                        >
                          + Create "{searchQuery}"
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-2">
                      <div className="p-2 text-sm text-on-surface-variant">No existing institutions found.</div>
                      <button
                        type="button"
                        onMouseDown={(e) => { e.preventDefault(); setShowDropdown(false); setIsCreatingNew(true); }}
                        className="w-full text-left p-2 text-sm text-primary font-medium hover:bg-primary/10 rounded mt-1"
                      >
                        + Create "{searchQuery}"
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* New Institution Inline Fields – mirrors ExperienceDialog's "Create New Company" panel */}
          {isCreatingNew && !selectedInstitution && (
            <div className="mt-3 p-4 bg-surface-container-low border border-outline-variant rounded-lg space-y-3">
              <div className="text-sm font-semibold text-on-surface">Create New Institution</div>
              <div>
                <label className="text-sm font-medium text-on-surface-variant block mb-1">School Logo (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      setNewInstitutionLogo(e.target.files[0]);
                    }
                  }}
                  className="w-full text-sm text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
              </div>
            </div>
          )}
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
