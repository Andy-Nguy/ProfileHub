/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#000666', light: '#3a3f99', container: '#dee0ff' },
        secondary: { DEFAULT: '#006a63', light: '#339a91', container: '#71f7ea' },
        tertiary: { DEFAULT: '#d3871a', light: '#ffb74d', container: '#ffdea6' },
        surface: { DEFAULT: '#f8f9fa', container: '#f0f1f4' },
        'on-surface': '#1a1c1e',
        'on-surface-variant': '#44474e',
        outline: { DEFAULT: '#74777f', variant: '#c4c6cf' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: '16px',
        xl: '24px',
      },
    },
  },
  plugins: [],
};
