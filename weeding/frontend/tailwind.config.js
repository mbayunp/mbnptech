/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/templates/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core branding colors
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        sapphire: {
          50: '#f4f8fa',
          100: '#e6eff4',
          200: '#c1d7e5',
          300: '#8cb3d0',
          400: '#508db8',
          500: '#085090',
          600: '#064075',
          700: '#05345d',
          800: '#042a4b',
          900: '#021a30',
          950: '#010d18',
        },
        gold: {
          50: '#faf8f3',
          100: '#f3e8d2',
          200: '#e7d1a5',
          300: '#d9b872',
          400: '#cca248',
          500: '#d4af37',
          600: '#b98e3b',
          700: '#906c28',
          800: '#684c1b',
          900: '#453110',
          950: '#261a07',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        serif: ['var(--font-serif)', 'serif'],
        cormorant: ['var(--font-cormorant)', 'serif'],
        alexBrush: ['var(--font-alex-brush)', 'cursive'],
        greatVibes: ['var(--font-great-vibes)', 'cursive'],
        playfair: ['var(--font-playfair)', 'serif'],
        cinzel: ['var(--font-cinzel)', 'serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'pulse-subtle': 'pulseSubtle 2s infinite ease-in-out',
        'spin-slow': 'spin 12s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s infinite ease-in-out',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.03)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.05)' },
        },
      },
    },
  },
  plugins: [],
};
