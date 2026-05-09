const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'index.html'), 
    join(__dirname, 'src/**/*.{ts,tsx}'),
    join(__dirname, '../../libs/shared/ui/src/**/*.{ts,tsx}')
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        "on-primary-fixed-variant": "#343d96",
        "surface-dim": "#d9dadb",
        "on-error-container": "#93000a",
        "secondary-fixed": "#8ef4e9",
        "primary": "#000666",
        "on-secondary-fixed-variant": "#00504a",
        "on-primary": "#ffffff",
        "on-secondary": "#ffffff",
        "inverse-on-surface": "#f0f1f2",
        "primary-fixed-dim": "#bdc2ff",
        "outline-variant": "#c6c5d4",
        "secondary-fixed-dim": "#71d7cd",
        "on-surface-variant": "#454652",
        "tertiary": "#2a1600",
        "surface-container-highest": "#e1e3e4",
        "background": "#f8f9fa",
        "inverse-primary": "#bdc2ff",
        "on-secondary-fixed": "#00201d",
        "on-tertiary-fixed-variant": "#673d00",
        "secondary": "#006a63",
        "outline": "#767683",
        "tertiary-container": "#472900",
        "inverse-surface": "#2e3132",
        "on-primary-container": "#8690ee",
        "on-background": "#191c1d",
        "primary-fixed": "#e0e0ff",
        "on-tertiary-container": "#d3871a",
        "surface": "#f8f9fa",
        "tertiary-fixed-dim": "#ffb866",
        "on-error": "#ffffff",
        "surface-container-lowest": "#ffffff",
        "error-container": "#ffdad6",
        "surface-variant": "#e1e3e4",
        "surface-container-low": "#f3f4f5",
        "on-tertiary": "#ffffff",
        "on-surface": "#191c1d",
        "surface-bright": "#f8f9fa",
        "tertiary-fixed": "#ffddba",
        "on-tertiary-fixed": "#2b1700",
        "surface-container-high": "#e7e8e9",
        "on-secondary-container": "#006f67",
        "surface-container": "#edeeef",
        "on-primary-fixed": "#000767",
        "error": "#ba1a1a",
        "secondary-container": "#8bf1e6",
        "primary-container": "#1a237e",
        "surface-tint": "#4c56af"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "16px",
        "xl": "24px",
        "full": "9999px"
      },
      spacing: {
        "gutter": "24px",
        "margin-mobile": "16px",
        "max-width": "1280px",
        "unit": "8px",
        "margin-desktop": "32px"
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        "body-lg": ["Inter"],
        "headline-lg": ["Inter"],
        "title-lg": ["Inter"],
        "display-lg": ["Inter"],
        "label-lg": ["Inter"]
      },
      fontSize: {
        "body-lg": ["16px", { "lineHeight": "24px", "letterSpacing": "0.5px", "fontWeight": "400" }],
        "headline-lg": ["32px", { "lineHeight": "40px", "letterSpacing": "0px", "fontWeight": "400" }],
        "title-lg": ["22px", { "lineHeight": "28px", "letterSpacing": "0px", "fontWeight": "500" }],
        "display-lg": ["57px", { "lineHeight": "64px", "letterSpacing": "-0.25px", "fontWeight": "400" }],
        "label-lg": ["14px", { "lineHeight": "20px", "letterSpacing": "0.1px", "fontWeight": "500" }]
      }
    },
  },
  plugins: [],
};
