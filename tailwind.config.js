/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#8B5CF6',
          indigo: '#6366F1',
          blue: '#3B82F6',
          cyan: '#06B6D4',
          emerald: '#10B981',
          pink: '#EC4899',
          orange: '#F97316',
          amber: '#F59E0B',
        }
      },
      animation: {
        'pop': 'pop 0.18s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'shake': 'shake 0.4s ease-in-out',
        'pulse-subtle': 'pulseSubtle 2s infinite ease-in-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(0.85)' },
          '100%': { transform: 'scale(1)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-5px)' },
          '40%, 80%': { transform: 'translateX(5px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(139, 92, 246, 0.4)' },
          '100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.8)' },
        }
      }
    },
  },
  plugins: [],
}

