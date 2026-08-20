import { defineConfig } from 'vite';
import { resolve } from 'path';

// Builds the content script that runs on youtube.com.
// IMPORTANT: entryFileNames here must exactly match manifest.json's
// content_scripts.js entry. Never rename the output file by hand —
// change it here instead.
export default defineConfig({
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
