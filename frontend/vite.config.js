import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  build: {
    // Increase warning threshold to 900KB
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        // Manual chunk splitting for optimal caching & minimal main bundle weight
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('lucide-react')) {
              return 'lucide-vendor';
            }
            if (id.includes('framer-motion')) {
              return 'motion-vendor';
            }
            if (id.includes('jspdf') || id.includes('html2canvas')) {
              return 'pdf-vendor';
            }
            if (id.includes('lenis')) {
              return 'lenis-vendor';
            }
          }
        },
      },
    },
    // Production minification
    minify: 'esbuild',
    target: 'es2020',
    cssCodeSplit: true,
  },

  // Ensure environment variables prefixed with VITE_ are available
  envPrefix: 'VITE_',

  // Optimize dependencies pre-bundling
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react', 'framer-motion'],
  },
});
