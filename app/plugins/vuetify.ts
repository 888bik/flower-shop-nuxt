import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "vuetify/styles";
import { mdi } from "vuetify/iconsets/mdi-svg";

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    icons: {
      defaultSet: "mdi",
    },
    theme: {
      defaultTheme: "blackGold",
      themes: {
        blackGold: {
          dark: true,
          colors: {
            background: "#0b0b0b",
            surface: "#1c1c1c",
            primary: "#d4af37", // 金色
            secondary: "#3a3a3a",
            accent: "#f5d76e",
            error: "#ff5252",
            info: "#2196f3",
            success: "#4caf50",
            warning: "#ff9800",

            // 可选：文本
            "on-background": "#ffffff",
            "on-surface": "#ffffff",
          },
        },
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
