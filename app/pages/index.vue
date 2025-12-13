<template>
  <div class="home-page">
    <!-- Banner -->
    <div class="home-banner">
      <BannerCarousel />
    </div>

    <div class="min-h-screen bg-[#0b0b0c] text-white">
      <!-- Hero Section -->
      <section class="relative overflow-hidden">
        <div class="bg-cover bg-center h-[420px] flex items-center">
          <div class="container mx-auto px-6">
            <div class="max-w-xl">
              <h1 class="text-4xl md:text-6xl font-bold text-white drop-shadow">
                花间雅苑 · 轻奢花艺
              </h1>
              <p class="mt-4 text-slate-200">
                每天一束，用心到达 — 鲜花礼盒 / 永生花 / 绿植
              </p>
              <div class="mt-6 flex gap-3">
                <button
                  class="px-6 py-3 bg-[#d4af37] text-black rounded-md font-semibold"
                >
                  立即选购
                </button>
                <button
                  class="px-6 py-3 border border-white/10 rounded-md text-white/80"
                >
                  热销推荐
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 分类控制条 -->
      <section class="container mx-auto px-6 py-6">
        <div class="flex flex-wrap gap-3">
          <button
            :class="[
              'px-4 py-2 rounded-full text-sm',
              !selectedCategoryId
                ? 'bg-gold text-black'
                : 'bg-white/10 text-white/80',
            ]"
            @click="selectCategory(null)"
          >
            全部
          </button>
          <button
            v-for="c in categoryList"
            :key="c.id"
            :class="[
              'px-4 py-2 rounded-full text-sm',
              selectedCategoryId === c.id
                ? 'bg-gold text-black'
                : 'bg-white/10 text-white/80',
            ]"
            @click="selectCategory(c.id)"
          >
            {{ c.name }}
          </button>
        </div>
      </section>

      <!-- 商品列表 -->
      <main ref="gridRef" class="container mx-auto px-6 pb-16">
        <ProductGrid
          :product-list-data="displayedProducts"
          :total-count="filteredProducts.length"
          @add="onAddToCart"
          @quick="openQuickView"
        />

        <!-- 加载更多 -->
        <div class="flex justify-center mb-6">
          <button
            v-if="displayedProducts.length < filteredProducts.length"
            @click="loadMore"
            class="px-6 py-2 rounded-md bg-[#d4af37] text-black font-medium hover:bg-[#c59c2d]"
          >
            加载更多
          </button>
          <div v-else class="text-sm text-white/60">已加载全部</div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import BannerCarousel from "~/components/BannerCarousel.vue";
import ProductGrid from "~/components/ProductGrid.vue";
import type { ProductItem } from "~/types/api/good";

const { $api } = useNuxtApp();

// 分类
const categoryList = ref<{ id: number; name: string }[]>([]);
const selectedCategoryId = ref<number | null>(null);

// 商品列表
const allProducts = ref<ProductItem[]>([]);
const displayedProducts = ref<ProductItem[]>([]);

// 分页控制
const pageSize = 12;
const currentPage = ref(1);

// 过滤后的商品列表
const filteredProducts = computed(() => {
  if (!selectedCategoryId.value) return allProducts.value;
  return allProducts.value.filter((p) =>
    p.categories.some((c) => c.id === selectedCategoryId.value)
  );
});

// 获取商品和分类
onMounted(async () => {
  try {
    const res = await $api.goods.getProductList();
    allProducts.value = res.list ?? [];
    resetDisplay(); // 初始化第一页

    const categories = await $api.goods.getCategoryList();
    categoryList.value = categories ?? [];
  } catch (error) {
    console.error("获取商品或分类失败", error);
  }
});

// 初始化显示第一页
function resetDisplay() {
  currentPage.value = 1;
  displayedProducts.value = filteredProducts.value.slice(0, pageSize);
}

// 加载更多
function loadMore() {
  currentPage.value++;
  const start = (currentPage.value - 1) * pageSize;
  const end = currentPage.value * pageSize;
  displayedProducts.value.push(...filteredProducts.value.slice(start, end));
}

// 分类切换
function selectCategory(id: number | null) {
  selectedCategoryId.value = id;
}

// 当过滤列表变化时重置分页
watch(filteredProducts, () => resetDisplay());

// 操作事件
function onAddToCart(p: ProductItem) {
  console.log("加入购物车", p);
}

function openQuickView(p: ProductItem) {
  console.log("快速预览", p);
}
</script>

<style scoped></style>
