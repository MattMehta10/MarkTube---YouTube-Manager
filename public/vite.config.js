import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      events: 'events' // 👈 tell Vite to use npm's `events`
    }
  },
  build: {
    rollupOptions: {
      // ✨ Multiple entry points
      input: {
        // This is your React sidebar
        main: 'src/main.jsx',
        
        // This is your feed-marking script
        // content: 'src/content/content.js'
      },
      output: {
        entryFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    },
    outDir: 'dist'
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env': {}
  }
});
