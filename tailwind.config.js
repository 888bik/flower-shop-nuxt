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
        // 这些会被映射到 CSS 变量，方便在模板直接使用 bg-brand/text-brand 等
        brand: "var(--c-brand)",
        surface: "var(--c-surface)",
        page: "var(--c-bg)",
        primary: "var(--c-primary)",
        accent: "var(--c-accent)",
        text: "var(--c-text)",
        muted: "var(--c-muted)",
        gold: "var(--c-gold)",
        onSurface: "var(--c-on-surface)",
        overlay: "var(--c-overlay)",
        nav: "var(--c-nav-bg)",
        footer: "var(--c-footer)",
        borderColor: "var(--c-border)",
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
