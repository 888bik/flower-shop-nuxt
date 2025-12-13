<template>
  <div class="relative w-full">
    <!-- 外层容器控制响应式高度（这里用 tailwind + 自定义 CSS） -->
    <div class="banner-outer">
      <Swiper
        class="banner-swiper w-full"
        :slides-per-view="1"
        :loop="true"
        :autoplay="{ delay: 4000, disableOnInteraction: false }"
        pagination
        navigation
      >
        <SwiperSlide v-for="(slide, index) in slides" :key="index">
          <!-- 这里内部主体使用 h-full，确保填满 slide -->
          <div
            class="w-full h-full bg-cover bg-center flex items-center justify-center relative"
            :style="{ backgroundImage: `url(${slide.image})` }"
          >
            <div class="absolute inset-0 flex items-center px-6 md:px-12">
              <div class="space-y-2">
                <h2
                  class="text-xl md:text-4xl font-bold text-white bg-black/40 px-2 py-1 rounded"
                >
                  {{ slide.title }}
                </h2>
                <p
                  class="text-sm md:text-lg text-white bg-black/29 px-2 py-0.5 rounded"
                >
                  {{ slide.subtitle }}
                </p>
                <button
                  class="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-400 transition"
                >
                  {{ slide.btnText }}
                </button>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  </div>
</template>

<script setup lang="ts">
import SwiperCore from "swiper";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

SwiperCore.use([Autoplay, Pagination, Navigation]);

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const slides = [
  {
    image: "/images/banner1.png",
    title: "每日鲜花配送",
    subtitle: "新鲜花束，送达每一个美好时刻",
    btnText: "立即选购",
  },
  {
    image: "/images/banner2.png",
    title: "轻奢黑金花艺",
    subtitle: "为家增添高级质感",
    btnText: "了解详情",
  },
  {
    image: "/images/banner3.jpg",
    title: "节日特惠花束",
    subtitle: "心意满满，送给最爱的人",
    btnText: "立即购买",
  },
];
</script>

<style>
.banner-outer {
  height: 529px;
}

@media (max-width: 768px) {
  .banner-outer {
    height: 384px;
  }
}

/* 强制让 Swiper 的内部结构完全继承外层高度 */
.banner-swiper,
.banner-swiper .swiper-wrapper,
.banner-swiper .swiper-slide {
  height: 100% !important;
}

.banner-swiper .swiper-slide > * {
  height: 100% !important;
}

.swiper-button-next,
.swiper-button-prev {
  color: #d4af37 !important;
}
.swiper-pagination-bullet {
  background: #d4af37 !important;
}
</style>
