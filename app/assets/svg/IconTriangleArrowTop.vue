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
        d="m23.96 17.69a.5.5 0 0 1 -.46.31h-23a .5.5 0 0 1 -.35-.86l11.5-11a .5.5 0 0 1 .69 0l11.5 11a .5.5 0 0 1 .12.55z"
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
