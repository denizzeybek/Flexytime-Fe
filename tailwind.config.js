// eslint-disable-next-line no-undef
const { colors } = require('./src/constants/colors')
/** @type {import('tailwindcss').Config} */

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        '3xl': '1800px'
      },
      colors,
      fontFamily: {
        sans: ['Poppins', 'sans-serif']
      },
      keyframes: {
        'shake-x': {
          '0%, 100%': { marginLeft: '0' },
          '25%': { marginLeft: '0.25rem' },
          '75%': { marginLeft: '-0.25rem' }
        }
      },
      animation: {
        'shake-x': 'shake-x .2s ease-in-out 0s 2',
        'slide-in-up': 'slideInUp 0.5s ease-out'
      },
      gridTemplateColumns: {
        36: 'repeat(36, minmax(0, 1fr))'
      },
      gridColumn: {
        'span-14': 'span 14 / span 14'
      },
      height: {
        'full-offcanvas': '91%'
      },
      scale: {
        115: '1.15'
      }
    }
  }
}
