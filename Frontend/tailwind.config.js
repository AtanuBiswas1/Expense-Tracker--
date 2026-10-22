/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customBackgroundColorBlack: 'rgba(10,10,10,0.5)',
        deepblack: {
          DEFAULT: '#000000',
          base: '#000000',
          card: '#0a0a0a',
          surface: '#121212',
          border: '#1f1f1f',
        }
      },
    },
  },
  plugins: [],
}