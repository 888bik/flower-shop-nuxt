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

const cartStore = useCartStore();
const token = getToken("use-token");

onMounted(() => {
  if (!cartStore.list.length && token) {
    cartStore.fetchCart();
  }
});

const toastRef = ref();

// 全局挂载
globalThis.$toast = {
  success(msg: string) {
    toastRef.value?.open(msg, "success");
  },
  error(msg: string) {
    toastRef.value?.open(msg, "error");
  },
};
</script>
