// tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography'; // Keep this import

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Brutalist accent colors
        brutalPink: '#f396e5',
        brutalBlue: '#96c7f2',
        brutalYellow: '#f2cf96',
        brutalGreen: '#adf296',

        // Neutral colors for consistency
        white: '#ffffff',
        black: '#000000',
        gray: {
          50: '#f5f5f5',
          100: '#f0f0f0',
          200: '#e8e8e8',
          300: '#e5e5e5',
          400: '#e0e0e0',
          600: '#6b6b6b',
          700: '#555555',
          800: '#333333',
          900: '#111111',
        },

        // Status colors
        red: '#f29696',
        green: '#adf296',
        blue: '#96c7f2',
        yellow: '#f2cf96',
        pink: '#f396e5',
      },
      boxShadow: {
        brutal: '10px 10px 0 #000000',
        brutalSm: '4px 4px 0 #000000',
      },
      borderWidth: { 3: '3px' },
      fontFamily: { display: ['Space Grotesk', 'system-ui', 'sans-serif'] },
      container: { center: true, padding: '1rem' },
    },
  },
  plugins: [typography],
};
