/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        fletnix: {
          red: '#E8A020',
          black: '#111010',
          dark: '#0D0C0B',
          gray: '#6b6560'
        }
      },
      fontFamily: {
        sans: ['DM Mono', 'monospace'],
        display: ['"DM Serif Display"', 'serif'],
        body: ['DM Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
