import { defineStore } from "pinia";
import type { AddCartPayload, CartItem } from "~/types/api/cart";

export const useCartStore = defineStore("cart", {
  state: () => ({
    list: [] as CartItem[],
    loading: false,
    adding: false,
    updating: false,
  }),
  getters: {
    totalCount: (state) =>
      state.list.reduce((s, i) => s + Number(i.num || 0), 0),
  },
  actions: {
    async fetchCart() {
      const auth = useAuthStore();
      if (!auth.isLogin) return;

      this.loading = true;
      const { $api } = useNuxtApp();
      try {
        const res = await $api.cart.getCartList();
        // 保留原数组引用，用 splice 更新内容，确保响应式
        this.list.splice(0, this.list.length, ...res);
      } finally {
        this.loading = false;
      }
    },
    async addCart(goodsId: number, num: number) {
      this.adding = true;
      const { $api } = useNuxtApp();
      try {
        await $api.cart.addCart({ goodsId, num });
        //添加成功重新获取数据
        await this.fetchCart();
      } finally {
        this.adding = false;
      }
    },
    async updateNum(cartId: number, num: number) {
      this.updating = true;
      const { $api } = useNuxtApp();
      try {
        await $api.cart.updateNum(cartId, num);
      } finally {
        this.updating = false;
      }
    },
    async removeFromCart(cartId: number) {
      const { $api } = useNuxtApp();

      await $api.cart.removeCart(cartId);

      await this.fetchCart();
    },
    async clearCart() {
      this.loading = true;
      const { $api } = useNuxtApp();
      try {
        await $api.cart.clearCart();

        await this.fetchCart();
      } finally {
        this.loading = false;
      }
    },
    clearLocal() {
      this.list = [];
    },
  },
});
