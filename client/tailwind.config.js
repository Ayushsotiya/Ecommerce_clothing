/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', 
  theme: {
    extend: {
      backgroundImage: {
        'custom-gradient': 'linear-gradient(180deg, rgba(0, 0, 0, 1) 87%, rgba(86, 89, 87, 1) 100%)',
      },
      spacing: {
        'sidebar': '16rem', // or match SIDEBAR_WIDTH
      },
      colors: {
        royalBlack: '#131314',
        specialGrey:'#797878',
        primary:'#FEB714',
        offWhite:'#FAF9F6',
      },
    },
  },
  plugins: [],
}  