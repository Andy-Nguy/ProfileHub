import React from 'react';

interface AppFooterProps {
  variant?: 'full' | 'compact';
}

export const AppFooter: React.FC<AppFooterProps> = ({ variant = 'full' }) => {
  const links = [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Community Guidelines', href: '#' },
    { label: 'Contact Support', href: '#' },
  ];

  if (variant === 'compact') {
    return (
      <footer className="mt-12 bg-surface-container-highest border-t border-outline-variant py-12 px-gutter w-full">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-4 md:mb-0 text-center md:text-left">
            © {new Date().getFullYear()} ProHub Community Hub. Professional Growth through Collective Expertise.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-surface-container-highest w-full mt-auto">
      <div className="w-full py-12 px-gutter flex flex-col md:flex-row justify-between items-center max-w-[1280px] mx-auto border-t border-outline-variant gap-6 md:gap-0">
        <div className="flex flex-col gap-2 items-center md:items-start text-center md:text-left">
          <span className="font-title-lg text-title-lg font-bold text-on-surface">ProHub</span>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            © {new Date().getFullYear()} ProHub Community Hub. Professional Growth through Collective Expertise.
          </p>
        </div>
        <nav className="flex flex-wrap justify-center md:justify-end gap-6">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface transition-colors hover:opacity-80"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
};
