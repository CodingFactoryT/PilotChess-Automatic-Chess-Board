import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import config from '../config.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: config.vite_port,
    proxy: {
      "/api": config.env === "prod" ? `http://pilotchess.local:${config.node_port}`: `http://localhost:${config.node_port}`, // Proxy API calls to Express
    },
    open: "index.html"
  },
})
