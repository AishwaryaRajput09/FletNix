/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        fletnix: {
          red: '#E8A020',
          black: '#111010',
          dark: '#100e0a',
          gray: '#6b6560'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['"DM Serif Display"', 'serif'],
        body: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
