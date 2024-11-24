/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4F46E5',
          dark: '#6366F1',
        },
        background: {
          light: '#FFFFFF',
          dark: '#000000',
        },
        card: {
          light: 'rgba(255, 255, 255, 0.9)',
          dark: 'rgba(17, 17, 17, 0.9)',
        }
      }
    },
  },
  plugins: [],
};