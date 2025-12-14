<template>
  <article
    class="product-card group"
    :aria-labelledby="`p-${product.id}-title`"
    role="article"
  >
    <!-- 图片区 -->
    <div class="card-media">
      <img
        :src="displayImage"
        :alt="product.title || `product-${product.id}`"
        class="media-img"
        loading="lazy"
      />

      <!-- 小缩略图切换 -->
      <div v-if="product.banners?.length > 1" class="thumbs">
        <button
          v-for="(img, i) in product.banners"
          :key="i"
          @click.stop="currentImg = i"
          :class="['thumb', { active: currentImg === i }]"
          :aria-label="`切换到第 ${i + 1} 张`"
        >
          <img :src="img" class="thumb-img" loading="lazy" />
        </button>
      </div>

      <div v-if="discountPercent > 0" class="discount">
        -{{ discountPercent }}%
      </div>
    </div>

    <!-- 内容区 -->
    <div class="card-body">
      <h3 class="title" :title="product.title" :id="`p-${product.id}-title`">
        {{ product.title }}
      </h3>

      <div class="meta-row">
        <div class="rating">
          <svg class="star" viewBox="0 0 24 24" aria-hidden>
            <path
              d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.62 12 2 9.19 8.62 2 9.24 7.46 13.97 5.82 21z"
            />
          </svg>
          <span class="num">{{ product.rating }}</span>
        </div>

        <div class="sold">· {{ product.saleCount }} 已售</div>

        <div class="cats" v-if="categoryNames.length">
          <span
            v-for="(c, i) in categoryNames"
            :key="i"
            class="pill"
            :title="c"
            >{{ c }}</span
          >
        </div>
      </div>

      <div class="bottom-row">
        <div class="price">
          <div class="now">¥{{ product.minPrice }}</div>
          <div v-if="product.minOprice" class="old">
            ¥{{ product.minOprice }}
          </div>
        </div>

        <div class="actions">
          <button
            :disabled="product.stock === 0"
            class="add-btn"
            @click="onAddToCart"
            aria-label="加入购物车"
          >
            加入购物车
          </button>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { ProductItem } from "~/types/api/good";

interface IProps {
  product: ProductItem;
}
const props = defineProps<IProps>();
const emit = defineEmits<{
  (e: "add", p: ProductItem): void;
  (e: "quick", p: ProductItem): void;
}>();

const currentImg = ref(0);
const displayImage = computed(() =>
  props.product.banners && props.product.banners.length
    ? props.product.banners[currentImg.value]
    : props.product.cover ?? ""
);

const categoryNames = computed(() =>
  (props.product.categories ?? []).slice(0, 2).map((c: any) => c.name)
);

const discountPercent = computed(() => {
  const p = Number(props.product.minPrice);
  const o = Number(props.product.minOprice ?? 0);
  if (!o || o <= p) return 0;
  return Math.round(((o - p) / o) * 100);
});

function onAddToCart() {
  emit("add", props.product);
}
</script>

<style scoped>
/* 容器：固定圆角（不要在 hover 时改变）并启用合成层 */
.product-card {
  border-radius: 12px;
  overflow: hidden;
  background: var(--card-bg, #0b0b0c);
  border: 1px solid rgba(255, 255, 255, 0.04);
  transition: transform 0.22s ease, box-shadow 0.22s ease;
  will-change: transform;
  transform: translateZ(0);
  display: flex;
  flex-direction: column;
}

/* hover 只变换 translateY 与 shadow，不改 radius/border */
.product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 14px 40px rgba(2, 6, 23, 0.36);
}

/* 图片区高度缩短，避免卡片过长 */
.card-media {
  position: relative;
  height: 280px;
  background: #111;
}

.media-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.45s ease;
}

.product-card:hover .media-img {
  transform: scale(1.03);
}

/* 缩略切换按钮（极小） */
.thumbs {
  position: absolute;
  left: 8px;
  bottom: 8px;
  display: flex;
  gap: 6px;
  background: rgba(0, 0, 0, 0.28);
  padding: 6px;
  border-radius: 8px;
  backdrop-filter: blur(6px);
}
.thumb {
  width: 34px;
  height: 34px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: transparent;
}
.thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.thumb.active {
  outline: 2px solid rgba(212, 175, 55, 0.14);
}

/* discount badge */
.discount {
  position: absolute;
  right: 8px;
  top: 8px;
  background: #ff6b6b;
  color: #fff;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 12px;
}

/* 内容区 */
.card-body {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 132px; /* 保证底部对齐 */
}

.title {
  font-size: 15px;
  font-weight: 600;
  line-height: 1.2;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 元信息行 */
.meta-row {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}
.rating {
  display: flex;
  align-items: center;
  gap: 6px;
}
.star {
  width: 14px;
  height: 14px;
  fill: #d4af37;
}
.cats {
  margin-left: auto;
  display: flex;
  gap: 6px;
  align-items: center;
}

/* pill（胶囊标签） */
.pill {
  display: inline-block;
  max-width: 8.8rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.04);
  color: var(--pill-color, #f3f4f6);
}

/* 底部行（价格+按钮） */
.bottom-row {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 12px;
  margin-top: auto;
}
.price .now {
  font-size: 16px;
  color: var(--price-color, #d4af37);
  font-weight: 700;
}
.price .old {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.45);
  text-decoration: line-through;
}
.add-btn {
  border: 1px solid rgba(212, 175, 55, 0.2);
  background: transparent;
  color: var(--price-color, #d4af37);
  padding: 8px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
}
.add-btn:hover {
  background: var(--price-color, #d4af37);
  color: #000;
}
.add-btn:disabled {
  opacity: 0.48;
  cursor: not-allowed;
}

/* 防止角在缩放时受像素化影响（减少闪烁） */
.product-card,
.card-media,
.media-img {
  -webkit-font-smoothing: antialiased;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}
</style>
