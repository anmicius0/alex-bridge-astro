import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import auth from 'auth-astro';

export default defineConfig({
  output: 'server',
  adapter: vercel({ maxDuration: 10 }),
  integrations: [auth(), react()],
  vite: { plugins: [tailwindcss()] },
});
