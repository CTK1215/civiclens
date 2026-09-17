import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// In development, requests to /api are forwarded to the Express API with /api stripped off,
// so the React code calls /api/issues the same way it will in production.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
