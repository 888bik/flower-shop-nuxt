<template>
  <div
    class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition"
  >
    <NuxtLink :to="`/product/${item.id}`" class="block">
      <div class="w-full h-56 md:h-48 lg:h-56 overflow-hidden">
        <img :src="item.cover" alt="" class="w-full h-full object-cover" />
      </div>
      <div class="p-4">
        <h3 class="text-lg font-semibold text-gray-800 line-clamp-2">
          {{ item.title }}
        </h3>

        <p class="text-sm text-gray-500 mt-1 line-clamp-2">
          {{ item.description || item.category?.name }}
        </p>

        <div class="mt-3 flex items-center justify-between">
          <div>
            <div class="text-pink-600 font-extrabold text-xl">
              ¥{{ item.minPrice }}
            </div>
            <div class="text-xs text-gray-400">原价 ¥{{ item.minOprice }}</div>
          </div>

          <div class="text-right">
            <div class="flex items-center space-x-1">
              <template v-for="n in 5">
                <svg
                  v-if="n <= Math.round(item.rating || 0)"
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  :key="n"
                >
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.197 3.674a1 1 0 00.95.69h3.86c.969 0 1.371 1.24.588 1.81l-3.124 2.27a1 1 0 00-.364 1.118l1.197 3.674c.3.921-.755 1.688-1.54 1.118l-3.124-2.27a1 1 0 00-1.176 0l-3.124 2.27c-.785.57-1.84-.197-1.54-1.118l1.197-3.674a1 1 0 00-.364-1.118L2.355 9.1c-.783-.57-.38-1.81.588-1.81h3.86a1 1 0 00.95-.69l1.197-3.674z"
                  />
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 text-gray-200"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.197 3.674a1 1 0 00.95.69h3.86c.969 0 1.371 1.24.588 1.81l-3.124 2.27a1 1 0 00-.364 1.118l1.197 3.674c.3.921-.755 1.688-1.54 1.118l-3.124-2.27a1 1 0 00-1.176 0l-3.124 2.27c-.785.57-1.84-.197-1.54-1.118l1.197-3.674a1 1 0 00-.364-1.118L2.355 9.1c-.783-.57-.38-1.81.588-1.81h3.86a1 1 0 00.95-.69l1.197-3.674z"
                  />
                </svg>
              </template>
            </div>
            <div class="text-xs text-gray-500 mt-1">
              销量 {{ item.saleCount }}
            </div>
          </div>
        </div>
      </div>
    </NuxtLink>

    <div class="p-3 border-t flex items-center justify-between">
      <button
        @click="$emit('quick-add', item)"
        class="px-3 py-2 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700 transition"
      >
        加入购物车
      </button>
      <NuxtLink
        :to="`/product/${item.id}`"
        class="text-xs text-gray-500 hover:text-gray-700"
        >查看详情 →</NuxtLink
      >
    </div>
  </div>
</template>

<script setup>
defineProps({
  item: { type: Object, required: true },
});
</script>

<style scoped>
/* 如果需要单独样式可以加在这里 */
</style>
