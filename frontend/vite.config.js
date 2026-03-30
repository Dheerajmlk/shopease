import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Dev only: proxy /api → local backend. Never affects production build.
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    // Suppress source map warnings from third-party libs (Razorpay etc.)
    sourcemap: false,
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress preload/module warnings from external scripts
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
        warn(warning);
      },
    },
  },
})
