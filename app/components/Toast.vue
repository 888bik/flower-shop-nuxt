<template>
  <ul
    class="notification-container fixed right-4 z-[9999]"
    :style="{ top: `var(--toast-top-offset, 76px)` }"
  >
    <TransitionGroup
      name="toast"
      tag="div"
      enter-active-class="transition-all duration-300"
      leave-active-class="transition-all duration-300"
      enter-from-class="opacity-0 translate-y-2 scale-97"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-2 scale-97"
    >
      <li
        v-for="t in toast.state.list"
        :key="t.id"
        class="notification-item"
        :class="t.type"
        @mouseenter="pause(t.id)"
        @mouseleave="resume(t.id)"
      >
        <div class="notification-content">
          <div class="notification-icon">
            <svg v-if="t.type === 'success'" viewBox="0 0 24 24" fill="none">
              <path
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <svg v-else-if="t.type === 'error'" viewBox="0 0 24 24" fill="none">
              <path
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <svg
              v-else-if="t.type === 'warning'"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none">
              <path
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
              />
            </svg>
          </div>
          <div class="notification-text">{{ t.message }}</div>
        </div>

        <div class="notification-icon notification-close" @click="close(t.id)">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18 17.94 6M18 18 6.06 6"
            />
          </svg>
        </div>
        <div class="notification-progress-bar"></div>
      </li>
    </TransitionGroup>
  </ul>
</template>

<script setup lang="ts">
import { useToast } from "~/composables/useToast";

const toast = useToast();

function close(id: number) {
  toast.close(id);
}
function pause(id: number) {
  toast.pause(id);
}
function resume(id: number) {
  toast.resume(id);
}

defineExpose({
  open: toast.open,
  success: toast.success,
  error: toast.error,
  close: toast.close,
  pause: toast.pause,
  resume: toast.resume,
});
</script>

<style scoped>
.notification-container {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  max-width: 320px;
  font-family: sans-serif;
}

.notification-item {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1em;
  overflow: hidden;
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: rgba(111, 111, 111, 0.2) 0px 8px 24px;
  transition: all 250ms ease;
  font-size: 0.875rem;
}

.notification-item:hover {
  transform: scale(1.02);
}
.notification-item:active {
  transform: scale(1.05);
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 10px;
}
.notification-text {
  font-size: 1em;
  font-weight: 500;
  user-select: none;
}

.notification-icon svg {
  width: 24px;
  height: 24px;
}

/* Close 按钮 */
.notification-close svg {
  width: 20px;
  height: 20px;
}

/* 进度条 */
.notification-progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: 100%;
  background-color: currentColor;
  transform: translateX(100%);
  animation: progressBar 5s linear forwards;
}

@keyframes progressBar {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-100%);
  }
}

/* 类型样式 */
.success {
  color: #f5e0f0;
  background-color: #c76ba0;
}
.error {
  color: #7f1d1d;
  background-color: #ff7e7e;
}
.warning {
  color: #78350f;
  background-color: #ffe57e;
}
.info {
  color: #1e3a8a;
  background-color: #7eb8ff;
}
</style>
