import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5DA4C9',
        'primary-dark': '#4a8fb5',
        secondary: '#888888',
        dark: '#2C2C2C',
        danger: '#BC2C2C',
        'danger-dark': '#9e2424',
        rose: '#cc737e',
        background: '#F5F1E3',
        surface: '#FFFFFF',
        border: '#C8C2B0',
        muted: '#888888',
        yellow: '#FCD758',
        blue: '#5DA4C9',
      },
      fontFamily: {
        display: ['Montserrat', 'system-ui', 'sans-serif'],
        sans: ['Open Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: 'none',
        'card-hover': 'none',
        modal: '8px 8px 0 #2C2C2C',
        toast: '4px 4px 0 #2C2C2C',
        editorial: '20px 20px 0 #2C2C2C',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.25, 0.1, 0.25, 1)',
        'slide-down': 'slideDown 0.25s cubic-bezier(0.25, 0.1, 0.25, 1)',
        shimmer: 'shimmer 1.6s infinite linear',
        marquee: 'marquee 40s linear infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-600px 0' },
          '100%': { backgroundPosition: '600px 0' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
