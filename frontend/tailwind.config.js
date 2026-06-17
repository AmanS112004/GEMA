/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4A6444', // Dark Cedar Green
          dark: '#3D5237',
          light: '#5B7B54',
        },
        secondary: {
          DEFAULT: '#F5E5B1', // Smooth Silk
          dark: '#EBD99E',
          light: '#F8EDC5',
        },
        background: '#F5F1E8', // Wishful White
        dark: {
          DEFAULT: '#2C3E28', // Dark Forest/Green-Gray for text
          muted: '#60735C',
        },
        accent: {
          DEFAULT: '#D96A53', // Warm Terracotta
          light: '#E28673',
        }
      },
      borderRadius: {
        'premium': '24px',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'Sora', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 10px 30px -10px rgba(74, 100, 68, 0.15)',
        'premium-hover': '0 20px 40px -15px rgba(74, 100, 68, 0.25)',
      }
    },
  },
  plugins: [],
}
