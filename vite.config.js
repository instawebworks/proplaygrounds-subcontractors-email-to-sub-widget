import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Zoho serves widgets from a nested path inside the plugin sandbox, so all
  // asset URLs must be relative rather than rooted at "/".
  base: './',
  build: {
    outDir: 'app',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    strictPort: true,
    open: false,
  },
})
