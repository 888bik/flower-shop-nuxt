<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 translate-y-4 scale-95"
    enter-to-class="opacity-100 translate-y-0 scale-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 translate-y-0 scale-100"
    leave-to-class="opacity-0 translate-y-4 scale-95"
  >
    <div
      v-if="visible"
      class="fixed top-6 right-6 z-50 rounded-lg px-4 py-3 shadow-lg border flex items-center gap-3"
      :class="toastClass"
    >
      <!-- 图标 -->
      <div v-if="type === 'success'" class="text-gold">✔</div>
      <div v-if="type === 'error'" class="text-red-400">✘</div>

      <!-- 文本 -->
      <p>{{ message }}</p>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from "vue";

const visible = ref(false);
const message = ref("");
const type = ref<"success" | "error">("success");

const toastClass = computed(() =>
  type.value === "success"
    ? "bg-black/80 text-gold border-gold"
    : "bg-black/80 text-red-400 border-red-400"
);

function open(msg: string, t: "success" | "error" = "success") {
  message.value = msg;
  type.value = t;
  visible.value = true;

  setTimeout(() => {
    visible.value = false;
  }, 2000);
}

// 对外暴露
defineExpose({ open });
</script>

<style scoped>
.text-gold {
  color: #d4af37;
}
.border-gold {
  border-color: #d4af37;
}
</style>
