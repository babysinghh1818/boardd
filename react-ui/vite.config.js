import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4172,
    host: true
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})