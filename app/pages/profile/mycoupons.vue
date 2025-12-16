<template>
  <div class="max-w-5xl mx-auto px-6 py-10 theme-pink">
    <h1 class="text-2xl font-semibold text-text mb-6">我的优惠券</h1>

    <!-- Tabs -->
    <div class="flex border-b border-borderColor mb-6">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        @click="activeTab = tab.value"
        :class="[
          'px-4 py-2 font-medium',
          activeTab === tab.value
            ? 'border-b-2 border-primary text-primary'
            : 'text-muted',
        ]"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Coupon List -->
    <div v-if="loading" class="text-center text-muted">加载中...</div>
    <div v-else>
      <div v-if="filteredCoupons.length">
        <div
          v-for="coupon in filteredCoupons"
          :key="coupon.id"
          class="coupon-card grid grid-cols-160px-1fr-140px gap-4 p-4 mb-4 rounded-lg border border-borderColor bg-surface"
        >
          <div class="coupon-left text-center">
            <div class="text-2xl font-bold text-primary">
              {{ coupon.type === 0 ? "¥" + coupon.value : coupon.value + "折" }}
            </div>
            <div class="text-xs text-muted mt-1">
              满 {{ coupon.minPrice }} 可用
            </div>
          </div>

          <div class="coupon-center">
            <div class="font-semibold text-text">{{ coupon.name }}</div>
            <div class="text-xs text-muted mt-1">有效期: {{ coupon.time }}</div>
            <div class="text-xs text-muted mt-1">
              适用范围: {{ coupon.scope }}
            </div>
          </div>

          <div class="coupon-right flex flex-col justify-center items-center">
            <v-btn
              class="px-3 py-1 rounded-full bg-primary text-white text-sm"
              to="/"
            >
              去使用
            </v-btn>
          </div>
        </div>
      </div>
      <div v-else class="text-center text-muted mt-10">暂无优惠券</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { CouponItem } from "~/types/api/coupon";
import { useUserStore } from "~/stores/user";

definePageMeta({ layout: "profile" });

const { $api } = useNuxtApp();

const tabs = [
  { label: "未使用", value: "available" },
  { label: "已过期", value: "expired" },
];

const activeTab = ref("available");
// 用户已领取的优惠券
const coupons = ref<CouponItem[]>([]);
const expiredCoupons = ref<CouponItem[]>([]);
const loading = ref(false);

const filteredCoupons = computed(() => {
  return activeTab.value === "available" ? coupons.value : expiredCoupons.value;
});

async function loadCoupons() {
  loading.value = true;
  try {
    const res = await $api.coupon.getUserCouponList();
    coupons.value = res.list.map((c) => ({ ...c }));
    expiredCoupons.value = res.expired.map((c) => ({ ...c }));
  } catch (err) {
    $toast.error("加载失败，请重新尝试");
  } finally {
    loading.value = false;
  }
}

function receiveCoupon(c: CouponItem) {
  if (c.received || c.stock === 0) return;
  c.received = true;
  c.stock--;
}

onMounted(() => {
  loadCoupons();
});
</script>

<style scoped>
.coupon-card {
  grid-template-columns: 160px 1fr 140px;
}
</style>
