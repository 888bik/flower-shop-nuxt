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
            background: "#fff5f8", //背景
            surface: "#ffffff", //卡片
            primary: "#ff6fa3", // 粉色
            secondary: "#fce4ec", //浅粉
            accent: "#d4af37", //强调
            error: "#ff5252",
            info: "#2196f3",
            success: "#4caf50",
            warning: "#ff9800",

            "on-background": "#333333",
            "on-surface": "#333333",
          },
        },
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
