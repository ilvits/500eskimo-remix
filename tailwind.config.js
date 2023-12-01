/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: '#f8e9cc',
        'input-bg': '#fffbf2',
        'input-hover': '#e9bd66',
        'input-focus': '#4a2502',
        ring: '#fff',
        background: 'var(--background)',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#da9100',
          brown: '#4a2502',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: '#f8e9cc',
          500: '#a59280',
          400: '#e1a733',
          300: '#e9bd66',
          200: '#f0d399',
          100: '#f8e9cc',
          50: '#fffbf2',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        additional: {
          red: '#d80d00',
          roseHover: '#fbc330',
          pink: '#ffdabf',
          pinkHover: '#ffddca',
          green: {
            100: '#a6b24f',
            50: '#c0cc66',
            0: '#dfe3ae',
          },
          dark: '#593c46',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: '#a59280',
        },
        accent: {
          DEFAULT: '#fff',
          foreground: '#da9100',
        },
        popover: {
          DEFAULT: '#fffbf2',
          foreground: '#4a2502',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        'fade-in-0': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'fade-out-0': {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in-0': 'fade-in-0 0.5s ease-out',
        'fade-out-0': 'fade-out-0 0.5s ease-out',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('tailwindcss/plugin')(({ addVariant }) => {
      addVariant('search-cancel', '&::-webkit-search-cancel-button');
    }),
  ],
};
