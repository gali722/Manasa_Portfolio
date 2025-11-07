/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#2563EB',
          dark: '#3B82F6',
        },
        secondary: {
          light: '#7C3AED',
          dark: '#8B5CF6',
        },
        accent: {
          light: '#10B981',
          dark: '#34D399',
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
