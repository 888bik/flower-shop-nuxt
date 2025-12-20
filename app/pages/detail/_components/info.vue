<template>
  <div class="goods-detail-preview bg-page min-h-screen text-text py-8">
    <div class="max-w-5xl mx-auto px-4 space-y-6">
      <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- 主信息（占 2 列） -->
        <div class="md:col-span-2 bg-surface rounded-xl p-6 shadow-soft-lg">
          <h1
            class="text-2xl md:text-3xl font-semibold text-text leading-tight"
          >
            {{ detail.title }}
          </h1>

          <div class="mt-3 flex items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="flex items-center gap-1">
                <template v-for="n in 5" :key="n">
                  <svg
                    viewBox="0 0 24 24"
                    class="w-4 h-4"
                    :class="
                      n <= Math.round(avgRating)
                        ? 'text-yellow-300'
                        : 'text-gray-200'
                    "
                  >
                    <path
                      d="M12 .587l3.668 7.431L23.4 9.6l-5.5 5.356L19.335 24 12 19.897 4.665 24l1.436-9.044L.6 9.6l7.732-1.582z"
                      fill="currentColor"
                    />
                  </svg>
                </template>
              </div>

              <div class="text-sm font-medium text-text">
                <span class="mr-2">{{ avgRating.toFixed(1) }}</span>
                <span class="text-muted">· {{ reviews.length }} 条评价</span>
              </div>
            </div>

            <div class="text-right">
              <div class="text-lg font-bold text-primary">
                ¥{{ detail.price }}
              </div>
              <div class="text-xs text-muted">/ {{ detail.unit }}</div>
            </div>
          </div>

          <p class="mt-4 text-sm text-muted">{{ detail.shortDesc }}</p>

          <div class="mt-5 flex flex-wrap gap-3">
            <button
              class="px-4 py-2 rounded-lg bg-primary text-white text-sm shadow"
              @click="onBuy"
            >
              立即购买
            </button>
            <button
              class="px-4 py-2 rounded-lg border border-borderColor text-text text-sm"
              @click="onAddCart"
            >
              加入购物车
            </button>
          </div>

          <!-- 关键信息 / 规格（放在富文本上方，便于快速查看） -->
          <div class="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div class="text-sm">
              <div class="text-xs text-muted">重量</div>
              <div class="font-medium text-text">约 0.8kg</div>
            </div>
            <div class="text-sm">
              <div class="text-xs text-muted">包装</div>
              <div class="font-medium text-text">礼盒 + 填充物</div>
            </div>
            <div class="text-sm">
              <div class="text-xs text-muted">保鲜</div>
              <div class="font-medium text-text">避免直射阳光</div>
            </div>
            <div class="text-sm">
              <div class="text-xs text-muted">配送</div>
              <div class="font-medium text-text">次日达（部分地区）</div>
            </div>
          </div>
        </div>

        <!-- 右侧卖家卡（单独列） -->
        <aside class="bg-surface rounded-xl p-4 shadow-soft-lg">
          <div class="flex items-center gap-3">
            <img
              :src="seller.avatar"
              alt="seller"
              class="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <div class="font-semibold text-text">{{ seller.name }}</div>
              <div class="text-xs text-muted">
                店铺评分 · {{ seller.rating.toFixed(1) }}
              </div>
            </div>
          </div>

          <ul class="mt-4 text-sm text-muted space-y-2">
            <li>
              发货地：<span class="text-text">{{ seller.location }}</span>
            </li>
            <li>
              累计销量：<span class="text-text">{{ seller.sales }}</span>
            </li>
            <li>
              包邮：<span class="text-text">{{
                seller.freeShipping ? "是" : "否"
              }}</span>
            </li>
          </ul>

          <ProductStats
            :rating="sales.rating"
            :review="sales.reviewCount"
            :sales="sales.saleCount"
            class="mt-4"
          />
        </aside>
      </section>

      <section class="bg-page/50 rounded-xl p-4 md:p-6">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-text">商品详情</h2>
          <button class="text-sm text-primary" @click="expanded = !expanded">
            {{ expanded ? "收起" : "展开更多" }}
          </button>
        </div>

        <transition name="fade">
          <div v-show="expanded" class="mt-4 prose max-w-full text-text">
            <div v-html="sanitizedHtml"></div>
          </div>
        </transition>
      </section>

      <section>
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-semibold text-text">用户评价</h3>
          <div class="text-sm text-muted">
            {{ reviews.length }} 条评价 · 平均 {{ avgRating.toFixed(1) }}
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ReviewCard
            v-for="r in pagedReviews"
            :key="r.id"
            :content="r.content"
            :rating="r.rating"
            :user="r.user"
            :date="r.reviewTime"
            :anonymous="r.anonymous"
          />
        </div>

        <div class="mt-4 flex justify-center">
          <button
            v-if="hasMore"
            class="px-4 py-2 rounded-lg border border-borderColor"
            @click="loadMoreReviews"
          >
            加载更多
          </button>
          <div v-else class="text-sm text-muted">没有更多评价了</div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import ProductStats from "~/assets/base-ui/ProductStats.vue";
import ReviewCard from "~/components/ReviewCard.vue";
import type { ReviewItem } from "~/types/api/review";
interface IProps {
  sales: {
    rating: number | string;
    reviewCount: string | number;
    saleCount: number | string;
  };
  reviewData: {
    list: ReviewItem[];
    total: number;
  };
}
const { sales, reviewData } = defineProps<IProps>();

const { $dompurify } = useNuxtApp();

const detail = ref({
  id: 101,
  title: "粉色永生花礼盒 · 暖心之选",
  price: 198,
  unit: "套",
  shortDesc: "精选粉玫瑰搭配干燥绣球，礼盒包装，适合送礼与家居装饰。",
  descriptionHtml: `
    <h2>产品介绍</h2>
    <p>这是一款适合各种节日的精美礼盒，包含：</p>
    <ul>
      <li>新鲜玫瑰 x 7</li>
      <li>干燥绣球 x 2</li>
      <li>高档礼盒包装 + 贺卡</li>
    </ul>
    <p>避免阳光直射，保持干燥，空气流通可延长保鲜时间。</p>
  `,
});

const seller = ref({
  name: "花间小筑",
  avatar: "https://i.pravatar.cc/80?img=12",
  location: "深圳",
  rating: 4.8,
  sales: 6523,
  freeShipping: true,
});

//评论列表
const reviews = ref(reviewData.list);

/* UI 状态 */
const expanded = ref(false);

const page = ref(1);
const perPage = 4;

const avgRating = computed(() => {
  if (!reviews.value.length) return 0;
  return reviews.value.reduce((s, r) => s + r.rating, 0) / reviews.value.length;
});

const filteredReviews = computed(() => {
  // 目前不做筛选，保留扩展点
  return reviewData.list;
});

const pagedReviews = computed(() =>
  filteredReviews.value.slice(0, page.value * perPage)
);

const hasMore = computed(
  () => filteredReviews.value.length > pagedReviews.value.length
);

function loadMoreReviews() {
  page.value++;
}
function onBuy() {
  /* 跳转下单逻辑 */ alert("去下单（示例）");
}
function onAddCart() {
  alert("加入购物车（示例）");
}

const sanitizedHtml = computed(() =>
  $dompurify.sanitize(detail.value.descriptionHtml)
);
</script>

<style scoped>
/* 轻微过渡 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.24s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.shadow-soft-lg {
  box-shadow: 0 8px 30px rgba(15, 23, 36, 0.12);
}
</style>
