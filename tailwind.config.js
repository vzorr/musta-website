/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        tablet: '850px', 
        mobile: '640px', 
        small:'440px',
        extraSmall:'400px'

      },
      colors: {
        'myusta-navy': '#00203F',
        'myusta-blue': '#335372',
        'myusta-yellow': '#FFC800',
        'myusta-gray': '#F3F3F3',
        'myusta-text-gray': '#888888',
        'light-gray-text': '#868686',
        'myusta-green': '#59BE34'
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif']
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          from: {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
    },
  },
  plugins: [],
}