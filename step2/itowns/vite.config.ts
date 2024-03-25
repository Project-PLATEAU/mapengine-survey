import { defineConfig } from 'vite'

export default defineConfig({
  base: '/step2/itowns',
  resolve: {
    alias: {
      './runtimeConfig': './runtimeConfig.browser',
    },
  },
  define: {
    'window.global': {},
  },
})