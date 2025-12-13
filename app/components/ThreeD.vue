<template>
  <div class="wrapper">
    <div class="inner" :style="{ '--quantity': images.length }">
      <div
        v-for="(img, index) in images"
        :key="index"
        class="card"
        :style="{ '--index': index }"
      >
        <div class="img-box">
          <img :src="img" class="img" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const images = [
  "https://picsum.photos/seed/1/200/300",
  "https://picsum.photos/seed/2/200/300",
  "https://picsum.photos/seed/3/200/300",
  "https://picsum.photos/seed/4/200/300",
  "https://picsum.photos/seed/5/200/300",
  "https://picsum.photos/seed/6/200/300",
  "https://picsum.photos/seed/7/200/300",
  "https://picsum.photos/seed/8/200/300",
  "https://picsum.photos/seed/9/200/300",
  "https://picsum.photos/seed/10/200/300",
];
</script>

<style scoped lang="postcss">
/* wrapper background + center layout */
.wrapper {
  @apply w-full h-screen flex items-center justify-center bg-[#212121] overflow-hidden;
}

/* container of rotating cards */
.inner {
  --w: 100px;
  --h: 150px;
  --translateZ: calc((var(--w) + var(--h)) + 0px);
  --rotateX: -15deg;
  --perspective: 1000px;
  @apply absolute;
  width: var(--w);
  height: var(--h);
  top: 25%;
  left: calc(50% - (var(--w) / 2) - 2.5px);
  transform-style: preserve-3d;
  transform: perspective(var(--perspective));
  animation: rotating 20s linear infinite;
}

/* rotation animation */
@keyframes rotating {
  from {
    transform: perspective(var(--perspective)) rotateX(var(--rotateX))
      rotateY(0);
  }
  to {
    transform: perspective(var(--perspective)) rotateX(var(--rotateX))
      rotateY(1turn);
  }
}

/* each card */
.card {
  @apply absolute rounded-xl overflow-hidden;
  inset: 0;
  transform: rotateY(calc((360deg / var(--quantity)) * var(--index)))
    translateZ(var(--translateZ));
  -webkit-box-reflect: below 10px
    linear-gradient(transparent, rgba(0, 0, 0, 0.5));
}

/* image container */
.img-box {
  @apply w-full h-full;
}

/* image itself */
.img {
  @apply w-full h-full object-cover;
}
</style>
