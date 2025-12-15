import { defineStore } from "pinia";
import type { UpdateUserPayload, UserProfile } from "~/types/api/user";

export const useUserStore = defineStore("user", {
  state: () => ({
    userInfo: null as UserProfile | null,
  }),
  actions: {
    async fetchUserInfo() {
      const auth = useAuthStore();
      if (!auth.isLogin) return;

      const { $api } = useNuxtApp();
      this.userInfo = await $api.user.getUserInfo();
    },
    async updateUserInfo(payload: UpdateUserPayload) {
      const { $api } = useNuxtApp();
      await $api.user.updateUser(payload);
      // 更新 store 的状态
      if (this.userInfo?.user) {
        this.userInfo.user = { ...this.userInfo.user, ...payload };
      }
    },
    clear() {
      this.userInfo = null;
    },
  },
  persist: [
    {
      key: "flower-shop-user",
      storage: piniaPluginPersistedstate.localStorage(),
      pick: ["userInfo"],
    },
  ],
});
