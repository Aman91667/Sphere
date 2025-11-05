import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // your existing aliases
      '@': path.resolve(__dirname, './src'), // @ -> /src
      '..': path.resolve(__dirname, './src'),

      // Force any import that points to the package's `src/createLucideIcon` to use the compiled ESM file
      // (some lucide-react releases reference the unbuilt `src/*` paths internally)
      'lucide-react/src/createLucideIcon': path.resolve(
        __dirname,
        'node_modules/lucide-react/dist/esm/createLucideIcon.js'
      ),
      // safe extra mapping (sometimes paths differ)
      'lucide-react/dist/esm/createLucideIcon.js': path.resolve(
        __dirname,
        'node_modules/lucide-react/dist/esm/createLucideIcon.js'
      )
    },
  },

  // Important for Vercel/SSR builds: bundle lucide-react instead of treating it as external
  ssr: {
    noExternal: ['lucide-react'],
  },

  // Ensure Vite pre-bundles lucide-react for dev (helps avoid weird resolution)
  optimizeDeps: {
    include: ['lucide-react'],
  },
});
