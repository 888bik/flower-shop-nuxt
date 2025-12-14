export default defineNuxtRouteMiddleware((to, from) => {
  // 需要登录的路由前缀
  const needAuthPrefixes = ["/cart", "/profile"];

  // 是否命中受保护路由
  const needAuth = needAuthPrefixes.some((p) => to.path.startsWith(p));

  if (!needAuth) return;

  const token = getToken("user-token");

  if (!token) {
    // 提示
    if (import.meta.client) {
      const toast = useToast();
      toast.error("请先登录");
      return navigateTo({
        path: "/login",
        query: {
          redirect: to.fullPath, //登录后重新跳转到刚才的页面
        },
      });
    }
  }
});
