/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html"
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--background)',
        bgl: 'var(--light-green)',
        bgd: 'var(--background-dark)',
        textcl: 'var(--text-color)',
        textclh: 'var(--text-highlight)',
        qr: 'var(--soft-red)',
        qy: 'var(--soft-yellow)',
        white: '#ffffff',
        ta: 'var(--text-alt)',
        clg: 'var(--constant-lg)'
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif']
      },
      width: {
        '128': '32rem',
        '160': '40rem',
        '200': '50rem',
        '256': '64rem',
      },
      height: {
        '128': '32rem',
        '160': '40rem',
        '200': '50rem',
        '256': '64rem',
      }
    },
    
  },
  plugins: [],
}