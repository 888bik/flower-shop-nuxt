import { defineStore } from "pinia";

// token 管理	token 是否存在、是否有效
// isLogin 判断	全站统一判断是否登录
// 登录 / 退出通知	通知其他 store（购物车、地址）
export const useAuthStore = defineStore("auth", {
  state: () => ({
    accessToken: null as string | null,
    refreshToken: null as string | null,
    initialized: false,
    isLoggingOut: false,
  }),

  getters: {
    isLogin: (state) => !!state.accessToken && state.initialized,
  },

  actions: {
    init() {
      this.accessToken = getToken("accessToken") || null;
      this.refreshToken = getToken("refreshToken") || null;
      this.initialized = true;
    },

    login(
      tokens: { accessToken: string; refreshToken: string },
      rememberMe?: boolean
    ) {
      this.accessToken = tokens.accessToken;
      this.refreshToken = tokens.refreshToken;

      setToken("accessToken", tokens.accessToken, rememberMe);
      setToken("refreshToken", tokens.refreshToken, rememberMe);
    },

    logout() {
      if (this.isLoggingOut) return;
      this.isLoggingOut = true;

      this.accessToken = null;
      this.refreshToken = null;
      removeToken("accessToken");
      removeToken("refreshToken");

      // 清空业务 store
      useUserStore().$reset();
      useCartStore().$reset();

      if (import.meta.client) {
        navigateTo("/login", { replace: true });
      }
    },
    updateAccessToken(newToken: string) {
      this.accessToken = newToken;
      setToken("accessToken", newToken);
    },

    updateRefreshToken(newToken: string) {
      this.refreshToken = newToken;
      setToken("refreshToken", newToken);
    },
  },
});
