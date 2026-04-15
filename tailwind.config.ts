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
        primary: '#94afe6',
        'primary-dark': '#7a97d4',
        secondary: '#617291',
        dark: '#3b443d',
        danger: '#902f3e',
        'danger-dark': '#7a2835',
        rose: '#cc737e',
        background: '#f7f6f4',
        surface: '#ffffff',
        border: '#e8e4df',
        muted: '#9a9590',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(59,68,61,0.06), 0 4px 16px rgba(59,68,61,0.04)',
        'card-hover': '0 4px 12px rgba(59,68,61,0.10), 0 12px 32px rgba(59,68,61,0.08)',
        modal: '0 24px 64px rgba(59,68,61,0.18)',
        toast: '0 8px 24px rgba(59,68,61,0.14)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.25, 0.1, 0.25, 1)',
        shimmer: 'shimmer 1.6s infinite linear',
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
        shimmer: {
          '0%': { backgroundPosition: '-600px 0' },
          '100%': { backgroundPosition: '600px 0' },
        },
      },
    },
  },
  plugins: [],
}

export default config
