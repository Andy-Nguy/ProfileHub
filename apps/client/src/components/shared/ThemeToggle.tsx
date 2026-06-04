import React from 'react';
import { Theme, useTheme } from '../../contexts/ThemeContext';

const OPTIONS: Array<{
  theme: Theme;
  icon: string;
  label: string;
}> = [
  { theme: 'light', icon: 'light_mode', label: 'Use light theme' },
  { theme: 'dark', icon: 'dark_mode', label: 'Use dark theme' },
  { theme: 'system', icon: 'desktop_windows', label: 'Use system theme' },
];

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className={`flex items-center gap-0.5 rounded-full border border-outline-variant bg-surface-container-low p-0.5 ${className}`}
      role="group"
      aria-label="Theme preference"
    >
      {OPTIONS.map((option) => {
        const isActive = option.theme === theme;

        return (
          <button
            key={option.theme}
            type="button"
            className={`flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200 ${
              isActive
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
            aria-label={option.label}
            aria-pressed={isActive}
            title={option.label}
            onClick={() => setTheme(option.theme)}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
              {option.icon}
            </span>
          </button>
        );
      })}
    </div>
  );
};
