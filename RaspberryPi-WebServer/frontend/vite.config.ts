import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import config from '../shared/config.js'
import * as path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: config.vite_port,
    proxy: config.env === "dev" ? {
      "/api": `${config.base_url}:${config.node_port}` // Proxy API calls to Express
    } : undefined,
    open: "/"
  },
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "./src"),
      "@shared": path.resolve(__dirname, "../shared"),
      "@mainRoot": path.resolve(__dirname, "..")
    }
  }
})
