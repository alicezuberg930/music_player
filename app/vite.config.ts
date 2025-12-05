import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import viteCompression from 'vite-plugin-compression'
import ViteSitemap from 'vite-plugin-sitemap';
import { createHtmlPlugin } from 'vite-plugin-html';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), tailwindcss(),
    viteCompression({
      algorithm: 'gzip',
      threshold: 10240, // Only compress files larger than 10KB
      deleteOriginFile: false,
    }),
    ViteSitemap({
      // hostname: 'https://aismartlite.cloud',
      generateRobotsTxt: true,
      dynamicRoutes: [
        '/',
        '/search',
        '/search/all',
        '/search/songs',
        '/search/playlists',
        '/search/artists',
        '/search/mv',
        '/chart',
        '/chart/week',
      ],
      robots: [
        { disallow: ['/profile'], userAgent: '*', allow: ['/', '/search/all', '/search/songs', '/search/playlists', '/search/artists', '/search/mv', '/chart', '/chart/week'] },
      ],
      exclude: ['/profile', '/login'],
    }),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          title: 'Default Title',
          description: 'Default Description',
        },
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        minifyInternalExports: true,
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'radix-ui-vendor': ['@radix-ui/react-slot', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          'redux-vendor': ['@reduxjs/toolkit', 'react-redux', 'redux-persist'],
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    chunkSizeWarningLimit: 500, // Warn if chunk exceeds 500KB
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Remove console.log in production
        drop_debugger: true,
      },
    },
  },
  server: {
    host: true, // Listen on 0.0.0.0
    allowedHosts: true, // allow any host
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})