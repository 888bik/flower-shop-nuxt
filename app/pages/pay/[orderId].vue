<template>
  <div class="min-h-screen bg-page flex items-center justify-center px-4">
    <div class="w-full max-w-md bg-surface rounded-xl border p-6">
      <div>
        <h1 class="text-xl font-semibold mb-4 text-center">订单支付</h1>
      </div>

      <!-- 订单信息 -->
      <div v-if="order" class="space-y-2 mb-6 text-sm">
        <div class="flex justify-between">
          <span class="text-muted">订单号</span>
          <span>{{ order.orderNo }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-muted">订单金额</span>
          <span class="text-primary font-semibold">
            ¥{{ formatPrice(order.totalPrice) }}
          </span>
        </div>
        <div class="flex justify-between">
          <span class="text-muted">订单状态</span>
          <span>{{ orderStatusText(order.payStatus) }}</span>
        </div>
      </div>

      <!-- 支付方式 -->
      <div class="space-y-3 mb-6">
        <div class="text-sm text-muted">选择支付方式</div>

        <button
          v-for="m in payMethods"
          :key="m.value"
          @click="pay(m.value)"
          :disabled="paying || order?.payStatus !== 'unpaid'"
          class="w-full py-3 rounded-lg border flex items-center justify-center gap-2"
          :class="[paying ? 'opacity-50' : '', 'hover:border-primary']"
        >
          <span>{{ m.label }}</span>
        </button>
      </div>

      <!-- 提示 -->
      <div v-if="paying" class="text-center text-sm text-muted">
        支付处理中，请稍候…
      </div>

      <div v-if="error" class="text-center text-sm text-red-500 mt-3">
        {{ error }}
      </div>

      <!-- 返回 -->
      <div class="mt-6 text-center">
        <NuxtLink
          :to="`/orders/${orderId}`"
          class="text-sm text-muted hover:text-primary"
        >
          返回订单详情
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { OrderDetailResponse } from "~/types/api/orders";

definePageMeta({ layout: "empty", requiresAuth: true });

const route = useRoute();
const router = useRouter();
const { $api } = useNuxtApp();

const orderId = Number(route.params.orderId);

const order = ref<OrderDetailResponse>();
const paying = ref(false);
const error = ref<string | null>(null);

const payMethods = [
  { value: "WECHAT" as "WECHAT", label: "微信支付（模拟）" },
  { value: "ALIPAY" as "ALIPAY", label: "支付宝支付（模拟）" },
];

// 加载订单
async function loadOrder() {
  try {
    order.value = await $api.orders.getOrderDetail(orderId);
  } catch (e) {
    $toast.error("订单不存在");
    router.replace("/orders");
  }
}

// 支付
async function pay(method: "WECHAT" | "ALIPAY") {
  if (!order.value) return;

  paying.value = true;
  error.value = null;

  try {
    await $api.orders.payOrder(orderId, method);

    $toast.success("支付成功");
    router.replace(`/orders/${orderId}`);
  } catch (e: any) {
    $toast.error("支付失败，请稍后重试");
  } finally {
    paying.value = false;
  }
}

function formatPrice(v: any) {
  const n = Number(v ?? 0);
  return n.toFixed(2);
}

function orderStatusText(status: string) {
  switch (status) {
    case "unpaid":
      return "待支付";
    case "paid":
      return "已支付";
    default:
      return status;
  }
}

onMounted(loadOrder);
</script>

<style scoped>
.bg-page {
  background-color: var(--c-bg);
}
.bg-surface {
  background-color: var(--c-surface);
}
.text-muted {
  color: var(--c-muted);
}
.text-primary {
  color: var(--c-primary);
}
.border {
  border-color: var(--c-border);
}
</style>
