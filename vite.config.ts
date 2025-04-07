import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '.prisma/client/index-browser': resolve(__dirname, './node_modules/.prisma/client/index-browser.js')
    }
  },
  css: {
    // Enable PostCSS processing
    postcss: resolve(__dirname, 'postcss.config.mjs')
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        popup: resolve(__dirname, 'popup.html'),
        widget: resolve(__dirname, 'widget.html'),
      },
      output: {
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: '[name].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
      // Mark Prisma as external to avoid bundling issues
      external: ['.prisma/client/index-browser']
    },
    // Use relative paths for assets to work in Chrome extension
    assetsDir: 'assets',
    cssCodeSplit: false,
    minify: true,
    sourcemap: false,
  },
  server: {
    port: 3000,
  },
});
