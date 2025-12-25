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

      <TransitionGroup
        name="favorite"
        tag="div"
        class="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <ProductCardV3
          v-for="item in favorites"
          :key="item.id"
          :title="item.title"
          :image="item.cover"
          :unit="item.unit"
          :price="item.minPrice"
          class="w-full h-full"
          @click="goToDetail(item.id)"
          @btn-click="handleBtnClick(item.id)"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts" client>
import { ref, onMounted } from "vue";
import Favorite from "~/assets/base-ui/Favorite.vue";
import ThreeBodyLoader from "~/assets/base-ui/ThreeBodyLoader.vue";
import ProductCardV3 from "~/components/ProductCard-v3.vue";
import type { FavoriteGoodsItem } from "~/types/api/user";

definePageMeta({ layout: "profile" });

const { $api } = useNuxtApp();
const router = useRouter();

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

const goToDetail = (id: number) => {
  router.push(`/detail/${id}`);
};
const handleBtnClick = async (id: number) => {
  //找到被移除的 item 和位置（用于回滚）
  const index = favorites.value.findIndex((i) => i.id === id);
  if (index === -1) return;

  const removedItem = favorites.value[index];
  if (!removedItem) return;

  // 乐观更新：先从列表中移除
  favorites.value.splice(index, 1);
  try {
    await $api.user.toggleGoodsFavorite(id, false);
    $toast.success("取消成功");
  } catch (error) {
    favorites.value.splice(index, 0, removedItem);
    $toast.error("取消收藏失败，请稍后再试");
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
.favorite-enter-active,
.favorite-leave-active {
  transition: all 0.3s ease;
}

.favorite-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.favorite-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
