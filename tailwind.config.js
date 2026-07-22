/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        neutral: {
          100: 'var(--n100)',
          200: 'var(--n200)',
          300: 'var(--n300)',
          400: 'var(--n400)',
          500: 'var(--n500)',
          600: 'var(--n600)',
          700: 'var(--n700)',
          750: 'var(--n750)',
          800: 'var(--n800)',
          900: 'var(--n900)',
        },
      },
      boxShadow: {
        aceternity: '0px 2px 3px -1px rgba(0,0,0,0.1), 0px 1px 0px 0px rgba(25,28,33,0.02), 0px 0px 0px 1px rgba(25,28,33,0.08)',
      },
    },
  },
  plugins: [],
}
