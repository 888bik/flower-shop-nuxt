<template>
  <div class="bg-page text-primary min-h-screen">
    <!-- 滚动条 -->
    <AnnouncementBar :announcements="announcements" :speed="1" />

    <!-- 轮播图 -->
    <div class="home-banner-wrap relative">
      <aside
        class="absolute z-10 left-20 top-20 w-[240px] bg-gray-600/60 p-4 rounded"
      >
        <div v-for="c in homeCategoryList" :key="c.typeId" class="mb-5">
          <!-- 一级分类 -->
          <div class="text-white font-semibold mb-2">
            {{ c.name }}
          </div>

          <!-- 二级分类 -->
          <div class="grid grid-cols-3 gap-2 border-b border-white/30 pb-1">
            <div
              v-for="sub in c.children"
              :key="sub.id"
              class="text-white text-sm text-center cursor-pointer"
              @click="goCategory(sub.id, sub.name)"
            >
              <span class="hover:text-[#E97351]">
                {{ sub.name }}
              </span>
            </div>
          </div>
        </div>
      </aside>

      <BannerCarousel />
    </div>

    <section class="mx-auto max-w-[1240px] mt-16">
      <Festival class="h-[400px]" />
    </section>

    <section class="mt-16">
      <div class="scene-wrap">
        <CategoryCard />
      </div>
    </section>

    <main class="container mx-auto px-6 pb-16 max-w-[1400px]">
      <div v-if="homeLoading" class="flex justify-center py-12">
        <ThreeBodyLoader />
      </div>
      <div v-else>
        <div
          v-for="(item, index) in homeFloors"
          :key="index"
          :id="'floor-' + item.id"
        >
          <ProductGridWithBanner
            :products="item.products"
            :title="item.title"
            :banner="item.bannerImage"
            :category-id="item.categoryId"
            @add="onAdd"
            @click-card="onClickCard"
            class="mt-14"
          />
        </div>
      </div>
    </main>
    <RightNavBar
      :sections="
        homeFloors.map((f) => ({ id: 'floor-' + f.id, label: f.title }))
      "
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import ThreeBodyLoader from "~/assets/base-ui/ThreeBodyLoader.vue";
import ProductGridWithBanner from "~/components/ProductGridWithBanner.vue";
import RightNavBar from "~/components/RightNavBar.vue";
import type { CategoryGroup, ProductItem } from "~/types/api/goods";
import type { GoodsSimple, HomeFloor } from "~/types/api/home";
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

useSeo({
  title: "鲜花速递_生日鲜花_节日鲜花【花间雅苑】",
  description:
    "花语商城提供全国鲜花速递服务，生日、表白、节日、商务鲜花当天送达。",
  type: "website",
});

const { $api } = useNuxtApp();

const cartStore = useCartStore();
import { useRouter } from "vue-router";
const router = useRouter();

const homeCategoryList = ref<CategoryGroup[]>();
const homeFloors = ref<HomeFloor[]>([]);
const homeLoading = ref(false);

// 通知公告
const noticeList = ref<NoticeItem[]>([]);
const announcements = computed(() =>
  noticeList.value.map((item) => ({
    id: item.id,
    title: item.content,
    link: "/",
  }))
);

const onAdd = async (p: GoodsSimple) => {
  await cartStore.addCart(p.id, 1);
};

function goCategory(subId: number, name: string) {
  router.push({ path: "/category", query: { cid: subId, name } });
}

function onClickCard(product: any) {
  router.push(`/detail/${product.id}`);
}

// 初次加载
onMounted(async () => {
  const noticeRes = await $api.notice.getNoticeList();
  noticeList.value = noticeRes?.list ?? [];

  const categoryRes = await $api.goods.getCategoryList();
  homeCategoryList.value = categoryRes ?? [];

  try {
    homeLoading.value = true;
    const res = await $api.home.getHomeFloors();
    homeFloors.value = res || [];
  } catch (err) {
    console.error(err);
  } finally {
    homeLoading.value = false;
  }
});
</script>

<style scoped>
.scene-wrap {
  width: 1240px;
  margin: 0 auto;
  display: flex;
  gap: 20px;
}
</style>
