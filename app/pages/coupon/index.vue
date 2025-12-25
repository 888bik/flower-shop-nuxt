<template>
  <div class="coupon-page">
    <section class="coupon-header">
      <h1 class="title">领券中心</h1>
      <p class="desc">先领券，再下单，最高立减 ¥100</p>
    </section>

    <section class="coupon-list">
      <v-empty-state
        v-if="!loading && coupons.length === 0"
        icon="mdi-ticket-outline"
      >
        <template #title>
          <span class="text-[#2d2d2d]"> 暂无优惠券 </span>
        </template>

        <template #text>
          <span class="text-[#8b8b8b]"> 先去逛逛商品吧 </span>
        </template>
        <template #actions>
          <v-btn color="primary" variant="tonal" to="/"> 去逛逛商品 </v-btn>
        </template>
      </v-empty-state>

      <template v-else>
        <div
          v-for="coupon in coupons"
          :key="coupon.id"
          class="coupon-card"
          :class="{ disabled: coupon.received || coupon.stock === 0 }"
        >
          <!-- Left -->
          <div class="coupon-left">
            <div class="price">
              <span class="unit">¥</span>
              <span class="num">
                {{
                  coupon.type === 0 ? coupon.value : coupon.value * 10 + "折"
                }}
              </span>
            </div>
            <div class="limit">满 {{ coupon.minPrice }} 可用</div>
          </div>

          <div class="coupon-center">
            <div class="name">{{ coupon.name }}</div>
            <div class="time">有效期：{{ coupon.time }}</div>
            <div class="scope">{{ coupon.scope }}</div>
          </div>

          <div class="coupon-right">
            <button
              class="receive-btn"
              :disabled="coupon.received || coupon.stock === 0"
              @click="receiveCoupon(coupon)"
            >
              {{
                coupon.received
                  ? "已领取"
                  : coupon.stock === 0
                  ? "已抢光"
                  : "立即领取"
              }}
            </button>
          </div>
        </div>
      </template>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { CouponItem } from "~/types/api/coupon";

interface Coupon {
  id: number;
  name: string;
  value: number;
  minPrice: number;
  time: string;
  scope: string;
  stock: number;
  received: boolean;
}

const { $api } = useNuxtApp();
const authStore = useAuthStore();

const coupons = ref<CouponItem[]>([]);
const loading = ref(false);

async function receiveCoupon(coupon: Coupon) {
  if (!authStore.isLogin) {
    return $toast.success("请先登录");
  }
  if (coupon.received || coupon.stock === 0) return;
  coupon.received = true;
  try {
    $api.coupon.receiveCoupon(coupon.id);
    // 领取成功后重新刷新列表
    const res = await $api.coupon.getAllCouponList();
    coupons.value = res.list;
  } catch (error: any) {
    $toast.error("领取失败：" + (error.message || ""));
  }
}

onMounted(async () => {
  loading.value = true;
  try {
    const res = await $api.coupon.getAllCouponList();
    coupons.value = res.list;
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
/* page */
.coupon-page {
  background: var(--c-bg);
  min-height: 100vh;
  padding-bottom: 48px;
}

/* header */
.coupon-header {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 16px 24px;
}
.title {
  font-size: 28px;
  font-weight: 700;
  color: var(--c-text);
}
.desc {
  margin-top: 6px;
  color: var(--c-muted);
  font-size: 14px;
}

/* list */
.coupon-list {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 16px;
  display: grid;
  gap: 16px;
}

/* card */
.coupon-card {
  display: grid;
  grid-template-columns: 160px 1fr 140px;
  align-items: center;
  background: var(--c-surface);
  border-radius: 14px;
  border: 1px solid var(--c-border);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}
.coupon-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.06);
}

/* disabled */
.coupon-card.disabled {
  opacity: 0.6;
}

/* left */
.coupon-left {
  background: linear-gradient(135deg, #ffd1e1, #fff0f5);
  height: 100%;
  padding: 20px;
  text-align: center;
}
.price {
  color: var(--c-primary);
  font-weight: 700;
}
.unit {
  font-size: 18px;
}
.num {
  font-size: 36px;
}
.limit {
  margin-top: 4px;
  font-size: 12px;
  color: #7b6f76;
}

/* center */
.coupon-center {
  padding: 20px;
}
.name {
  font-size: 16px;
  font-weight: 600;
  color: var(--c-text);
}
.time,
.scope {
  margin-top: 6px;
  font-size: 13px;
  color: var(--c-muted);
}

/* right */
.coupon-right {
  padding: 20px;
  text-align: center;
}
.receive-btn {
  width: 100%;
  padding: 10px 0;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  background: var(--c-primary);
  color: #fff;
  transition: background 0.15s;
}
.receive-btn:hover {
  background: #ff5a93;
}
.receive-btn:disabled {
  background: #ddd;
  color: #999;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .coupon-card {
    grid-template-columns: 1fr;
  }
  .coupon-left {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
