export default defineNuxtRouteMiddleware(async (to, from) => {
  // 需要登录的路由前缀
  const needAuthPrefixes = ["/cart", "/profile"];

  // 是否命中受保护路由
  const needAuth = needAuthPrefixes.some((p) => to.path.startsWith(p));

  if (!needAuth) return;

  const { $api } = useNuxtApp();
  const authStore = useAuthStore();

  // 初始化 store
  if (!authStore.initialized) {
    authStore.init();
  }

  const accessToken = authStore.accessToken;
  const refreshToken = authStore.refreshToken;
  if (!accessToken) {
    if (refreshToken) {
      try {
        // 调用刷新接口获取新 token
        const res = await $api.user.refreshToken(refreshToken);
        authStore.updateAccessToken(res.accessToken);
        authStore.updateRefreshToken(res.refreshToken);
        return; // 刷新成功，继续路由访问
      } catch (err) {
        authStore.logout();
      }
    } else {
      authStore.logout();
    }
    // 提示登录
    if (import.meta.client) {
      const toast = useToast();
      toast.error("请先登录");
      return navigateTo({
        path: "/login",
        query: { redirect: to.fullPath },
      });
    }
  }
});
