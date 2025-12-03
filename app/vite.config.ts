import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import ViteSitemap from 'vite-plugin-sitemap';
import { createHtmlPlugin } from 'vite-plugin-html';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), tailwindcss(),
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
          react: ['react', 'react-dom', 'react-router-dom'],
        },
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