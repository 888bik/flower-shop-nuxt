<template>
  <div
    class="fixed right-4 z-[9999] w-auto max-w-sm"
    :style="{ top: `var(--toast-top-offset, 76px)` }"
  >
    <TransitionGroup
      name="toast"
      tag="div"
      enter-active-class="transition-all duration-300"
      leave-active-class="transition-all duration-300"
      enter-from-class="opacity-0 translate-y-2 scale-97"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-2 scale-97"
    >
      <div
        v-for="t in toast.state.list"
        :key="t.id"
        class="mb-3 rounded-lg shadow-md border flex items-start gap-3 p-4 min-w-[260px] text-sm pointer-events-auto"
        :class="toastThemeClass(t.type)"
        @mouseenter="pause(t.id)"
        @mouseleave="resume(t.id)"
      >
        <div class="mt-0.5">
          <span v-if="t.type === 'success'">
            <v-icon start>mdi-check-circle</v-icon>
          </span>
          <span v-else>
            <v-icon start>mdi-alert-circle</v-icon>
          </span>
        </div>

        <div class="flex-1 leading-tight text-sm">
          <div class="text-sm font-medium" :class="{ 'text-gray-800': true }">
            {{ t.message }}
          </div>
        </div>

        <button
          aria-label="close"
          class="ml-2 text-xs rounded px-1 py-0.5 hover:bg-gray-100"
          @click="close(t.id)"
        >
          <v-icon small>mdi-close</v-icon>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useToast } from "~/composables/useToast";

const toast = useToast();

// 组件层面操作转发
function close(id: number) {
  toast.close(id);
}
function pause(id: number) {
  toast.pause(id);
}
function resume(id: number) {
  toast.resume(id);
}

function toastThemeClass(type: "success" | "error") {
  // 白底主设计：白卡片 + 左侧或边框强调色
  return type === "success"
    ? "bg-white border border-gray-200 text-gray-800"
    : "bg-white border border-gray-200 text-gray-800";
}

defineExpose({
  open: toast.open,
  success: toast.success,
  error: toast.error,
  close: toast.close,
  pause: toast.pause,
  resume: toast.resume,
});
</script>

<style scoped>
/* transition-group 需要配合 name=toast 使用 */
.toast-enter-active,
.toast-leave-active {
  transition: all 300ms ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.98);
}
.toast-enter-to,
.toast-leave-from {
  opacity: 1;
  transform: translateY(0px) scale(1);
}
</style>
