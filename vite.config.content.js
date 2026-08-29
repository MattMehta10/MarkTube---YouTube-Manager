import { defineConfig } from 'vite';
import { resolve } from 'path';

// Builds the content script that runs on youtube.com.
export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    global: 'globalThis',
  },
  build: {
    sourcemap: true,
    outDir: 'dist',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        content: resolve(__dirname, 'src/content/index.js'),
      },
      output: {
        format: 'iife', // required for Chrome content scripts
        entryFileNames: 'assets/content.js', // must match manifest.json exactly
        assetFileNames: 'assets/[name].[ext]',
        inlineDynamicImports: true,
      },
    },
  },
});
