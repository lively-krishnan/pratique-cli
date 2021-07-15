import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "com": path.resolve(__dirname, "src/components"),
      "styles": path.resolve(__dirname, "src/styles"),
      "plugins": path.resolve(__dirname, "src/plugins"),
      "views": path.resolve(__dirname, "src/views"),
      "layout": path.resolve(__dirname, "src/layout"),
      "utils": path.resolve(__dirname, "src/utils"),
      "config": path.resolve(__dirname, "src/config"),
      "api": path.resolve(__dirname, "src/api")
    }
  },
  plugins: [vue()]
})
