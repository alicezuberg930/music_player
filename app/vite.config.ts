import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, type UserConfig } from "vite"
import viteCompression from 'vite-plugin-compression'
import ViteSitemap from 'vite-plugin-sitemap';

// https://vite.dev/config/
export default defineConfig(async ({ mode }): Promise<UserConfig> => {
  const hostname = mode === 'production' ? 'https://tien-music-player.site' : 'http://localhost:5173'
  // const apiUrl = mode === 'production' ? 'https://api.tien-music-player.site' : 'http://localhost:5000'

  // Fetch dynamic routes from API
  let dynamicRoutes: string[] = []
  try {
    const response = await fetch(`${'http://localhost:5000'}/sitemap.xml`)
    const sitemapData = await response.json() as { loc: string }[]
    dynamicRoutes = sitemapData.map(entry => {
      // Extract path from full URL (remove hostname)
      const url = new URL(entry.loc)
      return url.pathname
    })
  } catch (error) {
    console.warn('Failed to fetch sitemap from API:', error)
  }

  return {
    plugins: [
      react(), tailwindcss(),
      viteCompression({
        algorithm: 'gzip',
        threshold: 7168, // Only compress files larger than 7KB
        deleteOriginFile: false,
      }),
      ViteSitemap({
        hostname,
        dynamicRoutes,
        generateRobotsTxt: true,
        robots: [
          {
            disallow: ['/profile', '/verify/*', '/reset-password/*'],
            userAgent: '*',
            allow: '*',
          },
        ],
      })
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
      chunkSizeWarningLimit: 500,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: false,
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
  }
})