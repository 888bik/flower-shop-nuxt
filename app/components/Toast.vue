<template>
  <div class="fixed top-6 right-6 z-[9999] space-y-3">
    <TransitionGroup
      name="toast"
      enter-active-class="transition-all duration-300"
      leave-active-class="transition-all duration-300"
      enter-from-class="opacity-0 translate-y-4 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-4 scale-95"
    >
      <div
        v-for="t in toast.state.list"
        :key="t.id"
        class="rounded-xl px-6 py-4 shadow-2xl border flex items-center gap-4 min-w-[260px] max-w-xs text-base"
        :class="toastClass(t.type)"
      >
        <div class="text-xl">
          <span v-if="t.type === 'success'">
            <v-icon start>mdi-check</v-icon>
          </span>
          <span v-else>
            <v-icon start>mdi-alert-circle</v-icon>
          </span>
        </div>
        <p class="flex-1">{{ t.message }}</p>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useToast } from "~/composables/useToast";

const toast = useToast();

function toastClass(type: "success" | "error") {
  return type === "success"
    ? "bg-black/90 text-[#d4af37] border border-[#d4af37]"
    : "bg-black/90 text-red-400 border border-red-400";
}

function open(message: string, type: "success" | "error") {
  toast.open(message, type);
}

defineExpose({ open });
</script>
