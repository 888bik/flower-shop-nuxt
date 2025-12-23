<template>
  <div>
    <svg
      viewBox="0 0 18 18"
      role="img"
      aria-hidden="false"
      aria-label="previous"
      focusable="false"
      fill="white"
      :width="size"
      :height="size"
    >
      <path
        d="m13.7 16.29a1 1 0 1 1 -1.42 1.41l-8-8a1 1 0 0 1 0-1.41l8-8a1 1 0 1 1 1.42 1.41l-7.29 7.29z"
        fillRule="evenodd"
      ></path>
    </svg>
  </div>
</template>

<script setup lang="ts">
defineProps({
  size: {
    type: [Number, String],
    default: 30, // 默认 24px
  },
  customClass: {
    type: String,
    default: "",
  },
});
</script>

<style scoped></style>
