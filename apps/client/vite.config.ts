import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: __dirname,
  envDir: '../../',
  build: {
    outDir: '../../dist/apps/client',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
  resolve: {
    alias: {
      '@profilehub/data-access': path.resolve(
        __dirname,
        '../../libs/shared/data-access/src/index.ts',
      ),
      '@profilehub/types': path.resolve(
        __dirname,
        '../../libs/shared/types/types.ts',
      ),
      '@profilehub/ui': path.resolve(
        __dirname,
        '../../libs/shared/ui/src/index.ts',
      ),
    },
  },
});
