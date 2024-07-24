/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    fontFamily: {
      sans: 'Roboto Mono, monospace',
    },
    extend: {
      colors:{
        'dark-mode': '#1f2937',
        'light-mode': '#fff',
      },
      height:{
        screen: "100vh",
      }
    },
  },
  plugins: [],
}

