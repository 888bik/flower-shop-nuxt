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
      siteName: "花语商城",
      defaultImage: "/flower-shop.svg",
      defaultDescription: "全国鲜花速递，当天送达，送花就上花语商城。",
    },
  },
  // 添加 nitro 配置
  nitro: {
    devProxy: {
      "/api": {
        target: "http://8.148.226.68:11048",
        changeOrigin: true,
      },
    },
    routeRules: {
      // 生产环境代理配置
      "/api/**": {
        proxy: "http://8.148.226.68:11048/api/**",
      },
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

  app: {
    head: {
      htmlAttrs: {
        lang: "zh-CN",
      },
      meta: [
        {
          name: "description",
          content: "全国鲜花速递，当天送达，送花就上花语商城。",
        },
        { name: "keywords", content: "鲜花,鲜花速递,送花,花语商城" },
      ],
      link: [{ rel: "icon", type: "image/svg+xml", href: "/flower-shop.svg" }],
    },
  },
});
