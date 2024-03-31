import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
  base: '/data-visualization/',
  resolve: { alias: { '@': '/src' } }
});