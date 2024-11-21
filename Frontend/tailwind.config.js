/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        customBackgroundColorBlack:'rgba(10,10,10,0.5)'
      },
    },
  },
  plugins: [],
}