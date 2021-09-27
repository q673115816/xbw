import { defineConfig } from "vite";
import { VitePWA as pwa } from "vite-plugin-pwa";
import manifest from "./manifest.json";
import vue from "@vitejs/plugin-vue";
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  plugins: [
    vue(),
    pwa({
      strategies: "injectManifest",
      srcDir: "",
      filename: "service-worker.js",
      manifest,
    }),
  ],
});
