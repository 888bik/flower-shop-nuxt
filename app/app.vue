<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <!-- 路由出口 -->
      <NuxtPage></NuxtPage>
      <Toast ref="toastRef" />
    </NuxtLayout>
  </div>
</template>

<script lang="ts" setup>
import Toast from "~/components/Toast.vue";

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
