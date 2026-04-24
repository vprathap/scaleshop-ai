/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy:  { DEFAULT: '#0D1B2A', 50: '#e8edf3', 600: '#0D1B2A' },
        teal:  { DEFAULT: '#1A6B5E', 50: '#e8f4f1', 500: '#1A6B5E' },
        gold:  { DEFAULT: '#C9963A', 50: '#fdf5e8', 500: '#C9963A' },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
    }
  },
  plugins: [],
};
