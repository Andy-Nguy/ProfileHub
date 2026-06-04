import React from 'react';
import { useTranslation } from 'react-i18next';

interface AppFooterProps {
  variant?: 'full' | 'compact';
}

export const AppFooter: React.FC<AppFooterProps> = ({ variant = 'full' }) => {
  const { t } = useTranslation('common');

  const links = [
    { labelKey: 'footer.privacyPolicy', href: '#' },
    { labelKey: 'footer.termsOfService', href: '#' },
    { labelKey: 'footer.communityGuidelines', href: '#' },
    { labelKey: 'footer.contactSupport', href: '#' },
  ];

  const year = new Date().getFullYear();

  /* ── Compact variant (used on inner pages) ── */
  if (variant === 'compact') {
    return (
      <footer className="w-full mt-auto border-t border-outline-variant bg-surface-container-highest">
        <div className="max-w-[1280px] mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <span className="text-sm font-semibold text-on-surface">ProHub</span>

          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {links.map((link) => (
              <a
                key={link.labelKey}
                href={link.href}
                className="text-xs text-on-surface-variant hover:text-on-surface transition-colors whitespace-nowrap"
              >
                {t(link.labelKey)}
              </a>
            ))}
          </nav>

          {/* Copyright */}
          <p className="text-xs text-on-surface-variant opacity-70 whitespace-nowrap">
            © {year} ProHub
          </p>
        </div>
      </footer>
    );
  }

  /* ── Full variant (Landing Page, etc.) ── */
  return (
    <footer className="w-full mt-auto bg-surface-container-highest border-t border-outline-variant">
      <div className="max-w-[1280px] mx-auto px-6 pt-12 pb-8 flex flex-col gap-10">

        {/* ── Top Row: Brand + Nav ── */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">

          {/* Brand Block */}
          <div className="flex flex-col gap-3 max-w-xs">
            <span className="text-2xl font-bold text-on-surface tracking-tight">ProHub</span>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Nền tảng portfolio chuyên nghiệp giúp bạn xây dựng thương hiệu cá nhân và kết nối cộng đồng.
            </p>
          </div>

          {/* Links Grid */}
          <div className="flex flex-wrap gap-x-12 gap-y-6">
            {/* Column 1 */}
            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold text-on-surface uppercase tracking-widest">Pháp lý</p>
              <nav className="flex flex-col gap-2">
                <a href="#" className="text-sm text-on-surface-variant hover:text-on-surface transition-colors whitespace-nowrap">
                  {t('footer.privacyPolicy')}
                </a>
                <a href="#" className="text-sm text-on-surface-variant hover:text-on-surface transition-colors whitespace-nowrap">
                  {t('footer.termsOfService')}
                </a>
              </nav>
            </div>
            {/* Column 2 */}
            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold text-on-surface uppercase tracking-widest">Cộng đồng</p>
              <nav className="flex flex-col gap-2">
                <a href="#" className="text-sm text-on-surface-variant hover:text-on-surface transition-colors whitespace-nowrap">
                  {t('footer.communityGuidelines')}
                </a>
                <a href="#" className="text-sm text-on-surface-variant hover:text-on-surface transition-colors whitespace-nowrap">
                  {t('footer.contactSupport')}
                </a>
              </nav>
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="h-px w-full bg-outline-variant opacity-40" />

        {/* ── Bottom Row: Copyright ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-on-surface-variant opacity-75 text-center sm:text-left">
            © {year} ProHub Community Hub. Phát triển nghề nghiệp thông qua chuyên môn tập thể.
          </p>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-primary opacity-80" />
            <span className="text-xs text-on-surface-variant opacity-60">Made with ♥ in Vietnam</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
