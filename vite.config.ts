import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
	css: {
		devSourcemap: true,
	},
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
		host: true, // équivalent à --host 0.0.0.0 => Vite affiche l'URL "Network"
		port: 5173, // optionnel (mais pratique pour un port stable)
		strictPort: true, // optionnel : évite que Vite change de port sans prévenir
	},
})
