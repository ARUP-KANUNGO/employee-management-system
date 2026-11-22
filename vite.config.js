import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { apiServerPlugin } from './apiServerPlugin.js'

export default defineConfig({
  plugins: [react(), apiServerPlugin()],
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  optimizeDeps: {
    exclude: ['mongodb-memory-server'],
  },
})
