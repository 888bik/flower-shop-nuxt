<template>
  <div class="min-h-screen bg-page py-10 text-text">
    <v-container class="py-4 max-w-6xl mx-auto">
      <v-row class="align-center mb-6">
        <v-col cols="auto">
          <v-btn icon @click="$router.back()">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </v-col>
        <v-col>
          <h1 class="text-h5 font-bold">订单评价</h1>
        </v-col>
        <v-col cols="auto">
          <v-btn text :to="`/orders/${orderId}`">返回订单详情</v-btn>
        </v-col>
      </v-row>

      <v-card>
        <v-card-text>
          <div v-if="loading" class="py-10 flex justify-center">
            <ThreeBodyLoader />
          </div>

          <div
            v-else-if="items.length === 0"
            class="py-10 text-center text-muted"
          >
            暂无可评价的商品或该订单尚未到可评价状态
          </div>

          <div v-else class="space-y-6">
            <div
              v-for="(it, idx) in items"
              :key="it.orderItemId"
              class="review-card"
            >
              <div class="card-top">
                <v-avatar size="80" class="me-4">
                  <v-img :src="it.goodsCover || placeholderImg" />
                </v-avatar>

                <div class="flex-1">
                  <div class="title-row">
                    <div class="goods-title">{{ it.goodsTitle }}</div>
                    <div class="goods-qty">x{{ it.num }}</div>
                  </div>

                  <div class="mt-3 rating-row">
                    <v-rating
                      v-model="it._rating"
                      half-increments
                      background-color="grey lighten-3"
                      color="amber darken-2"
                      length="5"
                      size="32"
                      dense
                      :readonly="!it.canReview"
                      :aria-label="`对 ${it.goodsTitle} 的评分`"
                    />
                    <div class="rating-value">
                      {{ displayRating(it._rating) }}
                    </div>
                  </div>

                  <div class="mt-3">
                    <v-textarea
                      v-model="it._content"
                      label="写下你的评价（选填）"
                      :readonly="!it.canReview"
                      auto-grow
                      rows="2"
                      maxlength="500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <v-divider />

            <div class="d-flex align-center justify-space-between">
              <v-checkbox v-model="anonymous" label="匿名评价" />
              <div class="text-caption text-muted">
                共 {{ items.length }} 件商品，已填写 {{ filledCount }} 项
              </div>
            </div>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn text @click="goBack" :disabled="submitting">取消</v-btn>
          <v-btn color="pink" dark :loading="submitting" @click="submit"
            >提交评价</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import ThreeBodyLoader from "~/assets/base-ui/ThreeBodyLoader.vue";

const route = useRoute();
const router = useRouter();
const { $api } = useNuxtApp();

const orderId = Number(route.params.orderId);

const loading = ref(false);
const submitting = ref(false);
const anonymous = ref(false);

const placeholderImg = "/placeholder.png";

type Item = {
  orderItemId: number;
  goodsId?: number;
  goodsTitle?: string;
  goodsCover?: string;
  num?: number;
  canReview?: boolean;

  _rating: number;
  _content: string;
};

const items = ref<Item[]>([]);

const filledCount = computed(() =>
  items.value.reduce(
    (acc, it) =>
      acc +
      (it._rating > 0 || (it._content && it._content.trim().length > 0)
        ? 1
        : 0),
    0
  )
);

function displayRating(v: number) {
  if (v % 1 === 0) return `${v.toFixed(0)}.0`;
  return v.toFixed(1);
}

async function loadItems(id: number) {
  loading.value = true;
  items.value = [];
  try {
    const res = await $api.orders.getReviewItems(id);
    const data = res?.data ?? res;
    if (!Array.isArray(data)) {
      items.value = [];
      return;
    }
    items.value = data.map((it: any) => ({
      orderItemId: it.orderItemId,
      goodsId: it.goodsId,
      goodsTitle: it.goodsTitle ?? it.goodsName ?? "商品",
      goodsCover: it.goodsCover ?? it.goods_cover,
      num: it.num ?? 1,
      canReview: it.canReview ?? true,
      _rating: 5,
      _content: "",
    }));
  } catch (err) {
    console.error("load review items error", err);
    $toast?.error?.("加载待评价商品失败");
    items.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  if (!orderId || Number.isNaN(orderId)) {
    $toast?.error?.("订单 ID 无效");
    router.replace("/orders");
    return;
  }
  loadItems(orderId);
});

function goBack() {
  router.back();
}

async function submit() {
  if (!orderId) return;
  const reviewable = items.value.filter((it) => it.canReview);
  if (reviewable.length === 0) {
    $toast?.success("没有可评价的商品");
    return;
  }

  for (const it of reviewable) {
    if (!it._rating || it._rating < 0.5) {
      $toast?.error(`请为 ${it.goodsTitle} 评分（至少半星）`);
      return;
    }
  }

  const payload = {
    anonymous: !!anonymous.value,
    items: reviewable.map((it) => ({
      orderItemId: it.orderItemId,
      rating: it._rating,
      content: it._content?.trim() ?? "",
      // images: [],
    })),
  };

  submitting.value = true;
  try {
    await $api.orders.submitReview(orderId, payload);
    $toast?.success("评价提交成功");
    router.replace("/orders");
  } catch (err) {
    console.error("submit review error", err);
    $toast?.error("评价提交失败，请稍后再试");
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.review-card {
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.04);
  padding: 14px;
  background: #fff;
}
.card-top {
  display: flex;
  align-items: flex-start;
}
.title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.goods-title {
  font-weight: 700;
  font-size: 16px;
}
.goods-qty {
  color: #666;
  font-size: 13px;
  margin-left: 12px;
}
.rating-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.rating-value {
  color: #444;
  font-weight: 600;
  min-width: 48px;
  text-align: left;
}
.text-muted {
  color: #9e9e9e;
}
</style>
