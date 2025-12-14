// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@element-plus/nuxt",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "nuxtjs-naive-ui",
  ],
  pinia: {
    storesDirs: ["./stores"],
  },
  css: [
    "~/assets/css/index.css",
    "vuetify/styles",
    "@mdi/font/css/materialdesignicons.css",
  ],
  build: {
    transpile: ["vuetify"],
  },
  runtimeConfig: {
    public: {
      apiBase: "/api",
      timeout: 20000,
    },
  },
  vite: {
    server: {
      proxy: {
        "/api": {
          target: "http://127.0.0.1:11048",
          // target: "http://8.148.226.68:11048",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    plugins: [vuetify({ autoImport: true })],
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
});
