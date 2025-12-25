<template>
  <nav
    ref="navRef"
    class="right-nav hidden md:flex flex-col z-50"
    :style="navStyle"
  >
    <!-- Sections + Customer + Top 按钮，统一排列 -->
    <ul class="sections">
      <li v-for="(s, index) in sections" :key="s.id">
        <button
          @click="scrollTo(s.id)"
          :title="s.label"
          class="sn-btn"
          :class="[
            { active: activeId === s.id },
            { 'rounded-t-lg': index === 0 },
            { 'rounded-b-none': index !== sections.length - 1 },
          ]"
        >
          <div class="sn-label">{{ s.label }}</div>
        </button>
      </li>

      <!-- 客服按钮 -->
      <li>
        <button class="sn-btn" @click="showChat = true">
          <div class="sn-icon">
            <IconKeFu />
          </div>
          <div class="sn-label">在线客服</div>
        </button>
      </li>

      <!-- 回到顶部 -->
      <li>
        <button class="sn-btn rounded-b-lg" @click="backToTop">
          <div class="sn-icon">
            <IconTop />
          </div>
          <div class="sn-label">回顶部</div>
        </button>
      </li>
    </ul>
  </nav>
  <Chat v-if="showChat" @close="closeChat" />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import IconTop from "~/assets/svg/IconTop.vue";
import IconKeFu from "~/assets/svg/IconKeFu.vue";
import Chat from "./Chat.vue";

interface Section {
  id: string;
  label: string;
}

const props = defineProps<{
  sections: Section[];
  offsetTop?: number;
  showOnMobile?: boolean;
}>();

const navRef = ref<HTMLElement | null>(null);
const isFixed = ref(false);
const bannerBottom = ref(0);
const activeId = ref<string | null>(null);

const offsetTop = computed(() => props.offsetTop ?? 150);
let raf = 0;

const showChat = ref(true);

function closeChat() {
  showChat.value = false;
}

function recomputeBannerBottom() {
  const banner = document.querySelector(".home-banner-wrap");
  bannerBottom.value = banner
    ? banner.getBoundingClientRect().bottom + window.scrollY + 60
    : 0;
}

function handleScroll() {
  if (raf) cancelAnimationFrame(raf);
  raf = requestAnimationFrame(() => {
    const y = window.scrollY || window.pageYOffset;
    isFixed.value = y + offsetTop.value >= bannerBottom.value;

    let closest: { id: string; distance: number } | null = null;
    for (const s of props.sections || []) {
      const el = document.getElementById(s.id);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      const distance = Math.abs(rect.top - offsetTop.value);
      if (!closest || distance < closest.distance)
        closest = { id: s.id, distance };
    }
    activeId.value = closest ? closest.id : null;
  });
}

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function backToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

onMounted(() => {
  recomputeBannerBottom();
  handleScroll();
  showChat.value = false;
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", recomputeBannerBottom);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll as any);
  window.removeEventListener("resize", recomputeBannerBottom as any);
  if (raf) cancelAnimationFrame(raf);
});

const navStyle = computed(() =>
  isFixed.value
    ? { position: "fixed" as const, top: `${offsetTop.value}px`, right: "20px" }
    : {
        position: "absolute" as const,
        top: `${bannerBottom.value}px`,
        right: "20px",
      }
);
</script>

<style scoped>
.right-nav {
  width: 62px;
  display: flex;
  flex-direction: column;
  z-index: 999;
}

.sections {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
}

.sn-btn {
  width: 62px;
  height: 62px;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 0; /* 默认不圆角，圆角由首尾控制 */
}
.sn-btn:first-child {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}
.sn-btn:last-child {
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}

.sn-icon {
  font-size: 18px;
  line-height: 1;
}

.sn-label {
  font-size: 12px;
  text-align: center;
  color: #333;
}

.sn-btn.active {
  background: #e97351;
  color: #fff;
  border-color: #e97351;
}
</style>
