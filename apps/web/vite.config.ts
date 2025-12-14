import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type UserConfig, loadEnv } from 'vite'
import ViteSitemap from 'vite-plugin-sitemap'

// https://vite.dev/config/
export default defineConfig(async ({ mode }): Promise<UserConfig> => {
  // Load env from root folder
  loadEnv(mode, path.resolve(__dirname, '../../'), '')
  const hostname = mode === 'production' ? 'https://tien-music-player.site' : 'http://localhost:5173'

  // Fetch dynamic routes from API sitemap
  let dynamicRoutes: string[] = []
  try {
    const response = await fetch('https://api.tien-music-player.site/sitemap-urls')
    const data = await response.json() as { data: string[] }
    for (const url of data.data) {
      dynamicRoutes.push(url)
    }
  } catch (error) {
    console.warn('Failed to fetch sitemap from API:', error)
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
            'react-query-chunk': ['@tanstack/react-query', '@tanstack/react-query-persist-client'],
            'react-chunk': ['react', 'react-dom', 'react-router-dom'],
            'react-day-picker-chunk': ['react-day-picker'],
            'react-dropzone-chunk': ['react-dropzone'],
            'react-loader-spinner-chunk': ['react-loader-spinner'],
            'react-lrc-chunk': ['react-lrc'],
            'redux-chunk': ['@reduxjs/toolkit', 'react-redux', 'redux-persist', 'redux-thunk'],
            'i18next-chunk': ['i18next', 'react-i18next'],
            'form-chunk': ['yup', '@hookform/resolvers', 'react-hook-form'],
            'idb-chunk': ['idb'],
            'axios-chunk': ['axios'],
            'dayjs-chunk': ['dayjs'],
            'notistack-chunk': ['notistack'],
            // 'hls-chunk': ['hls.js'],
            'framer-motion-chunk': ['framer-motion'],
            'yukikaze-ui-chunk': ['@yukikaze/ui']
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
          pure_funcs: ['console.log', 'console.info', 'console.debug'],
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