/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#FFF7ED',
          DEFAULT: '#F97316', // Orange
          dark: '#EA580C',
          accent: '#EF4444', // Red
        },
        slate: {
          950: '#020617',
        }
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'premium': '0 20px 50px -12px rgba(0, 0, 0, 0.1)',
        'float': '0 18px 45px -18px rgba(15, 23, 42, 0.28)',
      },
      backgroundImage: {
        'hero-pattern': "radial-gradient(circle at 2px 2px, rgba(249,115,22,0.05) 1px, transparent 0)",
        'brand-gradient': 'linear-gradient(135deg, #F97316 0%, #EF4444 100%)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
