/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['DM Sans', 'Arial', 'Helvetica', 'sans-serif'],
      },
      colors: {
        background: 'oklch(var(--background) / <alpha-value>)',
        foreground: 'oklch(var(--foreground) / <alpha-value>)',
        border: 'oklch(var(--border) / <alpha-value>)',
        muted: { DEFAULT: 'oklch(var(--muted) / <alpha-value>)', foreground: 'oklch(var(--muted) / <alpha-value>)' },
        card: { DEFAULT: 'oklch(var(--card) / <alpha-value>)', foreground: 'oklch(var(--card-foreground) / <alpha-value>)' },
        primary: { DEFAULT: 'oklch(var(--primary) / <alpha-value>)', foreground: 'oklch(var(--primary-foreground) / <alpha-value>)' },
        secondary: { DEFAULT: 'oklch(var(--secondary) / <alpha-value>)', foreground: 'oklch(var(--secondary-foreground) / <alpha-value>)' },
        accent: { DEFAULT: 'oklch(var(--accent) / <alpha-value>)', foreground: 'oklch(var(--accent-foreground) / <alpha-value>)' },
        destructive: { DEFAULT: 'oklch(var(--destructive) / <alpha-value>)', foreground: 'oklch(var(--destructive-foreground) / <alpha-value>)' },
        input: 'oklch(var(--input) / <alpha-value>)',
        ring: 'oklch(var(--ring) / <alpha-value>)',
        popover: { DEFAULT: 'oklch(var(--popover) / <alpha-value>)', foreground: 'oklch(var(--popover-foreground) / <alpha-value>)' },
      },
      borderRadius: {
        lg: '0px',
        md: '0px',
        sm: '0px',
        DEFAULT: '0px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
