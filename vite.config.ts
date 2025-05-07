import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // vueDevTools(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  define: {
    global: 'window'
  },
  // 添加服务器配置，使其可在局域网中访问
  server: {
    host: '0.0.0.0', // 监听所有地址
    port: 5173, // 默认端口
    proxy: {
      // 添加代理配置，将API请求代理到实际服务器
      '/api': {
        target: 'http://192.168.10.186:7777', // 将此处替换为A电脑的实际IP地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      // 添加WebSocket代理配置
      '/ws': {
        target: 'ws://192.168.10.186:7777',
        ws: true,
        changeOrigin: true
      }
    }
  }
})
