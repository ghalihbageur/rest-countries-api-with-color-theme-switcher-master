import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "https://ghalihbageur.github.io/rest-countries-api-with-color-theme-switcher-master/",
})
