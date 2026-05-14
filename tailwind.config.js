/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#1f1b2e', // A softer, elegant twilight dark (much lighter than the deep black)
          brown: '#fbbf24', // Softer Amber/Gold
          green: '#f472b6', // Lighter, glowing Pink (gradient end)
          blue: '#8b5cf6', // Lighter, punchier Violet (primary, gradient start)
          light: '#f1f5f9', // Brighter text color for better contrast
          white: '#ffffff' // Pure stark white
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        orbitron: ['Orbitron', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

