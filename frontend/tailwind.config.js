/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-bg': '#0b0f19',
        'brand-card': '#1f293d',
        'brand-hover': '#28354e',
        'brand-border': '#2e3b52',
        'brand-secondary': '#111827',
      }
    },
  },
  plugins: [],
}
