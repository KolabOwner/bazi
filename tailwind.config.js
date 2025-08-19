/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7ec',
          100: '#feefd3',
          200: '#fcdaa5',
          300: '#f9c06d',
          400: '#f59e32',
          500: '#f28b0c',
          600: '#d97706',
          700: '#b45309',
          800: '#924310',
          900: '#783711',
        },
      },
    },
  },
  plugins: [],
}

