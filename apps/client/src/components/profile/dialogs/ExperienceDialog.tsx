import React, { useState, useEffect } from 'react';
import { BaseDialog } from './BaseDialog';
import { FloatingField, FloatingTextarea } from '../../shared/FloatingField';
import { Button } from '../../shared/Button';
import { profileAPI } from '../../../services/profile.service';
import { apiClient } from '../../../services/api.service';
import { EmploymentType, IExperience, ICompany } from '@profilehub/types';
import { companiesAPI } from '../../../services/companies.service';

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

  // Company Autocomplete & Creation States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ICompany[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCompanyDetails, setSelectedCompanyDetails] = useState<ICompany | null>(null);

  const [isCreatingNewCompany, setIsCreatingNewCompany] = useState(false);
  const [newCompanyDomain, setNewCompanyDomain] = useState('');
  const [newCompanyLogo, setNewCompanyLogo] = useState<File | null>(null);
  const [newCompanyLogoPreview, setNewCompanyLogoPreview] = useState<string | null>(null);

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
        setSearchQuery(initialData.company || '');
        setSelectedCompanyDetails(initialData.companyDetails || null);
      } else {
        setFormData({
          title: '', company: '', companyId: null, location: '', employmentType: EmploymentType.FULL_TIME,
          startDate: '', endDate: '', isCurrent: false, description: '',
        });
        setSearchQuery('');
        setSelectedCompanyDetails(null);
        setIsCreatingNewCompany(false);
        setNewCompanyDomain('');
        setNewCompanyLogo(null);
        setNewCompanyLogoPreview(null);
      }
    }
  }, [isOpen, initialData]);

  // Handle Logo Preview
  useEffect(() => {
    if (newCompanyLogo) {
      const objectUrl = URL.createObjectURL(newCompanyLogo);
      setNewCompanyLogoPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setNewCompanyLogoPreview(null);
    }
  }, [newCompanyLogo]);

  // Debounced Search
  useEffect(() => {
    if (!showDropdown || !searchQuery.trim() || selectedCompanyDetails?.name === searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const results = await companiesAPI.searchCompanies(searchQuery.trim());
        setSearchResults(results);
      } catch (err) {
        console.error('Failed to search companies', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, showDropdown, selectedCompanyDetails]);

  const handleCompanySelect = (comp: ICompany) => {
    setSelectedCompanyDetails(comp);
    setSearchQuery(comp.name);
    setFormData(prev => ({ ...prev, company: comp.name, companyId: comp.id }));
    setShowDropdown(false);
    setIsCreatingNewCompany(false);
  };

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    setFormData(prev => ({ ...prev, company: val, companyId: null }));
    setSelectedCompanyDetails(null);
    setShowDropdown(true);
    if (!val) {
      setIsCreatingNewCompany(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let finalCompanyId = formData.companyId;

      if (isCreatingNewCompany && searchQuery.trim() && !finalCompanyId) {
        const created = await companiesAPI.createCompany({
          name: searchQuery.trim(),
          domain: newCompanyDomain.trim() || undefined,
          file: newCompanyLogo || undefined,
        });
        finalCompanyId = created.id;
      }

      const payload = {
        ...formData,
        company: searchQuery.trim(),
        companyId: finalCompanyId,
        startDate: new Date(formData.startDate),
        endDate: !formData.isCurrent && formData.endDate ? new Date(formData.endDate) : null,
      };

      if (experienceId) {
        await apiClient.put(`/profiles/me/experiences/${experienceId}`, payload);
      } else {
        await profileAPI.addExperience(payload);
      }
      onSuccess();
      onClose();
    } catch (e) {
      // Error handled
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!experienceId) return;
    if (!window.confirm('Are you sure you want to delete this experience?')) return;

    setLoading(true);
    try {
      await apiClient.delete(`/profiles/me/experiences/${experienceId}`);
      onSuccess();
      onClose();
    } catch (e) {
      // Error handled
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseDialog isOpen={isOpen} onClose={onClose} title={experienceId ? 'Edit Experience' : 'Add Experience'}>
      <div className="space-y-4">
        <FloatingField id="title" label="Job Title *" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
        
        {/* Company Autocomplete Field */}
        <div className="relative">
          <div className="flex gap-2 items-center">
            {(selectedCompanyDetails?.logoUrl || newCompanyLogoPreview) && (
              <img 
                src={selectedCompanyDetails?.logoUrl || newCompanyLogoPreview!} 
                alt="Company Logo" 
                className="w-12 h-12 rounded bg-surface border border-outline-variant object-cover" 
              />
            )}
            <div className="flex-1 relative">
              <FloatingField 
                id="company" 
                label="Company Name *" 
                value={searchQuery} 
                onChange={handleCompanyChange} 
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              />
              {showDropdown && searchQuery.trim() && (
                <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-surface-container-highest border border-outline-variant rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {isSearching ? (
                    <div className="p-3 text-sm text-on-surface-variant">Searching...</div>
                  ) : searchResults.length > 0 ? (
                    <>
                      {searchResults.map(comp => (
                        <button
                          key={comp.id}
                          type="button"
                          className="w-full text-left p-3 hover:bg-surface-variant flex items-center gap-3 transition-colors border-b border-outline-variant/30 last:border-0"
                          onClick={() => handleCompanySelect(comp)}
                        >
                          {comp.logoUrl ? (
                            <img src={comp.logoUrl} alt={comp.name} className="w-8 h-8 rounded object-cover" />
                          ) : (
                            <div className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                              {comp.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-on-surface text-sm">{comp.name}</div>
                            {comp.domain && <div className="text-xs text-on-surface-variant">{comp.domain}</div>}
                          </div>
                        </button>
                      ))}
                      <div className="p-2 border-t border-outline-variant/50">
                        <button 
                          type="button" 
                          onMouseDown={(e) => { e.preventDefault(); setShowDropdown(false); setIsCreatingNewCompany(true); }}
                          className="w-full text-left p-2 text-sm text-primary font-medium hover:bg-primary/10 rounded"
                        >
                          + Create "{searchQuery}"
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-2">
                      <div className="p-2 text-sm text-on-surface-variant">No existing companies found.</div>
                      <button 
                        type="button" 
                        onMouseDown={(e) => { e.preventDefault(); setShowDropdown(false); setIsCreatingNewCompany(true); }}
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

          {/* New Company Inline Fields */}
          {isCreatingNewCompany && !selectedCompanyDetails && (
            <div className="mt-3 p-4 bg-surface-container-low border border-outline-variant rounded-lg space-y-3">
              <div className="text-sm font-semibold text-on-surface">Create New Company</div>
              <FloatingField 
                id="newCompanyDomain" 
                label="Company Domain (e.g. google.com)" 
                value={newCompanyDomain} 
                onChange={e => setNewCompanyDomain(e.target.value)} 
              />
              <div>
                <label className="text-sm font-medium text-on-surface-variant block mb-1">Company Logo (Optional)</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      setNewCompanyLogo(e.target.files[0]);
                    }
                  }} 
                  className="w-full text-sm text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
              </div>
            </div>
          )}
        </div>

        <FloatingField id="location" label="Location" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />

        <div className="flex gap-4 items-center">
          <label className="text-sm font-medium text-on-surface-variant w-1/3">Employment Type</label>
          <select
            value={formData.employmentType}
            onChange={e => setFormData({ ...formData, employmentType: e.target.value as EmploymentType })}
            className="flex-1 bg-transparent border border-outline rounded-lg p-3 text-on-surface focus:border-primary outline-none"
          >
            <option value={EmploymentType.FULL_TIME}>Full-time</option>
            <option value={EmploymentType.PART_TIME}>Part-time</option>
            <option value={EmploymentType.CONTRACT}>Contract</option>
            <option value={EmploymentType.INTERNSHIP}>Internship</option>
            <option value={EmploymentType.FREELANCE}>Freelance</option>
            <option value={EmploymentType.VOLUNTEER}>Volunteer</option>
          </select>
        </div>

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
          <span className="text-on-surface text-sm">I currently work here</span>
        </label>

        <FloatingTextarea id="description" label="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={4} />

        <div className="flex justify-between pt-4 border-t border-outline-variant mt-4">
          {experienceId ? (
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
