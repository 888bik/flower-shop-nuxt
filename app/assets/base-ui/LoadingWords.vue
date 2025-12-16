<template>
  <div class="card" :style="{ '--bg-color': bgColor }">
    <div
      class="loader"
      :style="{ color: textColor, fontSize: fontSize + 'px' }"
    >
      <p v-if="showLabel">{{ label }}</p>
      <div class="words">
        <span
          class="word"
          v-for="(word, index) in wordsWithDuplicate"
          :key="index"
          :style="{ animationDuration: duration + 's', color: highlightColor }"
        >
          {{ word }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

// Props
const props = defineProps({
  words: {
    type: Array,
    default: () => ["buttons", "forms", "switches", "cards"],
  },
  label: {
    type: String,
    default: "loading",
  },
  showLabel: {
    type: Boolean,
    default: true,
  },
  bgColor: {
    type: String,
    default: "#111",
  },
  textColor: {
    type: String,
    default: "rgb(124, 124, 124)",
  },
  highlightColor: {
    type: String,
    default: "#ff6fa3",
  },
  fontSize: {
    type: Number,
    default: 25,
  },
  duration: {
    type: Number,
    default: 4, // 动画持续时间(s)
  },
});

// 为了动画循环，复制最后一个元素
const wordsWithDuplicate = computed(() => [...props.words, props.words[0]]);
</script>

<style scoped>
.card {
  padding: 1rem 2rem;
  border-radius: 1.25rem;
}

.loader {
  font-family: "Poppins", sans-serif;
  font-weight: 500;
  box-sizing: content-box;
  height: 40px;
  padding: 10px 10px;
  display: flex;
  border-radius: 8px;
}

.words {
  overflow: hidden;
  position: relative;
}

.words::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    var(--bg-color) 10%,
    transparent 30%,
    transparent 70%,
    var(--bg-color) 90%
  );
  z-index: 20;
}

.word {
  display: block;
  height: 100%;
  padding-left: 6px;
  animation-name: spin;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

@keyframes spin {
  10% {
    transform: translateY(-102%);
  }
  25% {
    transform: translateY(-100%);
  }
  35% {
    transform: translateY(-202%);
  }
  50% {
    transform: translateY(-200%);
  }
  60% {
    transform: translateY(-302%);
  }
  75% {
    transform: translateY(-300%);
  }
  85% {
    transform: translateY(-402%);
  }
  100% {
    transform: translateY(-400%);
  }
}
</style>
