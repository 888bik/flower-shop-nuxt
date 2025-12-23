import { defineStore } from "pinia";
import { ref } from "vue";

export const useUiStore = defineStore("ui", () => {
  // 购物车图标元素引用
  const cartIconEl = ref<HTMLElement | null>(null);

  // 飞入购物车或点击时摇动动画
  function shakeCart() {
    if (!cartIconEl.value) return;
    const el = cartIconEl.value;
    el.animate(
      [
        { transform: "translateX(0px)" },
        { transform: "translateX(-6px)" },
        { transform: "translateX(6px)" },
        { transform: "translateX(-6px)" },
        { transform: "translateX(0px)" },
      ],
      {
        duration: 300,
        easing: "ease-in-out",
      }
    );
  }

  return { cartIconEl, shakeCart };
});
