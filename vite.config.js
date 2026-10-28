import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, import.meta.dirname)
  // The API origin used only for this dev server proxy; the browser never sees it.
  const apiTarget = env.VITE_DEV_API_TARGET || 'http://localhost:3000'

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        // Keeps sign-in same-origin in development, so the httpOnly session cookie needs no
        // cross-origin attributes. Set VITE_API_BASE_URL to an absolute URL instead when the API is
        // deployed on its own host.
        '/api': { target: apiTarget, changeOrigin: true },
      },
    },
  }
})
