<template>
  <div class="scroll-view-wrapper">
    <button
      v-if="showLeft"
      class="control left"
      @click="handleControlClick(false)"
      aria-label="scroll left"
    >
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
      </svg>
    </button>

    <button
      v-if="showRight"
      class="control right"
      @click="handleControlClick(true)"
      aria-label="scroll right"
    >
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
        <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
      </svg>
    </button>

    <div class="scroll" ref="viewportRef">
      <div
        class="scroll-content"
        ref="contentRef"
        :style="{ transform: `translateX(${translateX}px)` }"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";

const viewportRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);
const translateX = ref(0);

const showLeft = ref(false);
const showRight = ref(false);
const posIndex = ref(0);
const totalDistance = ref(0);

let ro: ResizeObserver | null = null;

function updateShow() {
  const content = contentRef.value;
  const viewport = viewportRef.value;
  if (!content || !viewport) return;

  const scrollWidth = content.scrollWidth;
  const clientWidth = viewport.clientWidth;
  totalDistance.value = scrollWidth - clientWidth;

  // when totalDistance > 0, right button shows initially
  showRight.value = totalDistance.value > 1; // small tolerance
  showLeft.value = translateX.value < 0;
}

function handleControlClick(isRight: boolean) {
  const content = contentRef.value;
  if (!content) return;
  const children = Array.from(content.children) as HTMLElement[];
  const nextIndex = isRight ? posIndex.value + 1 : posIndex.value - 1;

  // clamp
  const clamped = Math.max(0, Math.min(nextIndex, children.length - 1));
  const nextEl = children[clamped];
  if (!nextEl) return;

  const nextOffsetLeft = nextEl.offsetLeft;
  // translateX is negative of offset
  translateX.value = -nextOffsetLeft;
  posIndex.value = clamped;

  // update button visibility
  showLeft.value = nextOffsetLeft > 0;
  showRight.value = totalDistance.value > nextOffsetLeft + 1; // plus small tolerance
}

async function measure() {
  await nextTick();
  updateShow();
}

onMounted(() => {
  measure();

  // ResizeObserver to detect content size changes (children added/removed or font/load)
  if (contentRef.value) {
    ro = new ResizeObserver(() => {
      // if content shrinks and translateX pushes beyond bounds, reset
      const content = contentRef.value!;
      const viewport = viewportRef.value!;
      totalDistance.value = content.scrollWidth - viewport.clientWidth;

      // ensure translateX not out of bounds
      const maxTranslate = 0;
      const minTranslate = Math.min(0, -totalDistance.value);
      if (translateX.value < minTranslate) translateX.value = minTranslate;
      if (translateX.value > maxTranslate) translateX.value = maxTranslate;

      // update posIndex best-effort: find nearest child whose offsetLeft >= -translateX
      const children = Array.from(content.children) as HTMLElement[];
      const absX = -translateX.value;
      let nearestIdx = 0;
      for (let i = 0; i < children.length; i++) {
        if (children[i].offsetLeft <= absX + 1) nearestIdx = i;
        else break;
      }
      posIndex.value = nearestIdx;

      updateShow();
    });
    ro.observe(contentRef.value);
  }

  window.addEventListener("resize", measure);
});

onBeforeUnmount(() => {
  if (ro && contentRef.value) ro.unobserve(contentRef.value);
  window.removeEventListener("resize", measure);
});
</script>

<style scoped>
.scroll-view-wrapper {
  position: relative;
  padding: 8px 0;
}

.scroll {
  overflow: hidden;
}

.scroll-content {
  display: flex;
  transition: transform 250ms ease;
  will-change: transform;
  align-items: center;
}

/* control buttons */
.control {
  position: absolute;
  z-index: 9;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #fff;
  background: #fff;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.12);
  cursor: pointer;
  top: 50%;
  transform: translateY(-50%);
}

.control.left {
  left: 6px;
}

.control.right {
  right: 6px;
}

.control svg {
  display: block;
  fill: #333;
}
</style>
