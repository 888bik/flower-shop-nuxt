import { defineStore } from "pinia";

// token 管理	token 是否存在、是否有效
// isLogin 判断	全站统一判断是否登录
// 登录 / 退出通知	通知其他 store（购物车、地址）
export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: null as string | null,
    initialized: false,
  }),

  getters: {
    isLogin: (state) => !!state.token,
  },

  actions: {
    init() {
      const token = getToken("use-token");
      this.token = token || null;
      this.initialized = true;
    },

    login(token: string, rememberMe?: boolean) {
      this.token = token;
      setToken("user-token", token, rememberMe);
    },

    logout() {
      this.token = null;
      removeToken("use-token");

      // 清空所有业务 store
      useUserStore().$reset();
      useCartStore().$reset();
    },
  },
});
