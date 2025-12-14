export function useTheme() {
  const THEME_KEY = "flower_theme";

  function applyTheme(theme: string) {
    if (typeof document === "undefined") return;
    const html = document.documentElement;
    // 移除旧类
    html.classList.remove("theme-black", "theme-white", "theme-pink");
    if (theme && theme !== "auto") {
      html.classList.add(`theme-${theme}`);
    }
  }

  function setTheme(theme: "black" | "white" | "pink" | "auto") {
    localStorage.setItem(THEME_KEY, theme);
    applyTheme(theme);
  }

  function loadTheme() {
    if (typeof window === "undefined") return;
    const t = localStorage.getItem(THEME_KEY) || "black"; // 默认 black 或 "white"
    applyTheme(t);
    return t;
  }

  // init on client
  if (process.client) {
    loadTheme();
  }

  return {
    setTheme,
    loadTheme,
  };
}
