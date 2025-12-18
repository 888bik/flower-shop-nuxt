<template>
  <div class="favorites-page px-6 py-10 max-w-5xl mx-auto theme-pink">
    <h1 class="text-2xl font-semibold text-text mb-6">我的收藏</h1>

    <div v-if="loading" class="flex justify-center py-20">
      <ThreeBodyLoader class="w-16 h-16" />
    </div>

    <div v-else>
      <div v-if="favorites.length === 0" class="text-center text-gray-500">
        你还没有收藏的商品
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          v-for="item in favorites"
          :key="item.id"
          class="relative border rounded-lg overflow-hidden shadow"
        >
          <NuxtLink :to="`/detail/${item.id}`">
            <img :src="item.cover" alt="" class="w-full h-40 object-cover" />
            <div class="p-2">
              <div class="font-medium text-sm truncate">{{ item.title }}</div>
              <div class="text-red-500 text-sm mt-1">
                {{ item.minPrice }} 元/{{ item.unit }}
              </div>
            </div>
          </NuxtLink>

          <!-- 收藏按钮 -->
          <!-- <Favorite
            :goods-id="item.id"
            v-model:isFavorite="item.isFavorite"
            v-model:likeCount="item.likeCount"
            class="absolute top-2 right-2"
          /> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Favorite from "~/assets/base-ui/Favorite.vue";
import ThreeBodyLoader from "~/assets/base-ui/ThreeBodyLoader.vue";
import type { FavoriteGoodsItem } from "~/types/api/user";

definePageMeta({ layout: "profile" });

const { $api } = useNuxtApp();

const favorites = ref<FavoriteGoodsItem[]>([]);
const loading = ref(false);

const getFavorites = async () => {
  loading.value = true;
  try {
    const res = await $api.user.getFavoritesGoods();
    favorites.value = res.list;
  } catch (err) {
    console.error(err);
    $toast.error("获取收藏列表失败");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getFavorites();
});
</script>

<style scoped>
.favorites-page img {
  transition: transform 0.3s;
}
.favorites-page img:hover {
  transform: scale(1.05);
}
</style>
