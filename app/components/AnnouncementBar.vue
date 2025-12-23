<template>
  <div
    class="announcement-bar"
    ref="container"
    @mouseenter="pause"
    @mouseleave="resume"
  >
    <div class="announcement-track" ref="track">
      <div
        class="announcement-item"
        v-for="item in loopedAnnouncements"
        :key="item.loopId"
        @click="handleClick(item)"
      >
        {{ item.title }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from "vue";

interface Announcement {
  id: number | string;
  title: string;
  link?: string;
}

const props = defineProps<{
  announcements: Announcement[];
  speed?: number; // 每帧滚动像素
}>();

const container = ref<HTMLElement | null>(null);
const track = ref<HTMLElement | null>(null);
const scroll = ref(0);
const speed = props.speed ?? 2; // PC端每帧滚动像素
let rafId: number | null = null;
let paused = false;

// 复制数组实现无限循环
const loopedAnnouncements = computed(() => {
  return props.announcements.flatMap((a) => [
    { ...a, loopId: `${a.id}-1` },
    { ...a, loopId: `${a.id}-2` },
  ]);
});

function handleClick(item: Announcement) {
  if (item.link) window.open(item.link, "_blank");
}

function animate() {
  if (!track.value || !container.value || paused) {
    rafId = requestAnimationFrame(animate);
    return;
  }

  scroll.value += speed;
  const trackWidth = track.value.scrollWidth / 2;
  if (scroll.value >= trackWidth) scroll.value = 0;

  track.value.style.transform = `translateX(-${scroll.value}px)`;

  rafId = requestAnimationFrame(animate);
}

function pause() {
  paused = true;
}

function resume() {
  paused = false;
}

onMounted(async () => {
  await nextTick();
  rafId = requestAnimationFrame(animate);
});

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId);
});
</script>

<style scoped>
.announcement-bar {
  width: 100%;
  overflow: hidden;
  background-color: #fde8ee;
  color: #d6336c;
  padding: 8px 12px;
  font-size: 14px;
  white-space: nowrap;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  cursor: pointer;
  position: sticky;
  top: 80px; /* 如果导航栏高度 60px */
  z-index: 999;
}

.announcement-track {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
}

.announcement-item {
  margin-right: 50px;
  flex-shrink: 0;
  user-select: none;
  font-weight: 500;
}

.announcement-item:hover {
  text-decoration: underline;
}
</style>
