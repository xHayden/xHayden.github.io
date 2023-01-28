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
      }
    },
  },
  plugins: [],
  safelist: [
    'text-zinc-600',
    'text-zinc-100',
    'text-amber-400'
  ]
}
