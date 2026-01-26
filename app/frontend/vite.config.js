import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: process.env.REACT_DOCKER_PORT || 5173,
    watch: {
      usePolling: true,
    },
    hmr: {
      clientPort: process.env.REACT_LOCAL_PORT || 5173, 
    }
  }
})
