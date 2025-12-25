<template>
  <div
    v-if="loading"
    class="fixed inset-0 z-50 flex items-center justify-center bg-page"
  >
    <ThreeBodyLoader class="w-32 h-32" />
  </div>
  <div v-else>
    <Images
      :images-data="detailInfo?.banners ?? []"
      @require-login="openLoginDialog"
    />

    <Info
      v-if="detailInfo?.sales"
      :sales="detailInfo?.sales"
      :review-data="{ list: reviewInfo.list, total: reviewInfo.total }"
      :detail="{
        title: detailInfo.title,
        id: detailInfo.id,
        price: detailInfo.price.displayMin,
        unit: detailInfo.unit,
        contentHtml: detailInfo.contentHtml,
        desc: detailInfo.description ?? '',
      }"
    />
  </div>

  <v-dialog v-model="dialogVisible" width="auto">
    <v-card
      max-width="400"
      prepend-icon="mdi-information"
      text="登录后即可收藏商品，是否前往登录？"
      title="提示？"
    >
      <template v-slot:actions>
        <v-btn text @click="dialogVisible = false">取消</v-btn>
        <v-btn class="ms-auto" text color="red" @click="confirmLogin"
          >去登录</v-btn
        >
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { GoodsDetailResponse } from "~/types/api/goods";
import Images from "./_components/images.vue";
import Info from "./_components/info.vue";
import ThreeBodyLoader from "~/assets/base-ui/ThreeBodyLoader.vue";
import type { ReviewItem, ReviewListResponse } from "~/types/api/review";
import { useSeo } from "~/composables/useSeo";

const { $api } = useNuxtApp();
const route = useRoute();
const router = useRouter();

const goodsId = ref(Number(route.params.id));
const detailInfo = ref<GoodsDetailResponse>();
const loading = ref(false);

const likeCount = ref(0);
const isFavorite = ref(false);

const dialogVisible = ref(false);

const reviewInfo = ref<ReviewListResponse>({
  total: 0,
  page: 1,
  pageSize: 10,
  avgRating: 0,
  list: [],
});
const loadingReviews = ref(false);
/* 获取商品详情 */
const getGoodsDetailInfo = async () => {
  loading.value = true;
  try {
    const res = await $api.goods.getGoodsDetail(goodsId.value);
    detailInfo.value = res;

    // 收藏信息
    likeCount.value = res.likeCount;
    isFavorite.value = res.isFavorite;

    // 设置 SEO 和 JSON-LD
    // useSeo({
    //   title: res.title,
    //   description: res.description ?? "",
    //   image: res.cover ?? "",
    //   url: `https://www.yourdomain.com/product/${res.id}`,
    //   type: "website", // 页面为网站类型
    //   jsonLd: {
    //     "@context": "https://schema.org",
    //     "@type": "Product",
    //     name: res.title,
    //     image: [res.cover ?? ""],
    //     description: res.description ?? "",
    //     brand: {
    //       "@type": "Brand",
    //       name: "花语商城",
    //     },
    //     offers: {
    //       "@type": "Offer",
    //       price: Number(res.price.displayMin ?? 0),
    //       priceCurrency: "CNY",
    //       availability: "https://schema.org/InStock",
    //       url: `https://www.yourdomain.com/product/${res.id}`,
    //     },
    //   },
    // });
  } catch (err) {
    console.error(err);
    $toast.error("获取商品详情失败");
  } finally {
    loading.value = false;
  }
};
const getGoodsReviewList = async (append = false) => {
  if (loadingReviews.value) return;
  loadingReviews.value = true;
  try {
    const res = await $api.review.getReviewList(goodsId.value);
    if (append) {
      reviewInfo.value.list.push(...res.list);
    } else {
      reviewInfo.value = res;
    }
  } catch (error) {
    $toast.error(`获取数据失败`);
  } finally {
    loadingReviews.value = false;
  }
};
const loadMoreReviews = () => {
  if (reviewInfo.value.list.length >= reviewInfo.value.total) return;
  reviewInfo.value.page++;
  getGoodsReviewList(true);
};

const openLoginDialog = () => {
  dialogVisible.value = true;
};

const confirmLogin = () => {
  dialogVisible.value = false;
  router.push({
    path: "/login",
    query: { redirect: route.fullPath },
  });
};

watch(detailInfo, (v) => {
  if (!v) return;
  likeCount.value = v.likeCount;
  isFavorite.value = v.isFavorite;
});

provide("goodsFavorite", {
  likeCount,
  isFavorite,
  goodsId,
});

onMounted(() => {
  getGoodsDetailInfo();
  getGoodsReviewList();
});
</script>

<style scoped></style>
