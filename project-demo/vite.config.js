import { defineConfig } from 'vite'
import path from "path";
import vue from '@vitejs/plugin-vue'

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
      "api": path.resolve(__dirname, "src/api")
    }
  },
  plugins: [vue()],
  // 在开发服务器启动时自动在浏览器中打开应用程序
  server: {
    open: '/docs/index.html'
  }
})
