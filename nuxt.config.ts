// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@element-plus/nuxt",
    "@pinia/nuxt",
    "nuxtjs-naive-ui",
  ],
  pinia: {
    storesDirs: ["./stores"],
  },
  css: ["~/assets/css/index.css"],
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
  },
});
