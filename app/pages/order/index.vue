<template>
  <div>订单界面</div>
  <button @click="toggle('black')" :class="btn('black')">黑金</button>
  <button @click="toggle('white')" :class="btn('white')">白色</button>
  <button @click="toggle('pink')" :class="btn('pink')">粉白</button>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useTheme } from "~/composables/useTheme";

const theme = ref("black");
const t = useTheme();

function toggle(name) {
  theme.value = name;
  t.setTheme(name);
}
function btn(name) {
  return [
    "px-3 py-1 rounded",
    theme.value === name
      ? "bg-primary text-black"
      : "bg-surface text-text-primary",
  ];
}
</script>

<style scoped></style>
