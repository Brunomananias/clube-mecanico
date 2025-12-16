import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Permitir o host do ngrok
    allowedHosts: true,
    
    host: true, // Importante para ngrok
    port: 5173,
    
    // Configurações adicionais
    cors: true,
    hmr: {
      clientPort: 443, // Importante para ngrok HTTPS
    }
  }
})