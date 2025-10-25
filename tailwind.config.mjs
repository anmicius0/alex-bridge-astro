// tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography'; // Keep this import

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brutalPink: '#F396E5',
        brutalBlue: '#96C7F2',
        brutalYellow: '#F2CF96',
        brutalGreen: '#ADF296',
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
