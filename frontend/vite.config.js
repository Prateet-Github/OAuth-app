// vite.config.js
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173, // fixed port
    strictPort: true, // 🔹 fail if port is taken instead of changing it
    proxy: {
      "/api": "http://localhost:5001"
    }
  }
})