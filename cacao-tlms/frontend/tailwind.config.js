/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'dark-cacao': '#3B2A28',
        'rich-chocolate': '#5A3A33',
        'milk-cream': '#F3E6D3',
        'caramel-accent': '#C58A4A',
        'espresso-black': '#1C1412',
        success: '#6A9C89',
        warning: '#F2C94C',
        error: '#E07A5F',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
        handwriting: ['Caveat', 'cursive'],
      },
    },
  },
  plugins: [],
};