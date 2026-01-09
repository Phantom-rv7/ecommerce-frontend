import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  // Remove or comment out base for local dev
  // base: '/ecommerce-frontend/',
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
})
