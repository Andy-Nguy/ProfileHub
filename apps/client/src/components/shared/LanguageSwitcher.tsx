import React from 'react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '../../i18n';

interface LanguageSwitcherProps {
  /** Extra Tailwind classes for the wrapper element */
  className?: string;
}

/**
 * Lightweight EN / VI language toggle.
 * Writes the selected language to localStorage via i18next-browser-languagedetector.
 */
export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className = '' }) => {
  const { i18n, t } = useTranslation('common');
  const currentLang = i18n.language as SupportedLanguage;

  const handleChange = (lang: SupportedLanguage) => {
    if (lang !== currentLang) {
      i18n.changeLanguage(lang);
    }
  };

  return (
    <div
      className={`flex items-center gap-0.5 rounded-full border border-outline-variant bg-surface-container-low p-0.5 ${className}`}
      role="group"
      aria-label={t('language.label')}
    >
      {SUPPORTED_LANGUAGES.map((lang) => {
        const isActive = lang === currentLang;
        return (
          <button
            key={lang}
            type="button"
            onClick={() => handleChange(lang)}
            className={`
              min-w-[36px] rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide
              transition-all duration-200
              ${
                isActive
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }
            `}
            aria-pressed={isActive}
            aria-label={t(`language.${lang}`)}
          >
            {t(`language.${lang}`)}
          </button>
        );
      })}
    </div>
  );
};
