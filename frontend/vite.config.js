import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget = (env.VITE_API_TARGET || env.VITE_API_URL || '').replace(/\/api\/?$/, '')

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        react: fileURLToPath(new URL('./node_modules/react', import.meta.url)),
        'react-dom': fileURLToPath(new URL('./node_modules/react-dom', import.meta.url)),
        'react-toastify': fileURLToPath(new URL('./node_modules/react-toastify', import.meta.url)),
        'lucide-react': fileURLToPath(new URL('./node_modules/lucide-react', import.meta.url)),
      },
      dedupe: ['react', 'react-dom'],
    },
    build: {
      target: 'esnext',
      cssCodeSplit: true,
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react-dom') || id.includes('react/')) {
                return 'vendor-react';
              }
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
              if (id.includes('react-toastify')) {
                return 'vendor-toast';
              }
            }
          },
        },
      },
    },
    server: {
      host: true,
      port: 5173,
      ...(proxyTarget ? {
        proxy: {
          '/api': {
            target: proxyTarget,
            changeOrigin: true,
            secure: false,
          },
        },
      } : {}),
    },
  }
})
