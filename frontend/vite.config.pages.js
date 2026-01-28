import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// GitHub Pages / static hosting build:
// - Output to frontend/dist
// - Use relative base so it works on https://<user>.github.io/<repo>/
export default defineConfig({
  plugins: [react()],
  base: './',
  define: {
    'import.meta.env.VITE_PAGES_PREVIEW': JSON.stringify('true'),
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})

