<template>
  <article
    class="product-card group"
    :aria-labelledby="`p-${product.id}-title`"
    role="article"
    @click="onCardClick"
  >
    <!-- 图片区 -->
    <div class="card-media">
      <!-- 占位背景 -->
      <div v-if="!imageLoaded" class="skeleton"></div>
      <img
        :src="displayImage"
        :alt="product.title || `product-${product.id}`"
        class="media-img"
        :class="{ loaded: imageLoaded }"
        loading="lazy"
        @load="onImageLoad"
      />

      <!-- 小缩略图切换 -->
      <div v-if="product.banners?.length > 1" class="thumbs" @click.stop>
        <button
          v-for="(img, i) in product.banners"
          :key="i"
          @click="changeImage(i)"
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
            @click.stop="onAddToCart"
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
import type { ProductItem } from "~/types/api/goods";

interface IProps {
  product: ProductItem;
}

interface IEmits {
  (e: "add", p: ProductItem): void;
  (e: "quick", p: ProductItem): void;
  (e: "click", p: ProductItem): void;
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmits>();

const authStore = useAuthStore();

const currentImg = ref(0);
const imageLoaded = ref(false);
const displayImage = computed(() =>
  props.product.banners && props.product.banners.length
    ? props.product.banners[currentImg.value]
    : props.product.cover ?? ""
);

function onImageLoad() {
  imageLoaded.value = true;
}

// 缩略图切换时重置加载状态
function changeImage(i: number) {
  currentImg.value = i;
  imageLoaded.value = false;
}

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
  if (!authStore.isLogin) {
    return $toast.error("请先登录");
  }
  emit("add", props.product);
}
function onCardClick() {
  emit("click", props.product);
}
</script>

<style scoped>
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

.product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 14px 40px rgba(2, 6, 23, 0.36);
}

.card-media {
  position: relative;
  height: 280px;
  background: #111;
  overflow: hidden;
}
/* 占位背景 */
.image-placeholder {
  width: 100%;
  height: 100%;
  background: #222;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}
/* 骨架动画 */
.skeleton {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #222;
  overflow: hidden;
}
.skeleton::after {
  content: "";
  display: block;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(34, 34, 34, 0) 0%,
    rgba(55, 55, 55, 0.3) 50%,
    rgba(34, 34, 34, 0) 100%
  );
  position: absolute;
  top: 0;
  left: -100%;
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

.media-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  opacity: 0;
  z-index: 2;
  transition: opacity 0.4s ease;
}

.media-img.loaded {
  opacity: 1;
}

.product-card:hover .media-img {
  transform: scale(1.03);
}

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
  &:hover {
    border: 3px solid rgba(255, 255, 255, 0.08);
  }
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
  color: #fff;
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
