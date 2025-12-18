<template>
  <div class="gallery flex h-[600px] relative">
    <!-- 左大图 -->
    <div class="w-1/2 relative overflow-hidden">
      <img
        :src="displayImages[0]"
        alt=""
        class="gallery-img w-full h-full object-cover"
      />
    </div>

    <!-- 右侧小图 2x2 -->
    <div class="w-1/2 flex flex-wrap">
      <div
        v-for="(img, i) in displayImages.slice(1, 5)"
        :key="i"
        class="w-1/2 h-1/2 relative overflow-hidden border border-black"
      >
        <img :src="img" alt="" class="gallery-img w-full h-full object-cover" />
      </div>
    </div>

    <div class="absolute top-2 right-2 z-10 p-2 shadow" @click.stop>
      <Favorite @require-login="onRequireLogin" @toggled="onToggled" />
    </div>
    <div class="absolute bottom-2 right-2 z-10 p-2 shadow">
      <v-btn>查看图片</v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Favorite from "~/assets/base-ui/Favorite.vue";

interface IProps {
  imagesData: string[];
}
interface IEmit {
  (e: "require-login"): void;
  (e: "toggled", payload: { isFavorite: boolean; likeCount: number }): void;
}

const emit = defineEmits<IEmit>();
const { imagesData } = defineProps<IProps>();

const displayImages = computed(() => {
  const arr = [...imagesData];
  while (arr.length < 5 && arr.length > 0) {
    arr.push(arr[arr.length - 1] ?? "");
  }
  return arr;
});

function onRequireLogin() {
  emit("require-login");
}
function onToggled(payload: { isFavorite: boolean; likeCount: number }) {
  emit("toggled", payload);
}
</script>

<style scoped>
/* 平滑过渡 */
.gallery-img {
  transition: transform 0.3s ease, filter 0.18s ease;
  will-change: transform, filter;
}

/* 当 gallery 中存在被 hover 的图片时，非 hover 图片变暗 */
.gallery:has(.gallery-img:hover) .gallery-img:not(:hover) {
  filter: brightness(0.7);
}

/* 当前 hover 图片亮 + 放大 */
.gallery-img:hover {
  transform: scale(1.05);
  filter: brightness(1);
}
</style>
