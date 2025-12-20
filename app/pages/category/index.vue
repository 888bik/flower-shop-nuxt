<template>
  <div class="px-4 py-8">
    <div class="max-w-7xl mx-auto">
      <!-- Grid container -->
      <div
        class="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 md:grid-rows-3"
      >
        <!-- Large left card (spans 3 rows on md+) -->
        <div
          class="card group relative overflow-hidden rounded-2xl shadow-lg p-6 flex flex-col justify-between"
          :style="cardStyle(cards[0].bg)"
          role="article"
        >
          <div>
            <h3 class="text-2xl font-bold text-black/90">
              {{ cards[0].title }}
            </h3>
            <p class="mt-2 text-sm text-black/70">{{ cards[0].subtitle }}</p>
          </div>
          <div class="flex items-end justify-between mt-6">
            <div class="w-40">
              <img
                :src="cards[0].image"
                :alt="cards[0].title"
                class="w-full h-40 object-cover rounded-xl"
                loading="lazy"
              />
            </div>
            <button
              class="go-btn ml-4"
              @click="$emit('go', cards[0])"
              aria-label="go"
            >
              GO <span class="ml-1">›</span>
            </button>
          </div>
        </div>

        <!-- Top middle small card -->
        <div
          class="card relative rounded-2xl shadow-md p-5 flex flex-col justify-between"
          :style="cardStyle(cards[1].bg)"
        >
          <div>
            <h4 class="text-lg font-semibold text-black/90">
              {{ cards[1].title }}
            </h4>
            <p class="mt-1 text-xs text-black/60">{{ cards[1].subtitle }}</p>
          </div>
          <div class="flex items-center justify-between mt-4">
            <img
              :src="cards[1].image"
              :alt="cards[1].title"
              class="w-20 h-20 object-cover rounded-lg"
              loading="lazy"
            />
            <button class="go-btn-sm" @click="$emit('go', cards[1])">GO</button>
          </div>
        </div>

        <!-- Top right small card -->
        <div
          class="card relative rounded-2xl shadow-md p-5 flex flex-col justify-between"
          :style="cardStyle(cards[2].bg)"
        >
          <div>
            <h4 class="text-lg font-semibold text-black/90">
              {{ cards[2].title }}
            </h4>
            <p class="mt-1 text-xs text-black/60">{{ cards[2].subtitle }}</p>
          </div>
          <div class="mt-4 flex justify-end">
            <img
              :src="cards[2].image"
              :alt="cards[2].title"
              class="w-20 h-20 object-cover rounded-lg"
              loading="lazy"
            />
          </div>
        </div>

        <!-- Center large (spans 2 rows on md) -->
        <div
          class="card relative rounded-2xl shadow-lg p-6 md:row-span-2 flex flex-col justify-between"
          :style="cardStyle(cards[3].bg)"
        >
          <div>
            <h3 class="text-2xl font-bold text-black/90">
              {{ cards[3].title }}
            </h3>
            <p class="mt-3 text-sm text-black/70">{{ cards[3].subtitle }}</p>
          </div>

          <div class="flex items-end justify-between mt-6">
            <div class="text-right">
              <button class="go-btn" @click="$emit('go', cards[3])">
                GO <span class="ml-1">›</span>
              </button>
            </div>
            <div class="w-48">
              <img
                :src="cards[3].image"
                :alt="cards[3].title"
                class="w-full h-48 object-cover rounded-xl"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        <!-- Right column small top -->
        <div
          class="card relative rounded-2xl shadow-md p-4 flex items-center gap-3"
          :style="cardStyle(cards[4].bg)"
        >
          <img
            :src="cards[4].image"
            :alt="cards[4].title"
            class="w-20 h-20 object-cover rounded-lg"
            loading="lazy"
          />
          <div>
            <h5 class="text-sm font-semibold text-black/90">
              {{ cards[4].title }}
            </h5>
            <p class="text-xs text-black/60">{{ cards[4].subtitle }}</p>
            <button class="go-link mt-2" @click="$emit('go', cards[4])">
              GO
            </button>
          </div>
        </div>

        <!-- Right column small bottom -->
        <div
          class="card relative rounded-2xl shadow-md p-4 flex items-center gap-3"
          :style="cardStyle(cards[5].bg)"
        >
          <img
            :src="cards[5].image"
            :alt="cards[5].title"
            class="w-20 h-20 object-cover rounded-lg"
            loading="lazy"
          />
          <div>
            <h5 class="text-sm font-semibold text-black/90">
              {{ cards[5].title }}
            </h5>
            <p class="text-xs text-black/60">{{ cards[5].subtitle }}</p>
            <button class="go-link mt-2" @click="$emit('go', cards[5])">
              GO
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";

/**
 * 你可以把数据从父组件传入，这里我们提供默认示例
 * cards 数组顺序对应上面模板中的卡片位置（左大、上中、上右、中大、右上、右下）
 */

const cards = reactive([
  {
    title: "送恋人",
    subtitle: "有幸遇见，恰好合拍",
    image: "https://picsum.photos/seed/rose/400/320",
    bg: "#fde8ee",
  },
  {
    title: "送长辈",
    subtitle: "岁月温柔 因你常在",
    image: "https://picsum.photos/seed/elder/200/200",
    bg: "#fff0e8",
  },
  {
    title: "送朋友",
    subtitle: "时光不老 我们不散",
    image: "https://picsum.photos/seed/friend/200/200",
    bg: "#e9f6ff",
  },
  {
    title: "生日祝福",
    subtitle: "新的 1 岁，值得庆祝",
    image: "https://picsum.photos/seed/birthday/480/360",
    bg: "#fdeee6",
  },
  {
    title: "表白求婚",
    subtitle: "浪漫时刻，铭记一生",
    image: "https://picsum.photos/seed/propose/200/200",
    bg: "#fff0f4",
  },
  {
    title: "设计师甄选",
    subtitle: "花语传情，稀有浪漫",
    image: "https://picsum.photos/seed/designer/200/200",
    bg: "#fef3f6",
  },
]);

// 如果你想通过 props 传入数据：
// const props = defineProps<{ cards?: Array<any> }>();
// const data = props.cards ?? defaultCards

// 帮助函数，把 hex 背景和文字色处理一下
function cardStyle(bg: string) {
  return {
    background: bg,
  };
}
</script>

<style scoped>
/* 基础 card 风格抽离，使用 @apply 简化 */
.card {
  @apply rounded-2xl overflow-hidden;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

/* GO button 大 */
.go-btn {
  @apply inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium;
  background: #fff;
  color: #0b0b0b;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}
.go-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
}

/* 小 GO */
.go-btn-sm {
  @apply inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-black;
}

/* link style */
.go-link {
  @apply inline-block text-xs text-[#ff6b6b] border border-[#ffcccc] px-2 py-1 rounded;
  background: rgba(255, 255, 255, 0.5);
}

/* gold token (若需要) */
.text-gold {
  color: #d4af37;
}
.bg-gold {
  background-color: #d4af37;
}

/* small responsive tweaks */
@media (min-width: 768px) {
  /* 在 md+ 屏幕上把第一个卡片撑高（等同左栏占 3 行） */
  .grid > :first-child {
    grid-row: span 3 / span 3;
  }
}
</style>
