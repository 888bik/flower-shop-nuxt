<template>
  <div>
    <svg
      viewBox="0 0 24 24"
      role="presentation"
      aria-hidden="true"
      focusable="false"
      fill="white"
      :width="size"
      :height="size"
    >
      <path
        d="m23.85 6.86-11.5 11a .5.5 0 0 1 -.69 0l-11.5-11a .5.5 0 0 1 .34-.86h23a .5.5 0 0 1 .35.86z"
        fillRule="evenodd"
      ></path>
    </svg>
  </div>
</template>

<script setup lang="ts">
defineProps({
  size: {
    type: [Number, String],
    default: 15, // 默认 24px
  },
  customClass: {
    type: String,
    default: "",
  },
});
</script>

<style scoped></style>
