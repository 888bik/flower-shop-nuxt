<template>
  <div>
    <svg
      t="1765474755210"
      class="icon"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="5284"
      :width="size"
      :height="size"
    >
      <path
        d="M644.096 251.904a277.333333 277.333333 0 1 0-392.192 392.192 277.333333 277.333333 0 0 0 392.192-392.192zM191.573333 191.573333a362.666667 362.666667 0 0 1 541.269334 480.938667l228.053333 228.053333-60.330667 60.330667-228.053333-228.053333A362.709333 362.709333 0 0 1 191.573333 191.573333z"
        fill="#D4AF37"
        p-id="5285"
      ></path>
    </svg>
  </div>
</template>

<script setup lang="ts">
defineProps({
  size: {
    type: [Number, String],
    default: 24, // 默认 24px
  },
  customClass: {
    type: String,
    default: "",
  },
});
</script>

<style scoped></style>
