import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FloatingField } from '../shared/FloatingField';
import { useDebounce } from '../../hooks/useDebounce';

export interface AutocompleteEntity {
  id?: string;
  name: string;
  subtitle?: string | null;
  logoUrl?: string | null;
}

export interface OrganizationFieldProps {
  id: string;
  label: string;
  entityTypeLabel: string; // e.g. "Company" or "Institution"
  value: string;
  selectedEntity: AutocompleteEntity | null;
  onSelectEntity: (entity: AutocompleteEntity) => void;
  onChangeText: (text: string) => void;
  onSearch: (query: string) => Promise<AutocompleteEntity[]>;
  isCreatingNew: boolean;
  onToggleCreatingNew: (isCreating: boolean) => void;
  newLogoFile: File | null;
  onChangeNewLogoFile: (file: File | null) => void;
  extraNewFields?: React.ReactNode;
}

export const OrganizationField: React.FC<OrganizationFieldProps> = ({
  id,
  label,
  entityTypeLabel,
  value,
  selectedEntity,
  onSelectEntity,
  onChangeText,
  onSearch,
  isCreatingNew,
  onToggleCreatingNew,
  newLogoFile,
  onChangeNewLogoFile,
  extraNewFields,
}) => {
  const { t } = useTranslation('profile');
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState<AutocompleteEntity[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [newLogoPreview, setNewLogoPreview] = useState<string | null>(null);

  // Logo Preview handling
  useEffect(() => {
    if (newLogoFile) {
      const objectUrl = URL.createObjectURL(newLogoFile);
      setNewLogoPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setNewLogoPreview(null);
    }
  }, [newLogoFile]);

  // Debounced search query using the shared useDebounce hook
  const debouncedQuery = useDebounce(value, 300);

  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (!showDropdown || !trimmed || selectedEntity?.name === trimmed) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    let isCancelled = false;
    setIsSearching(true);

    onSearch(trimmed)
      .then((results) => {
        if (!isCancelled) {
          setSearchResults(results);
        }
      })
      .catch((err) => {
        console.error(`Failed to search ${entityTypeLabel.toLowerCase()}`, err);
        if (!isCancelled) {
          setSearchResults([]);
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsSearching(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [debouncedQuery, showDropdown, selectedEntity, onSearch, entityTypeLabel]);

  const activeLogo = selectedEntity?.logoUrl || newLogoPreview;

  return (
    <div className="relative">
      <div className="flex gap-2 items-center">
        {activeLogo && (
          <img
            src={activeLogo}
            alt={t('dialogs.organization.logoAlt', { entity: entityTypeLabel })}
            className="w-12 h-12 rounded bg-white border border-outline-variant object-contain p-1"
          />
        )}
        <div className="flex-1 relative">
          <FloatingField
            id={id}
            label={label}
            value={value}
            onChange={(e) => {
              onChangeText(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          />

          {showDropdown && value.trim() && (
            <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-surface-container-highest border border-outline-variant rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {isSearching ? (
                <div className="p-3 text-sm text-on-surface-variant">
                  {t('dialogs.organization.searching')}
                </div>
              ) : searchResults.length > 0 ? (
                <>
                  {searchResults.map((item, idx) => (
                    <button
                      key={item.id || `${item.name}-${idx}`}
                      type="button"
                      className="w-full text-left p-3 hover:bg-surface-variant flex items-center gap-3 transition-colors border-b border-outline-variant/30 last:border-0"
                      onClick={() => {
                        onSelectEntity(item);
                        setShowDropdown(false);
                      }}
                    >
                      {item.logoUrl ? (
                        <img
                          src={item.logoUrl}
                          alt={item.name}
                          className="w-8 h-8 rounded object-contain bg-white p-0.5"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                          {item.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-on-surface text-sm">{item.name}</div>
                        {item.subtitle && (
                          <div className="text-xs text-on-surface-variant">{item.subtitle}</div>
                        )}
                      </div>
                    </button>
                  ))}
                  <div className="p-2 border-t border-outline-variant/50">
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setShowDropdown(false);
                        onToggleCreatingNew(true);
                      }}
                      className="w-full text-left p-2 text-sm text-primary font-medium hover:bg-primary/10 rounded"
                    >
                      {t('dialogs.organization.createItem', { name: value })}
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-2">
                  <div className="p-2 text-sm text-on-surface-variant">
                    {t('dialogs.organization.noResults', { entity: entityTypeLabel.toLowerCase() })}
                  </div>
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setShowDropdown(false);
                      onToggleCreatingNew(true);
                    }}
                    className="w-full text-left p-2 text-sm text-primary font-medium hover:bg-primary/10 rounded mt-1"
                  >
                    {t('dialogs.organization.createItem', { name: value })}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* New Entity Inline Creation Panel */}
      {isCreatingNew && !selectedEntity && (
        <div className="mt-3 p-4 bg-surface-container-low border border-outline-variant rounded-lg space-y-3">
          <div className="text-sm font-semibold text-on-surface">
            {t('dialogs.organization.createNewTitle', { entity: entityTypeLabel })}
          </div>

          {extraNewFields}

          <div>
            <label className="text-sm font-medium text-on-surface-variant block mb-1">
              {t('dialogs.organization.logoLabel', { entity: entityTypeLabel })}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  onChangeNewLogoFile(e.target.files[0]);
                }
              }}
              className="w-full text-sm text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
          </div>
        </div>
      )}
    </div>
  );
};
