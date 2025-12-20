<template>
  <div class="card-container">
    <div class="card-effect">
      <div class="card-inner">
        <div class="card__liquid"></div>
        <div class="card__shine"></div>
        <div class="card__glow"></div>
        <div class="card__content">
          <div class="card__badge">{{ badge }}</div>
          <div class="card__image" style="--bg-color: #ff6b6b">
            <img :src="image" alt="" />
          </div>
          <div class="card__text">
            <p class="card__title">{{ title }}</p>
            <p class="card__description">
              {{ description }}
            </p>
          </div>
          <div class="card__footer">
            <div class="card__price">¥{{ price }} / {{ unit }}</div>
            <div class="card__button" @click.stop="$emit('BtnClick')">
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path
                  d="M12 21s-6.7-4.35-9.33-7.03C.6 11.9.4 8.5 2.5 6.4 4.6 4.3 8 4.6 10.1 6.7L12 8.6l1.9-1.9c2.1-2.1 5.5-2.4 7.6-.3 2.1 2.1 1.9 5.5-.2 7.6C18.7 16.65 12 21 12 21z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
interface IProps {
  badge?: string | number;
  title: string | number;
  desc?: string | number;
  price: string | number;
  image: string;
  unit: string | number;
}
interface IEmits {
  (e: "BtnClick"): void;
}
const {
  badge = "HOT",
  title,
  desc,
  price,
  image,
  unit,
} = defineProps<IProps>();
const description = desc ?? "鲜花，温暖你的每一天";
const emit = defineEmits<IEmits>();
</script>

<style scoped>
.card-effect {
  perspective: 1000px;
}

.card-inner {
  --card-bg: #fff0f5;
  --card-accent: #ff7f50;
  --card-text: #333;
  --card-shadow: 0 12px 24px rgba(255, 127, 80, 0.2);
  width: 220px;
  height: 290px;
  background: var(--card-bg);
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1),
    box-shadow 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  box-shadow: var(--card-shadow);
  border: 1px solid rgba(255, 255, 255, 0.3);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, sans-serif;
  transform-style: preserve-3d; /* Required for 3D effects */
}

.card-inner:hover {
  transform: rotateY(10deg) rotateX(10deg) translateZ(10px);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2);
}

.card__liquid {
  position: absolute;
  top: -80px;
  left: 0;
  width: 300px;
  height: 200px;
  background: #ff7f50;
  border-radius: 50%;
  transform: translateZ(-80px); /* Position behind the card */
  filter: blur(80px);
  transition: transform 0.7s cubic-bezier(0.36, 0, 0.66, -0.56),
    opacity 0.3s ease-in-out;
  opacity: 0; /* Initially hidden */
}

.card-inner:hover .card__liquid {
  transform: translateZ(-50px) translateY(30px) translateX(-20px) rotate(-20deg)
    scale(1.2);
  opacity: 0.7; /* Fade in on hover */
}

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
  transition: opacity 0.4s ease-in-out;
}

.card-inner:hover .card__shine {
  opacity: 1;
  animation: shine-effect 2s infinite linear;
}

.card__glow {
  position: absolute;
  inset: -15px;
  background: radial-gradient(
    circle at 50% 0%,
    rgba(255, 127, 80, 0.4) 0%,
    rgba(255, 127, 80, 0) 60%
  );
  opacity: 0;
  transition: opacity 0.6s ease-in-out;
}

.card-inner:hover .card__glow {
  opacity: 1;
}

.card__content {
  padding: 1.5em;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1em;
  position: relative;
  z-index: 2;
}

.card__badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: #f9a825;
  color: white;
  padding: 0.3em 0.6em;
  border-radius: 999px;
  font-size: 0.8em;
  font-weight: 600;
  transform: scale(0.7);
  opacity: 0;
  transition: all 0.5s ease 0.2s;
}

.card-inner:hover .card__badge {
  transform: scale(1);
  opacity: 1;
  z-index: 1;
}

.card__image {
  width: 100%;
  height: 120px;
  background: var(--bg-color);
  border-radius: 15px;
  transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

.card-inner:hover .card__image {
  transform: translateY(-8px) scale(1.05);
}

.card__image::after {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(
      circle at 20% 80%,
      rgba(255, 255, 255, 0.15) 0%,
      transparent 40%
    ),
    repeating-linear-gradient(
      -45deg,
      rgba(255, 255, 255, 0.05) 0px,
      rgba(255, 255, 255, 0.05) 3px,
      transparent 3px,
      transparent 6px
    );
  opacity: 0.6;
}

.card__text {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

.card__title {
  color: var(--card-text);
  font-size: 1.2em;
  margin: 0;
  font-weight: 700;
  transition: color 0.4s ease-in-out, transform 0.4s ease-in-out;
}

.card-inner:hover .card__title {
  color: var(--card-accent);
  transform: translateX(3px);
}

.card__description {
  color: var(--card-text);
  font-size: 0.85em;
  margin: 0;
  opacity: 0.8;
  transition: opacity 0.4s ease-in-out, transform 0.4s ease-in-out;
}

.card-inner:hover .card__description {
  opacity: 1;
  transform: translateX(3px);
}

.card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.card__price {
  color: var(--card-text);
  font-weight: 700;
  font-size: 1.1em;
  transition: color 0.4s ease-in-out, transform 0.4s ease-in-out;
}

.card-inner:hover .card__price {
  color: var(--card-accent);
  transform: translateX(3px);
}

.card__button {
  width: 32px;
  height: 32px;
  background: var(--card-accent);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: transform 0.4s ease-in-out, box-shadow 0.4s ease-in-out;
  transform: scale(0.85);
}

.card-inner:hover .card__button {
  transform: scale(1);
  box-shadow: 0 0 0 5px rgba(255, 138, 101, 0.3);
}

.card-inner:hover .card__button svg {
  animation: pulse-button 1.5s infinite;
}

/* Animations */
@keyframes shine-effect {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(200%);
  }
}

@keyframes pulse-button {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
  100% {
    transform: scale(1);
  }
}
</style>
