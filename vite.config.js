import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "localhost",
    port: 8080,
    // 请求代理
    proxy: {
      "/api": {
        target: "http://127.0.0.1:3000",
      },
    },
  },
  plugins: [vue()],
})
