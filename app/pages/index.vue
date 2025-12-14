<template>
  <div class="home-page bg-page text-primary min-h-screen">
    <!-- Banner -->
    <div class="home-banner">
      <BannerCarousel />
    </div>

    <div>
      <!-- Hero Section -->
      <section class="relative overflow-hidden">
        <div class="hero-bg h-[420px] flex items-center">
          <div class="container mx-auto px-6 mt-9">
            <div class="max-w-xl">
              <h1
                class="text-4xl md:text-6xl font-bold text-heading leading-tight"
              >
                花间雅苑 · 温柔礼花
              </h1>
              <p class="mt-4 text-muted">
                每天一束，用心到达 — 鲜花礼盒 / 永生花 / 绿植
              </p>
              <div class="mt-6 flex gap-3">
                <!-- 主行动按钮：用变量保证随主题切换 -->
                <button
                  @click="$router.push('/category')"
                  class="rounded-md font-semibold px-6 py-3 shadow-sm"
                  :style="{
                    background: 'var(--c-primary)',
                    color: '#ffffff',
                  }"
                >
                  立即选购
                </button>

                <button
                  class="rounded-md px-6 py-3 border"
                  :style="{
                    borderColor:
                      'color-mix(in srgb, var(--c-surface) 30%, #000 0%)',
                    background: 'transparent',
                    color: 'var(--c-muted)',
                  }"
                >
                  热销推荐
                </button>
              </div>
            </div>

            <!-- 可选装饰图（desktop） -->
            <div
              class="hidden md:block ml-8 w-full h-[220px] rounded-lg shadow-lg"
            >
              <!-- 把你的装饰图放到 /public/images/hero-flower.jpg -->
              <img
                src="/images/hero-flower.webp"
                alt="hero"
                class="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- 分类控制条 -->
      <section class="container mx-auto px-6 py-6">
        <div class="flex flex-wrap gap-3">
          <button
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium',
              !selectedCategoryId ? 'active-pill' : 'pill-surface',
            ]"
            @click="selectCategory(null)"
            :aria-pressed="!selectedCategoryId"
          >
            全部
          </button>

          <button
            v-for="c in categoryList"
            :key="c.id"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium',
              selectedCategoryId === c.id ? 'active-pill' : 'pill-surface',
            ]"
            @click="selectCategory(c.id)"
            :aria-pressed="selectedCategoryId === c.id"
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
          class="mt-4"
        />

        <!-- 加载更多 -->
        <div class="flex justify-center mb-6">
          <button
            v-if="displayedProducts.length < filteredProducts.length"
            @click="loadMore"
            class="px-6 py-2 rounded-md font-medium shadow"
            :style="{ background: 'var(--c-primary)', color: '#fff' }"
          >
            加载更多
          </button>

          <div v-else class="text-sm text-muted">已加载全部</div>
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
    (p.categories ?? []).some((c) => c.id === selectedCategoryId.value)
  );
});

// 获取商品和分类（客户端）
onMounted(async () => {
  try {
    // 推荐：后端分页接口也可以按需调用；这里为了 UI 立即响应我们一次拉全部（以你当前后端为准）
    const res = await $api.goods.getProductList();
    allProducts.value = res?.list ?? [];
    // 初始化第一页显示
    resetDisplay();

    const cats = await $api.goods.getCategoryList();
    categoryList.value = cats ?? [];
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

// 当过滤列表变化时重置分页（分类切换或数据更新都会触发）
watch(filteredProducts, () => resetDisplay());

// 操作事件
function onAddToCart(p: ProductItem) {
  // 这里挂接你的购物车逻辑
  console.log("加入购物车", p);
}

function openQuickView(p: ProductItem) {
  console.log("快速预览", p);
}
</script>

<style scoped>
/* hero 背景：渐变 + 可替换的图片（图片放到 public/images/hero-bg-pink.jpg） */
.hero-bg {
  background-image: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.72),
      rgba(255, 255, 255, 0.92)
    ),
    url("/images/hero-bg-pink.jpg");
  background-size: cover;
  background-position: center;
}

/* pill 状态 */
.pill-surface {
  background: var(--c-surface);
  color: var(--c-text);
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.active-pill {
  background: var(--c-primary);
  color: #fff;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}

/* 少量响应式微调 */
@media (max-width: 768px) {
  .hero-bg {
    height: 360px;
  }
}
</style>
