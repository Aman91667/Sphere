import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, './src') },
      { find: '..', replacement: path.resolve(__dirname, './src') },

      // rewrite lucide-react/src/* -> node_modules/lucide-react/dist/esm/*
      {
        find: /^lucide-react\/src\/(.*)$/,
        replacement: path.resolve(__dirname, 'node_modules/lucide-react/dist/esm') + '/$1'
      }
    ]
  },
  ssr: {
    // ensure lucide-react is bundled in SSR builds so Vite doesn't treat it as external
    noExternal: ['lucide-react']
  },
  optimizeDeps: {
    include: ['lucide-react']
  }
});
