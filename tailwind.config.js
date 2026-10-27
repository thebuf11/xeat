const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Los colores que cambian entre modo claro y oscuro leen variables definidas en index.css
        background: v('background'),
        surface: v('background'),
        'surface-container-lowest': v('surface-container-lowest'),
        'surface-container-low': v('surface-container-low'),
        'surface-container': v('surface-container'),
        'surface-container-high': v('surface-container-high'),
        'surface-container-highest': v('surface-container-highest'),
        'on-surface': v('on-surface'),
        card: v('card'),
        inner: v('inner'),
        'inner-hover': v('inner-hover'),
        // Superposiciones (bordes, hovers): blanco en oscuro, negro en claro
        ink: v('ink'),
        zinc: { 100: v('zinc-100'), 200: v('zinc-200'), 300: v('zinc-300'), 400: v('zinc-400'), 500: v('zinc-500'), 600: v('zinc-600') },
        'on-surface-variant': '#a1a1aa',
        outline: '#a78b7d',
        'outline-variant': '#584237',
        primary: v('primary'),
        'on-primary': '#552100',
        'primary-container': v('primary-container'),
        'on-primary-container': '#582200',
        secondary: v('secondary'),
        'secondary-container': '#00a572',
        error: v('error'),
        'error-container': '#93000a',
        protein: v('protein'),
        carbs: v('carbs'),
        fat: v('fat'),
        fiber: v('fiber'),
      },
      borderRadius: { DEFAULT: '0.5rem', lg: '0.75rem', xl: '1rem', '2xl': '1.25rem' },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        sans: ['Geist', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
