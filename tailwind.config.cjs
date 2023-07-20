/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        '3xl': '2200px'
      },
      colors: {
        transparent: 'transparent',
        primary: '#262626',
        secondary: '#fbbf24',
        primarytext: "#f1f5f9",
        primarytextdark: "#f1f5f9",
        buttonborder: "#fcd34d"
      },
    },
  },
  plugins: [],
  safelist: [
    'text-primary',
    'text-secondary'
  ]
}
