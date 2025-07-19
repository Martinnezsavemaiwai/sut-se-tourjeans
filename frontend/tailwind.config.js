/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",               
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', 
  theme: {
    extend: {
      colors: {
        customYellow: '#FFF100',
        customBlue: '#0094DE',
        customSkyYellow:"#FCFFCF",
        customOrange:"#FFC107",
        customBackground:"#ffffe8",
    },
    screens: {
      xl2: "1515px",
    },
    },
  },
  plugins: [],
};
