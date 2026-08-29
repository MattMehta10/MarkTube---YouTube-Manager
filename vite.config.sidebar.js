import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

// Builds the React sidebar app, loaded inside an iframe by src/content/sidebarInject.js.
// IMPORTANT: entryFileNames/assetFileNames here must exactly match what
// sidebarInject.js requests via chrome.runtime.getURL(...) and what
// manifest.json lists in web_accessible_resources. Never rename the
// output file by hand — change it here instead.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      events: 'events',
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        sidebar: resolve(__dirname, 'src/sidebar/main.jsx'),
      },
      output: {
        format: 'iife',
        entryFileNames: 'assets/sidebar.js',   // must match manifest.json + sidebarInject.js
        assetFileNames: 'assets/sidebar.[ext]', // sidebar.css lands here
        inlineDynamicImports: true,
      },
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env': {},
    'global': 'globalThis',
  },
});
