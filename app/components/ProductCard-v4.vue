<template>
  <div class="card-horizontal group" @click="$emit('click')">
    <!-- 左侧图片 -->
    <div class="card-media">
      <img :src="image" class="media-img" />
      <div class="card__liquid"></div>
      <div class="card__shine"></div>
      <div class="card__glow"></div>

      <span v-if="badge" class="badge">{{ badge }}</span>
    </div>

    <!-- 右侧内容 -->
    <div class="card-body">
      <h3 class="card-title">{{ title }}</h3>
      <div class="card-price">
        ¥{{ formatPrice(price) }} <span class="unit">/ {{ unit }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string | number;
  price: string | number;
  image: string;
  unit?: string | number;
  badge?: string | number;
}
const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "click"): void;
}>();

const { title, price, image, unit = "件", badge } = props;

function formatPrice(p: string | number) {
  const n = Number(p);
  return isNaN(n) ? String(p) : n % 1 === 0 ? String(n) : n.toFixed(2);
}
</script>

<style scoped>
.card-horizontal {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 12px;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.4s cubic-bezier(0.2, 0.9, 0.2, 1), box-shadow 0.4s;
  box-shadow: 0 8px 20px rgba(16, 24, 40, 0.06);
  border: 1px solid rgba(16, 24, 40, 0.04);
  background: white;
}

.card-horizontal:hover {
  transform: translateY(-6px) scale(1.01);
  box-shadow: 0 20px 40px rgba(16, 24, 40, 0.12);
}

.card-media {
  position: relative;
  width: 120px;
  height: 100%;
  flex-shrink: 0;
  border-radius: 12px;
  overflow: hidden;
}

.media-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s;
}

.card-horizontal:hover .media-img {
  transform: scale(1.06);
}

/* 液体流动 */
.card__liquid {
  position: absolute;
  top: -40px;
  left: -30px;
  width: 160px;
  height: 100px;
  background: #ff6b6b;
  border-radius: 50%;
  filter: blur(50px);
  transform: translateY(0) rotate(0deg);
  transition: all 0.6s ease;
  opacity: 0.6;
}

.card-horizontal:hover .card__liquid {
  transform: translateY(15px) rotate(-20deg) scale(1.2);
  opacity: 0.7;
}

/* 光泽与发光 */
.card__shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 30%,
    rgba(255, 255, 255, 0.6) 50%,
    rgba(255, 255, 255, 0.1) 70%
  );
  opacity: 0;
  transition: opacity 0.4s;
}

.card-horizontal:hover .card__shine {
  opacity: 1;
  animation: shine-effect 2s infinite linear;
}

.card__glow {
  position: absolute;
  inset: -10px;
  background: radial-gradient(
    circle at 50% 0%,
    rgba(255, 107, 107, 0.4) 0%,
    rgba(255, 107, 107, 0) 60%
  );
  opacity: 0;
  transition: opacity 0.6s;
}

.card-horizontal:hover .card__glow {
  opacity: 1;
}

/* badge */
.badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: linear-gradient(90deg, #ff6b6b, #ff8a6b);
  color: #fff;
  font-weight: 700;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 999px;
  box-shadow: 0 6px 12px rgba(255, 107, 107, 0.14);
}

/* 卡片正文 */
.card-body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  padding-right: 12px;
  flex: 1;
}

.card-title {
  font-size: 14px;
  font-weight: 700;
  color: rgba(17, 24, 39, 0.9);
  line-height: 1.2;
}

.card-price {
  font-size: 15px;
  font-weight: 800;
  color: #ef4444;
}

.unit {
  font-size: 12px;
  font-weight: 500;
  color: rgba(17, 24, 39, 0.6);
}

@keyframes shine-effect {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(200%);
  }
}
</style>
