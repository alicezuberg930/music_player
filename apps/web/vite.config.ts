import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type UserConfig, loadEnv } from 'vite'
import ViteSitemap from 'vite-plugin-sitemap'

// https://vite.dev/config/
export default defineConfig(async ({ mode }): Promise<UserConfig> => {
  // Load env from root folder
  const env = loadEnv(mode, path.resolve(__dirname, '../../'), '')
  const viteEnv = env.VITE_ENV || mode
  const hostname = env.WEB_URL

  // Fetch static & dynamic routes from backend API
  const dynamicRoutes: string[] = []
  if (viteEnv === 'production') {
    try {
      const response = await fetch(`${env.VITE_API_URL}/api/v1/home/sitemap-urls`)
      const data = await response.json() as { data: string[] }
      dynamicRoutes.push(...data.data)
    } catch (error) {
      console.warn('Failed to fetch sitemap from API:', error)
    }
  }

  return {
    plugins: [
      react(),
      tailwindcss(),
      ViteSitemap({
        hostname,
        dynamicRoutes,
        generateRobotsTxt: true,
        robots: [
          {
            disallow: ['/profile', '/verify/*', '/reset-password/*', '/me/*'],
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
            'react-query-chunk': ['@tanstack/react-query', '@tanstack/react-query-persist-client'],
            'react-chunk': ['react', 'react-dom'],
            'react-dropzone-chunk': ['react-dropzone'],
            'react-lrc-chunk': ['react-lrc'],
            'redux-chunk': ['@reduxjs/toolkit', 'react-redux', 'redux-persist', 'redux-thunk'],
            'i18next-chunk': ['i18next', 'react-i18next'],
            'form-chunk': ['zod', '@hookform/resolvers', 'react-hook-form'],
            'idb-chunk': ['idb'],
            'dayjs-chunk': ['dayjs'],
            // 'hls-chunk': ['hls.js'],
            'chart': ['recharts'],
            ['dnd']: ['@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'],
            'framer-motion-chunk': ['framer-motion'],
          },
          chunkFileNames: 'chunks/[name]-[hash].js',
          entryFileNames: 'entries/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
        treeshake: {
          moduleSideEffects: 'no-external',
          propertyReadSideEffects: false,
          tryCatchDeoptimization: false,
        },
      },
      chunkSizeWarningLimit: 500,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          // pure_funcs: ['console.log', 'console.info', 'console.debug'],
          passes: 2,
          unsafe_arrows: true,
          unsafe_methods: true,
          unsafe_proto: true,
        },
        mangle: {
          safari10: true,
        },
        format: {
          comments: false,
        },
      },
    },
    server: {
      host: true, // Listen on 0.0.0.0
      allowedHosts: true, // allow any host
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    envDir: path.resolve(__dirname, '../../'),
    envPrefix: 'VITE_',
  }
})
