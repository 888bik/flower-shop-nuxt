<template>
  <div :class="['rating', { 'is-readonly': readonly }]" :style="rootStyle">
    <label v-for="n in 5" :key="`star-${n}`" class="star">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <defs>
          <linearGradient :id="`grad-${n}`">
            <stop offset="0%" :stop-color="fill" />
            <stop :offset="filledPercentage(n) + '%'" :stop-color="fill" />
            <stop :offset="filledPercentage(n) + '%'" :stop-color="stroke" />
            <stop offset="100%" :stop-color="stroke" />
          </linearGradient>
        </defs>
        <path
          d="M12,17.27L18.18,21L16.54,13.97L22,9.24
             L14.81,8.62L12,2L9.19,8.62L2,9.24
             L7.45,13.97L5.82,21L12,17.27Z"
          :fill="`url(#grad-${n})`"
          stroke="none"
        />
      </svg>
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";

interface IProps {
  modelValue?: number;
  size?: number;
  readonly?: boolean;
  stroke?: string;
  fill?: string;
}

const {
  modelValue = 5,
  size = 24,
  readonly = true,
  stroke = "#ccc",
  fill = "#ffc73a",
} = defineProps<IProps>();

// const props = defineProps({
//   modelValue: { type: Number, default: 5 }, // 支持小数，比如 3.5
//   size: { type: Number, default: 24 },
//   readonly: { type: Boolean, default: true },
//   stroke: { type: String, default: "#ccc" },
//   fill: { type: String, default: "#ffc73a" },
// });

const rootStyle = computed(() => ({
  fontSize: `${size}px`,
}));

/**
 * 每颗星填充百分比
 * n = 星号序号 (1-5)
 * modelValue = 评分 (比如 3.5)
 * 返回 0-100
 */
const filledPercentage = (n: number) => {
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

.rating.is-readonly {
  pointer-events: none;
}

.star svg {
  width: 1em;
  height: 1em;
}
</style>
