/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,html}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#FEC400',
          dark: '#E5B100',
          light: '#FFF4CC',
        },
        ink: {
          DEFAULT: '#1A1A1A',
          soft: '#4A4A4A',
          faint: '#8A8A8A',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F6F6F8',
          border: '#ECECEE',
        },
        success: '#2ECC71',
        warning: '#FF9500',
        danger: '#FF3B30',
      },
      borderRadius: {
        xl: '1.25rem',
        '2xl': '1.75rem',
      },
      boxShadow: {
        card: '0 8px 24px rgba(20, 20, 30, 0.06)',
        sheet: '0 -8px 30px rgba(20, 20, 30, 0.12)',
      },
    },
  },
  plugins: [],
};
