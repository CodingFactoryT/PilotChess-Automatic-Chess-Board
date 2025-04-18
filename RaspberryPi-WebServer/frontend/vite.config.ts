import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import config from '../config.js'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: config.base_url_without_protocol,
    port: config.vite_port,
    proxy: config.env === "dev" ? {
      "/api": `${config.base_url}:${config.node_port}` // Proxy API calls to Express
    } : undefined,
    open: "/"
  },
})
