<template>
  <div>
    <svg
      viewBox="0 0 18 18"
      role="img"
      aria-hidden="false"
      aria-label="next"
      focusable="false"
      :width="size"
      fill="white"
      :height="size"
    >
      <path
        d="m4.29 1.71a1 1 0 1 1 1.42-1.41l8 8a1 1 0 0 1 0 1.41l-8 8a1 1 0 1 1 -1.42-1.41l7.29-7.29z"
        fillRule="evenodd"
      ></path>
    </svg>
  </div>
</template>

<script setup lang="ts">
defineProps({
  size: {
    type: [Number, String],
    default: 30,
  },
  customClass: {
    type: String,
    default: "",
  },
});
</script>

<style scoped></style>
