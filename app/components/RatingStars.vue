<template>
  <div :class="['rating', { 'is-readonly': readonly }]" :style="rootStyle">
    <!-- 使用 row-reverse 保持视觉从左到右选星 -->
    <input
      v-for="n in 5"
      :key="n"
      :id="idFor(n)"
      type="radio"
      :name="name"
      :value="n"
      :checked="modelValue === n"
      @change="onChange(n)"
      :disabled="readonly"
    />
    <label v-for="n in 5" :key="'label-' + n" :for="idFor(n)">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path
          pathLength="360"
          d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"
        />
      </svg>
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  modelValue: { type: Number, default: 5 },
  size: { type: Number, default: 28 }, // px
  readonly: { type: Boolean, default: false },
  stroke: { type: String, default: "#666" },
  fill: { type: String, default: "#ffc73a" },
});

const emit = defineEmits(["update:modelValue"]);

// 生成一个组件实例唯一的 name/id 前缀，避免页面上多个组件冲突
const rand = Math.random().toString(36).slice(2, 8);
const name = `rating-${rand}`;

function idFor(n: number) {
  return `${name}-star-${n}`;
}

function onChange(n: number) {
  emit("update:modelValue", n);
}

const rootStyle = computed(() => ({
  "--stroke": props.stroke,
  "--fill": props.fill,
  fontSize: `${props.size}px`,
}));
</script>

<style scoped>
.rating {
  display: flex;
  flex-direction: row-reverse;
  gap: 0.3rem;
  --stroke: #666;
  --fill: #ffc73a;
}

/* hide default radio appearance */
.rating input {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 0;
  height: 0;
}

/* label acts as the clickable star */
.rating label {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* svg sizing inherits from root font-size */
.rating svg {
  width: 1.6em;
  height: 1.6em;
  overflow: visible;
  fill: transparent;
  stroke: var(--stroke);
  stroke-linejoin: bevel;
  stroke-dasharray: 12;
  animation: idle 4s linear infinite;
  transition: stroke 0.2s, fill 0.5s;
}

/* small idle animation */
@keyframes idle {
  from {
    stroke-dashoffset: 24;
  }
}

/* hover highlight */
.rating label:hover svg {
  stroke: var(--fill);
}

/* checked star: fill and pulse animation */
.rating input:checked ~ label svg,
.rating input:checked ~ label ~ label svg {
  /* Note: due to reversed order the sibling combinator highlights correctly */
  transition: 0s;
  animation: idle 4s linear infinite, yippee 0.75s backwards;
  fill: var(--fill);
  stroke: var(--fill);
  stroke-opacity: 0;
  stroke-dasharray: 0;
  stroke-linejoin: miter;
  stroke-width: 0;
}

/* animation for selection */
@keyframes yippee {
  0% {
    transform: scale(1);
    fill: var(--fill);
    fill-opacity: 0;
    stroke-opacity: 1;
    stroke-dasharray: 10;
    stroke-width: 1px;
    stroke-linejoin: bevel;
  }

  30% {
    transform: scale(0);
    fill: var(--fill);
    fill-opacity: 0;
    stroke-opacity: 1;
    stroke-dasharray: 10;
    stroke-width: 1px;
    stroke-linejoin: bevel;
  }

  30.1% {
    stroke: var(--fill);
    stroke-dasharray: 0;
    stroke-linejoin: miter;
    stroke-width: 8px;
  }

  60% {
    transform: scale(1.2);
    fill: var(--fill);
  }
}

/* disable pointer events in readonly mode and dim stars */
.rating.is-readonly {
  pointer-events: none;
  opacity: 0.9;
}
.rating.is-readonly svg {
  cursor: default;
}
</style>
