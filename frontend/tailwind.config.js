/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      colors: {
        apple: {
          black: '#000000',
          dark: '#0a0a0a',
          gray: '#86868b',
          light: '#f5f5f7',
          neon: '#00ff41' // Futuristic terminal green
        }
      }
    },
  },
  plugins: [],
}
