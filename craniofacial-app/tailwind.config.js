/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f172a',
        surface: '#1e293b',
        'surface-hover': '#334155',
        primary: '#3b82f6',
        accent: '#10b981',
        'accent-glow': 'rgba(16, 185, 129, 0.5)',
        border: '#475569',
      },
      boxShadow: {
        'glow': '0 0 15px rgba(16, 185, 129, 0.5)',
      }
    },
  },
  plugins: [],
}
