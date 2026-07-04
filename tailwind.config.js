/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--background-rgb) / <alpha-value>)',
        foreground: 'rgb(var(--foreground-rgb) / <alpha-value>)',
        card: {
          DEFAULT: 'rgb(var(--card-rgb) / <alpha-value>)',
          foreground: 'rgb(var(--card-foreground-rgb) / <alpha-value>)',
        },
        primary: {
          DEFAULT: 'rgb(var(--primary-rgb) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'rgb(var(--secondary-rgb) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'rgb(var(--muted-rgb) / <alpha-value>)',
          foreground: 'rgb(var(--muted-foreground-rgb) / <alpha-value>)',
        },
        border: 'rgb(var(--border-rgb) / <alpha-value>)',
        accent: {
          DEFAULT: 'rgb(var(--accent-rgb) / <alpha-value>)',
        },
        ring: 'rgb(var(--ring-rgb) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(142, 112, 207, 0.08)',
      },
    },
  },
  plugins: [],
};
