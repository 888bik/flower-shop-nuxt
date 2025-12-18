<template>
  <div class="section-tab-wrapper">
    <ScrollView>
      <div
        v-for="(it, idx) in normalizedItems"
        :key="itemKey(it, idx)"
        class="item"
        :class="{ active: idx === currentIndex }"
        role="button"
        tabindex="0"
        @click="onClick(it, idx)"
        @keydown.enter="onClick(it, idx)"
        :aria-pressed="idx === currentIndex"
      >
        {{ it.name }}
      </div>
    </ScrollView>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import ScrollView from "./ScrollView.vue";

type TabObj = { id: number | null | undefined; name: string };
type TabInput = string | TabObj;

const props = defineProps<{
  items?: TabInput[];
  initialIndex?: number;
}>();

const emit = defineEmits<{
  (e: "tab-click", item: TabObj): void;
}>();

const currentIndex = ref(props.initialIndex ?? 0);

const normalizedItems = computed<TabObj[]>(() => {
  const arr = props.items ?? [];
  return arr.map((x) =>
    typeof x === "string"
      ? { id: undefined, name: x }
      : { id: x.id, name: x.name }
  );
});

watch(
  () => props.initialIndex,
  (v) => {
    if (typeof v === "number") currentIndex.value = v;
  }
);

function onClick(item: TabObj, index: number) {
  currentIndex.value = index;
  emit("tab-click", item);
}

function itemKey(item: TabObj, idx: number) {
  // 尽量用 id，否则退回到 index + name
  if (item.id !== undefined && item.id !== null) return `id-${item.id}`;
  return `name-${item.name}-${idx}`;
}
</script>

<style scoped>
.section-tab-wrapper {
  padding: 6px 0;
}

/* 复制并调整你原来 styled-components 的样式 */
.item {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
  flex-basis: 120px;
  flex-shrink: 0;
  padding: 14px 16px;
  margin-right: 16px;
  border-radius: 3px;
  font-size: 17px;
  text-align: center;
  border: 0.5px solid #d8d8d8;
  white-space: nowrap;
  cursor: pointer;
  /* 你项目里可能有一个全局 mixin 或 boxShadow 变量，这里用轻微 shadow 替代 */
  box-shadow: 0 2px 6px rgba(16, 24, 40, 0.04);
  user-select: none;
}

.item:last-child {
  margin-right: 0;
}

.item.active {
  color: #fff;
  /* 优先使用已有主题变量，否则回退颜色 */
  background-color: var(--c-secondary, var(--c-primary, #fc6ea1));
  border-color: transparent;
}
</style>
