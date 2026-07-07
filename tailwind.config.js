/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          50: '#FDFBF7',
          100: '#F8F4E8',
          200: '#F2EBD9',
          300: '#E6DBBF',
          400: '#D5C49E',
          800: '#3A3228',
          900: '#2A231A',
        },
        crimson: {
          500: '#9E2A2B',
          600: '#851D1E',
          700: '#7A1C1C',
          800: '#5B1313',
          900: '#3D0909',
        },
        gold: {
          300: '#F3E5AB',
          400: '#E6CA65',
          500: '#D4AF37',
          600: '#C5A059',
          700: '#997A29',
          800: '#665118',
        },
        ink: {
          DEFAULT: '#2C241D',
          light: '#4A3E35',
          faded: '#7A6B5D',
        }
      },
      fontFamily: {
        serif: ['"Noto Serif Thai"', 'serif'],
        sans: ['"IBM Plex Sans Thai"', 'sans-serif'],
      },
      boxShadow: {
        'parchment': '0 10px 30px -5px rgba(44, 36, 29, 0.15), 0 0 0 1px rgba(212, 175, 55, 0.2)',
        'seal': '0 8px 25px rgba(122, 28, 28, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.3)',
        'gold-glow': '0 0 20px rgba(212, 175, 55, 0.35)',
      },
      backgroundImage: {
        'radial-parchment': 'radial-gradient(circle at center, #FDFBF7 0%, #F8F4E8 60%, #E6DBBF 100%)',
        'seal-pattern': 'radial-gradient(circle, #7A1C1C 0%, #5B1313 70%, #3D0909 100%)',
      }
    },
  },
  plugins: [],
}
