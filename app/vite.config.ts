import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, type UserConfig } from "vite"
import ViteSitemap from 'vite-plugin-sitemap';

// https://vite.dev/config/
export default defineConfig(async ({ mode }): Promise<UserConfig> => {
  const hostname = mode === 'production' ? 'https://tien-music-player.site' : 'http://localhost:5173'

  // Fetch dynamic routes from API sitemap
  let dynamicRoutes: string[] = []
  try {
    const response = await fetch('http://localhost:5000/sitemap-urls')
    const data = await response.json() as { data: string[] }
    for (const url of data.data) {
      dynamicRoutes.push(url)
    }
  } catch (error) {
    console.warn('Failed to fetch sitemap from API:', error)
  }

  return {
    plugins: [
      react(), tailwindcss(),
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
            'react-chunk': ['react', 'react-dom', 'react-router-dom'],
            'radix-ui-chunk': ['@radix-ui/react-tooltip', '@radix-ui/react-tabs', '@radix-ui/react-switch', '@radix-ui/react-avatar', '@radix-ui/react-slot', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-label', '@radix-ui/react-popover', '@radix-ui/react-scroll-area', '@radix-ui/react-select', '@radix-ui/react-separator'],
            'redux-chunk': ['@reduxjs/toolkit', 'react-redux', 'redux-persist', 'redux-thunk'],
            'i18next-chunk': ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
            'mix-chunk': ['axios', 'class-variance-authority', 'clsx', 'cmdk', 'dayjs', 'framer-motion', 'hls.js', 'idb', 'notistack', 'lucide-react']
          },
          chunkFileNames: 'chunks/[name]-[hash].js',
          entryFileNames: 'entries/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
      },
      chunkSizeWarningLimit: 500,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug'],
          passes: 2,
        },
        mangle: {
          safari10: true,
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