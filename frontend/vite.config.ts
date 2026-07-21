import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '^/v1/tasks/': {
        target: 'http://localhost:3002',
        changeOrigin: true,
      },
      '^/v1/reports/': {
        target: 'http://localhost:3008',
        changeOrigin: true,
      },
      '^/v1/notifications/': {
        target: 'http://localhost:3007',
        changeOrigin: true,
      },
      '^/v1/media/': {
        target: 'http://localhost:3006',
        changeOrigin: true,
      },
      '^/v1/categories/': {
        target: 'http://localhost:3005',
        changeOrigin: true,
      },
      
      '^/v1/(auth|users|roles)': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    }
    
  },

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
  },
})