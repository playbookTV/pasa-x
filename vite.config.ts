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
        // Chrome extension entry points
        popup: resolve(__dirname, 'public/popup.html'),
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'assets/popup.css';
          }
          return 'assets/[name].[ext]';
        },
      },
      // Mark Prisma as external to avoid bundling issues
      external: ['.prisma/client/index-browser']
    },
    // Use relative paths for assets to work in Chrome extension
    assetsDir: 'assets',
    cssCodeSplit: false,
    minify: true,
    sourcemap: false,
    // Don't use absolute paths in generated files
    base: './'
  },
  server: {
    port: 3000,
  },
});
