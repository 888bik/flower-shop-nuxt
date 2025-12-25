<template>
  <div class="card" role="article" aria-label="product-card">
    <div class="card__shine" />
    <div class="card__glow" />

    <div class="card__content">
      <div class="card__discount" v-if="discountPercent > 0">
        -{{ discountPercent }}%
      </div>

      <div class="card__image-wrap">
        <div class="card__image" @click="$emit('clickCard')">
          <img :src="displayImage" alt="" class="media-img" loading="lazy" />
        </div>

        <div v-if="banners && banners.length > 1" class="thumbs" @click.stop>
          <button
            v-for="(img, i) in banners"
            :key="i"
            @click.stop.prevent="changeImage(i)"
            :class="['thumb', { active: currentImg === i }]"
            :aria-label="`切换到第 ${i + 1} 张`"
          >
            <img :src="img" class="thumb-img" loading="lazy" />
          </button>
        </div>
      </div>

      <div class="card__text">
        <p class="card__title" :title="title">{{ title }}</p>
        <p class="card__description" v-if="desc">{{ desc }}</p>
      </div>

      <div class="card__footer">
        <div class="card__left">
          <div class="card__price-row">
            <div class="card__price-current">¥ {{ formattedPrice }}</div>
            <div v-if="hasOldPrice" class="card__price-old">
              ¥ {{ formattedOldPrice }}
            </div>
          </div>

          <div class="card__meta-row">
            <div v-if="typeof sold !== 'undefined'" class="card__sold">
              已售 {{ sold }}
            </div>
            <div
              v-if="rating !== undefined && rating !== null"
              class="card__rating"
              :aria-label="`评分 ${rating} 星`"
            >
              <RatingStars :model-value="rating" :size="15" />
            </div>
          </div>
        </div>

        <div class="card__right">
          <BuyNowButton class="card__button" @click.stop="$emit('add')" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import BuyNowButton from "~/assets/base-ui/BuyNowButton.vue";
import RatingStars from "./RatingStars.vue";

interface IProps {
  image?: string;
  banners?: string[]; // 缩略图数组
  title: string;
  desc?: string;
  price: number | string; // 实付（现价）
  oldPrice?: number | string; // 原价
  rating?: number;
  sold?: number | string;
}
interface IEmits {
  (e: "add"): void;
  (e: "clickCard"): void;
}
const props = defineProps<IProps>();
const emit = defineEmits<IEmits>();

const {
  image = "",
  banners = [],
  title,
  desc,
  price,
  oldPrice,
  rating,
  sold,
} = props;

// 当前显示图
const currentImg = ref(0);
const displayImage = computed(() => {
  if (banners && banners.length) {
    return banners[currentImg.value];
  }
  return image;
});
function changeImage(i: number) {
  currentImg.value = i;
}

// 价格格式化
function fmt(p: number | string | undefined) {
  if (p === undefined || p === null || p === "") return "";
  const n =
    typeof p === "number" ? p : Number(String(p).replace(/[^0-9.-]+/g, ""));
  if (isNaN(n)) return String(p);
  return n.toFixed(2);
}
const formattedPrice = computed(() => fmt(price));
const formattedOldPrice = computed(() => fmt(oldPrice));
const hasOldPrice = computed(
  () =>
    !!(
      oldPrice !== undefined &&
      oldPrice !== null &&
      String(formattedOldPrice.value) !== ""
    )
);

// 折扣百分比（向下取整）
const discountPercent = computed(() => {
  const p = Number(price);
  const o = Number(oldPrice ?? 0);
  if (!o || isNaN(p) || isNaN(o) || o <= p) return 0;
  return Math.floor(((o - p) / o) * 100);
});
</script>

<style scoped>
.card {
  --card-bg: #ffffff;
  --accent: #ff6fa3;
  --discount-color: #ef4444;
  --price-color: #d97706; /* 折后价格强调色 */
  width: 100%;
  background: var(--card-bg);
  border-radius: 14px;
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.04);
  transition: transform 0.22s ease, box-shadow 0.22s ease;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue",
    Arial;
}

.card__shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    120deg,
    rgba(255, 255, 255, 0) 40%,
    rgba(255, 255, 255, 0.85) 50%,
    rgba(255, 255, 255, 0) 60%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}
.card__glow {
  position: absolute;
  inset: -10px;
  background: radial-gradient(
    circle at 50% 0%,
    rgba(255, 111, 163, 0.12) 0%,
    rgba(255, 111, 163, 0) 70%
  );
  opacity: 0;
  transition: opacity 0.4s;
}

.card__content {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
}

.card__discount {
  position: absolute;
  top: 10px;
  right: 10px;
  background: linear-gradient(45deg, #ff6b6b, #ff4d4f);
  color: #fff;
  padding: 6px 8px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 12px;
  z-index: 5;
}

.card__image-wrap {
  position: relative;
}
.card__image {
  width: 100%;
  aspect-ratio: 3 / 4;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(45deg, #ff9a9e, #ff6fa3);
  display: flex;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  align-items: center;
  justify-content: center;
}
.card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.thumbs {
  position: absolute;
  left: 8px;
  bottom: 8px;
  display: flex;
  gap: 8px;
  padding: 6px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.28);
  z-index: 6;
}
.thumb {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.06);
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
  outline: 2px solid rgba(255, 215, 64, 0.12);
  transform: scale(1.02);
}

.card__text {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.card__title {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.card__description {
  font-size: 13px;
  color: #334155;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  opacity: 0.85;
}

.card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-top: auto;
}

.card__left {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.card__price-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.card__price-current {
  font-size: 18px;
  font-weight: 800;
  color: var(--price-color);
}
.card__price-old {
  font-size: 13px;
  color: #94a3b8;
  text-decoration: line-through;
}

.card__meta-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 2px;
  color: #64748b;
  font-size: 13px;
}
.card__sold {
  color: #64748b;
  font-size: 13px;
}
.card__rating {
  display: flex;
  gap: 4px;
  align-items: center;
}
.star {
  fill: rgba(148, 163, 184, 0.35);
  width: 14px;
  height: 14px;
}
.star--filled {
  fill: #ffd04b;
}

.card__right {
  display: flex;
  align-items: center;
}
.card__button {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(45deg, #ff9a9e, #ff6fa3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border: none;
  cursor: pointer;
  transition: transform 0.16s;
}
.card__button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(249, 132, 169, 0.12);
}

.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  /* border-color: rgba(124, 58, 237, 0.2); */
  border-color: rgb(255 111 163 / 0.2);
  /* border-color:rgba(red, green, blue, alpha) ; */
}

.card:hover .card__shine {
  opacity: 1;
  animation: shine 3s infinite;
}
.card:hover .card__glow {
  opacity: 1;
}

@keyframes shine {
  0% {
    background-position: -100% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>
