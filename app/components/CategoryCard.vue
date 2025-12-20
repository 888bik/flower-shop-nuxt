<template>
  <div
    class="flex-shrink-0 w-44 h-48 rounded-lg shadow-lg p-4 flex flex-col justify-between"
    :style="{ background: bg }"
  >
    <div>
      <h4 class="text-lg font-semibold text-black/90">{{ title }}</h4>
      <p class="text-xs text-black/60 mt-1">{{ subtitle }}</p>
    </div>
    <img
      :src="image"
      :alt="title"
      class="w-full h-28 object-cover rounded-lg mt-2"
      loading="lazy"
    />
  </div>
</template>

<script setup lang="ts">
interface IProps {
  title: string;
  subtitle: string;
  image: string;
  bg?: string;
}

// 默认背景色
const props = defineProps<IProps>();
const bg = props.bg ?? "#ffffff";
</script>

<style scoped>
/* 可选：hover 效果 */
div:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease;
}
</style>
