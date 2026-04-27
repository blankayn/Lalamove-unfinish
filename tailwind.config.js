/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        lalamoveBlue: '#21346e',
        lalamoveBlueDark: '#1a2a5a',
        lalamoveOrange: '#f36f21',
      },
      fontFamily: {
        rubik: ['Rubik', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
