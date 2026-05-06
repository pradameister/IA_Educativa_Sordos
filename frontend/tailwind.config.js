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
          50: '#f0f9ff',
          100: '#e0f2fe',
          600: '#0284c7',
          700: '#0369a1',
        },
        accessible: {
          focus: '#000080',
          text: '#000000',
          bg: '#ffffff',
        },
      },
      fontSize: {
        'accessible': '16px',
      },
    },
  },
  plugins: [],
}
