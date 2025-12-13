<template>
  <article
    class="group relative rounded-xl overflow-hidden border border-white/5 bg-brand/40 hover:shadow-soft-lg transform transition-all duration-300 hover:-translate-y-1"
    :aria-labelledby="`p-${product.id}-title`"
  >
    <!-- 图片容器 -->
    <div class="relative">
      <img
        :src="product.banners[currentImg]"
        :alt="product.title || `product-${product.id}`"
        class="w-full h-[340px] object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />

      <div
        v-if="product.banners.length > 1"
        class="absolute left-3 bottom-3 flex gap-2 bg-black/30 rounded-md p-1 backdrop-blur-sm"
      >
        <button
          v-for="(img, i) in product.banners"
          :key="i"
          @click.stop="currentImg = i"
          :class="[
            'w-8 h-8 rounded overflow-hidden transition-opacity',
            currentImg === i ? 'ring-2 ring-gold/60' : 'opacity-60',
          ]"
        >
          <img :src="img" class="w-full h-full object-cover" loading="lazy" />
        </button>
      </div>

      <div v-if="discountPercent > 0" class="absolute top-3 right-3">
        <span
          class="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-md bg-rose-600 text-white shadow"
          >-{{ discountPercent }}%</span
        >
      </div>

      <div class="absolute top-3 left-3 flex gap-2">
        <!-- <span
          class="text-xs font-medium px-2 py-1 rounded border border-gold/30 text-gold bg-gold/8 backdrop-blur-sm"
          >NEW</span
        > -->
        <button
          @click.prevent="onWishlist"
          :title="inWishlist ? '已收藏' : '加入收藏'"
          class="bg-gold/10 hover:bg-gold/20 text-gold px-3 py-2 rounded-md text-sm border border-gold/20"
          aria-label="收藏"
        >
          ❤
        </button>
      </div>
    </div>

    <!-- 信息区域 -->
    <div class="p-4">
      <h3
        :id="`p-${product.id}-title`"
        class="text-base font-semibold mb-1 line-clamp-2 text-text-primary"
        :title="product.title"
      >
        {{ product.title }}
      </h3>

      <div class="flex items-center gap-2 text-xs text-graySoft-dark mb-2">
        <div class="flex items-center gap-1">
          <svg
            class="w-4 h-4 text-gold"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <path
              d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z"
            />
          </svg>
          <span class="font-medium">{{ product.rating }}</span>
        </div>
        <span class="text-muted-1/70">·</span>
        <span class="text-muted-1/70">{{ product.saleCount }} 已售</span>
        <div
          v-if="categoryNames.length"
          class="ml-auto flex flex-wrap gap-2 category-line"
          :style="{ maxHeight: '36px' }"
        >
          <span
            v-for="(c, i) in categoryNames"
            :key="i"
            class="text-[11px] px-2 py-0.5 rounded bg-white/3 text-text-primary"
            >{{ c }}</span
          >
        </div>
      </div>

      <div class="flex items-end justify-between">
        <div>
          <div class="text-lg font-bold text-gold">
            ￥{{ product.minPrice }}
          </div>
          <div
            v-if="product.minOprice"
            class="text-sm line-through text-muted-1/60"
          >
            ￥{{ product.minOprice }}
          </div>
        </div>

        <div class="flex flex-col items-end gap-2">
          <button
            :disabled="product.stock === 0"
            @click="onAddToCart"
            class="border border-gold text-gold px-3 py-2 rounded-md font-semibold shadow-md hover:bg-gold hover:text-black transition-all disabled:opacity-50"
            aria-label="加入购物车"
          >
            加入购物车
          </button>
          <div
            v-if="product.stock <= lowStockThreshold"
            :class="[
              'text-xs',
              product.stock === 0 ? 'text-gray-400' : 'text-rose-500',
            ]"
          >
            <span v-if="product.stock === 0">已售罄</span>
            <span v-else>仅剩 {{ product.stock }} 件</span>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { ProductItem } from "~/types/api/good";
interface IProps {
  product: ProductItem;
}

/** 使用你的 GoodsItem 类型 或者按需替换 */

const props = defineProps<IProps>();
const emit = defineEmits<{
  (e: "add", p: ProductItem): void;
  (e: "quick", p: ProductItem): void;
}>();

const inWishlist = ref(false);
const currentImg = ref(0);

// const images = computed(() => {
//   // 使用 goodsBanner 优先，然后 fallback cover
//   const banners = props.product.banners?.map((b) => b.url) ?? [];
//   return banners.length ? banners : [props.product.cover];
// });

const categoryNames = computed(() =>
  (props.product.categories ?? []).slice(0, 2).map((c) => c.name)
);

const lowStockThreshold = 10;

const discountPercent = computed(() => {
  const p = Number(props.product.minPrice);
  const o = Number(props.product.minOprice ?? 0);
  if (!o || o <= p) return 0;
  return Math.round(((o - p) / o) * 100);
});

function onAddToCart() {
  emit("add", props.product);
}

function onQuickView() {
  emit("quick", props.product);
}

function onWishlist() {
  inWishlist.value = !inWishlist.value;
  // 触发收藏逻辑或API
}
</script>

<style scoped>
.shadow-soft-lg {
  box-shadow: 0 8px 30px rgba(15, 23, 36, 0.12);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.category-line {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; /* 最多两行 */
  overflow: hidden;
}
</style>
