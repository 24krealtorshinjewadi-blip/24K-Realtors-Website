import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  build: {
    // Increase warning threshold to 800KB to avoid noise; actual splitting handles it
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        // Manual chunk splitting for optimal loading performance
        manualChunks: {
          // React core — cached long-term
          'react-vendor': ['react', 'react-dom'],
          // Icon library (heavy) — separate chunk
          'lucide': ['lucide-react'],
          // Heavy vendor libraries split out for optimal cache & bundle weight
          'gemini-vendor': ['@google/generative-ai'],
          'motion-vendor': ['framer-motion'],
          'lenis-vendor': ['lenis'],
        },
      },
    },
    // Enable source maps for production debugging
    sourcemap: false,
    // Minify with esbuild (default, fastest)
    minify: 'esbuild',
    // Target modern browsers
    target: 'es2020',
  },

  // Ensure environment variables prefixed with VITE_ are available
  envPrefix: 'VITE_',

  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react'],
  },
});
