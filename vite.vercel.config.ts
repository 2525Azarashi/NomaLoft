import { defineConfig } from 'vite'

export default defineConfig({
  publicDir: false,
  build: {
    outDir: 'api',
    emptyOutDir: true,
    ssr: 'src/vercel-entry.ts',
    minify: true,
    rollupOptions: {
      output: {
        format: 'es',
        entryFileNames: 'index.js'
      }
    }
  },
  ssr: {
    noExternal: true,
    target: 'webworker'
  }
})
