/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // SweatWorks-inspired brand colors
        brand: {
          primary: {
            50: '#fff5f0',
            100: '#ffe6d9',
            200: '#ffc9b3',
            300: '#ffa380',
            400: '#ff7547',
            500: '#ff5722', // Main vibrant orange
            600: '#f44336',
            700: '#d32f2f',
            800: '#b71c1c',
            900: '#8b0000',
          },
          secondary: {
            50: '#f0f4f8',
            100: '#d9e2ec',
            200: '#bcccdc',
            300: '#9fb3c8',
            400: '#829ab1',
            500: '#627d98', // Deep blue-grey
            600: '#486581',
            700: '#334e68',
            800: '#243b53',
            900: '#102a43',
          },
          accent: {
            50: '#e0f7fa',
            100: '#b2ebf2',
            200: '#80deea',
            300: '#4dd0e1',
            400: '#26c6da',
            500: '#00bcd4', // Bright cyan
            600: '#00acc1',
            700: '#0097a7',
            800: '#00838f',
            900: '#006064',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px 0 rgba(0, 0, 0, 0.08)',
        'card': '0 4px 20px 0 rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};
