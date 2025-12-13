/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{vue,ts,js}",
    "./components/**/*.{vue,ts,js}",
    "./layouts/**/*.{vue,ts,js}",
    "./pages/**/*.{vue,ts,js}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0F1724", // 深近黑（头部背景）
        },
        gold: {
          DEFAULT: "#D4AF37", // 金色主色
          // dark: "#C59C2D", // hover / 深金
          dark: "#B8860B", // hover / 深金
        },
        graySoft: {
          DEFAULT: "#0F1724", //银灰
          dark: "#9A9A9A", //深灰文字
        },
        "muted-1": "#F8F6F4", // 浅背景区块
        "text-primary": "#F3F4F6", // 页面主要文字（浅色于深背景）
      },

      borderRadius: {
        xl: "14px",
      },
      boxShadow: {
        "soft-lg": "0 8px 30px rgba(15,23,36,0.12)",
      },
    },
  },
  plugins: [],
};
