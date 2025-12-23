<template>
  <div class="bg-page text-primary min-h-screen">
    <AnnouncementBar :announcements="announcements" :speed="1" />
    <!-- Banner -->
    <div class="home-banner">
      <BannerCarousel />
    </div>

    <section class="mx-auto max-w-[1440px] px-6 mt-10">
      <div class="max-w-xl">
        <h1 class="text-4xl md:text-6xl font-bold text-heading leading-tight">
          花间雅苑 · 温柔礼花
        </h1>

        <p class="mt-4 text-muted text-lg">
          每天一束，用心到达 — 鲜花礼盒 / 永生花 / 绿植
        </p>

        <div class="mt-8 flex gap-4">
          <button
            @click="$router.push('/category')"
            class="rounded-md font-semibold px-8 py-3 shadow bg-primary text-white"
          >
            立即选购
          </button>
          <button class="rounded-md px-8 py-3 border">热销推荐</button>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-[1240px] mt-16">
      <Festival class="h-[400px]" />
    </section>

    <section class="mt-16">
      <div class="scene-wrap">
        <CategoryCard />
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
    <main class="container mx-auto px-6 pb-16">
      <div>
        <ProductGrid
          :product-list-data="displayedProducts"
          :total-count="totalCount"
          class="mt-4"
        />
      </div>

      <!-- 加载更多 / 动画 -->
      <div class="flex justify-center mb-6" ref="loadMoreRef">
        <button
          v-if="!loadMoreLoading && hasMore"
          @click="loadMore"
          class="px-6 py-2 rounded-md font-medium shadow"
          :style="{ background: 'var(--c-primary)', color: '#fff' }"
        >
          <span class="text-sm text-white">加载更多</span>
        </button>

        <span v-else-if="loadMoreLoading">
          <ThreeBodyLoader />
        </span>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from "vue";
import ThreeBodyLoader from "~/assets/base-ui/ThreeBodyLoader.vue";
import type { ProductItem } from "~/types/api/goods";
import type { NoticeItem } from "~/types/api/notice";

// 异步组件懒加载
const AnnouncementBar = defineAsyncComponent(
  () => import("~/components/AnnouncementBar.vue")
);
const BannerCarousel = defineAsyncComponent(
  () => import("~/components/BannerCarousel.vue")
);
const CategoryCard = defineAsyncComponent(
  () => import("~/components/CategoryCard.vue")
);
const Festival = defineAsyncComponent(
  () => import("~/components/Festival.vue")
);
const ProductGrid = defineAsyncComponent(
  () => import("~/components/ProductGrid.vue")
);

useSeo({
  title: "鲜花速递_生日鲜花_节日鲜花【花间雅苑】",
  description:
    "花语商城提供全国鲜花速递服务，生日、表白、节日、商务鲜花当天送达。",
  type: "website",
});

const { $api } = useNuxtApp();

// 分类
const categoryList = ref<{ id: number; name: string }[]>([]);
const selectedCategoryId = ref<number | null>(null);

// 商品列表
const displayedProducts = ref<ProductItem[]>([]);
const totalCount = ref(0);
const pageSize = 12;
const currentPage = ref(1);
const loadMoreLoading = ref(false);
const hasMore = ref(false);

// 通知公告
const noticeList = ref<NoticeItem[]>([]);
const announcements = computed(() =>
  noticeList.value.map((item) => ({
    id: item.id,
    title: item.content,
    link: "/",
  }))
);
// 滚动加载
const loadMoreRef = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

// 分类切换
function selectCategory(id: number | null) {
  selectedCategoryId.value = id;
  fetchProducts(true);
}
async function loadMore() {
  await fetchProducts(false);
}
// 获取商品
const fetchProducts = async (reset = false) => {
  if (loadMoreLoading.value) return;
  loadMoreLoading.value = true;

  try {
    if (reset) currentPage.value = 1;

    const res = await $api.goods.getProductList(
      currentPage.value,
      pageSize,
      selectedCategoryId.value
    );

    const list = res?.list ?? [];
    totalCount.value = res?.totalCount ?? 0;

    if (reset) {
      displayedProducts.value = list;
    } else {
      displayedProducts.value.push(...list);
    }

    hasMore.value = displayedProducts.value.length < totalCount.value;
    currentPage.value++;
  } catch (error) {
    console.error("获取商品失败", error);
  } finally {
    loadMoreLoading.value = false;
  }
};

// 初次加载
onMounted(async () => {
  const noticeRes = await $api.notice.getNoticeList();
  noticeList.value = noticeRes?.list ?? [];

  const categoryRes = await $api.goods.getCategoryList();
  categoryList.value = categoryRes ?? [];
  await fetchProducts(true);
  if (
    typeof window !== "undefined" &&
    "IntersectionObserver" in window &&
    loadMoreRef.value
  ) {
    observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting && !loadMoreLoading.value && hasMore.value) {
        fetchProducts(false);
      }
    });
    observer.observe(loadMoreRef.value);
  }
});

onUnmounted(() => observer?.disconnect());
</script>

<style scoped>
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
.scene-wrap {
  width: 1240px;
  margin: 0 auto;
  display: flex;
  gap: 20px;
}
</style>
