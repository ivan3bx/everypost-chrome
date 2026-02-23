/// <reference types="vitest" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import webExtension from 'vite-plugin-web-extension'
import { readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => ({
  plugins: [
    vue(),
    webExtension({
      manifest: () => JSON.parse(readFileSync('manifest.json', 'utf-8')),
      additionalInputs: ['src/entry/logged_in.html'],
      watchFilePaths: ['manifest.json'],
      // Add localhost host permission in dev mode for easier testing
      transformManifest: (manifest) => {
        if (mode === 'development') {
          manifest.host_permissions = [
            ...manifest.host_permissions,
            'http://localhost:3000/*',
          ]
        }
        return manifest
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  define: {
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
  },
  build: {
    sourcemap: mode === 'development',
    outDir: 'dist',
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
}))
