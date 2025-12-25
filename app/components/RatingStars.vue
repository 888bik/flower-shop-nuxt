<template>
  <div class="rating" :style="rootStyle">
    <div v-for="n in 5" :key="n" class="star-wrapper">
      <!-- 灰色底 -->
      <svg viewBox="0 0 24 24" class="star-bg">
        <path
          d="M12,17.27L18.18,21L16.54,13.97L22,9.24
             L14.81,8.62L12,2L9.19,8.62L2,9.24
             L7.45,13.97L5.82,21L12,17.27Z"
          fill="#ccc"
        />
      </svg>
      <!-- 黄色填充 -->
      <svg
        viewBox="0 0 24 24"
        class="star-fg"
        :style="{ width: filledWidth(n) + '%' }"
      >
        <path
          d="M12,17.27L18.18,21L16.54,13.97L22,9.24
             L14.81,8.62L12,2L9.19,8.62L2,9.24
             L7.45,13.97L5.82,21L12,17.27Z"
          fill="#ffc73a"
        />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  modelValue?: number;
  size?: number;
}

const { modelValue = 3.5, size = 24 } = defineProps<Props>();

const rootStyle = computed(() => ({
  fontSize: `${size}px`,
}));

const filledWidth = (n: number) => {
  if (modelValue >= n) return 100;
  if (modelValue < n - 1) return 0;
  return (modelValue - (n - 1)) * 100;
};
</script>

<style scoped>
.rating {
  display: flex;
  gap: 0.2em;
}
.star-wrapper {
  position: relative;
  width: 1em;
  height: 1em;
}
.star-bg {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
.star-fg {
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
}
.star-fg path {
  transform: translateX(0);
}
</style>
