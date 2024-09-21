import { defineConfig } from 'vite';
import ViteYaml from '@modyfi/vite-plugin-yaml';

// https://vitejs.dev/config
export default defineConfig({
  base: '/data-visualization/',
  plugins: [ViteYaml()],
  resolve: { alias: { '@': '/src', '!': '/__mocks__' } },
  // https://vitest.dev/config
  test: {
    globals: true,
    restoreMocks: true,
    environment: 'happy-dom',
    include: ['__tests__/**/*.{test,spec}.{ts,tsx}'],
    coverage: { all: true, include: ['src/utils/*.{ts,tsx}'] }
  }
});