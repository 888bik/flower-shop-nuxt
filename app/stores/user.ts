import { defineStore } from "pinia";
import type { UpdateUserPayload, UserProfile } from "~/types/api/user";

export const useUserStore = defineStore("user", {
  state: () => ({
    userInfo: null as UserProfile | null,
  }),
  actions: {
    async fetchUserInfo() {
      const { $api } = useNuxtApp();
      const res: UserProfile = await $api.user.getUserInfo();
      this.userInfo = res;
    },
    async updateUserInfo(payload: UpdateUserPayload) {
      const { $api } = useNuxtApp();
      const res = await $api.user.updateUser(payload);
      // 更新 store 的状态
      if (this.userInfo?.user) {
        this.userInfo.user = { ...this.userInfo.user, ...payload };
      }
    },
    async logout() {
      const { $api } = useNuxtApp();
      const res = await $api.user.userLogout();
      console.log(res);
      // 清空用户数据
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
