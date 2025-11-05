import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // 👈 @ points to /src
      '..': path.resolve(__dirname, './src'), // 👈 optional — if you also want .. to behave like src
    },
  },
})
