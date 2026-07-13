// vite.config.js
import { defineConfig } from "file:///F:/24K%20Real%20Estate%20JAVA/frontend/node_modules/vite/dist/node/index.js";
import react from "file:///F:/24K%20Real%20Estate%20JAVA/frontend/node_modules/@vitejs/plugin-react/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [react()],
  build: {
    // Increase warning threshold to 800KB to avoid noise; actual splitting handles it
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        // Manual chunk splitting for optimal loading performance
        manualChunks: {
          // React core — cached long-term
          "react-vendor": ["react", "react-dom"],
          // Icon library (heavy) — separate chunk
          "lucide": ["lucide-react"]
        }
      }
    },
    // Enable source maps for production debugging
    sourcemap: false,
    // Minify with esbuild (default, fastest)
    minify: "esbuild",
    // Target modern browsers
    target: "es2020"
  },
  // Ensure environment variables prefixed with VITE_ are available
  envPrefix: "VITE_",
  // Optimize dependencies
  optimizeDeps: {
    include: ["react", "react-dom", "lucide-react"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJGOlxcXFwyNEsgUmVhbCBFc3RhdGUgSkFWQVxcXFxmcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRjpcXFxcMjRLIFJlYWwgRXN0YXRlIEpBVkFcXFxcZnJvbnRlbmRcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Y6LzI0SyUyMFJlYWwlMjBFc3RhdGUlMjBKQVZBL2Zyb250ZW5kL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuXG4vLyBodHRwczovL3ZpdGUuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtyZWFjdCgpXSxcblxuICBidWlsZDoge1xuICAgIC8vIEluY3JlYXNlIHdhcm5pbmcgdGhyZXNob2xkIHRvIDgwMEtCIHRvIGF2b2lkIG5vaXNlOyBhY3R1YWwgc3BsaXR0aW5nIGhhbmRsZXMgaXRcbiAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDgwMCxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgLy8gTWFudWFsIGNodW5rIHNwbGl0dGluZyBmb3Igb3B0aW1hbCBsb2FkaW5nIHBlcmZvcm1hbmNlXG4gICAgICAgIG1hbnVhbENodW5rczoge1xuICAgICAgICAgIC8vIFJlYWN0IGNvcmUgXHUyMDE0IGNhY2hlZCBsb25nLXRlcm1cbiAgICAgICAgICAncmVhY3QtdmVuZG9yJzogWydyZWFjdCcsICdyZWFjdC1kb20nXSxcbiAgICAgICAgICAvLyBJY29uIGxpYnJhcnkgKGhlYXZ5KSBcdTIwMTQgc2VwYXJhdGUgY2h1bmtcbiAgICAgICAgICAnbHVjaWRlJzogWydsdWNpZGUtcmVhY3QnXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICAvLyBFbmFibGUgc291cmNlIG1hcHMgZm9yIHByb2R1Y3Rpb24gZGVidWdnaW5nXG4gICAgc291cmNlbWFwOiBmYWxzZSxcbiAgICAvLyBNaW5pZnkgd2l0aCBlc2J1aWxkIChkZWZhdWx0LCBmYXN0ZXN0KVxuICAgIG1pbmlmeTogJ2VzYnVpbGQnLFxuICAgIC8vIFRhcmdldCBtb2Rlcm4gYnJvd3NlcnNcbiAgICB0YXJnZXQ6ICdlczIwMjAnLFxuICB9LFxuXG4gIC8vIEVuc3VyZSBlbnZpcm9ubWVudCB2YXJpYWJsZXMgcHJlZml4ZWQgd2l0aCBWSVRFXyBhcmUgYXZhaWxhYmxlXG4gIGVudlByZWZpeDogJ1ZJVEVfJyxcblxuICAvLyBPcHRpbWl6ZSBkZXBlbmRlbmNpZXNcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgaW5jbHVkZTogWydyZWFjdCcsICdyZWFjdC1kb20nLCAnbHVjaWRlLXJlYWN0J10sXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBOFIsU0FBUyxvQkFBb0I7QUFDM1QsT0FBTyxXQUFXO0FBR2xCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxFQUVqQixPQUFPO0FBQUE7QUFBQSxJQUVMLHVCQUF1QjtBQUFBLElBQ3ZCLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQTtBQUFBLFFBRU4sY0FBYztBQUFBO0FBQUEsVUFFWixnQkFBZ0IsQ0FBQyxTQUFTLFdBQVc7QUFBQTtBQUFBLFVBRXJDLFVBQVUsQ0FBQyxjQUFjO0FBQUEsUUFDM0I7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBO0FBQUEsSUFFQSxXQUFXO0FBQUE7QUFBQSxJQUVYLFFBQVE7QUFBQTtBQUFBLElBRVIsUUFBUTtBQUFBLEVBQ1Y7QUFBQTtBQUFBLEVBR0EsV0FBVztBQUFBO0FBQUEsRUFHWCxjQUFjO0FBQUEsSUFDWixTQUFTLENBQUMsU0FBUyxhQUFhLGNBQWM7QUFBQSxFQUNoRDtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
