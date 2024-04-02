import { defineConfig } from 'vite';
import ViteYaml from '@modyfi/vite-plugin-yaml';

// https://vitejs.dev/config
export default defineConfig({
  base: '/data-visualization/',
  resolve: { alias: { '@': '/src' } },
  plugins: [ViteYaml()]
});