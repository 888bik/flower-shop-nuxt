<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <!-- 路由出口 -->
      <NuxtPage></NuxtPage>
    </NuxtLayout>

    <Toast ref="toastRef" />
  </div>
</template>

<script lang="ts" setup>
import Toast from "~/components/Toast.vue";
import { onMounted } from "vue";
import { useTheme } from "~/composables/useTheme";
const authStore = useAuthStore();
const cartStore = useCartStore();

onMounted(async () => {
  // 初始化登录态
  authStore.init();
});

// ️监听登录态变化（登录 / 退出）
watch(
  () => authStore.isLogin,
  async (isLogin) => {
    if (isLogin) {
      await cartStore.fetchCart();
    } else {
      cartStore.clearLocal();
    }
  },
  { immediate: true }
);

const toastRef = ref();

// 全局挂载
globalThis.$toast = {
  success(msg: string, duration?: number) {
    toastRef.value?.open?.(msg, "success", duration);
  },
  error(msg: string, duration?: number) {
    toastRef.value?.open?.(msg, "error", duration);
  },
};
</script>
