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
import { flipSide } from "vuetify/lib/util/anchor.mjs";

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

const getGoodsDetailInfo = async () => {
  try {
    loading.value = true;
    detailInfo.value = await $api.goods.getGoodsDetail(goodsId.value);
    console.log(detailInfo.value);
  } catch (error) {
    $toast.error("获取数据失败");
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
